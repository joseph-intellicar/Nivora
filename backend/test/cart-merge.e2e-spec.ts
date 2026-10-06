import type { INestApplication } from "@nestjs/common";
import type { CartView } from "@nivora/shared/domain/types";
import { PrismaService } from "../src/prisma/prisma.service.js";
import { createTestApp } from "./app-factory.js";
import { browser, uniqueEmail } from "./http-client.js";

const M = "urbano-classic-oxford-shirt-sky-blue-m";
const L = "urbano-classic-oxford-shirt-sky-blue-l";
const LOW = "urbano-classic-oxford-shirt-sky-blue-s"; // stock 2
const KAFTAN = "saanjh-printed-kaftan-ivory-print-free-size";

describe("guest cart merge on login/signup (e2e, P2-022)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  async function newCustomer(lines: Array<[string, number]> = []) {
    const email = uniqueEmail("merge");
    const client = browser(app);
    await client
      .post("/api/v1/auth/signup")
      .send({ name: "M", email, password: "password123", confirmPassword: "password123" })
      .expect(201);
    for (const [variantId, quantity] of lines)
      await client.post("/api/v1/cart/items").send({ variantId, quantity }).expect(200);
    await client.post("/api/v1/auth/logout").expect(204);
    return { email, client };
  }

  const cartCookie = (res: { headers: Record<string, unknown> }) =>
    String(res.headers["set-cookie"] ?? "");

  it("sums overlaps capped at stock, adds new lines, reports saved items, deletes the guest cart", async () => {
    const { email, client } = await newCustomer([
      [LOW, 1],
      [M, 2],
    ]);
    await client.post("/api/v1/cart/items").send({ variantId: LOW, quantity: 2 }).expect(200); // guest: LOW ×2
    const guest = await client
      .post("/api/v1/cart/items")
      .send({ variantId: L, quantity: 1 })
      .expect(200);
    expect(guest.body.lines).toHaveLength(2);
    const guestCarts = await prisma.cart.count({ where: { guestToken: { not: null } } });

    const login = await client
      .post("/api/v1/auth/login")
      .send({ email, password: "password123" })
      .expect(200);
    expect(login.body.mergedSavedItems).toBe(true);
    expect(cartCookie(login)).toMatch(/nivora_cart=;.*Expires=Thu, 01 Jan 1970/);
    const view: CartView = (await client.get("/api/v1/cart").expect(200)).body;
    expect(Object.fromEntries(view.lines.map((l) => [l.variantId, l.quantity]))).toEqual({
      [LOW]: 2,
      [M]: 2,
      [L]: 1,
    });
    expect(await prisma.cart.count({ where: { guestToken: { not: null } } })).toBe(guestCarts - 1);

    await client.post("/api/v1/auth/logout").expect(204);
    expect((await client.get("/api/v1/cart").expect(200)).body.lines).toEqual([]);
  });

  it("mergedSavedItems is false when the customer had no saved cart", async () => {
    const { email, client } = await newCustomer();
    await client.post("/api/v1/cart/items").send({ variantId: KAFTAN, quantity: 1 }).expect(200);
    const login = await client
      .post("/api/v1/auth/login")
      .send({ email, password: "password123" })
      .expect(200);
    expect(login.body.mergedSavedItems).toBe(false);
    expect(
      (await client.get("/api/v1/cart")).body.lines.map((l: { variantId: string }) => l.variantId),
    ).toEqual([KAFTAN]);
  });

  it("mergedSavedItems is false when the guest cart is empty, and the saved cart is untouched", async () => {
    const { email, client } = await newCustomer([[M, 3]]);
    const login = await client
      .post("/api/v1/auth/login")
      .send({ email, password: "password123" })
      .expect(200);
    expect(login.body.mergedSavedItems).toBe(false);
    expect(
      (await client.get("/api/v1/cart")).body.lines.map((l: { quantity: number }) => l.quantity),
    ).toEqual([3]);
  });

  it("signup takes the guest cart along", async () => {
    const client = browser(app);
    await client.post("/api/v1/cart/items").send({ variantId: M, quantity: 2 }).expect(200);
    const signup = await client
      .post("/api/v1/auth/signup")
      .send({
        name: "S",
        email: uniqueEmail("signup-merge"),
        password: "password123",
        confirmPassword: "password123",
      })
      .expect(201);
    expect(signup.body.mergedSavedItems).toBe(false);
    expect(
      (await client.get("/api/v1/cart")).body.lines.map((l: { quantity: number }) => l.quantity),
    ).toEqual([2]);
  });

  it("the same variant in both carts counts as saved items", async () => {
    const { email, client } = await newCustomer([[M, 1]]);
    await client.post("/api/v1/cart/items").send({ variantId: M, quantity: 1 }).expect(200);
    const login = await client
      .post("/api/v1/auth/login")
      .send({ email, password: "password123" })
      .expect(200);
    expect(login.body.mergedSavedItems).toBe(true);
    expect(
      (await client.get("/api/v1/cart")).body.lines.map((l: { quantity: number }) => l.quantity),
    ).toEqual([2]);
  });
});
