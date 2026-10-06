import { summarize } from "./pricing";
import type {
  AddressInput,
  CheckoutSource,
  DeliveryOption,
  Order,
  OrderItem,
  OrderStatus,
  OrderSummary,
  ResolvedLine,
} from "./types";

const CANCELLABLE: OrderStatus[] = ["Placed", "Confirmed"];

/** Orders can be cancelled while Placed or Confirmed (requirements §25.2). */
export function canCancel(status: OrderStatus): boolean {
  return CANCELLABLE.includes(status);
}

/** Human-readable order number, e.g. NIV-2026-000123. */
export function formatOrderId(sequence: number, year: number): string {
  return `NIV-${year}-${String(sequence).padStart(6, "0")}`;
}

/** Snapshot of a line at order time; later catalog changes never alter an order (req §24.2). */
export function toOrderItem(line: ResolvedLine): OrderItem {
  return {
    productId: line.productId,
    variantId: line.variantId,
    productSlug: line.productSlug,
    productName: line.productName,
    brand: line.brand,
    image: line.image,
    options: { ...line.options },
    quantity: line.quantity,
    unitPrice: line.unitPrice,
    unitOriginalPrice: line.unitOriginalPrice,
    discount: (line.unitOriginalPrice - line.unitPrice) * line.quantity,
    lineTotal: line.unitPrice * line.quantity,
  };
}

/** Builds an order with totals recomputed from the lines (requirements §24.1, §24.2). */
export function buildOrder(params: {
  orderId: string;
  customerId: string;
  orderDate: string;
  source: CheckoutSource;
  lines: ResolvedLine[];
  deliveryOption: DeliveryOption;
  address: AddressInput;
}): Order {
  const summary = summarize(params.lines, params.deliveryOption);
  return {
    orderId: params.orderId,
    customerId: params.customerId,
    orderDate: params.orderDate,
    source: params.source,
    items: params.lines.map(toOrderItem),
    subtotal: summary.subtotal,
    discount: summary.discount,
    deliveryOption: params.deliveryOption,
    deliveryCharge: summary.deliveryCharge,
    total: summary.total,
    deliveryAddress: { ...params.address },
    paymentMethod: "Cash on Delivery",
    status: "Placed",
    statusHistory: [{ status: "Placed", at: params.orderDate }],
  };
}

export function cancelOrder(order: Order, at: string): Order {
  return {
    ...order,
    status: "Cancelled",
    statusHistory: [...order.statusHistory, { status: "Cancelled", at }],
  };
}

export function toOrderSummary(order: Order): OrderSummary {
  const [first] = order.items;
  return {
    orderId: order.orderId,
    orderDate: order.orderDate,
    status: order.status,
    total: order.total,
    paymentMethod: order.paymentMethod,
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    firstItem: { productName: first?.productName ?? "", image: first?.image ?? "" },
    otherItemsCount: Math.max(0, order.items.length - 1),
  };
}
