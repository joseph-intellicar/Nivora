import { addLine, checkQuantity, quantityInCart } from "@/domain/cart";
import { toProductSummary } from "@/domain/catalog";
import type { WishlistApi } from "../../contracts";
import { ApiError } from "../../errors";
import { readLines, writeLines } from "./cartStore";
import { loadCatalog } from "./catalogData";
import { available, readAdjustments } from "./inventory";
import { request } from "./latency";
import type { WishlistRecord } from "./records";
import { requireUser } from "./session";
import { isRecord, KEYS, read, write } from "./storage";

function readIds(userId: string): string[] {
  const ids = read<WishlistRecord>(KEYS.wishlist, {}, isRecord)[userId];
  return Array.isArray(ids) ? ids : [];
}

function writeIds(userId: string, ids: string[]): void {
  const record = read<WishlistRecord>(KEYS.wishlist, {}, isRecord);
  record[userId] = ids;
  write(KEYS.wishlist, record);
}

/** Wishlist requires login, is per user and never holds duplicates (requirements §18). */
export const mockWishlist: WishlistApi = {
  getWishlist: () =>
    request(async () => {
      const user = requireUser();
      const { byId } = await loadCatalog();
      const adjustments = readAdjustments();
      const ids = readIds(user.id);
      const existing = ids.filter((id) => byId.has(id));
      if (existing.length !== ids.length) writeIds(user.id, existing);
      return existing.map((id) => toProductSummary(byId.get(id)!, adjustments));
    }),

  add: (productId) =>
    request(async () => {
      const user = requireUser();
      if (!(await loadCatalog()).byId.has(productId))
        throw new ApiError("NOT_FOUND", { entity: "product" });
      const ids = readIds(user.id);
      if (!ids.includes(productId)) writeIds(user.id, [...ids, productId]);
    }),

  remove: (productId) =>
    request(() => {
      const user = requireUser();
      writeIds(
        user.id,
        readIds(user.id).filter((id) => id !== productId),
      );
    }),

  moveToCart: ({ productId, variantId }) =>
    request(async () => {
      const user = requireUser();
      const entry = (await loadCatalog()).variants.get(variantId);
      if (!entry || entry.product.id !== productId) throw new ApiError("INVALID_VARIANT");
      const lines = readLines(user.id);
      const check = checkQuantity(1, quantityInCart(lines, variantId), available(entry.variant));
      if (!check.ok) {
        throw check.reason === "INSUFFICIENT_STOCK"
          ? new ApiError("INSUFFICIENT_STOCK", {
              productName: entry.product.name,
              available: check.available,
            })
          : new ApiError(check.reason, { productName: entry.product.name });
      }
      writeLines(user.id, addLine(lines, { variantId, productId, quantity: 1 }));
      writeIds(
        user.id,
        readIds(user.id).filter((id) => id !== productId),
      );
    }),
};
