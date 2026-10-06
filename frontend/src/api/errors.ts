/** Typed data-layer errors (arch §7.3). The UI maps codes to customer wording (lib/errorMessages). */
export type ApiErrorCode =
  | "VALIDATION"
  | "UNAUTHENTICATED"
  | "NOT_FOUND"
  | "INVALID_CREDENTIALS"
  | "EMAIL_TAKEN"
  | "VARIANT_REQUIRED"
  | "INVALID_VARIANT"
  | "OUT_OF_STOCK"
  | "INSUFFICIENT_STOCK"
  | "INVALID_QUANTITY"
  | "EMPTY_CART"
  | "ADDRESS_REQUIRED"
  | "INVALID_ADDRESS"
  | "ORDER_NOT_CANCELLABLE"
  | "UNKNOWN";

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
