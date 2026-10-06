import type { z } from "zod";
import { ApiError } from "./errors";

/**
 * Parses input with a shared schema or throws `VALIDATION`/`INVALID_ADDRESS` with the first
 * message per field in `details.fields` (req §28). Used by the API and the mock data layer.
 */
export function validate<S extends z.ZodType>(
  schema: S,
  input: unknown,
  code: "VALIDATION" | "INVALID_ADDRESS" = "VALIDATION",
): z.output<S> {
  const result = schema.safeParse(input);
  if (result.success) return result.data;
  throw new ApiError(code, { fields: fieldErrors(result.error) });
}

/** First message per field path ("form" for errors on the whole object). */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    fields[key] ??= issue.message;
  }
  return fields;
}
