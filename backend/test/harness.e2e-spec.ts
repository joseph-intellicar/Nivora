import type { INestApplication } from "@nestjs/common";
import { Prisma } from "../src/generated/prisma/client.js";
import { PrismaService } from "../src/prisma/prisma.service.js";
import { createTestApp } from "./app-factory.js";
import { assertTestDatabase } from "./guard.js";
import { uniqueEmail } from "./http-client.js";

describe("test harness (barch §18)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  const count = async (schema: "public" | "nivora_test", table: string) => {
    const [{ n }] = await prisma.$queryRaw<
      Array<{ n: number }>
    >`SELECT COUNT(*)::int AS n FROM ${Prisma.raw(`"${schema}"."${table}"`)}`;
    return n;
  };

  it("starts from the seeded catalog in nivora_test", async () => {
    expect(await prisma.product.count()).toBe(154);
    expect(await prisma.variant.count()).toBe(346);
    expect(await prisma.order.count({ where: { isSample: true } })).toBe(4);
  });

  it("writes through Prisma land in nivora_test, never in public", async () => {
    const publicBefore = await count("public", "users");
    const testBefore = await count("nivora_test", "users");
    const user = await prisma.user.create({
      data: { name: "Harness", email: uniqueEmail("harness"), passwordHash: "x" },
    });
    try {
      expect(await count("nivora_test", "users")).toBe(testBefore + 1);
      expect(await count("public", "users")).toBe(publicBefore);
    } finally {
      await prisma.user.delete({ where: { id: user.id } });
    }
  });

  it("qualifies raw SQL with the test schema", () => {
    expect(prisma.table("orders").sql).toBe('"nivora_test"."orders"');
  });

  it("guard refuses anything but nivora_test", () => {
    const ok = {
      NODE_ENV: "test",
      TEST_SCHEMA: "nivora_test",
      DATABASE_URL: "postgresql://u:p@h/db?schema=nivora_test",
      DIRECT_URL: "postgresql://u:p@h/db?schema=nivora_test",
    };
    expect(() => assertTestDatabase(ok)).not.toThrow();
    expect(() => assertTestDatabase({ ...ok, DATABASE_URL: "postgresql://u:p@h/db" })).toThrow(
      /no schema → public/,
    );
    expect(() =>
      assertTestDatabase({ ...ok, DIRECT_URL: "postgresql://u:p@h/db?schema=public" }),
    ).toThrow(/found public/);
    expect(() => assertTestDatabase({ ...ok, NODE_ENV: "development" })).toThrow(/NODE_ENV/);
    expect(() => assertTestDatabase({ ...ok, TEST_SCHEMA: undefined })).toThrow(/TEST_SCHEMA/);
  });
});
