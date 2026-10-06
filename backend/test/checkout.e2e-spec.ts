import type { INestApplication } from "@nestjs/common";
import type { CheckoutView } from "@nivora/shared/domain/types";
import { createTestApp } from "./app-factory.js";
import { browser } from "./http-client.js";
import { signedUpCustomer } from "./test-data.js";

const POLO = "northline-pique-polo-t-shirt-black-l";
const SHIRT = "urbano-classic-oxford-shirt-sky-blue-m";
const LOW = "urbano-classic-oxford-shirt-sky-blue-s"; // stock 2
const IPHONE = "apple-iphone-15-black-6-gb-128-gb";
const FACE_WASH = "dewra-gentle-foaming-face-wash"; // ₹299: below the free-delivery threshold

describe("checkout sessions and view (e2e, P2-025)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  const view = async (
    client: ReturnType<typeof browser>,
    option = "standard",
  ): Promise<CheckoutView> =>
    (await client.get(`/api/v1/checkout?deliveryOption=${option}`).expect(200)).body;

  it("requires login", async () => {
    const guest = browser(app);
    await guest.get("/api/v1/checkout?deliveryOption=standard").expect(401);
    await guest.post("/api/v1/checkout/buy-now").send({ variantId: POLO, quantity: 1 }).expect(401);
    await guest.post("/api/v1/checkout/cart").expect(401);
  });

  it("cart checkout view with server totals; Express adds ₹99", async () => {
    const { client } = await signedUpCustomer(app, "co");
    await client.post("/api/v1/cart/items").send({ variantId: POLO, quantity: 2 }).expect(200);
    await client.post("/api/v1/cart/items").send({ variantId: SHIRT, quantity: 1 }).expect(200);
    await client.post("/api/v1/checkout/cart").expect(204);
    const standard = await view(client);
    expect(standard.source).toBe("cart");
    expect(standard.lines.map((l) => [l.variantId, l.quantity])).toEqual([
      [POLO, 2],
      [SHIRT, 1],
    ]);
    expect(standard.summary.deliveryCharge).toBe(0);
    const express = await view(client, "express");
    expect(express.summary).toMatchObject({
      deliveryOption: "express",
      deliveryCharge: 99,
      total: standard.summary.total + 99,
    });
    const bad = await client.get("/api/v1/checkout?deliveryOption=drone").expect(422);
    expect(bad.body.error.details.fields).toEqual({
      deliveryOption: "Please choose a delivery option.",
    });
  });

  it("standard delivery is ₹40 below ₹499 after discounts", async () => {
    const { client } = await signedUpCustomer(app, "co");
    await client
      .post("/api/v1/checkout/buy-now")
      .send({ variantId: FACE_WASH, quantity: 1 })
      .expect(204);
    const result = await view(client);
    expect(result.summary.total - result.summary.deliveryCharge).toBeLessThan(499);
    expect(result.summary.deliveryCharge).toBe(40);
  });

  it("a new Buy Now replaces the pending one, leaves the cart alone, and is stock-limited", async () => {
    const { client } = await signedUpCustomer(app, "co");
    await client.post("/api/v1/cart/items").send({ variantId: POLO, quantity: 1 }).expect(200);
    await client.post("/api/v1/checkout/buy-now").send({ variantId: LOW, quantity: 1 }).expect(204);
    await client
      .post("/api/v1/checkout/buy-now")
      .send({ variantId: IPHONE, quantity: 2 })
      .expect(204);
    const result = await view(client);
    expect(result.source).toBe("buy_now");
    expect(result.lines.map((l) => [l.variantId, l.quantity])).toEqual([[IPHONE, 2]]);
    expect(
      (await client.get("/api/v1/cart")).body.lines.map((l: { variantId: string }) => l.variantId),
    ).toEqual([POLO]);

    const tooMany = await client
      .post("/api/v1/checkout/buy-now")
      .send({ variantId: LOW, quantity: 3 })
      .expect(409);
    expect(tooMany.body.error).toMatchObject({
      code: "INSUFFICIENT_STOCK",
      details: { available: 2 },
    });
    await client
      .post("/api/v1/checkout/buy-now")
      .send({ variantId: "nope", quantity: 1 })
      .expect(400);
    await client.post("/api/v1/checkout/buy-now").send({ variantId: LOW, quantity: 0 }).expect(400);
  });

  it("falls back to the cart when the Buy Now is replaced by a cart checkout or cleared by logout", async () => {
    const { client, email } = await signedUpCustomer(app, "co");
    await client.post("/api/v1/cart/items").send({ variantId: SHIRT, quantity: 1 }).expect(200);
    await client
      .post("/api/v1/checkout/buy-now")
      .send({ variantId: IPHONE, quantity: 1 })
      .expect(204);
    await client.post("/api/v1/checkout/cart").expect(204);
    expect((await view(client)).source).toBe("cart");
    await client
      .post("/api/v1/checkout/buy-now")
      .send({ variantId: IPHONE, quantity: 1 })
      .expect(204);
    await client.post("/api/v1/auth/logout").expect(204);
    await client.post("/api/v1/auth/login").send({ email, password: "password123" }).expect(200);
    const after = await view(client);
    expect(after.source).toBe("cart");
    expect(after.lines.map((l) => l.variantId)).toEqual([SHIRT]);
  });
});
