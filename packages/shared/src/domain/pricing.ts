import { DELIVERY } from "../config/constants";
import type { DeliveryOption, PriceSummary, Product, Variant } from "./types";

/** Whole-number discount percentage; 0 when there is no discount. */
export function discountPercent(price: number, originalPrice: number): number {
  if (originalPrice <= 0 || price >= originalPrice) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/**
 * The variant whose price represents the product in listings (decision D14):
 * the cheapest in-stock variant, or the cheapest variant when none are in stock.
 */
export function listingVariant(
  product: Product,
  isAvailable: (variant: Variant) => boolean,
): Variant {
  const candidates = product.variants.filter(isAvailable);
  const pool = candidates.length > 0 ? candidates : product.variants;
  return pool.reduce((best, variant) =>
    variant.price < best.price ||
    (variant.price === best.price && variant.originalPrice > best.originalPrice)
      ? variant
      : best,
  );
}

/** Delivery charge for an order value after discounts (requirements §22, decision D6). */
export function deliveryCharge(
  valueAfterDiscount: number,
  option: DeliveryOption,
  itemCount = 1,
): number {
  if (itemCount === 0) return 0;
  if (option === "express") return DELIVERY.express.charge;
  return valueAfterDiscount >= DELIVERY.standard.freeThreshold ? 0 : DELIVERY.standard.charge;
}

export type PricedLine = { unitPrice: number; unitOriginalPrice: number; quantity: number };

/** Cart/checkout totals (requirements §17.3): subtotal (MRP) − discount + delivery. */
export function summarize(lines: PricedLine[], option: DeliveryOption): PriceSummary {
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotal = lines.reduce((sum, line) => sum + line.unitOriginalPrice * line.quantity, 0);
  const discount = lines.reduce(
    (sum, line) => sum + (line.unitOriginalPrice - line.unitPrice) * line.quantity,
    0,
  );
  const charge = deliveryCharge(subtotal - discount, option, itemCount);
  return {
    itemCount,
    subtotal,
    discount,
    deliveryOption: option,
    deliveryCharge: charge,
    total: subtotal - discount + charge,
  };
}
