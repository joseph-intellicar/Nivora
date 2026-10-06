import { isApiError, type ApiErrorCode, type ApiErrorDetails } from "./errors";

/**
 * Customer-facing wording for every error code (requirements §28). Shared by the API, which puts
 * it in the error envelope, and the UI. Never shows technical details; unknown errors get a
 * friendly fallback.
 */
const MESSAGES: Record<ApiErrorCode, (details: ApiErrorDetails) => string> = {
  VALIDATION: () => "Please check the highlighted details and try again.",
  UNAUTHENTICATED: () => "Please log in to continue.",
  FORBIDDEN: () => "This request isn't allowed. Please refresh the page and try again.",
  NOT_FOUND: ({ entity }) =>
    entity === "product"
      ? "This product is no longer available."
      : entity === "order"
        ? "We couldn't find that order."
        : entity === "address"
          ? "We couldn't find that address."
          : "We couldn't find what you were looking for.",
  INVALID_CREDENTIALS: () => "Incorrect email or password.",
  EMAIL_TAKEN: () => "An account with this email already exists. Try logging in.",
  VARIANT_REQUIRED: ({ option }) => `Please select a ${option ? option.toLowerCase() : "option"}.`,
  INVALID_VARIANT: () => "This product is no longer available.",
  OUT_OF_STOCK: ({ productName }) =>
    productName
      ? `${productName} is currently out of stock.`
      : "This item is currently out of stock.",
  INSUFFICIENT_STOCK: ({ available, productName }) => {
    if (available === undefined) return "There isn't enough stock for that quantity.";
    if (available === 0) return "You already have all available stock in your cart.";
    return productName
      ? `Only ${available} ${available === 1 ? "unit" : "units"} of ${productName} ${available === 1 ? "is" : "are"} available. Please update the quantity.`
      : `Only ${available} left in stock.`;
  },
  INVALID_QUANTITY: () => "Please choose a valid quantity.",
  EMPTY_CART: () => "Your cart is empty.",
  ADDRESS_REQUIRED: () => "Please add or select a delivery address.",
  INVALID_ADDRESS: () => "Please check the delivery address and try again.",
  ORDER_NOT_CANCELLABLE: () => "This order can no longer be cancelled.",
  RATE_LIMITED: () => "Too many attempts. Please wait a moment and try again.",
  UNKNOWN: () => "Something went wrong. Please try again.",
};

export function messageFor(code: ApiErrorCode, details: ApiErrorDetails = {}): string {
  return MESSAGES[code](details);
}

/** Message for any thrown value. */
export function getErrorMessage(error: unknown): string {
  return isApiError(error) ? messageFor(error.code, error.details) : MESSAGES.UNKNOWN({});
}
