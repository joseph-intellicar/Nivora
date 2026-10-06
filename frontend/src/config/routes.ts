/**
 * Path builders (docs/architecture.md §9.1). Components never hand-write paths.
 */

import type { InfoPageSlug } from "@nivora/shared/config/infoPages";

/** Only internal paths are allowed as post-login destinations (no open redirects). */
export function isSafeInternalPath(value: string | null | undefined): value is string {
  return (
    typeof value === "string" &&
    value.startsWith("/") &&
    !value.startsWith("//") &&
    // Browsers treat "/\" like "//"; control characters can also smuggle hosts.
    !value.includes("\\") &&
    !/[\u0000-\u001f]/.test(value)
  );
}

function withFrom(base: string, from?: string): string {
  return isSafeInternalPath(from) ? `${base}?from=${encodeURIComponent(from)}` : base;
}

export const paths = {
  home: () => "/",
  category: (categorySlug: string) => `/c/${categorySlug}`,
  subcategory: (categorySlug: string, subcategorySlug: string) =>
    `/c/${categorySlug}/${subcategorySlug}`,
  collection: (collectionSlug: string) => `/collections/${collectionSlug}`,
  search: (query?: string) => (query ? `/search?q=${encodeURIComponent(query)}` : "/search"),
  product: (productSlug: string) => `/p/${productSlug}`,
  cart: () => "/cart",
  wishlist: () => "/wishlist",
  login: (from?: string) => withFrom("/login", from),
  signup: (from?: string) => withFrom("/signup", from),
  checkout: () => "/checkout",
  orderConfirmation: (orderId: string) => `/order-confirmation/${encodeURIComponent(orderId)}`,
  account: () => "/account",
  orders: () => "/account/orders",
  order: (orderId: string) => `/account/orders/${encodeURIComponent(orderId)}`,
  addresses: () => "/account/addresses",
  info: (slug: InfoPageSlug) => `/${slug}`,
} as const;
