"use client";

import { useId, type ReactNode, type Ref, type SelectHTMLAttributes } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { controlClasses, describedBy, FieldShell } from "./FieldShell";

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> & {
  label: string;
  hint?: string;
  error?: string;
  hideLabel?: boolean;
  id?: string;
  ref?: Ref<HTMLSelectElement>;
  wrapperClassName?: string;
  children: ReactNode;
};

export function Select({
  label,
  hint,
  error,
  hideLabel,
  id,
  required,
  wrapperClassName,
  className,
  children,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  return (
    <FieldShell
      id={selectId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      hideLabel={hideLabel}
      className={wrapperClassName}
    >
      <div className="relative">
        <select
          id={selectId}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(selectId, hint, error)}
          className={`${controlClasses(Boolean(error))} appearance-none pr-10 ${className ?? ""}`}
          {...props}
        >
          {children}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-muted" />
      </div>
    </FieldShell>
  );
}
