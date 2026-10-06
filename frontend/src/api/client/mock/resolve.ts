import { assessLine } from "@/domain/cart";
import { summarize } from "@/domain/pricing";
import type {
  CartIssue,
  CartLine,
  DeliveryOption,
  PriceSummary,
  ResolvedLine,
  StockAdjustments,
} from "@/domain/types";
import type { CatalogIndex } from "./catalogData";
import { available } from "./inventory";

/**
 * Resolves stored lines against current product data and stock (requirements §17.4):
 * lines whose product/variant no longer exists are returned in `removed`; others carry any issue.
 */
export function resolveLines(
  lines: CartLine[],
  catalog: CatalogIndex,
  adjustments: StockAdjustments,
  deliveryOption: DeliveryOption = "standard",
): { lines: ResolvedLine[]; issues: CartIssue[]; removed: CartIssue[]; summary: PriceSummary } {
  const resolved: ResolvedLine[] = [];
  const removed: CartIssue[] = [];
  for (const line of lines) {
    const entry = catalog.variants.get(line.variantId);
    if (!entry) {
      removed.push(
        assessLine({
          variantId: line.variantId,
          productName: "An item",
          exists: false,
          quantity: line.quantity,
          available: 0,
        })!,
      );
      continue;
    }
    const { product, variant } = entry;
    const stock = available(variant, adjustments);
    resolved.push({
      variantId: variant.id,
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      brand: product.brand,
      image: product.images[0] ?? "",
      options: { ...variant.optionValues },
      quantity: line.quantity,
      unitPrice: variant.price,
      unitOriginalPrice: variant.originalPrice,
      lineTotal: variant.price * line.quantity,
      available: stock,
      issue: assessLine({
        variantId: variant.id,
        productName: product.name,
        exists: true,
        quantity: line.quantity,
        available: stock,
      }),
    });
  }
  return {
    lines: resolved,
    issues: resolved.flatMap((line) => (line.issue ? [line.issue] : [])),
    removed,
    summary: summarize(resolved, deliveryOption),
  };
}
