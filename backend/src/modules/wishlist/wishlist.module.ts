import { Module } from "@nestjs/common";
import { CatalogModule } from "../catalog/catalog.module.js";
import { WishlistController } from "./wishlist.controller.js";
import { WishlistService } from "./wishlist.service.js";

@Module({
  imports: [CatalogModule],
  controllers: [WishlistController],
  providers: [WishlistService],
})
export class WishlistModule {}
