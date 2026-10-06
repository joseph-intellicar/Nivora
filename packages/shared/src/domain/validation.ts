import { z } from "zod";
import { INDIAN_STATES } from "../config/indianStates";
import type { AddressInput, LoginInput, ProfileInput, SignupInput } from "./types";

/**
 * Shared validation (arch §15): used by forms (React Hook Form + zodResolver) and by the
 * data layer, so client and "server" rules cannot drift. Messages follow requirements §28.
 */

const required = (message: string) => z.string().trim().min(1, message);

export const MOBILE_PATTERN = /^[6-9]\d{9}$/;
export const PIN_PATTERN = /^[1-9]\d{5}$/;
export const PASSWORD_RULE_MESSAGE =
  "Password must be at least 8 characters and include a letter and a number.";

export const emailSchema = required("Please enter your email.").pipe(
  z.email("Please enter a valid email address."),
);

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Please enter your password."),
}) satisfies z.ZodType<LoginInput>;

export const passwordSchema = z
  .string()
  .min(1, "Please enter a password.")
  .refine(
    (value) => value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value),
    PASSWORD_RULE_MESSAGE,
  );

export const signupSchema = z
  .object({
    name: required("Please enter your name.").max(60, "Please use 60 characters or fewer."),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match.",
    path: ["confirmPassword"],
  }) satisfies z.ZodType<SignupInput>;

const mobileSchema = z
  .string()
  .trim()
  .min(1, "Please enter a mobile number.")
  .regex(MOBILE_PATTERN, "Please enter a valid 10-digit mobile number.");

export const addressSchema = z.object({
  fullName: required("Please enter the full name.").max(60, "Please use 60 characters or fewer."),
  phone: mobileSchema,
  line1: required("Please enter the address."),
  line2: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined)),
  city: required("Please enter the city."),
  state: z.enum(INDIAN_STATES, { error: "Please select a state." }),
  postalCode: z
    .string()
    .trim()
    .min(1, "Please enter the PIN code.")
    .regex(PIN_PATTERN, "Please enter a valid 6-digit PIN code."),
  country: z.literal("India", { error: "Nivora delivers within India only." }),
}) satisfies z.ZodType<AddressInput>;

export const profileSchema = z.object({
  name: required("Please enter your name.").max(60, "Please use 60 characters or fewer."),
  phone: z
    .string()
    .trim()
    .optional()
    .transform((value) => (value ? value : undefined))
    .refine((value) => value === undefined || MOBILE_PATTERN.test(value), {
      error: "Please enter a valid 10-digit mobile number.",
    }),
}) satisfies z.ZodType<ProfileInput>;

// ── Data-layer inputs ────────────────────────────────────────────────

export const quantitySchema = z
  .number({ error: "Please choose a valid quantity." })
  .int("Please choose a valid quantity.")
  .min(1, "Please choose a valid quantity.");

export const cartItemInputSchema = z.object({
  variantId: z.string().min(1),
  quantity: quantitySchema,
});

export const deliveryOptionSchema = z.enum(["standard", "express"]);
