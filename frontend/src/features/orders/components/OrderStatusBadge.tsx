import { Badge, type BadgeVariant } from "@/components/ui/Badge";
import type { OrderStatus } from "@nivora/shared/domain/types";

const VARIANT: Record<OrderStatus, BadgeVariant> = {
  Placed: "neutral",
  Confirmed: "brand",
  Shipped: "warning",
  Delivered: "success",
  Cancelled: "danger",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={VARIANT[status]}>{status}</Badge>;
}
