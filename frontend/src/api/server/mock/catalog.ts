import { PAGE_SIZE } from "@/config/constants";
import { CATEGORIES } from "@/data/categories";
import { COLLECTIONS } from "@/data/collections";
import { INFO_PAGES_CONTENT } from "@/data/infoPages";
import { PRODUCTS } from "@/data/products";
import { createTaxonomy } from "@/domain/catalog";
import { queryCatalog } from "@/domain/filters";
import type { CatalogApi, ContentApi } from "../../contracts";

/*
 * Phase 1 server catalog (arch §7.1): pure reads over the mock data, no storage, no latency.
 * Stock shown here is the initial stock; the browser applies stock adjustments (arch §3.1).
 */

const taxonomy = createTaxonomy(CATEGORIES);
const bySlug = new Map(PRODUCTS.map((product) => [product.slug, product]));

export const mockCatalog: CatalogApi = {
  async getCategories() {
    return structuredClone(CATEGORIES);
  },

  async listProducts(query) {
    return queryCatalog(PRODUCTS, query, taxonomy, PAGE_SIZE);
  },

  async getProduct(slug) {
    const product = bySlug.get(slug);
    return product ? structuredClone(product) : null;
  },

  async getCollection(id, limit) {
    const collection = COLLECTIONS.find((item) => item.id === id);
    if (!collection) return [];
    const result = queryCatalog(
      PRODUCTS,
      { collection: id, sort: collection.defaultSort, page: 1 },
      taxonomy,
      limit ?? PRODUCTS.length,
    );
    return result.items;
  },

  async getAllProductSlugs() {
    return PRODUCTS.map((product) => product.slug);
  },
};

export const mockContent: ContentApi = {
  async getInfoPage(slug) {
    return INFO_PAGES_CONTENT.find((page) => page.slug === slug) ?? null;
  },
};

/** Collections metadata for collection pages and Home sections. */
export function getCollectionMeta(id: string) {
  return COLLECTIONS.find((collection) => collection.id === id) ?? null;
}
