import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { AppConfig } from "../config/app-config.service.js";
import { Prisma, PrismaClient } from "../generated/prisma/client.js";
import { qualify, splitSchema } from "./connection.js";

/**
 * Prisma 7 client on Neon's pooled endpoint through the `pg` driver adapter (barch §14).
 * Connects at startup and closes the pool on shutdown (enableShutdownHooks in app.setup).
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  readonly schema: string;

  constructor(config: AppConfig) {
    const { connectionString, schema } = splitSchema(config.get("DATABASE_URL"));
    const logger = new Logger(PrismaService.name);
    super({
      ...(process.env.PRISMA_LOG_QUERIES === "1"
        ? { log: [{ emit: "event" as const, level: "query" as const }] }
        : {}),
      adapter: new PrismaPg(
        { connectionString, max: 10, application_name: "nivora-api", idleTimeoutMillis: 30_000 },
        { schema, onPoolError: (error) => logger.error(`Database pool error: ${error.message}`) },
      ),
    });
    this.schema = schema ?? "public";
    // Diagnostics only (P2-037): PRISMA_LOG_QUERIES=1 logs each SQL statement with its duration.
    if (process.env.PRISMA_LOG_QUERIES === "1") {
      (
        this as unknown as {
          $on(event: "query", cb: (e: { duration: number; query: string }) => void): void;
        }
      ).$on("query", (e) =>
        logger.log(`query ${e.duration}ms ${e.query.replace(/\s+/g, " ").slice(0, 90)}`),
      );
    }
    // Second line of defence behind the test guard: tests never touch real data (barch §18).
    if (config.get("NODE_ENV") === "test" && this.schema !== "nivora_test") {
      throw new Error(
        `NODE_ENV=test requires the nivora_test schema (DATABASE_URL uses "${this.schema}").`,
      );
    }
  }

  /** A table or sequence in this client's schema, for raw SQL: Prisma.sql`SELECT … FROM ${prisma.table("orders")}`. */
  table(name: string): Prisma.Sql {
    return Prisma.raw(qualify(this.schema, name));
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();
    // Open one pooled connection now so the first request doesn't pay the TLS handshake to Neon.
    // A database outage is reported by /health rather than stopping the API from starting.
    try {
      await this.$queryRaw`SELECT 1`;
      this.logger.log(`Connected to the database (schema "${this.schema}")`);
    } catch (error) {
      this.logger.warn(
        `Database not reachable at startup: ${(error as { code?: string }).code ?? "unknown"}`,
      );
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    this.logger.log("Database connections closed");
  }
}
