import { addressSchema, loginSchema, signupSchema } from "@nivora/shared/domain/validation";
import { ApiError } from "@nivora/shared/errors";
import { ZodValidationPipe } from "./zod-validation.pipe.js";

const meta = { type: "body" as const };

function errorOf(fn: () => unknown): ApiError {
  try {
    fn();
  } catch (error) {
    if (error instanceof ApiError) return error;
    throw error;
  }
  throw new Error("expected an ApiError");
}

describe("ZodValidationPipe (barch §12)", () => {
  it("returns parsed (trimmed) data", () => {
    expect(
      new ZodValidationPipe(loginSchema).transform({ email: " a@b.co ", password: "x" }, meta),
    ).toEqual({
      email: "a@b.co",
      password: "x",
    });
  });

  it("reports req §28 field messages as VALIDATION", () => {
    const error = errorOf(() =>
      new ZodValidationPipe(signupSchema).transform(
        { name: "", email: "nope", password: "short", confirmPassword: "other" },
        meta,
      ),
    );
    expect(error.code).toBe("VALIDATION");
    expect(error.details.fields).toMatchObject({
      email: "Please enter a valid email address.",
      password: "Password must be at least 8 characters and include a letter and a number.",
    });
  });

  it("uses INVALID_ADDRESS for address input", () => {
    const error = errorOf(() =>
      new ZodValidationPipe(addressSchema, "INVALID_ADDRESS").transform(
        {
          fullName: "J",
          phone: "12345",
          line1: "1",
          city: "B",
          state: "Karnataka",
          postalCode: "000000",
          country: "India",
        },
        meta,
      ),
    );
    expect(error.code).toBe("INVALID_ADDRESS");
    expect(error.details.fields).toEqual({
      phone: "Please enter a valid 10-digit mobile number.",
      postalCode: "Please enter a valid 6-digit PIN code.",
    });
  });

  it("rejects a missing body", () => {
    expect(
      errorOf(() => new ZodValidationPipe(loginSchema).transform(undefined, meta)).details.fields,
    ).toHaveProperty("form");
  });
});
