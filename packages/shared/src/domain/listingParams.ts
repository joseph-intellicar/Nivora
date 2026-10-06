import { DISCOUNT_THRESHOLDS, FILTER_SOURCES, RATING_THRESHOLDS } from "./filters";
import { SORT_OPTIONS } from "./sort";
import type { CategoryId, CollectionId, ProductQuery, SortOption } from "./types";

/*
 * Listing URL format (arch §13.3), shared by Server Components (parse) and client controls
 * (serialise). Example:
 *   /c/fashion/men?brand=Urbano,Northline&size=M,L&price=500-2000&rating=4&discount=25&instock=1&sort=price-asc&page=2
 *   /search?q=wireless+earbuds&category=mobiles&sort=rating
 * Unknown parameters and invalid values are ignored.
 */

export type RawSearchParams = Record<string, string | string[] | undefined> | URLSearchParams;

/** What the page itself fixes (from the path), not from search params. */
export type ListingContext = {
  categoryId?: CategoryId;
  subcategoryId?: string;
  collection?: CollectionId;
  defaultSort?: SortOption;
};

const CATEGORY_IDS: CategoryId[] = ["fashion", "home-appliances", "beauty", "toys", "mobiles"];
const SORTS = new Set<string>(SORT_OPTIONS.map((option) => option.value));
export const ATTRIBUTE_PARAMS = Object.keys(FILTER_SOURCES);

function get(params: RawSearchParams, key: string): string | undefined {
  const value = params instanceof URLSearchParams ? params.get(key) : params[key];
  const single = Array.isArray(value) ? value[0] : value;
  return single === undefined || single === null ? undefined : String(single);
}

const list = (value: string | undefined) =>
  value
    ? Array.from(
        new Set(
          value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        ),
      )
    : [];

const int = (value: string | undefined) => {
  if (value === undefined || !/^\d+$/.test(value)) return undefined;
  return Number.parseInt(value, 10);
};

export function parseListingParams(
  params: RawSearchParams,
  context: ListingContext = {},
): ProductQuery {
  const query: ProductQuery = {
    sort: (() => {
      const sort = get(params, "sort");
      return sort && SORTS.has(sort) ? (sort as SortOption) : (context.defaultSort ?? "relevance");
    })(),
    page: Math.max(1, int(get(params, "page")) ?? 1),
  };
  if (context.categoryId) query.categoryId = context.categoryId;
  if (context.collection) query.collection = context.collection;

  const q = get(params, "q")?.trim();
  if (q) query.q = q.slice(0, 100);

  if (context.subcategoryId) {
    query.subcategoryIds = [context.subcategoryId];
  } else {
    const subs = list(get(params, "sub")).filter((id) => /^[a-z0-9-]+$/.test(id));
    if (subs.length) query.subcategoryIds = subs;
  }
  if (!context.categoryId) {
    const categories = list(get(params, "category")).filter((id): id is CategoryId =>
      CATEGORY_IDS.includes(id as CategoryId),
    );
    if (categories.length) query.categoryIds = categories;
  }

  const brands = list(get(params, "brand"));
  if (brands.length) query.brands = brands;

  const price = get(params, "price")?.match(/^(\d*)-(\d*)$/);
  if (price) {
    const min = int(price[1]);
    const max = int(price[2]);
    if (min !== undefined) query.priceMin = min;
    if (max !== undefined && (min === undefined || max >= min)) query.priceMax = max;
  }

  const rating = int(get(params, "rating"));
  if (rating !== undefined && RATING_THRESHOLDS.includes(rating)) query.minRating = rating;

  const discount = int(get(params, "discount"));
  if (discount !== undefined && DISCOUNT_THRESHOLDS.includes(discount))
    query.minDiscount = discount;

  if (get(params, "instock") === "1") query.inStockOnly = true;

  const attributes: Record<string, string[]> = {};
  for (const key of ATTRIBUTE_PARAMS) {
    const values = list(get(params, key));
    if (values.length) attributes[key] = values;
  }
  if (Object.keys(attributes).length) query.attributes = attributes;

  return query;
}

/**
 * Query → search string (without "?"). Fields fixed by the page context are left out; the sort
 * is omitted when it is the page's default; page 1 is omitted.
 */
export function serialiseListingParams(query: ProductQuery, context: ListingContext = {}): string {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (!context.categoryId && query.categoryIds?.length)
    params.set("category", query.categoryIds.join(","));
  if (!context.subcategoryId && query.subcategoryIds?.length)
    params.set("sub", query.subcategoryIds.join(","));
  if (query.brands?.length) params.set("brand", query.brands.join(","));
  for (const key of ATTRIBUTE_PARAMS) {
    const values = query.attributes?.[key];
    if (values?.length) params.set(key, values.join(","));
  }
  if (query.priceMin !== undefined || query.priceMax !== undefined) {
    params.set("price", `${query.priceMin ?? ""}-${query.priceMax ?? ""}`);
  }
  if (query.minRating !== undefined) params.set("rating", String(query.minRating));
  if (query.minDiscount !== undefined) params.set("discount", String(query.minDiscount));
  if (query.inStockOnly) params.set("instock", "1");
  if (query.sort !== (context.defaultSort ?? "relevance")) params.set("sort", query.sort);
  if (query.page > 1) params.set("page", String(query.page));
  // Commas are valid in query strings; keeping them literal makes URLs readable (brand=A,B).
  return params.toString().replace(/%2C/gi, ",");
}

/** True when any refinement (not q/sort/page) is active. */
export function hasRefinements(query: ProductQuery, context: ListingContext = {}): boolean {
  const reset = clearRefinements(query, context);
  return (
    serialiseListingParams({ ...query, sort: reset.sort, page: 1 }, context) !==
    serialiseListingParams(reset, context)
  );
}

/** "Clear all": drops every refinement but keeps the search query and the page context. */
export function clearRefinements(query: ProductQuery, context: ListingContext = {}): ProductQuery {
  return {
    sort: query.sort,
    page: 1,
    ...(query.q ? { q: query.q } : {}),
    ...(context.categoryId ? { categoryId: context.categoryId } : {}),
    ...(context.subcategoryId ? { subcategoryIds: [context.subcategoryId] } : {}),
    ...(context.collection ? { collection: context.collection } : {}),
  };
}

/** Applies a change and resets to page 1 (any filter or sort change starts from the first page). */
export function withChange(query: ProductQuery, change: Partial<ProductQuery>): ProductQuery {
  return { ...query, ...change, page: change.page ?? 1 };
}

// ── API wire format (barch §7: GET /products) ───────────────────────

const COLLECTION_IDS: CollectionId[] = ["best-sellers", "special-offers", "new-arrivals"];

/**
 * ProductQuery → query string for `GET /api/v1/products`: the listing parameters plus the page
 * scope (`in_category`, `in_collection`). The sort is always explicit, so no default-sort
 * knowledge is needed on either side. `fromApiSearch(toApiSearch(q))` returns `q` exactly.
 */
export function toApiSearch(query: ProductQuery): string {
  const params = new URLSearchParams(serialiseListingParams(query, scopeOf(query)));
  if (query.categoryId) params.set("in_category", query.categoryId);
  if (query.collection) params.set("in_collection", query.collection);
  return params.toString().replace(/%2C/gi, ",");
}

/** Query string from `toApiSearch` (or any client) → ProductQuery. Unknown values are ignored. */
export function fromApiSearch(params: RawSearchParams): ProductQuery {
  const scope: ListingContext = {};
  const category = get(params, "in_category");
  if (category && CATEGORY_IDS.includes(category as CategoryId))
    scope.categoryId = category as CategoryId;
  const collection = get(params, "in_collection");
  if (collection && COLLECTION_IDS.includes(collection as CollectionId)) {
    scope.collection = collection as CollectionId;
  }
  return parseListingParams(params, scope);
}

/** Scope written as in_* parameters; subcategories always travel as `sub`. */
function scopeOf(query: ProductQuery): ListingContext {
  return {
    ...(query.categoryId ? { categoryId: query.categoryId } : {}),
    ...(query.collection ? { collection: query.collection } : {}),
  };
}
