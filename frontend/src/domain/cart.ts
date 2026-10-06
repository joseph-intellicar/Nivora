import type { CartIssue, CartLine } from "./types";

/** Result of checking whether a quantity can be added (requirements §17.1, §17.2). */
export type AddCheck =
  | { ok: true }
  | { ok: false; reason: "INVALID_QUANTITY" }
  | { ok: false; reason: "OUT_OF_STOCK" }
  | { ok: false; reason: "INSUFFICIENT_STOCK"; available: number };

export function checkQuantity(
  requested: number,
  alreadyInCart: number,
  available: number,
): AddCheck {
  if (!Number.isInteger(requested) || requested < 1)
    return { ok: false, reason: "INVALID_QUANTITY" };
  if (available <= 0) return { ok: false, reason: "OUT_OF_STOCK" };
  if (alreadyInCart + requested > available) {
    return {
      ok: false,
      reason: "INSUFFICIENT_STOCK",
      available: Math.max(0, available - alreadyInCart),
    };
  }
  return { ok: true };
}

/** Adds a line; the same variant increases the existing line's quantity (lines are keyed by variant). */
export function addLine(lines: CartLine[], line: CartLine): CartLine[] {
  const existing = lines.find((item) => item.variantId === line.variantId);
  if (!existing) return [...lines, line];
  return lines.map((item) =>
    item.variantId === line.variantId ? { ...item, quantity: item.quantity + line.quantity } : item,
  );
}

export function setLineQuantity(
  lines: CartLine[],
  variantId: string,
  quantity: number,
): CartLine[] {
  return lines.map((item) => (item.variantId === variantId ? { ...item, quantity } : item));
}

export function removeLine(lines: CartLine[], variantId: string): CartLine[] {
  return lines.filter((item) => item.variantId !== variantId);
}

export function quantityInCart(lines: CartLine[], variantId: string): number {
  return lines.find((item) => item.variantId === variantId)?.quantity ?? 0;
}

/**
 * Merges the guest cart into the user's saved cart on login (requirements §17.5):
 * matching variants are summed and capped at available stock; other lines are added.
 * `mergedSavedItems` is true when the result contains anything beyond the guest cart (decision D12).
 */
export function mergeCarts(
  saved: CartLine[],
  guest: CartLine[],
  availableOf: (variantId: string) => number,
): { lines: CartLine[]; mergedSavedItems: boolean } {
  let lines: CartLine[] = saved.map((line) => ({ ...line }));
  for (const line of guest) lines = addLine(lines, line);
  lines = lines.map((line) => {
    const available = availableOf(line.variantId);
    return available > 0 ? { ...line, quantity: Math.min(line.quantity, available) } : line;
  });
  const mergedSavedItems = lines.some(
    (line) => line.quantity > quantityInCart(guest, line.variantId),
  );
  return { lines, mergedSavedItems };
}

/** Problems with a cart line against current product data (requirements §17.4). */
export function assessLine(params: {
  variantId: string;
  productName: string;
  exists: boolean;
  quantity: number;
  available: number;
}): CartIssue | null {
  const { variantId, productName, exists, quantity, available } = params;
  if (!exists) return { type: "unavailable", variantId, productName };
  if (available <= 0) return { type: "out_of_stock", variantId, productName, available: 0 };
  if (quantity > available)
    return { type: "insufficient_stock", variantId, productName, available };
  return null;
}
