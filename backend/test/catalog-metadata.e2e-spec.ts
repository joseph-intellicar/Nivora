import type { INestApplication } from "@nestjs/common";
import { CATEGORIES } from "@nivora/shared/data/categories";
import { COLLECTIONS } from "@nivora/shared/data/collections";
import { INFO_PAGES_CONTENT } from "@nivora/shared/data/infoPages";
import { PRODUCTS } from "@nivora/shared/data/products";
import { createTaxonomy } from "@nivora/shared/domain/catalog";
import { queryCatalog } from "@nivora/shared/domain/filters";
import request from "supertest";
import { PrismaService } from "../src/prisma/prisma.service.js";
import { createTestApp } from "./app-factory.js";
import { liveAdjustments } from "./catalog-helpers.js";

describe("catalog metadata and content (e2e, P2-015)", () => {
  let app: INestApplication;
  let http: ReturnType<INestApplication["getHttpServer"]>;
  const taxonomy = createTaxonomy(CATEGORIES);

  beforeAll(async () => {
    app = await createTestApp();
    http = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it("GET /categories returns the fixed taxonomy (5 categories, 24 subcategories)", async () => {
    const res = await request(http).get("/api/v1/categories").expect(200);
    expect(res.body).toEqual(CATEGORIES);
    expect(res.body.flatMap((c: { subcategories: unknown[] }) => c.subcategories)).toHaveLength(24);
  });

  it("GET /products/slugs lists every product in catalog order", async () => {
    const res = await request(http).get("/api/v1/products/slugs").expect(200);
    expect(res.body).toEqual(PRODUCTS.map((p) => p.slug));
  });

  it.each([
    ["best-sellers", 49, "relevance"],
    ["special-offers", 150, "discount"],
    ["new-arrivals", 28, "newest"],
  ])(
    "GET /collections/%s returns %i products in its default sort (%s)",
    async (id, count, sort) => {
      const collection = COLLECTIONS.find((c) => c.id === id)!;
      expect(collection.defaultSort).toBe(sort);
      const adjustments = await liveAdjustments(app.get(PrismaService));
      const expected = queryCatalog(
        PRODUCTS,
        { collection: collection.id, sort: collection.defaultSort, page: 1 },
        taxonomy,
        PRODUCTS.length,
        adjustments,
      ).items;
      const res = await request(http).get(`/api/v1/collections/${id}`).expect(200);
      expect(res.body).toHaveLength(count);
      expect(res.body).toEqual(expected);
      const limited = await request(http).get(`/api/v1/collections/${id}?limit=10`).expect(200);
      expect(limited.body).toEqual(expected.slice(0, 10));
    },
  );

  it("rejects unknown collections and bad limits", async () => {
    expect((await request(http).get("/api/v1/collections/sale").expect(404)).body.error.code).toBe(
      "NOT_FOUND",
    );
    for (const limit of ["0", "-1", "abc", "1.5", "5000"]) {
      const res = await request(http)
        .get(`/api/v1/collections/best-sellers?limit=${limit}`)
        .expect(422);
      expect(res.body.error.details.fields).toHaveProperty("limit");
    }
  });

  it("GET /content/pages/:slug serves every info page and 404s unknown ones", async () => {
    for (const page of INFO_PAGES_CONTENT) {
      expect(
        (await request(http).get(`/api/v1/content/pages/${page.slug}`).expect(200)).body,
      ).toEqual(page);
    }
    const missing = await request(http).get("/api/v1/content/pages/careers").expect(404);
    expect(missing.body.error).toMatchObject({ code: "NOT_FOUND", details: { entity: "page" } });
  });
});
