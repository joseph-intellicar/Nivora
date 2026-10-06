import { type ArgumentMetadata, Injectable, type PipeTransform } from "@nestjs/common";
import { validate } from "@nivora/shared/validate";
import type { z } from "zod";

/**
 * Validates a body/query/param with a shared Zod schema (barch §12). Failures become
 * `VALIDATION` (or `INVALID_ADDRESS` for address forms) with req §28 messages per field, so the
 * frontend shows the same inline errors it shows today.
 *
 *   @Body(new ZodValidationPipe(addressSchema, "INVALID_ADDRESS")) input: AddressInput
 */
@Injectable()
export class ZodValidationPipe<S extends z.ZodType> implements PipeTransform<unknown, z.output<S>> {
  constructor(
    private readonly schema: S,
    private readonly code: "VALIDATION" | "INVALID_ADDRESS" = "VALIDATION",
  ) {}

  transform(value: unknown, _metadata: ArgumentMetadata): z.output<S> {
    return validate(this.schema, value, this.code);
  }
}
