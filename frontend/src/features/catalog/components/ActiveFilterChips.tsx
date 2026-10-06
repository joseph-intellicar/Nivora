import Link from "next/link";
import { CloseIcon } from "@/components/icons";
import type { ActiveFilter } from "../activeFilters";

/** Removable chips for active filters plus "Clear all" (requirements §12.2). Plain links. */
export function ActiveFilterChips({
  basePath,
  filters,
  clearSearch,
}: {
  basePath: string;
  filters: ActiveFilter[];
  clearSearch: string;
}) {
  if (filters.length === 0) return null;
  const href = (search: string) => (search ? `${basePath}?${search}` : basePath);
  return (
    <div
      className="mb-4 flex flex-wrap items-center gap-2"
      aria-label="Active filters"
      role="group"
    >
      {filters.map((filter) => (
        <Link
          key={filter.key}
          href={href(filter.search)}
          replace
          scroll={false}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 py-1.5 pr-2.5 pl-3 text-sm font-semibold text-brand-800 ring-1 ring-brand-200 ring-inset hover:bg-brand-100"
        >
          {filter.label}
          <CloseIcon className="size-3.5" aria-hidden="true" />
          <span className="sr-only">(remove filter)</span>
        </Link>
      ))}
      <Link
        href={href(clearSearch)}
        replace
        scroll={false}
        className="px-2 text-sm font-semibold text-brand-700 underline-offset-2 hover:underline"
      >
        Clear all
      </Link>
    </div>
  );
}
