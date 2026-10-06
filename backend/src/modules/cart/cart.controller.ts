import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import type { User } from "@nivora/shared/domain/types";
import type { Request, Response } from "express";
import { OptionalAuthGuard } from "../auth/auth.guard.js";
import { CurrentUser } from "../auth/current-user.decorator.js";
import { CartService } from "./cart.service.js";

/** 👤 Guest or customer cart (barch §7, §9). Every response is the revalidated CartView. */
@Controller("cart")
@UseGuards(OptionalAuthGuard)
export class CartController {
  constructor(private readonly carts: CartService) {}

  @Get()
  get(
    @CurrentUser() user: User | null,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.carts.view({ user, req, res });
  }

  @Post("items")
  @HttpCode(HttpStatus.OK)
  add(
    @CurrentUser() user: User | null,
    @Body() body: { variantId?: unknown; quantity?: unknown },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.carts.add({ user, req, res }, body ?? {});
  }

  @Patch("items/:variantId")
  update(
    @CurrentUser() user: User | null,
    @Param("variantId") variantId: string,
    @Body() body: { quantity?: unknown },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.carts.update({ user, req, res }, variantId, body?.quantity);
  }

  @Delete("items/:variantId")
  remove(
    @CurrentUser() user: User | null,
    @Param("variantId") variantId: string,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.carts.remove({ user, req, res }, variantId);
  }
}
