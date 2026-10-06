"use client";

import { useQuery } from "@tanstack/react-query";
import { api, queryKeys } from "@/api/client";
import type { ProductSummary, StockAdjustments } from "@nivora/shared/domain/types";

/** Stock adjustments from orders and cancellations stored in this browser (arch §3.1). */
export function useInventory() {
  return useQuery({
    queryKey: queryKeys.inventory(),
    queryFn: () => api.inventory.getAdjustments(),
  });
}

/** Live availability for a server-rendered card: initial stock plus stored adjustments. */
export function liveInStock(
  summary: Pick<ProductSummary, "variantIds" | "initialStock">,
  adjustments: StockAdjustments,
): boolean {
  return summary.variantIds.some(
    (id) => (summary.initialStock[id] ?? 0) + (adjustments[id] ?? 0) > 0,
  );
}
