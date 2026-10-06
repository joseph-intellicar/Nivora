import type { Collection } from "@/domain/types";

/**
 * Collections are predefined filters over the catalog, not categories (requirements §9.1).
 * Membership rules live in domain/filters.ts (matchesCollection).
 * "Under ₹999", "On Sale" and "Best Rated" are reached through the price, discount and
 * rating filters on any listing (decision D1).
 */
export const COLLECTIONS: Collection[] = [
  {
    id: "best-sellers",
    slug: "best-sellers",
    name: "Best Sellers",
    description: "The products Nivora customers love most.",
    defaultSort: "relevance",
  },
  {
    id: "special-offers",
    slug: "special-offers",
    name: "Special Offers",
    description: "Great prices on discounted products across every category.",
    defaultSort: "discount",
  },
  {
    id: "new-arrivals",
    slug: "new-arrivals",
    name: "New Arrivals",
    description: "Fresh additions to Nivora, newest first.",
    defaultSort: "newest",
  },
];
