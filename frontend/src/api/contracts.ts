import type { InfoPage } from "@/data/infoPages";
import type {
  Address,
  AddressInput,
  CartView,
  Category,
  CheckoutView,
  CollectionId,
  DeliveryOption,
  LoginInput,
  Order,
  OrderSummary,
  Product,
  ProductListResult,
  ProductQuery,
  ProductSummary,
  ProfileInput,
  SignupInput,
  StockAdjustments,
  User,
} from "@/domain/types";

/*
 * Data-layer contracts (docs/architecture.md §7.1). Phase 1 implements them with mock
 * adapters; Phase 2 adds HTTP adapters with the same signatures. Every method is async.
 * Customer-data methods resolve the current user internally (callers never pass user ids).
 */

export type { InfoPage };

// ── Server side (catalog and static content) ─────────────────────────

export type CatalogApi = {
  getCategories(): Promise<Category[]>;
  listProducts(query: ProductQuery): Promise<ProductListResult>;
  getProduct(slug: string): Promise<Product | null>;
  getCollection(id: CollectionId, limit?: number): Promise<ProductSummary[]>;
  getAllProductSlugs(): Promise<string[]>;
};

export type ContentApi = {
  getInfoPage(slug: string): Promise<InfoPage | null>;
};

// ── Client side (customer data) ──────────────────────────────────────

/** A product with live stock per variant, for purchase UI in the browser. */
export type PurchasableProduct = Product & { available: Record<string, number> };

export type ClientCatalogApi = {
  getProduct(slug: string): Promise<PurchasableProduct | null>;
};

export type InventoryApi = {
  getAdjustments(): Promise<StockAdjustments>;
};

export type AuthResult = { user: User; mergedSavedItems: boolean };

export type AuthApi = {
  getSession(): Promise<User | null>;
  login(input: LoginInput): Promise<AuthResult>;
  signup(input: SignupInput): Promise<AuthResult>;
  logout(): Promise<void>;
};

export type CartApi = {
  getCart(): Promise<CartView>;
  addItem(input: { variantId: string; quantity: number }): Promise<CartView>;
  updateQuantity(variantId: string, quantity: number): Promise<CartView>;
  removeItem(variantId: string): Promise<CartView>;
};

export type WishlistApi = {
  getWishlist(): Promise<ProductSummary[]>;
  add(productId: string): Promise<void>;
  remove(productId: string): Promise<void>;
  moveToCart(input: { productId: string; variantId: string }): Promise<void>;
};

export type AddressApi = {
  list(): Promise<Address[]>;
  create(input: AddressInput): Promise<Address>;
  update(id: string, input: AddressInput): Promise<Address>;
  remove(id: string): Promise<void>;
  setDefault(id: string): Promise<void>;
};

export type CheckoutApi = {
  startBuyNow(input: { variantId: string; quantity: number }): Promise<void>;
  startCartCheckout(): Promise<void>;
  getCheckout(deliveryOption: DeliveryOption): Promise<CheckoutView>;
  placeOrder(input: { addressId: string; deliveryOption: DeliveryOption }): Promise<Order>;
};

export type OrderApi = {
  list(): Promise<OrderSummary[]>;
  get(orderId: string): Promise<Order>;
  cancel(orderId: string): Promise<Order>;
};

export type ProfileApi = {
  get(): Promise<User>;
  update(input: ProfileInput): Promise<User>;
};

export type ClientApi = {
  catalog: ClientCatalogApi;
  inventory: InventoryApi;
  auth: AuthApi;
  cart: CartApi;
  wishlist: WishlistApi;
  addresses: AddressApi;
  checkout: CheckoutApi;
  orders: OrderApi;
  profile: ProfileApi;
};
