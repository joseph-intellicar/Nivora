import { addressSchema, loginSchema, signupSchema } from "../domain/validation";
import { getErrorMessage, messageFor } from "../errorMessages";
import { API_ERROR_CODES, ApiError, fromErrorEnvelope, isApiErrorCode } from "../errors";
import { fieldErrors, validate } from "../validate";

const address = {
  fullName: "J",
  phone: "9876543210",
  line1: "1",
  city: "B",
  state: "Karnataka",
  postalCode: "560038",
  country: "India",
};
const firstFieldMessage = (fn: () => unknown) => {
  try {
    fn();
  } catch (error) {
    return Object.values((error as ApiError).details.fields ?? {})[0];
  }
  return undefined;
};

describe("customer messages (req §28)", () => {
  it.each([
    ["Invalid login", messageFor("INVALID_CREDENTIALS"), "Incorrect email or password."],
    [
      "Existing signup email",
      messageFor("EMAIL_TAKEN"),
      "An account with this email already exists. Try logging in.",
    ],
    ["Invalid quantity", messageFor("INVALID_QUANTITY"), "Please choose a valid quantity."],
    [
      "Required variant not selected",
      messageFor("VARIANT_REQUIRED", { option: "Size" }),
      "Please select a size.",
    ],
    ["Out of stock", messageFor("OUT_OF_STOCK"), "This item is currently out of stock."],
    [
      "Insufficient stock",
      messageFor("INSUFFICIENT_STOCK", { available: 3 }),
      "Only 3 left in stock.",
    ],
    [
      "Checkout without an address",
      messageFor("ADDRESS_REQUIRED"),
      "Please add or select a delivery address.",
    ],
    ["Empty cart checkout", messageFor("EMPTY_CART"), "Your cart is empty."],
    [
      "Invalid product/variant",
      messageFor("INVALID_VARIANT"),
      "This product is no longer available.",
    ],
    ["Protected feature as guest", messageFor("UNAUTHENTICATED"), "Please log in to continue."],
  ])("%s", (_, got, want) => {
    expect(got).toBe(want);
  });

  it("names the product for insufficient stock (req §24.1 example)", () => {
    expect(messageFor("INSUFFICIENT_STOCK", { available: 2, productName: "Aurora Sneakers" })).toBe(
      "Only 2 units of Aurora Sneakers are available. Please update the quantity.",
    );
  });

  it("has a friendly message for every code, with no technical text", () => {
    for (const code of API_ERROR_CODES) {
      const message = messageFor(code);
      expect(message).toBeTruthy();
      expect(message).not.toMatch(/undefined|null|error|exception|[A-Z]{2,}_[A-Z]/);
    }
  });

  it("falls back for anything that is not an ApiError", () => {
    expect(getErrorMessage(new ApiError("OUT_OF_STOCK", { productName: "X" }))).toBe(
      "X is currently out of stock.",
    );
    expect(getErrorMessage(new TypeError("Cannot read properties of undefined"))).toBe(
      "Something went wrong. Please try again.",
    );
    expect(getErrorMessage("boom")).toBe("Something went wrong. Please try again.");
  });

  it("recognises error codes", () => {
    expect(isApiErrorCode("RATE_LIMITED")).toBe(true);
    expect(isApiErrorCode("TEAPOT")).toBe(false);
  });
});

describe("validate (field errors for forms)", () => {
  it("returns parsed data on success", () => {
    expect(validate(loginSchema, { email: " a@b.co ", password: "x" }).email).toBe("a@b.co");
  });

  it("throws VALIDATION with the first message per field", () => {
    expect(
      firstFieldMessage(() =>
        validate(signupSchema, {
          name: "A",
          email: "a@b.co",
          password: "password123",
          confirmPassword: "x",
        }),
      ),
    ).toBe("Passwords do not match.");
    expect(firstFieldMessage(() => validate(loginSchema, { email: "", password: "x" }))).toBe(
      "Please enter your email.",
    );
    expect(firstFieldMessage(() => validate(loginSchema, { email: "nope", password: "x" }))).toBe(
      "Please enter a valid email address.",
    );
  });

  it("uses INVALID_ADDRESS for address forms", () => {
    let error: unknown;
    try {
      validate(addressSchema, { ...address, postalCode: "12" }, "INVALID_ADDRESS");
    } catch (caught) {
      error = caught;
    }
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).code).toBe("INVALID_ADDRESS");
    expect((error as ApiError).details.fields).toEqual({
      postalCode: "Please enter a valid 6-digit PIN code.",
    });
  });

  it("puts whole-object errors under 'form'", () => {
    const result = loginSchema.safeParse("not an object");
    expect(Object.keys(fieldErrors(result.error!))).toEqual(["form"]);
  });
});

describe("fromErrorEnvelope (API error envelope → ApiError)", () => {
  it("keeps the code and details", () => {
    const error = fromErrorEnvelope({
      error: {
        code: "INSUFFICIENT_STOCK",
        message: "Only 2 left in stock.",
        details: { available: 2, productName: "X" },
      },
    });
    expect(error).toBeInstanceOf(ApiError);
    expect(error.code).toBe("INSUFFICIENT_STOCK");
    expect(error.details).toEqual({ available: 2, productName: "X" });
    expect(getErrorMessage(error)).toBe(
      "Only 2 units of X are available. Please update the quantity.",
    );
  });

  it("keeps field errors for forms", () => {
    const error = fromErrorEnvelope({
      error: {
        code: "INVALID_ADDRESS",
        details: { fields: { postalCode: "Please enter a valid 6-digit PIN code." } },
      },
    });
    expect(error.details.fields).toEqual({ postalCode: "Please enter a valid 6-digit PIN code." });
  });

  it.each([
    undefined,
    null,
    "<html>502</html>",
    {},
    { error: {} },
    { error: { code: "TEAPOT" } },
    { message: "x" },
  ])("turns %p into UNKNOWN", (payload) => {
    expect(fromErrorEnvelope(payload).code).toBe("UNKNOWN");
  });

  it("ignores malformed details", () => {
    expect(fromErrorEnvelope({ error: { code: "NOT_FOUND", details: ["x"] } }).details).toEqual({});
  });
});
