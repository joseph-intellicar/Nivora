"use client";

import Link from "next/link";
import { CartIcon as CartGlyph } from "@/components/icons";
import { paths } from "@/config/routes";
import { useCart } from "../hooks/useCart";

/** Header cart icon with the total quantity (requirements §8.1). No count until loaded. */
export function CartIcon() {
  const { data } = useCart();
  const count = data?.summary.itemCount ?? 0;
  return (
    <Link
      href={paths.cart()}
      aria-label={data ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart"}
      className="relative inline-flex size-10 items-center justify-center rounded-full text-ink hover:bg-brand-50 hover:text-brand-800 sm:size-11"
    >
      <CartGlyph />
      {count > 0 ? (
        <span
          aria-hidden="true"
          className="absolute top-0.5 right-0.5 inline-flex min-w-5 items-center justify-center rounded-full bg-accent-600 px-1 text-[11px] leading-5 font-bold text-white"
        >
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
