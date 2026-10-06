import type { INestApplication } from "@nestjs/common";
import { PrismaService } from "../src/prisma/prisma.service.js";
import { createTestApp } from "./app-factory.js";
import { addAddress, signedUpCustomer } from "./test-data.js";

const VARIANT = "kesh-ayur-onion-hair-oil";
const ROUNDS = 5;

type Customer = Awaited<ReturnType<typeof signedUpCustomer>> & { addressId: string };

describe("concurrency and integrity (e2e, P2-028)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let customers: Customer[];
  const stock = async () =>
    (await prisma.variant.findUniqueOrThrow({ where: { id: VARIANT } })).stock;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
    customers = await Promise.all(
      Array.from({ length: 10 }, async () => {
        const customer = await signedUpCustomer(app, "race");
        return { ...customer, addressId: (await addAddress(customer.client)).id };
      }),
    );
  }, 300_000);

  afterAll(async () => {
    await prisma.variant.update({ where: { id: VARIANT }, data: { stock: 55 } });
    await app.close();
  });

  it(`10 simultaneous orders for the last 3 units → exactly 3 succeed, stock 0, never negative (×${ROUNDS})`, async () => {
    for (let round = 1; round <= ROUNDS; round += 1) {
      await prisma.variant.update({ where: { id: VARIANT }, data: { stock: 10 } });
      await Promise.all(
        customers.map((c) =>
          c.client
            .post("/api/v1/checkout/buy-now")
            .send({ variantId: VARIANT, quantity: 1 })
            .expect(204),
        ),
      );
      await prisma.variant.update({ where: { id: VARIANT }, data: { stock: 3 } });
      const ordersBefore = await prisma.order.count();

      const results = await Promise.all(
        customers.map((c) =>
          c.client
            .post("/api/v1/orders")
            .send({ addressId: c.addressId, deliveryOption: "standard" }),
        ),
      );
      const statuses = results.map((r) => r.status).sort();
      expect(statuses.filter((s) => s === 201)).toHaveLength(3);
      expect(statuses.filter((s) => s === 409)).toHaveLength(7);
      for (const failed of results.filter((r) => r.status === 409)) {
        expect(["OUT_OF_STOCK", "INSUFFICIENT_STOCK"]).toContain(failed.body.error.code);
      }
      expect(await stock()).toBe(0);
      expect(await prisma.order.count()).toBe(ordersBefore + 3);
      const numbers = results.filter((r) => r.status === 201).map((r) => r.body.orderId as string);
      expect(new Set(numbers).size).toBe(3);
      // Pending Buy Now is cleared only for the winners; clear the losers' for the next round.
      await prisma.checkoutSession.deleteMany({
        where: { userId: { in: customers.map((c) => c.userId) } },
      });
    }
  });

  it(`5 parallel Place Order calls with one Idempotency-Key → one order, stock −1 (×${ROUNDS})`, async () => {
    const [customer] = customers;
    for (let round = 1; round <= ROUNDS; round += 1) {
      await prisma.variant.update({ where: { id: VARIANT }, data: { stock: 20 } });
      await customer.client
        .post("/api/v1/checkout/buy-now")
        .send({ variantId: VARIANT, quantity: 1 })
        .expect(204);
      const key = `same-key-round-${round}-${customer.userId}`;
      const ordersBefore = await prisma.order.count();
      const results = await Promise.all(
        Array.from({ length: 5 }, () =>
          customer.client
            .post("/api/v1/orders")
            .set("Idempotency-Key", key)
            .send({ addressId: customer.addressId, deliveryOption: "standard" }),
        ),
      );
      expect(results.map((r) => r.status).sort()).toEqual([200, 200, 200, 200, 201]);
      expect(new Set(results.map((r) => r.body.orderId)).size).toBe(1);
      expect(await prisma.order.count()).toBe(ordersBefore + 1);
      expect(await stock()).toBe(19);
    }
  });

  it(`5 parallel cancels of one order → restored exactly once (×${ROUNDS})`, async () => {
    const [, customer] = customers;
    for (let round = 1; round <= ROUNDS; round += 1) {
      await prisma.variant.update({ where: { id: VARIANT }, data: { stock: 20 } });
      await customer.client
        .post("/api/v1/checkout/buy-now")
        .send({ variantId: VARIANT, quantity: 2 })
        .expect(204);
      const order = (
        await customer.client
          .post("/api/v1/orders")
          .send({ addressId: customer.addressId, deliveryOption: "standard" })
          .expect(201)
      ).body;
      expect(await stock()).toBe(18);
      const results = await Promise.all(
        Array.from({ length: 5 }, () =>
          customer.client.post(`/api/v1/orders/${order.orderId}/cancel`),
        ),
      );
      expect(results.map((r) => r.status).sort()).toEqual([200, 409, 409, 409, 409]);
      expect(await stock()).toBe(20);
      const events = await prisma.orderStatusEvent.count({
        where: { order: { orderNumber: order.orderId }, status: "Cancelled" },
      });
      expect(events).toBe(1);
    }
  });

  it("no variant anywhere has negative stock and every order adds up", async () => {
    expect(await prisma.variant.count({ where: { stock: { lt: 0 } } })).toBe(0);
    const orders = await prisma.order.findMany({ include: { items: true } });
    for (const order of orders) {
      expect(order.total).toBe(order.subtotal - order.discount + order.deliveryCharge);
      expect(order.subtotal).toBe(
        order.items.reduce((sum, item) => sum + item.unitOriginalPrice * item.quantity, 0),
      );
    }
  });
});
