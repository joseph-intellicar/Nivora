import type { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader, type HeaderSlots } from "./SiteHeader";
import { SkipLink } from "./SkipLink";

/** Header + main + footer frame for shop pages and the global 404 page. */
export function ShopShell({
  children,
  headerSlots,
}: {
  children: ReactNode;
  headerSlots?: HeaderSlots;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <SiteHeader slots={headerSlots} />
      <main id="content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
