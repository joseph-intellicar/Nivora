import { StarHalfIcon, StarIcon, StarOutlineIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { formatCount } from "@nivora/shared/lib/format";

type RatingProps = {
  /** Average rating from 0 to 5. */
  value: number;
  reviewCount?: number;
  size?: "sm" | "md";
  className?: string;
};

/** Star rating with review count, announced as one phrase to screen readers. */
export function Rating({ value, reviewCount, size = "sm", className }: RatingProps) {
  const rounded = Math.round(value * 2) / 2;
  const label =
    `Rated ${value.toFixed(1)} out of 5` +
    (reviewCount !== undefined
      ? ` from ${formatCount(reviewCount)} review${reviewCount === 1 ? "" : "s"}`
      : "");
  const star = size === "sm" ? "size-4" : "size-5";

  return (
    <div className={cn("flex items-center gap-1.5", className)} role="img" aria-label={label}>
      <span className="flex text-rating" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((position) =>
          rounded >= position ? (
            <StarIcon key={position} className={star} />
          ) : rounded >= position - 0.5 ? (
            <StarHalfIcon key={position} className={star} />
          ) : (
            <StarOutlineIcon key={position} className={cn(star, "text-line-strong")} />
          ),
        )}
      </span>
      <span
        aria-hidden="true"
        className={cn("font-semibold text-ink", size === "sm" ? "text-xs" : "text-sm")}
      >
        {value.toFixed(1)}
      </span>
      {reviewCount !== undefined ? (
        <span
          aria-hidden="true"
          className={cn("text-ink-subtle", size === "sm" ? "text-xs" : "text-sm")}
        >
          ({formatCount(reviewCount)})
        </span>
      ) : null}
    </div>
  );
}
