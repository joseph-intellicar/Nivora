import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = { as?: ElementType; className?: string; children: ReactNode };

/** Centered max-width wrapper with responsive side padding. */
export function Container({ as: Tag = "div", className, children }: ContainerProps) {
  return (
    <Tag className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</Tag>
  );
}
