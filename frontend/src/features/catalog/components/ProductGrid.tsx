import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Responsive product grid (requirements §30): 2 columns on phones, 3 on tablets, then 4–5
 * on desktop (one fewer when a filter sidebar is shown).
 */
export function ProductGrid({
  children,
  withSidebar = false,
  className,
}: {
  children: ReactNode;
  withSidebar?: boolean;
  className?: string;
}) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4",
        withSidebar ? "lg:grid-cols-3 xl:grid-cols-4" : "lg:grid-cols-4 xl:grid-cols-5",
        className,
      )}
    >
      {children}
    </ul>
  );
}

export function ProductGridItem({ children }: { children: ReactNode }) {
  return <li className="min-w-0">{children}</li>;
}
