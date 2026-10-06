"use client";

import Link from "next/link";
import { CheckIcon } from "@/components/icons";
import { Container } from "@/components/layout/Container";
import { buttonClasses } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { paths } from "@/config/routes";
import { AddressText } from "@/features/addresses/components/AddressCard";
import { deliveryWindow } from "../delivery";
import { isNotFound, useOrder } from "../hooks/useOrders";
import { OrderItems } from "./OrderItems";
import { OrderNotFound } from "./OrderNotFound";
import { OrderTotals } from "./OrderTotals";

/** Order confirmation (requirements §24.3). Only reads the order, so refreshing is safe. */
export function OrderConfirmationView({ orderId }: { orderId: string }) {
  const order = useOrder(orderId);
  if (order.isPending) {
    return (
      <Container className="py-8">
        <p role="status" className="sr-only">
          Loading your order…
        </p>
        <Skeleton className="h-64 w-full" />
      </Container>
    );
  }
  if (order.isError) {
    return (
      <Container className="py-8">
        {isNotFound(order.error) ? (
          <OrderNotFound />
        ) : (
          <ErrorState onRetry={() => order.refetch()} />
        )}
      </Container>
    );
  }
  const data = order.data;
  return (
    <Container className="max-w-3xl py-8">
      <div className="rounded-card bg-surface p-6 text-center shadow-card ring-1 ring-line sm:p-8">
        <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-success-soft text-success">
          <CheckIcon className="size-8" />
        </span>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Thank you for shopping with Nivora!
        </h1>
        <p className="mt-2 text-ink-muted">Your order has been placed.</p>
        <p className="mt-4 inline-block rounded-control bg-canvas px-4 py-2 font-mono text-lg font-bold text-ink">
          Order {data.orderId}
        </p>
        <p className="mt-3 text-sm text-ink-muted">
          Estimated delivery:{" "}
          <span className="font-semibold text-ink">
            {deliveryWindow(data.deliveryOption, data.orderDate)}
          </span>
        </p>
        <p className="text-sm font-semibold text-ink">Payment: {data.paymentMethod}</p>
      </div>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <section
          aria-labelledby="confirm-items"
          className="rounded-card bg-surface p-5 ring-1 ring-line sm:col-span-2"
        >
          <h2 id="confirm-items" className="text-lg font-bold text-ink">
            Items
          </h2>
          <OrderItems items={data.items} />
        </section>
        <section
          aria-labelledby="confirm-address"
          className="rounded-card bg-surface p-5 ring-1 ring-line"
        >
          <h2 id="confirm-address" className="mb-2 text-lg font-bold text-ink">
            Delivering to
          </h2>
          <AddressText address={data.deliveryAddress} />
        </section>
        <section
          aria-labelledby="confirm-total"
          className="rounded-card bg-surface p-5 ring-1 ring-line"
        >
          <h2 id="confirm-total" className="mb-3 text-lg font-bold text-ink">
            Payment summary
          </h2>
          <OrderTotals order={data} />
        </section>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href={paths.order(data.orderId)} className={buttonClasses({ size: "lg" })}>
          View Order Details
        </Link>
        <Link href={paths.home()} className={buttonClasses({ size: "lg", variant: "secondary" })}>
          Continue Shopping
        </Link>
      </div>
    </Container>
  );
}
