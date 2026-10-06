import type { User } from "@nivora/shared/domain/types";
import type { Request } from "express";

export type AuthContext = { sessionId: string; user: User } | null;

declare module "express" {
  interface Request {
    /** Resolves the session cookie once per request, on first use (see SessionMiddleware). */
    auth?: () => Promise<AuthContext>;
    /** Set by AuthGuard / OptionalAuthGuard. */
    user?: User | null;
    sessionId?: string;
  }
}

export async function resolveAuth(req: Request): Promise<AuthContext> {
  return req.auth ? req.auth() : null;
}
