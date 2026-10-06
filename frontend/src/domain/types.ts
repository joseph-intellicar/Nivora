/**
 * Nivora domain model (docs/architecture.md §6). Pure types, shared by server and client code.
 * Money is always whole rupees. Every product has at least one variant.
 */

// ── Catalog ──────────────────────────────────────────────────────────

export type CategoryId = "fashion" | "home-appliances" | "beauty" | "toys" | "mobiles";

export type Subcategory = {
  /** Globally unique, e.g. "fashion-men". */
  id: string;
  categoryId: CategoryId;
  /** Unique within its category, used in URLs: /c/fashion/men. */
  slug: string;
  name: string;
};

export type Category = {
  id: CategoryId;
  /** URL slug; equal to the id. */
  slug: CategoryId;
  name: string;
  description: string;
  subcategories: Subcategory[];
};

export type CollectionId = "best-sellers" | "special-offers" | "new-arrivals";

export type Collection = {
  id: CollectionId;
  slug: CollectionId;
  name: string;
  description: string;
  defaultSort: SortOption;
};

/** e.g. { name: "Size", values: ["S", "M", "L"] }. */
export type ProductOption = { name: string; values: string[] };

export type Variant = {
  /** Stable, e.g. "fa-men-oxford-shirt-blue-m". Identifies cart lines and order items. */
  id: string;
  /** One value per product option; {} for a product without options. */
  optionValues: Record<string, string>;
  price: number;
  originalPrice: number;
  initialStock: number;
};

export type Specification = { label: string; value: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  categoryId: CategoryId;
  subcategoryId: string;
  description: string;
  /** External stock-photo URLs (decision D2); the first is the main image. */
  images: string[];
  rating: number;
  reviewCount: number;
  specifications: Specification[];
  options: ProductOption[];
  /** Always at least one. */
  variants: Variant[];
  /** Filterable attributes that are not variant options (capacity, energyRating, ageGroup, …). */
  attributes: Record<string, string | string[]>;
  tags: string[];
  isBestSeller: boolean;
  isNewArrival: boolean;
  /** ISO date the product was added; drives "Newest". */
  createdAt: string;
};

/** What a product card needs (computed from a Product). */
export type ProductSummary = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  categoryId: CategoryId;
  subcategoryId: string;
  image: string;
  rating: number;
  reviewCount: number;
  /** Lowest in-stock variant price (decision D14). */
  price: number;
  originalPrice: number;
  discountPercent: number;
  /** True when variants have different prices (card shows "From ₹X"). */
  hasPriceRange: boolean;
  /** Based on the stock known to the caller (initial stock on the server). */
  inStock: boolean;
  /** True when the customer must choose options before buying. */
  requiresOptions: boolean;
  /** Set when the product has exactly one variant (direct Add to Cart). */
  singleVariantId: string | null;
  variantIds: string[];
  /** Initial stock per variant; with stock adjustments this gives live availability (arch §3.1). */
  initialStock: Record<string, number>;
  isBestSeller: boolean;
  isNewArrival: boolean;
  createdAt: string;
};

// ── Listing queries ──────────────────────────────────────────────────

export type SortOption =
  "relevance" | "price-asc" | "price-desc" | "rating" | "newest" | "discount";

export type ProductQuery = {
  categoryId?: CategoryId;
  /** Narrow to one or more subcategories (single on category pages, multiple on search). */
  subcategoryIds?: string[];
  /** Narrow to one or more categories (search results). */
  categoryIds?: CategoryId[];
  collection?: CollectionId;
  q?: string;
  brands?: string[];
  priceMin?: number;
  priceMax?: number;
  minRating?: number;
  minDiscount?: number;
  inStockOnly?: boolean;
  /** Variant options and attributes by filter key: { size: ["M"], ram: ["8 GB"] }. */
  attributes?: Record<string, string[]>;
  sort: SortOption;
  /** 1-based. */
  page: number;
};

export type FacetOption = { value: string; label: string; count: number };

export type PriceBand = { min: number; max: number | null; label: string; count: number };

export type Facets = {
  categories: FacetOption[];
  subcategories: FacetOption[];
  brands: FacetOption[];
  price: { min: number; max: number; bands: PriceBand[] } | null;
  ratings: FacetOption[];
  discounts: FacetOption[];
  availability: { inStock: number; total: number };
  /** Keyed by filter key (size, color, ram, storage, capacity, …). */
  attributes: Record<string, FacetOption[]>;
};

export type ProductListResult = {
  items: ProductSummary[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  facets: Facets;
};

/** Stock adjustments keyed by variant id (negative = sold). Phase 1: from localStorage. */
export type StockAdjustments = Record<string, number>;

// ── Cart and pricing ─────────────────────────────────────────────────

export type CartLine = { variantId: string; productId: string; quantity: number };

export type CartIssueType = "unavailable" | "out_of_stock" | "insufficient_stock";

export type CartIssue = {
  type: CartIssueType;
  variantId: string;
  productName: string;
  /** Units available now (for insufficient stock). */
  available?: number;
};

export type DeliveryOption = "standard" | "express";

export type PriceSummary = {
  /** Total units. */
  itemCount: number;
  /** Σ original price × quantity (MRP). */
  subtotal: number;
  /** Σ (original − current) × quantity. */
  discount: number;
  deliveryOption: DeliveryOption;
  deliveryCharge: number;
  /** subtotal − discount + deliveryCharge. */
  total: number;
};

/** A cart or checkout line resolved against product data. */
export type ResolvedLine = {
  variantId: string;
  productId: string;
  productSlug: string;
  productName: string;
  brand: string;
  image: string;
  /** Selected option values, e.g. { Color: "Black", Size: "L" }. */
  options: Record<string, string>;
  quantity: number;
  unitPrice: number;
  unitOriginalPrice: number;
  lineTotal: number;
  /** Effective stock available for this variant. */
  available: number;
  issue: CartIssue | null;
};

export type CartView = {
  lines: ResolvedLine[];
  issues: CartIssue[];
  /** Lines removed because their product no longer exists. */
  removed: CartIssue[];
  summary: PriceSummary;
};

export type CheckoutSource = "cart" | "buy_now";

export type CheckoutView = {
  source: CheckoutSource;
  lines: ResolvedLine[];
  issues: CartIssue[];
  summary: PriceSummary;
};

// ── Customers ────────────────────────────────────────────────────────

export type User = { id: string; name: string; email: string; phone?: string };

export type Address = {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: "India";
  isDefault: boolean;
};

export type AddressInput = Omit<Address, "id" | "isDefault">;

export type LoginInput = { email: string; password: string };
export type SignupInput = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};
export type ProfileInput = { name: string; phone?: string };

// ── Orders ───────────────────────────────────────────────────────────

export type OrderStatus = "Placed" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";

export type PaymentMethod = "Cash on Delivery";

/** Snapshot of a purchased line at order time (requirements §24.2). */
export type OrderItem = {
  productId: string;
  variantId: string;
  productSlug: string;
  productName: string;
  brand: string;
  image: string;
  options: Record<string, string>;
  quantity: number;
  unitPrice: number;
  unitOriginalPrice: number;
  /** (unitOriginalPrice − unitPrice) × quantity. */
  discount: number;
  lineTotal: number;
};

export type Order = {
  orderId: string;
  customerId: string;
  orderDate: string;
  source: CheckoutSource;
  items: OrderItem[];
  /** MRP total. */
  subtotal: number;
  discount: number;
  deliveryOption: DeliveryOption;
  deliveryCharge: number;
  total: number;
  deliveryAddress: AddressInput;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  statusHistory: Array<{ status: OrderStatus; at: string }>;
  /** Seeded sample order (requirements §25.5): never changes stock. */
  isSample?: boolean;
};

export type OrderSummary = {
  orderId: string;
  orderDate: string;
  status: OrderStatus;
  total: number;
  paymentMethod: PaymentMethod;
  itemCount: number;
  firstItem: { productName: string; image: string };
  otherItemsCount: number;
};
