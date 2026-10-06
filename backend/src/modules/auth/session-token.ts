import { createHash, randomBytes } from "node:crypto";
import type { CookieOptions } from "express";

export const SESSION_COOKIE = "nivora_session";

/** 32 random bytes, base64url — the value that goes in the cookie and nowhere else. */
export function newSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

/** What the database stores: SHA-256 of the token, so a leaked table can't be replayed (barch §8). */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** A token we issued: 43 base64url characters. Anything else is ignored without a lookup. */
export function isWellFormedToken(value: unknown): value is string {
  return typeof value === "string" && /^[A-Za-z0-9_-]{43}$/.test(value);
}

export function sessionCookieOptions(secure: boolean, ttlDays: number): CookieOptions {
  return {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: ttlDays * 24 * 60 * 60 * 1000,
  };
}
