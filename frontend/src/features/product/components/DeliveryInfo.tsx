import { CheckIcon, PackageIcon, TruckIcon } from "@/components/icons";
import { DELIVERY } from "@nivora/shared/config/constants";
import { formatPrice } from "@nivora/shared/lib/format";

/** Delivery & services summary on Product Details (requirements §22, §23). Phase 1 facts only. */
export function DeliveryInfo() {
  const rows = [
    { icon: CheckIcon, title: "Cash on Delivery", text: "Pay in cash when your order arrives." },
    {
      icon: TruckIcon,
      title: DELIVERY.standard.label,
      text: `${DELIVERY.standard.estimatedDays.min}–${DELIVERY.standard.estimatedDays.max} days · Free on orders of ${formatPrice(DELIVERY.standard.freeThreshold)} or more, otherwise ${formatPrice(DELIVERY.standard.charge)}`,
    },
    {
      icon: PackageIcon,
      title: DELIVERY.express.label,
      text: `${DELIVERY.express.estimatedDays.min}–${DELIVERY.express.estimatedDays.max} days for ${formatPrice(DELIVERY.express.charge)}`,
    },
  ];
  return (
    <section
      aria-labelledby="delivery-heading"
      className="rounded-card bg-surface p-4 ring-1 ring-line"
    >
      <h2 id="delivery-heading" className="text-sm font-bold tracking-wide text-ink uppercase">
        Delivery &amp; services
      </h2>
      <ul className="mt-3 flex flex-col gap-3">
        {rows.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex gap-3">
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
              <Icon className="size-4" />
            </span>
            <p className="text-sm">
              <span className="block font-semibold text-ink">{title}</span>
              <span className="text-ink-muted">{text}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
