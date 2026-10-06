import type { INestApplication, Type } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app.module.js";
import { configureApp } from "../src/app.setup.js";

export const FRONTEND = "http://localhost:3000";

/** The real app with production wiring (prefix, helmet, cookies, Origin check, JSON only). */
export async function createTestApp(controllers: Type[] = []): Promise<INestApplication> {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule], controllers }).compile();
  const app = moduleRef.createNestApplication({ bodyParser: false, logger: ["error", "warn"] });
  configureApp(app);
  await app.init();
  return app;
}
