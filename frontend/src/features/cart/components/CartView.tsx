"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/api/client";
import { CartIcon } from "@/components/icons";
import { Container } from "@/components/layout/Container";
import { Button, buttonClasses } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import { DELIVERY } from "@nivora/shared/config/constants";
import { paths } from "@/config/routes";
import { useRequireAuth } from "@/features/auth/hooks/useRequireAuth";
import { FormAlert } from "@/features/auth/components/FormAlert";
import { formatPrice } from "@nivora/shared/lib/format";
import { getErrorMessage } from "@nivora/shared/errorMessages";
import { toast } from "@/stores/toastStore";
import { useCart, useRemoveCartLine, useUpdateCartLine } from "../hooks/useCart";
import { CartLineItem } from "./CartLineItem";
import { PriceSummary } from "./PriceSummary";

/** The Cart page (requirements §17.3–§17.5). Works for guests and customers. */
export function CartView({ merged }: { merged: boolean }) {
  const cart = useCart();
  const update = useUpdateCartLine();
  const remove = useRemoveCartLine();
  const requireAuth = useRequireAuth();
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const busy = update.isPending || remove.isPending;

  if (cart.isPending) {
    return (
      <Container className="py-8">
        <h1 className="sr-only">Your Cart</h1>
        <p role="status" className="sr-only">
          Loading your cart…
        </p>
        <Skeleton className="h-8 w-48" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem]">
          <div className="space-y-4">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-28 w-full" />
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
      </Container>
    );
  }
  if (cart.isError || !cart.data) {
    return (
      <Container className="py-8">
        <ErrorState onRetry={() => cart.refetch()} />
      </Container>
    );
  }

  const view = cart.data;
  if (view.lines.length === 0) {
    return (
      <Container className="py-8">
        {view.removed.length > 0 ? (
          <FormAlert tone="info">
            Some items in your cart are no longer available and were removed.
          </FormAlert>
        ) : null}
        <EmptyState
          headingLevel="h1"
          icon={<CartIcon />}
          title="Your cart is empty."
          description="Looks like you haven't added anything yet. Explore today's best sellers and offers."
          action={
            <Link href={paths.home()} className={buttonClasses({ size: "lg" })}>
              Continue Shopping
            </Link>
          }
        />
      </Container>
    );
  }

  const blocked = view.issues.length > 0;
  const standardNote =
    view.summary.deliveryCharge === 0
      ? "Standard Delivery · free on orders of ₹499 or more"
      : `Standard Delivery · add ${formatPrice(DELIVERY.standard.freeThreshold - (view.summary.subtotal - view.summary.discount))} more for free delivery`;

  const proceed = () =>
    requireAuth({ type: "checkout", returnTo: paths.cart() }, async () => {
      setStarting(true);
      try {
        await api.checkout.startCartCheckout();
        router.push(paths.checkout());
      } catch (error) {
        toast.error(getErrorMessage(error));
        setStarting(false);
      }
    });

  const onError = (error: unknown) => toast.error(getErrorMessage(error));

  const checkoutButton = (
    <Button size="lg" fullWidth onClick={proceed} disabled={blocked || busy} loading={starting}>
      Proceed to Checkout
    </Button>
  );

  return (
    <Container className="py-6 pb-28 sm:py-8 lg:pb-8">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
        Your Cart{" "}
        <span className="text-lg font-semibold text-ink-muted">
          ({view.summary.itemCount} {view.summary.itemCount === 1 ? "item" : "items"})
        </span>
      </h1>
      <div className="mt-4 flex flex-col gap-3">
        {merged ? (
          <FormAlert tone="info">
            We&apos;ve added items saved from your last visit. Review your cart before checking out.
          </FormAlert>
        ) : null}
        {view.removed.length > 0 ? (
          <FormAlert tone="info">
            Some items in your cart are no longer available and were removed.
          </FormAlert>
        ) : null}
        {blocked ? (
          <FormAlert tone="error">
            Some items need your attention before you can check out.
          </FormAlert>
        ) : null}
      </div>
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
        <section
          aria-label="Cart items"
          className="rounded-card bg-surface px-4 shadow-card ring-1 ring-line sm:px-6"
        >
          <ul className="divide-y divide-line">
            {view.lines.map((line) => (
              <CartLineItem
                key={line.variantId}
                line={line}
                busy={busy}
                onQuantity={(quantity) =>
                  update.mutate({ variantId: line.variantId, quantity }, { onError })
                }
                onRemove={() =>
                  remove.mutate(line.variantId, {
                    onSuccess: () => toast.info(`Removed ${line.productName} from your cart.`),
                    onError,
                  })
                }
              />
            ))}
          </ul>
          <div className="border-t border-line py-4">
            <Link
              href={paths.home()}
              className="text-sm font-semibold text-brand-700 hover:underline"
            >
              ← Continue Shopping
            </Link>
          </div>
        </section>
        <div className="lg:sticky lg:top-36">
          <PriceSummary summary={view.summary} deliveryNote={standardNote}>
            <div className="hidden lg:block">{checkoutButton}</div>
            <p className="mt-3 text-center text-xs text-ink-subtle">Payment: Cash on Delivery</p>
          </PriceSummary>
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-20 flex items-center gap-4 border-t border-line bg-surface/95 p-3 backdrop-blur lg:hidden">
        <p className="shrink-0 font-extrabold text-ink">{formatPrice(view.summary.total)}</p>
        {checkoutButton}
      </div>
    </Container>
  );
}
