"use client";

import type { ProductSummary } from "@nivora/shared/domain/types";
import { liveInStock, useInventory } from "../hooks/useInventory";

/**
 * Client island on server-rendered cards: shows "Out of Stock" when orders stored in this
 * browser have sold the product out (Phase 1 inventory overlay, arch §3.1).
 */
export function CardAvailability({
  summary,
}: {
  summary: Pick<ProductSummary, "inStock" | "variantIds" | "initialStock">;
}) {
  const { data } = useInventory();
  const inStock = data ? liveInStock(summary, data) : summary.inStock;
  if (inStock) return null;
  return (
    <span className="absolute top-2 left-2 z-10 rounded-full bg-ink/85 px-2.5 py-1 text-xs font-bold text-white">
      Out of Stock
    </span>
  );
}
