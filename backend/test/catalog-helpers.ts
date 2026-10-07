import { PRODUCTS } from "@nivora/shared/data/products";
import type { Product, StockAdjustments } from "@nivora/shared/domain/types";
import type { PrismaService } from "../src/prisma/prisma.service.js";

const initial = new Map(PRODUCTS.flatMap((p) => p.variants.map((v) => [v.id, v.initialStock])));

/**
 * Current database stock expressed as Phase 1 "adjustments", so expected results can be computed
 * with the shared pipeline over the shared catalog, whatever earlier suites did to stock.
 */
export async function liveAdjustments(prisma: PrismaService): Promise<StockAdjustments> {
  const rows = await prisma.variant.findMany({ select: { id: true, stock: true } });
  const adjustments: StockAdjustments = {};
  for (const row of rows) {
    const delta = row.stock - (initial.get(row.id) ?? 0);
    if (delta !== 0) adjustments[row.id] = delta;
  }
  return adjustments;
}

/** Sets stock for some variants and returns a function that restores the previous values. */
export async function setStock(
  prisma: PrismaService,
  stock: Record<string, number>,
): Promise<() => Promise<void>> {
  const before = await prisma.variant.findMany({
    where: { id: { in: Object.keys(stock) } },
    select: { id: true, stock: true },
  });
  for (const [id, value] of Object.entries(stock))
    await prisma.variant.update({ where: { id }, data: { stock: value } });
  return async () => {
    for (const row of before)
      await prisma.variant.update({ where: { id: row.id }, data: { stock: row.stock } });
  };
}

/**
 * The shared catalog as the API serves it: each variant's `initialStock` is its CURRENT database
 * stock (barch §10), so expected results come from the shared pipeline with no adjustments.
 */
export async function liveCatalog(prisma: PrismaService): Promise<Product[]> {
  const rows = await prisma.variant.findMany({ select: { id: true, stock: true } });
  const stock = new Map(rows.map((row) => [row.id, row.stock]));
  return PRODUCTS.map((p) => ({
    ...p,
    variants: p.variants.map((v) => ({ ...v, initialStock: stock.get(v.id) ?? 0 })),
  }));
}
