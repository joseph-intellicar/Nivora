import type { ReactNode, SVGProps } from "react";
import { cn } from "@/lib/cn";

export type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  /** Accessible name. When omitted the icon is decorative (aria-hidden). */
  title?: string;
};

type BaseIconProps = IconProps & { children: ReactNode; filled?: boolean };

/** Base for Nivora's in-house 24×24 stroke icons. */
export function Icon({ title, className, children, filled = false, ...props }: BaseIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-5 shrink-0", className)}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}
