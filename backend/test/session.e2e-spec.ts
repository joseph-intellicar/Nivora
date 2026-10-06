import { Controller, Get, type INestApplication, Post, Res, UseGuards } from "@nestjs/common";
import type { User } from "@nivora/shared/domain/types";
import type { Response } from "express";
import request from "supertest";
import { AuthGuard, OptionalAuthGuard } from "../src/modules/auth/auth.guard.js";
import { CurrentUser } from "../src/modules/auth/current-user.decorator.js";
import { SessionService } from "../src/modules/auth/session.service.js";
import { hashToken } from "../src/modules/auth/session-token.js";
import { PrismaService } from "../src/prisma/prisma.service.js";
import { createTestApp } from "./app-factory.js";
import { browser, uniqueEmail } from "./http-client.js";

let userId = "";

@Controller("test/session")
class SessionTestController {
  constructor(private readonly sessions: SessionService) {}

  @Post("start")
  async start(@Res({ passthrough: true }) res: Response) {
    await this.sessions.start(userId, res);
    return { ok: true };
  }

  @Get("protected")
  @UseGuards(AuthGuard)
  protectedRoute(@CurrentUser() user: User) {
    return user;
  }

  @Get("optional")
  @UseGuards(OptionalAuthGuard)
  optional(@CurrentUser() user: User | null) {
    return { user };
  }
}

const cookieOf = (res: request.Response) =>
  ([] as string[]).concat(res.headers["set-cookie"] ?? []).join("; ");

describe("sessions (e2e, P2-018)", () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    app = await createTestApp([SessionTestController]);
    prisma = app.get(PrismaService);
    const user = await prisma.user.create({
      data: {
        name: "Session Tester",
        email: uniqueEmail("session"),
        passwordHash: "x",
        phone: "9876543210",
      },
    });
    userId = user.id;
  });

  afterAll(async () => {
    await prisma.user.delete({ where: { id: userId } });
    await app.close();
  });

  it("protected route: 401 without a cookie, 200 with one", async () => {
    const guest = await request(app.getHttpServer())
      .get("/api/v1/test/session/protected")
      .expect(401);
    expect(guest.body.error.code).toBe("UNAUTHENTICATED");

    const client = browser(app);
    const started = await client.post("/api/v1/test/session/start").expect(201);
    const cookie = cookieOf(started);
    expect(cookie).toMatch(
      /^nivora_session=[A-Za-z0-9_-]{43}; Max-Age=2592000; Path=\/; Expires=.+; HttpOnly; SameSite=Lax$/,
    );
    const me = await client.get("/api/v1/test/session/protected").expect(200);
    expect(me.body).toEqual({
      id: userId,
      name: "Session Tester",
      email: expect.stringContaining("@test.nivora.in"),
      phone: "9876543210",
    });
  });

  it("stores only the hash of the token", async () => {
    const client = browser(app);
    const token = /nivora_session=([^;]+)/.exec(
      cookieOf(await client.post("/api/v1/test/session/start")),
    )![1];
    const rows = await prisma.session.findMany({ where: { userId } });
    expect(rows.some((row) => row.tokenHash === hashToken(token))).toBe(true);
    expect(rows.some((row) => row.tokenHash === token || row.tokenHash.includes(token))).toBe(
      false,
    );
  });

  it("optional routes see guests as null and customers as users", async () => {
    expect(
      (await request(app.getHttpServer()).get("/api/v1/test/session/optional").expect(200)).body,
    ).toEqual({ user: null });
    const client = browser(app);
    await client.post("/api/v1/test/session/start");
    expect((await client.get("/api/v1/test/session/optional").expect(200)).body.user.id).toBe(
      userId,
    );
  });

  it("treats unknown, malformed and expired sessions as guests and clears the cookie", async () => {
    const server = app.getHttpServer();
    for (const token of ["not-a-token", "A".repeat(43)]) {
      await request(server)
        .get("/api/v1/test/session/protected")
        .set("Cookie", `nivora_session=${token}`)
        .expect(401);
    }
    const client = browser(app);
    const token = /nivora_session=([^;]+)/.exec(
      cookieOf(await client.post("/api/v1/test/session/start")),
    )![1];
    await prisma.session.update({
      where: { tokenHash: hashToken(token) },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });
    const expired = await client.get("/api/v1/test/session/protected").expect(401);
    expect(cookieOf(expired)).toMatch(/nivora_session=;.*Expires=Thu, 01 Jan 1970/);
  });

  it("extends a session that was last seen more than a day ago (sliding)", async () => {
    const client = browser(app);
    const token = /nivora_session=([^;]+)/.exec(
      cookieOf(await client.post("/api/v1/test/session/start")),
    )![1];
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
    await prisma.session.update({
      where: { tokenHash: hashToken(token) },
      data: { lastSeenAt: twoDaysAgo, expiresAt: new Date(Date.now() + 60_000) },
    });
    const res = await client.get("/api/v1/test/session/protected").expect(200);
    expect(cookieOf(res)).toContain(`nivora_session=${token}`);
    const row = await prisma.session.findUniqueOrThrow({ where: { tokenHash: hashToken(token) } });
    expect(row.expiresAt.getTime()).toBeGreaterThan(Date.now() + 29 * 24 * 60 * 60 * 1000);
  });

  it("does not touch the database for routes that don't need the user", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/v1/categories")
      .set("Cookie", "nivora_session=" + "A".repeat(43))
      .expect(200);
    expect(res.headers["set-cookie"]).toBeUndefined();
  });
});
