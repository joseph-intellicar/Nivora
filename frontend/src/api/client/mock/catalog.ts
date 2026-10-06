import type { ClientCatalogApi } from "../../contracts";
import { loadCatalog } from "./catalogData";
import { available, readAdjustments } from "./inventory";
import { request } from "./latency";

/** Product with live stock per variant, for purchase UI in the browser (variant picker). */
export const mockClientCatalog: ClientCatalogApi = {
  getProduct: (slug) =>
    request(async () => {
      const product = (await loadCatalog()).bySlug.get(slug);
      if (!product) return null;
      const adjustments = readAdjustments();
      return {
        ...structuredClone(product),
        available: Object.fromEntries(
          product.variants.map((variant) => [variant.id, available(variant, adjustments)]),
        ),
      };
    }),
};
