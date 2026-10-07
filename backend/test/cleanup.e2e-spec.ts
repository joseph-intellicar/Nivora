import type { INestApplication } from "@nestjs/common";
import { CleanupService } from "../src/modules/maintenance/cleanup.service.js";
import { PrismaService } from "../src/prisma/prisma.service.js";
import { createTestApp } from "./app-factory.js";
import { signedUpCustomer } from "./test-data.js";

const DAY = 24 * 60 * 60 * 1000;

describe("cleanup jobs (e2e, P2-036)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  it("removes only expired sessions and guest carts untouched for 30 days", async () => {
    const { userId } = await signedUpCustomer(app, "cleanup");
    const now = Date.now();
    const sessions = await Promise.all(
      [
        { tokenHash: `cleanup-expired-${now}`, expiresAt: new Date(now - 1000) },
        { tokenHash: `cleanup-live-${now}`, expiresAt: new Date(now + DAY) },
      ].map((data) => prisma.session.create({ data: { ...data, userId } })),
    );
    const variantId = "northline-pique-polo-t-shirt-black-l";
    const guest = (age: number, tag: string) =>
      prisma.cart.create({
        data: {
          guestToken: `cleanup-${tag}-${now}`,
          updatedAt: new Date(now - age * DAY),
          items: { create: { variantId, quantity: 1 } },
        },
      });
    const [oldGuest, recentGuest] = [await guest(31, "old"), await guest(29, "recent")];
    // A customer's cart is never purged, however old.
    const customerCart = await prisma.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
    });
    await prisma.cart.update({
      where: { id: customerCart.id },
      data: { updatedAt: new Date(now - 400 * DAY) },
    });

    const result = await app.get(CleanupService).run(new Date(now));
    expect(result.expiredSessions).toBeGreaterThanOrEqual(1);
    expect(result.staleGuestCarts).toBeGreaterThanOrEqual(1);

    expect(await prisma.session.findUnique({ where: { id: sessions[0].id } })).toBeNull();
    expect(await prisma.session.findUnique({ where: { id: sessions[1].id } })).not.toBeNull();
    expect(await prisma.cart.findUnique({ where: { id: oldGuest.id } })).toBeNull();
    expect(await prisma.cartItem.count({ where: { cartId: oldGuest.id } })).toBe(0);
    expect(await prisma.cart.findUnique({ where: { id: recentGuest.id } })).not.toBeNull();
    expect(await prisma.cart.findUnique({ where: { id: customerCart.id } })).not.toBeNull();
    expect(await prisma.user.findUnique({ where: { id: userId } })).not.toBeNull();

    // Idempotent: a second pass finds nothing more to do among these rows.
    await app.get(CleanupService).run(new Date(now));
    expect(await prisma.session.findUnique({ where: { id: sessions[1].id } })).not.toBeNull();
  });
});
