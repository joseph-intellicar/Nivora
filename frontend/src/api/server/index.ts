import type { CatalogApi, ContentApi } from "@nivora/shared/contracts";
import { getCollectionMeta, mockCatalog, mockContent } from "./mock/catalog";

/**
 * Server-side data layer (arch §7.1). Phase 1 always uses the mock adapter
 * (NEXT_PUBLIC_DATA_SOURCE=mock); Phase 2 adds an HTTP adapter here.
 */
export const catalog: CatalogApi = mockCatalog;
export const content: ContentApi = mockContent;
export const collections = { getMeta: getCollectionMeta };
