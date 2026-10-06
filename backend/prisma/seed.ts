/**
 * Idempotent seed (barch §16): the Phase 1 catalog, the test user and Joseph's sample orders.
 *
 *   npx prisma db seed                      # backend/.env (public schema)
 *   ENV_FILE=.env.test npx prisma db seed   # nivora_test schema
 *   npx prisma db seed -- --reset           # development only: wipe everything first
 *
 * Missing rows are inserted in bulk; existing catalog rows are updated only when their catalog
 * fields differ. Live stock, customers and their orders are never changed (only --reset does).
 */
import { CATEGORIES } from "@nivora/shared/data/categories";
import { PRODUCTS } from "@nivora/shared/data/products";
import { SEED_ORDERS } from "@nivora/shared/data/seedOrders";
import { TEST_USER } from "@nivora/shared/data/seedUsers";
import type { Product, Variant } from "@nivora/shared/domain/types";
import { Prisma } from "../src/generated/prisma/client.js";
import { hashPassword } from "../src/modules/auth/password.js";
import { canonical, createScriptClient } from "./db.js";

const { prisma, schema, table } = createScriptClient();
const reset = process.argv.includes("--reset");
const counts: Record<string, number> = {};
const bump = (key: string, by = 1) => (counts[key] = (counts[key] ?? 0) + by);

async function main(): Promise<void> {
  if (reset) await wipe();
  await seedTaxonomy();
  await seedProducts();
  await seedVariants();
  await seedTestUser();
  await seedSampleOrders();
  await advanceOrderSequence();
  const summary = Object.entries(counts)
    .map(([key, value]) => `${key}=${value}`)
    .join(" ");
  console.log(`Seed complete (schema "${schema}"): ${summary || "nothing to change"}`);
}

async function wipe(): Promise<void> {
  if (process.env.NODE_ENV === "production")
    throw new Error("--reset is not allowed in production.");
  const tables = [
    "order_status_events",
    "order_items",
    "orders",
    "checkout_sessions",
    "wishlist_items",
    "cart_items",
    "carts",
    "addresses",
    "sessions",
    "users",
    "variants",
    "products",
    "subcategories",
    "categories",
  ];
  // Raw SQL must name the schema explicitly (see qualify in src/prisma/connection.ts).
  await prisma.$executeRaw`TRUNCATE ${Prisma.join(tables.map(table), ", ")} CASCADE`;
  await prisma.$executeRaw`ALTER SEQUENCE ${table("order_number_seq")} RESTART WITH 1`;
  console.log(`Reset: all tables in schema "${schema}" emptied.`);
}

async function seedTaxonomy(): Promise<void> {
  const categories = CATEGORIES.map((c, position) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    position,
  }));
  const subcategories = CATEGORIES.flatMap((c) =>
    c.subcategories.map((s, position) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      position,
      categoryId: c.id,
    })),
  );
  const existingCategories = new Map(
    (await prisma.category.findMany()).map((row) => [row.id, row]),
  );
  const existingSubcategories = new Map(
    (await prisma.subcategory.findMany()).map((row) => [row.id, row]),
  );

  const newCategories = categories.filter((c) => !existingCategories.has(c.id));
  if (newCategories.length)
    bump("categories+", (await prisma.category.createMany({ data: newCategories })).count);
  for (const c of categories) {
    const row = existingCategories.get(c.id);
    if (row && canonical({ ...row }) !== canonical(c)) {
      await prisma.category.update({ where: { id: c.id }, data: c });
      bump("categories~");
    }
  }

  const newSubcategories = subcategories.filter((s) => !existingSubcategories.has(s.id));
  if (newSubcategories.length) {
    bump("subcategories+", (await prisma.subcategory.createMany({ data: newSubcategories })).count);
  }
  for (const s of subcategories) {
    const row = existingSubcategories.get(s.id);
    if (row && canonical({ ...row }) !== canonical(s)) {
      await prisma.subcategory.update({ where: { id: s.id }, data: s });
      bump("subcategories~");
    }
  }
}

function productRow(p: Product, position: number) {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    description: p.description,
    images: p.images,
    rating: p.rating,
    reviewCount: p.reviewCount,
    specifications: p.specifications,
    options: p.options,
    attributes: p.attributes,
    tags: p.tags,
    isBestSeller: p.isBestSeller,
    isNewArrival: p.isNewArrival,
    createdAt: new Date(p.createdAt),
    position,
    subcategoryId: p.subcategoryId,
  };
}

async function seedProducts(): Promise<void> {
  const rows = PRODUCTS.map(productRow);
  const existing = new Map((await prisma.product.findMany()).map((row) => [row.id, row]));
  const missing = rows.filter((row) => !existing.has(row.id));
  if (missing.length) bump("products+", (await prisma.product.createMany({ data: missing })).count);
  for (const row of rows) {
    const current = existing.get(row.id);
    if (!current) continue;
    const comparable = {
      ...current,
      rating: Number(current.rating),
      createdAt: current.createdAt.toISOString(),
    };
    if (canonical(comparable) !== canonical({ ...row, createdAt: row.createdAt.toISOString() })) {
      await prisma.product.update({ where: { id: row.id }, data: row });
      bump("products~");
    }
  }
  const extra = [...existing.keys()].filter((id) => !rows.some((row) => row.id === id));
  if (extra.length)
    console.warn(`Note: ${extra.length} products in the database are not in the shared catalog.`);
}

/** Catalog fields of a variant. `stock` is live data: set on insert only. */
function variantRow(productId: string, v: Variant, position: number) {
  return {
    id: v.id,
    productId,
    optionValues: v.optionValues,
    price: v.price,
    originalPrice: v.originalPrice,
    position,
  };
}

async function seedVariants(): Promise<void> {
  const source = PRODUCTS.flatMap((p) =>
    p.variants.map((v, position) => ({ v, row: variantRow(p.id, v, position) })),
  );
  const existing = new Map((await prisma.variant.findMany()).map((row) => [row.id, row]));
  const missing = source.filter(({ row }) => !existing.has(row.id));
  if (missing.length) {
    const data = missing.map(({ v, row }) => ({ ...row, stock: v.initialStock }));
    bump("variants+", (await prisma.variant.createMany({ data })).count);
  }
  for (const { row } of source) {
    const current = existing.get(row.id);
    if (!current) continue;
    const { stock: _stock, ...catalogFields } = current;
    if (canonical(catalogFields) !== canonical(row)) {
      await prisma.variant.update({ where: { id: row.id }, data: row });
      bump("variants~");
    }
  }
}

async function seedTestUser(): Promise<void> {
  const exists = await prisma.user.findUnique({
    where: { email: TEST_USER.email },
    select: { id: true },
  });
  if (exists) return;
  await prisma.user.create({
    data: {
      id: TEST_USER.id,
      name: TEST_USER.name,
      email: TEST_USER.email,
      passwordHash: await hashPassword(TEST_USER.password),
    },
  });
  bump("users+");
}

async function seedSampleOrders(): Promise<void> {
  const existing = new Set(
    (
      await prisma.order.findMany({
        where: { orderNumber: { in: SEED_ORDERS.map((o) => o.orderId) } },
        select: { orderNumber: true },
      })
    ).map((o) => o.orderNumber),
  );
  for (const order of SEED_ORDERS) {
    if (existing.has(order.orderId)) continue;
    // Sample orders are history: they never change stock (req §25.5).
    await prisma.order.create({
      data: {
        orderNumber: order.orderId,
        customerId: order.customerId,
        orderDate: new Date(order.orderDate),
        source: order.source,
        subtotal: order.subtotal,
        discount: order.discount,
        deliveryOption: order.deliveryOption,
        deliveryCharge: order.deliveryCharge,
        total: order.total,
        deliveryAddress: order.deliveryAddress,
        paymentMethod: order.paymentMethod,
        status: order.status,
        isSample: true,
        items: { create: order.items.map((item, position) => ({ ...item, position })) },
        history: {
          create: order.statusHistory.map((event) => ({
            status: event.status,
            at: new Date(event.at),
          })),
        },
      },
    });
    bump("orders+");
  }
}

/** Keeps order_number_seq ahead of every existing order number (seeded or real). */
async function advanceOrderSequence(): Promise<void> {
  const [{ highest }] = await prisma.$queryRaw<Array<{ highest: number }>>`
    SELECT COALESCE(MAX(CAST(SPLIT_PART("orderNumber", '-', 3) AS INTEGER)), 0)::int AS highest
    FROM ${table("orders")}`;
  const [{ next }] = await prisma.$queryRaw<Array<{ next: number }>>`
    SELECT (CASE WHEN is_called THEN last_value + 1 ELSE last_value END)::int AS next
    FROM ${table("order_number_seq")}`;
  if (highest >= next) {
    const sequence = `"${schema}"."order_number_seq"`;
    await prisma.$queryRaw`SELECT setval(${sequence}::regclass, ${highest}, true)`;
    bump("sequence→", highest + 1);
  }
}

try {
  await main();
} finally {
  await prisma.$disconnect();
}
