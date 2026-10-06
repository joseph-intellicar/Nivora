import { cn } from "@/lib/cn";

/** Placeholder block shown while content loads. Decorative: pair with a status message. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("animate-pulse rounded-control bg-line", className)} />
  );
}
