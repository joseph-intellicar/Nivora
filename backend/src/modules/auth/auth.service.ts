import { Injectable } from "@nestjs/common";
import type { AuthResult } from "@nivora/shared/contracts";
import type { LoginInput, SignupInput } from "@nivora/shared/domain/types";
import { loginSchema } from "@nivora/shared/domain/validation";
import { ApiError } from "@nivora/shared/errors";
import type { Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client.js";
import { PrismaService } from "../../prisma/prisma.service.js";
import { LoginAttempts } from "./login-attempts.js";
import { hashPassword, verifyPassword } from "./password.js";
import { SessionService, toPublicUser, type UserRow } from "./session.service.js";

/** Hook for the cart module: folds the guest cart into the customer's cart at login (req §17.5). */
export abstract class GuestCartMerger {
  /** Returns true when the customer already had saved items that the guest cart was added to. */
  abstract mergeIntoUser(userId: string, req: Request, res: Response): Promise<boolean>;
}

const USER_FIELDS = { id: true, name: true, email: true, phone: true, passwordHash: true } as const;

@Injectable()
export class AuthService {
  private readonly attempts = new LoginAttempts();
  /** Compared against when the email is unknown, so both paths cost one argon2 verification. */
  private readonly dummyHash = hashPassword("nivora-timing-equaliser");

  constructor(
    private readonly prisma: PrismaService,
    private readonly sessions: SessionService,
    private readonly carts: GuestCartMerger,
  ) {}

  async signup(input: SignupInput, req: Request, res: Response): Promise<AuthResult> {
    const email = input.email.toLowerCase();
    const taken = () =>
      new ApiError("EMAIL_TAKEN", {
        fields: { email: "An account with this email already exists. Try logging in." },
      });
    if (await this.prisma.user.findUnique({ where: { email }, select: { id: true } }))
      throw taken();
    let user: UserRow;
    try {
      user = await this.prisma.user.create({
        data: { name: input.name, email, passwordHash: await hashPassword(input.password) },
        select: { id: true, name: true, email: true, phone: true },
      });
    } catch (error) {
      // Two signups for the same email at once: the unique index decides.
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
        throw taken();
      throw error;
    }
    return this.signIn(user, req, res);
  }

  /** Any problem — bad input, unknown email, wrong password — is the same INVALID_CREDENTIALS. */
  async login(input: unknown, req: Request, res: Response): Promise<AuthResult> {
    const parsed = loginSchema.safeParse(input);
    if (!parsed.success) throw new ApiError("INVALID_CREDENTIALS");
    const { password } = parsed.data as LoginInput;
    const email = parsed.data.email.toLowerCase();
    if (this.attempts.isLocked(email)) throw new ApiError("RATE_LIMITED");

    const user = await this.prisma.user.findUnique({ where: { email }, select: USER_FIELDS });
    const valid = await verifyPassword(user?.passwordHash ?? (await this.dummyHash), password);
    if (!user || !valid) {
      this.attempts.recordFailure(email);
      throw new ApiError("INVALID_CREDENTIALS");
    }
    this.attempts.clear(email);
    const { passwordHash: _hash, ...publicFields } = user;
    return this.signIn(publicFields, req, res);
  }

  /** Ends the session and clears a pending Buy Now; carts, wishlist, addresses and orders stay (req §27). */
  async logout(
    userId: string | undefined,
    sessionId: string | undefined,
    res: Response,
  ): Promise<void> {
    await this.sessions.end(sessionId, res);
    if (userId) await this.prisma.checkoutSession.deleteMany({ where: { userId } });
  }

  private async signIn(user: UserRow, req: Request, res: Response): Promise<AuthResult> {
    // A fresh token on every login (no session fixation); the old session, if any, ends.
    if (req.sessionId) await this.prisma.session.deleteMany({ where: { id: req.sessionId } });
    await this.sessions.start(user.id, res);
    const mergedSavedItems = await this.carts.mergeIntoUser(user.id, req, res);
    return { user: toPublicUser(user), mergedSavedItems };
  }
}
