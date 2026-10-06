import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppConfig } from "./app-config.service.js";
import { validateEnv } from "./env.js";

/**
 * Loads `backend/.env` (or the file named by ENV_FILE, e.g. `.env.test` for tests) and validates
 * it. Real environment variables win over the file (barch §15).
 */
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.ENV_FILE ?? ".env",
      validate: validateEnv,
      cache: true,
    }),
  ],
  providers: [AppConfig],
  exports: [AppConfig],
})
export class AppConfigModule {}
