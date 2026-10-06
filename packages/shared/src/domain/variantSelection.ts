import { discountPercent } from "./pricing";
import { effectiveStock } from "./stock";
import type { Product, StockAdjustments, Variant } from "./types";

/*
 * Pure helpers for choosing variants (requirements §16.2). A value is unavailable when no
 * in-stock variant has it together with the other current selections (combinations that don't
 * exist, e.g. 16 GB RAM + 128 GB storage, count as unavailable).
 */

export type Selection = Record<string, string>;

/** Live stock for a variant (same rule as the data layer, req §24.4). */
export function available(variant: Variant, adjustments: StockAdjustments = {}): number {
  return effectiveStock(variant, adjustments);
}

/** Options with a single value are chosen for the customer (requirements §16.2). */
export function initialSelection(product: Product): Selection {
  return Object.fromEntries(
    product.options.filter((o) => o.values.length === 1).map((o) => [o.name, o.values[0]]),
  );
}

const matches = (variant: Variant, selection: Selection, except?: string) =>
  Object.entries(selection).every(
    ([name, value]) => name === except || variant.optionValues[name] === value,
  );

export function valueState(
  product: Product,
  selection: Selection,
  option: string,
  value: string,
  adjustments: StockAdjustments = {},
) {
  const candidates = product.variants.filter(
    (variant) => variant.optionValues[option] === value && matches(variant, selection, option),
  );
  return {
    exists: candidates.length > 0,
    inStock: candidates.some((variant) => available(variant, adjustments) > 0),
  };
}

export function selectedVariant(product: Product, selection: Selection): Variant | null {
  if (product.options.some((option) => !selection[option.name])) return null;
  return product.variants.find((variant) => matches(variant, selection)) ?? null;
}

export function missingOption(product: Product, selection: Selection): string | null {
  return product.options.find((option) => !selection[option.name])?.name ?? null;
}

/** Price shown for the current (possibly partial) selection. */
export function priceFor(
  product: Product,
  selection: Selection,
  adjustments: StockAdjustments = {},
) {
  const variant = selectedVariant(product, selection);
  const pool = variant ? [variant] : product.variants.filter((v) => matches(v, selection));
  const inStockPool = pool.filter((v) => available(v, adjustments) > 0);
  const candidates =
    inStockPool.length > 0 ? inStockPool : pool.length > 0 ? pool : product.variants;
  const best = candidates.reduce((a, b) => (b.price < a.price ? b : a));
  return {
    price: best.price,
    originalPrice: best.originalPrice,
    discountPercent: discountPercent(best.price, best.originalPrice),
    isRange: !variant && new Set(candidates.map((v) => v.price)).size > 1,
  };
}

/** Units available for the current selection: the variant's stock, or the product's total. */
export function stockFor(
  product: Product,
  selection: Selection,
  adjustments: StockAdjustments = {},
): number {
  const variant = selectedVariant(product, selection);
  if (variant) return available(variant, adjustments);
  return product.variants
    .filter((v) => matches(v, selection))
    .reduce((sum, v) => sum + available(v, adjustments), 0);
}

export function clampQuantity(quantity: number, max: number): number {
  return Math.max(1, Math.min(quantity, Math.max(1, max)));
}
