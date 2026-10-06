import { effectiveStock } from "@/domain/stock";
import type { StockAdjustments, Variant } from "@/domain/types";
import type { InventoryApi } from "../../contracts";
import { request } from "./latency";
import { isRecord, KEYS, read, write } from "./storage";

/** Stock changes from orders/cancellations, applied on top of initial stock (req §24.4). */
export function readAdjustments(): StockAdjustments {
  return read<StockAdjustments>(KEYS.inventory, {}, isRecord);
}

export function available(variant: Variant, adjustments = readAdjustments()): number {
  return effectiveStock(variant, adjustments);
}

/** Applies stock deltas (negative = sold, positive = restored). Store-wide, not per user. */
export function adjustStock(deltas: Array<{ variantId: string; delta: number }>): void {
  const adjustments = readAdjustments();
  for (const { variantId, delta } of deltas) {
    adjustments[variantId] = (adjustments[variantId] ?? 0) + delta;
    if (adjustments[variantId] === 0) delete adjustments[variantId];
  }
  write(KEYS.inventory, adjustments);
}

export const mockInventory: InventoryApi = {
  getAdjustments: () => request(() => readAdjustments()),
};
