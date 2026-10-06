import type { z } from "zod";
import { ApiError } from "../../errors";

/** Validates data-layer input like a server would; field messages go back to the form. */
export function validate<S extends z.ZodType>(
  schema: S,
  input: unknown,
  code: "VALIDATION" | "INVALID_ADDRESS" = "VALIDATION",
): z.output<S> {
  const result = schema.safeParse(input);
  if (result.success) return result.data;
  const fields: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = issue.path.join(".") || "form";
    fields[key] ??= issue.message;
  }
  throw new ApiError(code, { fields });
}
