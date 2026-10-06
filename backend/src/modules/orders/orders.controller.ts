import { Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import type { User } from "@nivora/shared/domain/types";
import { AuthGuard } from "../auth/auth.guard.js";
import { CurrentUser } from "../auth/current-user.decorator.js";
import { OrdersService } from "./orders.service.js";

/** 🔒 Order history (barch §7). */
@Controller("orders")
@UseGuards(AuthGuard)
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  list(@CurrentUser() user: User) {
    return this.orders.list(user.id);
  }

  @Get(":orderNumber")
  get(@CurrentUser() user: User, @Param("orderNumber") orderNumber: string) {
    return this.orders.get(user.id, orderNumber);
  }

  @Post(":orderNumber/cancel")
  @HttpCode(HttpStatus.OK)
  cancel(@CurrentUser() user: User, @Param("orderNumber") orderNumber: string) {
    return this.orders.cancel(user.id, orderNumber);
  }
}
