import {
  hashToken,
  isWellFormedToken,
  newSessionToken,
  sessionCookieOptions,
} from "./session-token.js";

describe("session tokens (barch §8)", () => {
  it("creates 32-byte base64url tokens that are unique", () => {
    const tokens = new Set(Array.from({ length: 1000 }, newSessionToken));
    expect(tokens.size).toBe(1000);
    for (const token of tokens) {
      expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
      expect(Buffer.from(token, "base64url")).toHaveLength(32);
    }
  });

  it("stores only a SHA-256 hex hash, never the token", () => {
    const token = newSessionToken();
    const hash = hashToken(token);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
    expect(hash).not.toContain(token);
    expect(hashToken(token)).toBe(hash);
    expect(hashToken(newSessionToken())).not.toBe(hash);
  });

  it("accepts only tokens we could have issued", () => {
    expect(isWellFormedToken(newSessionToken())).toBe(true);
    for (const value of [undefined, "", "abc", "x".repeat(44), "a".repeat(42) + "=", 42]) {
      expect(isWellFormedToken(value)).toBe(false);
    }
  });

  it("sets HttpOnly, SameSite=Lax, Path=/ and the TTL; Secure follows config", () => {
    expect(sessionCookieOptions(true, 30)).toEqual({
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    expect(sessionCookieOptions(false, 7).secure).toBe(false);
  });
});
