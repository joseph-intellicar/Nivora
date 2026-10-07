# Nivora — Frontend Architecture (Phase 1)

|                  |                                                                                           |
| ---------------- | ----------------------------------------------------------------------------------------- |
| **Scope**        | Phase 1: the customer-facing frontend in `frontend/`, using mock data and localStorage    |
| **Requirements** | [`../requirements.md`](../requirements.md); section references like "req §17" point there |
| **Status**       | Agreed stack (§2)                                                                         |
| **Last updated** | 2026-10-06                                                                                |

This document describes how the Phase 1 frontend is built: technologies, rendering strategy, SEO, layers, folder structure, data layer, routing, state management, styling and the main flows. The backend technology and database are **not** covered and remain undecided until Phase 2.

---

## Table of contents

1. [Architecture principles](#1-architecture-principles)
2. [Technology stack](#2-technology-stack)
3. [Rendering strategy (server vs. browser)](#3-rendering-strategy-server-vs-browser)
4. [Layered architecture](#4-layered-architecture)
5. [Folder structure](#5-folder-structure)
6. [Domain model](#6-domain-model)
7. [Data layer (contracts and mock adapters)](#7-data-layer-contracts-and-mock-adapters)
8. [Persistence (localStorage)](#8-persistence-localstorage)
9. [Routing](#9-routing)
10. [SEO](#10-seo)
11. [State management](#11-state-management)
12. [Authentication and protected actions](#12-authentication-and-protected-actions)
13. [Catalog: listing, filters, sorting and search](#13-catalog-listing-filters-sorting-and-search)
14. [Cart, Buy Now, checkout and orders](#14-cart-buy-now-checkout-and-orders)
15. [Forms and validation](#15-forms-and-validation)
16. [Error handling](#16-error-handling)
17. [UI system, styling and responsiveness](#17-ui-system-styling-and-responsiveness)
18. [Accessibility](#18-accessibility)
19. [Performance](#19-performance)
20. [Code conventions and quality](#20-code-conventions-and-quality)
21. [Phase 2 migration path](#21-phase-2-migration-path)
22. [Implementation plan](#22-implementation-plan)
23. [Open items](#23-open-items)

---

## 1. Architecture principles

1. **SEO-ready by design.** Public shopping pages (Home, categories, collections, products, info pages) are rendered on the server with complete HTML and metadata (§3, §10).
2. **The UI never touches storage.** Components and hooks call a typed data layer. Only the mock adapter's storage module may use `localStorage` (req §5.1).
3. **One contract, swappable implementations.** The data layer is defined as TypeScript interfaces. Phase 1 implements them with _mock adapters_; Phase 2 adds _HTTP adapters_ that call the real backend. Pages and components do not change.
4. **The mock adapter behaves like a server.** It is asynchronous, validates its inputs, enforces business rules (stock, auth, ownership), returns computed totals, and fails with typed error codes.
5. **Business rules live in pure domain functions**: pricing, stock, cart merging, filtering, search and order building. They are not in components.
6. **The URL is the source of truth** for what the user is viewing: category, subcategory, query, filters, sort and page.
7. **Next.js is the frontend only.** It is not used as the backend. Phase 1 has no Route Handlers or Server Actions containing business logic, and the real backend is built separately in `backend/` (req §3).
8. **Few dependencies.** Each library in §2 was agreed with Joseph; adding another needs discussion.

## 2. Technology stack

### 2.1 Agreed

| Concern              | Choice                                                        | Why                                                                                                                 |
| -------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Framework            | **Next.js** (App Router)                                      | Server rendering for SEO and fast first paint; file-based routing, layouts, metadata API, image optimisation, fonts |
| UI library           | **React** (the version bundled with Next.js)                  | Specified in the requirements                                                                                       |
| Language             | **TypeScript** (strict)                                       | Typed models and an explicit data-layer contract make the Phase 2 swap safe                                         |
| Styling              | **Tailwind CSS**                                              | Utility classes driven by Nivora design tokens (§17)                                                                |
| Browser-side data    | **TanStack Query**                                            | Caching, loading/error states and mutations for user data (cart, wishlist, orders, …)                               |
| Client UI state      | **Zustand**                                                   | Toasts, login prompt + pending intent, variant picker (§11)                                                         |
| Forms                | **React Hook Form**                                           | Forms with field-level errors                                                                                       |
| Validation           | **Zod**                                                       | Form and data-layer input schemas; reusable by the backend later                                                    |
| Linting / formatting | **ESLint** (Next.js config + TypeScript rules) + **Prettier** | Code quality; enforces the storage and server/client boundaries (§20)                                               |
| Package manager      | **npm** (with Node.js LTS)                                    | Ships with Node.js; `package-lock.json` is committed                                                                |

Built-in Next.js features used, with no extra packages: `next/link`, `next/navigation`, `next/image`, `next/font`, the Metadata API, `sitemap.ts` / `robots.ts`, and `loading.tsx` / `error.tsx` / `not-found.tsx`.

### 2.2 Not adopted in Phase 1

| Item                                 | Consequence                                                                                        |
| ------------------------------------ | -------------------------------------------------------------------------------------------------- |
| React Router                         | Not needed. Next.js provides routing                                                               |
| Headless UI library (e.g. Radix UI)  | Dialogs, drawers, dropdowns and toasts are built in-house, with their own accessibility work (§18) |
| Icon library                         | In-house SVG icon components (§17.4)                                                               |
| Test frameworks                      | No automated tests yet; verified manually against req §34 (§23)                                    |
| UI kits (MUI etc.), CSS-in-JS, Redux | Not needed                                                                                         |

Exact versions are pinned in `frontend/package.json` at scaffold time, using the latest stable release of each.

## 3. Rendering strategy (server vs. browser)

In Phase 1, the **product catalog** is static data in code, so the server can render it. **Customer data** (session, cart, wishlist, addresses, orders, stock adjustments) lives in the browser's localStorage, so only the browser can read it. This decides where each part of the app renders:

| Area                                                                                              | Rendered                                                                           | How                                                                                               |
| ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| Home, category, subcategory, collection pages                                                     | **Server**                                                                         | Server Components read the catalog; the HTML contains the products                                |
| Product Details                                                                                   | **Server**, pre-generated at build time (`generateStaticParams` for every product) | Product content is in the HTML; the purchase panel is a client component                          |
| Search results                                                                                    | **Server**, rendered per request                                                   | Reads `searchParams`                                                                              |
| Info pages (About, Help, …)                                                                       | **Server**, static                                                                 |                                                                                                   |
| Header search, nav menus, filters UI, wishlist/cart buttons, variant selectors, quantity, gallery | **Browser** (client components)                                                    | Interactive "islands" inside server-rendered pages                                                |
| Cart, Wishlist, Checkout, Order Confirmation, Account, Login, Signup                              | **Browser**                                                                        | Their data is in localStorage. The page shell is server-rendered; the content loads on the client |

Rules:

- Components are **Server Components by default**. A component becomes a client component (`'use client'`) only when it needs state, effects, event handlers or browser APIs.
- Client components that read localStorage-backed data must render a **stable placeholder on the server and first browser render** (e.g. the cart count shows a skeleton), and then fill in after mount. This prevents hydration mismatches.
- Server Components never import client-only modules (`api/client`, `stores`). Client components never import server-only modules (`api/server`). Lint enforces both (§20).

### 3.1 Stock in Phase 1: initial stock vs. effective stock

Orders reduce stock and cancellations restore it (req §24.4), but in Phase 1 those adjustments live in localStorage, which the server cannot see. So:

- **Server-rendered pages** use the catalog's **initial stock** for availability badges, the "In stock only" filter and the out-of-stock-last ordering.
- **In the browser**, an **inventory overlay** (`useInventory()`, a TanStack Query over `inventoryApi`) applies the stored adjustments:
  - product cards and Product Details show the **effective stock** (out-of-stock badges, "Only N left", disabled buttons);
  - quantity limits use the effective stock.
- **Every purchase-critical check uses effective stock**: Add to Cart, cart validation, Buy Now, checkout and place order all run in the browser data layer.

Known Phase 1 limitation: after a customer buys the last unit of something, a server-rendered listing may briefly show it as available until the overlay loads. Server-side filtering by "In stock only" also uses initial stock. This disappears in Phase 2, when the backend owns real stock.

## 4. Layered architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Routes (src/app)            page.tsx / layout.tsx / generateMetadata    │
│  thin: fetch catalog data on the server, compose feature components      │
├──────────────────────────────────────────────────────────────────────────┤
│  Feature components & hooks  src/features/*                              │
│  Server components (ProductGrid, ProductInfo, …)                         │
│  Client components (PurchasePanel, CartView, …) + hooks (useCart, …)     │
├──────────────────────────────┬───────────────────────────────────────────┤
│  api/server (catalog)        │  api/client (customer data)               │
│  catalog contract            │  auth, cart, wishlist, addresses,         │
│  used by Server Components   │  checkout, orders, profile, inventory     │
│                              │  used via TanStack Query in the browser   │
├──────────────────────────────┼───────────────────────────────────────────┤
│  Phase 1: mock catalog       │  Phase 1: mock adapters                   │
│  (pure, reads src/data)      │  (domain rules + storage → localStorage)  │
│  Phase 2: HTTP → backend     │  Phase 2: HTTP → backend                  │
└──────────────────────────────┴───────────────────────────────────────────┘
      Shared: src/domain (types + pure rules), src/lib, src/config
```

**Import rules** (enforced by lint and convention, §20):

| Area                                    | May import                                                              | Must not import                                       |
| --------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------- |
| `app/**` route files                    | `features`, `components`, `api/server`, `domain` types, `config`, `lib` | `api/client`, `api/*/mock`, `data`, `stores` directly |
| `features/**` server components         | `api/server`, `components`, `domain`, `config`, `lib`                   | `api/client`, `stores`, browser APIs                  |
| `features/**` client components & hooks | `api/client`, `stores`, `components`, `domain`, `config`, `lib`         | `api/server`, `api/*/mock`, `data`                    |
| `api/*/mock`                            | `domain`, `data`, `config`, `lib`                                       | React, Next.js, `features`                            |
| `domain`                                | `config`, `lib`                                                         | React, Next.js, `api`, `features`                     |
| `components` (shared UI)                | `lib`, `hooks`                                                          | `features`, `api`                                     |

## 5. Folder structure

> **Phase 2 move (P2-004/P2-005):** `src/domain/*`, `src/config/constants.ts`, `src/config/indianStates.ts`, `src/lib/format.ts` and `features/catalog/listingParams.ts` now live in the shared package [`packages/shared/src`](../packages/shared/src) and are imported as `@nivora/shared/domain/...`, `@nivora/shared/config/...`, `@nivora/shared/lib/format` and `@nivora/shared/domain/listingParams`. Paths below describe the Phase 1 layout; see [`backend-architecture.md`](backend-architecture.md) §3.

> Route files live in `src/app`. There is deliberately **no `src/pages` folder**: Next.js would treat it as the legacy Pages Router.

```
frontend/
├── next.config.ts                  # images.remotePatterns for the stock-photo host
├── package.json
├── tsconfig.json                   # strict; path alias "@/*" → "src/*"
├── eslint.config.mjs
├── .prettierrc
├── postcss.config.mjs              # Tailwind
├── .env.example                    # NEXT_PUBLIC_SITE_URL, NEXT_PUBLIC_DATA_SOURCE=mock,
│                                   # NEXT_PUBLIC_MOCK_LATENCY_MS=250, NEXT_PUBLIC_ALLOW_INDEXING=false
├── public/
│   ├── images/placeholder-product.svg
│   └── og/nivora-default.png       # Default social preview image
└── src/
    ├── app/                                  # ROUTES (§9)
    │   ├── layout.tsx                        # <html>, fonts, global CSS, Providers, default metadata
    │   ├── globals.css                       # Tailwind + design tokens (§17)
    │   ├── not-found.tsx                     # Global 404
    │   ├── global-error.tsx                  # Last-resort error boundary
    │   ├── sitemap.ts                        # §10
    │   ├── robots.ts                         # §10
    │   ├── icon.svg                          # Favicon (Nivora mark)
    │   │
    │   ├── (shop)/                           # Route group: header + nav + footer
    │   │   ├── layout.tsx
    │   │   ├── error.tsx
    │   │   ├── page.tsx                      # Home  /
    │   │   ├── c/[category]/page.tsx         # /c/fashion
    │   │   ├── c/[category]/[subcategory]/page.tsx
    │   │   ├── collections/[collection]/page.tsx
    │   │   ├── search/page.tsx
    │   │   ├── p/[slug]/page.tsx             # Product Details (+ loading.tsx)
    │   │   ├── cart/page.tsx
    │   │   ├── wishlist/page.tsx             # protected (client guard)
    │   │   ├── login/page.tsx                # guest only
    │   │   ├── signup/page.tsx               # guest only
    │   │   ├── account/
    │   │   │   ├── layout.tsx                # Account side-nav + RequireAuth
    │   │   │   ├── page.tsx                  # Profile
    │   │   │   ├── orders/page.tsx
    │   │   │   ├── orders/[orderId]/page.tsx
    │   │   │   └── addresses/page.tsx
    │   │   └── (info)/                       # /about /contact /help /returns /privacy /terms
    │   │       └── [page]/page.tsx           # generateStaticParams over the 6 pages
    │   │
    │   └── (checkout)/                       # Route group: simplified checkout header
    │       ├── layout.tsx                    # + RequireAuth
    │       ├── checkout/page.tsx
    │       └── order-confirmation/[orderId]/page.tsx
    │
    ├── providers/
    │   ├── Providers.tsx                     # 'use client': QueryClientProvider, Toaster, global dialogs
    │   └── queryClient.ts
    │
    ├── features/
    │   ├── auth/
    │   │   ├── components/   # LoginForm, SignupForm, LoginRequiredDialog, AccountMenu,
    │   │   │                 # RequireAuth, GuestOnly
    │   │   ├── hooks/        # useSession, useLogin, useSignup, useLogout, useRequireAuth
    │   │   ├── intent.ts     # PendingIntent + resumeIntent()
    │   │   └── schemas.ts
    │   ├── catalog/
    │   │   ├── components/   # ProductCard (server) + CardActions (client),
    │   │   │                 # ProductGrid, ProductSection, HeroBanner, SubcategoryNav,
    │   │   │                 # FilterPanel / FilterDrawer / ActiveFilterChips / SortSelect (client),
    │   │   │                 # Pagination, ListingHeader, ListingEmptyState
    │   │   ├── hooks/        # useListingParams (client URL updates), useInventory
    │   │   ├── listingParams.ts  # parse/serialise searchParams ⇄ ProductQuery (server + client)
    │   │   └── filterConfig.ts
    │   ├── product/
    │   │   ├── components/   # ImageGallery, ProductInfo, Specifications (server);
    │   │   │                 # PurchasePanel, VariantSelector, QuantitySelector,
    │   │   │                 # StockStatus, VariantPickerDialog (client)
    │   │   └── hooks/        # useVariantSelection
    │   ├── cart/             # components: CartView, CartLineItem, PriceSummary, CartIcon
    │   │                     # hooks: useCart, useAddToCart, useUpdateCartLine, useRemoveCartLine
    │   ├── wishlist/         # WishlistButton, WishlistView; useWishlist, useToggleWishlist, useMoveToCart
    │   ├── checkout/         # CheckoutView, AddressStep, DeliveryOptions, OrderSummary,
    │   │                     # PaymentMethod (COD), PlaceOrderButton, OrderConfirmationView;
    │   │                     # useCheckout, useStartBuyNow, useStartCartCheckout, usePlaceOrder
    │   ├── addresses/        # AddressList, AddressCard, AddressForm; hooks; schemas.ts
    │   ├── orders/           # OrdersView, OrderDetailsView, StatusTimeline, CancelOrderDialog; hooks
    │   ├── profile/          # ProfileForm; hooks; schemas.ts
    │   ├── search/           # SearchBar (client)
    │   └── seo/              # JsonLd component + builders: product, breadcrumbs, website (§10)
    │
    ├── components/
    │   ├── ui/               # Button, IconButton, Input, Select, Checkbox, Radio, Dialog, Drawer,
    │   │                     # Dropdown, Toaster, Badge, Rating, Price, Skeleton, Spinner,
    │   │                     # EmptyState, ErrorState, Breadcrumbs, ProductImage
    │   ├── layout/           # Header, MainNav, MobileMenu, Footer, Container, Logo
    │   └── icons/            # In-house SVG icons
    │
    ├── api/
    │   ├── contracts.ts      # All interfaces (§7)
    │   ├── errors.ts         # ApiError + codes
    │   ├── server/
    │   │   ├── index.ts      # export catalog (mock in Phase 1)
    │   │   └── mock/catalog.ts
    │   └── client/
    │       ├── index.ts      # export api.{auth,cart,…} (mock in Phase 1)
    │       └── mock/
    │           ├── auth.ts  cart.ts  wishlist.ts  addresses.ts  checkout.ts
    │           ├── orders.ts  profile.ts  inventory.ts
    │           ├── session.ts   # Resolve current user for mock "requests"
    │           ├── seed.ts      # One-time seeding: test user + sample orders
    │           ├── latency.ts
    │           └── storage.ts   # ONLY module that touches localStorage (§8)
    │
    ├── domain/               # Pure TypeScript (usable on server and client)
    │   ├── types.ts
    │   ├── pricing.ts  stock.ts  cart.ts  filters.ts  sort.ts  search.ts  orders.ts
    │   └── validation.ts     # Shared Zod schemas for data-layer inputs
    │
    ├── data/                 # Mock data (read-only)
    │   ├── categories.ts  collections.ts  seedOrders.ts  seedUsers.ts  infoPages.ts
    │   └── products/{fashion,homeAppliances,beauty,toys,mobiles,index}.ts
    │
    ├── stores/               # Zustand: toastStore, loginPromptStore, variantPickerStore
    ├── hooks/                # useFocusTrap, useHasMounted
    ├── config/
    │   ├── constants.ts      # Delivery charges, thresholds, page size, …
    │   ├── indianStates.ts   # State/UT list (reference data used by address validation)
    │   ├── site.ts           # Site name, URL, default SEO, indexing flag
    │   └── routes.ts         # paths.category(id), paths.product(slug), …
    └── lib/
        ├── format.ts         # ₹ (en-IN) and dates
        ├── cn.ts
        ├── errorMessages.ts  # ApiError → customer message (§16)
        └── ids.ts
```

**Where new code goes**:

- Rendering for a business feature goes in `features/<feature>`.
- Reusable UI with no business knowledge goes in `components/`.
- Rules about products, money, stock or orders go in `domain/`.
- Reading the catalog goes in `api/server`.
- Reading or writing customer data goes in `api/client`.

## 6. Domain model

Core types in `src/domain/types.ts` (abridged):

```ts
type CategoryId = "fashion" | "home-appliances" | "beauty" | "toys" | "mobiles";

interface Category {
  id: CategoryId;
  name: string;
  description: string;
  subcategories: Subcategory[];
}
interface Subcategory {
  id: string;
  categoryId: CategoryId;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  categoryId: CategoryId;
  subcategoryId: string;
  description: string;
  images: string[]; // external stock-photo URLs (D2)
  rating: number;
  reviewCount: number;
  specifications: { label: string; value: string }[];
  options: ProductOption[]; // [] if none
  variants: Variant[]; // always ≥ 1
  attributes: Record<string, string | string[]>; // capacity, energyRating, ageGroup, …
  tags: string[];
  isBestSeller: boolean;
  isNewArrival: boolean;
  createdAt: string;
}
interface ProductOption {
  name: string;
  values: string[];
} // 'Color' | 'Size' | 'RAM' | 'Storage' | …
interface Variant {
  id: string; // stable, e.g. "p123-blk-l"
  optionValues: Record<string, string>; // {} for the default variant
  price: number;
  originalPrice: number; // whole rupees
  initialStock: number;
}

interface CartLine {
  variantId: string;
  productId: string;
  quantity: number;
}
interface Address {
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
}
interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}
type OrderStatus = "Placed" | "Confirmed" | "Shipped" | "Delivered" | "Cancelled";
interface Order {
  orderId: string;
  customerId: string;
  orderDate: string;
  source: "cart" | "buy_now";
  items: OrderItem[]; // snapshots
  subtotal: number;
  discount: number;
  deliveryOption: "standard" | "express";
  deliveryCharge: number;
  total: number;
  deliveryAddress: Omit<Address, "id" | "isDefault">;
  paymentMethod: "Cash on Delivery";
  status: OrderStatus;
  statusHistory: { status: OrderStatus; at: string }[];
  isSample?: boolean; // seeded orders never touch stock (req §25.5)
}
```

Modelling decisions:

- **Every product has at least one variant**, so price, stock, cart lines and order items follow one code path. A cart line is identified by `variantId` (req §17.2).
- **Money is whole rupees**, formatted with `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`.
- **Listing price** = the lowest in-stock variant price (D14), from `domain/pricing.ts`.
- **Effective stock** = `initialStock + adjustment` (adjustment ≤ 0 after sales) (§3.1, req §24.4).

## 7. Data layer (contracts and mock adapters)

### 7.1 Contracts (`src/api/contracts.ts`)

All methods return Promises. Customer-data methods resolve the current user from the session internally, the way a real API reads a cookie, so callers never pass user IDs.

```ts
// ── Server side: catalog (no customer data) ─────────────────────────
interface CatalogApi {
  getCategories(): Promise<Category[]>;
  listProducts(query: ProductQuery): Promise<ProductListResult>; // items, total, facets, paging
  getProduct(slug: string): Promise<Product | null>;
  getCollection(id: CollectionId, limit?: number): Promise<ProductSummary[]>;
  getAllProductSlugs(): Promise<string[]>; // generateStaticParams, sitemap
}

// ── Client side: customer data ──────────────────────────────────────
interface InventoryApi {
  getAdjustments(): Promise<Record<string, number>>;
} // §3.1
interface AuthApi {
  getSession(): Promise<User | null>;
  login(input: LoginInput): Promise<{ user: User; mergedSavedItems: boolean }>;
  signup(input: SignupInput): Promise<{ user: User; mergedSavedItems: boolean }>;
  logout(): Promise<void>;
}
interface CartApi {
  getCart(): Promise<CartView>; // resolved lines, issues, PriceSummary
  addItem(input: { variantId: string; quantity: number }): Promise<CartView>;
  updateQuantity(variantId: string, quantity: number): Promise<CartView>;
  removeItem(variantId: string): Promise<CartView>;
}
interface WishlistApi {
  getWishlist(): Promise<ProductSummary[]>;
  add(productId: string): Promise<void>;
  remove(productId: string): Promise<void>;
  moveToCart(input: { productId: string; variantId: string }): Promise<void>;
}
interface AddressApi {
  list(): Promise<Address[]>;
  create(input: AddressInput): Promise<Address>;
  update(id: string, input: AddressInput): Promise<Address>;
  remove(id: string): Promise<void>;
  setDefault(id: string): Promise<void>;
}
interface CheckoutApi {
  startBuyNow(input: { variantId: string; quantity: number }): Promise<void>;
  startCartCheckout(): Promise<void>;
  getCheckout(deliveryOption: DeliveryOption): Promise<CheckoutView>; // source, items, issues, summary
  placeOrder(input: { addressId: string; deliveryOption: DeliveryOption }): Promise<Order>;
}
interface OrderApi {
  list(): Promise<OrderSummary[]>;
  get(orderId: string): Promise<Order>; // NOT_FOUND if not the user's
  cancel(orderId: string): Promise<Order>;
}
interface ProfileApi {
  get(): Promise<User>;
  update(input: ProfileInput): Promise<User>;
}
```

- `src/api/server/index.ts` exports `catalog`. `src/api/client/index.ts` exports `api` (`api.cart`, `api.auth`, …).
- In Phase 1 both point to the mock adapters. In Phase 2, the adapter is chosen by `NEXT_PUBLIC_DATA_SOURCE`.
- The client-side mock adapters also read product data (to resolve cart lines, validate variants and build orders). They use the same pure catalog functions over `src/data`, which is the same data the server catalog uses.

### 7.2 Mock adapter responsibilities

For every customer-data call, the mock adapter:

1. Waits for simulated latency (`NEXT_PUBLIC_MOCK_LATENCY_MS`, default ~250 ms) so loading states are exercised.
2. Validates input with Zod (`domain/validation.ts`).
3. Requires authentication where needed (`UNAUTHENTICATED`).
4. Applies `domain/*` rules: effective stock, variant validity, ownership, cart merge, totals.
5. Persists through `storage.ts`.
6. Returns computed data (totals, discounts, delivery charge, effective stock, issues), so the UI only renders it.

The mock catalog adds no latency on the server. It is pure, and it never touches storage.

### 7.3 Errors (`src/api/errors.ts`)

```ts
class ApiError extends Error { constructor(public code: ApiErrorCode, public details?: Record<string, unknown>) {…} }
type ApiErrorCode =
  | 'VALIDATION' | 'UNAUTHENTICATED' | 'NOT_FOUND'
  | 'INVALID_CREDENTIALS' | 'EMAIL_TAKEN'
  | 'VARIANT_REQUIRED' | 'INVALID_VARIANT' | 'OUT_OF_STOCK' | 'INSUFFICIENT_STOCK'
  | 'INVALID_QUANTITY' | 'EMPTY_CART' | 'ADDRESS_REQUIRED' | 'INVALID_ADDRESS'
  | 'ORDER_NOT_CANCELLABLE' | 'UNKNOWN';
```

`details` carries context, e.g. `{ productName, available: 2 }`. The Phase 2 HTTP adapters map backend responses onto the same codes.

## 8. Persistence (localStorage)

`src/api/client/mock/storage.ts` is the **only** module that touches `localStorage`. It:

- prefixes keys with `nivora:v1:`;
- returns fallbacks when `window` is undefined (server render), so importing it on the server can never crash;
- parses JSON safely, falling back to defaults on corrupt data (req §5.2);
- converts storage exceptions (quota exceeded, private mode) into `ApiError('UNKNOWN')`.

| Key (`nivora:v1:…`) | Shape                                                              | Notes                                                 |
| ------------------- | ------------------------------------------------------------------ | ----------------------------------------------------- |
| `users`             | `StoredUser[]` (incl. mock password; profile name/phone live here) | Test user seeded (req §7.1, §5.3 caveat)              |
| `auth_session`      | `{ userId, createdAt } \| null`                                    | Absent on first launch, so the user starts logged out |
| `cart`              | `{ guest: CartLine[]; byUser: Record<userId, CartLine[]> }`        | req §17.5                                             |
| `wishlist`          | `Record<userId, string[]>`                                         | Product IDs, no duplicates                            |
| `addresses`         | `Record<userId, Address[]>`                                        |                                                       |
| `orders`            | `Order[]`                                                          | Filtered by `customerId` on read                      |
| `order_counter`     | `number`                                                           | `NIV-2026-000123` style IDs                           |
| `inventory`         | `Record<variantId, number>`                                        | Stock adjustments (§3.1)                              |
| `checkout_session`  | `Record<userId, { source; buyNow?: { variantId; quantity } }>`     | Pending Buy Now (req §19)                             |
| `seed_version`      | `number`                                                           | Seeding runs once per seed version                    |

- **Seeding** runs once, on the first client data-layer call (`ensureSeeded()`). It adds the test user and their sample orders (`isSample: true`), and never creates a session.
- **Logout** removes only `auth_session` and that user's `checkout_session` (req §27).

## 9. Routing

### 9.1 Next.js App Router

- Routes are folders under `src/app`.
- **Route groups** apply different layouts without changing URLs: `(shop)` gets the full header, navigation and footer; `(checkout)` gets a simplified header.
- Each route can have `loading.tsx` (streaming skeleton), `error.tsx` (error boundary) and `not-found.tsx`.
- Navigation uses `next/link` and `useRouter`/`useSearchParams` from `next/navigation`.
- Paths are built only through `config/routes.ts` (`paths.product(slug)`, …).

### 9.2 Route table

| Path                                                                             | File                                               | Rendering                                  | Access               | Index in search engines |
| -------------------------------------------------------------------------------- | -------------------------------------------------- | ------------------------------------------ | -------------------- | ----------------------- |
| `/`                                                                              | `(shop)/page.tsx`                                  | Server (static, revalidated)               | Everyone             | Yes                     |
| `/c/[category]`                                                                  | `(shop)/c/[category]/page.tsx`                     | Server (per request: uses `searchParams`)  | Everyone             | Yes (unfiltered)        |
| `/c/[category]/[subcategory]`                                                    | `…/[subcategory]/page.tsx`                         | Server                                     | Everyone             | Yes (unfiltered)        |
| `/collections/[collection]`                                                      | `(shop)/collections/[collection]/page.tsx`         | Server                                     | Everyone             | Yes                     |
| `/search?q=…`                                                                    | `(shop)/search/page.tsx`                           | Server (per request)                       | Everyone             | **No**                  |
| `/p/[slug]`                                                                      | `(shop)/p/[slug]/page.tsx`                         | Server, pre-built (`generateStaticParams`) | Everyone             | Yes                     |
| `/cart`                                                                          | `(shop)/cart/page.tsx`                             | Browser content                            | Everyone             | No                      |
| `/login`, `/signup`                                                              | `(shop)/login`, `(shop)/signup`                    | Browser content                            | Guests only          | No                      |
| `/wishlist`                                                                      | `(shop)/wishlist/page.tsx`                         | Browser content                            | Logged in            | No                      |
| `/account`, `/account/orders`, `/account/orders/[orderId]`, `/account/addresses` | `(shop)/account/**`                                | Browser content                            | Logged in            | No                      |
| `/checkout`                                                                      | `(checkout)/checkout/page.tsx`                     | Browser content                            | Logged in            | No                      |
| `/order-confirmation/[orderId]`                                                  | `(checkout)/order-confirmation/[orderId]/page.tsx` | Browser content                            | Logged in, own order | No                      |
| `/about`, `/contact`, `/help`, `/returns`, `/privacy`, `/terms`                  | `(shop)/(info)/[page]/page.tsx`                    | Server (static)                            | Everyone             | Yes                     |
| unknown                                                                          | `app/not-found.tsx`                                | Server                                     | Everyone             | No                      |

Unknown category, subcategory, collection or product slugs call `notFound()`, which renders the Nivora 404 page with the correct 404 status.

**404 status and streaming (Next.js 16):** once a response starts streaming (a `loading.tsx` fallback or a suspending Server Component), the status code is fixed at 200. A `notFound()` after that point becomes a "soft 404" (`noindex`, but status 200). Therefore:

- There is **no group-wide `loading.tsx`** in `(shop)`. Loading skeletons are used only where they can't hide a 404: `p/[slug]` (pre-built pages) and `account/` (no 404 cases).
- Pages that can 404 call `notFound()` **before** any `await` that may suspend, and put `<Suspense>` boundaries only around content rendered after the slug has been validated.
- `app/not-found.tsx` (unmatched URLs) renders outside the `(shop)` layout, so it wraps itself in the shared `ShopShell`. `(shop)/not-found.tsx` handles `notFound()` calls inside shop pages.

### 9.3 Protected routes

In Phase 1 the session is in localStorage, so the **server cannot know who is logged in**. Guards therefore run in the browser:

- `RequireAuth` (client component) is placed in `account/layout.tsx`, `(checkout)/layout.tsx` and the wishlist page.
  - While the session loads, it renders a skeleton.
  - For a guest, it calls `router.replace('/login?from=<current path>')`, with the "Please log in to continue." message.
- `GuestOnly` wraps the Login and Signup forms and sends logged-in users to `from` or `/`.
- After logout the session becomes `null`, so any protected view redirects, including when it's reached with the Back button (req §27).
- In Phase 2 a real session cookie lets `proxy.ts` (Next.js 16's name for middleware) check access on the server as well (§21).

`from` is restricted to internal paths, to prevent open redirects.

### 9.4 Search params

On listing pages, `page.tsx` receives `searchParams`. These are parsed by `features/catalog/listingParams.ts`, which is shared between server and client, so both sides read the same URL format (§13.3).

## 10. SEO

### 10.1 Metadata (Metadata API)

- The root layout sets defaults: `metadataBase` (`NEXT_PUBLIC_SITE_URL`), a title template of `%s | Nivora` with default `Nivora — Online Shopping`, a description, and default Open Graph/Twitter images (`/og/nivora-default.png`).
- Each public page exports `generateMetadata`:

| Page        | Title                      | Description                           | Open Graph image          | Canonical                       |
| ----------- | -------------------------- | ------------------------------------- | ------------------------- | ------------------------------- |
| Home        | `Nivora — Online Shopping` | Brand/promo copy                      | Default                   | `/`                             |
| Category    | `Fashion`                  | Category description                  | Default or category image | `/c/fashion` (filters stripped) |
| Subcategory | `Men's Fashion`            | Generated from category + subcategory | Default                   | `/c/fashion/men`                |
| Collection  | `Best Sellers`             | Collection blurb                      | Default                   | `/collections/best-sellers`     |
| Product     | `<Product name>`           | First ~155 chars of description       | First product image       | `/p/<slug>`                     |
| Info pages  | `About Nivora`, …          | Page summary                          | Default                   | Own path                        |

- Private and utility pages (cart, checkout, account, wishlist, login, signup, order confirmation, search) set `robots: { index: false }`.

### 10.2 Structured data (JSON-LD)

Rendered by a small `JsonLd` server component (`features/seo`):

| Page                                | Schema.org types                                                                                                                                                                     |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Home                                | `Organization`, `WebSite` (with `SearchAction` → `/search?q={query}`)                                                                                                                |
| Category / subcategory / collection | `BreadcrumbList`, `ItemList` of products                                                                                                                                             |
| Product                             | `Product` (name, images, brand, description, SKU = variant ID, `aggregateRating`, `offers` with `priceCurrency: INR`, price range across variants, `availability`), `BreadcrumbList` |

The JSON-LD `availability` uses initial stock in Phase 1 (§3.1).

### 10.3 Crawling

- `app/sitemap.ts` lists Home, the 5 categories, the 24 subcategories, the collections, every product and the info pages.
- `app/robots.ts`:
  - Disallows `/cart`, `/checkout`, `/account`, `/wishlist`, `/login`, `/signup`, `/order-confirmation` and `/search`, and points to the sitemap.
  - **Phase 1 safety switch:** unless `NEXT_PUBLIC_ALLOW_INDEXING=true`, it disallows everything and all pages get `noindex`, so mock data never gets indexed by accident. Flip it on only when Nivora goes live with real data.
- Filtered and sorted listing URLs carry a canonical tag pointing to the unfiltered category/subcategory URL, to avoid duplicate-content issues. Paginated pages are canonical to themselves.

### 10.4 On-page practice

- One `<h1>` per page (category name, product name, …) and a logical heading order.
- Real links (`<a href>` via `next/link`) for categories, subcategories, products, breadcrumbs and pagination, so crawlers can follow them.
- `alt` text for product images (product name + variant/angle).
- Clean, readable URLs built from slugs.
- Speed (Core Web Vitals) is treated as part of SEO (§19).

## 11. State management

| Kind of state                               | Owner                                         | Examples                                                                             |
| ------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Catalog data**                            | **Server Components** (fetched in `page.tsx`) | categories, listings, product details, collections                                   |
| **What the user is viewing**                | **URL** (path + `searchParams`)               | category, subcategory, `q`, filters, sort, page                                      |
| **Customer data** (localStorage in Phase 1) | **TanStack Query** (browser)                  | session, cart, wishlist, addresses, checkout, orders, profile, inventory adjustments |
| **Global UI state**                         | **Zustand**                                   | toasts, login-required dialog + pending intent, variant picker                       |
| **Form state**                              | **React Hook Form**                           | login, signup, address, profile                                                      |
| **Local component state**                   | `useState`                                    | selected variant, quantity, gallery index, mobile menu open                          |

### 11.1 TanStack Query

- `Providers.tsx` creates one `QueryClient` per browser session (with `useState`, so it's never shared between server requests).
- Query keys (central `queryKeys` object):

| Key                                                | Data               | Notes                                                            |
| -------------------------------------------------- | ------------------ | ---------------------------------------------------------------- |
| `['session']`                                      | `User \| null`     | `staleTime: Infinity`; set by login/signup/logout/profile update |
| `['inventory']`                                    | adjustments map    | Invalidated after place order / cancel                           |
| `['cart', userId ?? 'guest']`                      | `CartView`         |                                                                  |
| `['wishlist', userId]`                             | `ProductSummary[]` | Enabled only when logged in                                      |
| `['addresses', userId]`                            | `Address[]`        |                                                                  |
| `['checkout', userId, deliveryOption]`             | `CheckoutView`     |                                                                  |
| `['orders', userId]`, `['order', userId, orderId]` |                    |                                                                  |

- **Mutations** update or invalidate affected keys. Add to Cart writes the returned `CartView` into the cache. Place Order invalidates cart, checkout, orders and inventory.
- **Wishlist toggle** is optimistic, with rollback on error.
- **Identity changes** (login/signup/logout) set `['session']`, then remove all user-scoped queries so no previous user's data stays cached.
- Defaults: no retries for `ApiError`s, and `refetchOnWindowFocus: false`.

### 11.2 Zustand stores

```ts
loginPromptStore   { isOpen; reason?; intent?: PendingIntent; open(intent, reason); close(); takeIntent() }
variantPickerStore { productSlug?; mode: 'add-to-cart' | 'move-to-cart'; open(...); close() }
toastStore         { toasts: Toast[]; show(t); dismiss(id) }
```

These stores hold UI state only. They are not persisted and never hold copies of server data.

### 11.3 Listing updates

Filter and sort controls are client components. They update the URL with `router.replace` (or `push` for pagination) inside `startTransition`. Next.js then re-renders the Server Component page with the new `searchParams`. While that runs, the grid shows a pending state (dimmed, with a progress indicator) instead of disappearing.

## 12. Authentication and protected actions

### 12.1 Session

- `useSession()` wraps `['session']` and returns `{ user, isAuthenticated, isLoading }`.
- On the server and the first browser render, the session is "unknown". The header shows a neutral placeholder for the account area and the cart count.
- On first launch there is no `auth_session`, so `isAuthenticated = false` (req §7.1). A session pointing to a missing user is treated as a guest (req §7.4).

### 12.2 Pending intent

```ts
type PendingIntent =
  | { type: "wishlist-add"; productId: string }
  | { type: "buy-now"; variantId: string; quantity: number }
  | { type: "checkout" }
  | { type: "navigate" }; // header wishlist icon, protected page
```

`useRequireAuth()` returns `requireAuth(intent, run)`:

```
requireAuth(intent, run):
  logged in → run()
  guest     → loginPromptStore.open(intent)       // LoginRequiredDialog: Login / Cancel
              Cancel → close, discard intent, stay
              Login  → router.push('/login?from=<current path>')  (intent kept in store)
```

After successful login or signup, `resumeIntent()`:

| Intent            | Then                                                                                 |
| ----------------- | ------------------------------------------------------------------------------------ |
| `wishlist-add`    | `api.wishlist.add` → toast → back to `from`                                          |
| `buy-now`         | `api.checkout.startBuyNow` (re-validated) → `/checkout`                              |
| `checkout`        | `mergedSavedItems` ? `/cart` with notice : `startCartCheckout()` → `/checkout` (D12) |
| `navigate` / none | `from` or `/`                                                                        |

- The intent is kept in memory (Zustand), so it survives switching between `/login` and `/signup`. Both pages forward `from`.
- Leaving the auth pages any other way clears the intent (req §6.1).
- A full page refresh drops the intent; the user then lands on `from` after login.
- If a resumed action fails (e.g. it's now out of stock), the normal error toast is shown.

### 12.3 Cart merge on login

`api.auth.login`/`signup` fold the `guest` cart into the user's cart with `domain/cart.mergeCarts` (summed and capped at effective stock), clear the guest cart, and return `mergedSavedItems` (req §17.5).

## 13. Catalog: listing, filters, sorting and search

### 13.1 One listing pipeline

Category, subcategory, collection and search pages share one flow:

```
page.tsx (server)
  searchParams ─ parseListingParams() ─► ProductQuery ─► catalog.listProducts()
  ◄── { items, total, facets, page, pageSize }
  render: ListingHeader (title, count) · SubcategoryNav · FilterPanel(facets) · SortSelect
          · ProductGrid(items) · Pagination · or ListingEmptyState ("No products found.")
client controls ─ serialiseListingParams() ─► router.replace(url) ─► server re-render
```

`ProductQuery`:

```ts
{ categoryId?; subcategoryIds?: string[]; collection?: CollectionId; q?: string;
  brands?: string[]; priceMin?: number; priceMax?: number; minRating?: number;
  minDiscount?: number; inStockOnly?: boolean;
  attributes?: Record<string, string[]>;   // size, color, ram, storage, capacity, energyRating, …
  sort: 'relevance' | 'price-asc' | 'price-desc' | 'rating' | 'newest' | 'discount';
  page: number }
```

Filtering, sorting, search scoring, facets and pagination all happen in the catalog data layer (`domain/filters.ts`, `sort.ts`, `search.ts`). In Phase 2 the backend does this work instead.

### 13.2 Filter configuration (`features/catalog/filterConfig.ts`)

| Context              | Filters                                                                                                                                |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Fashion              | Subcategory nav, Size, Color, Brand, Price, Rating, Discount, Availability                                                             |
| Mobiles              | Subcategory nav, Brand, RAM, Storage, Price, Rating, Discount, Availability                                                            |
| Home Appliances      | Subcategory nav, Brand, Capacity, Energy Rating, Price, Rating, Discount, Availability                                                 |
| Beauty               | Subcategory nav, Brand, Product Type, Skin/Hair Type, Price, Rating, Discount, Availability                                            |
| Toys                 | Subcategory nav, Brand, Age Group, Price, Rating, Discount, Availability                                                               |
| Search / collections | Category, Subcategory, Brand, Price, Rating, Discount, Availability (+ category-specific filters when results are within one category) |

Facet options come from the current result set (req §12.2).

### 13.3 URL format

```
/c/fashion/men?brand=Levis,Urbano&size=M,L&price=500-2000&rating=4&discount=25&instock=1&sort=price-asc&page=2
/search?q=wireless+earbuds&category=mobiles&sort=rating
```

- Unknown params and values are ignored.
- Changing a filter or the sort resets `page` to 1.
- **Clear all** keeps `q` and the category path.

### 13.4 Search

- The header `SearchBar` (client) navigates to `/search?q=…`. Empty or whitespace-only queries do nothing.
- `domain/search.ts` tokenises the query. A product matches when every token matches some field. Scoring: name/brand > category/subcategory > tags/specs > description.
- Relevance sorts by score. Ties, and listings without a query, fall back to best-seller first, then rating. Out-of-stock products always come last.

### 13.5 Home and product cards

- **Home** renders the hero plus three `ProductSection` rows (`best-sellers`, `special-offers`, `new-arrivals`) on the server. There is no "Shop by Category" section.
- **ProductCard** is a Server Component: image, name, rating, price and badges are all in the HTML. It embeds a small client island, `CardActions` (wishlist button + Add to Cart), which also applies the inventory overlay for out-of-stock state.
- A card's Add to Cart:
  - single-variant products are added directly;
  - products with options open the `VariantPickerDialog`.

## 14. Cart, Buy Now, checkout and orders

### 14.1 Product Details

- `p/[slug]/page.tsx` (server) loads the product. It renders the breadcrumbs, `ImageGallery`, `ProductInfo`, description, `Specifications` and JSON-LD.
- `PurchasePanel` (client) receives the product as props and owns:
  - the selected variant and quantity (local state);
  - the effective stock (`useInventory`);
  - the Add to Cart, Buy Now and Wishlist actions.

### 14.2 Add to Cart

```
client checks: all options chosen? 1 ≤ qty ≤ maxAddable?   (inline errors)
→ useAddToCart → api.cart.addItem({ variantId, quantity })
    mock: re-validates variant + effective stock (incl. qty in cart), upserts line, persists
→ cache ['cart'] ← CartView → header count updates
→ toast "Added to cart" [View Cart]; stay on page
```

`maxAddable = effectiveStock − quantityInCart`. For Buy Now the limit is `effectiveStock` (req §16.3).

### 14.3 Wishlist Move to Cart

Products with options open `VariantPickerDialog` (mode `move-to-cart`). Otherwise `api.wishlist.moveToCart` is called directly: the item is added to the cart and removed from the wishlist.

### 14.4 Buy Now

```
"Buy Now" → validate selection → requireAuth({ type: 'buy-now', variantId, quantity }, run)
run: api.checkout.startBuyNow(...)   // checkout_session; cart untouched → router.push('/checkout')
```

### 14.5 Checkout

- `CheckoutView` (client) loads `api.checkout.getCheckout(deliveryOption)`, which returns `{ source, items, issues, summary }`. If there is no valid Buy Now, the cart is used (req §19).
- Sections, in order:
  1. **Address**: select, add, edit or delete, with `AddressForm` in a dialog.
  2. **Delivery**: Standard or Express.
  3. **Order Summary**.
  4. **Payment: Cash on Delivery**: shown as static text, with no inputs.
  5. **Place Order**.
- The summary is re-requested when the delivery option changes, so totals always come from the data layer.
- If there are any issues, no items or no address, the problem is shown inline and Place Order is disabled.

### 14.6 Place order

```
usePlaceOrder → api.checkout.placeOrder({ addressId, deliveryOption })
  mock: auth → address → items/variants valid → qty ≤ effective stock
        → recompute totals → build Order (snapshots) → save → subtract inventory
        → cart source: remove purchased lines | buy-now: clear checkout_session
→ invalidate cart, checkout, orders, inventory
→ router.replace(paths.orderConfirmation(orderId))
```

- The button is disabled while the request is pending.
- The confirmation page only **reads** the order, so refreshing is safe (req §24.3).

### 14.7 Orders

- The orders list is newest first. Order Details shows the full order, and `NOT_FOUND` renders "Order not found".
- **Cancel**: allowed while `Placed` or `Confirmed`. After a confirmation dialog, `api.orders.cancel` sets `Cancelled`, adds a `statusHistory` entry, and restores inventory unless the order `isSample`.
- There is no automatic status progression (D7).

## 15. Forms and validation

- React Hook Form + `zodResolver`. The same Zod schemas validate inputs inside the mock adapters, so client and "server" rules can't drift.
- Schemas:
  - `loginSchema`.
  - `signupSchema`: password ≥ 8 characters with a letter and a number, plus a refinement that the passwords match.
  - `addressSchema`: mobile `^[6-9]\d{9}$`, PIN `^[1-9]\d{5}$`, a state from the list, country India.
  - `profileSchema`.
- Inputs are validated on submit, then again on change once a field has an error. Focus moves to the first invalid field, and user input is preserved.
- Data-layer errors map back to fields where they belong: `EMAIL_TAKEN` becomes an email-field error, and `INVALID_CREDENTIALS` becomes a form-level message.

## 16. Error handling

| Layer                  | Mechanism                                                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Data layer             | Throws `ApiError` with a code (§7.3)                                                                                                              |
| Messages               | `lib/errorMessages.ts` maps codes (+ `details`) to the customer wording in req §28                                                                |
| Server-rendered routes | `error.tsx` per route group shows a friendly "Something went wrong" with Retry (`reset()`) and a link home. `global-error.tsx` is the last resort |
| Not found              | `notFound()` → `not-found.tsx` (404 status)                                                                                                       |
| Client queries         | `ErrorState` with **Try again** (refetch)                                                                                                         |
| Mutations              | Toast for actions; inline/form errors for forms and checkout                                                                                      |
| Unexpected exceptions  | Never shown to customers. Details are logged to the console in development only                                                                   |

## 17. UI system, styling and responsiveness

### 17.1 Tailwind and design tokens

- Tailwind CSS is configured CSS-first in `src/app/globals.css`. Nivora's identity is defined there as tokens (`@theme`): brand and accent colours, neutrals, semantic colours (success, warning, danger, sale), type scale, radii and shadows.
- Components use token utilities (`bg-brand-600`, `text-sale`), not one-off hex values.
- Fonts are loaded with `next/font` (self-hosted, no layout shift).
- The palette, typography and logo are designed in M1 (§22) and must not resemble Amazon or Flipkart (req §2).
- `cn()` composes class names. Shared components expose `variant`/`size` props.

### 17.2 Shared UI kit (`components/ui`)

Button (primary, secondary, ghost, danger; loading/disabled) · IconButton · Input · Select · Checkbox · Radio · Dialog · Drawer · Dropdown · Toaster · Badge · Rating · Price · Skeleton · Spinner · EmptyState · ErrorState · Breadcrumbs · ProductImage. (Screen-reader-only text uses Tailwind's `sr-only` class directly.)

`ProductImage` wraps `next/image`:

- `remotePatterns` in `next.config.ts` allow the stock-photo host (D2);
- `sizes` are set per layout, so the right image size is served;
- `priority` is used for above-the-fold images (hero, main product image);
- it falls back to `/images/placeholder-product.svg` on error.

### 17.3 Responsive layout

| Breakpoint | Width       | Grid columns | Navigation                                                           | Filters                                                                           |
| ---------- | ----------- | ------------ | -------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| default    | < 640px     | 2            | Hamburger → `MobileMenu` drawer (categories, subcategories, account) | "Filter" / "Sort" buttons → `FilterDrawer`, Apply button showing the result count |
| `sm`/`md`  | 640–1023px  | 3            | Hamburger / compact                                                  | Drawer                                                                            |
| `lg`       | 1024–1279px | 4            | Horizontal `MainNav` + subcategory dropdowns                         | Sidebar                                                                           |
| `xl`       | ≥ 1280px    | 5            | Horizontal                                                           | Sidebar                                                                           |

- On mobile:
  - The header shows the logo, a full-width search row, wishlist, cart and menu.
  - Product Details uses a sticky Add to Cart / Buy Now bar.
  - Cart and Checkout are single-column, with a sticky action bar.
- There is no horizontal page scrolling at any width.

### 17.4 Icons

Icons are in-house SVG components in `components/icons`: Cart, Heart, HeartFilled, Search, User, Menu, Close, Chevrons, Plus, Minus, Star, StarHalf, Trash, Check, Truck, MapPin, Package, Filter, Info, Alert, StarOutline. They are `aria-hidden` by default, and icon-only buttons supply an `aria-label`.

## 18. Accessibility

The in-house overlays and controls must provide:

- **Dialog/Drawer**: `role="dialog"`, `aria-modal`, a labelled title, a focus trap, focus returned to the trigger, Escape to close, and scroll lock.
- **Menus/dropdowns**: keyboard opening and arrow-key navigation, Escape to close, `aria-expanded`.
- **Variant options**: radio groups. Out-of-stock options are announced as unavailable.
- **Quantity**: labelled buttons and a live region for the value.
- **Toasts**: an `aria-live="polite"` region.
- Landmarks, a "Skip to content" link, labelled inputs, visible focus rings, and WCAG AA contrast.

## 19. Performance

- Server rendering and pre-built product pages give fast first content (also an SEO factor).
- Client JavaScript is limited to interactive islands. Heavy client-only areas (checkout, account) are split per route automatically.
- `next/image` serves responsive, lazy-loaded images with reserved dimensions, so there's no layout shift.
- `next/font` avoids font flashes and layout shift.
- The product data lives in modules that are only imported server-side. Client-side mock adapters load product data with a dynamic `import()` on first use, so it isn't part of the initial bundle.
- Listing updates use transitions and keep the previous grid visible while new results load.

## 20. Code conventions and quality

- TypeScript `strict: true`. No `any` in `domain/` or `api/`.
- Path alias `@/` → `src/`.
- Naming:
  - Components: `PascalCase.tsx`.
  - Hooks: `useX.ts`.
  - Other files: `camelCase.ts`.
  - Route files follow Next.js names (`page.tsx`, `layout.tsx`, …).
- `'use client'` goes only at the top of genuinely interactive components. Keep client components small and leaf-level.
- **ESLint** (Next.js core-web-vitals + TypeScript rules), plus project rules:
  - `localStorage` and `sessionStorage` are banned everywhere except `src/api/client/mock/storage.ts`.
  - `no-restricted-imports`:
    - `@/api/*/mock/*` and `@/data/*` may only be imported inside `src/api`;
    - `@/api/client` and `@/stores` may not be imported by server-only modules (route files, server components);
    - `@/api/server` may not be imported by `'use client'` files.
- **Prettier** for formatting (with the Tailwind class-sorting plugin only if Joseph approves it; not included by default).
- npm scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `format`. Only npm is used; don't commit other lockfiles.
- Environment variables: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_DATA_SOURCE=mock`, `NEXT_PUBLIC_MOCK_LATENCY_MS`, `NEXT_PUBLIC_ALLOW_INDEXING=false`.

## 21. Phase 2 migration path

| Phase 1                                     | Phase 2                                                                                                                              | UI impact                                     |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------- |
| `api/server/mock/catalog.ts`                | HTTP catalog adapter calling the backend from Server Components (with Next.js caching/revalidation)                                  | None                                          |
| `api/client/mock/*` (localStorage)          | HTTP adapters calling the backend with a session cookie                                                                              | None                                          |
| Session in localStorage; client-side guards | HTTP-only cookie session; `proxy.ts` (formerly middleware) protects routes on the server; user data can then also be server-rendered | Guards simplified                             |
| Inventory overlay (§3.1)                    | Removed. The server renders real stock                                                                                               | Overlay hook becomes a no-op, then is deleted |
| `domain/*` rules used by mocks              | The backend is authoritative; the frontend keeps display helpers and form checks                                                     | None                                          |
| Zod schemas                                 | May move to a shared package used by frontend and backend                                                                            | Import paths only                             |
| `ApiError` codes                            | HTTP adapters map backend errors to the same codes                                                                                   | None                                          |
| `src/data` mock catalog                     | Becomes database seed data; removed from the frontend                                                                                | None                                          |
| `NEXT_PUBLIC_ALLOW_INDEXING=false`          | Set to `true` at public launch                                                                                                       | None                                          |

Next.js remains the frontend. The backend lives in `backend/`: **NestJS + Prisma + Neon PostgreSQL**, designed in [`backend-architecture.md`](backend-architecture.md). Phase 2 decisions that refine this table: shared domain/validation/data move to an npm-workspace package `@nivora/shared`; sessions are database-backed HTTP-only cookies; guest carts live on the server behind an anonymous cookie.

## 22. Implementation plan

| #   | Milestone                      | Delivers                                                                                                                                                                                                                                   |
| --- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| M1  | Scaffold and design foundation | Next.js + TS + Tailwind + ESLint/Prettier; design tokens, fonts, Nivora logo/palette; UI kit basics; root layout, `(shop)`/`(checkout)` layouts with Header/Footer/MainNav/MobileMenu; every route stubbed; 404/error pages; base metadata |
| M2  | Data layer and mock data       | Domain types and rules; server catalog adapter; client mock adapters + storage + seed + inventory; the full product dataset across all 24 subcategories; seeded orders                                                                     |
| M3  | Catalog and SEO                | Home, category/subcategory/collection pages, filters (config-driven, URL-synced), sorting, pagination, search, product card + inventory overlay, empty states; `generateMetadata`, JSON-LD, sitemap, robots                                |
| M4  | Product Details and Cart       | Pre-built product pages, gallery, variants, quantity, stock states, Add to Cart, variant picker, Cart page and totals, header count                                                                                                        |
| M5  | Authentication                 | Login, Signup, session, guards, login-required dialog, pending intents, cart merge, logout                                                                                                                                                 |
| M6  | Wishlist                       | Optimistic toggle, Wishlist page, Move to Cart                                                                                                                                                                                             |
| M7  | Checkout and orders            | Addresses, delivery options, COD, Buy Now, place order, stock updates, confirmation, Orders/Order Details, cancellation                                                                                                                    |
| M8  | Account and info pages         | Profile, Account layout, footer info pages                                                                                                                                                                                                 |
| M9  | Polish and verification        | Responsive, accessibility and state audits; SEO check (view-source HTML, metadata, structured data); walkthrough of every req §32 flow and §34 criterion                                                                                   |

## 23. Open items

| Item                                               | Status                                                                                                                           |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Automated testing                                  | Not adopted in Phase 1; manual verification against req §34. Recommend revisiting (e.g. unit tests for `domain/`) before Phase 2 |
| Nivora visual identity (palette, typography, logo) | Designed in M1                                                                                                                   |
| Hosting/deployment                                 | Not decided. Next.js needs a Node.js server or a platform that supports it (e.g. Vercel); decide before any public deployment    |
| Stock-photo host for `next/image` `remotePatterns` | Set in M2, when the dataset's image URLs are chosen                                                                              |
