import { type CanActivate, type ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ApiError } from "@nivora/shared/errors";
import type { Request, Response } from "express";
import { DEFAULT_RATE_LIMIT, RATE_LIMIT_KEY, type RateLimitRule } from "./rate-limit.decorator.js";

type Window = { count: number; resetAt: number };

const MAX_TRACKED = 50_000;

/**
 * In-memory fixed-window rate limiting per client IP (barch §13). Replaces @nestjs/throttler,
 * which is still CommonJS and cannot load ESM-only Nest 12 under Jest on Node 22. One API
 * instance is enough for Phase 2; a shared store (e.g. Redis) would be needed when scaling out.
 */
@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly windows = new Map<string, Window>();

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    if (context.getType() !== "http") return true;
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();
    const extra = this.reflector.getAllAndOverride<RateLimitRule | undefined>(RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const now = Date.now();
    const client = req.ip ?? "unknown";
    for (const rule of extra ? [DEFAULT_RATE_LIMIT, extra] : [DEFAULT_RATE_LIMIT]) {
      const retryAfterMs = this.hit(`${rule.name}:${client}`, rule, now);
      if (retryAfterMs !== null) {
        res.setHeader("Retry-After", Math.ceil(retryAfterMs / 1000));
        throw new ApiError("RATE_LIMITED");
      }
    }
    return true;
  }

  /** Counts a request; returns ms until the window resets when over the limit, else null. */
  private hit(key: string, rule: RateLimitRule, now: number): number | null {
    let window = this.windows.get(key);
    if (!window || window.resetAt <= now) {
      if (this.windows.size >= MAX_TRACKED) this.prune(now);
      window = { count: 0, resetAt: now + rule.windowMs };
      this.windows.set(key, window);
    }
    window.count += 1;
    return window.count > rule.limit ? window.resetAt - now : null;
  }

  private prune(now: number): void {
    for (const [key, window] of this.windows) if (window.resetAt <= now) this.windows.delete(key);
    // Still full (a flood of distinct clients): start over rather than grow without bound.
    if (this.windows.size >= MAX_TRACKED) this.windows.clear();
  }
}
