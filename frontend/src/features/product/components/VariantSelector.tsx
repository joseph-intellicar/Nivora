"use client";

import type { Product, StockAdjustments } from "@nivora/shared/domain/types";
import { cn } from "@/lib/cn";
import { valueState, type Selection } from "@nivora/shared/domain/variantSelection";

type VariantSelectorProps = {
  product: Product;
  selection: Selection;
  adjustments: StockAdjustments;
  onChange: (option: string, value: string) => void;
  /** Option name with a "please select" error. */
  errorOption: string | null;
  idPrefix: string;
};

/**
 * One radio group per option (requirements §16.2, arch §18). Values that are out of stock (or
 * don't exist with the other choices) are disabled and announced as unavailable.
 */
export function VariantSelector({
  product,
  selection,
  adjustments,
  onChange,
  errorOption,
  idPrefix,
}: VariantSelectorProps) {
  return (
    <div className="flex flex-col gap-4">
      {product.options.map((option) => {
        const errorId = `${idPrefix}-${option.name}-error`;
        const hasError = errorOption === option.name;
        return (
          <fieldset
            key={option.name}
            id={`${idPrefix}-${option.name}`}
            tabIndex={-1}
            aria-describedby={hasError ? errorId : undefined}
            className="focus:outline-none"
          >
            <legend className="mb-2.5 text-sm font-bold tracking-wide text-ink uppercase">
              {`Select ${option.name}`}
              {selection[option.name] ? (
                <span className="font-medium tracking-normal text-ink-muted normal-case">
                  : {selection[option.name]}
                </span>
              ) : null}
            </legend>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={option.name}>
              {option.values.map((value) => {
                const state = valueState(product, selection, option.name, value, adjustments);
                const disabled = !state.inStock;
                const checked = selection[option.name] === value;
                const inputId = `${idPrefix}-${option.name}-${value}`.replace(
                  /[^a-zA-Z0-9_-]/g,
                  "-",
                );
                return (
                  <label
                    key={value}
                    htmlFor={inputId}
                    className={cn(
                      "relative inline-flex h-11 min-w-14 cursor-pointer items-center justify-center rounded-full px-5 text-sm font-semibold whitespace-nowrap ring-1 ring-inset transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-600",
                      checked
                        ? "bg-brand-700 text-white ring-brand-700"
                        : "bg-surface text-ink ring-line-strong hover:bg-brand-50",
                      disabled &&
                        "cursor-not-allowed bg-canvas text-ink-subtle line-through ring-line hover:bg-canvas",
                      hasError && !checked && "ring-danger",
                    )}
                  >
                    <input
                      id={inputId}
                      type="radio"
                      name={`${idPrefix}-${option.name}`}
                      value={value}
                      checked={checked}
                      disabled={disabled}
                      onChange={() => onChange(option.name, value)}
                      className="sr-only"
                    />
                    {value}
                    {disabled ? <span className="sr-only"> (unavailable)</span> : null}
                  </label>
                );
              })}
            </div>
            {hasError ? (
              <p id={errorId} role="alert" className="mt-2 text-sm font-medium text-danger">
                Please select a {option.name.toLowerCase()}.
              </p>
            ) : null}
          </fieldset>
        );
      })}
    </div>
  );
}
