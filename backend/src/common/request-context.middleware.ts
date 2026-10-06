import { randomUUID } from "node:crypto";
import { Logger } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";

const REQUEST_ID = /^[A-Za-z0-9-]{8,64}$/;
const logger = new Logger("HTTP");

declare module "express" {
  interface Request {
    requestId?: string;
  }
}

/**
 * Gives every request an id (reusing a well-formed `X-Request-Id` from the proxy), echoes it in
 * the response, and logs one line per request: method, path (no query string), status, duration.
 * No bodies, cookies or customer data are logged (barch §13, §19).
 */
export function requestContext(req: Request, res: Response, next: NextFunction): void {
  const incoming = req.header("x-request-id");
  const requestId = incoming && REQUEST_ID.test(incoming) ? incoming : randomUUID();
  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);
  const started = process.hrtime.bigint();
  res.on("finish", () => {
    const ms = Number(process.hrtime.bigint() - started) / 1e6;
    const path = req.originalUrl.split("?")[0];
    const line = `${req.method} ${path} ${res.statusCode} ${ms.toFixed(1)}ms id=${requestId}`;
    if (res.statusCode >= 500) logger.error(line);
    else logger.log(line);
  });
  next();
}
