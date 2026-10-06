import type { Address, CartLine, CheckoutSource, Order } from "@/domain/types";

/** Shapes persisted by the mock adapters (arch §8). */

/** Phase 1 mock only: the password is stored as entered (requirements §5.3). */
export type StoredUser = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
  createdAt: string;
};

export type SessionRecord = { userId: string; createdAt: string };

export type CartRecord = { guest: CartLine[]; byUser: Record<string, CartLine[]> };

export type WishlistRecord = Record<string, string[]>;

export type AddressRecord = Record<string, Address[]>;

export type OrdersRecord = Order[];

export type CheckoutSessionRecord = Record<
  string,
  { source: CheckoutSource; buyNow?: { variantId: string; quantity: number } }
>;
