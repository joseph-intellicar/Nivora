"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useState } from "react";
import { api, queryKeys } from "@/api/client";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Price } from "@/components/ui/Price";
import { Skeleton } from "@/components/ui/Skeleton";
import { paths } from "@/config/routes";
import type { StockAdjustments } from "@/domain/types";
import { useSession } from "@/features/auth/hooks/useSession";
import { useAddToCart } from "@/features/cart/hooks/useCart";
import { getErrorMessage } from "@/lib/errorMessages";
import { toast } from "@/stores/toastStore";
import { useVariantPickerStore } from "@/stores/variantPickerStore";
import {
  initialSelection,
  missingOption,
  priceFor,
  selectedVariant,
  stockFor,
  type Selection,
} from "../variantSelection";
import { StockStatus } from "./StockStatus";
import { VariantSelector } from "./VariantSelector";

/**
 * Shared variant picker (decision D13): choose options from a product card or the Wishlist
 * without leaving the page. Quantity 1; links to the full product page.
 */
export function VariantPickerDialog() {
  const { slug, mode, close } = useVariantPickerStore();
  if (!slug) return null;
  return <Picker key={`${slug}-${mode}`} slug={slug} mode={mode} onClose={close} />;
}

function Picker({
  slug,
  mode,
  onClose,
}: {
  slug: string;
  mode: "add-to-cart" | "move-to-cart";
  onClose: () => void;
}) {
  const product = useQuery({
    queryKey: queryKeys.product(slug),
    queryFn: () => api.catalog.getProduct(slug),
  });
  const addToCart = useAddToCart();
  const queryClient = useQueryClient();
  const { user } = useSession();
  const [selection, setSelection] = useState<Selection | null>(null);
  const [errorOption, setErrorOption] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const moveToCart = useMutation({
    mutationFn: (input: { productId: string; variantId: string }) => api.wishlist.moveToCart(input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.wishlist(user?.id ?? "") }),
        queryClient.invalidateQueries({ queryKey: queryKeys.cart(user?.id ?? null) }),
      ]);
      toast.success("Moved to your cart", { action: { label: "View Cart", href: paths.cart() } });
      onClose();
    },
    onError: (error) => setMessage(getErrorMessage(error)),
  });

  const data = product.data;
  const current = selection ?? (data ? initialSelection(data) : {});
  // The picker gets live stock per variant; express it as adjustments for the shared helpers.
  const adjustments: StockAdjustments = data
    ? Object.fromEntries(
        data.variants.map((v) => [v.id, (data.available[v.id] ?? 0) - v.initialStock]),
      )
    : {};

  const confirm = () => {
    if (!data) return;
    const missing = missingOption(data, current);
    if (missing) return setErrorOption(missing);
    const variant = selectedVariant(data, current);
    if (!variant) return setMessage("This item is currently out of stock.");
    if (mode === "move-to-cart") moveToCart.mutate({ productId: data.id, variantId: variant.id });
    else
      addToCart.add(
        { variantId: variant.id, quantity: 1 },
        { onSuccess: onClose, onError: setMessage },
      );
  };

  const stock = data ? stockFor(data, current, adjustments) : 0;
  const price = data ? priceFor(data, current, adjustments) : null;

  return (
    <Dialog
      open
      onClose={onClose}
      title={data ? data.name : "Choose options"}
      description={
        mode === "move-to-cart"
          ? "Choose options to move this item to your cart."
          : "Choose options to add this item to your cart."
      }
      footer={
        data ? (
          <>
            <Link
              href={paths.product(data.slug)}
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center px-3 text-sm font-semibold text-brand-700 hover:underline"
            >
              View full details
            </Link>
            <Button
              onClick={confirm}
              loading={addToCart.isPending || moveToCart.isPending}
              disabled={stock === 0}
            >
              {mode === "move-to-cart" ? "Move to Cart" : "Add to Cart"}
            </Button>
          </>
        ) : null
      }
    >
      {product.isPending ? (
        <div className="space-y-3" role="status" aria-label="Loading options">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-2/3" />
        </div>
      ) : !data ? (
        <p role="alert" className="text-sm text-danger">
          This product is no longer available.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {price ? (
            <Price
              price={price.price}
              originalPrice={price.originalPrice}
              discountPercent={price.discountPercent}
              prefix={price.isRange ? "From" : undefined}
            />
          ) : null}
          <StockStatus available={stock} />
          <VariantSelector
            product={data}
            selection={current}
            adjustments={adjustments}
            errorOption={errorOption}
            idPrefix="picker"
            onChange={(option, value) => {
              setSelection({ ...current, [option]: value });
              setErrorOption(null);
              setMessage(null);
            }}
          />
          {message ? (
            <p role="alert" className="text-sm font-medium text-danger">
              {message}
            </p>
          ) : null}
        </div>
      )}
    </Dialog>
  );
}
