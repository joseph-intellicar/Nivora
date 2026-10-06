"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/api/client";
import { Button } from "@/components/ui/Button";
import { paths } from "@/config/routes";
import { maxAddable } from "@/domain/stock";
import type { Product } from "@/domain/types";
import { useRequireAuth } from "@/features/auth/hooks/useRequireAuth";
import { useAddToCart, useCart } from "@/features/cart/hooks/useCart";
import { useInventory } from "@/features/catalog/hooks/useInventory";
import { WishlistButton } from "@/features/wishlist/components/WishlistButton";
import { formatPrice } from "@/lib/format";
import { getErrorMessage } from "@/lib/errorMessages";
import { toast } from "@/stores/toastStore";
import {
  clampQuantity,
  initialSelection,
  missingOption,
  priceFor,
  selectedVariant,
  stockFor,
  type Selection,
} from "../variantSelection";
import { QuantitySelector } from "./QuantitySelector";
import { DeliveryInfo } from "./DeliveryInfo";
import { StockStatus } from "./StockStatus";
import { VariantSelector } from "./VariantSelector";

/**
 * Product Details purchase controls (requirements §16–§19): variants, quantity, live stock,
 * Add to Cart, Buy Now and Wishlist. Server-rendered with initial stock, then live.
 */
export function PurchasePanel({ product }: { product: Product }) {
  const { data: adjustments = {} } = useInventory();
  const { data: cart } = useCart();
  const addToCart = useAddToCart();
  const requireAuth = useRequireAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [selection, setSelection] = useState<Selection>(() => initialSelection(product));
  const [quantity, setQuantity] = useState(1);
  const [errorOption, setErrorOption] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [buying, setBuying] = useState(false);

  const variant = selectedVariant(product, selection);
  const price = priceFor(product, selection, adjustments);
  const stock = stockFor(product, selection, adjustments);
  const inCart = variant
    ? (cart?.lines.find((line) => line.variantId === variant.id)?.quantity ?? 0)
    : 0;
  const soldOut = stock === 0;
  const qty = clampQuantity(quantity, stock);

  const choose = (option: string, value: string) => {
    setSelection((current) => ({ ...current, [option]: value }));
    setErrorOption(null);
    setMessage(null);
  };

  /** Shared checks before Add to Cart / Buy Now (requirements §17.1, §19). */
  const ready = () => {
    const missing = missingOption(product, selection);
    if (missing) {
      setErrorOption(missing);
      document.getElementById(`pdp-${missing}`)?.focus();
      return null;
    }
    if (!variant || stock === 0) {
      setMessage("This item is currently out of stock.");
      return null;
    }
    return variant;
  };

  const onAddToCart = () => {
    const chosen = ready();
    if (!chosen) return;
    const more = maxAddable(stock, inCart);
    if (qty > more) {
      setMessage(
        more === 0
          ? `You already have all ${stock} available in your cart.`
          : `Only ${more} more can be added (${inCart} already in your cart).`,
      );
      return;
    }
    setMessage(null);
    addToCart.add({ variantId: chosen.id, quantity: qty }, { onError: setMessage });
  };

  const onBuyNow = () => {
    const chosen = ready();
    if (!chosen) return;
    setMessage(null);
    requireAuth(
      { type: "buy-now", variantId: chosen.id, quantity: qty, returnTo: pathname },
      async () => {
        setBuying(true);
        try {
          await api.checkout.startBuyNow({ variantId: chosen.id, quantity: qty });
          router.push(paths.checkout());
        } catch (error) {
          toast.error(getErrorMessage(error));
          setBuying(false);
        }
      },
    );
  };

  const actions = (layout: "inline" | "bar") => (
    <div
      className={
        layout === "bar" ? "flex gap-2" : "grid grid-cols-2 gap-3 xl:grid-cols-[1fr_1fr_auto]"
      }
    >
      <Button
        size="lg"
        variant="secondary"
        fullWidth
        onClick={onAddToCart}
        loading={addToCart.isPending}
        disabled={soldOut}
      >
        Add to Cart
      </Button>
      <Button
        size="lg"
        fullWidth
        onClick={onBuyNow}
        loading={buying}
        disabled={soldOut}
        className="bg-accent-600 hover:bg-accent-700"
      >
        Buy Now
      </Button>
      {layout === "inline" ? (
        <div className="col-span-2 xl:col-span-1">
          <WishlistButton product={product} variant="button" />
        </div>
      ) : null}
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {price.isRange ? (
            <span className="text-lg font-semibold text-ink-muted">From</span>
          ) : null}
          <span className="text-3xl font-extrabold tracking-tight text-ink">
            <span className="sr-only">Price </span>
            {formatPrice(price.price)}
          </span>
          {price.originalPrice > price.price ? (
            <span className="text-base text-ink-subtle">
              MRP <del>{formatPrice(price.originalPrice)}</del>
            </span>
          ) : null}
          {price.discountPercent > 0 ? (
            <span className="rounded-full bg-sale-soft px-2.5 py-0.5 text-sm font-bold text-sale">
              {price.discountPercent}% off
            </span>
          ) : null}
        </p>
        <p className="text-sm font-medium text-success">Inclusive of all taxes</p>
        <div className="mt-1">
          <StockStatus available={stock} />
        </div>
      </div>
      {product.options.length > 0 ? (
        <VariantSelector
          product={product}
          selection={selection}
          adjustments={adjustments}
          onChange={choose}
          errorOption={errorOption}
          idPrefix="pdp"
        />
      ) : null}
      <div className="flex flex-col gap-2.5">
        <span className="text-sm font-bold tracking-wide text-ink uppercase">Quantity</span>
        <div className="flex flex-wrap items-center gap-3">
          <QuantitySelector value={qty} max={stock} onChange={setQuantity} disabled={soldOut} />
          {variant && stock > 0 && qty >= stock ? (
            <span className="text-xs text-ink-muted">Maximum available</span>
          ) : null}
          {inCart > 0 ? (
            <span className="text-xs text-ink-muted">{inCart} already in your cart</span>
          ) : null}
        </div>
      </div>
      {message ? (
        <p role="alert" className="text-sm font-medium text-danger">
          {message}
        </p>
      ) : null}
      <div className="hidden md:block">{actions("inline")}</div>
      <div className="md:hidden">
        <WishlistButton product={product} variant="button" />
      </div>
      <DeliveryInfo />
      {/* Phones: purchase buttons stay within reach (requirements §30). */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 p-3 backdrop-blur md:hidden">
        {actions("bar")}
      </div>
    </div>
  );
}
