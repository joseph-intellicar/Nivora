"use client";

import Link from "next/link";
import { ChevronLeftIcon } from "@/components/icons";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { paths } from "@/config/routes";
import { AddressText } from "@/features/addresses/components/AddressCard";
import { formatDateTime } from "@/lib/format";
import { isNotFound, useOrder } from "../hooks/useOrders";
import { CancelOrderButton } from "./CancelOrderDialog";
import { OrderItems } from "./OrderItems";
import { OrderNotFound } from "./OrderNotFound";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderTotals } from "./OrderTotals";
import { StatusTimeline } from "./StatusTimeline";

/** Order Details (requirements §25.4): own orders only; Cancel where allowed. */
export function OrderDetailsView({ orderId }: { orderId: string }) {
  const order = useOrder(orderId);
  if (order.isPending)
    return (
      <div className="space-y-3">
        <p role="status" className="sr-only">
          Loading order…
        </p>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  if (order.isError)
    return isNotFound(order.error) ? (
      <OrderNotFound />
    ) : (
      <ErrorState onRetry={() => order.refetch()} />
    );
  const data = order.data;
  return (
    <div className="flex flex-col gap-5">
      <Link
        href={paths.orders()}
        className="inline-flex items-center gap-1 self-start text-sm font-semibold text-brand-700 hover:underline"
      >
        <ChevronLeftIcon className="size-4" /> All orders
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex flex-wrap items-center gap-3 text-2xl font-extrabold tracking-tight text-ink">
            Order {data.orderId} <OrderStatusBadge status={data.status} />
          </h1>
          <p className="mt-1 text-sm text-ink-muted">Placed on {formatDateTime(data.orderDate)}</p>
        </div>
        <CancelOrderButton order={data} />
      </div>
      <section aria-label="Order status" className="rounded-card bg-surface p-5 ring-1 ring-line">
        <StatusTimeline order={data} />
      </section>
      <section
        aria-labelledby="order-items"
        className="rounded-card bg-surface p-5 ring-1 ring-line"
      >
        <h2 id="order-items" className="text-lg font-bold text-ink">
          Items
        </h2>
        <OrderItems items={data.items} />
      </section>
      <div className="grid gap-5 sm:grid-cols-2">
        <section
          aria-labelledby="order-address"
          className="rounded-card bg-surface p-5 ring-1 ring-line"
        >
          <h2 id="order-address" className="mb-2 text-lg font-bold text-ink">
            Delivery address
          </h2>
          <AddressText address={data.deliveryAddress} />
        </section>
        <section
          aria-labelledby="order-payment"
          className="rounded-card bg-surface p-5 ring-1 ring-line"
        >
          <h2 id="order-payment" className="mb-3 text-lg font-bold text-ink">
            Payment summary
          </h2>
          <OrderTotals order={data} />
        </section>
      </div>
    </div>
  );
}
