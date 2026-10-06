import { ProductImage } from "@/components/ui/ProductImage";
import { formatOptions } from "@nivora/shared/domain/catalog";
import type { ResolvedLine } from "@nivora/shared/domain/types";
import { formatPrice } from "@nivora/shared/lib/format";

/** Read-only item list for checkout (quantities are changed in the cart, req §20). */
export function CheckoutLines({ lines }: { lines: ResolvedLine[] }) {
  return (
    <ul className="divide-y divide-line">
      {lines.map((line) => {
        const options = formatOptions(line.options);
        const problem =
          line.issue?.type === "out_of_stock"
            ? "Out of stock"
            : line.issue?.type === "insufficient_stock"
              ? `Only ${line.available} left`
              : line.issue
                ? "No longer available"
                : null;
        return (
          <li key={line.variantId} className="flex gap-3 py-3">
            <ProductImage
              src={line.image}
              alt={line.productName}
              sizes="64px"
              className="w-16 shrink-0 rounded-control"
            />
            <div className="min-w-0 flex-1 text-sm">
              <p className="line-clamp-2 font-semibold text-ink">{line.productName}</p>
              {options ? <p className="text-ink-muted">{options}</p> : null}
              <p className="text-ink-muted">
                Qty {line.quantity} × {formatPrice(line.unitPrice)}
              </p>
              {problem ? (
                <p role="alert" className="font-semibold text-danger">
                  {problem}
                </p>
              ) : null}
            </div>
            <p className="text-sm font-bold text-ink">{formatPrice(line.lineTotal)}</p>
          </li>
        );
      })}
    </ul>
  );
}
