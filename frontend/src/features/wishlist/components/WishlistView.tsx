"use client";

import Link from "next/link";
import { HeartIcon, TrashIcon } from "@/components/icons";
import { Container } from "@/components/layout/Container";
import { Button, buttonClasses } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { IconButton } from "@/components/ui/IconButton";
import { Skeleton } from "@/components/ui/Skeleton";
import { paths } from "@/config/routes";
import type { ProductSummary } from "@/domain/types";
import { ProductCard } from "@/features/catalog/components/ProductCard";
import { ProductGrid, ProductGridItem } from "@/features/catalog/components/ProductGrid";
import { liveInStock, useInventory } from "@/features/catalog/hooks/useInventory";
import { useVariantPickerStore } from "@/stores/variantPickerStore";
import { useMoveToCart } from "../hooks/useMoveToCart";
import { useToggleWishlist, useWishlist } from "../hooks/useWishlist";

/** The Wishlist page (requirements §18): Move to Cart, Remove, Continue Shopping. */
export function WishlistView() {
  const wishlist = useWishlist();

  if (wishlist.isPending) {
    return (
      <Container className="py-8">
        <p role="status" className="sr-only">
          Loading your wishlist…
        </p>
        <Skeleton className="h-8 w-56" />
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="aspect-[3/4] w-full" />
          ))}
        </div>
      </Container>
    );
  }
  if (wishlist.isError) {
    return (
      <Container className="py-8">
        <ErrorState onRetry={() => wishlist.refetch()} />
      </Container>
    );
  }

  const items = wishlist.data;
  if (items.length === 0) {
    return (
      <Container className="py-8">
        <EmptyState
          headingLevel="h1"
          icon={<HeartIcon />}
          title="Your wishlist is empty."
          description="Tap the heart on any product to save it here for later."
          action={
            <Link href={paths.home()} className={buttonClasses({ size: "lg" })}>
              Explore Products
            </Link>
          }
        />
      </Container>
    );
  }

  return (
    <Container className="py-6 sm:py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Your Wishlist{" "}
          <span className="text-lg font-semibold text-ink-muted">({items.length})</span>
        </h1>
        <Link href={paths.home()} className="text-sm font-semibold text-brand-700 hover:underline">
          Continue Shopping
        </Link>
      </div>
      <ProductGrid className="mt-6">
        {items.map((product) => (
          <ProductGridItem key={product.id}>
            <ProductCard
              product={product}
              headingLevel="h2"
              overlayAction={<RemoveButton product={product} />}
              actions={<MoveToCartButton product={product} />}
            />
          </ProductGridItem>
        ))}
      </ProductGrid>
    </Container>
  );
}

function RemoveButton({ product }: { product: ProductSummary }) {
  const toggle = useToggleWishlist();
  return (
    <IconButton
      label={`Remove ${product.name} from wishlist`}
      icon={<TrashIcon className="size-4" />}
      size="sm"
      variant="outline"
      disabled={toggle.isPending}
      onClick={() => toggle.mutate({ product, add: false })}
    />
  );
}

function MoveToCartButton({ product }: { product: ProductSummary }) {
  const { data: adjustments } = useInventory();
  const move = useMoveToCart();
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
      fullWidth
      loading={move.isPending}
      aria-label={`Move ${product.name} to cart`}
      onClick={() =>
        product.singleVariantId && !product.requiresOptions
          ? move.mutate({ productId: product.id, variantId: product.singleVariantId })
          : openPicker(product.slug, "move-to-cart")
      }
    >
      Move to Cart
    </Button>
  );
}
