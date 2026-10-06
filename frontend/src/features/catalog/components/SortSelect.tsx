"use client";

import { Select } from "@/components/ui/Select";
import { SORT_OPTIONS } from "@nivora/shared/domain/sort";
import type { ProductQuery, SortOption } from "@nivora/shared/domain/types";
import {
  serialiseListingParams,
  withChange,
  type ListingContext,
} from "@nivora/shared/domain/listingParams";
import { useListingNavigation } from "./ListingNavigation";

/** Sort control (requirements §12.3); changing it updates the URL and returns to page 1. */
export function SortSelect({ query, context }: { query: ProductQuery; context: ListingContext }) {
  const { go } = useListingNavigation();
  return (
    <Select
      label="Sort by"
      value={query.sort}
      wrapperClassName="w-full sm:w-56"
      onChange={(event) =>
        go(
          serialiseListingParams(
            withChange(query, { sort: event.target.value as SortOption }),
            context,
          ),
          { replace: true },
        )
      }
    >
      {SORT_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
}
