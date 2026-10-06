import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  /** Primary action, e.g. a "Continue Shopping" link. */
  action?: ReactNode;
  headingLevel?: "h1" | "h2" | "h3";
  className?: string;
};

/** Friendly empty state with a way forward (requirements §29.1). */
export function EmptyState({
  title,
  description,
  icon,
  action,
  headingLevel: Heading = "h2",
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center px-4 py-12 text-center", className)}>
      {icon ? (
        <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-brand-50 text-brand-700 [&_svg]:size-8">
          {icon}
        </div>
      ) : null}
      <Heading className="text-xl font-bold text-ink">{title}</Heading>
      {description ? <p className="mt-2 max-w-md text-ink-muted">{description}</p> : null}
      {action ? <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div> : null}
    </div>
  );
}
