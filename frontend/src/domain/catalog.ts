import { discountPercent, listingVariant } from "./pricing";
import { isVariantInStock } from "./stock";
import type {
  Category,
  Product,
  ProductSummary,
  StockAdjustments,
  Subcategory,
  Variant,
} from "./types";

/** Card data for a product, using the stock the caller knows about (arch §3.1). */
export function toProductSummary(product: Product, adjustments?: StockAdjustments): ProductSummary {
  const inStock = (variant: Variant) => isVariantInStock(variant, adjustments);
  const listing = listingVariant(product, inStock);
  const prices = new Set(product.variants.map((variant) => variant.price));
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand,
    categoryId: product.categoryId,
    subcategoryId: product.subcategoryId,
    image: product.images[0] ?? "",
    rating: product.rating,
    reviewCount: product.reviewCount,
    price: listing.price,
    originalPrice: listing.originalPrice,
    discountPercent: discountPercent(listing.price, listing.originalPrice),
    hasPriceRange: prices.size > 1,
    inStock: product.variants.some(inStock),
    requiresOptions: product.variants.length > 1,
    singleVariantId: product.variants.length === 1 ? product.variants[0].id : null,
    variantIds: product.variants.map((variant) => variant.id),
    initialStock: Object.fromEntries(
      product.variants.map((variant) => [variant.id, variant.initialStock]),
    ),
    isBestSeller: product.isBestSeller,
    isNewArrival: product.isNewArrival,
    createdAt: product.createdAt,
  };
}

/** The variant matching a full option selection, if it exists. */
export function findVariant(
  product: Product,
  selection: Record<string, string>,
): Variant | undefined {
  return product.variants.find((variant) =>
    product.options.every((option) => variant.optionValues[option.name] === selection[option.name]),
  );
}

/** "Black / L" style label for selected options; empty for products without options. */
export function formatOptions(optionValues: Record<string, string>): string {
  return Object.values(optionValues).join(" / ");
}

/** Lookup helpers over the fixed taxonomy. */
export function createTaxonomy(categories: Category[]) {
  const subcategories = new Map<string, Subcategory>(
    categories.flatMap((category) => category.subcategories.map((sub) => [sub.id, sub])),
  );
  const byId = new Map(categories.map((category) => [category.id, category]));
  return {
    categories,
    category: (id: string) => byId.get(id as Category["id"]),
    subcategory: (id: string) => subcategories.get(id),
    names: (product: Pick<Product, "categoryId" | "subcategoryId">) => ({
      categoryName: byId.get(product.categoryId)?.name ?? "",
      subcategoryName: subcategories.get(product.subcategoryId)?.name ?? "",
    }),
  };
}

export type Taxonomy = ReturnType<typeof createTaxonomy>;
