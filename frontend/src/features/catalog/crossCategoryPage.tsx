import { catalog } from "@/api/server";
import { paths } from "@/config/routes";
import type { Collection } from "@nivora/shared/domain/types";
import { ProductListing } from "./components/ProductListing";
import { crossCategoryFilters } from "./filterConfig";
import {
  parseListingParams,
  type ListingContext,
  type RawSearchParams,
} from "@nivora/shared/domain/listingParams";

/** Collection and search listings: Category/Subcategory + common filters (arch §13.2). */
export async function CrossCategoryListing({
  title,
  description,
  basePath,
  breadcrumbLabel,
  context,
  searchParams,
}: {
  title: string;
  description?: string;
  basePath: string;
  breadcrumbLabel: string;
  context: ListingContext;
  searchParams: RawSearchParams;
}) {
  const query = parseListingParams(searchParams, context);
  const result = await catalog.listProducts(query);
  // Category-specific filters appear once the results are within a single category.
  const single =
    query.categoryIds?.length === 1
      ? query.categoryIds[0]
      : result.facets.categories.length === 1
        ? (result.facets.categories[0].value as never)
        : null;

  return (
    <ProductListing
      title={title}
      description={description}
      breadcrumbs={[{ label: "Home", href: paths.home() }, { label: breadcrumbLabel }]}
      basePath={basePath}
      query={query}
      context={context}
      result={result}
      filterKeys={crossCategoryFilters(single)}
    />
  );
}

export function collectionContext(collection: Collection): ListingContext {
  return { collection: collection.id, defaultSort: collection.defaultSort };
}
