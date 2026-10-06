/**
 * Compares the database catalog with @nivora/shared/data field by field (barch §16) and checks
 * the test user and sample orders. Read-only. Exit code 1 on any difference.
 *
 *   npm run db:check                      # backend/.env
 *   ENV_FILE=.env.test npm run db:check   # nivora_test schema
 */
import { CATEGORIES } from "@nivora/shared/data/categories";
import { PRODUCTS } from "@nivora/shared/data/products";
import { SEED_ORDERS } from "@nivora/shared/data/seedOrders";
import { TEST_USER } from "@nivora/shared/data/seedUsers";
import { verifyPassword } from "../src/modules/auth/password.js";
import { canonical, createScriptClient } from "./db.js";

const { prisma, schema } = createScriptClient();
const problems: string[] = [];
const expectEqual = (label: string, actual: unknown, expected: unknown) => {
  if (canonical(actual) !== canonical(expected))
    problems.push(`${label}: ${canonical(actual)} ≠ ${canonical(expected)}`);
};

try {
  const categories = await prisma.category.findMany({
    include: { subcategories: { orderBy: { position: "asc" } } },
    orderBy: { position: "asc" },
  });
  expectEqual(
    "taxonomy",
    categories.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      subs: c.subcategories.map((s) => [s.id, s.slug, s.name]),
    })),
    CATEGORIES.map((c) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      subs: c.subcategories.map((s) => [s.id, s.slug, s.name]),
    })),
  );

  const products = new Map(
    (
      await prisma.product.findMany({
        include: { variants: { orderBy: { position: "asc" } }, subcategory: true },
      })
    ).map((p) => [p.id, p]),
  );
  expectEqual("product count", products.size, PRODUCTS.length);
  let variantsChecked = 0;
  for (const [position, p] of PRODUCTS.entries()) {
    const row = products.get(p.id);
    if (!row) {
      problems.push(`missing product ${p.id}`);
      continue;
    }
    const { variants: sourceVariants, categoryId, ...fields } = p;
    expectEqual(
      `product ${p.id}`,
      {
        ...fields,
        categoryId: row.subcategory.categoryId,
        rating: Number(row.rating),
        createdAt: row.createdAt.toISOString(),
        position: row.position,
        id: row.id,
        slug: row.slug,
        name: row.name,
        brand: row.brand,
        description: row.description,
        images: row.images,
        reviewCount: row.reviewCount,
        specifications: row.specifications,
        options: row.options,
        attributes: row.attributes,
        tags: row.tags,
        isBestSeller: row.isBestSeller,
        isNewArrival: row.isNewArrival,
        subcategoryId: row.subcategoryId,
      },
      { ...fields, categoryId, createdAt: new Date(p.createdAt).toISOString(), position },
    );
    expectEqual(
      `variants of ${p.id}`,
      row.variants.map((v) => ({
        id: v.id,
        optionValues: v.optionValues,
        price: v.price,
        originalPrice: v.originalPrice,
      })),
      sourceVariants.map((v) => ({
        id: v.id,
        optionValues: v.optionValues,
        price: v.price,
        originalPrice: v.originalPrice,
      })),
    );
    variantsChecked += row.variants.length;
  }

  const user = await prisma.user.findUnique({ where: { email: TEST_USER.email } });
  if (!user) problems.push("test user missing");
  else {
    expectEqual(
      "test user",
      { id: user.id, name: user.name },
      { id: TEST_USER.id, name: TEST_USER.name },
    );
    if (!(await verifyPassword(user.passwordHash, TEST_USER.password)))
      problems.push("test user password does not verify");
    if (!user.passwordHash.startsWith("$argon2id$"))
      problems.push("test user password is not argon2id");
  }

  const orders = await prisma.order.findMany({
    where: { orderNumber: { in: SEED_ORDERS.map((o) => o.orderId) } },
    include: { items: { orderBy: { position: "asc" } }, history: { orderBy: { at: "asc" } } },
  });
  expectEqual("sample order count", orders.length, SEED_ORDERS.length);
  for (const o of SEED_ORDERS) {
    const row = orders.find((r) => r.orderNumber === o.orderId);
    if (!row) continue;
    expectEqual(
      `order ${o.orderId}`,
      {
        orderId: row.orderNumber,
        customerId: row.customerId,
        orderDate: row.orderDate.toISOString(),
        source: row.source,
        items: row.items.map(
          ({ id: _id, orderId: _orderId, position: _position, ...item }) => item,
        ),
        subtotal: row.subtotal,
        discount: row.discount,
        deliveryOption: row.deliveryOption,
        deliveryCharge: row.deliveryCharge,
        total: row.total,
        deliveryAddress: row.deliveryAddress,
        paymentMethod: row.paymentMethod,
        status: row.status,
        statusHistory: row.history.map((e) => ({ status: e.status, at: e.at.toISOString() })),
        isSample: row.isSample,
      },
      o,
    );
  }

  if (problems.length) {
    console.error(
      `✗ ${problems.length} difference(s) in schema "${schema}":\n- ${problems.slice(0, 20).join("\n- ")}`,
    );
    process.exitCode = 1;
  } else {
    console.log(
      `✓ schema "${schema}" matches @nivora/shared: ${categories.length} categories, ${categories.reduce((n, c) => n + c.subcategories.length, 0)} subcategories, ${products.size} products, ${variantsChecked} variants, test user, ${orders.length} sample orders`,
    );
  }
} finally {
  await prisma.$disconnect();
}
