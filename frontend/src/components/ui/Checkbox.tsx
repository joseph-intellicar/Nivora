"use client";

import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from "react";
import { cn } from "@/lib/cn";

type ChoiceProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "id"> & {
  label: ReactNode;
  description?: string;
  id?: string;
  ref?: Ref<HTMLInputElement>;
};

function Choice({
  type,
  label,
  description,
  id,
  className,
  disabled,
  ...props
}: ChoiceProps & { type: "checkbox" | "radio" }) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <div className={cn("flex items-start gap-2.5", disabled && "opacity-60", className)}>
      <input
        id={inputId}
        type={type}
        disabled={disabled}
        aria-describedby={description ? `${inputId}-desc` : undefined}
        className="mt-0.5 size-4 shrink-0 cursor-pointer accent-brand-700 disabled:cursor-not-allowed"
        {...props}
      />
      <div className="flex flex-col">
        <label
          htmlFor={inputId}
          className={cn("text-sm text-ink", disabled ? "cursor-not-allowed" : "cursor-pointer")}
        >
          {label}
        </label>
        {description ? (
          <span id={`${inputId}-desc`} className="text-xs text-ink-subtle">
            {description}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function Checkbox(props: ChoiceProps) {
  return <Choice type="checkbox" {...props} />;
}

export function Radio(props: ChoiceProps) {
  return <Choice type="radio" {...props} />;
}
