import { Body, Controller, Get, type INestApplication, Logger, Post } from "@nestjs/common";
import { jest } from "@jest/globals";
import type { LoginInput } from "@nivora/shared/domain/types";
import { loginSchema } from "@nivora/shared/domain/validation";
import request from "supertest";
import { RateLimit } from "../src/common/rate-limit/rate-limit.decorator.js";
import { ZodValidationPipe } from "../src/common/validation/zod-validation.pipe.js";
import { createTestApp, FRONTEND } from "./app-factory.js";

@Controller("test")
class ErrorsTestController {
  @Post("login")
  login(@Body(new ZodValidationPipe(loginSchema)) input: LoginInput) {
    return { email: input.email };
  }

  @Get("boom")
  boom(): never {
    throw new TypeError("Cannot read properties of undefined (reading 'passwordHash')");
  }

  @Get("limited")
  @RateLimit({ name: "test", limit: 2, windowMs: 60_000 })
  limited() {
    return { ok: true };
  }
}

const UNKNOWN = {
  error: { code: "UNKNOWN", message: "Something went wrong. Please try again.", details: {} },
};

describe("error envelope (e2e, barch §7)", () => {
  let app: INestApplication;
  let http: ReturnType<INestApplication["getHttpServer"]>;
  const post = (path: string) => request(http).post(path).set("Origin", FRONTEND);

  beforeAll(async () => {
    app = await createTestApp([ErrorsTestController]);
    http = app.getHttpServer();
  });

  afterAll(async () => {
    await app.close();
  });

  it("validates bodies with shared schemas and returns field messages (422)", async () => {
    const res = await post("/api/v1/test/login").send({ email: "nope", password: "" }).expect(422);
    expect(res.body).toEqual({
      error: {
        code: "VALIDATION",
        message: "Please check the highlighted details and try again.",
        details: {
          fields: {
            email: "Please enter a valid email address.",
            password: "Please enter your password.",
          },
        },
      },
    });
    await post("/api/v1/test/login")
      .send({ email: " a@b.co ", password: "x" })
      .expect(201, { email: "a@b.co" });
  });

  it("rejects malformed JSON without echoing parser internals", async () => {
    const res = await post("/api/v1/test/login")
      .set("Content-Type", "application/json")
      .send('{"email": ')
      .expect(400);
    expect(res.body.error.code).toBe("VALIDATION");
    expect(JSON.stringify(res.body)).not.toMatch(/JSON|position|token/i);
  });

  it("rejects bodies over 100 kb (413)", async () => {
    const res = await post("/api/v1/test/login")
      .send({ email: "a@b.co", password: "x".repeat(110_000) })
      .expect(413);
    expect(res.body.error.code).toBe("VALIDATION");
  });

  it("uses the envelope for unknown routes, cross-origin and non-JSON requests", async () => {
    expect((await request(http).get("/api/v1/nope").expect(404)).body.error).toEqual({
      code: "NOT_FOUND",
      message: "We couldn't find what you were looking for.",
      details: {},
    });
    expect(
      (await request(http).post("/api/v1/test/login").send({}).expect(403)).body.error.code,
    ).toBe("FORBIDDEN");
    expect(
      (await post("/api/v1/test/login").type("form").send("email=a").expect(415)).body.error.code,
    ).toBe("VALIDATION");
  });

  it("hides unexpected errors behind UNKNOWN 500 and logs them with the request id", async () => {
    const logged = jest.spyOn(Logger.prototype, "error").mockImplementation(() => undefined);
    try {
      const res = await request(http)
        .get("/api/v1/test/boom")
        .set("X-Request-Id", "boom-request-1")
        .expect(500);
      expect(res.body).toEqual(UNKNOWN);
      expect(JSON.stringify(res.body)).not.toContain("passwordHash");
      expect(logged).toHaveBeenCalledWith(
        expect.stringContaining("GET /api/v1/test/boom id=boom-request-1: TypeError"),
        expect.stringContaining("ErrorsTestController.boom"),
      );
    } finally {
      logged.mockRestore();
    }
  });

  it("rate-limits with RATE_LIMITED 429 and Retry-After", async () => {
    await request(http).get("/api/v1/test/limited").expect(200);
    await request(http).get("/api/v1/test/limited").expect(200);
    const res = await request(http).get("/api/v1/test/limited").expect(429);
    expect(res.body.error).toEqual({
      code: "RATE_LIMITED",
      message: "Too many attempts. Please wait a moment and try again.",
      details: {},
    });
    expect(Number(res.headers["retry-after"])).toBeGreaterThan(0);
  });
});
