import type { INestApplication } from "@nestjs/common";
import { PAGE_SIZE } from "@nivora/shared/config/constants";
import { CATEGORIES } from "@nivora/shared/data/categories";
import { PRODUCTS } from "@nivora/shared/data/products";
import { createTaxonomy } from "@nivora/shared/domain/catalog";
import { queryCatalog } from "@nivora/shared/domain/filters";
import {
  type ListingContext,
  parseListingParams,
  toApiSearch,
} from "@nivora/shared/domain/listingParams";
import type { ProductListResult } from "@nivora/shared/domain/types";
import request from "supertest";
import { PrismaService } from "../src/prisma/prisma.service.js";
import { createTestApp } from "./app-factory.js";
import { liveCatalog, setStock } from "./catalog-helpers.js";

const taxonomy = createTaxonomy(CATEGORIES);
const fashion: ListingContext = { categoryId: "fashion" };
const sub = (categoryId: ListingContext["categoryId"], subcategoryId: string): ListingContext => ({
  categoryId,
  subcategoryId,
});

/** [listing URL search, page context] — the same pages customers browse in Phase 1. */
const PAGES: Array<[string, ListingContext]> = [
  // every category and a subcategory of each
  ...CATEGORIES.map((c): [string, ListingContext] => ["", { categoryId: c.id }]),
  ...CATEGORIES.map((c): [string, ListingContext] => ["", sub(c.id, c.subcategories[0].id)]),
  // every filter type
  ["brand=Urbano,Northline", fashion],
  ["size=M,L&color=Blue", sub("fashion", "fashion-men")],
  ["price=500-2000", fashion],
  ["price=-999", { categoryId: "toys" }],
  ["price=50000-", { categoryId: "mobiles" }],
  ["rating=4", fashion],
  ["discount=50", { categoryId: "beauty" }],
  ["instock=1", { categoryId: "mobiles" }],
  ["ram=8 GB&storage=256 GB", sub("mobiles", "mobiles-smartphones")],
  ["capacity=7 kg&energyRating=5 Star", { categoryId: "home-appliances" }],
  ["skinHairType=Oily", { categoryId: "beauty" }],
  ["ageGroup=3-5 years,6-8 years", { categoryId: "toys" }],
  ["sub=fashion-men,fashion-women&brand=Urbano", fashion],
  // every sort
  ...["relevance", "price-asc", "price-desc", "rating", "newest", "discount"].map(
    (sort): [string, ListingContext] => [`sort=${sort}`, fashion],
  ),
  // search
  ["q=phone", {}],
  ["q=shoes", {}],
  ["q=samsung refrigerator", {}],
  ["q=Piqué", {}],
  ["q=zzzqx", {}],
  ["q=wireless earbuds&category=mobiles&sort=rating", {}],
  // collections with their default sort
  ["", { collection: "best-sellers", defaultSort: "relevance" }],
  ["brand=Samsung", { collection: "special-offers", defaultSort: "discount" }],
  ["", { collection: "new-arrivals", defaultSort: "newest" }],
  // pagination
  ["page=2", {}],
  ["sort=price-asc&page=7", {}],
  ["page=99", fashion],
  // garbage is ignored exactly as on the site
  [
    "sort=cheapest&page=-3&rating=7&discount=33&price=abc&instock=yes&category=cars,toys&evil=1",
    {},
  ],
];

describe("GET /api/v1/products parity with the Phase 1 pipeline (e2e, P2-016)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const list = async (search: string): Promise<ProductListResult> =>
    (await request(app.getHttpServer()).get(`/api/v1/products?${search}`).expect(200)).body;

  let restoreStock: () => Promise<void>;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
    // Parity must hold on live stock, not only on a fresh seed: sell some units, sell one variant out.
    restoreStock = await setStock(prisma, {
      "urbano-classic-oxford-shirt-sky-blue-m": 23,
      "northline-pique-polo-t-shirt-black-l": 1,
      "apple-iphone-15-black-6-gb-128-gb": 0,
    });
  });

  afterAll(async () => {
    await restoreStock();
    await app.close();
  });

  it(`covers ${PAGES.length} listing pages`, () => {
    expect(PAGES.length).toBeGreaterThanOrEqual(30);
  });

  it.each(PAGES)("?%s %j matches queryCatalog exactly", async (search, context) => {
    const query = parseListingParams(new URLSearchParams(search), context);
    const expected = queryCatalog(await liveCatalog(prisma), query, taxonomy, PAGE_SIZE);
    const actual = await list(toApiSearch(query));
    expect(actual).toEqual(expected);
  });

  it("accepts raw garbage on the wire without failing", async () => {
    const raw =
      "sort=cheapest&page=-3&rating=7&in_category=cars&in_collection=sale&price=abc&instock=yes";
    const result = await list(raw);
    expect(result.total).toBe(PRODUCTS.length);
    expect(result.page).toBe(1);
  });

  it("reflects a stock change immediately (In stock only, out-of-stock last)", async () => {
    const shirt = PRODUCTS.find((p) => p.slug === "urbano-classic-oxford-shirt")!;
    const restore = await setStock(
      prisma,
      Object.fromEntries(shirt.variants.map((v) => [v.id, 0])),
    );
    try {
      const inStock = await list("in_category=fashion&instock=1&sort=relevance");
      const all = await list("in_category=fashion&sub=fashion-men&sort=relevance");
      expect(inStock.items.some((p) => p.id === shirt.id)).toBe(false);
      const position = all.items.findIndex((p) => p.id === shirt.id);
      expect(all.items[position].inStock).toBe(false);
      expect(all.items.slice(position).every((p) => !p.inStock)).toBe(true);
    } finally {
      await restore();
    }
    const after = await list("in_category=fashion&sub=fashion-men&instock=1");
    expect(after.items.some((p) => p.id === shirt.id)).toBe(true);
  });
});
