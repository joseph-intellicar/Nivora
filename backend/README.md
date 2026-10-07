# Nivora Backend

The REST API behind the Nivora storefront.

**Stack:** NestJS 12 (ESM) · TypeScript 6 · Prisma 7.10 with `@prisma/adapter-pg` · Neon PostgreSQL 18 · Zod and business rules from `@nivora/shared` · Jest + Supertest.
The design is in [`../docs/backend-architecture.md`](../docs/backend-architecture.md) (barch).

## Setup

From the repository root:

```bash
npm install                       # also builds @nivora/shared and runs `prisma generate`
cp backend/.env.example backend/.env   # then fill in the two Neon URLs
npm run db:migrate                # prisma migrate deploy (uses DIRECT_URL)
npm run db:seed                   # idempotent seed (catalog, Joseph, 4 sample orders)
npm run dev:api                   # http://localhost:4000/api/v1, restarts on change
```

Production: `npm run build -w backend`, then `npm run start -w backend` (or `node backend/dist/main.js`).

## Environment

`backend/.env` is git-ignored. `.env.example` documents every key without values. The app checks every variable at startup and refuses to start on a bad config; the error lists each bad variable without echoing its value.

| Variable             | Default       | Purpose                                                                                                                  |
| -------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `DATABASE_URL`       | —             | Neon **pooled** URL (host contains `-pooler`), used by the API. Add `&schema=<name>` to use a schema other than `public` |
| `DIRECT_URL`         | —             | Neon **direct** URL, used by Prisma Migrate                                                                              |
| `PORT`               | `4000`        | API port                                                                                                                 |
| `FRONTEND_ORIGIN`    | —             | The storefront's origin. Mutating requests from any other origin get 403 (CSRF defence)                                  |
| `COOKIE_SECURE`      | `false`       | `Secure` flag on cookies. **Must be `true` when `NODE_ENV=production`** (enforced)                                       |
| `SESSION_TTL_DAYS`   | `30`          | Session lifetime (sliding)                                                                                               |
| `NODE_ENV`           | `development` | `development` \| `test` \| `production` (JSON logs in production)                                                        |
| `ENV_FILE`           | `.env`        | Which env file to load (`.env.test` for tests). Real environment variables win over the file                             |
| `PRISMA_LOG_QUERIES` | —             | `1` logs every SQL statement with its duration (diagnostics only)                                                        |

## Scripts (`npm run <script> -w backend`)

| Script                                | Purpose                                                                                                                                           |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `start:dev`                           | Watch mode (`nest start --watch`)                                                                                                                 |
| `build` / `start`                     | Production build (also builds `@nivora/shared`) / run `dist/main.js`                                                                              |
| `db:migrate`                          | `prisma migrate deploy`                                                                                                                           |
| `db:seed`                             | `prisma db seed` (idempotent). To empty everything first: `cd backend && npx prisma db seed -- --reset` (development only, refused in production) |
| `db:check`                            | Read-only comparison of the database with `@nivora/shared/data`                                                                                   |
| `test`                                | Unit tests (`src/**/*.spec.ts`)                                                                                                                   |
| `test:e2e`                            | HTTP e2e suites (`test/*.e2e-spec.ts`) against the **`nivora_test`** schema only                                                                  |
| `lint` · `typecheck` · `format:check` | ESLint · `tsc --noEmit` · Prettier                                                                                                                |

### Tests and the `nivora_test` schema

`backend/.env.test` holds the same URLs with `&schema=nivora_test`, plus `TEST_SCHEMA=nivora_test`, `NODE_ENV=test` and `PORT=4100`. Before every e2e run, the global setup:

1. checks that both URLs use `schema=nivora_test` and refuses to run otherwise;
2. runs `prisma migrate deploy`;
3. runs `seed --reset`, on that schema only.

`PrismaService` also refuses `NODE_ENV=test` on any other schema. Real data in `public` is never touched by tests.

## API reference (base path `/api/v1`)

🔒 = session required (401 `UNAUTHENTICATED` otherwise). 👤 = guest or customer. Mutating requests need the frontend `Origin` (or `Referer`) and a JSON body.

| Method & path                                                                                                           | Access | Description                                                                                                                                                                                                                                 |
| ----------------------------------------------------------------------------------------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET /health`                                                                                                           | public | `{ status, db, dbLatencyMs }`. Returns 503 `{ status: "degraded", db: "down" }` when the database is unreachable                                                                                                                            |
| `GET /categories`                                                                                                       | public | The 5 categories with their 24 subcategories                                                                                                                                                                                                |
| `GET /products?…`                                                                                                       | public | Listing: the site's listing parameters (`q`, `brand`, `size`, `price`, `rating`, `discount`, `instock`, `sort`, `page`, `sub`, `category`, …) plus `in_category` / `in_collection` → `ProductListResult` (items, facets, pages). Live stock |
| `GET /products/slugs`                                                                                                   | public | All product slugs (static generation, sitemap)                                                                                                                                                                                              |
| `GET /products/:slug`                                                                                                   | public | Product + `available` (live stock per variant)                                                                                                                                                                                              |
| `GET /collections/:id?limit=`                                                                                           | public | `best-sellers` · `special-offers` · `new-arrivals` in their default sort                                                                                                                                                                    |
| `GET /content/pages/:slug`                                                                                              | public | Info pages (about, contact, help, returns, privacy, terms)                                                                                                                                                                                  |
| `GET /auth/session`                                                                                                     | 👤     | `{ user }` (`null` for guests)                                                                                                                                                                                                              |
| `POST /auth/signup` · `POST /auth/login` · `POST /auth/logout`                                                          | 👤     | Accounts. Login/signup merge the guest cart and return `{ user, mergedSavedItems }`. Rate-limited                                                                                                                                           |
| `GET /cart` · `POST /cart/items` · `PATCH /cart/items/:variantId` · `DELETE /cart/items/:variantId`                     | 👤     | Revalidated `CartView` with server-computed totals. Guests use the `nivora_cart` cookie                                                                                                                                                     |
| `GET /wishlist` · `PUT /wishlist/:productId` · `DELETE /wishlist/:productId` · `POST /wishlist/:productId/move-to-cart` | 🔒     | Wishlist                                                                                                                                                                                                                                    |
| `GET /addresses` · `POST /addresses` · `PUT /addresses/:id` · `DELETE /addresses/:id` · `POST /addresses/:id/default`   | 🔒     | Address book (always exactly one default)                                                                                                                                                                                                   |
| `POST /checkout/buy-now` · `POST /checkout/cart` · `GET /checkout?deliveryOption=`                                      | 🔒     | Start a Buy Now or cart checkout; `CheckoutView`                                                                                                                                                                                            |
| `POST /orders`                                                                                                          | 🔒     | Place a Cash on Delivery order (one transaction, stock-safe). Optional `Idempotency-Key` header: a repeat returns the same order with 200                                                                                                   |
| `GET /orders` · `GET /orders/:orderNumber` · `POST /orders/:orderNumber/cancel`                                         | 🔒     | History (newest first), details, cancel (Placed/Confirmed only; restores stock)                                                                                                                                                             |
| `GET /me` · `PATCH /me`                                                                                                 | 🔒     | Profile: name and optional phone (the email is read-only)                                                                                                                                                                                   |

**Errors** always look like `{ "error": { "code", "message", "details" } }`. The codes come from `@nivora/shared/errors`, and the messages are the customer wording from req §28. Statuses:

| Status | Codes                                                                           |
| ------ | ------------------------------------------------------------------------------- |
| 400    | validation without field details, invalid quantity or variant, variant required |
| 401    | not logged in, invalid credentials                                              |
| 403    | cross-origin request                                                            |
| 404    | not found (including another customer's data)                                   |
| 409    | stock, empty cart, address required, order not cancellable, email taken         |
| 422    | field validation, invalid address                                               |
| 429    | rate limited (with `Retry-After`)                                               |
| 500    | `UNKNOWN` (never with internal details)                                         |

The full table is in barch §7.

## Operations

- **Logs:** one line per request (method, path without query, status, duration, request id). There are no bodies, cookies or customer data in logs. A well-formed incoming `X-Request-Id` is reused.
- **Cleanup:** every hour, expired sessions and guest carts idle for 30 days are deleted (`CleanupService`).
- **Security:** helmet headers; Origin check plus JSON-only bodies on mutations; rate limits (300/min/IP, login 30/min/IP, 5 failed logins per email per 15 min); sessions are 32-byte tokens stored as SHA-256 hashes. Keep the API behind the Next.js proxy or the host's load balancer, because the IP limits trust one proxy hop.

## Troubleshooting

- **`ETIMEDOUT` connecting to Neon:** Node's happy-eyeballs gives each address 250 ms by default, which is too short for high-latency links. `src/common/network.ts` raises it to 2 s; keep that import first in `main.ts`.
- **Raw SQL hits the wrong schema:** the adapter's schema option only applies to Prisma's generated queries. Raw SQL must name tables with `prisma.table("orders")`, and ESLint bans the `*Unsafe` raw APIs.
- **Slow responses:** latency is roughly (database round trips) × (network round trip). From India to us-east-2 that is ~290 ms per round trip; see `scripts/verify/perf.mjs` and `query-count.sh`. An Asia-region database is the main fix (barch §21).
- **Storefront shows "Something went wrong" in `http` mode:** check that `BACKEND_URL` is the same for `next build` and `next start`. Server-side API failures are logged by the frontend as `Nivora API unreachable: …`.
