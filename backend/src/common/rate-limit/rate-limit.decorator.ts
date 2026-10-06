import { SetMetadata } from "@nestjs/common";

export type RateLimitRule = {
  /** Bucket name; requests share a counter per client and bucket. */
  name: string;
  /** Requests allowed per window. */
  limit: number;
  windowMs: number;
};

export const RATE_LIMIT_KEY = "nivora:rate-limit";

/** Every route: generous, protects the server from floods (barch §13). */
export const DEFAULT_RATE_LIMIT: RateLimitRule = { name: "default", limit: 300, windowMs: 60_000 };

/** Adds a stricter limit to a route or controller (e.g. login and signup), on top of the default. */
export const RateLimit = (rule: RateLimitRule) => SetMetadata(RATE_LIMIT_KEY, rule);
