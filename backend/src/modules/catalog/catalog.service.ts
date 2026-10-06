import { Injectable } from "@nestjs/common";
import type { PurchasableProduct } from "@nivora/shared/contracts";
import { PAGE_SIZE } from "@nivora/shared/config/constants";
import { COLLECTIONS } from "@nivora/shared/data/collections";
import { queryCatalog } from "@nivora/shared/domain/filters";
import type {
  CollectionId,
  Product,
  ProductListResult,
  ProductQuery,
  ProductSummary,
} from "@nivora/shared/domain/types";
import { ApiError } from "@nivora/shared/errors";
import { PrismaService } from "../../prisma/prisma.service.js";
import { CatalogIndex } from "./catalog-index.service.js";

/**
 * Catalog reads (barch §10): the shared pipeline over the in-memory index with live stock from
 * the database. In API responses a variant's `initialStock` is its CURRENT stock, so shared
 * stock rules work unchanged with no adjustments.
 */
@Injectable()
export class CatalogService {
  constructor(
    private readonly index: CatalogIndex,
    private readonly prisma: PrismaService,
  ) {}

  getCategories() {
    return this.index.categories;
  }

  getAllProductSlugs(): string[] {
    return this.index.products.map((p) => p.slug);
  }

  async listProducts(query: ProductQuery): Promise<ProductListResult> {
    return queryCatalog(await this.liveProducts(), query, this.index.taxonomy, PAGE_SIZE);
  }

  async getCollection(id: string, limit: number | undefined): Promise<ProductSummary[]> {
    const collection = COLLECTIONS.find((item) => item.id === id);
    if (!collection) throw new ApiError("NOT_FOUND");
    const products = await this.liveProducts();
    const query: ProductQuery = {
      collection: id as CollectionId,
      sort: collection.defaultSort,
      page: 1,
    };
    return queryCatalog(products, query, this.index.taxonomy, limit ?? products.length).items;
  }

  async getProduct(slug: string): Promise<PurchasableProduct> {
    const product = this.index.findBySlug(slug);
    if (!product) throw new ApiError("NOT_FOUND", { entity: "product" });
    const rows = await this.prisma.variant.findMany({
      where: { productId: product.id },
      select: { id: true, stock: true },
    });
    const stock = new Map(rows.map((row) => [row.id, row.stock]));
    const live = withStock(product, stock);
    return {
      ...live,
      available: Object.fromEntries(live.variants.map((v) => [v.id, v.initialStock])),
    };
  }

  /** Every product with its variants' current stock (one query, ~350 rows). */
  private async liveProducts(): Promise<Product[]> {
    const rows = await this.prisma.variant.findMany({ select: { id: true, stock: true } });
    const stock = new Map(rows.map((row) => [row.id, row.stock]));
    return this.index.products.map((product) => withStock(product, stock));
  }
}

function withStock(product: Product, stock: Map<string, number>): Product {
  return {
    ...product,
    variants: product.variants.map((v) => ({ ...v, initialStock: stock.get(v.id) ?? 0 })),
  };
}
