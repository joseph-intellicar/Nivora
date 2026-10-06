import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

type PriceProps = {
  /** Current selling price in whole rupees. */
  price: number;
  /** Original price (MRP); shown struck through when higher than the price. */
  originalPrice?: number;
  /** Discount percentage, calculated by the domain layer. Shown when greater than 0. */
  discountPercent?: number;
  /** e.g. "From" for products whose variants have different prices. */
  prefix?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClasses = {
  sm: { price: "text-base", meta: "text-xs" },
  md: { price: "text-lg", meta: "text-sm" },
  lg: { price: "text-3xl", meta: "text-base" },
};

export function Price({
  price,
  originalPrice,
  discountPercent,
  prefix,
  size = "md",
  className,
}: PriceProps) {
  const showOriginal = originalPrice !== undefined && originalPrice > price;
  const sizes = sizeClasses[size];
  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span className={cn("font-extrabold text-ink", sizes.price)}>
        {prefix ? <span className="mr-1 font-semibold text-ink-muted">{prefix}</span> : null}
        <span className="sr-only">Price </span>
        {formatPrice(price)}
      </span>
      {showOriginal ? (
        <del className={cn("text-ink-subtle", sizes.meta)}>
          <span className="sr-only">Original price </span>
          {formatPrice(originalPrice)}
        </del>
      ) : null}
      {discountPercent !== undefined && discountPercent > 0 ? (
        <span className={cn("font-bold text-sale", sizes.meta)}>{discountPercent}% off</span>
      ) : null}
    </p>
  );
}
