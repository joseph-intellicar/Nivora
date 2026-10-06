import { createParamDecorator, type ExecutionContext } from "@nestjs/common";
import type { User } from "@nivora/shared/domain/types";
import type { Request } from "express";

/** The customer resolved by AuthGuard (always set) or OptionalAuthGuard (null for guests). */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): User | null =>
    context.switchToHttp().getRequest<Request>().user ?? null,
);
