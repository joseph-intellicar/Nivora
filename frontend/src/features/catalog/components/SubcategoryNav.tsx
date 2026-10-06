import Link from "next/link";
import { paths } from "@/config/routes";
import type { Category, FacetOption } from "@nivora/shared/domain/types";
import { cn } from "@/lib/cn";

/**
 * Subcategory navigation on category pages (requirements §11): single select, "All" returns to
 * the category. Counts reflect the other active filters.
 */
export function SubcategoryNav({
  category,
  activeId,
  counts,
}: {
  category: Category;
  activeId: string | null;
  counts: FacetOption[];
}) {
  const chip = (active: boolean) =>
    cn(
      "inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold ring-1 ring-inset transition-colors",
      active
        ? "bg-brand-700 text-white ring-brand-700"
        : "bg-surface text-ink ring-line-strong hover:bg-brand-50",
    );
  const countOf = (id: string) => counts.find((option) => option.value === id)?.count ?? 0;
  return (
    <nav
      aria-label={`${category.name} subcategories`}
      className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0"
    >
      <ul className="flex gap-2 pb-1 sm:flex-wrap">
        <li>
          <Link
            href={paths.category(category.slug)}
            className={chip(activeId === null)}
            aria-current={activeId === null ? "page" : undefined}
          >
            All
          </Link>
        </li>
        {category.subcategories.map((sub) => (
          <li key={sub.id}>
            <Link
              href={paths.subcategory(category.slug, sub.slug)}
              className={chip(activeId === sub.id)}
              aria-current={activeId === sub.id ? "page" : undefined}
            >
              {sub.name}
              <span
                className={cn(
                  "text-xs",
                  activeId === sub.id ? "text-brand-100" : "text-ink-subtle",
                )}
              >
                {countOf(sub.id)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
