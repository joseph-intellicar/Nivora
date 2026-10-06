import type { ApiErrorCode, ApiErrorDetails } from "@nivora/shared/errors";

/** HTTP status for each error code (barch §7). */
const STATUS: Record<ApiErrorCode, number> = {
  VALIDATION: 400,
  INVALID_QUANTITY: 400,
  INVALID_VARIANT: 400,
  VARIANT_REQUIRED: 400,
  INVALID_ADDRESS: 422,
  UNAUTHENTICATED: 401,
  INVALID_CREDENTIALS: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  EMAIL_TAKEN: 409,
  OUT_OF_STOCK: 409,
  INSUFFICIENT_STOCK: 409,
  EMPTY_CART: 409,
  ADDRESS_REQUIRED: 409,
  ORDER_NOT_CANCELLABLE: 409,
  RATE_LIMITED: 429,
  UNKNOWN: 500,
};

/** Field errors are 422 (the request was understood, some values are wrong). */
export function statusFor(code: ApiErrorCode, details: ApiErrorDetails = {}): number {
  if (code === "VALIDATION" && details.fields && Object.keys(details.fields).length > 0) return 422;
  return STATUS[code];
}
