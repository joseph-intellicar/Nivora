import { Injectable, type NestMiddleware } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import type { AuthContext } from "./request-auth.js";
import { SessionService } from "./session.service.js";
import { SESSION_COOKIE } from "./session-token.js";

/**
 * Attaches a lazy, memoised session resolver to every request. Routes that never ask (catalog,
 * content, health) cost no database lookup; guards and services that need the user call it.
 */
@Injectable()
export class SessionMiddleware implements NestMiddleware {
  constructor(private readonly sessions: SessionService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    let pending: Promise<AuthContext> | undefined;
    req.auth = () => (pending ??= this.sessions.resolve(req.cookies?.[SESSION_COOKIE], res));
    next();
  }
}
