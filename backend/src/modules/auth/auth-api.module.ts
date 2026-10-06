import { Module } from "@nestjs/common";
import { CartModule } from "../cart/cart.module.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";

/** Signup, login, logout and session endpoints; login merges the guest cart (req §17.5). */
@Module({
  imports: [CartModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthApiModule {}
