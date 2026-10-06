import { Controller, Get, HttpCode, HttpStatus, Logger, Res } from "@nestjs/common";
import type { Response } from "express";
import { PrismaService } from "../../prisma/prisma.service.js";

export type HealthStatus = { status: "ok" | "degraded"; db: "ok" | "down" };

/** Liveness + database check for the host and for operators (barch §19). */
@Controller("health")
export class HealthController {
  private readonly logger = new Logger(HealthController.name);

  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async check(@Res({ passthrough: true }) res: Response): Promise<HealthStatus> {
    res.setHeader("Cache-Control", "no-store");
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: "ok", db: "ok" };
    } catch (error) {
      const code = (error as { code?: unknown }).code;
      this.logger.warn(
        `Database check failed: ${typeof code === "string" ? code : (error as Error).name}`,
      );
      res.status(HttpStatus.SERVICE_UNAVAILABLE);
      return { status: "degraded", db: "down" };
    }
  }
}
