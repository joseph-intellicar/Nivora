import { addLine, checkQuantity, quantityInCart, removeLine, setLineQuantity } from "@/domain/cart";
import type { CartView } from "@/domain/types";
import { cartItemInputSchema } from "@/domain/validation";
import type { CartApi } from "../../contracts";
import { ApiError } from "../../errors";
import { readLines, writeLines } from "./cartStore";
import { loadCatalog } from "./catalogData";
import { available, readAdjustments } from "./inventory";
import { request } from "./latency";
import { resolveLines } from "./resolve";
import { currentUser } from "./session";

/** Cart of the current user, or the guest cart (requirements §17.5). */
const owner = () => currentUser()?.id ?? null;

async function view(): Promise<CartView> {
  const userId = owner();
  const lines = readLines(userId);
  const resolved = resolveLines(lines, await loadCatalog(), readAdjustments());
  if (resolved.removed.length > 0) {
    // Products that no longer exist are dropped and reported once (requirements §17.4).
    writeLines(
      userId,
      lines.filter((line) => !resolved.removed.some((r) => r.variantId === line.variantId)),
    );
  }
  return {
    lines: resolved.lines,
    issues: resolved.issues,
    removed: resolved.removed,
    summary: resolved.summary,
  };
}

function parseQuantity(quantity: unknown): number {
  const result = cartItemInputSchema.shape.quantity.safeParse(quantity);
  if (!result.success) throw new ApiError("INVALID_QUANTITY");
  return result.data;
}

async function findVariant(variantId: string) {
  const entry = (await loadCatalog()).variants.get(variantId);
  if (!entry) throw new ApiError("INVALID_VARIANT");
  return entry;
}

function enforce(check: ReturnType<typeof checkQuantity>, productName: string): void {
  if (check.ok) return;
  if (check.reason === "INSUFFICIENT_STOCK")
    throw new ApiError("INSUFFICIENT_STOCK", { productName, available: check.available });
  throw new ApiError(check.reason, { productName });
}

export const mockCart: CartApi = {
  getCart: () => request(view),

  addItem: (input) =>
    request(async () => {
      const quantity = parseQuantity(input.quantity);
      const { product, variant } = await findVariant(input.variantId);
      const userId = owner();
      const lines = readLines(userId);
      enforce(
        checkQuantity(quantity, quantityInCart(lines, variant.id), available(variant)),
        product.name,
      );
      writeLines(
        userId,
        addLine(lines, { variantId: variant.id, productId: product.id, quantity }),
      );
      return view();
    }),

  updateQuantity: (variantId, quantity) =>
    request(async () => {
      const next = parseQuantity(quantity);
      const userId = owner();
      const lines = readLines(userId);
      if (quantityInCart(lines, variantId) === 0)
        throw new ApiError("NOT_FOUND", { entity: "product" });
      const { product, variant } = await findVariant(variantId);
      enforce(checkQuantity(next, 0, available(variant)), product.name);
      writeLines(userId, setLineQuantity(lines, variantId, next));
      return view();
    }),

  removeItem: (variantId) =>
    request(async () => {
      const userId = owner();
      writeLines(userId, removeLine(readLines(userId), variantId));
      return view();
    }),
};
