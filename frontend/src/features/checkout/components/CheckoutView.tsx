"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { CartIcon, TruckIcon } from "@/components/icons";
import { Container } from "@/components/layout/Container";
import { Button, buttonClasses } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Radio } from "@/components/ui/Radio";
import { Skeleton } from "@/components/ui/Skeleton";
import { DELIVERY, PAYMENT_METHOD } from "@/config/constants";
import { paths } from "@/config/routes";
import { deliveryCharge } from "@/domain/pricing";
import type { DeliveryOption } from "@/domain/types";
import { AddressManager } from "@/features/addresses/components/AddressManager";
import { useAddresses } from "@/features/addresses/hooks/useAddresses";
import { FormAlert } from "@/features/auth/components/FormAlert";
import { PriceSummary } from "@/features/cart/components/PriceSummary";
import { deliveryWindow } from "@/features/orders/delivery";
import { formatPrice } from "@/lib/format";
import { getErrorMessage } from "@/lib/errorMessages";
import { useCheckout, usePlaceOrder } from "../hooks/useCheckout";
import { CheckoutLines } from "./CheckoutLines";

function Step({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return (
    <section
      aria-labelledby={`step-${number}`}
      className="rounded-card bg-surface p-4 shadow-card ring-1 ring-line sm:p-6"
    >
      <h2 id={`step-${number}`} className="mb-4 flex items-center gap-3 text-lg font-bold text-ink">
        <span
          aria-hidden="true"
          className="inline-flex size-7 items-center justify-center rounded-full bg-brand-700 text-sm text-white"
        >
          {number}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

/**
 * Checkout (requirements §20–§23): Address → Delivery → Order Summary → Payment (Cash on Delivery)
 * → Place Order. Works for both cart checkout and Buy Now.
 */
export function CheckoutView() {
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>("standard");
  const [chosenAddress, setChosenAddress] = useState<string | null | undefined>(undefined);
  const addresses = useAddresses();
  const checkout = useCheckout(deliveryOption);
  const placeOrder = usePlaceOrder();

  if (checkout.isPending || addresses.isPending) {
    return (
      <Container className="py-8">
        <p role="status" className="sr-only">
          Loading checkout…
        </p>
        <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
          <Skeleton className="h-72 w-full" />
        </div>
      </Container>
    );
  }
  if (checkout.isError || !checkout.data) {
    return (
      <Container className="py-8">
        <ErrorState onRetry={() => checkout.refetch()} />
      </Container>
    );
  }

  const view = checkout.data;
  if (view.lines.length === 0) {
    return (
      <Container className="py-8">
        <EmptyState
          headingLevel="h1"
          icon={<CartIcon />}
          title="Your cart is empty."
          description="Add something to your cart to check out."
          action={
            <Link href={paths.home()} className={buttonClasses({ size: "lg" })}>
              Continue Shopping
            </Link>
          }
        />
      </Container>
    );
  }

  // Default (or first) address is preselected until the customer chooses (requirements §21).
  const list = addresses.data ?? [];
  const addressId =
    chosenAddress === undefined
      ? ((list.find((a) => a.isDefault) ?? list[0])?.id ?? null)
      : chosenAddress;
  const validAddress = addressId !== null && list.some((a) => a.id === addressId);
  const blockedReason =
    view.issues.length > 0
      ? "Some items are no longer available in the quantity you chose. Please update your cart."
      : !validAddress
        ? "Please add or select a delivery address."
        : null;
  const valueAfterDiscount = view.summary.subtotal - view.summary.discount;
  const chargeFor = (option: DeliveryOption) =>
    deliveryCharge(valueAfterDiscount, option, view.summary.itemCount);

  const submit = () => {
    if (!validAddress || blockedReason || placeOrder.isPending || placeOrder.isSuccess) return;
    placeOrder.mutate({ addressId: addressId!, deliveryOption });
  };
  const placing = placeOrder.isPending || placeOrder.isSuccess;
  const placeButton = (
    <Button
      size="lg"
      fullWidth
      onClick={submit}
      disabled={Boolean(blockedReason)}
      loading={placing}
      className="bg-accent-600 hover:bg-accent-700"
    >
      {placing ? "Placing your order…" : "Place Order"}
    </Button>
  );

  return (
    <Container className="py-6 pb-28 sm:py-8 lg:pb-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">Checkout</h1>
      <p className="mt-1 text-sm text-ink-muted">
        {view.source === "buy_now"
          ? "Buying 1 item now. Your cart is unchanged."
          : "Checking out the items in your cart."}
      </p>
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="flex flex-col gap-5">
          <Step number={1} title="Delivery Address">
            <AddressManager mode="select" selectedId={addressId} onSelect={setChosenAddress} />
          </Step>
          <Step number={2} title="Delivery Options">
            <fieldset className="flex flex-col gap-3">
              <legend className="sr-only">Delivery option</legend>
              {(["standard", "express"] as const).map((option) => {
                const charge = chargeFor(option);
                return (
                  <div
                    key={option}
                    className="rounded-card p-3 ring-1 ring-line has-[:checked]:ring-2 has-[:checked]:ring-brand-600"
                  >
                    <Radio
                      name="delivery-option"
                      checked={deliveryOption === option}
                      onChange={() => setDeliveryOption(option)}
                      label={
                        <span className="flex flex-wrap items-center gap-x-2 font-semibold">
                          <TruckIcon className="size-4 text-brand-700" />
                          {DELIVERY[option].label}
                          <span className={charge === 0 ? "text-success" : "text-ink"}>
                            · {charge === 0 ? "Free" : formatPrice(charge)}
                          </span>
                        </span>
                      }
                      description={`${DELIVERY[option].estimatedDays.min}–${DELIVERY[option].estimatedDays.max} days · Arrives ${deliveryWindow(option)}`}
                    />
                  </div>
                );
              })}
            </fieldset>
          </Step>
          <Step number={3} title="Order Summary">
            <p className="mb-1 text-xs font-semibold tracking-wide text-ink-subtle uppercase">
              {view.source === "buy_now" ? "Buy Now" : "From your cart"}
            </p>
            <CheckoutLines lines={view.lines} />
            {view.source === "cart" ? (
              <Link
                href={paths.cart()}
                className="mt-2 inline-block text-sm font-semibold text-brand-700 hover:underline"
              >
                Change quantities in your cart
              </Link>
            ) : null}
          </Step>
          <Step number={4} title="Payment Method">
            <div className="flex items-start gap-3 rounded-card bg-brand-50 p-4 ring-1 ring-brand-200">
              <span
                aria-hidden="true"
                className="mt-0.5 inline-flex size-5 items-center justify-center rounded-full bg-brand-700"
              >
                <span className="size-2 rounded-full bg-white" />
              </span>
              <div>
                <p className="font-bold text-ink">{PAYMENT_METHOD}</p>
                <p className="text-sm text-ink-muted">
                  Pay in cash when your order arrives. No card or online payment is needed.
                </p>
              </div>
            </div>
          </Step>
        </div>
        <div className="lg:sticky lg:top-24">
          <PriceSummary summary={view.summary} deliveryNote={DELIVERY[deliveryOption].label}>
            {blockedReason ? (
              <div className="mb-3">
                <FormAlert tone="error">{blockedReason}</FormAlert>
              </div>
            ) : null}
            {placeOrder.isError ? (
              <div className="mb-3">
                <FormAlert tone="error">{getErrorMessage(placeOrder.error)}</FormAlert>
              </div>
            ) : null}
            <div className="hidden lg:block">{placeButton}</div>
            <p className="mt-3 text-center text-xs text-ink-subtle">Payment: {PAYMENT_METHOD}</p>
          </PriceSummary>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center gap-4 border-t border-line bg-surface/95 p-3 backdrop-blur lg:hidden">
        <p className="shrink-0 font-extrabold text-ink">{formatPrice(view.summary.total)}</p>
        {placeButton}
      </div>
    </Container>
  );
}
