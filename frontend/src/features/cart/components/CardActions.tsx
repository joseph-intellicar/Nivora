"use client";

import { CartIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import type { ProductSummary } from "@nivora/shared/domain/types";
import { liveInStock, useInventory } from "@/features/catalog/hooks/useInventory";
import { useVariantPickerStore } from "@/stores/variantPickerStore";
import { useAddToCart } from "../hooks/useCart";

type CardProduct = Pick<
  ProductSummary,
  | "slug"
  | "name"
  | "inStock"
  | "variantIds"
  | "initialStock"
  | "singleVariantId"
  | "requiresOptions"
>;

/**
 * Card Add to Cart (requirements §14, decision D13): single-variant products are added
 * directly; products with options open the variant picker; sold-out products are disabled.
 */
export function CardActions({ product }: { product: CardProduct }) {
  const { data: adjustments } = useInventory();
  const addToCart = useAddToCart();
  const openPicker = useVariantPickerStore((state) => state.open);
  const inStock = adjustments ? liveInStock(product, adjustments) : product.inStock;

  if (!inStock) {
    return (
      <Button size="sm" variant="secondary" fullWidth disabled>
        Out of Stock
      </Button>
    );
  }
  return (
    <Button
      size="sm"
      variant="secondary"
      fullWidth
      loading={addToCart.isPending}
      aria-label={`Add ${product.name} to cart`}
      onClick={() =>
        product.singleVariantId && !product.requiresOptions
          ? addToCart.add({ variantId: product.singleVariantId, quantity: 1 })
          : openPicker(product.slug, "add-to-cart")
      }
    >
      <CartIcon className="size-4" />
      Add to Cart
    </Button>
  );
}
