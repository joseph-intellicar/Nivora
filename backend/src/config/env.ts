import { z } from "zod";

/*
 * Environment schema (barch §15). The app refuses to start when a value is missing or invalid.
 * Error messages name the variable and the problem, never the value (URLs contain passwords).
 */

const booleanString = z
  .enum(["true", "false"], { error: "must be true or false" })
  .transform((value) => value === "true");

const postgresUrl = z
  .string({ error: "is required" })
  .min(1, "is required")
  .refine(
    (value) => value === "" || /^postgres(ql)?:\/\/[^\s]+$/.test(value),
    "must be a postgresql:// URL",
  );

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  DATABASE_URL: postgresUrl,
  DIRECT_URL: postgresUrl,
  FRONTEND_ORIGIN: z
    .url({ error: "must be an origin such as http://localhost:3000" })
    .refine(
      (value) => new URL(value).origin === value.replace(/\/$/, ""),
      "must be an origin with no path",
    )
    .transform((value) => value.replace(/\/$/, "")),
  COOKIE_SECURE: booleanString.default(false),
  SESSION_TTL_DAYS: z.coerce.number().int().min(1).max(365).default(30),
});

export type Env = z.infer<typeof envSchema>;

/** `ConfigModule` `validate` hook: parse or throw one readable error listing every problem. */
export function validateEnv(raw: Record<string, unknown>): Env {
  const result = envSchema.safeParse(raw);
  if (result.success) return result.data;
  const problems = result.error.issues.map(
    (issue) => `  - ${issue.path.join(".")}: ${issue.message}`,
  );
  throw new Error(
    `Invalid environment configuration:\n${problems.join("\n")}\nSee backend/.env.example.`,
  );
}
