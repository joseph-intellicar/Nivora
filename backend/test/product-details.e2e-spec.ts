import type { INestApplication } from "@nestjs/common";
import { PRODUCTS } from "@nivora/shared/data/products";
import request from "supertest";
import { PrismaService } from "../src/prisma/prisma.service.js";
import { createTestApp } from "./app-factory.js";
import { setStock } from "./catalog-helpers.js";

describe("GET /api/v1/products/:slug with live stock (e2e, P2-017)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const get = (slug: string) => request(app.getHttpServer()).get(`/api/v1/products/${slug}`);

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  it.each([
    "samsung-galaxy-s24-ultra",
    "urbano-classic-oxford-shirt",
    "realme-narzo-70-pro-5g",
    "saanjh-printed-kaftan",
  ])("%s: the shared product with current stock per variant", async (slug) => {
    const source = PRODUCTS.find((p) => p.slug === slug)!;
    const rows = await prisma.variant.findMany({
      where: { productId: source.id },
      select: { id: true, stock: true },
    });
    const stock = Object.fromEntries(rows.map((r) => [r.id, r.stock]));
    const res = await get(slug).expect(200);
    expect(res.body).toEqual({
      ...source,
      variants: source.variants.map((v) => ({ ...v, initialStock: stock[v.id] })),
      available: stock,
    });
  });

  it("shows a fully out-of-stock product with zero everywhere", async () => {
    const res = await get("realme-narzo-70-pro-5g").expect(200);
    expect(Object.values(res.body.available).every((n) => n === 0)).toBe(true);
  });

  it("shows a partly out-of-stock product (White / XXL sold out, Sky Blue / S has 2)", async () => {
    const res = await get("urbano-classic-oxford-shirt").expect(200);
    expect(res.body.available["urbano-classic-oxford-shirt-white-xxl"]).toBe(0);
    expect(res.body.available["urbano-classic-oxford-shirt-sky-blue-s"]).toBe(2);
  });

  it("reads stock at request time", async () => {
    const id = "urbano-classic-oxford-shirt-sky-blue-s";
    const restore = await setStock(prisma, { [id]: 1 });
    try {
      expect((await get("urbano-classic-oxford-shirt").expect(200)).body.available[id]).toBe(1);
    } finally {
      await restore();
    }
    expect((await get("urbano-classic-oxford-shirt").expect(200)).body.available[id]).toBe(2);
  });

  it("404s an unknown slug with the product wording", async () => {
    const res = await get("does-not-exist").expect(404);
    expect(res.body.error).toEqual({
      code: "NOT_FOUND",
      message: "This product is no longer available.",
      details: { entity: "product" },
    });
  });
});
