import {
  addLine,
  assessLine,
  checkQuantity,
  mergeCarts,
  quantityInCart,
  removeLine,
  setLineQuantity,
} from "../domain/cart";
import {
  buildOrder,
  cancelOrder,
  canCancel,
  formatOrderId,
  toOrderSummary,
} from "../domain/orders";
import type { OrderStatus } from "../domain/types";

const line = (variantId: string, quantity: number) => ({
  variantId,
  productId: `p-${variantId}`,
  quantity,
});

describe("cart lines (req §18)", () => {
  it("increments the same variant and adds a line for a different one", () => {
    let lines = addLine([], line("a", 1));
    lines = addLine(lines, line("a", 2));
    lines = addLine(lines, line("b", 1));
    expect(lines).toHaveLength(2);
    expect(quantityInCart(lines, "a")).toBe(3);
    expect(removeLine(lines, "a")).toHaveLength(1);
    expect(quantityInCart(setLineQuantity(lines, "b", 4), "b")).toBe(4);
  });

  it("checks requested quantities against stock", () => {
    expect(checkQuantity(2, 3, 4)).toEqual({
      ok: false,
      reason: "INSUFFICIENT_STOCK",
      available: 1,
    });
    expect(checkQuantity(1, 0, 0)).toMatchObject({ reason: "OUT_OF_STOCK" });
    expect(checkQuantity(0, 0, 5)).toMatchObject({ reason: "INVALID_QUANTITY" });
    expect(checkQuantity(1.5, 0, 5)).toMatchObject({ reason: "INVALID_QUANTITY" });
    expect(checkQuantity(2, 0, 2).ok).toBe(true);
  });
});

describe("cart merge on login (req §19)", () => {
  const available: Record<string, number> = { a: 4, b: 10, c: 10, d: 0 };
  const stock = (id: string) => available[id];

  it("sums overlapping lines capped at stock and adds new ones", () => {
    const merged = mergeCarts([line("a", 3), line("c", 1)], [line("a", 2), line("b", 1)], stock);
    expect(quantityInCart(merged.lines, "a")).toBe(4);
    expect(quantityInCart(merged.lines, "b")).toBe(1);
    expect(quantityInCart(merged.lines, "c")).toBe(1);
    expect(merged.mergedSavedItems).toBe(true);
  });

  it("reports saved items only when the account cart had some", () => {
    const fromEmpty = mergeCarts([], [line("a", 1)], stock);
    expect(fromEmpty.mergedSavedItems).toBe(false);
    expect(fromEmpty.lines).toHaveLength(1);
    const same = mergeCarts([line("a", 1)], [line("a", 1)], stock);
    expect(same.mergedSavedItems).toBe(true);
    expect(quantityInCart(same.lines, "a")).toBe(2);
  });
});

describe("cart line issues (req §24.3)", () => {
  const base = { variantId: "x", productName: "X" };

  it("flags unavailable, out-of-stock and insufficient-stock lines", () => {
    expect(assessLine({ ...base, exists: false, quantity: 1, available: 0 })?.type).toBe(
      "unavailable",
    );
    expect(assessLine({ ...base, exists: true, quantity: 1, available: 0 })?.type).toBe(
      "out_of_stock",
    );
    expect(assessLine({ ...base, exists: true, quantity: 3, available: 2 })?.type).toBe(
      "insufficient_stock",
    );
    expect(assessLine({ ...base, exists: true, quantity: 2, available: 2 })).toBeNull();
  });
});

describe("orders (req §25–§27)", () => {
  const cartLine = {
    variantId: "a",
    productId: "p",
    productSlug: "p",
    productName: "P",
    brand: "B",
    image: "i",
    options: { Size: "M" },
    quantity: 2,
    unitPrice: 300,
    unitOriginalPrice: 400,
    lineTotal: 600,
    available: 5,
    issue: null,
  };
  const address = {
    fullName: "Joseph",
    phone: "9876543210",
    line1: "1 St",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "560038",
    country: "India",
  };
  const order = buildOrder({
    orderId: formatOrderId(5, 2026),
    customerId: "u",
    orderDate: "2026-10-06T00:00:00.000Z",
    source: "cart",
    lines: [cartLine],
    deliveryOption: "standard",
    address,
  } as Parameters<typeof buildOrder>[0]);

  it("builds a Cash on Delivery order with recomputed totals", () => {
    expect(order).toMatchObject({
      orderId: "NIV-2026-000005",
      subtotal: 800,
      discount: 200,
      deliveryCharge: 0,
      total: 600,
      paymentMethod: "Cash on Delivery",
      status: "Placed",
    });
    expect(order.items[0].discount).toBe(200);
    expect(order.statusHistory).toHaveLength(1);
  });

  it("snapshots items so later changes don't affect the order", () => {
    const lines = [{ ...cartLine }];
    const snapshot = buildOrder({
      ...order,
      source: "cart",
      lines,
      deliveryOption: "standard",
      address,
    } as Parameters<typeof buildOrder>[0]);
    lines[0].unitPrice = 1;
    expect(snapshot.items[0].unitPrice).toBe(300);
  });

  it("cancels by appending history without mutating the original", () => {
    const cancelled = cancelOrder(order, "2026-10-07T00:00:00.000Z");
    expect(cancelled.status).toBe("Cancelled");
    expect(cancelled.statusHistory.at(-1)?.status).toBe("Cancelled");
    expect(order.status).toBe("Placed");
  });

  it("allows cancelling Placed and Confirmed orders only", () => {
    const can: OrderStatus[] = ["Placed", "Confirmed"];
    const cannot: OrderStatus[] = ["Shipped", "Delivered", "Cancelled"];
    expect(can.every(canCancel)).toBe(true);
    expect(cannot.some(canCancel)).toBe(false);
  });

  it("summarises an order for the list", () => {
    expect(toOrderSummary(order)).toMatchObject({ itemCount: 2, otherItemsCount: 0 });
  });
});
