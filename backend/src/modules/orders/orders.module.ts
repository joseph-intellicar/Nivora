import { Module } from "@nestjs/common";
import { CatalogModule } from "../catalog/catalog.module.js";
import { CheckoutController } from "./checkout.controller.js";
import { CheckoutService } from "./checkout.service.js";
import { OrdersController } from "./orders.controller.js";
import { OrdersService } from "./orders.service.js";

@Module({
  imports: [CatalogModule],
  controllers: [CheckoutController, OrdersController],
  providers: [CheckoutService, OrdersService],
})
export class OrdersModule {}
