import { Injectable } from "@nestjs/common";
import { checkQuantity } from "@nivora/shared/domain/cart";
import { toProductSummary } from "@nivora/shared/domain/catalog";
import type { ProductSummary } from "@nivora/shared/domain/types";
import { ApiError } from "@nivora/shared/errors";
import { PrismaService } from "../../prisma/prisma.service.js";
import { CatalogIndex } from "../catalog/catalog-index.service.js";

/** Wishlist (req §18): per customer, no duplicates, summaries with live stock. */
@Injectable()
export class WishlistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: CatalogIndex,
  ) {}

  async list(userId: string): Promise<ProductSummary[]> {
    const items = await this.prisma.wishlistItem.findMany({
      where: { userId },
      orderBy: { addedAt: "asc" },
      select: {
        product: { select: { id: true, variants: { select: { id: true, stock: true } } } },
      },
    });
    return items.flatMap(({ product }) => {
      const source = this.catalog.findById(product.id);
      if (!source) return [];
      const stock = new Map(product.variants.map((v) => [v.id, v.stock]));
      return [
        toProductSummary({
          ...source,
          variants: source.variants.map((v) => ({ ...v, initialStock: stock.get(v.id) ?? 0 })),
        }),
      ];
    });
  }

  /** Idempotent: adding twice keeps one entry. */
  async add(userId: string, productId: string): Promise<void> {
    if (!this.catalog.findById(productId)) throw new ApiError("NOT_FOUND", { entity: "product" });
    await this.prisma.wishlistItem.upsert({
      where: { userId_productId: { userId, productId } },
      create: { userId, productId },
      update: {},
    });
  }

  async remove(userId: string, productId: string): Promise<void> {
    await this.prisma.wishlistItem.deleteMany({ where: { userId, productId } });
  }

  /** Adds one unit of the chosen variant to the cart and removes the product from the wishlist. */
  async moveToCart(userId: string, productId: string, variantId: unknown): Promise<void> {
    const entry = typeof variantId === "string" ? this.catalog.findVariant(variantId) : undefined;
    if (!entry || entry.product.id !== productId) throw new ApiError("INVALID_VARIANT");
    const { product, variant } = entry;
    await this.prisma.$transaction(
      async (tx) => {
        const cart = await tx.cart.upsert({
          where: { userId },
          create: { userId },
          update: {},
          select: { id: true },
        });
        const [line, live] = await Promise.all([
          tx.cartItem.findUnique({
            where: { cartId_variantId: { cartId: cart.id, variantId: variant.id } },
          }),
          tx.variant.findUniqueOrThrow({ where: { id: variant.id }, select: { stock: true } }),
        ]);
        const check = checkQuantity(1, line?.quantity ?? 0, live.stock);
        if (!check.ok) {
          throw check.reason === "INSUFFICIENT_STOCK"
            ? new ApiError("INSUFFICIENT_STOCK", {
                productName: product.name,
                available: check.available,
              })
            : new ApiError(check.reason, { productName: product.name });
        }
        await tx.cart.update({
          where: { id: cart.id },
          data: {
            items: {
              upsert: {
                where: { cartId_variantId: { cartId: cart.id, variantId: variant.id } },
                create: { variantId: variant.id, quantity: 1 },
                update: { quantity: { increment: 1 } },
              },
            },
          },
        });
        await tx.wishlistItem.deleteMany({ where: { userId, productId } });
      },
      { timeout: 20_000, maxWait: 10_000 },
    );
  }
}
