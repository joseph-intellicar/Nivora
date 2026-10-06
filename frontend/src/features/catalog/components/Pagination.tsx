import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import type { ProductQuery } from "@/domain/types";
import { cn } from "@/lib/cn";
import { serialiseListingParams, type ListingContext } from "../listingParams";

/** Numbered pages as real links, so crawlers and Back/Forward work (arch §10.4). */
export function Pagination({
  basePath,
  query,
  context,
  page,
  pageCount,
}: {
  basePath: string;
  query: ProductQuery;
  context: ListingContext;
  page: number;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;
  const href = (target: number) => {
    const search = serialiseListingParams({ ...query, page: target }, context);
    return search ? `${basePath}?${search}` : basePath;
  };
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1).filter(
    (n) => n === 1 || n === pageCount || Math.abs(n - page) <= 1,
  );
  const item =
    "inline-flex h-10 min-w-10 items-center justify-center rounded-control px-3 text-sm font-semibold";

  return (
    <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-1">
      {page > 1 ? (
        <Link
          href={href(page - 1)}
          className={cn(item, "text-brand-800 hover:bg-brand-50")}
          rel="prev"
        >
          <ChevronLeftIcon className="size-4" /> Previous
        </Link>
      ) : null}
      {pages.map((n, index) => (
        <span key={n} className="flex items-center">
          {index > 0 && n - pages[index - 1] > 1 ? (
            <span className="px-1 text-ink-subtle">…</span>
          ) : null}
          {n === page ? (
            <span aria-current="page" className={cn(item, "bg-brand-700 text-white")}>
              {n}
            </span>
          ) : (
            <Link
              href={href(n)}
              className={cn(item, "text-ink hover:bg-brand-50")}
              aria-label={`Page ${n}`}
            >
              {n}
            </Link>
          )}
        </span>
      ))}
      {page < pageCount ? (
        <Link
          href={href(page + 1)}
          className={cn(item, "text-brand-800 hover:bg-brand-50")}
          rel="next"
        >
          Next <ChevronRightIcon className="size-4" />
        </Link>
      ) : null}
    </nav>
  );
}
