import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from "@nestjs/common";
import type { User } from "@nivora/shared/domain/types";
import type { SignupInput } from "@nivora/shared/domain/types";
import { signupSchema } from "@nivora/shared/domain/validation";
import type { Request, Response } from "express";
import { RateLimit } from "../../common/rate-limit/rate-limit.decorator.js";
import { ZodValidationPipe } from "../../common/validation/zod-validation.pipe.js";
import { OptionalAuthGuard } from "./auth.guard.js";
import { AuthService } from "./auth.service.js";
import { CurrentUser } from "./current-user.decorator.js";

/** Login/signup brute-force limits per client IP (barch §8, §13). */
export const LOGIN_LIMIT = { name: "login", limit: 30, windowMs: 60_000 };
export const SIGNUP_LIMIT = { name: "signup", limit: 30, windowMs: 10 * 60_000 };

@Controller("auth")
@UseGuards(OptionalAuthGuard)
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Get("session")
  session(@CurrentUser() user: User | null) {
    return { user };
  }

  @Post("signup")
  @RateLimit(SIGNUP_LIMIT)
  signup(
    @Body(new ZodValidationPipe(signupSchema)) input: SignupInput,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.auth.signup(input, req, res);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @RateLimit(LOGIN_LIMIT)
  login(@Body() input: unknown, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.auth.login(input, req, res);
  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(
    @CurrentUser() user: User | null,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.auth.logout(user?.id, req.sessionId, res);
  }
}
