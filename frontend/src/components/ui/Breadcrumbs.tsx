import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

export type BreadcrumbItem = { label: string; href?: string };

/** Breadcrumb trail; the last item is the current page. */
export function Breadcrumbs({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1 text-ink-muted">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {isLast || !item.href ? (
                <span aria-current={isLast ? "page" : undefined} className="font-semibold text-ink">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-brand-700 hover:underline">
                  {item.label}
                </Link>
              )}
              {!isLast ? <ChevronRightIcon className="size-4 text-ink-subtle" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
