/**
 * Typed data-layer errors (arch §7.3, barch §7). Customer wording for every code lives in
 * `errorMessages` and is used by both the API (error envelope) and the UI.
 */
export const API_ERROR_CODES = [
  "VALIDATION",
  "UNAUTHENTICATED",
  "FORBIDDEN",
  "NOT_FOUND",
  "INVALID_CREDENTIALS",
  "EMAIL_TAKEN",
  "VARIANT_REQUIRED",
  "INVALID_VARIANT",
  "OUT_OF_STOCK",
  "INSUFFICIENT_STOCK",
  "INVALID_QUANTITY",
  "EMPTY_CART",
  "ADDRESS_REQUIRED",
  "INVALID_ADDRESS",
  "ORDER_NOT_CANCELLABLE",
  "RATE_LIMITED",
  "UNKNOWN",
] as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[number];

export type ApiErrorDetails = {
  productName?: string;
  /** Units still available (INSUFFICIENT_STOCK). */
  available?: number;
  /** Missing option name (VARIANT_REQUIRED), e.g. "Size". */
  option?: string;
  /** What was not found (NOT_FOUND). */
  entity?: "product" | "order" | "address" | "page";
  /** Field-level messages (VALIDATION, INVALID_ADDRESS). */
  fields?: Record<string, string>;
};

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly details: ApiErrorDetails;

  constructor(code: ApiErrorCode, details: ApiErrorDetails = {}) {
    super(code);
    this.name = "ApiError";
    this.code = code;
    this.details = details;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isApiErrorCode(value: unknown): value is ApiErrorCode {
  return typeof value === "string" && (API_ERROR_CODES as readonly string[]).includes(value);
}

/**
 * The API's error envelope `{ error: { code, message, details } }` → ApiError (barch §7).
 * Anything else (HTML error page, unknown code, empty body) becomes UNKNOWN.
 */
export function fromErrorEnvelope(payload: unknown): ApiError {
  const error = (payload as { error?: { code?: unknown; details?: unknown } } | null | undefined)
    ?.error;
  if (!error || !isApiErrorCode(error.code)) return new ApiError("UNKNOWN");
  const details =
    error.details && typeof error.details === "object" && !Array.isArray(error.details)
      ? (error.details as ApiErrorDetails)
      : {};
  return new ApiError(error.code, details);
}
