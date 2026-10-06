import {
  resolveLines as resolveShared,
  type ResolvedLines,
} from "@nivora/shared/domain/resolveLines";
import type { CartLine, DeliveryOption, StockAdjustments } from "@nivora/shared/domain/types";
import type { CatalogIndex } from "./catalogData";
import { available } from "./inventory";

/** The shared line resolution over the browser catalog and local stock adjustments. */
export function resolveLines(
  lines: CartLine[],
  catalog: CatalogIndex,
  adjustments: StockAdjustments,
  deliveryOption: DeliveryOption = "standard",
): ResolvedLines {
  return resolveShared(
    lines,
    (variantId) => {
      const entry = catalog.variants.get(variantId);
      return entry && { ...entry, available: available(entry.variant, adjustments) };
    },
    deliveryOption,
  );
}
