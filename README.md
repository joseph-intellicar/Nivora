# Nivora

Nivora is a consumer e-commerce web application for India: fashion, home appliances, beauty, toys and mobiles, with Cash on Delivery.

## Repository structure

```
nivora/
├── frontend/          Next.js 16 storefront (App Router)
├── backend/           NestJS 12 REST API + Prisma 7 on Neon PostgreSQL
├── packages/shared/   @nivora/shared — business rules, validation, contracts, catalog data
├── scripts/verify/    Verification suites (HTTP checks, crawl, a11y, journeys, timing)
├── docs/              architecture.md, backend-architecture.md, manual-testing.md
├── requirements.md    Product requirements (source of truth)
├── tasks.md           Phase 1 roadmap (complete)
├── tasks-phase2.md    Phase 2 roadmap: backend + integration
└── conversation.md    Running log of working sessions and decisions
```

## Status

- **Phase 1 (complete):** the storefront on mock data and browser storage. All 65 tasks in [`tasks.md`](tasks.md).
- **Phase 2:** the real backend. NestJS + Prisma + Neon serve the catalog, accounts, carts, wishlist, addresses, checkout and orders, and the storefront uses it through HTTP adapters (`NEXT_PUBLIC_DATA_SOURCE=http`). Progress is tracked in [`tasks-phase2.md`](tasks-phase2.md), and the design is in [`docs/backend-architecture.md`](docs/backend-architecture.md).

Test account: **joseph@example.com / password123** (Joseph has 4 sample orders). Nobody is logged in automatically.

## Quick start

Prerequisites: **Node.js 22** and npm. For `http` mode you also need a PostgreSQL database (Neon).

### 1. Install

```bash
npm install          # one install for all workspaces; builds @nivora/shared and generates the Prisma client
```

### 2a. Frontend only: mock mode (no backend)

```bash
cp frontend/.env.example frontend/.env     # NEXT_PUBLIC_DATA_SOURCE=mock is the default
npm run dev:web                            # http://localhost:3000
```

### 2b. Full stack: http mode

1. **Backend environment:** `cp backend/.env.example backend/.env`, then fill in `DATABASE_URL` (Neon **pooled** URL) and `DIRECT_URL` (direct URL). Never commit this file.
2. **Database:**

   ```bash
   npm run db:migrate   # applies backend/prisma/migrations
   npm run db:seed      # catalog, test user and sample orders (idempotent)
   npm run db:check     # optional: compares the database with the shared catalog
   ```

3. **API:** `npm run dev:api` (http://localhost:4000/api/v1; `curl localhost:4000/api/v1/health`).
4. **Storefront:** in `frontend/.env` set `NEXT_PUBLIC_DATA_SOURCE=http` and `BACKEND_URL=http://localhost:4000`, then run `npm run dev:web`. The browser calls `/api/*` on port 3000, and Next.js proxies it to the API.

`NEXT_PUBLIC_*` values and `BACKEND_URL` are read at build time: restart `dev:web` (or rebuild) after changing them, and give `next build` and `next start` the same `BACKEND_URL`.

## Tests

```bash
npm test             # shared unit → backend unit → backend e2e
npm run lint && npm run typecheck && npm run format:check
```

- The backend e2e suites need `backend/.env.test`: the same URLs with `&schema=nivora_test`, plus `TEST_SCHEMA=nivora_test` and `NODE_ENV=test`. Tests run only against that schema; the guard refuses anything else, so real data in `public` is never touched.
- Browser-level suites live in [`scripts/verify/`](scripts/verify/README.md).

## More

- Frontend: [`frontend/README.md`](frontend/README.md) · backend runbook and API reference: [`backend/README.md`](backend/README.md)
- Architecture: [`docs/architecture.md`](docs/architecture.md) (frontend) · [`docs/backend-architecture.md`](docs/backend-architecture.md) (backend)
- Manual browser checklist: [`docs/manual-testing.md`](docs/manual-testing.md)
