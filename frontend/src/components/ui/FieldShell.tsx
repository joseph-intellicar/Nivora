import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type FieldShellProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  hideLabel?: boolean;
  className?: string;
  children: ReactNode;
};

/** Label, hint and error layout shared by text inputs and selects. */
export function FieldShell({
  id,
  label,
  hint,
  error,
  required,
  hideLabel,
  className,
  children,
}: FieldShellProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className={cn("text-sm font-semibold text-ink", hideLabel && "sr-only")}>
        {label}
        {required ? (
          <span aria-hidden="true" className="text-danger">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-xs text-ink-subtle">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-xs font-medium text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function describedBy(id: string, hint?: string, error?: string): string | undefined {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

export const controlClasses = (hasError: boolean) =>
  cn(
    "h-11 w-full rounded-control bg-surface px-3 text-sm text-ink ring-1 ring-inset transition-shadow",
    "placeholder:text-ink-subtle disabled:cursor-not-allowed disabled:bg-canvas disabled:text-ink-subtle",
    "focus-visible:outline-none focus-visible:ring-2",
    hasError
      ? "ring-danger focus-visible:ring-danger"
      : "ring-line-strong focus-visible:ring-brand-600",
  );
