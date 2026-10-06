import type { INestApplication } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service.js";
import { createTestApp } from "./app-factory.js";
import { setStock } from "./catalog-helpers.js";
import { browser, uniqueEmail } from "./http-client.js";

describe("wishlist (e2e, P2-023)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  async function customer() {
    const client = browser(app);
    await client
      .post("/api/v1/auth/signup")
      .send({
        name: "W",
        email: uniqueEmail("wish"),
        password: "password123",
        confirmPassword: "password123",
      })
      .expect(201);
    return client;
  }

  it("guests get 401 on every wishlist route", async () => {
    const guest = browser(app);
    await guest.get("/api/v1/wishlist").expect(401);
    await guest.put("/api/v1/wishlist/apple-iphone-15").expect(401);
    await guest.delete("/api/v1/wishlist/apple-iphone-15").expect(401);
    await guest
      .post("/api/v1/wishlist/apple-iphone-15/move-to-cart")
      .send({ variantId: "x" })
      .expect(401);
  });

  it("adding twice keeps one entry; returns summaries in the order added", async () => {
    const client = await customer();
    await client.put("/api/v1/wishlist/apple-iphone-15").expect(204);
    await client.put("/api/v1/wishlist/apple-iphone-15").expect(204);
    await client.put("/api/v1/wishlist/urbano-classic-oxford-shirt").expect(204);
    const list = (await client.get("/api/v1/wishlist").expect(200)).body;
    expect(list.map((p: { id: string }) => p.id)).toEqual([
      "apple-iphone-15",
      "urbano-classic-oxford-shirt",
    ]);
    expect(list[0]).toMatchObject({
      name: "Apple iPhone 15",
      price: expect.any(Number),
      inStock: true,
    });
    expect(
      (await client.put("/api/v1/wishlist/does-not-exist").expect(404)).body.error.details,
    ).toEqual({ entity: "product" });
  });

  it("move to cart: adds 1, removes from the wishlist; wrong-product variant rejected", async () => {
    const client = await customer();
    await client.put("/api/v1/wishlist/urbano-classic-oxford-shirt").expect(204);
    await client.put("/api/v1/wishlist/apple-iphone-15").expect(204);
    await client
      .post("/api/v1/wishlist/urbano-classic-oxford-shirt/move-to-cart")
      .send({ variantId: "urbano-classic-oxford-shirt-white-m" })
      .expect(204);
    expect((await client.get("/api/v1/wishlist")).body.map((p: { id: string }) => p.id)).toEqual([
      "apple-iphone-15",
    ]);
    const cart = (await client.get("/api/v1/cart")).body;
    expect(
      cart.lines.map((l: { variantId: string; quantity: number }) => [l.variantId, l.quantity]),
    ).toEqual([["urbano-classic-oxford-shirt-white-m", 1]]);
    const wrong = await client
      .post("/api/v1/wishlist/apple-iphone-15/move-to-cart")
      .send({ variantId: "urbano-classic-oxford-shirt-white-m" })
      .expect(400);
    expect(wrong.body.error.code).toBe("INVALID_VARIANT");
  });

  it("an out-of-stock product can't be moved and stays in the wishlist", async () => {
    const client = await customer();
    await client.put("/api/v1/wishlist/realme-narzo-70-pro-5g").expect(204);
    const res = await client
      .post("/api/v1/wishlist/realme-narzo-70-pro-5g/move-to-cart")
      .send({ variantId: "realme-narzo-70-pro-5g-glass-green-8-gb-128-gb" })
      .expect(409);
    expect(res.body.error.code).toBe("OUT_OF_STOCK");
    expect((await client.get("/api/v1/wishlist")).body).toHaveLength(1);
    expect((await client.get("/api/v1/cart")).body.lines).toEqual([]);
    await client.delete("/api/v1/wishlist/realme-narzo-70-pro-5g").expect(204);
    expect((await client.get("/api/v1/wishlist")).body).toEqual([]);
  });

  it("insufficient stock (cart already holds it all) can't be moved", async () => {
    const client = await customer();
    const prisma = app.get(PrismaService);
    const restore = await setStock(prisma, { "urbano-classic-oxford-shirt-sky-blue-s": 1 });
    try {
      await client
        .post("/api/v1/cart/items")
        .send({ variantId: "urbano-classic-oxford-shirt-sky-blue-s", quantity: 1 })
        .expect(200);
      await client.put("/api/v1/wishlist/urbano-classic-oxford-shirt").expect(204);
      const res = await client
        .post("/api/v1/wishlist/urbano-classic-oxford-shirt/move-to-cart")
        .send({ variantId: "urbano-classic-oxford-shirt-sky-blue-s" })
        .expect(409);
      expect(res.body.error).toMatchObject({
        code: "INSUFFICIENT_STOCK",
        details: { available: 0 },
      });
      expect((await client.get("/api/v1/wishlist")).body).toHaveLength(1);
    } finally {
      await restore();
    }
  });

  it("each customer has their own wishlist", async () => {
    const a = await customer();
    const b = await customer();
    await a.put("/api/v1/wishlist/apple-iphone-15").expect(204);
    expect((await b.get("/api/v1/wishlist")).body).toEqual([]);
    await b.delete("/api/v1/wishlist/apple-iphone-15").expect(204);
    expect((await a.get("/api/v1/wishlist")).body).toHaveLength(1);
  });
});
