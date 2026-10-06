import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import type { ProfileInput, User } from "@nivora/shared/domain/types";
import { profileSchema } from "@nivora/shared/domain/validation";
import { ZodValidationPipe } from "../../common/validation/zod-validation.pipe.js";
import { PrismaService } from "../../prisma/prisma.service.js";
import { AuthGuard } from "../auth/auth.guard.js";
import { CurrentUser } from "../auth/current-user.decorator.js";
import { toPublicUser } from "../auth/session.service.js";

/** The customer's profile (req §26). Email is the login identifier and stays read-only. */
@Controller("me")
@UseGuards(AuthGuard)
export class ProfileController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  get(@CurrentUser() user: User) {
    return user;
  }

  /** Name and optional phone; an empty phone removes it; any `email` sent is ignored. */
  @Patch()
  async update(
    @CurrentUser() user: User,
    @Body(new ZodValidationPipe(profileSchema)) input: ProfileInput,
  ) {
    const row = await this.prisma.user.update({
      where: { id: user.id },
      data: { name: input.name, phone: input.phone ? input.phone : null },
      select: { id: true, name: true, email: true, phone: true },
    });
    return toPublicUser(row);
  }
}
