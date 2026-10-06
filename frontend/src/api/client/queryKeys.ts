import type { DeliveryOption } from "@nivora/shared/domain/types";

/**
 * TanStack Query keys for browser-side data (arch §11.1). User-scoped keys include the user id
 * so data from one identity can never be shown to another; `userScoped` lists the roots to
 * clear on login, signup and logout.
 */
export const queryKeys = {
  session: () => ["session"] as const,
  inventory: () => ["inventory"] as const,
  product: (slug: string) => ["product", slug] as const,
  cart: (userId: string | null) => ["cart", userId ?? "guest"] as const,
  wishlist: (userId: string) => ["wishlist", userId] as const,
  addresses: (userId: string) => ["addresses", userId] as const,
  checkout: (userId: string, deliveryOption: DeliveryOption) =>
    ["checkout", userId, deliveryOption] as const,
  orders: (userId: string) => ["orders", userId] as const,
  order: (userId: string, orderId: string) => ["order", userId, orderId] as const,
  profile: (userId: string) => ["profile", userId] as const,
};

export const USER_SCOPED_ROOTS = [
  "cart",
  "wishlist",
  "addresses",
  "checkout",
  "orders",
  "order",
  "profile",
] as const;
