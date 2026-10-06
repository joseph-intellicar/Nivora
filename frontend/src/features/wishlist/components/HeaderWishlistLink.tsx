"use client";

import Link from "next/link";
import { HeartIcon } from "@/components/icons";
import { paths } from "@/config/routes";
import { useRequireAuth } from "@/features/auth/hooks/useRequireAuth";
import { useSession } from "@/features/auth/hooks/useSession";

const className =
  "relative inline-flex size-10 items-center justify-center rounded-full text-ink hover:bg-brand-50 hover:text-brand-800 sm:size-11";

/** Header wishlist icon: opens the Wishlist, or the login prompt for guests (requirements §8.1). */
export function HeaderWishlistLink() {
  const { isAuthenticated, isLoading } = useSession();
  const requireAuth = useRequireAuth();

  if (isLoading || isAuthenticated) {
    return (
      <Link href={paths.wishlist()} aria-label="Wishlist" className={className}>
        <HeartIcon />
      </Link>
    );
  }
  return (
    <button
      type="button"
      aria-label="Wishlist"
      className={className}
      onClick={() => requireAuth({ type: "navigate", to: paths.wishlist() }, () => undefined)}
    >
      <HeartIcon />
    </button>
  );
}
