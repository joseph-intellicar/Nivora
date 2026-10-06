import type { INestApplication } from "@nestjs/common";
import { TEST_USER } from "@nivora/shared/data/seedUsers";
import request from "supertest";
import { PrismaService } from "../src/prisma/prisma.service.js";
import { createTestApp } from "./app-factory.js";
import { browser, uniqueEmail } from "./http-client.js";

const signupBody = (email: string, password = "password123", confirmPassword = password) => ({
  name: "New Customer",
  email,
  password,
  confirmPassword,
});

describe("auth endpoints (e2e, P2-019)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  it("nobody is logged in automatically", async () => {
    expect((await browser(app).get("/api/v1/auth/session").expect(200)).body).toEqual({
      user: null,
    });
  });

  it("the predefined test user logs in with joseph@example.com / password123 (req §7.1)", async () => {
    const client = browser(app);
    const res = await client
      .post("/api/v1/auth/login")
      .send({ email: TEST_USER.email, password: TEST_USER.password })
      .expect(200);
    expect(res.body).toEqual({
      user: { id: "user-joseph", name: "Joseph", email: "joseph@example.com" },
      mergedSavedItems: false,
    });
    expect((await client.get("/api/v1/auth/session")).body.user.id).toBe("user-joseph");
  });

  it("email is case-insensitive and trimmed", async () => {
    await browser(app)
      .post("/api/v1/auth/login")
      .send({ email: "  JOSEPH@Example.COM ", password: "password123" })
      .expect(200);
  });

  it.each([
    ["wrong password", { email: TEST_USER.email, password: "password124" }],
    ["unknown email", { email: "nobody@example.com", password: "password123" }],
    ["empty fields", { email: "", password: "" }],
    ["malformed body", { username: "joseph" }],
  ])("%s → generic INVALID_CREDENTIALS 401", async (_, body) => {
    const res = await browser(app).post("/api/v1/auth/login").send(body).expect(401);
    expect(res.body.error).toEqual({
      code: "INVALID_CREDENTIALS",
      message: "Incorrect email or password.",
      details: {},
    });
    expect(res.headers["set-cookie"]).toBeUndefined();
  });

  it("signup creates a lower-cased account with an argon2id hash and logs in", async () => {
    const email = uniqueEmail("signup").toUpperCase();
    const client = browser(app);
    const res = await client.post("/api/v1/auth/signup").send(signupBody(email)).expect(201);
    expect(res.body).toEqual({
      user: { id: expect.any(String), name: "New Customer", email: email.toLowerCase() },
      mergedSavedItems: false,
    });
    expect((await client.get("/api/v1/auth/session")).body.user.email).toBe(email.toLowerCase());
    const row = await prisma.user.findUniqueOrThrow({ where: { email: email.toLowerCase() } });
    expect(row.passwordHash).toMatch(/^\$argon2id\$/);
    expect(row.passwordHash).not.toContain("password123");
  });

  it("duplicate signup (any case) → EMAIL_TAKEN 409 with the email field message", async () => {
    const res = await browser(app)
      .post("/api/v1/auth/signup")
      .send(signupBody("Joseph@example.com"))
      .expect(409);
    expect(res.body.error).toEqual({
      code: "EMAIL_TAKEN",
      message: "An account with this email already exists. Try logging in.",
      details: { fields: { email: "An account with this email already exists. Try logging in." } },
    });
  });

  it("weak password and mismatch → 422 with req §28 field messages", async () => {
    const weak = await browser(app)
      .post("/api/v1/auth/signup")
      .send(signupBody(uniqueEmail(), "password"))
      .expect(422);
    expect(weak.body.error.details.fields.password).toBe(
      "Password must be at least 8 characters and include a letter and a number.",
    );
    const mismatch = await browser(app)
      .post("/api/v1/auth/signup")
      .send(signupBody(uniqueEmail(), "password123", "password124"))
      .expect(422);
    expect(mismatch.body.error.details.fields.confirmPassword).toBe("Passwords do not match.");
    const bad = await browser(app)
      .post("/api/v1/auth/signup")
      .send({ name: "", email: "nope" })
      .expect(422);
    expect(Object.keys(bad.body.error.details.fields)).toEqual(
      expect.arrayContaining(["name", "email", "password"]),
    );
  });

  it("the session persists across requests and logout ends only the session", async () => {
    const email = uniqueEmail("logout");
    const client = browser(app);
    const { body } = await client.post("/api/v1/auth/signup").send(signupBody(email)).expect(201);
    const userId = body.user.id as string;
    await prisma.address.create({
      data: {
        userId,
        fullName: "A",
        phone: "9876543210",
        line1: "1",
        city: "B",
        state: "Karnataka",
        postalCode: "560038",
      },
    });
    await prisma.checkoutSession.create({
      data: {
        userId,
        source: "buy_now",
        buyNowVariantId: "urbano-classic-oxford-shirt-sky-blue-m",
        buyNowQuantity: 1,
      },
    });
    for (let i = 0; i < 3; i += 1)
      expect((await client.get("/api/v1/auth/session")).body.user.id).toBe(userId);

    const out = await client.post("/api/v1/auth/logout").expect(204);
    expect(String(out.headers["set-cookie"])).toMatch(/nivora_session=;/);
    expect((await client.get("/api/v1/auth/session")).body).toEqual({ user: null });
    expect(await prisma.session.count({ where: { userId } })).toBe(0);
    expect(await prisma.checkoutSession.count({ where: { userId } })).toBe(0); // pending Buy Now cleared
    expect(await prisma.address.count({ where: { userId } })).toBe(1); // data kept (req §27)

    await client.post("/api/v1/auth/login").send({ email, password: "password123" }).expect(200);
    expect((await client.get("/api/v1/auth/session")).body.user.id).toBe(userId);
  });

  it("issues a new token on every login and ends the previous session", async () => {
    const client = browser(app);
    const first = await client
      .post("/api/v1/auth/login")
      .send({ email: TEST_USER.email, password: TEST_USER.password });
    const second = await client
      .post("/api/v1/auth/login")
      .send({ email: TEST_USER.email, password: TEST_USER.password });
    const token = (res: request.Response) =>
      /nivora_session=([^;]+)/.exec(String(res.headers["set-cookie"]))![1];
    expect(token(first)).not.toBe(token(second));
    const old = await request(app.getHttpServer())
      .get("/api/v1/auth/session")
      .set("Cookie", `nivora_session=${token(first)}`);
    expect(old.body).toEqual({ user: null });
  });

  it("locks an email after 5 failed logins (429), even with the right password", async () => {
    const email = uniqueEmail("lock");
    await browser(app).post("/api/v1/auth/signup").send(signupBody(email)).expect(201);
    for (let i = 0; i < 5; i += 1) {
      await browser(app)
        .post("/api/v1/auth/login")
        .send({ email, password: "wrongpass1" })
        .expect(401);
    }
    const locked = await browser(app)
      .post("/api/v1/auth/login")
      .send({ email, password: "password123" })
      .expect(429);
    expect(locked.body.error.code).toBe("RATE_LIMITED");
  });

  it("rate-limits login per IP (30 a minute) with RATE_LIMITED 429", async () => {
    const fresh = await createTestApp();
    try {
      const statuses: number[] = [];
      for (let i = 0; i < 31; i += 1) {
        const res = await browser(fresh)
          .post("/api/v1/auth/login")
          .send({ email: `ip-${i}@example.com`, password: "x" });
        statuses.push(res.status);
      }
      expect(statuses.slice(0, 30).every((s) => s === 401)).toBe(true);
      expect(statuses[30]).toBe(429);
    } finally {
      await fresh.close();
    }
  });
});
