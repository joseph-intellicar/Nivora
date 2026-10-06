import { mergeCarts } from "@nivora/shared/domain/cart";
import { loginSchema, signupSchema } from "@nivora/shared/domain/validation";
import { createId } from "@/lib/ids";
import type { AuthApi, AuthResult } from "@nivora/shared/contracts";
import { ApiError } from "@nivora/shared/errors";
import { readLines, writeLines } from "./cartStore";
import { loadCatalog } from "./catalogData";
import { available, readAdjustments } from "./inventory";
import { request } from "./latency";
import type { CheckoutSessionRecord, StoredUser } from "./records";
import { currentUser, endSession, readUsers, startSession, toPublicUser } from "./session";
import { isRecord, KEYS, read, write } from "./storage";
import { validate } from "@nivora/shared/validate";

/** Folds the guest cart into the user's saved cart and empties the guest cart (req §17.5). */
async function mergeGuestCart(userId: string): Promise<boolean> {
  const guest = readLines(null);
  const saved = readLines(userId);
  if (guest.length === 0) return false;
  const { variants } = await loadCatalog();
  const adjustments = readAdjustments();
  const { lines, mergedSavedItems } = mergeCarts(saved, guest, (variantId) => {
    const entry = variants.get(variantId);
    return entry ? available(entry.variant, adjustments) : 0;
  });
  writeLines(userId, lines);
  writeLines(null, []);
  return mergedSavedItems && saved.length > 0;
}

async function signIn(user: StoredUser): Promise<AuthResult> {
  startSession(user.id);
  const mergedSavedItems = await mergeGuestCart(user.id);
  return { user: toPublicUser(user), mergedSavedItems };
}

export const mockAuth: AuthApi = {
  getSession: () =>
    request(() => {
      const user = currentUser();
      return user ? toPublicUser(user) : null;
    }),

  login: (input) =>
    request(async () => {
      const { email, password } = validateLogin(input);
      const user = readUsers().find(
        (candidate) =>
          candidate.email.toLowerCase() === email.toLowerCase() && candidate.password === password,
      );
      if (!user) throw new ApiError("INVALID_CREDENTIALS");
      return signIn(user);
    }),

  signup: (input) =>
    request(async () => {
      const data = validateSignup(input);
      const users = readUsers();
      const email = data.email.toLowerCase();
      if (users.some((user) => user.email.toLowerCase() === email)) {
        throw new ApiError("EMAIL_TAKEN", {
          fields: { email: "An account with this email already exists. Try logging in." },
        });
      }
      const user: StoredUser = {
        id: createId("user"),
        name: data.name,
        email,
        password: data.password,
        createdAt: new Date().toISOString(),
      };
      write(KEYS.users, [...users, user]);
      return signIn(user);
    }),

  logout: () =>
    request(() => {
      const user = currentUser();
      endSession();
      if (user) {
        // Only the session and a pending Buy Now are cleared; all other data stays (req §27).
        const sessions = read<CheckoutSessionRecord>(KEYS.checkoutSession, {}, isRecord);
        delete sessions[user.id];
        write(KEYS.checkoutSession, sessions);
      }
    }),
};

function validateLogin(input: unknown) {
  const result = loginSchema.safeParse(input);
  if (!result.success) throw new ApiError("INVALID_CREDENTIALS");
  return result.data;
}

function validateSignup(input: unknown) {
  return validate(signupSchema, input);
}
