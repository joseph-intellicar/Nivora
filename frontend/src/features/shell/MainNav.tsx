"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDownIcon } from "@/components/icons";
import { Container } from "@/components/layout/Container";
import { paths } from "@/config/routes";
import type { Category } from "@/domain/types";
import { cn } from "@/lib/cn";

/**
 * Desktop main navigation (requirements §8.2): Home + the five categories, no "More" (D1).
 * Subcategory flyouts open on hover or keyboard focus (focus-within), so every link stays a
 * real, crawlable anchor and works without JavaScript.
 */
export function MainNav({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const linkClass = (active: boolean) =>
    cn(
      "inline-flex items-center gap-1 rounded-control px-3 py-2 hover:bg-brand-50 hover:text-brand-800",
      active ? "text-brand-800 underline decoration-2 underline-offset-8" : "text-ink",
    );

  return (
    <nav aria-label="Main" className="hidden border-t border-line lg:block">
      <Container>
        <ul className="flex h-12 items-center gap-1 text-sm font-semibold">
          <li>
            <Link
              href={paths.home()}
              className={linkClass(isActive("/"))}
              aria-current={pathname === "/" ? "page" : undefined}
            >
              Home
            </Link>
          </li>
          {categories.map((category) => {
            const href = paths.category(category.slug);
            return (
              <li key={category.id} className="group relative">
                <Link
                  href={href}
                  className={linkClass(isActive(href))}
                  aria-current={pathname === href ? "page" : undefined}
                >
                  {category.name}
                  <ChevronDownIcon className="size-4 text-ink-subtle transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
                </Link>
                <div className="invisible absolute top-full left-0 z-40 pt-1 opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <ul
                    aria-label={`${category.name} subcategories`}
                    className="min-w-56 rounded-card bg-surface py-2 shadow-raised ring-1 ring-line"
                  >
                    {category.subcategories.map((sub) => {
                      const subHref = paths.subcategory(category.slug, sub.slug);
                      return (
                        <li key={sub.id}>
                          <Link
                            href={subHref}
                            className={cn(
                              "block px-4 py-2 font-medium hover:bg-brand-50 hover:text-brand-800 focus-visible:bg-brand-50",
                              pathname === subHref ? "text-brand-800" : "text-ink",
                            )}
                            aria-current={pathname === subHref ? "page" : undefined}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </nav>
  );
}
