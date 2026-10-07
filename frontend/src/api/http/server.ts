import type { CatalogApi, ContentApi, PurchasableProduct } from "@nivora/shared/contracts";
import type { InfoPage } from "@nivora/shared/data/infoPages";
import { toApiSearch } from "@nivora/shared/domain/listingParams";
import type {
  Category,
  Product,
  ProductListResult,
  ProductSummary,
} from "@nivora/shared/domain/types";
import { apiFetch, orNull } from "./client";

/*
 * Server-side catalog over HTTP (barch §10, §17) with the Next.js data cache. Stock in these
 * responses is the stock at fetch time; purchase UI re-reads live stock in the browser.
 */
const CACHE = {
  taxonomy: { revalidate: 3600, tags: ["catalog"] },
  listing: { revalidate: 60, tags: ["catalog", "stock"] },
  product: { revalidate: 300, tags: ["catalog", "stock"] },
  content: { revalidate: 3600, tags: ["content"] },
};

/** The API adds `available` (live stock); the server contract is the plain product. */
function withoutAvailable(product: PurchasableProduct): Product {
  const plain: Partial<PurchasableProduct> = { ...product };
  delete plain.available;
  return plain as Product;
}

export const httpCatalog: CatalogApi = {
  getCategories: () => apiFetch<Category[]>("/categories", { next: CACHE.taxonomy }),

  listProducts: (query) =>
    apiFetch<ProductListResult>(`/products?${toApiSearch(query)}`, { next: CACHE.listing }),

  getProduct: async (slug) => {
    const product = await orNull(
      apiFetch<PurchasableProduct>(`/products/${encodeURIComponent(slug)}`, {
        next: CACHE.product,
      }),
    );
    return product && withoutAvailable(product);
  },

  getCollection: async (id, limit) =>
    (await orNull(
      apiFetch<ProductSummary[]>(`/collections/${id}${limit ? `?limit=${limit}` : ""}`, {
        next: CACHE.listing,
      }),
    )) ?? [],

  getAllProductSlugs: () => apiFetch<string[]>("/products/slugs", { next: CACHE.taxonomy }),
};

export const httpContent: ContentApi = {
  getInfoPage: (slug) =>
    orNull(
      apiFetch<InfoPage>(`/content/pages/${encodeURIComponent(slug)}`, { next: CACHE.content }),
    ),
};
