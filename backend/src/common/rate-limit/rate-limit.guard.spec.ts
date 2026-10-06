import type { ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { jest } from "@jest/globals";
import { ApiError } from "@nivora/shared/errors";
import { RateLimit } from "./rate-limit.decorator.js";
import { RateLimitGuard } from "./rate-limit.guard.js";

class Routes {
  open(): void {}
  @RateLimit({ name: "login", limit: 2, windowMs: 1_000 })
  login(): void {}
}

function contextFor(
  handler: keyof Routes,
  ip: string,
  headers: Record<string, unknown>,
): ExecutionContext {
  return {
    getType: () => "http",
    getHandler: () => Routes.prototype[handler],
    getClass: () => Routes,
    switchToHttp: () => ({
      getRequest: () => ({ ip }),
      getResponse: () => ({ setHeader: (name: string, value: unknown) => (headers[name] = value) }),
    }),
  } as unknown as ExecutionContext;
}

describe("RateLimitGuard (barch §13)", () => {
  afterEach(() => jest.useRealTimers());

  it("applies a route's stricter limit per client and reports Retry-After", () => {
    const guard = new RateLimitGuard(new Reflector());
    const headers: Record<string, unknown> = {};
    expect(guard.canActivate(contextFor("login", "1.1.1.1", headers))).toBe(true);
    expect(guard.canActivate(contextFor("login", "1.1.1.1", headers))).toBe(true);
    let error: unknown;
    try {
      guard.canActivate(contextFor("login", "1.1.1.1", headers));
    } catch (caught) {
      error = caught;
    }
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).code).toBe("RATE_LIMITED");
    expect(headers["Retry-After"]).toBe(1);
    // Another client and an unlimited route are unaffected.
    expect(guard.canActivate(contextFor("login", "2.2.2.2", {}))).toBe(true);
    expect(guard.canActivate(contextFor("open", "1.1.1.1", {}))).toBe(true);
  });

  it("opens a new window after the old one expires", () => {
    jest.useFakeTimers({ now: 0 });
    const guard = new RateLimitGuard(new Reflector());
    guard.canActivate(contextFor("login", "1.1.1.1", {}));
    guard.canActivate(contextFor("login", "1.1.1.1", {}));
    expect(() => guard.canActivate(contextFor("login", "1.1.1.1", {}))).toThrow(ApiError);
    jest.setSystemTime(1_001);
    expect(guard.canActivate(contextFor("login", "1.1.1.1", {}))).toBe(true);
  });

  it("limits every route to 300 requests a minute by default", () => {
    const guard = new RateLimitGuard(new Reflector());
    for (let i = 0; i < 300; i += 1) guard.canActivate(contextFor("open", "3.3.3.3", {}));
    expect(() => guard.canActivate(contextFor("open", "3.3.3.3", {}))).toThrow(ApiError);
  });
});
