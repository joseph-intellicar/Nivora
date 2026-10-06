import {
  addressSchema,
  cartItemInputSchema,
  loginSchema,
  PASSWORD_RULE_MESSAGE,
  profileSchema,
  signupSchema,
} from "../domain/validation";
import type { z } from "zod";

const messages = (schema: z.ZodType, input: unknown) =>
  schema.safeParse(input).error?.issues.map((issue) => issue.message) ?? [];
const signup = (password: string, confirmPassword = password) => ({
  name: "A",
  email: "a@b.co",
  password,
  confirmPassword,
});
const address = {
  fullName: "Joseph",
  phone: "9876543210",
  line1: "1 St",
  city: "Bengaluru",
  state: "Karnataka",
  postalCode: "560038",
  country: "India",
};

describe("signup and login (req §9, §28)", () => {
  it("accepts a password with a letter and a number, 8+ characters", () => {
    expect(signupSchema.safeParse(signup("password123")).success).toBe(true);
  });

  it.each(["password", "12345678", "abc1", "short"])("rejects weak password %p", (password) => {
    expect(messages(signupSchema, signup(password))).toContain(PASSWORD_RULE_MESSAGE);
  });

  it("explains the password rule and mismatches", () => {
    expect(PASSWORD_RULE_MESSAGE).toBe(
      "Password must be at least 8 characters and include a letter and a number.",
    );
    expect(messages(signupSchema, signup("password123", "password124"))).toContain(
      "Passwords do not match.",
    );
  });

  it("requires and validates login fields, trimming the email", () => {
    expect(messages(loginSchema, { email: "", password: "" })).toEqual([
      "Please enter your email.",
      "Please enter your password.",
    ]);
    expect(messages(loginSchema, { email: "joseph@", password: "x" })[0]).toBe(
      "Please enter a valid email address.",
    );
    expect(loginSchema.parse({ email: " joseph@example.com ", password: "x" }).email).toBe(
      "joseph@example.com",
    );
  });
});

describe("address (req §23)", () => {
  const withOverride = (over: Record<string, string>) => ({ ...address, ...over });

  it("accepts a valid address and drops an empty line 2", () => {
    const parsed = addressSchema.safeParse(withOverride({ line2: "" }));
    expect(parsed.success).toBe(true);
    expect(parsed.data?.line2).toBeUndefined();
  });

  it.each(["000000", "56003", "12"])("rejects PIN code %p", (postalCode) => {
    expect(messages(addressSchema, withOverride({ postalCode }))[0]).toBe(
      "Please enter a valid 6-digit PIN code.",
    );
  });

  it.each(["5123456789", "98765"])("rejects mobile number %p", (phone) => {
    expect(messages(addressSchema, withOverride({ phone }))[0]).toBe(
      "Please enter a valid 10-digit mobile number.",
    );
  });

  it("rejects unknown states, other countries and missing fields", () => {
    expect(messages(addressSchema, withOverride({ state: "Atlantis" }))[0]).toBe(
      "Please select a state.",
    );
    expect(messages(addressSchema, withOverride({ country: "Nepal" }))[0]).toBe(
      "Nivora delivers within India only.",
    );
    expect(messages(addressSchema, withOverride({ fullName: "  ", city: "" }))).toEqual([
      "Please enter the full name.",
      "Please enter the city.",
    ]);
  });
});

describe("profile and cart input", () => {
  it("makes the profile phone optional but validated", () => {
    expect(profileSchema.safeParse({ name: "Joseph", phone: "" }).success).toBe(true);
    expect(messages(profileSchema, { name: "Joseph", phone: "123" })[0]).toBe(
      "Please enter a valid 10-digit mobile number.",
    );
  });

  it("accepts whole quantities of at least 1", () => {
    expect(cartItemInputSchema.safeParse({ variantId: "x", quantity: 2 }).success).toBe(true);
    expect(cartItemInputSchema.safeParse({ variantId: "x", quantity: 0 }).success).toBe(false);
    expect(cartItemInputSchema.safeParse({ variantId: "x", quantity: 1.5 }).success).toBe(false);
  });
});
