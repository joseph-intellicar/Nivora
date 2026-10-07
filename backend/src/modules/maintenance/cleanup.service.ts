import { Injectable, Logger, type OnModuleDestroy, type OnModuleInit } from "@nestjs/common";
import { AppConfig } from "../../config/app-config.service.js";
import { PrismaService } from "../../prisma/prisma.service.js";

const HOUR_MS = 60 * 60 * 1000;
export const GUEST_CART_TTL_DAYS = 30;

export type CleanupResult = { expiredSessions: number; staleGuestCarts: number };

/**
 * Housekeeping (barch §19): expired sessions and guest carts untouched for 30 days are deleted.
 * Runs hourly in the API process (one instance in Phase 2; with several instances any of them
 * may run it — the deletes are idempotent). Customer carts, orders and accounts are never touched.
 * Disabled under NODE_ENV=test, where tests call `run()` directly.
 */
@Injectable()
export class CleanupService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(CleanupService.name);
  private timer: NodeJS.Timeout | undefined;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfig,
  ) {}

  onModuleInit(): void {
    if (this.config.get("NODE_ENV") === "test") return;
    this.timer = setInterval(() => void this.runSafely(), HOUR_MS);
    this.timer.unref();
    // First pass shortly after startup, off the boot path.
    setTimeout(() => void this.runSafely(), 30_000).unref();
  }

  onModuleDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  async run(now = new Date()): Promise<CleanupResult> {
    const staleBefore = new Date(now.getTime() - GUEST_CART_TTL_DAYS * 24 * HOUR_MS);
    const [sessions, carts] = await Promise.all([
      this.prisma.session.deleteMany({ where: { expiresAt: { lte: now } } }),
      this.prisma.cart.deleteMany({ where: { userId: null, updatedAt: { lt: staleBefore } } }),
    ]);
    return { expiredSessions: sessions.count, staleGuestCarts: carts.count };
  }

  private async runSafely(): Promise<void> {
    try {
      const result = await this.run();
      if (result.expiredSessions || result.staleGuestCarts) {
        this.logger.log(
          `Cleanup: ${result.expiredSessions} expired sessions, ${result.staleGuestCarts} stale guest carts removed`,
        );
      }
    } catch (error) {
      this.logger.warn(
        `Cleanup failed: ${(error as { code?: string }).code ?? (error as Error).name}`,
      );
    }
  }
}
