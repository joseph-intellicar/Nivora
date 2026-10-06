import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import type { User } from "@nivora/shared/domain/types";
import { AuthGuard } from "../auth/auth.guard.js";
import { CurrentUser } from "../auth/current-user.decorator.js";
import { WishlistService } from "./wishlist.service.js";

/** 🔒 Wishlist (barch §7). */
@Controller("wishlist")
@UseGuards(AuthGuard)
export class WishlistController {
  constructor(private readonly wishlist: WishlistService) {}

  @Get()
  list(@CurrentUser() user: User) {
    return this.wishlist.list(user.id);
  }

  @Put(":productId")
  @HttpCode(HttpStatus.NO_CONTENT)
  add(@CurrentUser() user: User, @Param("productId") productId: string) {
    return this.wishlist.add(user.id, productId);
  }

  @Delete(":productId")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentUser() user: User, @Param("productId") productId: string) {
    return this.wishlist.remove(user.id, productId);
  }

  @Post(":productId/move-to-cart")
  @HttpCode(HttpStatus.NO_CONTENT)
  moveToCart(
    @CurrentUser() user: User,
    @Param("productId") productId: string,
    @Body() body: { variantId?: unknown },
  ) {
    return this.wishlist.moveToCart(user.id, productId, body?.variantId);
  }
}
