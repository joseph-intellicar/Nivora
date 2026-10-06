"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HeartIcon, MapPinIcon, PackageIcon, UserIcon } from "@/components/icons";
import { paths } from "@/config/routes";
import { useLogout } from "@/features/auth/hooks/useAuthMutations";
import { useSession } from "@/features/auth/hooks/useSession";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: paths.account(), label: "Profile", icon: UserIcon, exact: true },
  { href: paths.orders(), label: "Orders", icon: PackageIcon, exact: false },
  { href: paths.wishlist(), label: "Wishlist", icon: HeartIcon, exact: true },
  { href: paths.addresses(), label: "Addresses", icon: MapPinIcon, exact: true },
];

/** Account navigation (requirements §26): side nav on desktop, scrollable tabs on mobile. */
export function AccountNav() {
  const pathname = usePathname();
  const { user } = useSession();
  const logout = useLogout();
  const active = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);
  return (
    <nav aria-label="Account">
      {user ? (
        <p className="mb-3 hidden text-sm text-ink-muted lg:block">
          Hello, <span className="font-semibold text-ink">{user.name}</span>
        </p>
      ) : null}
      <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:gap-1 lg:px-0">
        {LINKS.map(({ href, label, icon: Icon, exact }) => (
          <li key={href} className="shrink-0">
            <Link
              href={href}
              aria-current={active(href, exact) ? "page" : undefined}
              className={cn(
                "flex items-center gap-2.5 rounded-control px-3 py-2.5 text-sm font-semibold whitespace-nowrap",
                active(href, exact)
                  ? "bg-brand-700 text-white"
                  : "bg-surface text-ink ring-1 ring-line hover:bg-brand-50 lg:bg-transparent lg:ring-0",
              )}
            >
              <Icon className="size-4" /> {label}
            </Link>
          </li>
        ))}
        <li className="shrink-0">
          <button
            type="button"
            onClick={() => logout.mutate()}
            className="flex w-full items-center gap-2.5 rounded-control bg-surface px-3 py-2.5 text-sm font-semibold whitespace-nowrap text-danger ring-1 ring-line hover:bg-danger-soft lg:bg-transparent lg:ring-0"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
