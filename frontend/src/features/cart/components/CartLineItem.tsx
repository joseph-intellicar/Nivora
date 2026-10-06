"use client";

import Link from "next/link";
import { TrashIcon } from "@/components/icons";
import { IconButton } from "@/components/ui/IconButton";
import { ProductImage } from "@/components/ui/ProductImage";
import { paths } from "@/config/routes";
import { formatOptions } from "@/domain/catalog";
import type { ResolvedLine } from "@/domain/types";
import { QuantitySelector } from "@/features/product/components/QuantitySelector";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

function issueText(line: ResolvedLine): string | null {
  if (!line.issue) return null;
  if (line.issue.type === "out_of_stock")
    return "This item is now out of stock. Please remove it to continue.";
  if (line.issue.type === "insufficient_stock")
    return `Only ${line.available} left in stock. Please reduce the quantity.`;
  return "This item is no longer available.";
}

/** A cart line (requirements §17.3): image, name, options, unit price, quantity, total, remove. */
export function CartLineItem({
  line,
  onQuantity,
  onRemove,
  busy,
}: {
  line: ResolvedLine;
  onQuantity: (quantity: number) => void;
  onRemove: () => void;
  busy: boolean;
}) {
  const options = formatOptions(line.options);
  const problem = issueText(line);
  return (
    <li className={cn("flex gap-4 py-5", problem && "rounded-card bg-danger-soft/40 px-3")}>
      <Link
        href={paths.product(line.productSlug)}
        className="w-20 shrink-0 sm:w-28"
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProductImage
          src={line.image}
          alt={line.productName}
          sizes="112px"
          className="rounded-control"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-wide text-ink-subtle uppercase">
              {line.brand}
            </p>
            <Link
              href={paths.product(line.productSlug)}
              className="line-clamp-2 font-semibold text-ink hover:text-brand-700 hover:underline"
            >
              {line.productName}
            </Link>
            {options ? <p className="text-sm text-ink-muted">{options}</p> : null}
          </div>
          <IconButton
            label={`Remove ${line.productName}${options ? ` (${options})` : ""} from cart`}
            icon={<TrashIcon />}
            size="sm"
            onClick={onRemove}
            disabled={busy}
          />
        </div>
        <p className="text-sm text-ink-muted">
          <span className="font-semibold text-ink">{formatPrice(line.unitPrice)}</span>
          {line.unitOriginalPrice > line.unitPrice ? (
            <del className="ml-2 text-ink-subtle">{formatPrice(line.unitOriginalPrice)}</del>
          ) : null}
          <span className="sr-only"> per item</span>
        </p>
        <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
          <QuantitySelector
            value={line.quantity}
            max={Math.max(line.quantity, line.available)}
            onChange={onQuantity}
            disabled={busy || line.available === 0}
            label={`Quantity for ${line.productName}`}
            size="sm"
          />
          <p className="font-bold text-ink">
            <span className="sr-only">Item total </span>
            {formatPrice(line.lineTotal)}
          </p>
        </div>
        {problem ? (
          <p role="alert" className="text-sm font-medium text-danger">
            {problem}
          </p>
        ) : null}
      </div>
    </li>
  );
}
