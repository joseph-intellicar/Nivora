import type { CartLine } from "@nivora/shared/domain/types";
import type { CartRecord } from "./records";
import { isRecord, KEYS, read, write } from "./storage";

const EMPTY: CartRecord = { guest: [], byUser: {} };

function readCart(): CartRecord {
  const record = read<CartRecord>(KEYS.cart, EMPTY, isRecord);
  return {
    guest: Array.isArray(record.guest) ? record.guest : [],
    byUser: isRecord(record.byUser) ? record.byUser : {},
  };
}

/** Lines for a user, or the guest cart when userId is null (requirements §17.5). */
export function readLines(userId: string | null): CartLine[] {
  const cart = readCart();
  const lines = userId ? cart.byUser[userId] : cart.guest;
  return Array.isArray(lines) ? lines : [];
}

export function writeLines(userId: string | null, lines: CartLine[]): void {
  const cart = readCart();
  if (userId) cart.byUser[userId] = lines;
  else cart.guest = lines;
  write(KEYS.cart, cart);
}
