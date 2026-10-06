# Nivora — Backend Architecture (Phase 2)

| | |
|---|---|
| **Scope** | Phase 2: a real backend in `backend/` that replaces the Phase 1 mock/localStorage data layer |
| **Requirements** | [`../requirements.md`](../requirements.md) (req §) · frontend architecture [`architecture.md`](architecture.md) (arch §) |
| **Stack** | NestJS + TypeScript · Prisma ORM · Neon PostgreSQL (agreed with Joseph, 2026-10-06) |
| **Status** | Proposed — implementation not started |
| **Last updated** | 2026-10-06 |

The frontend is complete and talks to a typed data-layer contract (arch §7). Phase 2 builds a backend that implements the **same contract over HTTP**, so the frontend switches by swapping adapters, not by rewriting pages (req §36, arch §21). Everything the Phase 1 mock adapters do — validation, stock, prices, cart merge, orders — moves to the server, which becomes the single source of truth.

---

## Table of contents

1. [Is the stack a good fit?](#1-is-the-stack-a-good-fit)
2. [Technology stack](#2-technology-stack)
3. [Repository structure (npm workspaces)](#3-repository-structure-npm-workspaces)
4. [Backend layers](#4-backend-layers)
5. [Modules](#5-modules)
6. [Data model (Prisma)](#6-data-model-prisma)
7. [REST API](#7-rest-api)
8. [Authentication and sessions](#8-authentication-and-sessions)
9. [Carts (guest and customer)](#9-carts-guest-and-customer)
10. [Catalog, search and filters](#10-catalog-search-and-filters)
11. [Inventory, checkout and orders](#11-inventory-checkout-and-orders)
12. [Validation and errors](#12-validation-and-errors)
13. [Security](#13-security)
14. [Prisma 7 and Neon specifics](#14-prisma-7-and-neon-specifics)
15. [Configuration and secrets](#15-configuration-and-secrets)
16. [Seeding](#16-seeding)
17. [Frontend integration](#17-frontend-integration)
18. [Testing](#18-testing)
19. [Observability and operations](#19-observability-and-operations)
20. [Implementation plan](#20-implementation-plan)
21. [Open items](#21-open-items)

---

## 1. Is the stack a good fit?

**Yes.** What the backend must do is fully defined by the requirements and the frontend's contracts (arch §7.1): accounts and sessions, catalog queries, carts, wishlists, addresses, checkout, orders and inventory — a classic transactional e-commerce API.

| Choice | Why it fits Nivora |
|---|---|
| **NestJS + TypeScript** | Module-per-feature structure maps 1:1 onto the frontend contracts (auth, cart, wishlist, addresses, checkout, orders, catalog). Guards, pipes and filters give clean places for sessions, validation and error mapping. Same language as the frontend, so domain rules and schemas can be **shared** (§3). |
| **Prisma ORM** | Typed queries generated from one schema, migrations, and interactive transactions — needed for stock-safe order placement (§11). |
| **Neon PostgreSQL** | Real relational integrity (orders ↔ items ↔ variants), transactions and row-level conditional updates for stock, JSONB for flexible product attributes, and serverless Postgres with branching (useful for a separate test database, §18). |

Verified on 2026-10-06: the Neon database is reachable on both the pooled and direct endpoints, runs **PostgreSQL 18.6**, and is empty.

## 2. Technology stack

### 2.1 Agreed

| Concern | Choice | Notes |
|---|---|---|
| Framework | **NestJS 12** | Requires Node ≥ 20; the project uses Node 22 LTS. **Nest 12 packages are ESM-only**, so the backend is an ES module app (`"type": "module"`, `module: nodenext`) |
| Language | **TypeScript 6.0** (strict), whole repo | Nest 12's CLI/schematics require TypeScript ≥ 6, so frontend, shared and backend all moved to `~6.0` together (P2-008; frontend and shared re-verified). TypeScript 7 is not used yet |
| ORM | **Prisma 7.10** (stable) | Not 8.0 — npm's `latest` tag currently points to an 8.0 release candidate; pin 7.x |
| Database | **Neon PostgreSQL 18** | Pooled endpoint for the API, direct endpoint for migrations (§14) |
| Driver adapter | **`@prisma/adapter-pg`** | Prisma 7 requires a driver adapter; `adapter-pg` (TCP) suits a long-running server. `@prisma/adapter-neon` is for serverless/edge runtimes |
| Validation | **Zod 4** | Shared with the frontend (§3, §12) |
| Package manager | **npm** (workspaces) | Same as the frontend |
| Tests | **Jest** (+ Supertest for HTTP) | Agreed: automated tests for the backend, run in a separate `nivora_test` schema of the main database (§18). Nest 12's own scaffold now defaults to Vitest + oxlint; we keep the approved Jest (native ESM mode via ts-jest) and ESLint, aligned with the frontend |

### 2.2 Additional libraries — approved

Approved by Joseph on 2026-10-06.

| Library | Purpose |
|---|---|
| `argon2` | Password hashing (argon2id) — replaces Phase 1 plain-text mock passwords (req §5.3) |
| `cookie-parser` | Reading the session and guest-cart cookies |
| `helmet` | Security headers |
| ~~`@nestjs/throttler`~~ → in-house `RateLimitGuard` | Rate limiting (login/signup brute-force protection). **Replaced in P2-009:** throttler 6.7 is still CommonJS and `require()`s the ESM-only Nest 12, which Jest cannot load on Node 22. The ~70-line guard (`src/common/rate-limit`) gives the same in-memory, per-client fixed windows, 429 + `Retry-After`; one fewer dependency |
| `@nestjs/config` + `dotenv` | Environment loading — Prisma 7 no longer loads `.env` automatically |
| `supertest` | HTTP-level tests with Jest |
| `tsx` | Running the Prisma seed script (Prisma 7 seeds via `prisma.config.ts`) |

**Not adopted:** Passport/JWT (sessions are opaque DB tokens, §8), class-validator/class-transformer (Zod is shared instead), Redis (not needed at this scale), GraphQL (REST matches the contracts).

## 3. Repository structure (npm workspaces)

Decision (Joseph, 2026-10-06): **one shared package** so business rules exist once.

```
nivora/
├── package.json              # NEW: npm workspaces ["frontend", "backend", "packages/*"]
├── package-lock.json         # single lockfile for the whole repo (replaces frontend/package-lock.json)
├── packages/
│   └── shared/               # @nivora/shared — pure TypeScript, no framework
│       ├── src/
│       │   ├── domain/       # moved from frontend/src/domain: types, pricing, stock, cart,
│       │   │                 # catalog, filters, sort, search, orders, validation (Zod)
│       │   ├── contracts/    # API request/response types + ApiErrorCode (from frontend/src/api)
│       │   ├── data/         # catalog seed data: categories, collections, products, info pages
│       │   └── config/       # business constants (delivery charges, page size, Indian states)
│       └── package.json
├── frontend/                 # imports @nivora/shared; keeps UI, mock + HTTP adapters
├── backend/
│   ├── .env                  # secrets (git-ignored)
│   ├── .env.example
│   ├── package.json
│   ├── nest-cli.json
│   ├── prisma.config.ts      # Prisma 7 config (datasource URL, migrations, seed)
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── src/
│   │   ├── main.ts           # bootstrap: helmet, cookie-parser, global pipes/filters, /api/v1 prefix
│   │   ├── app.module.ts
│   │   ├── config/           # env schema (Zod) + typed config service
│   │   ├── prisma/           # PrismaModule / PrismaService (adapter-pg, lifecycle hooks)
│   │   ├── common/           # ZodValidationPipe, ApiExceptionFilter, guards, decorators, request-id
│   │   └── modules/          # auth, users, catalog, content, cart, wishlist, addresses,
│   │                         # checkout, orders, inventory, health (§5)
│   └── test/                 # Jest e2e (Supertest) suites
├── docs/
└── …
```

- The frontend keeps its ESLint boundary rules; imports of `@/domain/...` become `@nivora/shared/...`. The Phase 1 mock adapters stay (useful for offline demos) and are selected by `NEXT_PUBLIC_DATA_SOURCE=mock`.
- Catalog data moves to `packages/shared/src/data` because it becomes **seed data** (arch §21). The frontend mock adapter keeps working by importing it from there.
- The move is mechanical but touches many imports; it is its own milestone (B1) and must leave every existing frontend check green.

## 4. Backend layers

```
HTTP request
   │  helmet · cookie-parser · request-id · rate limit
   ▼
Controller (route, DTO via ZodValidationPipe, @CurrentUser / @CartOwner)
   ▼
Service (use case; calls @nivora/shared domain rules; owns transactions)
   ▼
Repository helpers (Prisma queries; no business rules)
   ▼
PostgreSQL (Neon)
Errors anywhere → ApiError(code, details) → ApiExceptionFilter → { error: { code, message, details } }
```

Rules:

- **Controllers** are thin: parse/validate input, call one service method, return the contract type.
- **Services** hold the use case and decide transaction boundaries (`prisma.$transaction`). Pricing, stock arithmetic, cart merging, filtering, search scoring and order building come from `@nivora/shared/domain` — the same code the frontend used in Phase 1.
- **Responses** match `@nivora/shared/contracts` exactly (e.g. `CartView`, `ProductListResult`, `Order`), so the frontend's HTTP adapters are thin.
- Money stays **integer rupees** end to end (`Int` columns).

## 5. Modules

| Module | Responsibilities | Frontend contract |
|---|---|---|
| `health` | `GET /health` (liveness + DB ping) | — |
| `auth` | Signup, login, logout, current session; session cookies; guest-cart merge on login | `AuthApi` |
| `users` | Profile read/update (name, phone; email read-only) | `ProfileApi` |
| `catalog` | Categories, product listing (filters, facets, sort, search, pagination), product details with live stock, collections, slugs | `CatalogApi`, `ClientCatalogApi` |
| `content` | Info pages (About, Contact, Help, Returns, Privacy, Terms) | `ContentApi` |
| `inventory` | Stock reads; atomic decrement/restore used by checkout and orders | (replaces `InventoryApi`) |
| `cart` | Guest and customer carts, line revalidation, totals | `CartApi` |
| `wishlist` | Per-user wishlist, move to cart | `WishlistApi` |
| `addresses` | CRUD, default address | `AddressApi` |
| `checkout` | Buy Now / cart checkout sessions, checkout view, place order | `CheckoutApi` |
| `orders` | History, details (own orders only), cancellation | `OrderApi` |

## 6. Data model (Prisma)

Sketch of `schema.prisma` (names are the Prisma models; tables use snake_case via `@@map`).

```prisma
model User {
  id           String     @id @default(cuid())
  name         String
  email        String     @unique            // stored lower-cased
  phone        String?
  passwordHash String                         // argon2id
  createdAt    DateTime   @default(now())
  sessions     Session[]
  cart         Cart?
  wishlist     WishlistItem[]
  addresses    Address[]
  orders       Order[]
  checkout     CheckoutSession?
}

model Session {
  id         String   @id @default(cuid())
  tokenHash  String   @unique                 // SHA-256 of the cookie token; raw token never stored
  userId     String
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt  DateTime @default(now())
  expiresAt  DateTime
  lastSeenAt DateTime @default(now())
  @@index([userId])
}

model Category {
  id            String        @id            // "fashion"
  name          String
  description   String
  position      Int
  subcategories Subcategory[]
}

model Subcategory {
  id         String    @id                   // "fashion-men"
  slug       String                          // "men"
  name       String
  position   Int
  categoryId String
  category   Category  @relation(fields: [categoryId], references: [id])
  products   Product[]
  @@unique([categoryId, slug])
}

model Product {
  id             String      @id
  slug           String      @unique
  name           String
  brand          String
  description    String
  images         String[]
  rating         Decimal     @db.Decimal(2, 1)
  reviewCount    Int
  specifications Json                          // [{label, value}]
  options        Json                          // [{name, values[]}]
  attributes     Json                          // filter attributes (capacity, ageGroup, …)
  tags           String[]
  isBestSeller   Boolean     @default(false)
  isNewArrival   Boolean     @default(false)
  createdAt      DateTime
  subcategoryId  String
  subcategory    Subcategory @relation(fields: [subcategoryId], references: [id])
  variants       Variant[]
  @@index([subcategoryId])
}

model Variant {
  id            String  @id                    // stable, e.g. "apple-iphone-15-blue-6-gb-128-gb"
  productId     String
  product       Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  optionValues  Json                           // {"Color":"Blue","Storage":"128 GB"}
  price         Int                            // rupees
  originalPrice Int
  stock         Int                            // authoritative live stock (CHECK stock >= 0)
  @@index([productId])
}

model Cart {
  id         String     @id @default(cuid())
  userId     String?    @unique                // customer cart …
  guestToken String?    @unique                // … or guest cart (hash of the cookie value)
  user       User?      @relation(fields: [userId], references: [id], onDelete: Cascade)
  items      CartItem[]
  updatedAt  DateTime   @updatedAt
}

model CartItem {
  cartId    String
  variantId String
  quantity  Int                                // CHECK quantity >= 1
  cart      Cart     @relation(fields: [cartId], references: [id], onDelete: Cascade)
  variant   Variant  @relation(fields: [variantId], references: [id])
  addedAt   DateTime @default(now())
  @@id([cartId, variantId])                    // one line per variant (req §17.2)
}

model WishlistItem {
  userId    String
  productId String
  addedAt   DateTime @default(now())
  @@id([userId, productId])                    // no duplicates (req §18)
}

model Address {
  id         String  @id @default(cuid())
  userId     String
  fullName   String
  phone      String
  line1      String
  line2      String?
  city       String
  state      String
  postalCode String
  country    String  @default("India")
  isDefault  Boolean @default(false)
  createdAt  DateTime @default(now())
  @@index([userId])
}

model CheckoutSession {                        // pending Buy Now (req §19)
  userId          String  @id
  source          String                       // "cart" | "buy_now"
  buyNowVariantId String?
  buyNowQuantity  Int?
  updatedAt       DateTime @updatedAt
}

model Order {
  id              String      @id @default(cuid())
  orderNumber     String      @unique          // "NIV-2026-000123"
  customerId      String
  orderDate       DateTime    @default(now())
  source          String                       // "cart" | "buy_now"
  subtotal        Int
  discount        Int
  deliveryOption  String                       // "standard" | "express"
  deliveryCharge  Int
  total           Int
  deliveryAddress Json                         // snapshot (req §24.2)
  paymentMethod   String      @default("Cash on Delivery")
  status          OrderStatus @default(Placed)
  isSample        Boolean     @default(false)
  idempotencyKey  String?                      // from the Place Order request header (§11)
  items           OrderItem[]
  history         OrderStatusEvent[]
  @@index([customerId, orderDate])
  @@unique([customerId, idempotencyKey])
}

model OrderItem {                              // snapshot of the line at order time
  id                String @id @default(cuid())
  orderId           String
  productId         String
  variantId         String
  productSlug       String
  productName       String
  brand             String
  image             String
  options           Json
  quantity          Int
  unitPrice         Int
  unitOriginalPrice Int
  discount          Int
  lineTotal         Int
}

model OrderStatusEvent {
  id      String      @id @default(cuid())
  orderId String
  status  OrderStatus
  at      DateTime    @default(now())
}

enum OrderStatus { Placed Confirmed Shipped Delivered Cancelled }
```

- **Implemented schema (P2-012):** [`backend/prisma/schema.prisma`](../backend/prisma/schema.prisma) follows this sketch with refinements: Prisma enums `CheckoutSource` and `DeliveryOption`; `position` on products, variants and order items (keeps Phase 1 ordering); `timestamptz(3)` timestamps; relations/cascades for addresses, wishlist and checkout sessions; indexes on session expiry and cart `updatedAt` for the cleanup jobs.
- **Order numbers** come from a PostgreSQL sequence (`order_number_seq`), formatted `NIV-<year>-<6 digits>` by the shared `formatOrderId`.
- Database **CHECK constraints** (added in migration SQL): `variant.stock >= 0`, `0 < price <= originalPrice`, `cart_item.quantity >= 1`, Buy Now checkout sessions carry a quantity ≥ 1 (cart sessions none), order amounts non-negative with `total = subtotal − discount + deliveryCharge`, order items `quantity >= 1` and `lineTotal = unitPrice × quantity`. Prisma Migrate leaves these and the sequence alone (no drift).
- Product fields that vary by category (`options`, `attributes`, `specifications`) are JSONB, matching the shared `Product` type; relational columns hold everything that is joined, filtered on or constrained.

## 7. REST API

Base path **`/api/v1`**, JSON only. Each endpoint maps to one method of the frontend contract (arch §7.1). 🔒 = customer session required; 👤 = guest or customer.

| Method & path | Contract method | Access |
|---|---|---|
| `GET /health` | — | public |
| `GET /categories` | `catalog.getCategories` | public |
| `GET /products?…` (same params as the listing URLs, arch §13.3) | `catalog.listProducts` | public |
| `GET /products/:slug` | `catalog.getProduct` (+ live stock per variant) | public |
| `GET /products/slugs` | `catalog.getAllProductSlugs` | public |
| `GET /collections/:id?limit=` | `catalog.getCollection` | public |
| `GET /content/pages/:slug` | `content.getInfoPage` | public |
| `GET /auth/session` | `auth.getSession` | 👤 |
| `POST /auth/signup` · `POST /auth/login` · `POST /auth/logout` | `auth.*` | 👤 |
| `GET /cart` | `cart.getCart` | 👤 |
| `POST /cart/items` · `PATCH /cart/items/:variantId` · `DELETE /cart/items/:variantId` | `cart.addItem` · `updateQuantity` · `removeItem` | 👤 |
| `GET /wishlist` · `PUT /wishlist/:productId` · `DELETE /wishlist/:productId` | `wishlist.*` | 🔒 |
| `POST /wishlist/:productId/move-to-cart` | `wishlist.moveToCart` | 🔒 |
| `GET /addresses` · `POST /addresses` · `PUT /addresses/:id` · `DELETE /addresses/:id` · `POST /addresses/:id/default` | `addresses.*` | 🔒 |
| `POST /checkout/buy-now` · `POST /checkout/cart` · `GET /checkout?deliveryOption=` | `checkout.startBuyNow` · `startCartCheckout` · `getCheckout` | 🔒 |
| `POST /orders` | `checkout.placeOrder` | 🔒 |
| `GET /orders` · `GET /orders/:orderNumber` · `POST /orders/:orderNumber/cancel` | `orders.*` | 🔒 |
| `GET /me` · `PATCH /me` | `profile.get` · `profile.update` | 🔒 |

**Error envelope** (all errors):

```json
{ "error": { "code": "INSUFFICIENT_STOCK", "message": "Only 2 left in stock.", "details": { "available": 2, "productName": "…" } } }
```

`code` uses the shared `ApiErrorCode` list (arch §7.3) so the frontend's message mapping keeps working; `message` is the req §28 customer wording from `@nivora/shared/errorMessages` (the same module the UI uses). Two codes were added in P2-010 for API-only situations: `FORBIDDEN` (cross-origin request) and `RATE_LIMITED`.

| Status | Codes |
|---|---|
| 400 | `VALIDATION` (no field details, malformed JSON), `INVALID_QUANTITY`, `INVALID_VARIANT`, `VARIANT_REQUIRED` |
| 401 | `UNAUTHENTICATED`, `INVALID_CREDENTIALS` |
| 403 | `FORBIDDEN` |
| 404 | `NOT_FOUND` (also unknown routes and Prisma "record not found") |
| 409 | `EMAIL_TAKEN`, `OUT_OF_STOCK`, `INSUFFICIENT_STOCK`, `EMPTY_CART`, `ADDRESS_REQUIRED`, `ORDER_NOT_CANCELLABLE` |
| 413 / 415 | `VALIDATION` (body over 100 kb / not JSON) |
| 422 | `VALIDATION` with `details.fields`, `INVALID_ADDRESS` |
| 429 | `RATE_LIMITED` (+ `Retry-After`) |
| 500 | `UNKNOWN` — logged server-side with the request id; the response never contains stack traces or messages |

## 8. Authentication and sessions

Decision (Joseph, 2026-10-06): **database sessions in an HTTP-only cookie.**

- **Passwords:** argon2id hashes; the shared signup schema enforces the rule (≥ 8 chars, a letter and a number). Emails are trimmed and lower-cased.
- **Login/signup:** create a session — 32 random bytes, base64url, sent as cookie `nivora_session`; only its SHA-256 hash is stored (`Session.tokenHash`), so a database leak can't be replayed.
- **Cookie flags:** `HttpOnly`, `Secure` (except plain-http localhost), `SameSite=Lax`, `Path=/`, 30-day expiry, refreshed (sliding) when older than a day.
- **Logout:** deletes the session row and clears the cookie; other data is kept (req §27). Pending Buy Now is cleared.
- **Request handling:** a global middleware resolves the session (hash lookup) and attaches the user; `@UseGuards(SessionGuard)` protects 🔒 routes with `UNAUTHENTICATED`.
- **Login failures** return the generic `INVALID_CREDENTIALS`; login/signup are rate-limited per IP (`@RateLimit` on the routes, `RateLimitGuard`) and per email (counted in the auth service).
- **Test user:** seeded with an argon2 hash of `password123` (req §7.1). Nobody is ever logged in automatically.

## 9. Carts (guest and customer)

Decision (Joseph, 2026-10-06): **guest carts live on the server**, keyed by an anonymous cookie.

- The first guest cart write sets cookie `nivora_cart` (random token; stored hashed in `Cart.guestToken`; `HttpOnly`, `SameSite=Lax`, 30 days).
- `CartOwner` resolution per request: the customer's cart if logged in, otherwise the guest cart from the cookie (created lazily).
- **Merge on login/signup** (req §17.5, D4, D12) in one transaction: the shared `mergeCarts` (sum + cap at live stock), guest cart deleted, `mergedSavedItems` returned to the frontend for the `/cart?merged=1` landing.
- **Every cart read revalidates** lines against current products and stock (shared `assessLine`) and computes totals server-side (shared `summarize`) — the frontend never computes money.
- Guest carts untouched for 30 days are purged by a cleanup job (§19).

## 10. Catalog, search and filters

- **Storage:** products, variants and taxonomy in PostgreSQL (§6), seeded from `@nivora/shared/data`.
- **Query engine (Phase 2 start):** the catalog is small (154 products, no admin editing yet), so the `catalog` module keeps an **in-memory index of product data** loaded at startup and runs the **shared `queryCatalog` pipeline** — exactly the filtering, facets, sorting, search ranking and pagination customers already get in Phase 1. Live **stock is read from the database on every request** (one `SELECT id, stock FROM variants`, ~350 rows) and passed as the stock map, so availability and "In stock only" are always current.
- **Scale-up path (when an admin/seller adds products or the catalog grows):** move filtering to SQL (indexes on `subcategory_id`, `brand`, price), full-text search with a `tsvector` column + GIN index and `pg_trgm` for partial words, and cache invalidation on product writes. The API and response shapes don't change.
- **Server Components** in the frontend fetch these endpoints with Next.js caching (e.g. revalidate a few minutes for listings; product pages remain pre-built and revalidated), while stock comes live from `GET /products/:slug`.

## 11. Inventory, checkout and orders

`Variant.stock` is the **authoritative** stock (Phase 1's "initial stock + adjustments" collapses into one column).

**Place order** (`POST /orders`) — one database transaction:

1. Load the customer's checkout source (pending Buy Now or cart) and the chosen address; re-validate everything (req §24.1): non-empty, variants exist, required options resolved, address valid, quantities ≥ 1.
2. For each line, **conditional decrement**: `UPDATE variants SET stock = stock - $q WHERE id = $id AND stock >= $q`. If any update affects 0 rows, roll back and return `INSUFFICIENT_STOCK` / `OUT_OF_STOCK` with the available quantity. This prevents overselling even with concurrent orders.
3. Recompute totals from current prices (shared `buildOrder`), take the next `order_number_seq` value, insert `Order`, `OrderItem` snapshots and the first `OrderStatusEvent` (`Placed`).
4. Cart checkout: delete the purchased cart lines. Buy Now: clear `CheckoutSession` and leave the cart untouched (req §19).

**Double-submit protection:** the frontend sends an `Idempotency-Key` header with each Place Order attempt; the backend stores it with the order (unique per customer) and returns the existing order on a retry instead of creating a second one.

**Cancel** (`POST /orders/:n/cancel`) — one transaction: allowed only for `Placed`/`Confirmed` (shared `canCancel`); set `Cancelled`, add a status event, and restore stock with `stock = stock + q` — except for seeded sample orders (`isSample`), which never touched stock (req §25.5).

**Status progression** stays out of scope (decision D7). The status-event table is ready for a future fulfilment/admin process.

## 12. Validation and errors

- A small `ZodValidationPipe` validates bodies, params and queries with the **shared Zod schemas** (login, signup, address, profile, cart item, delivery option, listing query). Field messages are the customer wording from req §28, returned in `details.fields` so the existing forms map them onto fields.
- Services throw `ApiError(code, details)` (shared type); a global `ApiExceptionFilter` converts them to the envelope and status codes in §7, and converts Prisma errors (unique violations, not found) into the right codes. Anything else → `UNKNOWN` (500) with the detail only in server logs.

## 13. Security

- **Same-origin by default:** the Next.js app proxies `/api/*` to the backend (Next rewrites), so cookies are first-party and CORS is not needed. If the API is ever served from another origin, CORS is restricted to the frontend origin with credentials.
- **CSRF:** `SameSite=Lax` cookies + mutating routes accept only `application/json` + an `Origin`/`Referer` check against the frontend origin.
- **Headers:** `helmet`. **Rate limits:** auth routes (strict), all routes (generous).
- **Data access:** every customer query is scoped by the session's `userId` (orders, addresses, wishlist, checkout); another customer's order returns `NOT_FOUND` (req §25.4).
- **Secrets:** only in environment variables; `backend/.env` is git-ignored; `.env.example` documents the keys without values. Logs never include passwords, tokens, full addresses or phone numbers.
- **Payments:** still Cash on Delivery only — no card/UPI data is ever accepted or stored (req §23).

## 14. Prisma 7 and Neon specifics

- **Two connection strings:** `DATABASE_URL` = Neon **pooled** endpoint (host contains `-pooler`) for the running API; `DIRECT_URL` = the **direct** endpoint for `prisma migrate` (migrations shouldn't go through the pooler).
- **Prisma 7 changes:**
  - `prisma.config.ts` holds the datasource URL (`DIRECT_URL` for migrations), the migrations path and the seed command (`tsx prisma/seed.ts`).
  - The generator is `provider = "prisma-client"` with a required `output` path; the app imports from the generated folder.
  - A driver adapter is mandatory: `new PrismaClient({ adapter: new PrismaPg({ connectionString: DATABASE_URL }) })` inside `PrismaService` (`onModuleInit` / `onModuleDestroy`).
  - `.env` is loaded explicitly (`dotenv` / `@nestjs/config`).
- **Module format (decided and verified in P2-011): ESM throughout.** Nest 12 is ESM-only and Prisma 7's `prisma-client` generator emits ESM TypeScript (`.js` import suffixes, `import.meta.url`) into `backend/src/generated/prisma` (git-ignored, regenerated on `npm install`/build/typecheck). The shared package stays CommonJS and is imported from ESM through Node's CJS interop.
- **`?schema=` and node-postgres:** `pg` does not understand Prisma's `schema` URL parameter, so `PrismaService` strips it and passes it to `PrismaPg` as the `schema` option; `sslmode=require` is normalised to `verify-full` (what `pg` already does, made explicit ahead of pg v9).
- **Raw SQL must name its schema (found in P2-013):** the adapter's `schema` option qualifies only Prisma's generated queries; `$queryRaw`/`$executeRaw` run with the default `search_path` (`public`), and Neon's pooler rejects a `search_path` startup option. All raw SQL therefore references tables through `prisma.table("orders")` (`qualify()` → `"nivora_test"."orders"`), and ESLint bans `$queryRawUnsafe`/`$executeRawUnsafe`. Without this, test runs would read/write real `public` data.
- **Latency from India (found in P2-011):** a new TLS connection to us-east-2 takes ~2 s and each query ~250 ms. Node's default "happy eyeballs" (250 ms per address) aborted every connection attempt (ETIMEDOUT), so `src/common/network.ts` raises the per-attempt timeout to 2 s. `PrismaService` warms one pooled connection at startup. This strengthens the case for an Asia-region Neon project before launch (§21).
- **Test isolation (decision 2026-10-06):** no separate Neon branch — tests use the **main branch** with their own PostgreSQL schema, `nivora_test` (`?schema=nivora_test` in `backend/.env.test`). Real data stays in `public`; test runs may wipe only `nivora_test`.
- **Region:** the database is in **AWS us-east-2 (Ohio)**. For customers in India, a Neon project in an Asia region (e.g. Singapore/Mumbai) would cut latency — worth deciding before launch (§21).

## 15. Configuration and secrets

Environment variables, validated with Zod at startup (the app refuses to start on a bad config):

| Variable | Example | Purpose |
|---|---|---|
| `DATABASE_URL` | Neon pooled URL | API queries |
| `DIRECT_URL` | Neon direct URL | Migrations |
| `PORT` | `4000` | API port |
| `FRONTEND_ORIGIN` | `http://localhost:3000` | Origin checks / CORS |
| `COOKIE_SECURE` | `false` locally, `true` in production | Cookie `Secure` flag |
| `SESSION_TTL_DAYS` | `30` | Session lifetime |
| `NODE_ENV` | `development` | Behaviour/logging |

The Neon credentials provided by Joseph are stored **only** in `backend/.env` (permissions 600, git-ignored). They have also appeared in chat; rotating the database password before any public deployment is recommended (§21).

## 16. Seeding

`npx prisma db seed` (idempotent upserts):

1. Categories and subcategories (exact req §9 taxonomy).
2. 154 products and 346 variants from `@nivora/shared/data`, with `stock` = the Phase 1 initial stock.
3. Test user Joseph (argon2 hash of `password123`).
4. Joseph's 4 sample orders (`isSample = true`, status history included) and the order sequence advanced past them.

Re-running the seed never duplicates data and never resets live stock or customer data unless run with an explicit `--reset` flag (development only).

**Implementation (P2-013):** `backend/prisma/seed.ts` reads existing rows once, bulk-inserts what is missing (`createMany`) and updates only rows whose catalog fields differ (jsonb compared with sorted keys) — important because each Neon round trip from India costs ~250 ms. Variant `stock` is written on insert only. The test user and sample orders are create-only; the sequence is advanced past the highest order number. `--reset` is refused when `NODE_ENV=production`. `npm run db:check` (`prisma/check-seed.ts`) compares the database with `@nivora/shared/data` field by field (read-only).

## 17. Frontend integration

The frontend changes only in its data layer (arch §21):

1. **HTTP adapters** in `frontend/src/api/http/*` implement every contract with `fetch` (`credentials: "include"`), mapping the error envelope to `ApiError`. `NEXT_PUBLIC_DATA_SOURCE=http` selects them; `mock` remains available.
2. **Next.js rewrites** `/api/:path*` → `${BACKEND_URL}/api/v1/:path*` (same-origin cookies).
3. **Server catalog adapter** calls the backend from Server Components (with `fetch` caching/revalidation); product pages stay pre-built.
4. **Inventory overlay removed**: stock comes from the backend; `useInventory` becomes unnecessary.
5. **Sessions:** `getSession()` calls `GET /auth/session`; optionally `proxy.ts` (Next 16 middleware) redirects guests from protected routes on the server using the presence of the session cookie.
6. **Place Order** sends an `Idempotency-Key`.
7. Every existing frontend check (HTTP suites, journeys rewritten against the API, accessibility, crawl) must pass in `http` mode.

## 18. Testing

Decision (Joseph, 2026-10-06): **Jest** for the backend. Because Nest 12 is ESM-only, backend Jest runs in native ESM mode (`NODE_OPTIONS=--experimental-vm-modules`, ts-jest `useESM`); the shared package's Jest runs as CommonJS.

| Layer | What | How |
|---|---|---|
| Unit | Shared domain rules (pricing, merge, filters, search, orders) | Jest in `packages/shared` (ports the existing scenario scripts) |
| Service | Business flows with a real database | Jest against the `nivora_test` schema of the main database; that schema is migrated and reset per run |
| HTTP (e2e) | Every endpoint: status codes, envelopes, cookies, auth guards | Jest + Supertest on the Nest app |
| Critical | Concurrency: two simultaneous orders for the last unit → exactly one succeeds; cancel restores stock once | e2e |

The Phase 1 journey script (`e2e-journeys`) is re-expressed as an API e2e suite so both phases are held to the same behaviour.

## 19. Observability and operations

- Structured request logs (Nest `Logger`) with a request id; no PII.
- `GET /health` checks the process and a `SELECT 1` on the database.
- Scheduled cleanup: expired sessions and guest carts older than 30 days.
- **Hosting is still open** (arch §23): any Node host for the API (e.g. Render, Railway, Fly.io) + Vercel or similar for Next.js; Neon is already the database.

## 20. Implementation plan

| # | Milestone | Delivers |
|---|---|---|
| B1 | Workspaces + shared package | Root `package.json` with npm workspaces; `packages/shared` (domain, validation, contracts, data, constants) moved out of the frontend; frontend imports updated; **all frontend checks still green** |
| B2 | Backend scaffold | NestJS 12 app, strict TS, ESLint/Prettier, env validation, `/api/v1`, helmet, cookie-parser, rate limiting, error filter, Zod pipe, `/health`; Prisma 7 + adapter-pg wired to Neon; module-format decision verified |
| B3 | Schema + migrations + seed | `schema.prisma` (§6), first migration on Neon, CHECK constraints, order sequence, idempotent seed (catalog, Joseph, sample orders) |
| B4 | Catalog + content API | Categories, listing (shared pipeline + live stock), product details, collections, slugs, info pages |
| B5 | Auth + sessions + profile | Signup/login/logout/session, argon2, cookies, guards, rate limits, `/me` |
| B6 | Cart + wishlist | Guest/customer carts with cookie, merge on login, revalidation, wishlist + move to cart |
| B7 | Addresses + checkout + orders | Address CRUD/default, checkout sessions, transactional place order with conditional stock, idempotency, cancel with restore |
| B8 | Frontend switch-over | HTTP adapters, rewrites, inventory overlay removed, `proxy.ts` (optional), all frontend suites passing in `http` mode |
| B9 | Hardening | Concurrency tests, security review, cleanup jobs, documentation, deployment notes |

Each milestone is verified with Jest + the existing HTTP checks before the next starts, following the same task-by-task workflow as Phase 1. The detailed task list is [`../tasks-phase2.md`](../tasks-phase2.md) (39 tasks, P2-001 – P2-039).

## 21. Open items

| Item | Status |
|---|---|
| Extra libraries in §2.2 | **Approved** (2026-10-06) |
| Test database | **Decided:** `nivora_test` schema in the main branch (no separate branch) |
| Rotate the Neon database password | Recommended before any public deployment (the current one was shared in chat) |
| Neon region | Currently AWS us-east-2; consider an Asia region for Indian customers before launch |
| Hosting for API and frontend | Not decided |
| CommonJS vs ESM for Nest + Prisma 7 | Decided and verified in B2 |
