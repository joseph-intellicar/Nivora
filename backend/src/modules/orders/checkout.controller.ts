import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Res,
  UseGuards,
} from "@nestjs/common";
import type { User } from "@nivora/shared/domain/types";
import type { Response } from "express";
import { AuthGuard } from "../auth/auth.guard.js";
import { CurrentUser } from "../auth/current-user.decorator.js";
import { CheckoutService } from "./checkout.service.js";

/** 🔒 Checkout and Place Order (barch §7, §11). */
@Controller()
@UseGuards(AuthGuard)
export class CheckoutController {
  constructor(private readonly checkout: CheckoutService) {}

  @Post("checkout/buy-now")
  @HttpCode(HttpStatus.NO_CONTENT)
  buyNow(@CurrentUser() user: User, @Body() body: unknown) {
    return this.checkout.startBuyNow(user.id, body);
  }

  @Post("checkout/cart")
  @HttpCode(HttpStatus.NO_CONTENT)
  cart(@CurrentUser() user: User) {
    return this.checkout.startCartCheckout(user.id);
  }

  @Get("checkout")
  view(@CurrentUser() user: User, @Query("deliveryOption") deliveryOption: unknown) {
    return this.checkout.getCheckout(user.id, deliveryOption ?? "standard");
  }

  /** 201 for a new order, 200 when an Idempotency-Key retry returns the order already placed. */
  @Post("orders")
  async place(
    @CurrentUser() user: User,
    @Body() body: { addressId?: unknown; deliveryOption?: unknown },
    @Headers("idempotency-key") idempotencyKey: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { order, created } = await this.checkout.placeOrder(user.id, body ?? {}, idempotencyKey);
    res.status(created ? HttpStatus.CREATED : HttpStatus.OK);
    return order;
  }
}
