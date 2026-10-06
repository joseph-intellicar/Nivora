import { Injectable } from "@nestjs/common";
import { toOrderSummary } from "@nivora/shared/domain/orders";
import type { Order, OrderSummary } from "@nivora/shared/domain/types";
import { ApiError } from "@nivora/shared/errors";
import { PrismaService } from "../../prisma/prisma.service.js";
import { ORDER_INCLUDE, toOrder } from "./order-mapping.js";

/** Order history and cancellation (req §25). Another customer's order is NOT_FOUND. */
@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string): Promise<OrderSummary[]> {
    const rows = await this.prisma.order.findMany({
      where: { customerId: userId },
      orderBy: [{ orderDate: "desc" }, { orderNumber: "desc" }],
      include: ORDER_INCLUDE,
    });
    return rows.map((row) => toOrderSummary(toOrder(row)));
  }

  async get(userId: string, orderNumber: string): Promise<Order> {
    const row = await this.prisma.order.findFirst({
      where: { orderNumber, customerId: userId },
      include: ORDER_INCLUDE,
    });
    if (!row) throw new ApiError("NOT_FOUND", { entity: "order" });
    return toOrder(row);
  }

  /**
   * Placed/Confirmed only (shared `canCancel` rule) — enforced by a conditional update, so two
   * cancels at once restore stock exactly once. Sample orders never touched stock (req §25.5).
   */
  async cancel(userId: string, orderNumber: string): Promise<Order> {
    const row = await this.prisma.$transaction(
      async (tx) => {
        const order = await tx.order.findFirst({
          where: { orderNumber, customerId: userId },
          include: { items: { select: { variantId: true, quantity: true } } },
        });
        if (!order) throw new ApiError("NOT_FOUND", { entity: "order" });
        const { count } = await tx.order.updateMany({
          where: { id: order.id, status: { in: ["Placed", "Confirmed"] } },
          data: { status: "Cancelled" },
        });
        if (count === 0) throw new ApiError("ORDER_NOT_CANCELLABLE");
        await tx.orderStatusEvent.create({ data: { orderId: order.id, status: "Cancelled" } });
        if (!order.isSample) {
          for (const item of order.items) {
            await tx.variant.update({
              where: { id: item.variantId },
              data: { stock: { increment: item.quantity } },
            });
          }
        }
        return tx.order.findUniqueOrThrow({ where: { id: order.id }, include: ORDER_INCLUDE });
      },
      { timeout: 30_000, maxWait: 30_000 },
    );
    return toOrder(row);
  }
}
