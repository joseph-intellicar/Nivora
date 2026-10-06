"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  CartIcon,
  ChevronDownIcon,
  HeartIcon,
  MapPinIcon,
  MenuIcon,
  PackageIcon,
  UserIcon,
} from "@/components/icons";
import { Drawer } from "@/components/ui/Drawer";
import { IconButton } from "@/components/ui/IconButton";
import { paths } from "@/config/routes";
import type { Category } from "@/domain/types";
import { useLogout } from "@/features/auth/hooks/useAuthMutations";
import { useSession } from "@/features/auth/hooks/useSession";
import { cn } from "@/lib/cn";

const linkClass =
  "flex items-center gap-3 rounded-control px-3 py-3 text-base font-semibold text-ink hover:bg-brand-50";

/** Mobile/tablet menu (requirements §30): categories with subcategories, plus account links. */
export function MobileMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  const { user } = useSession();
  const logout = useLogout();
  const close = () => setOpen(false);

  return (
    <>
      <IconButton
        label="Open menu"
        icon={<MenuIcon />}
        onClick={() => setOpen(true)}
        aria-expanded={open}
        className="-ml-2 lg:hidden"
      />
      <Drawer open={open} onClose={close} side="left" title="Menu">
        <nav aria-label="Mobile">
          <ul className="flex flex-col gap-1">
            <li>
              <Link
                href={paths.home()}
                onClick={close}
                className={linkClass}
                aria-current={pathname === "/" ? "page" : undefined}
              >
                Home
              </Link>
            </li>
            {categories.map((category) => {
              const isOpen = expanded === category.id;
              const panelId = `mobile-sub-${category.id}`;
              return (
                <li key={category.id}>
                  <div className="flex items-center">
                    <Link
                      href={paths.category(category.slug)}
                      onClick={close}
                      className={cn(linkClass, "flex-1")}
                    >
                      {category.name}
                    </Link>
                    <IconButton
                      label={`${isOpen ? "Hide" : "Show"} ${category.name} subcategories`}
                      icon={
                        <ChevronDownIcon
                          className={cn("transition-transform", isOpen && "rotate-180")}
                        />
                      }
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      onClick={() => setExpanded(isOpen ? null : category.id)}
                    />
                  </div>
                  <ul id={panelId} hidden={!isOpen} className="mb-2 ml-3 border-l border-line pl-3">
                    {category.subcategories.map((sub) => (
                      <li key={sub.id}>
                        <Link
                          href={paths.subcategory(category.slug, sub.slug)}
                          onClick={close}
                          className="block rounded-control px-3 py-2 text-sm font-medium text-ink-muted hover:bg-brand-50 hover:text-brand-800"
                        >
                          {sub.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
          <ul className="mt-4 flex flex-col gap-1 border-t border-line pt-4">
            <li>
              <Link href={paths.cart()} onClick={close} className={linkClass}>
                <CartIcon /> Cart
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link href={paths.account()} onClick={close} className={linkClass}>
                    <UserIcon /> Profile
                  </Link>
                </li>
                <li>
                  <Link href={paths.orders()} onClick={close} className={linkClass}>
                    <PackageIcon /> Orders
                  </Link>
                </li>
                <li>
                  <Link href={paths.wishlist()} onClick={close} className={linkClass}>
                    <HeartIcon /> Wishlist
                  </Link>
                </li>
                <li>
                  <Link href={paths.addresses()} onClick={close} className={linkClass}>
                    <MapPinIcon /> Addresses
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      close();
                      logout.mutate();
                    }}
                    className={cn(linkClass, "w-full text-danger")}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link href={paths.login()} onClick={close} className={linkClass}>
                  <UserIcon /> Login
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </Drawer>
    </>
  );
}
