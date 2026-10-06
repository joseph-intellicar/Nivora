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
import type { AddressInput, User } from "@nivora/shared/domain/types";
import { addressSchema } from "@nivora/shared/domain/validation";
import { ZodValidationPipe } from "../../common/validation/zod-validation.pipe.js";
import { AuthGuard } from "../auth/auth.guard.js";
import { CurrentUser } from "../auth/current-user.decorator.js";
import { AddressesService } from "./addresses.service.js";

const addressPipe = new ZodValidationPipe(addressSchema, "INVALID_ADDRESS");

/** 🔒 Address book (barch §7). */
@Controller("addresses")
@UseGuards(AuthGuard)
export class AddressesController {
  constructor(private readonly addresses: AddressesService) {}

  @Get()
  list(@CurrentUser() user: User) {
    return this.addresses.list(user.id);
  }

  @Post()
  create(@CurrentUser() user: User, @Body(addressPipe) input: AddressInput) {
    return this.addresses.create(user.id, input);
  }

  @Put(":id")
  update(
    @CurrentUser() user: User,
    @Param("id") id: string,
    @Body(addressPipe) input: AddressInput,
  ) {
    return this.addresses.update(user.id, id, input);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@CurrentUser() user: User, @Param("id") id: string) {
    return this.addresses.remove(user.id, id);
  }

  @Post(":id/default")
  @HttpCode(HttpStatus.NO_CONTENT)
  setDefault(@CurrentUser() user: User, @Param("id") id: string) {
    return this.addresses.setDefault(user.id, id);
  }
}
