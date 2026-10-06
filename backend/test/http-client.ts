import { randomUUID } from "node:crypto";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { FRONTEND } from "./app-factory.js";

/**
 * A browser-like client: keeps cookies between requests (like the session and guest-cart cookies)
 * and sends the frontend Origin on mutating requests, as the Next.js proxy would.
 */
export function browser(app: INestApplication) {
  const agent = request.agent(app.getHttpServer());
  return {
    get: (path: string) => agent.get(path),
    post: (path: string) => agent.post(path).set("Origin", FRONTEND),
    put: (path: string) => agent.put(path).set("Origin", FRONTEND),
    patch: (path: string) => agent.patch(path).set("Origin", FRONTEND),
    delete: (path: string) => agent.delete(path).set("Origin", FRONTEND),
    agent,
  };
}

/** A fresh email per test so suites never depend on each other's customers. */
export function uniqueEmail(prefix = "customer"): string {
  return `${prefix}-${randomUUID().slice(0, 8)}@test.nivora.in`;
}
