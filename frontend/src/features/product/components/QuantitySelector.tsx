"use client";

import { MinusIcon, PlusIcon } from "@/components/icons";

/** − / value / + stepper (requirements §16.3): never below 1 or above the available stock. */
export function QuantitySelector({
  value,
  max,
  onChange,
  disabled = false,
  label = "Quantity",
  size = "md",
}: {
  value: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  label?: string;
  size?: "sm" | "md";
}) {
  const button = size === "sm" ? "size-8" : "size-10";
  const atMin = value <= 1;
  const atMax = value >= max;
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex items-center rounded-control ring-1 ring-line-strong ring-inset"
    >
      <button
        type="button"
        aria-label={`Decrease ${label.toLowerCase()}`}
        disabled={disabled || atMin}
        onClick={() => onChange(value - 1)}
        className={`${button} inline-flex items-center justify-center text-ink hover:bg-brand-50 disabled:cursor-not-allowed disabled:text-ink-subtle disabled:hover:bg-transparent`}
      >
        <MinusIcon className="size-4" />
      </button>
      <output
        aria-live="polite"
        aria-label={`${label} ${value}`}
        className="min-w-10 text-center text-sm font-bold text-ink"
      >
        {value}
      </output>
      <button
        type="button"
        aria-label={`Increase ${label.toLowerCase()}`}
        disabled={disabled || atMax}
        onClick={() => onChange(value + 1)}
        className={`${button} inline-flex items-center justify-center text-ink hover:bg-brand-50 disabled:cursor-not-allowed disabled:text-ink-subtle disabled:hover:bg-transparent`}
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
}
