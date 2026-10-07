import { validateEnv } from "./env.js";

const valid = {
  DATABASE_URL: "postgresql://user:secret@host-pooler/db?sslmode=require",
  DIRECT_URL: "postgresql://user:secret@host/db?sslmode=require",
  FRONTEND_ORIGIN: "http://localhost:3000",
};

describe("validateEnv (barch §15)", () => {
  it("applies defaults to a minimal valid environment", () => {
    expect(validateEnv(valid)).toEqual({
      ...valid,
      NODE_ENV: "development",
      PORT: 4000,
      COOKIE_SECURE: false,
      SESSION_TTL_DAYS: 30,
    });
  });

  it("parses strings from the environment", () => {
    const env = validateEnv({
      ...valid,
      PORT: "4100",
      COOKIE_SECURE: "true",
      SESSION_TTL_DAYS: "7",
      NODE_ENV: "test",
    });
    expect(env).toMatchObject({
      PORT: 4100,
      COOKIE_SECURE: true,
      SESSION_TTL_DAYS: 7,
      NODE_ENV: "test",
    });
  });

  it("normalises a trailing slash on the frontend origin", () => {
    expect(validateEnv({ ...valid, FRONTEND_ORIGIN: "https://nivora.in/" }).FRONTEND_ORIGIN).toBe(
      "https://nivora.in",
    );
  });

  it("lists every problem in one error", () => {
    let message = "";
    try {
      validateEnv({
        DATABASE_URL: "",
        DIRECT_URL: "mysql://x",
        FRONTEND_ORIGIN: "http://localhost:3000/shop",
        COOKIE_SECURE: "yes",
        PORT: "99999",
      });
    } catch (error) {
      message = (error as Error).message;
    }
    expect(message).toMatch(/^Invalid environment configuration:/);
    for (const line of [
      "- DATABASE_URL: is required",
      "- DIRECT_URL: must be a postgresql:// URL",
      "- FRONTEND_ORIGIN: must be an origin with no path",
      "- COOKIE_SECURE: must be true or false",
      "- PORT:",
    ]) {
      expect(message).toContain(line);
    }
    expect(message.match(/^ {2}- DATABASE_URL/gm)).toHaveLength(1);
  });

  it("requires Secure cookies in production", () => {
    expect(() => validateEnv({ ...valid, NODE_ENV: "production" })).toThrow(
      /COOKIE_SECURE: must be true when NODE_ENV=production/,
    );
    expect(
      validateEnv({ ...valid, NODE_ENV: "production", COOKIE_SECURE: "true" }).COOKIE_SECURE,
    ).toBe(true);
  });

  it("never echoes values (connection strings contain passwords)", () => {
    try {
      validateEnv({ ...valid, DIRECT_URL: "postgres-ish://user:hunter2@host" });
      throw new Error("expected a validation error");
    } catch (error) {
      expect((error as Error).message).not.toContain("hunter2");
    }
  });
});
