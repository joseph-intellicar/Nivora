import Link from "next/link";
import type { ReactNode } from "react";
import { SearchIcon } from "@/components/icons";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/Breadcrumbs";
import { buttonClasses } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { paths } from "@/config/routes";
import { JsonLd } from "@/features/seo/JsonLd";
import { breadcrumbLd, itemListLd } from "@/features/seo/structuredData";
import type { ProductListResult, ProductQuery } from "@/domain/types";
import { formatCount } from "@/lib/format";
import { activeFilters } from "../activeFilters";
import type { FilterKey } from "../filterConfig";
import {
  clearRefinements,
  hasRefinements,
  serialiseListingParams,
  type ListingContext,
} from "../listingParams";
import { ActiveFilterChips } from "./ActiveFilterChips";
import { FilterDrawer } from "./FilterDrawer";
import { FilterPanel } from "./FilterPanel";
import { ListingNavigationProvider, ListingResults } from "./ListingNavigation";
import { Pagination } from "./Pagination";
import { ProductCard } from "./ProductCard";
import { ProductGrid, ProductGridItem } from "./ProductGrid";
import { SortSelect } from "./SortSelect";

type ProductListingProps = {
  title: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  basePath: string;
  query: ProductQuery;
  context: ListingContext;
  result: ProductListResult;
  /** Subcategory navigation (category pages). */
  subNav?: ReactNode;
  /** Filter sections to show, in order (arch §13.2). */
  filterKeys: FilterKey[];
};

/** One listing layout for category, subcategory, collection and search pages (arch §13.1). */
export function ProductListing({
  title,
  description,
  breadcrumbs,
  basePath,
  query,
  context,
  result,
  subNav,
  filterKeys,
}: ProductListingProps) {
  const first = (result.page - 1) * result.pageSize + 1;
  const last = Math.min(result.total, result.page * result.pageSize);
  const cleared = serialiseListingParams(clearRefinements(query, context), context);
  const clearHref = cleared ? `${basePath}?${cleared}` : basePath;
  const chips = activeFilters(query, result.facets, context);
  const panel = (prefix: string) => (
    <FilterPanel
      query={query}
      context={context}
      facets={result.facets}
      filterKeys={filterKeys}
      idPrefix={prefix}
    />
  );

  return (
    <ListingNavigationProvider>
      <JsonLd data={[breadcrumbLd(breadcrumbs, basePath), itemListLd(result.items, first)]} />
      <Container className="py-6 sm:py-8">
        <Breadcrumbs items={breadcrumbs} />
        <header className="mt-4">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{title}</h1>
          {description ? <p className="mt-2 max-w-3xl text-ink-muted">{description}</p> : null}
        </header>
        {subNav ? <div className="mt-5">{subNav}</div> : null}
        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          <aside aria-label="Filters" className="hidden w-64 shrink-0 lg:block">
            <h2 className="mb-4 text-lg font-bold text-ink">Filters</h2>
            {panel("sidebar")}
          </aside>
          <div className="min-w-0 flex-1">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <p className="text-sm text-ink-muted" aria-live="polite">
                {result.total === 0
                  ? "No products"
                  : `Showing ${formatCount(first)}–${formatCount(last)} of ${formatCount(result.total)} ${result.total === 1 ? "product" : "products"}`}
              </p>
              <div className="flex items-end gap-2">
                <FilterDrawer total={result.total} activeCount={chips.length}>
                  {panel("drawer")}
                </FilterDrawer>
                <SortSelect query={query} context={context} />
              </div>
            </div>
            <ActiveFilterChips basePath={basePath} filters={chips} clearSearch={cleared} />
            <ListingResults>
              {result.total === 0 ? (
                <EmptyState
                  icon={<SearchIcon />}
                  title="No products found."
                  description="Try removing some filters or searching for something else."
                  action={
                    <>
                      {hasRefinements(query, context) ? (
                        <Link href={clearHref} className={buttonClasses()}>
                          Clear Filters
                        </Link>
                      ) : null}
                      <Link href={paths.home()} className={buttonClasses({ variant: "secondary" })}>
                        Continue Shopping
                      </Link>
                    </>
                  }
                />
              ) : (
                <ProductGrid withSidebar>
                  {result.items.map((product, index) => (
                    <ProductGridItem key={product.id}>
                      <ProductCard product={product} priority={index < 4} headingLevel="h2" />
                    </ProductGridItem>
                  ))}
                </ProductGrid>
              )}
              <Pagination
                basePath={basePath}
                query={query}
                context={context}
                page={result.page}
                pageCount={result.pageCount}
              />
            </ListingResults>
          </div>
        </div>
      </Container>
    </ListingNavigationProvider>
  );
}
