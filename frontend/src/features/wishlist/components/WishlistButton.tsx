"use client";

import { usePathname } from "next/navigation";
import { HeartFilledIcon, HeartIcon } from "@/components/icons";
import type { ProductSummary } from "@nivora/shared/domain/types";
import { useRequireAuth } from "@/features/auth/hooks/useRequireAuth";
import { cn } from "@/lib/cn";
import { useToggleWishlist, useWishlist } from "../hooks/useWishlist";

/**
 * Wishlist toggle for cards and Product Details (requirements §18): filled when saved; guests
 * get the login prompt and the product is added after login.
 */
export function WishlistButton({
  product,
  variant = "icon",
}: {
  product: Pick<ProductSummary, "id" | "name">;
  variant?: "icon" | "button";
}) {
  const { data } = useWishlist();
  const toggle = useToggleWishlist();
  const requireAuth = useRequireAuth();
  const pathname = usePathname();
  const saved = Boolean(data?.some((item) => item.id === product.id));
  const label = saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`;

  const onClick = () =>
    requireAuth({ type: "wishlist-add", productId: product.id, returnTo: pathname }, () =>
      toggle.mutate({ product: product as ProductSummary, add: !saved }),
    );

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={saved}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-control px-5 font-semibold whitespace-nowrap text-brand-800 ring-1 ring-line-strong ring-inset hover:bg-brand-50"
      >
        {saved ? <HeartFilledIcon className="text-sale" /> : <HeartIcon />}
        {saved ? "Wishlisted" : "Wishlist"}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={label}
      title={label}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full bg-surface/95 shadow-card ring-1 ring-line transition-colors hover:bg-surface",
        saved ? "text-sale" : "text-ink-muted hover:text-sale",
      )}
    >
      {saved ? <HeartFilledIcon className="size-5" /> : <HeartIcon className="size-5" />}
    </button>
  );
}
