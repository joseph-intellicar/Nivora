import { Injectable } from "@nestjs/common";
import { checkQuantity } from "@nivora/shared/domain/cart";
import { buildOrder, formatOrderId } from "@nivora/shared/domain/orders";
import { resolveLines } from "@nivora/shared/domain/resolveLines";
import type {
  CartLine,
  CheckoutSource,
  CheckoutView,
  DeliveryOption,
  Order,
} from "@nivora/shared/domain/types";
import {
  addressSchema,
  cartItemInputSchema,
  deliveryOptionSchema,
} from "@nivora/shared/domain/validation";
import { ApiError } from "@nivora/shared/errors";
import { Prisma } from "../../generated/prisma/client.js";
import { PrismaService } from "../../prisma/prisma.service.js";
import { CatalogIndex } from "../catalog/catalog-index.service.js";
import { indiaYear, ORDER_INCLUDE, toOrder } from "./order-mapping.js";

type Tx = Prisma.TransactionClient;
type Db = PrismaService | Tx;

/** Long enough for ~15 round trips to Neon from India; parallel orders queue on row locks. */
const ORDER_TX = { timeout: 30_000, maxWait: 30_000 };
const IDEMPOTENCY_KEY = /^[A-Za-z0-9_-]{8,100}$/;

export function parseDelivery(option: unknown): DeliveryOption {
  const result = deliveryOptionSchema.safeParse(option);
  if (!result.success)
    throw new ApiError("VALIDATION", {
      fields: { deliveryOption: "Please choose a delivery option." },
    });
  return result.data;
}

/** Buy Now vs cart checkout, the checkout view and Place Order (req §19–§24, barch §11). */
@Injectable()
export class CheckoutService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: CatalogIndex,
  ) {}

  /** Buy Now is independent of the cart: its limit is the full stock; it replaces any earlier one. */
  async startBuyNow(userId: string, input: unknown): Promise<void> {
    const parsed = cartItemInputSchema.safeParse(input);
    if (!parsed.success) throw new ApiError("INVALID_QUANTITY");
    const entry = this.catalog.findVariant(parsed.data.variantId);
    if (!entry) throw new ApiError("INVALID_VARIANT");
    const live = await this.prisma.variant.findUniqueOrThrow({
      where: { id: entry.variant.id },
      select: { stock: true },
    });
    const check = checkQuantity(parsed.data.quantity, 0, live.stock);
    if (!check.ok) {
      throw check.reason === "INSUFFICIENT_STOCK"
        ? new ApiError("INSUFFICIENT_STOCK", {
            productName: entry.product.name,
            available: check.available,
          })
        : new ApiError(check.reason, { productName: entry.product.name });
    }
    const data = {
      source: "buy_now" as const,
      buyNowVariantId: entry.variant.id,
      buyNowQuantity: parsed.data.quantity,
    };
    await this.prisma.checkoutSession.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  }

  async startCartCheckout(userId: string): Promise<void> {
    const data = { source: "cart" as const, buyNowVariantId: null, buyNowQuantity: null };
    await this.prisma.checkoutSession.upsert({
      where: { userId },
      create: { userId, ...data },
      update: data,
    });
  }

  async getCheckout(userId: string, deliveryOption: unknown): Promise<CheckoutView> {
    const option = parseDelivery(deliveryOption);
    const { source, lines } = await this.checkoutItems(this.prisma, userId);
    const resolved = await this.resolve(this.prisma, lines, option);
    return { source, lines: resolved.lines, issues: resolved.issues, summary: resolved.summary };
  }

  /**
   * One transaction (barch §11): re-validate, conditionally decrement stock per line, number the
   * order, store snapshots and the first status event, then clear the cart lines or the Buy Now.
   * A repeated Idempotency-Key returns the order already placed with it.
   */
  async placeOrder(
    userId: string,
    input: { addressId?: unknown; deliveryOption?: unknown },
    idempotencyKey: string | undefined,
  ): Promise<{ order: Order; created: boolean }> {
    const deliveryOption = parseDelivery(input?.deliveryOption);
    if (idempotencyKey !== undefined && !IDEMPOTENCY_KEY.test(idempotencyKey)) {
      throw new ApiError("VALIDATION", {
        fields: { idempotencyKey: "Invalid Idempotency-Key header." },
      });
    }
    if (idempotencyKey) {
      const existing = await this.findByKey(userId, idempotencyKey);
      if (existing) return { order: existing, created: false };
    }
    try {
      const order = await this.prisma.$transaction(
        (tx) =>
          this.placeInTransaction(tx, userId, input?.addressId, deliveryOption, idempotencyKey),
        ORDER_TX,
      );
      return { order, created: true };
    } catch (error) {
      // The same key placed concurrently: the unique index let exactly one through.
      if (
        idempotencyKey &&
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const existing = await this.findByKey(userId, idempotencyKey);
        if (existing) return { order: existing, created: false };
      }
      throw error;
    }
  }

  private async placeInTransaction(
    tx: Tx,
    userId: string,
    addressId: unknown,
    deliveryOption: DeliveryOption,
    idempotencyKey: string | undefined,
  ): Promise<Order> {
    const { source, lines } = await this.checkoutItems(tx, userId);
    if (lines.length === 0) throw new ApiError("EMPTY_CART");

    const address =
      typeof addressId === "string" && addressId
        ? await tx.address.findFirst({ where: { id: addressId, userId } })
        : null;
    if (!address) throw new ApiError("ADDRESS_REQUIRED");
    const checkedAddress = addressSchema.safeParse({
      fullName: address.fullName,
      phone: address.phone,
      line1: address.line1,
      line2: address.line2 ?? "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    });
    if (!checkedAddress.success) throw new ApiError("INVALID_ADDRESS");

    const resolved = await this.resolve(tx, lines, deliveryOption);
    if (resolved.removed.length > 0) throw new ApiError("INVALID_VARIANT");
    const issue = resolved.issues[0];
    if (issue) throw issueError(issue.type, issue.productName, issue.available);

    // Conditional decrement: never oversells, even with concurrent orders (row locks serialise).
    for (const line of resolved.lines) {
      const { count } = await tx.variant.updateMany({
        where: { id: line.variantId, stock: { gte: line.quantity } },
        data: { stock: { decrement: line.quantity } },
      });
      if (count === 0) {
        const { stock } = await tx.variant.findUniqueOrThrow({
          where: { id: line.variantId },
          select: { stock: true },
        });
        throw stock === 0
          ? new ApiError("OUT_OF_STOCK", { productName: line.productName })
          : new ApiError("INSUFFICIENT_STOCK", { productName: line.productName, available: stock });
      }
    }

    const now = new Date();
    const sequence = `"${this.prisma.schema}"."order_number_seq"`;
    const [{ next }] = await tx.$queryRaw<
      Array<{ next: bigint }>
    >`SELECT nextval(${sequence}::regclass) AS next`;
    const order = buildOrder({
      orderId: formatOrderId(Number(next), indiaYear(now)),
      customerId: userId,
      orderDate: now.toISOString(),
      source,
      lines: resolved.lines,
      deliveryOption,
      address: checkedAddress.data,
    });

    const row = await tx.order.create({
      data: {
        orderNumber: order.orderId,
        customerId: userId,
        orderDate: now,
        source,
        subtotal: order.subtotal,
        discount: order.discount,
        deliveryOption,
        deliveryCharge: order.deliveryCharge,
        total: order.total,
        deliveryAddress: order.deliveryAddress,
        paymentMethod: order.paymentMethod,
        status: "Placed",
        idempotencyKey: idempotencyKey ?? null,
        items: { create: order.items.map((item, position) => ({ ...item, position })) },
        history: { create: { status: "Placed", at: now } },
      },
      include: ORDER_INCLUDE,
    });

    if (source === "cart") {
      await tx.cartItem.deleteMany({
        where: { cart: { userId }, variantId: { in: order.items.map((item) => item.variantId) } },
      });
    }
    await tx.checkoutSession.deleteMany({ where: { userId } });
    return toOrder(row);
  }

  /** Which items this checkout is for: a valid pending Buy Now, otherwise the cart (req §19). */
  private async checkoutItems(
    db: Db,
    userId: string,
  ): Promise<{ source: CheckoutSource; lines: CartLine[] }> {
    const session = await db.checkoutSession.findUnique({ where: { userId } });
    if (session?.source === "buy_now" && session.buyNowVariantId && session.buyNowQuantity) {
      const entry = this.catalog.findVariant(session.buyNowVariantId);
      if (entry) {
        return {
          source: "buy_now",
          lines: [
            {
              variantId: entry.variant.id,
              productId: entry.product.id,
              quantity: session.buyNowQuantity,
            },
          ],
        };
      }
    }
    const items = await db.cartItem.findMany({
      where: { cart: { userId } },
      orderBy: { addedAt: "asc" },
      select: { variantId: true, quantity: true },
    });
    return { source: "cart", lines: items.map((item) => ({ ...item, productId: "" })) };
  }

  private async resolve(db: Db, lines: CartLine[], option: DeliveryOption) {
    const stock = new Map(
      (
        await db.variant.findMany({
          where: { id: { in: lines.map((line) => line.variantId) } },
          select: { id: true, stock: true },
        })
      ).map((row) => [row.id, row.stock]),
    );
    return resolveLines(
      lines,
      (variantId) => {
        const entry = this.catalog.findVariant(variantId);
        return entry && { ...entry, available: stock.get(variantId) ?? 0 };
      },
      option,
    );
  }

  private async findByKey(userId: string, idempotencyKey: string): Promise<Order | null> {
    const row = await this.prisma.order.findUnique({
      where: { customerId_idempotencyKey: { customerId: userId, idempotencyKey } },
      include: ORDER_INCLUDE,
    });
    return row ? toOrder(row) : null;
  }
}

function issueError(type: string, productName: string, available: number | undefined): ApiError {
  if (type === "insufficient_stock")
    return new ApiError("INSUFFICIENT_STOCK", { productName, available });
  return new ApiError(type === "out_of_stock" ? "OUT_OF_STOCK" : "INVALID_VARIANT", {
    productName,
  });
}
