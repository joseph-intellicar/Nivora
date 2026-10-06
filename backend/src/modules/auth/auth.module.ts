import { Global, type MiddlewareConsumer, Module, type NestModule } from "@nestjs/common";
import { AuthGuard, OptionalAuthGuard } from "./auth.guard.js";
import { SessionMiddleware } from "./session.middleware.js";
import { SessionService } from "./session.service.js";

/** Sessions and guards for every module (barch §8). The endpoints live in AuthApiModule. */
@Global()
@Module({
  providers: [SessionService, AuthGuard, OptionalAuthGuard],
  exports: [SessionService, AuthGuard, OptionalAuthGuard],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(SessionMiddleware).forRoutes("*path");
  }
}
