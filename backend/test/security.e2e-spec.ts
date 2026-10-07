import { type INestApplication, Logger } from "@nestjs/common";
import { jest } from "@jest/globals";
import request from "supertest";
import { createTestApp } from "./app-factory.js";
import { addAddress, signedUpCustomer } from "./test-data.js";

const VARIANT = "northline-pique-polo-t-shirt-black-l";

describe("security review (e2e, P2-035)", () => {
  let app: INestApplication;
  const logs: string[] = [];

  beforeAll(async () => {
    for (const level of ["log", "warn", "error", "debug", "verbose"] as const) {
      jest.spyOn(Logger.prototype, level).mockImplementation((...args: unknown[]) => {
        logs.push(
          args.map((a) => (a instanceof Error ? `${a.message} ${a.stack}` : String(a))).join(" "),
        );
      });
    }
    app = await createTestApp();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
    await app.close();
  });

  it("one customer can never read or change another customer's data", async () => {
    const owner = await signedUpCustomer(app, "owner");
    const intruder = await signedUpCustomer(app, "intruder");
    const address = await addAddress(owner.client);
    await owner.client.put("/api/v1/wishlist/apple-iphone-15").expect(204);
    await owner.client
      .post("/api/v1/checkout/buy-now")
      .send({ variantId: VARIANT, quantity: 1 })
      .expect(204);
    const order = (
      await owner.client
        .post("/api/v1/orders")
        .send({ addressId: address.id, deliveryOption: "standard" })
        .expect(201)
    ).body;
    await owner.client
      .post("/api/v1/cart/items")
      .send({ variantId: VARIANT, quantity: 1 })
      .expect(200);

    const i = intruder.client;
    await i
      .put(`/api/v1/addresses/${address.id}`)
      .send({ ...address, city: "X" })
      .expect(404);
    await i.delete(`/api/v1/addresses/${address.id}`).expect(404);
    await i.post(`/api/v1/addresses/${address.id}/default`).expect(404);
    await i.get(`/api/v1/orders/${order.orderId}`).expect(404);
    await i.post(`/api/v1/orders/${order.orderId}/cancel`).expect(404);
    await i.delete("/api/v1/wishlist/apple-iphone-15").expect(204); // only ever touches the intruder's own list
    await i.delete(`/api/v1/cart/items/${VARIANT}`).expect(200);
    await i.post("/api/v1/checkout/buy-now").send({ variantId: VARIANT, quantity: 1 }).expect(204);
    expect(
      (
        await i
          .post("/api/v1/orders")
          .send({ addressId: address.id, deliveryOption: "standard" })
          .expect(409)
      ).body.error.code,
    ).toBe("ADDRESS_REQUIRED");
    expect((await i.get("/api/v1/addresses")).body).toEqual([]);
    expect((await i.get("/api/v1/orders")).body).toEqual([]);
    expect((await i.get("/api/v1/wishlist")).body).toEqual([]);

    expect((await owner.client.get("/api/v1/addresses")).body).toEqual([address]);
    expect((await owner.client.get(`/api/v1/orders/${order.orderId}`)).body.status).toBe("Placed");
    expect((await owner.client.get("/api/v1/wishlist")).body).toHaveLength(1);
    expect((await owner.client.get("/api/v1/cart")).body.lines).toHaveLength(1);
  });

  it.each([
    ["POST", "/api/v1/auth/login"],
    ["POST", "/api/v1/auth/signup"],
    ["POST", "/api/v1/auth/logout"],
    ["POST", "/api/v1/cart/items"],
    ["PATCH", `/api/v1/cart/items/${VARIANT}`],
    ["DELETE", `/api/v1/cart/items/${VARIANT}`],
    ["PUT", "/api/v1/wishlist/apple-iphone-15"],
    ["POST", "/api/v1/addresses"],
    ["POST", "/api/v1/checkout/buy-now"],
    ["POST", "/api/v1/orders"],
    ["POST", "/api/v1/orders/NIV-2026-000001/cancel"],
    ["PATCH", "/api/v1/me"],
  ])("cross-origin %s %s → 403 FORBIDDEN", async (method, path) => {
    const res = await request(app.getHttpServer())
      [method.toLowerCase() as "post"](path)
      .set("Origin", "https://evil.example")
      .send({});
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe("FORBIDDEN");
  });

  it("error responses never contain stack traces, file paths or SQL", async () => {
    const server = app.getHttpServer();
    const { client } = await signedUpCustomer(app, "errors");
    const responses = [
      await request(server).get("/api/v1/products/%E0%A4%A"),
      await request(server).get("/api/v1/products?page=999999999999999999999&price=1-2-3"),
      await client
        .post("/api/v1/cart/items")
        .send({ variantId: { $ne: null }, quantity: "1; DROP TABLE users" }),
      await client
        .post("/api/v1/orders")
        .send({ addressId: "' OR 1=1 --", deliveryOption: "standard" }),
      await client
        .post("/api/v1/addresses")
        .set("Content-Type", "application/json")
        .send('{"fullName":'),
      await client.get("/api/v1/orders/../../etc/passwd"),
    ];
    for (const res of responses) {
      const body = JSON.stringify(res.body);
      expect(body).not.toMatch(/node_modules|\.ts:\d|\bat [A-Za-z.]+ \(|prisma|SELECT |postgres/i);
      if (res.status >= 400)
        expect(res.body.error).toMatchObject({
          code: expect.any(String),
          message: expect.any(String),
        });
    }
  });

  it("session cookies are HttpOnly and SameSite=Lax; tokens never appear in logs", async () => {
    const before = logs.length;
    const { client, email } = await signedUpCustomer(app, "logs");
    const login = await client
      .post("/api/v1/auth/login")
      .send({ email, password: "password123" })
      .expect(200);
    const cookie = String(login.headers["set-cookie"]);
    expect(cookie).toMatch(/nivora_session=[^;]+; .*HttpOnly; SameSite=Lax/);
    const token = /nivora_session=([^;]+)/.exec(cookie)![1];
    await addAddress(client, { phone: "9123456789" });
    await client
      .post("/api/v1/auth/login")
      .send({ email, password: "wrong-password-1" })
      .expect(401);
    const written = logs.slice(before).join("\n");
    expect(written.length).toBeGreaterThan(0);
    for (const secret of [token, "password123", "wrong-password-1", "9123456789", email]) {
      expect(written).not.toContain(secret);
    }
  });
});
