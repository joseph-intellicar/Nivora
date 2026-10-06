import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  Logger,
} from "@nestjs/common";
import { messageFor } from "@nivora/shared/errorMessages";
import {
  ApiError,
  type ApiErrorCode,
  type ApiErrorDetails,
  isApiError,
} from "@nivora/shared/errors";
import type { Request, Response } from "express";
import { statusFor } from "./error-status.js";

export type ErrorEnvelope = {
  error: { code: ApiErrorCode; message: string; details: ApiErrorDetails };
};

/** Framework HTTP errors (routing, body parsing, middleware) mapped onto the shared codes. */
const HTTP_STATUS_CODES: Record<number, ApiErrorCode> = {
  400: "VALIDATION",
  401: "UNAUTHENTICATED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  405: "NOT_FOUND",
  413: "VALIDATION",
  415: "VALIDATION",
  429: "RATE_LIMITED",
};

/** Prisma "record not found" style errors become NOT_FOUND; other database errors are UNKNOWN. */
const PRISMA_NOT_FOUND = new Set(["P2001", "P2018", "P2025"]);

/**
 * Every error leaves the API as `{ error: { code, message, details } }` (barch §7) with the
 * customer wording from req §28. Unexpected errors are logged with the request id and returned
 * as UNKNOWN 500 without internals.
 */
@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger("Errors");

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();
    const error = this.toApiError(exception, req);
    const status = this.statusOf(exception, error);
    const body: ErrorEnvelope = {
      error: {
        code: error.code,
        message: messageFor(error.code, error.details),
        details: error.details,
      },
    };
    if (res.headersSent) return;
    res.status(status).json(body);
  }

  private toApiError(exception: unknown, req: Request): ApiError {
    if (isApiError(exception)) return exception;
    if (exception instanceof HttpException) {
      const code = HTTP_STATUS_CODES[exception.getStatus()];
      if (code) return new ApiError(code);
    }
    const prismaCode = (exception as { code?: unknown } | null)?.code;
    if (typeof prismaCode === "string" && PRISMA_NOT_FOUND.has(prismaCode))
      return new ApiError("NOT_FOUND");
    // Body-parser errors (malformed JSON, too large) carry an HTTP status.
    const status = (exception as { status?: unknown; type?: unknown } | null)?.status;
    if (typeof status === "number" && HTTP_STATUS_CODES[status] && status < 500) {
      return new ApiError(HTTP_STATUS_CODES[status]);
    }
    this.logger.error(
      `${req.method} ${req.originalUrl.split("?")[0]} id=${req.requestId ?? "-"}: ${describe(exception)}`,
      exception instanceof Error ? exception.stack : undefined,
    );
    return new ApiError("UNKNOWN");
  }

  private statusOf(exception: unknown, error: ApiError): number {
    // Keep the framework's precise status (e.g. 413, 415) when it maps to a generic code.
    if (!isApiError(exception)) {
      const status =
        exception instanceof HttpException
          ? exception.getStatus()
          : (exception as { status?: unknown } | null)?.status;
      if (typeof status === "number" && status >= 400 && status < 500 && error.code !== "UNKNOWN")
        return status;
    }
    return statusFor(error.code, error.details);
  }
}

function describe(exception: unknown): string {
  if (exception instanceof Error) return `${exception.name}: ${exception.message}`;
  return typeof exception;
}
