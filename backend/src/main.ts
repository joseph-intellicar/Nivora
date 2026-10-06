import "./common/network.js";
import "reflect-metadata";
import { ConsoleLogger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { configureApp } from "./app.setup.js";
import { AppConfig } from "./config/app-config.service.js";

async function bootstrap(): Promise<void> {
  const logger = new ConsoleLogger({ json: process.env.NODE_ENV === "production" });
  const app = await NestFactory.create(AppModule, { bodyParser: false, logger });
  configureApp(app);
  const port = app.get(AppConfig).get("PORT");
  await app.listen(port);
  logger.log(`Nivora API listening on http://localhost:${port}/api/v1`, "Bootstrap");
}

await bootstrap();
