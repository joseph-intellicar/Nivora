import { ApiError } from "@nivora/shared/errors";

/*
 * The ONLY module that touches browser storage (requirements §5.1, arch §8).
 * - Keys are namespaced and versioned: "nivora:v1:<key>".
 * - Safe on the server (no window): reads return fallbacks, nothing is written.
 * - Corrupt or unexpected data falls back to the default instead of crashing.
 * - If localStorage is unavailable (blocked, private mode), an in-memory store is used.
 */

const PREFIX = "nivora:v1:";

export const KEYS = {
  users: "users",
  authSession: "auth_session",
  cart: "cart",
  wishlist: "wishlist",
  addresses: "addresses",
  orders: "orders",
  orderCounter: "order_counter",
  inventory: "inventory",
  checkoutSession: "checkout_session",
  seedVersion: "seed_version",
} as const;

export type StorageKey = (typeof KEYS)[keyof typeof KEYS];

type KeyValueStore = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const memory = new Map<string, string>();
const memoryStore: KeyValueStore = {
  getItem: (key) => memory.get(key) ?? null,
  setItem: (key, value) => void memory.set(key, value),
  removeItem: (key) => void memory.delete(key),
};

function store(): KeyValueStore | null {
  if (typeof window === "undefined") return null;
  try {
    const local = window.localStorage;
    const probe = `${PREFIX}__probe__`;
    local.setItem(probe, "1");
    local.removeItem(probe);
    return local;
  } catch {
    return memoryStore;
  }
}

/** Reads a value; returns `fallback` when missing, unreadable or rejected by `isValid`. */
export function read<T>(key: StorageKey, fallback: T, isValid?: (value: unknown) => boolean): T {
  const target = store();
  if (!target) return fallback;
  try {
    const raw = target.getItem(PREFIX + key);
    if (raw === null) return fallback;
    const value: unknown = JSON.parse(raw);
    if (isValid && !isValid(value)) return fallback;
    return value as T;
  } catch {
    return fallback;
  }
}

export function write<T>(key: StorageKey, value: T): void {
  const target = store();
  if (!target) throw new ApiError("UNKNOWN");
  try {
    target.setItem(PREFIX + key, JSON.stringify(value));
  } catch {
    // Quota exceeded or storage blocked mid-session.
    throw new ApiError("UNKNOWN");
  }
}

export function remove(key: StorageKey): void {
  try {
    store()?.removeItem(PREFIX + key);
  } catch {
    // Nothing to clean up.
  }
}

// Shape guards for stored values.
export const isArray = (value: unknown): boolean => Array.isArray(value);
export const isRecord = (value: unknown): boolean =>
  typeof value === "object" && value !== null && !Array.isArray(value);
export const isNumber = (value: unknown): boolean =>
  typeof value === "number" && Number.isFinite(value);
