import { type MiddlewareConsumer, Module, type NestModule } from "@nestjs/common";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { ApiExceptionFilter } from "./common/errors/api-exception.filter.js";
import { OriginCheckMiddleware } from "./common/origin-check.middleware.js";
import { RateLimitGuard } from "./common/rate-limit/rate-limit.guard.js";
import { AppConfigModule } from "./config/config.module.js";
import { AddressesModule } from "./modules/addresses/addresses.module.js";
import { AuthApiModule } from "./modules/auth/auth-api.module.js";
import { AuthModule } from "./modules/auth/auth.module.js";
import { CartModule } from "./modules/cart/cart.module.js";
import { CatalogModule } from "./modules/catalog/catalog.module.js";
import { ContentModule } from "./modules/content/content.module.js";
import { HealthModule } from "./modules/health/health.module.js";
import { MaintenanceModule } from "./modules/maintenance/maintenance.module.js";
import { OrdersModule } from "./modules/orders/orders.module.js";
import { ProfileModule } from "./modules/profile/profile.module.js";
import { WishlistModule } from "./modules/wishlist/wishlist.module.js";
import { PrismaModule } from "./prisma/prisma.module.js";

/** Root module. Feature modules (catalog, auth, cart, orders, …) live under src/modules (barch §5). */
@Module({
  imports: [
    AppConfigModule,
    PrismaModule,
    AuthModule,
    HealthModule,
    CatalogModule,
    ContentModule,
    ProfileModule,
    CartModule,
    AuthApiModule,
    WishlistModule,
    AddressesModule,
    OrdersModule,
    MaintenanceModule,
  ],
  // Generous default for every route; auth routes add a stricter @RateLimit (barch §13).
  providers: [
    { provide: APP_GUARD, useClass: RateLimitGuard },
    { provide: APP_FILTER, useClass: ApiExceptionFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(OriginCheckMiddleware).forRoutes("*path");
  }
}
