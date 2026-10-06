import Link from "next/link";
import { ProductImage } from "@/components/ui/ProductImage";
import { paths } from "@/config/routes";
import { formatOptions } from "@nivora/shared/domain/catalog";
import type { OrderItem } from "@nivora/shared/domain/types";
import { formatPrice } from "@nivora/shared/lib/format";

/** Snapshotted order items (requirements §25.4): variants, quantities, prices, discounts. */
export function OrderItems({ items }: { items: OrderItem[] }) {
  return (
    <ul className="divide-y divide-line">
      {items.map((item) => {
        const options = formatOptions(item.options);
        return (
          <li key={item.variantId} className="flex gap-3 py-4">
            <ProductImage
              src={item.image}
              alt={item.productName}
              sizes="80px"
              className="w-20 shrink-0 rounded-control"
            />
            <div className="min-w-0 flex-1 text-sm">
              <p className="text-xs font-semibold tracking-wide text-ink-subtle uppercase">
                {item.brand}
              </p>
              <Link
                href={paths.product(item.productSlug)}
                className="font-semibold text-ink hover:text-brand-700 hover:underline"
              >
                {item.productName}
              </Link>
              {options ? <p className="text-ink-muted">{options}</p> : null}
              <p className="text-ink-muted">
                Qty {item.quantity} × {formatPrice(item.unitPrice)}
                {item.unitOriginalPrice > item.unitPrice ? (
                  <del className="ml-2 text-ink-subtle">{formatPrice(item.unitOriginalPrice)}</del>
                ) : null}
              </p>
              {item.discount > 0 ? (
                <p className="font-semibold text-success">You saved {formatPrice(item.discount)}</p>
              ) : null}
            </div>
            <p className="text-sm font-bold text-ink">{formatPrice(item.lineTotal)}</p>
          </li>
        );
      })}
    </ul>
  );
}
