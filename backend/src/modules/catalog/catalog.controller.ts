import { Controller, Get, Param, Query, Req } from "@nestjs/common";
import { fromApiSearch } from "@nivora/shared/domain/listingParams";
import { ApiError } from "@nivora/shared/errors";
import type { Request } from "express";
import { CatalogService } from "./catalog.service.js";

/** Public catalog endpoints (barch §7). */
@Controller()
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get("categories")
  categories() {
    return this.catalog.getCategories();
  }

  /** Listing: same parameters as the site's listing URLs plus in_category / in_collection. */
  @Get("products")
  list(@Req() req: Request) {
    const search = new URLSearchParams(req.originalUrl.split("?")[1] ?? "");
    return this.catalog.listProducts(fromApiSearch(search));
  }

  @Get("products/slugs")
  slugs() {
    return this.catalog.getAllProductSlugs();
  }

  @Get("products/:slug")
  product(@Param("slug") slug: string) {
    return this.catalog.getProduct(slug);
  }

  @Get("collections/:id")
  collection(@Param("id") id: string, @Query("limit") limit?: string) {
    return this.catalog.getCollection(id, parseLimit(limit));
  }
}

function parseLimit(value: string | undefined): number | undefined {
  if (value === undefined) return undefined;
  if (!/^\d{1,3}$/.test(value) || Number(value) < 1) {
    throw new ApiError("VALIDATION", {
      fields: { limit: "Limit must be a whole number from 1 to 999." },
    });
  }
  return Number(value);
}
