import Link from "next/link";
import type { ReactNode } from "react";
import { CartIcon, HeartIcon } from "@/components/icons";
import { paths } from "@/config/routes";
import { Container } from "./Container";
import { HeaderSearch } from "./HeaderSearch";
import { Logo } from "./Logo";

const actionClass =
  "relative inline-flex size-10 items-center sm:size-11 justify-center rounded-full text-ink hover:bg-brand-50 hover:text-brand-800";

/**
 * Shop header (requirements §8.1). Session-aware pieces arrive as slots from features/shell.
 */
/** Feature-owned pieces injected by features/shell (components may not import features). */
export type HeaderSlots = {
  /** Hamburger menu (below lg). */
  mobileMenu?: ReactNode;
  /** Desktop main navigation row. */
  nav?: ReactNode;
  account?: ReactNode;
  /** Header search box; receives the input id (desktop and mobile copies). */
  search?: (id: string) => ReactNode;
  wishlist?: ReactNode;
  cart?: ReactNode;
};

export function SiteHeader({ slots = {} }: { slots?: HeaderSlots }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface">
      <Container className="flex h-16 items-center gap-1 sm:gap-4">
        {slots.mobileMenu}
        <Link href={paths.home()} aria-label="Nivora home" className="shrink-0 rounded-control">
          <Logo />
        </Link>
        <div className="hidden min-w-0 flex-1 md:block">
          {slots.search ? (
            slots.search("header-search-desktop")
          ) : (
            <HeaderSearch id="header-search-desktop" />
          )}
        </div>
        <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
          {slots.wishlist ?? (
            <Link href={paths.wishlist()} aria-label="Wishlist" className={actionClass}>
              <HeartIcon />
            </Link>
          )}
          {slots.cart ?? (
            <Link href={paths.cart()} aria-label="Cart" className={actionClass}>
              <CartIcon />
            </Link>
          )}
          {slots.account}
        </div>
      </Container>
      <Container className="pb-3 md:hidden">
        {slots.search ? (
          slots.search("header-search-mobile")
        ) : (
          <HeaderSearch id="header-search-mobile" />
        )}
      </Container>
      {slots.nav}
    </header>
  );
}
