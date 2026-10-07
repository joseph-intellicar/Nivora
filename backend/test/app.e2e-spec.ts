import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { createTestApp, FRONTEND } from "./app-factory.js";

describe("HTTP bootstrap (e2e, barch §13)", () => {
  let app: INestApplication;
  let http: ReturnType<INestApplication["getHttpServer"]>;

  beforeAll(async () => {
    app = await createTestApp();
    http = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it("serves under /api/v1 with security headers and a request id", async () => {
    const res = await request(http).get("/api/v1/does-not-exist").expect(404);
    expect(res.headers["x-powered-by"]).toBeUndefined();
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
    expect(res.headers["content-security-policy"]).toContain("default-src 'self'");
    expect(res.headers["x-frame-options"]).toBe("SAMEORIGIN");
    expect(res.headers["x-request-id"]).toMatch(/^[0-9a-f-]{36}$/);
  });

  it("reuses a well-formed X-Request-Id from the proxy and replaces a malformed one", async () => {
    const reused = await request(http).get("/api/v1/x").set("X-Request-Id", "abcdef12-proxy");
    expect(reused.headers["x-request-id"]).toBe("abcdef12-proxy");
    const replaced = await request(http).get("/api/v1/x").set("X-Request-Id", "bad id!");
    expect(replaced.headers["x-request-id"]).not.toBe("bad id!");
  });

  it("rejects mutating requests from another origin or with no origin", async () => {
    await request(http)
      .post("/api/v1/cart/items")
      .set("Origin", "https://evil.example")
      .send({})
      .expect(403);
    await request(http).post("/api/v1/cart/items").send({}).expect(403);
    await request(http)
      .delete("/api/v1/cart/items/x")
      .set("Referer", "https://evil.example/page")
      .expect(403);
  });

  // A path with no route: passing the Origin check shows up as the router's 404 (not a 403).
  it("lets same-origin mutating requests through (Origin or Referer)", async () => {
    await request(http).post("/api/v1/no-such-route").set("Origin", FRONTEND).send({}).expect(404);
    await request(http)
      .post("/api/v1/no-such-route")
      .set("Referer", `${FRONTEND}/cart`)
      .send({})
      .expect(404);
  });

  it("accepts JSON bodies only", async () => {
    await request(http)
      .post("/api/v1/cart/items")
      .set("Origin", FRONTEND)
      .type("form")
      .send("variantId=x&quantity=1")
      .expect(415);
  });

  it("does not apply the origin rule to reads", async () => {
    await request(http).get("/api/v1/x").set("Origin", "https://evil.example").expect(404);
  });
});
