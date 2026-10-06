"use client";

import { useId, type InputHTMLAttributes, type Ref } from "react";
import { controlClasses, describedBy, FieldShell } from "./FieldShell";

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  hint?: string;
  error?: string;
  hideLabel?: boolean;
  id?: string;
  ref?: Ref<HTMLInputElement>;
  wrapperClassName?: string;
};

export function Input({
  label,
  hint,
  error,
  hideLabel,
  id,
  required,
  wrapperClassName,
  className,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <FieldShell
      id={inputId}
      label={label}
      hint={hint}
      error={error}
      required={required}
      hideLabel={hideLabel}
      className={wrapperClassName}
    >
      <input
        id={inputId}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(inputId, hint, error)}
        className={controlClasses(Boolean(error)) + (className ? ` ${className}` : "")}
        {...props}
      />
    </FieldShell>
  );
}
