import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label" | "children"> & {
  /** Required accessible name (icon-only buttons have no visible text). */
  label: string;
  icon: ReactNode;
  variant?: "ghost" | "outline" | "solid";
  size?: "sm" | "md";
};

const variantClasses = {
  ghost: "text-ink hover:bg-brand-50 hover:text-brand-800",
  outline: "text-ink ring-1 ring-inset ring-line-strong bg-surface hover:bg-brand-50",
  solid: "bg-brand-700 text-white hover:bg-brand-800",
};

export function IconButton({
  label,
  icon,
  variant = "ghost",
  size = "md",
  className,
  type = "button",
  ...props
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full transition-colors",
        "disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "size-9" : "size-11",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  );
}
