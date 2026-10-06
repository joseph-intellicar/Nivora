import { formatPrice } from "@/lib/format";
import { toProductSummary, type Taxonomy } from "./catalog";
import { scoreProduct, tokenize } from "./search";
import { compareProducts, type Ranked } from "./sort";
import type {
  CollectionId,
  FacetOption,
  Facets,
  PriceBand,
  Product,
  ProductListResult,
  ProductQuery,
  ProductSummary,
  StockAdjustments,
} from "./types";

/** Where each filter key reads its values: a variant option or a product attribute. */
export const FILTER_SOURCES: Record<
  string,
  { kind: "option"; option: string } | { kind: "attribute"; key: string }
> = {
  size: { kind: "option", option: "Size" },
  color: { kind: "option", option: "Color" },
  ram: { kind: "option", option: "RAM" },
  storage: { kind: "option", option: "Storage" },
  capacity: { kind: "attribute", key: "capacity" },
  energyRating: { kind: "attribute", key: "energyRating" },
  productType: { kind: "attribute", key: "productType" },
  skinHairType: { kind: "attribute", key: "skinHairType" },
  ageGroup: { kind: "attribute", key: "ageGroup" },
};

export const RATING_THRESHOLDS = [4, 3, 2];
export const DISCOUNT_THRESHOLDS = [10, 25, 50];
export const PRICE_BANDS: Array<{ min: number; max: number | null }> = [
  { min: 0, max: 999 },
  { min: 1000, max: 4999 },
  { min: 5000, max: 19999 },
  { min: 20000, max: 49999 },
  { min: 50000, max: null },
];

/** Values a product offers for a filter key (any variant counts). */
export function filterValues(product: Product, key: string): string[] {
  const source = FILTER_SOURCES[key];
  if (!source) return [];
  if (source.kind === "option") {
    return Array.from(
      new Set(
        product.variants.map((variant) => variant.optionValues[source.option]).filter(Boolean),
      ),
    );
  }
  const value = product.attributes[source.key];
  return value === undefined ? [] : Array.isArray(value) ? value : [value];
}

export function matchesCollection(summary: ProductSummary, collection: CollectionId): boolean {
  switch (collection) {
    case "best-sellers":
      return summary.isBestSeller;
    case "special-offers":
      return summary.discountPercent > 0;
    case "new-arrivals":
      return summary.isNewArrival;
  }
}

type Entry = { product: Product; summary: ProductSummary; score: number };

type RefinementKey =
  | "categories"
  | "subcategories"
  | "brands"
  | "price"
  | "rating"
  | "discount"
  | "availability"
  | `attr:${string}`;

const anyOf = (selected: string[] | undefined, values: string[]) =>
  !selected || selected.length === 0 || values.some((value) => selected.includes(value));

/** Refinements combine with AND across filters and OR within one filter (requirements §12.2). */
function passes(entry: Entry, query: ProductQuery, skip?: RefinementKey): boolean {
  const { product, summary } = entry;
  if (skip !== "categories" && !anyOf(query.categoryIds, [product.categoryId])) return false;
  if (skip !== "subcategories" && !anyOf(query.subcategoryIds, [product.subcategoryId]))
    return false;
  if (skip !== "brands" && !anyOf(query.brands, [product.brand])) return false;
  if (skip !== "price") {
    if (query.priceMin !== undefined && summary.price < query.priceMin) return false;
    if (query.priceMax !== undefined && summary.price > query.priceMax) return false;
  }
  if (skip !== "rating" && query.minRating !== undefined && product.rating < query.minRating)
    return false;
  if (
    skip !== "discount" &&
    query.minDiscount !== undefined &&
    summary.discountPercent < query.minDiscount
  )
    return false;
  if (skip !== "availability" && query.inStockOnly && !summary.inStock) return false;
  for (const [key, selected] of Object.entries(query.attributes ?? {})) {
    if (skip === `attr:${key}`) continue;
    if (!anyOf(selected, filterValues(product, key))) return false;
  }
  return true;
}

function countOptions(
  entries: Entry[],
  valuesOf: (entry: Entry) => string[],
  labelOf = (value: string) => value,
): FacetOption[] {
  const counts = new Map<string, number>();
  for (const entry of entries)
    for (const value of new Set(valuesOf(entry))) counts.set(value, (counts.get(value) ?? 0) + 1);
  return Array.from(counts, ([value, count]) => ({ value, label: labelOf(value), count }));
}

const naturalOrder = (a: FacetOption, b: FacetOption) =>
  a.value.localeCompare(b.value, "en", { numeric: true });

function bandLabel(min: number, max: number | null): string {
  if (min === 0 && max !== null) return `Under ${formatPrice(max + 1)}`;
  if (max === null) return `${formatPrice(min)} and above`;
  return `${formatPrice(min)} – ${formatPrice(max)}`;
}

/**
 * Facets for the current scope. Each facet is counted with every other refinement applied
 * but not its own, so the options shown can always match something (requirements §12.2).
 */
function buildFacets(scope: Entry[], query: ProductQuery, taxonomy: Taxonomy): Facets {
  const without = (key: RefinementKey) => scope.filter((entry) => passes(entry, query, key));

  const priceEntries = without("price");
  const prices = priceEntries.map((entry) => entry.summary.price);
  const bands: PriceBand[] = PRICE_BANDS.map(({ min, max }) => ({
    min,
    max,
    label: bandLabel(min, max),
    count: prices.filter((price) => price >= min && (max === null || price <= max)).length,
  })).filter((band) => band.count > 0);

  const attributeKeys = Object.keys(FILTER_SOURCES).filter((key) =>
    scope.some((entry) => filterValues(entry.product, key).length > 0),
  );
  const attributes: Facets["attributes"] = {};
  for (const key of attributeKeys) {
    attributes[key] = countOptions(without(`attr:${key}`), (entry) =>
      filterValues(entry.product, key),
    ).sort(naturalOrder);
  }

  const ratingEntries = without("rating");
  const discountEntries = without("discount");
  const availabilityEntries = without("availability");

  return {
    categories: countOptions(
      without("categories"),
      (e) => [e.product.categoryId],
      (id) => taxonomy.category(id)?.name ?? id,
    ),
    subcategories: countOptions(
      without("subcategories"),
      (e) => [e.product.subcategoryId],
      (id) => taxonomy.subcategory(id)?.name ?? id,
    ),
    brands: countOptions(without("brands"), (e) => [e.product.brand]).sort((a, b) =>
      a.label.localeCompare(b.label),
    ),
    price: prices.length > 0 ? { min: Math.min(...prices), max: Math.max(...prices), bands } : null,
    ratings: RATING_THRESHOLDS.map((threshold) => ({
      value: String(threshold),
      label: `${threshold}★ & above`,
      count: ratingEntries.filter((entry) => entry.product.rating >= threshold).length,
    })).filter((option) => option.count > 0),
    discounts: DISCOUNT_THRESHOLDS.map((threshold) => ({
      value: String(threshold),
      label: `${threshold}% or more`,
      count: discountEntries.filter((entry) => entry.summary.discountPercent >= threshold).length,
    })).filter((option) => option.count > 0),
    availability: {
      inStock: availabilityEntries.filter((entry) => entry.summary.inStock).length,
      total: availabilityEntries.length,
    },
    attributes,
  };
}

/**
 * The full listing pipeline (arch §13.1): scope (category, collection, search) → refinements
 * → facets → sort → paginate. Used by the catalog data layer; the UI only renders the result.
 */
export function queryCatalog(
  products: Product[],
  query: ProductQuery,
  taxonomy: Taxonomy,
  pageSize: number,
  adjustments?: StockAdjustments,
): ProductListResult {
  const tokens = tokenize(query.q ?? "");
  const scope: Entry[] = [];
  for (const product of products) {
    if (query.categoryId && product.categoryId !== query.categoryId) continue;
    const summary = toProductSummary(product, adjustments);
    if (query.collection && !matchesCollection(summary, query.collection)) continue;
    const score = scoreProduct(product, tokens, taxonomy.names(product));
    if (score === null) continue;
    scope.push({ product, summary, score });
  }

  const matching = scope.filter((entry) => passes(entry, query));
  const ranked: Ranked[] = matching.map(({ summary, score }) => ({ summary, score }));
  ranked.sort(compareProducts(query.sort));

  const total = ranked.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, Math.floor(query.page) || 1), pageCount);
  const items = ranked.slice((page - 1) * pageSize, page * pageSize).map((entry) => entry.summary);

  return { items, total, page, pageSize, pageCount, facets: buildFacets(scope, query, taxonomy) };
}
