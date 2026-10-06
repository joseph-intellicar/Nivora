import type { ReactNode } from "react";
import { AlertIcon } from "@/components/icons";
import { cn } from "@/lib/cn";
import { Button } from "./Button";

type ErrorStateProps = {
  title?: string;
  description?: string;
  /** Shows a "Try again" button (client components only). */
  onRetry?: () => void;
  retryLabel?: string;
  /** Extra action, e.g. a link back to Home. */
  action?: ReactNode;
  className?: string;
};

/** Customer-friendly error with a way to recover (requirements §28, §29.2). */
export function ErrorState({
  title = "Something went wrong.",
  description = "Please try again. If the problem continues, come back a little later.",
  onRetry,
  retryLabel = "Try again",
  action,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn("flex flex-col items-center px-4 py-12 text-center", className)}
    >
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-danger-soft text-danger">
        <AlertIcon className="size-8" />
      </div>
      <h2 className="text-xl font-bold text-ink">{title}</h2>
      <p className="mt-2 max-w-md text-ink-muted">{description}</p>
      {onRetry || action ? (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {onRetry ? <Button onClick={onRetry}>{retryLabel}</Button> : null}
          {action}
        </div>
      ) : null}
    </div>
  );
}
