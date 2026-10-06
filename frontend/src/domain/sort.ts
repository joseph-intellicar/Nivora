import type { ProductSummary, SortOption } from "./types";

export const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Rating" },
  { value: "newest", label: "Newest" },
  { value: "discount", label: "Discount" },
];

export type Ranked = { summary: ProductSummary; score: number };

const byName = (a: Ranked, b: Ranked) => a.summary.name.localeCompare(b.summary.name);

/** Default ordering when nothing else decides: best sellers, then rating, then popularity. */
function popularity(a: Ranked, b: Ranked): number {
  return (
    Number(b.summary.isBestSeller) - Number(a.summary.isBestSeller) ||
    b.summary.rating - a.summary.rating ||
    b.summary.reviewCount - a.summary.reviewCount ||
    byName(a, b)
  );
}

/**
 * Comparators for the six sort options (requirements §12.3, arch §13.4).
 * Under Relevance, out-of-stock products always come last and search score ranks first.
 */
export function compareProducts(sort: SortOption): (a: Ranked, b: Ranked) => number {
  switch (sort) {
    case "price-asc":
      return (a, b) => a.summary.price - b.summary.price || byName(a, b);
    case "price-desc":
      return (a, b) => b.summary.price - a.summary.price || byName(a, b);
    case "rating":
      return (a, b) =>
        b.summary.rating - a.summary.rating ||
        b.summary.reviewCount - a.summary.reviewCount ||
        byName(a, b);
    case "newest":
      return (a, b) => b.summary.createdAt.localeCompare(a.summary.createdAt) || byName(a, b);
    case "discount":
      return (a, b) =>
        b.summary.discountPercent - a.summary.discountPercent ||
        a.summary.price - b.summary.price ||
        byName(a, b);
    case "relevance":
    default:
      return (a, b) =>
        Number(b.summary.inStock) - Number(a.summary.inStock) ||
        b.score - a.score ||
        popularity(a, b);
  }
}
