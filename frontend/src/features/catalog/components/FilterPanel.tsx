"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Radio } from "@/components/ui/Radio";
import type { FacetOption, Facets, ProductQuery } from "@nivora/shared/domain/types";
import { formatCount } from "@nivora/shared/lib/format";
import { FILTER_LABELS, type FilterKey } from "../filterConfig";
import {
  serialiseListingParams,
  withChange,
  type ListingContext,
} from "@nivora/shared/domain/listingParams";
import { useListingNavigation } from "./ListingNavigation";

type FilterPanelProps = {
  query: ProductQuery;
  context: ListingContext;
  facets: Facets;
  filterKeys: FilterKey[];
  /** Distinguishes the sidebar from the drawer copy (unique input ids/names). */
  idPrefix: string;
};

const ATTRIBUTE_KEYS = new Set<FilterKey>([
  "size",
  "color",
  "ram",
  "storage",
  "capacity",
  "energyRating",
  "productType",
  "skinHairType",
  "ageGroup",
]);

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-b border-line py-4 first:pt-0 last:border-b-0">
      <legend className="mb-3 text-sm font-bold text-ink">{title}</legend>
      <div className="flex flex-col gap-2.5">{children}</div>
    </fieldset>
  );
}

/** Keeps selected values visible even when no other product matches them. */
function withSelected(options: FacetOption[], selected: string[] = []): FacetOption[] {
  const missing = selected
    .filter((value) => !options.some((o) => o.value === value))
    .map((value) => ({ value, label: value, count: 0 }));
  return [...options, ...missing];
}

/** Filters for a listing (requirements §12.2): OR within a section, AND across sections. */
export function FilterPanel({ query, context, facets, filterKeys, idPrefix }: FilterPanelProps) {
  const { go } = useListingNavigation();
  const apply = (change: Partial<ProductQuery>) =>
    go(serialiseListingParams(withChange(query, change), context), { replace: true });
  const toggle = (list: string[] | undefined, value: string) =>
    list?.includes(value) ? list.filter((v) => v !== value) : [...(list ?? []), value];

  const checkboxList = (
    key: string,
    options: FacetOption[],
    selected: string[] | undefined,
    onToggle: (value: string) => void,
    limit = 8,
  ) => (
    <CheckboxList
      key={key}
      idPrefix={`${idPrefix}-${key}`}
      options={withSelected(options, selected)}
      selected={selected ?? []}
      onToggle={onToggle}
      limit={limit}
    />
  );

  const sections = filterKeys.map((key) => {
    switch (key) {
      case "category":
        return facets.categories.length > 0 ? (
          <Section key={key} title={FILTER_LABELS[key]}>
            {checkboxList(key, facets.categories, query.categoryIds, (v) =>
              apply({ categoryIds: toggle(query.categoryIds, v) as ProductQuery["categoryIds"] }),
            )}
          </Section>
        ) : null;
      case "subcategory":
        return facets.subcategories.length > 0 ? (
          <Section key={key} title={FILTER_LABELS[key]}>
            {checkboxList(key, facets.subcategories, query.subcategoryIds, (v) =>
              apply({ subcategoryIds: toggle(query.subcategoryIds, v) }),
            )}
          </Section>
        ) : null;
      case "brand":
        return facets.brands.length > 0 ? (
          <Section key={key} title={FILTER_LABELS[key]}>
            {checkboxList(key, facets.brands, query.brands, (v) =>
              apply({ brands: toggle(query.brands, v) }),
            )}
          </Section>
        ) : null;
      case "price":
        return facets.price ? (
          <Section key={key} title={FILTER_LABELS[key]}>
            <Radio
              name={`${idPrefix}-price`}
              label="Any price"
              checked={query.priceMin === undefined && query.priceMax === undefined}
              onChange={() => apply({ priceMin: undefined, priceMax: undefined })}
            />
            {facets.price.bands.map((band) => (
              <Radio
                key={band.label}
                name={`${idPrefix}-price`}
                label={<OptionLabel label={band.label} count={band.count} />}
                checked={
                  query.priceMin === (band.min === 0 ? undefined : band.min) &&
                  query.priceMax === (band.max ?? undefined)
                }
                onChange={() =>
                  apply({
                    priceMin: band.min === 0 ? undefined : band.min,
                    priceMax: band.max ?? undefined,
                  })
                }
              />
            ))}
            <PriceRange
              idPrefix={idPrefix}
              query={query}
              onApply={(priceMin, priceMax) => apply({ priceMin, priceMax })}
            />
          </Section>
        ) : null;
      case "rating":
        return facets.ratings.length > 0 ? (
          <Section key={key} title={FILTER_LABELS[key]}>
            <Radio
              name={`${idPrefix}-rating`}
              label="Any rating"
              checked={query.minRating === undefined}
              onChange={() => apply({ minRating: undefined })}
            />
            {facets.ratings.map((option) => (
              <Radio
                key={option.value}
                name={`${idPrefix}-rating`}
                label={<OptionLabel label={option.label} count={option.count} />}
                checked={query.minRating === Number(option.value)}
                onChange={() => apply({ minRating: Number(option.value) })}
              />
            ))}
          </Section>
        ) : null;
      case "discount":
        return facets.discounts.length > 0 ? (
          <Section key={key} title={FILTER_LABELS[key]}>
            <Radio
              name={`${idPrefix}-discount`}
              label="Any discount"
              checked={query.minDiscount === undefined}
              onChange={() => apply({ minDiscount: undefined })}
            />
            {facets.discounts.map((option) => (
              <Radio
                key={option.value}
                name={`${idPrefix}-discount`}
                label={<OptionLabel label={option.label} count={option.count} />}
                checked={query.minDiscount === Number(option.value)}
                onChange={() => apply({ minDiscount: Number(option.value) })}
              />
            ))}
          </Section>
        ) : null;
      case "availability":
        return (
          <Section key={key} title={FILTER_LABELS[key]}>
            <Checkbox
              label={<OptionLabel label="In stock only" count={facets.availability.inStock} />}
              checked={Boolean(query.inStockOnly)}
              onChange={() => apply({ inStockOnly: query.inStockOnly ? undefined : true })}
            />
          </Section>
        );
      default: {
        if (!ATTRIBUTE_KEYS.has(key)) return null;
        const options = facets.attributes[key] ?? [];
        const selected = query.attributes?.[key];
        if (options.length === 0 && !selected?.length) return null;
        return (
          <Section key={key} title={FILTER_LABELS[key]}>
            {checkboxList(
              key,
              options,
              selected,
              (v) => apply({ attributes: { ...query.attributes, [key]: toggle(selected, v) } }),
              10,
            )}
          </Section>
        );
      }
    }
  });

  return <div>{sections}</div>;
}

function OptionLabel({ label, count }: { label: string; count: number }) {
  return (
    <span className="flex items-center gap-1.5">
      {label}
      <span className="text-xs text-ink-subtle">({formatCount(count)})</span>
    </span>
  );
}

function CheckboxList({
  idPrefix,
  options,
  selected,
  onToggle,
  limit,
}: {
  idPrefix: string;
  options: FacetOption[];
  selected: string[];
  onToggle: (value: string) => void;
  limit: number;
}) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? options : options.slice(0, limit);
  return (
    <>
      {visible.map((option) => (
        <Checkbox
          key={option.value}
          id={`${idPrefix}-${option.value}`}
          label={<OptionLabel label={option.label} count={option.count} />}
          checked={selected.includes(option.value)}
          onChange={() => onToggle(option.value)}
        />
      ))}
      {options.length > limit ? (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="self-start text-sm font-semibold text-brand-700 hover:underline"
          aria-expanded={showAll}
        >
          {showAll ? "Show less" : `Show all ${options.length}`}
        </button>
      ) : null}
    </>
  );
}

function PriceRange({
  idPrefix,
  query,
  onApply,
}: {
  idPrefix: string;
  query: ProductQuery;
  onApply: (min?: number, max?: number) => void;
}) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const parse = (name: string) => {
      const value = String(data.get(name) ?? "").trim();
      return /^\d+$/.test(value) ? Number(value) : undefined;
    };
    let min = parse("min");
    let max = parse("max");
    if (min !== undefined && max !== undefined && min > max) [min, max] = [max, min];
    onApply(min, max);
  };
  const input =
    "h-10 w-full rounded-control bg-surface px-2 text-sm ring-1 ring-line-strong ring-inset focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:outline-none";
  return (
    <form onSubmit={submit} className="mt-1 flex items-end gap-2" aria-label="Custom price range">
      <label className="flex-1 text-xs font-semibold text-ink-muted" htmlFor={`${idPrefix}-min`}>
        Min ₹
        <input
          id={`${idPrefix}-min`}
          name="min"
          inputMode="numeric"
          defaultValue={query.priceMin ?? ""}
          className={input}
        />
      </label>
      <label className="flex-1 text-xs font-semibold text-ink-muted" htmlFor={`${idPrefix}-max`}>
        Max ₹
        <input
          id={`${idPrefix}-max`}
          name="max"
          inputMode="numeric"
          defaultValue={query.priceMax ?? ""}
          className={input}
        />
      </label>
      <Button type="submit" size="sm" variant="secondary">
        Go
      </Button>
    </form>
  );
}
