import type { CatalogApi, ContentApi } from "@nivora/shared/contracts";
import { siteConfig } from "@/config/site";
import { httpCatalog, httpContent } from "../http/server";
import { getCollectionMeta, mockCatalog, mockContent } from "./mock/catalog";

/**
 * Server-side data layer (arch §7.1). NEXT_PUBLIC_DATA_SOURCE picks the adapter: the shared
 * mock catalog (Phase 1) or the Nivora API (`BACKEND_URL`, Phase 2).
 */
const useHttp = siteConfig.dataSource === "http";
export const catalog: CatalogApi = useHttp ? httpCatalog : mockCatalog;
export const content: ContentApi = useHttp ? httpContent : mockContent;
/** Collection names and default sorts are static configuration in both modes. */
export const collections = { getMeta: getCollectionMeta };
