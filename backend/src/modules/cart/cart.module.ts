import { Module } from "@nestjs/common";
import { GuestCartMerger } from "../auth/auth.service.js";
import { CatalogModule } from "../catalog/catalog.module.js";
import { CartController } from "./cart.controller.js";
import { CartService } from "./cart.service.js";

@Module({
  imports: [CatalogModule],
  controllers: [CartController],
  providers: [CartService, { provide: GuestCartMerger, useExisting: CartService }],
  exports: [CartService, GuestCartMerger],
})
export class CartModule {}
