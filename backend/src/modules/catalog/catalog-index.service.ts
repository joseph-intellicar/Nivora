import { Injectable, Logger, type OnModuleInit } from "@nestjs/common";
import { createTaxonomy } from "@nivora/shared/domain/catalog";
import type {
  Category,
  CategoryId,
  Product,
  ProductOption,
  Specification,
  Variant,
} from "@nivora/shared/domain/types";
import { PrismaService } from "../../prisma/prisma.service.js";

export type Taxonomy = ReturnType<typeof createTaxonomy>;

/**
 * In-memory catalog (barch §10): taxonomy and product data are loaded from the database once at
 * startup — 154 products, no admin editing yet — and queried with the shared pipeline. Stock is
 * NOT cached here; `CatalogService` reads it from the database on every request.
 */
@Injectable()
export class CatalogIndex implements OnModuleInit {
  private readonly logger = new Logger(CatalogIndex.name);
  categories: Category[] = [];
  taxonomy!: Taxonomy;
  /** Products in catalog order; `initialStock` holds the stock at load time only. */
  products: Product[] = [];
  private bySlug = new Map<string, Product>();
  private byId = new Map<string, Product>();
  private byVariant = new Map<string, { product: Product; variant: Variant }>();

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit(): Promise<void> {
    await this.load();
  }

  async load(): Promise<void> {
    const [categoryRows, productRows] = await Promise.all([
      this.prisma.category.findMany({
        orderBy: { position: "asc" },
        include: { subcategories: { orderBy: { position: "asc" } } },
      }),
      this.prisma.product.findMany({
        orderBy: { position: "asc" },
        include: {
          variants: { orderBy: { position: "asc" } },
          subcategory: { select: { categoryId: true } },
        },
      }),
    ]);

    this.categories = categoryRows.map((c) => ({
      id: c.id as CategoryId,
      slug: c.id as CategoryId,
      name: c.name,
      description: c.description,
      subcategories: c.subcategories.map((s) => ({
        id: s.id,
        categoryId: c.id as CategoryId,
        slug: s.slug,
        name: s.name,
      })),
    }));
    this.taxonomy = createTaxonomy(this.categories);

    this.products = productRows.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brand,
      categoryId: p.subcategory.categoryId as CategoryId,
      subcategoryId: p.subcategoryId,
      description: p.description,
      images: p.images,
      rating: Number(p.rating),
      reviewCount: p.reviewCount,
      specifications: p.specifications as Specification[],
      options: p.options as ProductOption[],
      variants: p.variants.map((v): Variant => ({
        id: v.id,
        optionValues: v.optionValues as Record<string, string>,
        price: v.price,
        originalPrice: v.originalPrice,
        initialStock: v.stock,
      })),
      attributes: p.attributes as Record<string, string | string[]>,
      tags: p.tags,
      isBestSeller: p.isBestSeller,
      isNewArrival: p.isNewArrival,
      createdAt: p.createdAt.toISOString(),
    }));
    this.bySlug = new Map(this.products.map((p) => [p.slug, p]));
    this.byId = new Map(this.products.map((p) => [p.id, p]));
    this.byVariant = new Map(
      this.products.flatMap((product) =>
        product.variants.map((variant) => [variant.id, { product, variant }] as const),
      ),
    );
    this.logger.log(
      `Catalog loaded: ${this.categories.length} categories, ${this.products.length} products`,
    );
  }

  findBySlug(slug: string): Product | undefined {
    return this.bySlug.get(slug);
  }

  findById(id: string): Product | undefined {
    return this.byId.get(id);
  }

  /** Catalog data for a variant (its `initialStock` is stale — read live stock separately). */
  findVariant(variantId: string): { product: Product; variant: Variant } | undefined {
    return this.byVariant.get(variantId);
  }
}
