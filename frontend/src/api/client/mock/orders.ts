import { cancelOrder, canCancel, toOrderSummary } from "@/domain/orders";
import type { Order } from "@/domain/types";
import type { OrderApi } from "../../contracts";
import { ApiError } from "../../errors";
import { adjustStock } from "./inventory";
import { request } from "./latency";
import type { OrdersRecord } from "./records";
import { requireUser } from "./session";
import { isArray, KEYS, read, write } from "./storage";

const readOrders = () => read<OrdersRecord>(KEYS.orders, [], isArray);

/** Another user's order is reported as not found (requirements §25.4). */
function findOwn(orderId: string, userId: string): Order {
  const order = readOrders().find((item) => item.orderId === orderId && item.customerId === userId);
  if (!order) throw new ApiError("NOT_FOUND", { entity: "order" });
  return order;
}

export const mockOrders: OrderApi = {
  list: () =>
    request(() => {
      const user = requireUser();
      return readOrders()
        .filter((order) => order.customerId === user.id)
        .sort(
          (a, b) => b.orderDate.localeCompare(a.orderDate) || b.orderId.localeCompare(a.orderId),
        )
        .map(toOrderSummary);
    }),

  get: (orderId) => request(() => findOwn(orderId, requireUser().id)),

  cancel: (orderId) =>
    request(() => {
      const user = requireUser();
      const order = findOwn(orderId, user.id);
      if (!canCancel(order.status)) throw new ApiError("ORDER_NOT_CANCELLABLE");
      const cancelled = cancelOrder(order, new Date().toISOString());
      write(
        KEYS.orders,
        readOrders().map((item) => (item.orderId === orderId ? cancelled : item)),
      );
      // Sample orders never changed stock, so they never restore it (req §25.5).
      if (!order.isSample) {
        adjustStock(
          order.items.map((item) => ({ variantId: item.variantId, delta: item.quantity })),
        );
      }
      return cancelled;
    }),
};
