import type { CategoryId } from "@nivora/shared/domain/types";

/** Filter sections, in display order, for each listing context (arch §13.2). */
export type FilterKey =
  | "category"
  | "subcategory"
  | "brand"
  | "price"
  | "rating"
  | "discount"
  | "availability"
  | "size"
  | "color"
  | "ram"
  | "storage"
  | "capacity"
  | "energyRating"
  | "productType"
  | "skinHairType"
  | "ageGroup";

export const FILTER_LABELS: Record<FilterKey, string> = {
  category: "Category",
  subcategory: "Subcategory",
  brand: "Brand",
  price: "Price",
  rating: "Customer Rating",
  discount: "Discount",
  availability: "Availability",
  size: "Size",
  color: "Color",
  ram: "RAM",
  storage: "Storage",
  capacity: "Capacity",
  energyRating: "Energy Rating",
  productType: "Product Type",
  skinHairType: "Skin/Hair Type",
  ageGroup: "Age Group",
};

const COMMON_TAIL: FilterKey[] = ["price", "rating", "discount", "availability"];

/** Category pages: subcategory navigation is separate (SubcategoryNav), so it is not listed here. */
export const CATEGORY_FILTERS: Record<CategoryId, FilterKey[]> = {
  fashion: ["size", "color", "brand", ...COMMON_TAIL],
  mobiles: ["brand", "ram", "storage", ...COMMON_TAIL],
  "home-appliances": ["brand", "capacity", "energyRating", ...COMMON_TAIL],
  beauty: ["brand", "productType", "skinHairType", ...COMMON_TAIL],
  toys: ["brand", "ageGroup", ...COMMON_TAIL],
};

/**
 * Search results and collections: Category, Subcategory and the common filters, plus the
 * category-specific filters once the results are within a single category.
 */
export function crossCategoryFilters(singleCategory: CategoryId | null): FilterKey[] {
  const specific = singleCategory
    ? CATEGORY_FILTERS[singleCategory].filter((key) => !["brand", ...COMMON_TAIL].includes(key))
    : [];
  return ["category", "subcategory", "brand", ...specific, ...COMMON_TAIL];
}
