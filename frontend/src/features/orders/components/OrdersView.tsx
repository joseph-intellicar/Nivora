"use client";

import Link from "next/link";
import { PackageIcon } from "@/components/icons";
import { buttonClasses } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { ProductImage } from "@/components/ui/ProductImage";
import { Skeleton } from "@/components/ui/Skeleton";
import { paths } from "@/config/routes";
import { formatDate, formatPrice } from "@nivora/shared/lib/format";
import { useOrders } from "../hooks/useOrders";
import { OrderStatusBadge } from "./OrderStatusBadge";

/** Order history, newest first (requirements §25.3). */
export function OrdersView() {
  const orders = useOrders();
  if (orders.isPending) {
    return (
      <div className="space-y-3">
        <p role="status" className="sr-only">
          Loading your orders…
        </p>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
  }
  if (orders.isError) return <ErrorState onRetry={() => orders.refetch()} />;
  if (orders.data.length === 0) {
    return (
      <EmptyState
        icon={<PackageIcon />}
        title="You haven't placed any orders yet."
        action={
          <Link href={paths.home()} className={buttonClasses({ size: "lg" })}>
            Start Shopping
          </Link>
        }
      />
    );
  }
  return (
    <ul className="flex flex-col gap-3">
      {orders.data.map((order) => (
        <li key={order.orderId}>
          <Link
            href={paths.order(order.orderId)}
            className="flex gap-4 rounded-card bg-surface p-4 ring-1 ring-line transition-shadow hover:shadow-raised"
          >
            <ProductImage
              src={order.firstItem.image}
              alt=""
              sizes="80px"
              className="w-16 shrink-0 rounded-control sm:w-20"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-mono text-sm font-bold text-ink">{order.orderId}</p>
                <OrderStatusBadge status={order.status} />
              </div>
              <p className="mt-1 line-clamp-1 text-sm font-semibold text-ink">
                {order.firstItem.productName}
                {order.otherItemsCount > 0 ? (
                  <span className="font-normal text-ink-muted">
                    {" "}
                    and {order.otherItemsCount} more
                  </span>
                ) : null}
              </p>
              <p className="mt-1 text-sm text-ink-muted">
                Ordered {formatDate(order.orderDate)} · {order.paymentMethod}
              </p>
            </div>
            <p className="shrink-0 text-right font-bold text-ink">{formatPrice(order.total)}</p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
