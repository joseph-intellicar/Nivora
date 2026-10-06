import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import type * as Guard from "./guard.js";

const backend = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Once per e2e run: guard, then bring `nivora_test` to a clean, seeded state (barch §18).
 * Real environment variables win over .env.test, so a stray DATABASE_URL is caught by the guard.
 */
export default async function globalSetup(): Promise<void> {
  // Jest loads this file with Node's own ESM loader (no .js → .ts mapping); Node 22 strips the
  // types of guard.ts itself.
  const { assertTestDatabase } = (await import(
    new URL("./guard.ts", import.meta.url).href
  )) as typeof Guard;
  process.env.ENV_FILE = ".env.test";
  config({ path: resolve(backend, ".env.test"), quiet: true });
  assertTestDatabase(process.env);
  const run = (args: string[]) =>
    execFileSync("npx", args, {
      cwd: backend,
      env: { ...process.env, ENV_FILE: ".env.test", PRISMA_HIDE_UPDATE_MESSAGE: "1" },
      stdio: ["ignore", "pipe", "inherit"],
    });
  run(["prisma", "migrate", "deploy"]);
  const seeded = run(["tsx", "prisma/seed.ts", "--reset"]).toString().trim().split("\n").at(-1);
  console.log(`\n[e2e] ${seeded}`);
}
