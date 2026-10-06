import { type INestApplication, Logger } from "@nestjs/common";
import { jest } from "@jest/globals";
import request from "supertest";
import { PrismaService } from "../src/prisma/prisma.service.js";
import { createTestApp } from "./app-factory.js";

describe("GET /api/v1/health (e2e, barch §19)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it("reports the API and database as healthy, uncached", async () => {
    const res = await request(app.getHttpServer()).get("/api/v1/health").expect(200);
    expect(res.body).toEqual({ status: "ok", db: "ok" });
    expect(res.headers["cache-control"]).toBe("no-store");
  });

  it("uses the test schema from .env.test", () => {
    expect(app.get(PrismaService).schema).toBe("nivora_test");
  });

  it("reports a database outage as 503 instead of crashing", async () => {
    const prisma = app.get(PrismaService);
    const original = prisma.$queryRaw.bind(prisma);
    const warned = jest.spyOn(Logger.prototype, "warn").mockImplementation(() => undefined);
    const errored = jest.spyOn(Logger.prototype, "error").mockImplementation(() => undefined);
    Object.assign(prisma, {
      $queryRaw: () => Promise.reject(Object.assign(new Error("down"), { code: "ETIMEDOUT" })),
    });
    try {
      const res = await request(app.getHttpServer()).get("/api/v1/health").expect(503);
      expect(res.body).toEqual({ status: "degraded", db: "down" });
      expect(warned).toHaveBeenCalledWith("Database check failed: ETIMEDOUT");
    } finally {
      Object.assign(prisma, { $queryRaw: original });
      warned.mockRestore();
      errored.mockRestore();
    }
  });
});
