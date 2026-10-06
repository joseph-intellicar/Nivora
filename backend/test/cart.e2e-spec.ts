import type { INestApplication } from "@nestjs/common";
import type { CartView } from "@nivora/shared/domain/types";
import { PrismaService } from "../src/prisma/prisma.service.js";
import { createTestApp } from "./app-factory.js";
import { setStock } from "./catalog-helpers.js";
import { browser, uniqueEmail } from "./http-client.js";

const M = "urbano-classic-oxford-shirt-sky-blue-m"; // stock 25
const L = "urbano-classic-oxford-shirt-sky-blue-l";
const LOW = "urbano-classic-oxford-shirt-sky-blue-s"; // stock 2
const OOS = "urbano-classic-oxford-shirt-white-xxl"; // stock 0

type Client = ReturnType<typeof browser>;

describe.each(["guest", "customer"] as const)("cart as a %s (e2e, P2-021)", (who) => {
  let app: INestApplication;
  let prisma: PrismaService;
  let client: Client;

  const add = (variantId: string, quantity: unknown) =>
    client.post("/api/v1/cart/items").send({ variantId, quantity });
  const errorOf = async (
    res: Promise<{
      status: number;
      body: { error?: { code: string; details: { available?: number } } };
    }>,
  ) => {
    const { body } = await res;
    return [body.error?.code, body.error?.details.available]
      .filter((x) => x !== undefined)
      .join(":");
  };

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
    client = browser(app);
    if (who === "customer") {
      await client
        .post("/api/v1/auth/signup")
        .send({
          name: "Cart",
          email: uniqueEmail("cart"),
          password: "password123",
          confirmPassword: "password123",
        })
        .expect(201);
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it("starts empty without creating anything", async () => {
    const res = await client.get("/api/v1/cart").expect(200);
    expect(res.body).toEqual({
      lines: [],
      issues: [],
      removed: [],
      summary: {
        itemCount: 0,
        subtotal: 0,
        discount: 0,
        deliveryOption: "standard",
        deliveryCharge: 0,
        total: 0,
      },
    });
    expect(res.headers["set-cookie"]).toBeUndefined();
  });

  it("same variant twice → one line; different variant → separate line; server totals", async () => {
    const first = await add(M, 1).expect(200);
    if (who === "guest")
      expect(String(first.headers["set-cookie"])).toMatch(
        /nivora_cart=[A-Za-z0-9_-]{43}; .*HttpOnly; SameSite=Lax/,
      );
    let view: CartView = (await add(M, 1).expect(200)).body;
    expect(view.lines).toHaveLength(1);
    expect(view.lines[0].quantity).toBe(2);
    view = (await add(L, 1).expect(200)).body;
    expect(view.lines).toHaveLength(2);
    expect(view.lines[1].options).toEqual({ Color: "Sky Blue", Size: "L" });
    expect(view.summary).toEqual({
      itemCount: 3,
      subtotal: 3 * 1999,
      discount: 3 * 700,
      deliveryOption: "standard",
      deliveryCharge: 0,
      total: 3 * 1299,
    });
  });

  it("caps at stock with the shared error codes", async () => {
    expect(await errorOf(add(LOW, 3).expect(409))).toBe("INSUFFICIENT_STOCK:2");
    await add(LOW, 2).expect(200);
    expect(await errorOf(add(LOW, 1).expect(409))).toBe("INSUFFICIENT_STOCK:0");
    const oos = await add(OOS, 1).expect(409);
    expect(oos.body.error).toMatchObject({
      code: "OUT_OF_STOCK",
      message: "Urbano Classic Oxford Shirt is currently out of stock.",
    });
  });

  it("rejects invalid variants and quantities", async () => {
    expect(await errorOf(add("nope", 1).expect(400))).toBe("INVALID_VARIANT");
    for (const quantity of [0, 1.5, -1, "2", undefined]) {
      expect(await errorOf(add(M, quantity).expect(400))).toBe("INVALID_QUANTITY");
    }
  });

  it("updates quantities within stock and removes lines", async () => {
    let view: CartView = (
      await client.patch(`/api/v1/cart/items/${M}`).send({ quantity: 5 }).expect(200)
    ).body;
    expect(view.lines.find((l) => l.variantId === M)?.quantity).toBe(5);
    expect(
      await errorOf(client.patch(`/api/v1/cart/items/${LOW}`).send({ quantity: 3 }).expect(409)),
    ).toBe("INSUFFICIENT_STOCK:2");
    expect(
      await errorOf(client.patch(`/api/v1/cart/items/${M}`).send({ quantity: 0 }).expect(400)),
    ).toBe("INVALID_QUANTITY");
    expect(
      await errorOf(
        client.patch("/api/v1/cart/items/not-in-cart").send({ quantity: 1 }).expect(404),
      ),
    ).toBe("NOT_FOUND");
    view = (await client.delete(`/api/v1/cart/items/${L}`).expect(200)).body;
    expect(view.lines.map((l) => l.variantId)).toEqual([M, LOW]);
  });

  it("flags a line when its stock sells out, and clears it when restocked", async () => {
    const restore = await setStock(prisma, { [LOW]: 0 });
    try {
      const view: CartView = (await client.get("/api/v1/cart").expect(200)).body;
      const line = view.lines.find((l) => l.variantId === LOW)!;
      expect(line.issue?.type).toBe("out_of_stock");
      expect(line.available).toBe(0);
      expect(view.issues.map((i) => i.type)).toEqual(["out_of_stock"]);
    } finally {
      await restore();
    }
    expect((await client.get("/api/v1/cart").expect(200)).body.issues).toEqual([]);
  });

  it("drops lines whose product left the catalog and reports them once", async () => {
    const sub = await prisma.subcategory.findFirstOrThrow();
    const product = await prisma.product.create({
      data: {
        id: `gone-${who}`,
        slug: `gone-${who}`,
        name: "Gone",
        brand: "X",
        description: "x",
        images: [],
        rating: 4,
        reviewCount: 0,
        specifications: [],
        options: [],
        attributes: {},
        tags: [],
        createdAt: new Date(),
        position: 999,
        subcategoryId: sub.id,
        variants: {
          create: {
            id: `gone-${who}-v`,
            optionValues: {},
            price: 10,
            originalPrice: 10,
            stock: 5,
            position: 0,
          },
        },
      },
    });
    try {
      const cartId = (
        await prisma.cartItem.findFirstOrThrow({
          where: { variantId: M },
          orderBy: { addedAt: "desc" },
        })
      ).cartId;
      await prisma.cartItem.create({ data: { cartId, variantId: `gone-${who}-v`, quantity: 1 } });
      const first: CartView = (await client.get("/api/v1/cart").expect(200)).body;
      expect(first.removed).toEqual([
        { type: "unavailable", variantId: `gone-${who}-v`, productName: "An item" },
      ]);
      expect(first.lines.some((l) => l.variantId === `gone-${who}-v`)).toBe(false);
      expect((await client.get("/api/v1/cart").expect(200)).body.removed).toEqual([]);
    } finally {
      await prisma.product.delete({ where: { id: product.id } });
    }
  });
});

describe("cart isolation (e2e, P2-021)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it("each guest cookie and each customer has its own cart", async () => {
    const a = browser(app);
    const b = browser(app);
    await a.post("/api/v1/cart/items").send({ variantId: M, quantity: 1 }).expect(200);
    expect((await b.get("/api/v1/cart")).body.lines).toEqual([]);
    expect((await a.get("/api/v1/cart")).body.lines).toHaveLength(1);
  });

  it("an unknown or malformed cart cookie is just an empty guest cart", async () => {
    const res = await browser(app)
      .agent.get("/api/v1/cart")
      .set("Cookie", "nivora_cart=" + "B".repeat(43))
      .expect(200);
    expect(res.body.lines).toEqual([]);
  });
});
