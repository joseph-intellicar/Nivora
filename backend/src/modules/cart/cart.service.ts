import { Injectable } from "@nestjs/common";
import { checkQuantity, mergeCarts } from "@nivora/shared/domain/cart";
import { resolveLines } from "@nivora/shared/domain/resolveLines";
import type { CartLine, CartView, User } from "@nivora/shared/domain/types";
import { cartItemInputSchema } from "@nivora/shared/domain/validation";
import { ApiError } from "@nivora/shared/errors";
import type { Request, Response } from "express";
import { AppConfig } from "../../config/app-config.service.js";
import { PrismaService } from "../../prisma/prisma.service.js";
import { GuestCartMerger } from "../auth/auth.service.js";
import { sessionCookieOptions } from "../auth/session-token.js";
import { CatalogIndex } from "../catalog/catalog-index.service.js";
import { CART_COOKIE, hashCartToken, isWellFormedCartToken, newCartToken } from "./cart-token.js";

/** Whose cart: the customer's, or the guest cart behind the `nivora_cart` cookie. */
export type CartOwner = { user: User | null; req: Request; res: Response };

type ItemRow = { variantId: string; quantity: number; variant: { stock: number } };

/** Server-side carts (barch §9): every read revalidates lines and computes totals (shared rules). */
@Injectable()
export class CartService extends GuestCartMerger {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: CatalogIndex,
    private readonly config: AppConfig,
  ) {
    super();
  }

  async view(owner: CartOwner): Promise<CartView> {
    const cartId = await this.findCartId(owner);
    return this.viewOf(cartId);
  }

  async add(
    owner: CartOwner,
    input: { variantId?: unknown; quantity?: unknown },
  ): Promise<CartView> {
    const quantity = parseQuantity(input?.quantity);
    const { product, variant } = this.lookupVariant(input?.variantId);
    const cartId = await this.findCartId(owner, true);
    const [stock, line] = await Promise.all([
      this.stockOf(variant.id),
      this.prisma.cartItem.findUnique({
        where: { cartId_variantId: { cartId: cartId!, variantId: variant.id } },
      }),
    ]);
    enforce(checkQuantity(quantity, line?.quantity ?? 0, stock), product.name);
    await this.prisma.cart.update({
      where: { id: cartId! },
      data: {
        items: {
          upsert: {
            where: { cartId_variantId: { cartId: cartId!, variantId: variant.id } },
            create: { variantId: variant.id, quantity },
            update: { quantity: { increment: quantity } },
          },
        },
      },
    });
    return this.viewOf(cartId);
  }

  async update(owner: CartOwner, variantId: string, rawQuantity: unknown): Promise<CartView> {
    const quantity = parseQuantity(rawQuantity);
    const cartId = await this.findCartId(owner);
    const line =
      cartId &&
      (await this.prisma.cartItem.findUnique({
        where: { cartId_variantId: { cartId, variantId } },
      }));
    if (!cartId || !line) throw new ApiError("NOT_FOUND", { entity: "product" });
    const { product } = this.lookupVariant(variantId);
    enforce(checkQuantity(quantity, 0, await this.stockOf(variantId)), product.name);
    await this.prisma.cart.update({
      where: { id: cartId },
      data: {
        items: {
          update: { where: { cartId_variantId: { cartId, variantId } }, data: { quantity } },
        },
      },
    });
    return this.viewOf(cartId);
  }

  async remove(owner: CartOwner, variantId: string): Promise<CartView> {
    const cartId = await this.findCartId(owner);
    if (cartId) {
      await this.prisma.cart.update({
        where: { id: cartId },
        data: { items: { deleteMany: { variantId } } },
      });
    }
    return this.viewOf(cartId);
  }

  /**
   * Login/signup (req §17.5, D4/D12): the guest cart is added to the customer's saved cart with
   * the shared `mergeCarts` (overlaps summed, capped at live stock), then deleted with its cookie.
   */
  async mergeIntoUser(userId: string, req: Request, res: Response): Promise<boolean> {
    const token = req.cookies?.[CART_COOKIE];
    if (!isWellFormedCartToken(token)) return false;
    const guestToken = hashCartToken(token);
    res.clearCookie(CART_COOKIE, { ...this.cookieOptions(), maxAge: undefined });

    return this.prisma.$transaction(
      async (tx) => {
        const guest = await tx.cart.findUnique({
          where: { guestToken },
          include: { items: { orderBy: { addedAt: "asc" } } },
        });
        if (!guest) return false;
        const saved = await tx.cart.upsert({
          where: { userId },
          create: { userId },
          update: {},
          include: { items: { orderBy: { addedAt: "asc" } } },
        });
        await tx.cart.delete({ where: { id: guest.id } });
        if (guest.items.length === 0) return false;

        const toLine = (item: { variantId: string; quantity: number }): CartLine => ({
          variantId: item.variantId,
          productId: this.catalog.findVariant(item.variantId)?.product.id ?? "",
          quantity: item.quantity,
        });
        const variantIds = [
          ...new Set([...saved.items, ...guest.items].map((item) => item.variantId)),
        ];
        const stock = new Map(
          (
            await tx.variant.findMany({
              where: { id: { in: variantIds } },
              select: { id: true, stock: true },
            })
          ).map((row) => [row.id, row.stock]),
        );
        const savedLines = saved.items.map(toLine);
        const { lines, mergedSavedItems } = mergeCarts(
          savedLines,
          guest.items.map(toLine),
          (id) => stock.get(id) ?? 0,
        );

        const before = new Map(savedLines.map((line) => [line.variantId, line.quantity]));
        for (const line of lines) {
          const previous = before.get(line.variantId);
          if (previous === undefined) {
            await tx.cartItem.create({
              data: { cartId: saved.id, variantId: line.variantId, quantity: line.quantity },
            });
          } else if (previous !== line.quantity) {
            await tx.cartItem.update({
              where: { cartId_variantId: { cartId: saved.id, variantId: line.variantId } },
              data: { quantity: line.quantity },
            });
          }
        }
        await tx.cart.update({ where: { id: saved.id }, data: { updatedAt: new Date() } });
        return mergedSavedItems && savedLines.length > 0;
      },
      { timeout: 20_000, maxWait: 10_000 },
    );
  }

  // ── internals ──────────────────────────────────────────────────────

  /** The owner's cart id; with `create`, makes one (and the guest cookie) when missing. */
  private async findCartId(owner: CartOwner, create = false): Promise<string | null> {
    if (owner.user) {
      const userId = owner.user.id;
      if (!create)
        return (
          (await this.prisma.cart.findUnique({ where: { userId }, select: { id: true } }))?.id ??
          null
        );
      return (
        await this.prisma.cart.upsert({
          where: { userId },
          create: { userId },
          update: {},
          select: { id: true },
        })
      ).id;
    }
    const token = owner.req.cookies?.[CART_COOKIE];
    if (isWellFormedCartToken(token)) {
      const cart = await this.prisma.cart.findUnique({
        where: { guestToken: hashCartToken(token) },
        select: { id: true },
      });
      if (cart) return cart.id;
    }
    if (!create) return null;
    const fresh = newCartToken();
    const cart = await this.prisma.cart.create({
      data: { guestToken: hashCartToken(fresh) },
      select: { id: true },
    });
    owner.res.cookie(CART_COOKIE, fresh, this.cookieOptions());
    return cart.id;
  }

  private async viewOf(cartId: string | null): Promise<CartView> {
    const items: ItemRow[] = cartId
      ? await this.prisma.cartItem.findMany({
          where: { cartId },
          orderBy: { addedAt: "asc" },
          select: { variantId: true, quantity: true, variant: { select: { stock: true } } },
        })
      : [];
    const stock = new Map(items.map((item) => [item.variantId, item.variant.stock]));
    const resolved = resolveLines(
      items.map((item) => ({ variantId: item.variantId, productId: "", quantity: item.quantity })),
      (variantId) => {
        const entry = this.catalog.findVariant(variantId);
        return entry && { ...entry, available: stock.get(variantId) ?? 0 };
      },
    );
    if (cartId && resolved.removed.length > 0) {
      // Products that no longer exist are dropped and reported once (req §17.4).
      await this.prisma.cartItem.deleteMany({
        where: { cartId, variantId: { in: resolved.removed.map((issue) => issue.variantId) } },
      });
    }
    return {
      lines: resolved.lines,
      issues: resolved.issues,
      removed: resolved.removed,
      summary: resolved.summary,
    };
  }

  private lookupVariant(variantId: unknown) {
    const entry = typeof variantId === "string" ? this.catalog.findVariant(variantId) : undefined;
    if (!entry) throw new ApiError("INVALID_VARIANT");
    return entry;
  }

  private async stockOf(variantId: string): Promise<number> {
    return (
      (await this.prisma.variant.findUnique({ where: { id: variantId }, select: { stock: true } }))
        ?.stock ?? 0
    );
  }

  private cookieOptions() {
    return sessionCookieOptions(this.config.get("COOKIE_SECURE"), 30);
  }
}

function parseQuantity(quantity: unknown): number {
  const result = cartItemInputSchema.shape.quantity.safeParse(quantity);
  if (!result.success) throw new ApiError("INVALID_QUANTITY");
  return result.data;
}

function enforce(check: ReturnType<typeof checkQuantity>, productName: string): void {
  if (check.ok) return;
  if (check.reason === "INSUFFICIENT_STOCK") {
    throw new ApiError("INSUFFICIENT_STOCK", { productName, available: check.available });
  }
  throw new ApiError(check.reason, { productName });
}
