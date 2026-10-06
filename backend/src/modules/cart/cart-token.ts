import { hashToken, isWellFormedToken, newSessionToken } from "../auth/session-token.js";

/** Anonymous guest-cart cookie (barch §9): random token, stored hashed like session tokens. */
export const CART_COOKIE = "nivora_cart";
export const newCartToken = newSessionToken;
export const hashCartToken = hashToken;
export const isWellFormedCartToken = isWellFormedToken;
