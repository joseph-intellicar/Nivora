import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Prisma 7 does not load .env itself. ENV_FILE=.env.test points the CLI at the nivora_test
// schema; the default is backend/.env (barch §14).
config({ path: process.env.ENV_FILE ?? ".env", quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  // Migrations use the direct (non-pooled) Neon endpoint. Optional so `prisma generate` (run on
  // npm install) works on a fresh clone without backend/.env.
  ...(process.env.DIRECT_URL ? { datasource: { url: process.env.DIRECT_URL } } : {}),
});
