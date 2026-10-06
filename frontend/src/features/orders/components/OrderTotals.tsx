import { DELIVERY } from "@/config/constants";
import type { Order } from "@/domain/types";
import { formatPrice } from "@/lib/format";

/** Order totals as charged (snapshot), with the payment method (requirements §25.4). */
export function OrderTotals({ order }: { order: Order }) {
  const row = "flex justify-between gap-4 text-sm";
  return (
    <dl className="flex flex-col gap-2.5">
      <div className={row}>
        <dt className="text-ink-muted">Items (MRP)</dt>
        <dd className="text-ink">{formatPrice(order.subtotal)}</dd>
      </div>
      <div className={row}>
        <dt className="text-ink-muted">Discount</dt>
        <dd className="font-semibold text-success">− {formatPrice(order.discount)}</dd>
      </div>
      <div className={row}>
        <dt className="text-ink-muted">{DELIVERY[order.deliveryOption].label}</dt>
        <dd className="text-ink">
          {order.deliveryCharge === 0 ? "Free" : formatPrice(order.deliveryCharge)}
        </dd>
      </div>
      <div className="flex justify-between gap-4 border-t border-dashed border-line pt-2.5 text-base font-extrabold text-ink">
        <dt>Total</dt>
        <dd>{formatPrice(order.total)}</dd>
      </div>
      <div className={row}>
        <dt className="text-ink-muted">Payment Method</dt>
        <dd className="font-semibold text-ink">{order.paymentMethod}</dd>
      </div>
    </dl>
  );
}
