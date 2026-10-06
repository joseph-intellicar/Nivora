import type { Facets, ProductQuery } from "@nivora/shared/domain/types";
import { formatPrice } from "@nivora/shared/lib/format";
import { FILTER_LABELS, type FilterKey } from "./filterConfig";
import {
  serialiseListingParams,
  withChange,
  type ListingContext,
} from "@nivora/shared/domain/listingParams";

export type ActiveFilter = { key: string; label: string; search: string };

const priceLabel = (min?: number, max?: number) =>
  min !== undefined && max !== undefined
    ? `${formatPrice(min)} – ${formatPrice(max)}`
    : min !== undefined
      ? `${formatPrice(min)} and above`
      : `Up to ${formatPrice(max!)}`;

/** One removable chip per active refinement (requirements §12.2). `search` = URL without it. */
export function activeFilters(
  query: ProductQuery,
  facets: Facets,
  context: ListingContext,
): ActiveFilter[] {
  const chips: ActiveFilter[] = [];
  const without = (change: Partial<ProductQuery>) =>
    serialiseListingParams(withChange(query, change), context);
  const labelFrom = (options: Facets["brands"], value: string) =>
    options.find((o) => o.value === value)?.label ?? value;

  if (!context.categoryId) {
    for (const id of query.categoryIds ?? []) {
      chips.push({
        key: `category:${id}`,
        label: labelFrom(facets.categories, id),
        search: without({ categoryIds: query.categoryIds!.filter((v) => v !== id) }),
      });
    }
  }
  if (!context.subcategoryId) {
    for (const id of query.subcategoryIds ?? []) {
      chips.push({
        key: `sub:${id}`,
        label: labelFrom(facets.subcategories, id),
        search: without({ subcategoryIds: query.subcategoryIds!.filter((v) => v !== id) }),
      });
    }
  }
  for (const brand of query.brands ?? []) {
    chips.push({
      key: `brand:${brand}`,
      label: brand,
      search: without({ brands: query.brands!.filter((v) => v !== brand) }),
    });
  }
  for (const [key, values] of Object.entries(query.attributes ?? {})) {
    for (const value of values) {
      const attributes = { ...query.attributes, [key]: values.filter((v) => v !== value) };
      chips.push({
        key: `${key}:${value}`,
        label: `${FILTER_LABELS[key as FilterKey] ?? key}: ${value}`,
        search: without({ attributes }),
      });
    }
  }
  if (query.priceMin !== undefined || query.priceMax !== undefined) {
    chips.push({
      key: "price",
      label: priceLabel(query.priceMin, query.priceMax),
      search: without({ priceMin: undefined, priceMax: undefined }),
    });
  }
  if (query.minRating !== undefined)
    chips.push({
      key: "rating",
      label: `${query.minRating}★ & above`,
      search: without({ minRating: undefined }),
    });
  if (query.minDiscount !== undefined)
    chips.push({
      key: "discount",
      label: `${query.minDiscount}% or more off`,
      search: without({ minDiscount: undefined }),
    });
  if (query.inStockOnly)
    chips.push({
      key: "instock",
      label: "In stock only",
      search: without({ inStockOnly: undefined }),
    });
  return chips;
}
