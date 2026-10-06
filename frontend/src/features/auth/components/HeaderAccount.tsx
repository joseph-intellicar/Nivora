"use client";

import Link from "next/link";
import { ChevronDownIcon, HeartIcon, MapPinIcon, PackageIcon, UserIcon } from "@/components/icons";
import { Dropdown, type DropdownItem } from "@/components/ui/Dropdown";
import { paths } from "@/config/routes";
import { useLogout } from "../hooks/useAuthMutations";
import { useSession } from "../hooks/useSession";

const iconLinkClass =
  "relative inline-flex size-10 items-center justify-center rounded-full text-ink hover:bg-brand-50 hover:text-brand-800 sm:size-11";

/** Header account area (requirements §8.1): placeholder → Login (guest) or account menu. */
export function HeaderAccount() {
  const { user, isLoading } = useSession();
  const logout = useLogout();

  if (isLoading) {
    return (
      <span
        aria-hidden="true"
        className="ml-1 h-10 w-10 animate-pulse rounded-full bg-line sm:w-24"
      />
    );
  }

  if (!user) {
    return (
      <>
        <Link
          href={paths.login()}
          className="ml-1 hidden h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold text-brand-800 ring-1 ring-line-strong ring-inset hover:bg-brand-50 sm:inline-flex"
        >
          <UserIcon className="size-4" />
          Login
        </Link>
        <Link href={paths.login()} aria-label="Login" className={`${iconLinkClass} sm:hidden`}>
          <UserIcon />
        </Link>
      </>
    );
  }

  const firstName = user.name.split(" ")[0];
  const items: DropdownItem[] = [
    { label: "Profile", href: paths.account(), icon: <UserIcon className="size-4" /> },
    { label: "Orders", href: paths.orders(), icon: <PackageIcon className="size-4" /> },
    { label: "Wishlist", href: paths.wishlist(), icon: <HeartIcon className="size-4" /> },
    { label: "Addresses", href: paths.addresses(), icon: <MapPinIcon className="size-4" /> },
    { label: "Logout", tone: "danger", onSelect: () => logout.mutate() },
  ];

  return (
    <Dropdown
      triggerLabel={`Account menu for ${user.name}`}
      trigger={
        <span className="inline-flex items-center gap-1.5">
          <UserIcon className="size-5 sm:size-4" />
          <span className="hidden max-w-28 truncate sm:inline">Hi, {firstName}</span>
          <ChevronDownIcon className="hidden size-4 sm:inline" />
        </span>
      }
      triggerClassName="ml-1 inline-flex h-10 items-center rounded-full px-2.5 text-sm font-semibold text-brand-800 hover:bg-brand-50 sm:px-4 sm:ring-1 sm:ring-line-strong sm:ring-inset"
      items={items}
    />
  );
}
