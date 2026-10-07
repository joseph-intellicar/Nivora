import type { AuthResult, ClientApi, PurchasableProduct } from "@nivora/shared/contracts";
import type {
  Address,
  CartView,
  CheckoutView,
  Order,
  OrderSummary,
  ProductSummary,
  User,
} from "@nivora/shared/domain/types";
import { ApiError } from "@nivora/shared/errors";
import { apiFetch, newIdempotencyKey, orNull } from "./client";

/*
 * Browser-side adapters over HTTP (barch §17): the same contracts as the mock adapters, so
 * components and TanStack Query keys don't change. Cookies travel with every call.
 */

const id = (value: string) => encodeURIComponent(value);

/**
 * Place Order idempotency (barch §11): one key per order attempt. Concurrent calls (double
 * click) share one request; a retry after a network failure reuses the key, so the server
 * returns the order instead of creating a second one. The key is dropped once the server answers.
 */
let pendingOrder: { signature: string; key: string; inFlight?: Promise<Order> } | null = null;

function placeOrder(input: { addressId: string; deliveryOption: string }): Promise<Order> {
  const signature = JSON.stringify(input);
  if (pendingOrder?.signature !== signature) pendingOrder = { signature, key: newIdempotencyKey() };
  const attempt = pendingOrder;
  attempt.inFlight ??= apiFetch<Order>("/orders", {
    method: "POST",
    body: input,
    headers: { "Idempotency-Key": attempt.key },
  })
    .then((order) => {
      if (pendingOrder === attempt) pendingOrder = null;
      return order;
    })
    .catch((error: unknown) => {
      attempt.inFlight = undefined;
      // The server answered (validation, stock…): nothing was created, start fresh next time.
      if (error instanceof ApiError && error.code !== "UNKNOWN" && pendingOrder === attempt)
        pendingOrder = null;
      throw error;
    });
  return attempt.inFlight;
}

export const httpApi: ClientApi = {
  catalog: {
    getProduct: (slug) => orNull(apiFetch<PurchasableProduct>(`/products/${id(slug)}`)),
  },

  // Stock comes from the API itself in http mode: there is no browser-side overlay (P2-032).
  inventory: { getAdjustments: async () => ({}) },

  auth: {
    getSession: async () => (await apiFetch<{ user: User | null }>("/auth/session")).user,
    login: (input) => apiFetch<AuthResult>("/auth/login", { method: "POST", body: input }),
    signup: (input) => apiFetch<AuthResult>("/auth/signup", { method: "POST", body: input }),
    logout: () => apiFetch<void>("/auth/logout", { method: "POST" }),
  },

  cart: {
    getCart: () => apiFetch<CartView>("/cart"),
    addItem: (input) => apiFetch<CartView>("/cart/items", { method: "POST", body: input }),
    updateQuantity: (variantId, quantity) =>
      apiFetch<CartView>(`/cart/items/${id(variantId)}`, { method: "PATCH", body: { quantity } }),
    removeItem: (variantId) =>
      apiFetch<CartView>(`/cart/items/${id(variantId)}`, { method: "DELETE" }),
  },

  wishlist: {
    getWishlist: () => apiFetch<ProductSummary[]>("/wishlist"),
    add: (productId) => apiFetch<void>(`/wishlist/${id(productId)}`, { method: "PUT" }),
    remove: (productId) => apiFetch<void>(`/wishlist/${id(productId)}`, { method: "DELETE" }),
    moveToCart: ({ productId, variantId }) =>
      apiFetch<void>(`/wishlist/${id(productId)}/move-to-cart`, {
        method: "POST",
        body: { variantId },
      }),
  },

  addresses: {
    list: () => apiFetch<Address[]>("/addresses"),
    create: (input) => apiFetch<Address>("/addresses", { method: "POST", body: input }),
    update: (addressId, input) =>
      apiFetch<Address>(`/addresses/${id(addressId)}`, { method: "PUT", body: input }),
    remove: (addressId) => apiFetch<void>(`/addresses/${id(addressId)}`, { method: "DELETE" }),
    setDefault: (addressId) =>
      apiFetch<void>(`/addresses/${id(addressId)}/default`, { method: "POST" }),
  },

  checkout: {
    startBuyNow: (input) => apiFetch<void>("/checkout/buy-now", { method: "POST", body: input }),
    startCartCheckout: () => apiFetch<void>("/checkout/cart", { method: "POST" }),
    getCheckout: (deliveryOption) =>
      apiFetch<CheckoutView>(`/checkout?deliveryOption=${encodeURIComponent(deliveryOption)}`),
    placeOrder,
  },

  orders: {
    list: () => apiFetch<OrderSummary[]>("/orders"),
    get: (orderId) => apiFetch<Order>(`/orders/${id(orderId)}`),
    cancel: (orderId) => apiFetch<Order>(`/orders/${id(orderId)}/cancel`, { method: "POST" }),
  },

  profile: {
    get: () => apiFetch<User>("/me"),
    update: (input) => apiFetch<User>("/me", { method: "PATCH", body: input }),
  },
};
