import type { ReactNode } from "react";
import type { PriceSummary as Summary } from "@nivora/shared/domain/types";
import { formatPrice } from "@nivora/shared/lib/format";

/** Order totals (requirements §17.3): MRP subtotal − discounts + delivery = total. From the data layer only. */
export function PriceSummary({
  summary,
  deliveryNote,
  children,
}: {
  summary: Summary;
  deliveryNote?: string;
  children?: ReactNode;
}) {
  const row = "flex items-center justify-between gap-4 text-sm";
  return (
    <section
      aria-labelledby="price-summary-heading"
      className="rounded-card bg-surface p-5 shadow-card ring-1 ring-line"
    >
      <h2
        id="price-summary-heading"
        className="text-base font-bold tracking-wide text-ink-muted uppercase"
      >
        Price Details
      </h2>
      <dl className="mt-4 flex flex-col gap-3">
        <div className={row}>
          <dt className="text-ink">
            Price ({summary.itemCount} {summary.itemCount === 1 ? "item" : "items"})
          </dt>
          <dd className="text-ink">{formatPrice(summary.subtotal)}</dd>
        </div>
        <div className={row}>
          <dt className="text-ink">Discount</dt>
          <dd className="font-semibold text-success">− {formatPrice(summary.discount)}</dd>
        </div>
        <div className={row}>
          <dt className="text-ink">
            Delivery charge
            {deliveryNote ? (
              <span className="block text-xs text-ink-subtle">{deliveryNote}</span>
            ) : null}
          </dt>
          <dd className={summary.deliveryCharge === 0 ? "font-semibold text-success" : "text-ink"}>
            {summary.deliveryCharge === 0 ? "Free" : formatPrice(summary.deliveryCharge)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4 border-t border-dashed border-line pt-3 text-base font-extrabold text-ink">
          <dt>Total</dt>
          <dd>{formatPrice(summary.total)}</dd>
        </div>
      </dl>
      {summary.discount > 0 ? (
        <p className="mt-3 rounded-control bg-success-soft px-3 py-2 text-sm font-semibold text-success">
          You save {formatPrice(summary.discount)} on this order
        </p>
      ) : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}
