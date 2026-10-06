import { type CanActivate, type ExecutionContext, Injectable } from "@nestjs/common";
import { ApiError } from "@nivora/shared/errors";
import type { Request } from "express";
import { resolveAuth } from "./request-auth.js";

/** 🔒 routes: a valid session is required, otherwise 401 UNAUTHENTICATED (barch §8). */
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const auth = await resolveAuth(req);
    if (!auth) throw new ApiError("UNAUTHENTICATED");
    req.user = auth.user;
    req.sessionId = auth.sessionId;
    return true;
  }
}

/** 👤 routes (guest or customer): resolves the session if there is one, never rejects. */
@Injectable()
export class OptionalAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const auth = await resolveAuth(req);
    req.user = auth?.user ?? null;
    req.sessionId = auth?.sessionId;
    return true;
  }
}
