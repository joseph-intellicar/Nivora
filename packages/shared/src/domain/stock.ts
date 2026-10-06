import { LOW_STOCK_THRESHOLD } from "../config/constants";
import type { StockAdjustments, Variant } from "./types";

/** Initial stock plus adjustments from orders and cancellations (requirements §24.4). */
export function effectiveStock(variant: Variant, adjustments?: StockAdjustments): number {
  return Math.max(0, variant.initialStock + (adjustments?.[variant.id] ?? 0));
}

export function isVariantInStock(variant: Variant, adjustments?: StockAdjustments): boolean {
  return effectiveStock(variant, adjustments) > 0;
}

/** How many more units can be added when some are already in the cart (requirements §16.3). */
export function maxAddable(available: number, alreadyInCart: number): number {
  return Math.max(0, available - alreadyInCart);
}

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export function stockStatus(available: number): StockStatus {
  if (available <= 0) return "out_of_stock";
  return available <= LOW_STOCK_THRESHOLD ? "low_stock" : "in_stock";
}
