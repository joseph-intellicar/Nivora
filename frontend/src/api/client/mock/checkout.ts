import { checkQuantity, removeLine } from "@/domain/cart";
import { buildOrder, formatOrderId } from "@/domain/orders";
import type { CartLine, CheckoutSource, DeliveryOption, Order } from "@/domain/types";
import { addressSchema, cartItemInputSchema, deliveryOptionSchema } from "@/domain/validation";
import type { CheckoutApi } from "../../contracts";
import { ApiError } from "../../errors";
import { readAddresses } from "./addresses";
import { readLines, writeLines } from "./cartStore";
import { loadCatalog } from "./catalogData";
import { adjustStock, available, readAdjustments } from "./inventory";
import { request } from "./latency";
import type { CheckoutSessionRecord, OrdersRecord } from "./records";
import { resolveLines } from "./resolve";
import { requireUser } from "./session";
import { isArray, isNumber, isRecord, KEYS, read, write } from "./storage";

function readSessions(): CheckoutSessionRecord {
  return read<CheckoutSessionRecord>(KEYS.checkoutSession, {}, isRecord);
}

function writeSession(userId: string, value: CheckoutSessionRecord[string] | null): void {
  const sessions = readSessions();
  if (value) sessions[userId] = value;
  else delete sessions[userId];
  write(KEYS.checkoutSession, sessions);
}

/** Which items this checkout is for: a valid pending Buy Now, otherwise the cart (req §19). */
async function checkoutItems(
  userId: string,
): Promise<{ source: CheckoutSource; lines: CartLine[] }> {
  const session = readSessions()[userId];
  if (session?.source === "buy_now" && session.buyNow) {
    const entry = (await loadCatalog()).variants.get(session.buyNow.variantId);
    if (entry) {
      return {
        source: "buy_now",
        lines: [
          {
            variantId: entry.variant.id,
            productId: entry.product.id,
            quantity: session.buyNow.quantity,
          },
        ],
      };
    }
  }
  return { source: "cart", lines: readLines(userId) };
}

function parseDelivery(option: unknown): DeliveryOption {
  const result = deliveryOptionSchema.safeParse(option);
  if (!result.success)
    throw new ApiError("VALIDATION", {
      fields: { deliveryOption: "Please choose a delivery option." },
    });
  return result.data;
}

function nextOrderId(): string {
  const sequence = read<number>(KEYS.orderCounter, 0, isNumber) + 1;
  write(KEYS.orderCounter, sequence);
  return formatOrderId(sequence, new Date().getFullYear());
}

export const mockCheckout: CheckoutApi = {
  startBuyNow: (input) =>
    request(async () => {
      const user = requireUser();
      const parsed = cartItemInputSchema.safeParse(input);
      if (!parsed.success) throw new ApiError("INVALID_QUANTITY");
      const entry = (await loadCatalog()).variants.get(parsed.data.variantId);
      if (!entry) throw new ApiError("INVALID_VARIANT");
      // Buy Now is independent of the cart: its limit is the full stock (req §16.3).
      const check = checkQuantity(parsed.data.quantity, 0, available(entry.variant));
      if (!check.ok) {
        throw check.reason === "INSUFFICIENT_STOCK"
          ? new ApiError("INSUFFICIENT_STOCK", {
              productName: entry.product.name,
              available: check.available,
            })
          : new ApiError(check.reason, { productName: entry.product.name });
      }
      // Replaces any earlier pending Buy Now; the cart is never touched.
      writeSession(user.id, {
        source: "buy_now",
        buyNow: { variantId: entry.variant.id, quantity: parsed.data.quantity },
      });
    }),

  startCartCheckout: () =>
    request(() => {
      writeSession(requireUser().id, { source: "cart" });
    }),

  getCheckout: (deliveryOption) =>
    request(async () => {
      const user = requireUser();
      const option = parseDelivery(deliveryOption);
      const { source, lines } = await checkoutItems(user.id);
      const resolved = resolveLines(lines, await loadCatalog(), readAdjustments(), option);
      return { source, lines: resolved.lines, issues: resolved.issues, summary: resolved.summary };
    }),

  placeOrder: (input) =>
    request(async () => {
      // Re-validates everything (req §24.1); totals come from current data, never the UI.
      const user = requireUser();
      const deliveryOption = parseDelivery(input.deliveryOption);
      const { source, lines } = await checkoutItems(user.id);
      if (lines.length === 0) throw new ApiError("EMPTY_CART");

      const address = readAddresses(user.id).find((item) => item.id === input.addressId);
      if (!input.addressId || !address) throw new ApiError("ADDRESS_REQUIRED");
      const checkedAddress = addressSchema.safeParse({ ...address });
      if (!checkedAddress.success) throw new ApiError("INVALID_ADDRESS");

      const resolved = resolveLines(lines, await loadCatalog(), readAdjustments(), deliveryOption);
      if (resolved.removed.length > 0) throw new ApiError("INVALID_VARIANT");
      const issue = resolved.issues[0];
      if (issue) {
        if (issue.type === "insufficient_stock") {
          throw new ApiError("INSUFFICIENT_STOCK", {
            productName: issue.productName,
            available: issue.available,
          });
        }
        throw new ApiError(issue.type === "out_of_stock" ? "OUT_OF_STOCK" : "INVALID_VARIANT", {
          productName: issue.productName,
        });
      }

      const now = new Date().toISOString();
      const order: Order = buildOrder({
        orderId: nextOrderId(),
        customerId: user.id,
        orderDate: now,
        source,
        lines: resolved.lines,
        deliveryOption,
        address: checkedAddress.data,
      });

      write(KEYS.orders, [...read<OrdersRecord>(KEYS.orders, [], isArray), order]);
      adjustStock(
        order.items.map((item) => ({ variantId: item.variantId, delta: -item.quantity })),
      );
      if (source === "cart") {
        writeLines(
          user.id,
          order.items.reduce(
            (remaining, item) => removeLine(remaining, item.variantId),
            readLines(user.id),
          ),
        );
      }
      writeSession(user.id, null);
      return order;
    }),
};
