import type { AddressInput, Order, OrderItem, OrderStatus } from "@nivora/shared/domain/types";
import type { Prisma } from "../../generated/prisma/client.js";

export const ORDER_INCLUDE = {
  items: { orderBy: { position: "asc" } },
  history: { orderBy: [{ at: "asc" }, { id: "asc" }] },
} as const satisfies Prisma.OrderInclude;

export type OrderRow = Prisma.OrderGetPayload<{ include: typeof ORDER_INCLUDE }>;

/** Database order → the shared `Order` contract (order number is the public id). */
export function toOrder(row: OrderRow): Order {
  return {
    orderId: row.orderNumber,
    customerId: row.customerId,
    orderDate: row.orderDate.toISOString(),
    source: row.source,
    items: row.items.map((item): OrderItem => ({
      productId: item.productId,
      variantId: item.variantId,
      productSlug: item.productSlug,
      productName: item.productName,
      brand: item.brand,
      image: item.image,
      options: item.options as Record<string, string>,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      unitOriginalPrice: item.unitOriginalPrice,
      discount: item.discount,
      lineTotal: item.lineTotal,
    })),
    subtotal: row.subtotal,
    discount: row.discount,
    deliveryOption: row.deliveryOption,
    deliveryCharge: row.deliveryCharge,
    total: row.total,
    deliveryAddress: row.deliveryAddress as AddressInput,
    paymentMethod: "Cash on Delivery",
    status: row.status as OrderStatus,
    statusHistory: row.history.map((event) => ({
      status: event.status as OrderStatus,
      at: event.at.toISOString(),
    })),
    ...(row.isSample ? { isSample: true } : {}),
  };
}

/** Order numbers use the year in India (NIV-2026-000123). */
export function indiaYear(date: Date): number {
  return Number(
    new Intl.DateTimeFormat("en-IN", { year: "numeric", timeZone: "Asia/Kolkata" }).format(date),
  );
}
