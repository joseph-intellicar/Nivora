import type { Product } from "../../domain/types";
import { BEAUTY_PRODUCTS } from "./beauty";
import { FASHION_PRODUCTS } from "./fashion";
import { HOME_APPLIANCES_PRODUCTS } from "./homeAppliances";
import { MOBILES_PRODUCTS } from "./mobiles";
import { TOYS_PRODUCTS } from "./toys";

/** The full Phase 1 mock catalog. Read only through the data layer (src/api). */
export const PRODUCTS: Product[] = [
  ...FASHION_PRODUCTS,
  ...HOME_APPLIANCES_PRODUCTS,
  ...BEAUTY_PRODUCTS,
  ...TOYS_PRODUCTS,
  ...MOBILES_PRODUCTS,
];
