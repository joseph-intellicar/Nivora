import type { INestApplication } from "@nestjs/common";
import { TEST_USER } from "@nivora/shared/data/seedUsers";
import type { Order, OrderSummary } from "@nivora/shared/domain/types";
import { PrismaService } from "../src/prisma/prisma.service.js";
import { createTestApp } from "./app-factory.js";
import { setStock } from "./catalog-helpers.js";
import { browser } from "./http-client.js";
import { addAddress, signedUpCustomer } from "./test-data.js";

const POLO = "northline-pique-polo-t-shirt-black-l";
const SHIRT = "urbano-classic-oxford-shirt-sky-blue-m";
const LOW = "urbano-classic-oxford-shirt-sky-blue-s";
const IPHONE = "apple-iphone-15-black-6-gb-128-gb";
const sequenceOf = (orderId: string) => Number(orderId.split("-")[2]);

describe("place order, history and cancel (e2e, P2-026 / P2-027)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const stock = async (id: string) =>
    (await prisma.variant.findUniqueOrThrow({ where: { id } })).stock;
  const counts = async () => ({
    orders: await prisma.order.count(),
    items: await prisma.orderItem.count(),
    events: await prisma.orderStatusEvent.count(),
  });

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  it("EMPTY_CART and ADDRESS_REQUIRED are checked before anything is written", async () => {
    const { client } = await signedUpCustomer(app, "order");
    expect(
      (
        await client
          .post("/api/v1/orders")
          .send({ addressId: "x", deliveryOption: "standard" })
          .expect(409)
      ).body.error.code,
    ).toBe("EMPTY_CART");
    await client.post("/api/v1/cart/items").send({ variantId: POLO, quantity: 1 }).expect(200);
    for (const addressId of ["", "addr-missing", undefined]) {
      const res = await client
        .post("/api/v1/orders")
        .send({ addressId, deliveryOption: "standard" })
        .expect(409);
      expect(res.body.error).toMatchObject({
        code: "ADDRESS_REQUIRED",
        message: "Please add or select a delivery address.",
      });
    }
    const other = await signedUpCustomer(app, "order");
    const theirs = await addAddress(other.client);
    await client
      .post("/api/v1/orders")
      .send({ addressId: theirs.id, deliveryOption: "standard" })
      .expect(409);
  });

  it("Buy Now order: COD, Placed, snapshots, stock −2, cart untouched, then falls back to the cart", async () => {
    const { client, userId } = await signedUpCustomer(app, "order");
    const address = await addAddress(client);
    await client.post("/api/v1/cart/items").send({ variantId: POLO, quantity: 2 }).expect(200);
    await client.post("/api/v1/cart/items").send({ variantId: SHIRT, quantity: 1 }).expect(200);
    const before = await stock(IPHONE);
    await client
      .post("/api/v1/checkout/buy-now")
      .send({ variantId: IPHONE, quantity: 2 })
      .expect(204);

    const placed = await client
      .post("/api/v1/orders")
      .set("Idempotency-Key", `buy-now-${userId}`)
      .send({ addressId: address.id, deliveryOption: "express" })
      .expect(201);
    const order: Order = placed.body;
    expect(order.orderId).toMatch(new RegExp(`^NIV-${new Date().getFullYear()}-\\d{6}$`));
    expect(order).toMatchObject({
      customerId: userId,
      source: "buy_now",
      status: "Placed",
      paymentMethod: "Cash on Delivery",
      deliveryOption: "express",
      deliveryCharge: 99,
      subtotal: 2 * 79900,
      discount: 2 * 10000,
      total: 2 * 69900 + 99,
      deliveryAddress: {
        fullName: "Joseph",
        city: "Bengaluru",
        postalCode: "560038",
        country: "India",
      },
    });
    expect(order.items).toEqual([
      expect.objectContaining({
        variantId: IPHONE,
        productName: "Apple iPhone 15",
        quantity: 2,
        lineTotal: 2 * 69900,
      }),
    ]);
    expect(order.statusHistory).toEqual([{ status: "Placed", at: order.orderDate }]);
    expect(order).not.toHaveProperty("isSample");
    expect(await stock(IPHONE)).toBe(before - 2);
    expect(
      (await client.get("/api/v1/cart")).body.lines.map(
        (l: { variantId: string; quantity: number }) => [l.variantId, l.quantity],
      ),
    ).toEqual([
      [POLO, 2],
      [SHIRT, 1],
    ]);
    expect((await client.get("/api/v1/checkout?deliveryOption=standard")).body.source).toBe("cart");
  });

  it("cart order removes only the purchased lines, numbers are sequential, idempotent retry returns the same order", async () => {
    const { client } = await signedUpCustomer(app, "order");
    const address = await addAddress(client);
    await client.post("/api/v1/cart/items").send({ variantId: POLO, quantity: 2 }).expect(200);
    await client.post("/api/v1/cart/items").send({ variantId: SHIRT, quantity: 1 }).expect(200);
    const [polo, shirt] = [await stock(POLO), await stock(SHIRT)];
    await client.post("/api/v1/checkout/cart").expect(204);
    const first: Order = (
      await client
        .post("/api/v1/orders")
        .set("Idempotency-Key", "cart-order-key-1")
        .send({ addressId: address.id, deliveryOption: "standard" })
        .expect(201)
    ).body;
    expect(first.source).toBe("cart");
    expect(first.items).toHaveLength(2);
    expect((await client.get("/api/v1/cart")).body.lines).toEqual([]);
    expect([await stock(POLO), await stock(SHIRT)]).toEqual([polo - 2, shirt - 1]);

    const before = await counts();
    const retry = await client
      .post("/api/v1/orders")
      .set("Idempotency-Key", "cart-order-key-1")
      .send({ addressId: address.id, deliveryOption: "standard" })
      .expect(200);
    expect(retry.body).toEqual(first);
    expect(await counts()).toEqual(before);

    await client
      .post("/api/v1/checkout/buy-now")
      .send({ variantId: SHIRT, quantity: 1 })
      .expect(204);
    const second: Order = (
      await client
        .post("/api/v1/orders")
        .send({ addressId: address.id, deliveryOption: "standard" })
        .expect(201)
    ).body;
    expect(sequenceOf(second.orderId)).toBe(sequenceOf(first.orderId) + 1);
    await client
      .post("/api/v1/orders")
      .set("Idempotency-Key", "bad key!")
      .send({ addressId: address.id, deliveryOption: "standard" })
      .expect(422);
  });

  it("INSUFFICIENT_STOCK at place time writes nothing", async () => {
    const { client } = await signedUpCustomer(app, "order");
    const address = await addAddress(client);
    const restore = await setStock(prisma, { [LOW]: 2 });
    try {
      await client.post("/api/v1/cart/items").send({ variantId: POLO, quantity: 1 }).expect(200);
      await client.post("/api/v1/cart/items").send({ variantId: LOW, quantity: 2 }).expect(200);
      await prisma.variant.update({ where: { id: LOW }, data: { stock: 1 } }); // someone else bought one
      const [before, polo] = [await counts(), await stock(POLO)];
      const res = await client
        .post("/api/v1/orders")
        .send({ addressId: address.id, deliveryOption: "standard" })
        .expect(409);
      expect(res.body.error).toMatchObject({
        code: "INSUFFICIENT_STOCK",
        details: { available: 1, productName: "Urbano Classic Oxford Shirt" },
      });
      expect(await counts()).toEqual(before);
      expect([await stock(POLO), await stock(LOW)]).toEqual([polo, 1]);
      expect((await client.get("/api/v1/cart")).body.lines).toHaveLength(2);
    } finally {
      await restore();
    }
  });

  it("history newest first; own orders only; cancel restores stock once; Shipped/sample rules", async () => {
    const { client, userId } = await signedUpCustomer(app, "order");
    const address = await addAddress(client);
    const iphone = await stock(IPHONE);
    await client
      .post("/api/v1/checkout/buy-now")
      .send({ variantId: IPHONE, quantity: 2 })
      .expect(204);
    const o1: Order = (
      await client
        .post("/api/v1/orders")
        .send({ addressId: address.id, deliveryOption: "standard" })
        .expect(201)
    ).body;
    await client
      .post("/api/v1/checkout/buy-now")
      .send({ variantId: POLO, quantity: 1 })
      .expect(204);
    const o2: Order = (
      await client
        .post("/api/v1/orders")
        .send({ addressId: address.id, deliveryOption: "standard" })
        .expect(201)
    ).body;

    const list: OrderSummary[] = (await client.get("/api/v1/orders").expect(200)).body;
    expect(list.map((o) => o.orderId)).toEqual([o2.orderId, o1.orderId]);
    expect(list[0]).toMatchObject({
      status: "Placed",
      paymentMethod: "Cash on Delivery",
      itemCount: 1,
      firstItem: { productName: "Northline Piqué Polo T-Shirt" },
    });
    expect((await client.get(`/api/v1/orders/${o1.orderId}`).expect(200)).body).toEqual(o1);

    const cancelled: Order = (await client.post(`/api/v1/orders/${o1.orderId}/cancel`).expect(200))
      .body;
    expect(cancelled.status).toBe("Cancelled");
    expect(cancelled.statusHistory.map((e) => e.status)).toEqual(["Placed", "Cancelled"]);
    expect(await stock(IPHONE)).toBe(iphone);
    const again = await client.post(`/api/v1/orders/${o1.orderId}/cancel`).expect(409);
    expect(again.body.error).toMatchObject({
      code: "ORDER_NOT_CANCELLABLE",
      message: "This order can no longer be cancelled.",
    });
    expect(await stock(IPHONE)).toBe(iphone);

    const other = await signedUpCustomer(app, "order");
    for (const res of [
      await other.client.get(`/api/v1/orders/${o2.orderId}`),
      await other.client.post(`/api/v1/orders/${o2.orderId}/cancel`),
    ]) {
      expect(res.status).toBe(404);
      expect(res.body.error).toMatchObject({
        code: "NOT_FOUND",
        message: "We couldn't find that order.",
      });
    }
    expect((await other.client.get("/api/v1/orders")).body).toEqual([]);
    expect(
      (await prisma.order.findUniqueOrThrow({ where: { orderNumber: o2.orderId } })).customerId,
    ).toBe(userId);
  });

  it("Joseph's sample orders: listed, Shipped/Delivered not cancellable, Confirmed sample cancels without touching stock", async () => {
    const joseph = browser(app);
    await joseph
      .post("/api/v1/auth/login")
      .send({ email: TEST_USER.email, password: TEST_USER.password })
      .expect(200);
    const list: OrderSummary[] = (await joseph.get("/api/v1/orders").expect(200)).body;
    expect(
      list
        .filter((o) => o.orderId <= "NIV-2026-000004")
        .map((o) => o.orderId)
        .sort(),
    ).toEqual(["NIV-2026-000001", "NIV-2026-000002", "NIV-2026-000003", "NIV-2026-000004"]);
    for (const shippedOrDelivered of ["NIV-2026-000001", "NIV-2026-000003"]) {
      expect(
        (await joseph.post(`/api/v1/orders/${shippedOrDelivered}/cancel`).expect(409)).body.error
          .code,
      ).toBe("ORDER_NOT_CANCELLABLE");
    }
    const sample: Order = (await joseph.get("/api/v1/orders/NIV-2026-000004").expect(200)).body;
    expect(sample.isSample).toBe(true);
    const before = await Promise.all(sample.items.map((item) => stock(item.variantId)));
    expect(
      (await joseph.post("/api/v1/orders/NIV-2026-000004/cancel").expect(200)).body.status,
    ).toBe("Cancelled");
    expect(await Promise.all(sample.items.map((item) => stock(item.variantId)))).toEqual(before);
  });
});
