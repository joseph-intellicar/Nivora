import type { Product, Variant } from "@nivora/shared/domain/types";

export type CatalogIndex = {
  products: Product[];
  byId: Map<string, Product>;
  bySlug: Map<string, Product>;
  variants: Map<string, { product: Product; variant: Variant }>;
};

let cached: Promise<CatalogIndex> | null = null;

/**
 * Product data for browser-side adapters, loaded on first use with a dynamic import so it is
 * not part of the initial bundle (arch §19). Same data the server catalog reads.
 */
export function loadCatalog(): Promise<CatalogIndex> {
  cached ??= import("@nivora/shared/data/products").then(({ PRODUCTS }) => ({
    products: PRODUCTS,
    byId: new Map(PRODUCTS.map((product) => [product.id, product])),
    bySlug: new Map(PRODUCTS.map((product) => [product.slug, product])),
    variants: new Map(
      PRODUCTS.flatMap((product) =>
        product.variants.map((variant) => [variant.id, { product, variant }] as const),
      ),
    ),
  }));
  return cached;
}
