// Each e2e worker: load backend/.env.test (the nivora_test schema), never backend/.env (barch §18).
import "../src/common/network.js";
import { config } from "dotenv";
import { assertTestDatabase } from "./guard.js";

process.env.ENV_FILE = ".env.test";
config({ path: ".env.test", quiet: true });
assertTestDatabase(process.env);
