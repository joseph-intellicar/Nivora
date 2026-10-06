import { SEED_ORDER_COUNTER, SEED_ORDERS } from "@nivora/shared/data/seedOrders";
import { TEST_USER } from "@nivora/shared/data/seedUsers";
import type { OrdersRecord, StoredUser } from "./records";
import { isArray, isNumber, KEYS, read, write } from "./storage";

/** Bump when seed data changes so existing browsers receive it once. */
export const SEED_VERSION = 1;

/**
 * Seeds the test user and their sample orders once per seed version (requirements §7.1,
 * §25.5). Idempotent, and never creates a session: nobody is logged in automatically.
 */
export function ensureSeeded(): void {
  if (typeof window === "undefined") return;
  if (read<number>(KEYS.seedVersion, 0, isNumber) >= SEED_VERSION) return;

  const users = read<StoredUser[]>(KEYS.users, [], isArray);
  if (!users.some((user) => user.email.toLowerCase() === TEST_USER.email)) {
    users.push({ ...TEST_USER, createdAt: "2025-06-01T00:00:00.000Z" });
    write(KEYS.users, users);
  }

  const orders = read<OrdersRecord>(KEYS.orders, [], isArray);
  const missing = SEED_ORDERS.filter(
    (seed) => !orders.some((order) => order.orderId === seed.orderId),
  );
  if (missing.length > 0) write(KEYS.orders, [...orders, ...structuredClone(missing)]);

  const counter = read<number>(KEYS.orderCounter, 0, isNumber);
  if (counter < SEED_ORDER_COUNTER) write(KEYS.orderCounter, SEED_ORDER_COUNTER);

  write(KEYS.seedVersion, SEED_VERSION);
}
