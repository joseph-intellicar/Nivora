import { assessLine } from "./cart";
import { summarize } from "./pricing";
import type {
  CartIssue,
  CartLine,
  DeliveryOption,
  PriceSummary,
  Product,
  ResolvedLine,
  Variant,
} from "./types";

/** Current product data and stock for a variant, or undefined when it no longer exists. */
export type VariantLookup = (
  variantId: string,
) => { product: Product; variant: Variant; available: number } | undefined;

export type ResolvedLines = {
  lines: ResolvedLine[];
  issues: CartIssue[];
  removed: CartIssue[];
  summary: PriceSummary;
};

/**
 * Resolves stored lines against current product data and stock (requirements §17.4): lines
 * whose product/variant no longer exists are returned in `removed`; others carry any issue.
 * Totals are always computed here (the UI never computes money). Used by the API and the mock.
 */
export function resolveLines(
  lines: CartLine[],
  lookup: VariantLookup,
  deliveryOption: DeliveryOption = "standard",
): ResolvedLines {
  const resolved: ResolvedLine[] = [];
  const removed: CartIssue[] = [];
  for (const line of lines) {
    const entry = lookup(line.variantId);
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
    const { product, variant, available } = entry;
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
      available,
      issue: assessLine({
        variantId: variant.id,
        productName: product.name,
        exists: true,
        quantity: line.quantity,
        available,
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
