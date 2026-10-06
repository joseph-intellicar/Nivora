import { Suspense, type ReactNode } from "react";
import { catalog } from "@/api/server";
import { HeaderSearch } from "@/components/layout/HeaderSearch";
import { ShopShell } from "@/components/layout/ShopShell";
import { HeaderAccount } from "@/features/auth/components/HeaderAccount";
import { CartIcon } from "@/features/cart/components/CartIcon";
import { SearchBar } from "@/features/search/components/SearchBar";
import { HeaderWishlistLink } from "@/features/wishlist/components/HeaderWishlistLink";
import { MainNav } from "./MainNav";
import { MobileMenu } from "./MobileMenu";

/**
 * The shop page frame with navigation and session-aware header pieces. Route layouts and the
 * global 404 use this, so shared layout components never depend on features (arch §4).
 */
export async function ShopFrame({ children }: { children: ReactNode }) {
  const categories = await catalog.getCategories();
  return (
    <ShopShell
      headerSlots={{
        mobileMenu: <MobileMenu categories={categories} />,
        nav: <MainNav categories={categories} />,
        account: <HeaderAccount />,
        wishlist: <HeaderWishlistLink />,
        cart: <CartIcon />,
        // SearchBar reads the URL, so it sits in Suspense with the plain form as fallback.
        search: (id) => (
          <Suspense fallback={<HeaderSearch id={id} />}>
            <SearchBar id={id} />
          </Suspense>
        ),
      }}
    >
      {children}
    </ShopShell>
  );
}
