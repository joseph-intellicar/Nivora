import "../src/common/network.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";
import { Prisma, PrismaClient } from "../src/generated/prisma/client.js";
import { qualify, splitSchema } from "../src/prisma/connection.js";

/** Prisma client for CLI scripts (seed, checks): `.env` or ENV_FILE, same adapter setup as the API. */
export function createScriptClient(): {
  prisma: PrismaClient;
  schema: string;
  table: (name: string) => Prisma.Sql;
} {
  config({ path: process.env.ENV_FILE ?? ".env", quiet: true });
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set (backend/.env or ENV_FILE).");
  const { connectionString, schema } = splitSchema(url);
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString, application_name: "nivora-script" }, { schema }),
  });
  const resolved = schema ?? "public";
  return { prisma, schema: resolved, table: (name) => Prisma.raw(qualify(resolved, name)) };
}

/** JSON with sorted keys, so Postgres jsonb (which reorders keys) compares equal to source data. */
export function canonical(value: unknown): string {
  return JSON.stringify(value, (_key, v: unknown) =>
    v && typeof v === "object" && !Array.isArray(v)
      ? Object.fromEntries(
          Object.entries(v as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b)),
        )
      : v,
  );
}
