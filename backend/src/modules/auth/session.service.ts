import { Injectable } from "@nestjs/common";
import type { User } from "@nivora/shared/domain/types";
import type { Response } from "express";
import { AppConfig } from "../../config/app-config.service.js";
import { PrismaService } from "../../prisma/prisma.service.js";
import {
  SESSION_COOKIE,
  hashToken,
  isWellFormedToken,
  newSessionToken,
  sessionCookieOptions,
} from "./session-token.js";

const DAY_MS = 24 * 60 * 60 * 1000;

export type UserRow = { id: string; name: string; email: string; phone: string | null };

type SessionRow = {
  id: string;
  expiresAt: Date;
  lastSeenAt: Date;
  userId: string;
  name: string;
  email: string;
  phone: string | null;
};

export function toPublicUser(row: UserRow): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    ...(row.phone ? { phone: row.phone } : {}),
  };
}

/** Database-backed sessions in an HTTP-only cookie (barch §8). */
@Injectable()
export class SessionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfig,
  ) {}

  private get ttlDays(): number {
    return this.config.get("SESSION_TTL_DAYS");
  }

  private cookieOptions() {
    return sessionCookieOptions(this.config.get("COOKIE_SECURE"), this.ttlDays);
  }

  /** Starts a session for the user and sets the cookie. Only the token's hash is stored. */
  async start(userId: string, res: Response): Promise<void> {
    const token = newSessionToken();
    await this.prisma.session.create({
      data: {
        tokenHash: hashToken(token),
        userId,
        expiresAt: new Date(Date.now() + this.ttlDays * DAY_MS),
      },
    });
    res.cookie(SESSION_COOKIE, token, this.cookieOptions());
  }

  /**
   * The user behind a cookie token, or null (missing, malformed, unknown or expired → guest).
   * Sessions are extended (sliding) when last refreshed more than a day ago.
   */
  async resolve(token: unknown, res: Response): Promise<{ sessionId: string; user: User } | null> {
    if (!isWellFormedToken(token)) return null;
    // One round trip (this runs on every customer request): session and user in a single JOIN.
    const [session] = await this.prisma.$queryRaw<SessionRow[]>`
      SELECT s."id", s."expiresAt", s."lastSeenAt",
             u."id" AS "userId", u."name", u."email", u."phone"
      FROM ${this.prisma.table("sessions")} s
      JOIN ${this.prisma.table("users")} u ON u."id" = s."userId"
      WHERE s."tokenHash" = ${hashToken(token)}`;
    const now = Date.now();
    if (!session || session.expiresAt.getTime() <= now) {
      res.clearCookie(SESSION_COOKIE, { ...this.cookieOptions(), maxAge: undefined });
      return null;
    }
    if (now - session.lastSeenAt.getTime() > DAY_MS) {
      await this.prisma.session.update({
        where: { id: session.id },
        data: { lastSeenAt: new Date(now), expiresAt: new Date(now + this.ttlDays * DAY_MS) },
      });
      res.cookie(SESSION_COOKIE, token, this.cookieOptions());
    }
    return {
      sessionId: session.id,
      user: toPublicUser({
        id: session.userId,
        name: session.name,
        email: session.email,
        phone: session.phone,
      }),
    };
  }

  /** Ends the session (if any) and clears the cookie. */
  async end(sessionId: string | undefined, res: Response): Promise<void> {
    if (sessionId) await this.prisma.session.deleteMany({ where: { id: sessionId } });
    res.clearCookie(SESSION_COOKIE, { ...this.cookieOptions(), maxAge: undefined });
  }
}
