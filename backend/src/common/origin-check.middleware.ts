import { Injectable, type NestMiddleware, UnsupportedMediaTypeException } from "@nestjs/common";
import { ApiError } from "@nivora/shared/errors";
import type { NextFunction, Request, Response } from "express";
import { AppConfig } from "../config/app-config.service.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

/**
 * CSRF defence for cookie-authenticated requests (barch §13): a mutating request must come from
 * the frontend origin (Origin header, or Referer when Origin is absent) and any body must be JSON.
 * Registered through Nest's MiddlewareConsumer so rejections go through the exception filter.
 */
@Injectable()
export class OriginCheckMiddleware implements NestMiddleware {
  private readonly frontendOrigin: string;

  constructor(config: AppConfig) {
    this.frontendOrigin = config.get("FRONTEND_ORIGIN");
  }

  use(req: Request, _res: Response, next: NextFunction): void {
    if (SAFE_METHODS.has(req.method)) return next();

    const origin = req.header("origin") ?? refererOrigin(req.header("referer"));
    if (origin !== this.frontendOrigin) {
      throw new ApiError("FORBIDDEN");
    }

    const hasBody =
      Number(req.header("content-length") ?? 0) > 0 ||
      req.header("transfer-encoding") !== undefined;
    if (hasBody && !req.is("application/json")) {
      throw new UnsupportedMediaTypeException("Request body must be JSON.");
    }
    next();
  }
}

function refererOrigin(referer: string | undefined): string | undefined {
  if (!referer) return undefined;
  try {
    return new URL(referer).origin;
  } catch {
    return undefined;
  }
}
