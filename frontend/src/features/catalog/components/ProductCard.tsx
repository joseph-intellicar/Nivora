import Link from "next/link";
import type { ReactNode } from "react";
import { Price } from "@/components/ui/Price";
import { ProductImage } from "@/components/ui/ProductImage";
import { Rating } from "@/components/ui/Rating";
import { paths } from "@/config/routes";
import type { ProductSummary } from "@nivora/shared/domain/types";
import { CardActions } from "@/features/cart/components/CardActions";
import { WishlistButton } from "@/features/wishlist/components/WishlistButton";
import { CardAvailability } from "./CardAvailability";

type ProductCardProps = {
  product: ProductSummary;
  /** Replaces the default Add to Cart action (e.g. Move to Cart on the Wishlist page). */
  actions?: ReactNode;
  /** Replaces the default wishlist heart over the image. */
  overlayAction?: ReactNode;
  /** Above-the-fold cards load their image eagerly. */
  priority?: boolean;
  headingLevel?: "h2" | "h3";
};

/** Only what the client island needs (keeps the RSC payload small). */
const cardProduct = (p: ProductSummary) => ({
  slug: p.slug,
  name: p.name,
  inStock: p.inStock,
  variantIds: p.variantIds,
  initialStock: p.initialStock,
  singleVariantId: p.singleVariantId,
  requiresOptions: p.requiresOptions,
});

const SIZES = "(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw";

/**
 * The one product card used everywhere products are listed (requirements §14).
 * Server-rendered: image, name, rating and prices are in the HTML; stock overlay and actions
 * are small client islands.
 */
export function ProductCard({
  product,
  actions,
  overlayAction,
  priority = false,
  headingLevel: Heading = "h3",
}: ProductCardProps) {
  const href = paths.product(product.slug);
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card bg-surface shadow-card ring-1 ring-line transition-shadow hover:shadow-raised">
      <div className="relative">
        <Link href={href} tabIndex={-1} aria-hidden="true">
          <ProductImage
            src={product.image}
            alt={product.name}
            sizes={SIZES}
            priority={priority}
            className="transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>
        <CardAvailability summary={product} />
        <div className="absolute top-2 right-2 z-10">
          {overlayAction ?? <WishlistButton product={{ id: product.id, name: product.name }} />}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-3 sm:p-4">
        <p className="text-xs font-semibold tracking-wide text-ink-subtle uppercase">
          {product.brand}
        </p>
        <Heading className="line-clamp-2 min-h-10 text-sm leading-5 font-semibold text-ink">
          <Link href={href} className="hover:text-brand-700 hover:underline">
            {product.name}
          </Link>
        </Heading>
        <Rating value={product.rating} reviewCount={product.reviewCount} />
        <Price
          price={product.price}
          originalPrice={product.originalPrice}
          discountPercent={product.discountPercent}
          prefix={product.hasPriceRange ? "From" : undefined}
          size="sm"
          className="mt-auto pt-1"
        />
        <div className="pt-2">{actions ?? <CardActions product={cardProduct(product)} />}</div>
      </div>
    </article>
  );
}
