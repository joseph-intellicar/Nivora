import { PRODUCTS } from "../data/products";
import type { Product } from "../domain/types";

/** Look up a seed product by slug; fails the test loudly if the catalog changed. */
export function product(slug: string): Product {
  const found = PRODUCTS.find((item) => item.slug === slug);
  if (!found) throw new Error(`Seed product not found: ${slug}`);
  return found;
}
