import type { INestApplication } from "@nestjs/common";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import { requestContext } from "./common/request-context.middleware.js";

export const API_PREFIX = "api/v1";

/**
 * HTTP wiring shared by `main.ts` and the e2e tests, so tests exercise exactly what runs in
 * production (barch §4, §13). The app must be created with `bodyParser: false`. The Origin check
 * is Nest middleware (see AppModule) so its rejections use the error envelope.
 */
export function configureApp(app: INestApplication): INestApplication {
  const http = app.getHttpAdapter().getInstance() as express.Express;
  http.disable("x-powered-by");
  // Behind the Next.js proxy (and later a host's load balancer): trust one hop for req.ip.
  http.set("trust proxy", 1);

  app.setGlobalPrefix(API_PREFIX);
  app.use(requestContext);
  app.use(helmet());
  // JSON only; forms and other encodings are never parsed.
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());
  app.enableShutdownHooks();
  return app;
}
