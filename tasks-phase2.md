# Nivora — Implementation Tasks (Phase 2: Backend + Integration)

| | |
|---|---|
| **Based on** | [`docs/backend-architecture.md`](docs/backend-architecture.md) (barch §) · [`docs/architecture.md`](docs/architecture.md) (arch §) · [`requirements.md`](requirements.md) (req §) |
| **Scope** | Build the NestJS + Prisma + Neon backend in `backend/`, share business rules through `packages/shared`, and switch the Next.js frontend from the mock data layer to the real API |
| **Phase 1 roadmap** | [`tasks.md`](tasks.md) (complete) |
| **Last updated** | 2026-10-06 |

This roadmap adds no new product requirements: the backend implements the behaviour Phase 1 already delivers (and verified) in the mock data layer, now on a real server and database.

---

## How we work through this file

Same workflow as Phase 1 (see [`tasks.md`](tasks.md)):

1. **One task at a time**, in order, after its dependencies are done.
2. **Claude runs the 🤖 verification** and fixes failures before marking `[x]`.
3. Claude updates this file (status + verification log) and [`conversation.md`](conversation.md).
4. Claude reports results and the **👤 checks** for Joseph, then waits before the next task (unless Joseph asks for several).

| Marker | Meaning |
|---|---|
| `[ ]` | Not started |
| `[~]` | In progress |
| `[x]` | Done: implemented **and** Claude's verification passed |

| Symbol | Who | How |
|---|---|---|
| 🤖 | Claude | `npm run lint` / `typecheck` / `build` for each workspace; **Jest** unit and e2e suites (Supertest) against the **`nivora_test` schema** of the main database; HTTP checks with `curl`; `psql` read-only queries; headless-Chrome screenshots; the Phase 1 HTTP suites, journeys, accessibility audit and link crawl re-run in `http` mode |
| 👤 | Joseph | Browser walkthroughs ([`docs/manual-testing.md`](docs/manual-testing.md)), Neon console actions, approvals |

**Standard checks** (every code task): lint, typecheck and build pass in every affected workspace, and all existing test suites stay green.

**Secrets rule:** connection strings live only in `backend/.env` and `backend/.env.test` (same main branch, `nivora_test` schema), never in docs, code or commits.

### Stage overview

| Stage | Name | Tasks | barch milestone |
|---|---|---|---|
| P0 | Prerequisites | P2-001 | — |
| P1 | Workspaces + shared package | P2-002 – P2-007 | B1 |
| P2 | Backend scaffold | P2-008 – P2-011 | B2 |
| P3 | Database: schema, migrations, seed, test harness | P2-012 – P2-014 | B3 |
| P4 | Catalog + content API | P2-015 – P2-017 | B4 |
| P5 | Authentication, sessions, profile | P2-018 – P2-020 | B5 |
| P6 | Cart + wishlist | P2-021 – P2-023 | B6 |
| P7 | Addresses, checkout, orders | P2-024 – P2-028 | B7 |
| P8 | Frontend integration | P2-029 – P2-034 | B8 |
| P9 | Hardening, docs, sign-off | P2-035 – P2-039 | B9 |

### Progress

**39 / 39 tasks done** (👤 Joseph's walkthrough and sign-off pending).

---

## Stage P0 — Prerequisites

- [x] **P2-001 — Approvals, test database and environment**
  - **Goal:** Everything the build depends on is decided and reachable.
  - **Depends on:** —
  - **Requirements:** barch §2.2, §14, §15, §18, §21
  - **Implementation notes:**
    - Joseph approves (or adjusts) the extra libraries in barch §2.2: argon2, cookie-parser, helmet, @nestjs/throttler, @nestjs/config + dotenv, supertest, tsx.
    - ~~Joseph creates a Neon test branch~~ → **Decision (Joseph):** use the **main branch**. Tests get their own schema, `nivora_test`, configured in `backend/.env.test` (git-ignored); real data stays in `public`.
    - `backend/.env` already holds `DATABASE_URL` (pooled) and `DIRECT_URL` (direct) — re-verify.
  - **Acceptance criteria:** libraries approved; `.env` and `.env.test` present, git-ignored, and both databases reachable.
  - **Verification:**
    - 🤖 `psql` read-only `select version()` on main (pooled + direct); schema creation allowed (rolled-back check).
    - 🤖 `git check-ignore` confirms both env files are ignored; `grep` confirms no connection string in any tracked file.
    - 👤 Approve the library list; decide the test database (chosen: `nivora_test` schema in the main branch).
  - **Verification log:** Claude: ✅ 2026-10-06 — Joseph approved all extra libraries (argon2, cookie-parser, helmet, @nestjs/throttler, @nestjs/config + dotenv, supertest, tsx) and chose the main branch for tests. `psql`: pooled and direct URLs both reach PostgreSQL 18.6; the DB user can create schemas and tables (checked inside a rolled-back transaction — only `public` exists afterwards). Created `backend/.env.test` (same URLs + `schema=nivora_test`, mode 600); `git check-ignore` confirms `.env` and `.env.test` are ignored; no connection string in any tracked file (`.env.example` holds placeholders only). barch §2.2, §14, §18, §21 updated · Manual: ✅ 2026-10-06 (approvals given in chat)

## Stage P1 — Workspaces + shared package

- [x] **P2-002 — Root npm workspaces**
  - **Goal:** One repository-level install for frontend, backend and shared code.
  - **Depends on:** P2-001
  - **Requirements:** barch §3
  - **Implementation notes:**
    - Root `package.json` (`private: true`, `workspaces: ["frontend", "backend", "packages/*"]`) with convenience scripts (`dev:web`, `dev:api`, `lint`, `typecheck`, `test`, `build` running across workspaces via `-ws`/`-w`).
    - One root `package-lock.json` replaces `frontend/package-lock.json`.
    - `.gitignore` updated for the new layout (generated Prisma client, `dist/`, coverage).
  - **Acceptance criteria:** `npm install` at the root installs everything; `npm run dev -w frontend` still serves the site unchanged.
  - **Verification:**
    - 🤖 Root install; frontend lint/typecheck/build; only one lockfile in the repo.
    - 🤖 Frontend HTTP suites (categories, product, SEO) still pass.
  - **Verification log:** Claude: ✅ 2026-10-06 — root `package.json` (`private`, workspaces `packages/*` + `frontend`; `backend` joins at P2-008 when it gets its `package.json`) with `dev:web`, `build`, `lint`, `typecheck`, `test`, `format:check` across workspaces. Root `npm install` OK; `frontend/package-lock.json` and `frontend/node_modules` removed — `./package-lock.json` is the only lockfile. Frontend lint 0 issues, typecheck 0 errors, `next build` clean (no workspace-root warning). HTTP suites check-035 (categories), check-040 (product details) and check-039 (SEO off) PASS. `.gitignore` covers `packages/*/dist`, `backend/dist`, the generated Prisma client. ⚠ A running `next dev` must be restarted after the move.

- [x] **P2-003 — Create `packages/shared` (`@nivora/shared`)**
  - **Goal:** A buildable TypeScript package both apps can import.
  - **Depends on:** P2-002
  - **Requirements:** barch §3
  - **Implementation notes:**
    - `packages/shared/package.json` with explicit `exports` (`./domain/*`, `./contracts`, `./data/*`, `./config/*`), strict `tsconfig`, build to `dist/` with type declarations.
    - Next.js consumes it via `transpilePackages: ["@nivora/shared"]`; Nest consumes the built output (decided with the module-format choice in P2-011).
    - No framework dependencies (React, Next, Nest) allowed in the package — enforced by lint.
  - **Acceptance criteria:** an empty placeholder export builds and is importable from both a frontend file and a Node script.
  - **Verification:**
    - 🤖 Package build; a scratch import test from frontend (`next build`) and from Node.
  - **Verification log:** Claude: ✅ 2026-10-06 — `packages/shared` (`@nivora/shared`): `exports` `"./*"` → `dist/*.js` + `dist/*.d.ts` (covers `domain/*`, `contracts`, `data/*`, `config/*`), strict `tsconfig` (ES2023, no DOM), `build` → `dist/` with declarations + source maps. **How each app consumes it:** the frontend's tsconfig `paths` maps `@nivora/shared/*` to the package's TypeScript source, so Next compiles it like app code (fast refresh, no watch build needed) plus `transpilePackages`; Node/Nest use the built CommonJS `dist/`. The package has no `"type"` field (Turbopack rejects ESM source under `"type": "commonjs"`; Node still loads `dist` as CommonJS). Its `lint` script rejects React/Next/Nest/Prisma/Zustand/TanStack and `@/` imports (negative test: a React import fails lint). Checks: a scratch `/shared-check` page imported the placeholder → `next build` OK and the page rendered `shared:@nivora/shared`; Node `require` and ESM `import` from `dist` both OK; package typecheck 0 errors. Scratch page removed and rebuilt.

- [x] **P2-004 — Move domain rules, validation, constants and listing params into shared**
  - **Goal:** Business rules exist once (barch §3, §4).
  - **Depends on:** P2-003
  - **Requirements:** barch §3, §10, §12; arch §6, §13
  - **Implementation notes:**
    - Move `frontend/src/domain/*` (types, pricing, stock, cart, catalog, filters, sort, search, orders, validation), `config/constants.ts`, `config/indianStates.ts` and `features/catalog/listingParams.ts` (the backend's `GET /products` parses the same parameters) into `packages/shared/src`.
    - Update every frontend import (`@/domain/...` → `@nivora/shared/domain/...`); adjust ESLint boundary rules accordingly.
    - Pure move — no behaviour changes.
  - **Acceptance criteria:** frontend builds and behaves identically; nothing left in `frontend/src/domain`.
  - **Verification:**
    - 🤖 Frontend lint/typecheck/build; Phase 1 domain suites (pricing/filters/search, cart/orders/validation, listing params, variant logic) pass against the shared package.
  - **Verification log:** Claude: ✅ 2026-10-06 — moved `domain/*` (10 files), `config/constants.ts`, `config/indianStates.ts` and `features/catalog/listingParams.ts` (→ `domain/listingParams.ts`) into `packages/shared/src`; also `lib/format.ts` (→ `lib/format.ts`), because `domain/filters` uses `formatPrice` for price-bucket labels — it is pure `Intl` code. Internal imports became relative; every frontend import rewritten to `@nivora/shared/...` (no `@/domain`, `@/config/constants`, `@/config/indianStates`, `@/lib/format` or `listingParams` relative imports left; `frontend/src/domain` gone). ESLint: the old `src/domain` block removed (purity is now enforced by the shared package's own lint), and a new rule forbids reaching into `packages/shared` by relative path. `.prettierrc` moved to the repo root so all workspaces share it; shared got `format`/`format:check`. Checks: frontend lint 0, typecheck 0, `next build` OK; shared typecheck 0, import guard OK (14 files), Prettier clean in both, `dist` build OK and `require("@nivora/shared/domain/pricing")` works from Node. Phase 1 suites against the shared package: check-013/015/016/017/018/019/020/021/022/023/024/034/041, check-stage3, check-delivery, e2e-journeys — **all PASS**; catalog data-quality 154 products / 346 variants ALL PASS; HTTP check-035, check-040, check-039 PASS. `docs/architecture.md` §5 notes the new locations.

- [x] **P2-005 — Move contracts, error types and catalog data into shared**
  - **Goal:** Request/response types and seed data shared by both apps.
  - **Depends on:** P2-004
  - **Requirements:** barch §3, §7, §16; arch §7.1, §7.3
  - **Implementation notes:**
    - `api/contracts.ts` types and `ApiError`/`ApiErrorCode` → `@nivora/shared/contracts`; frontend `src/api` re-exports for minimal churn.
    - `frontend/src/data/*` (categories, collections, products, seed users/orders, info pages) → `@nivora/shared/data`; the frontend mock adapters and server catalog import from there.
    - Keep the lazy loading of product data in the browser mock adapter (arch §19).
  - **Acceptance criteria:** mock mode works exactly as before; the catalog is still a separate lazily loaded chunk.
  - **Verification:**
    - 🤖 Catalog data-quality suite and seed-order checks pass from the new location.
    - 🤖 Bundle check: product catalog not in any initial JS (as in TASK-063).
  - **Verification log:** Claude: ✅ 2026-10-06 — `api/contracts.ts` → `@nivora/shared/contracts`, `api/errors.ts` → `@nivora/shared/errors` (all frontend imports point straight at the package rather than going through re-export shims, so there is one source of truth), `frontend/src/data/*` → `@nivora/shared/data/*` (`frontend/src/data` gone). `INFO_PAGES`/`InfoPageSlug` moved from `config/routes.ts` to `@nivora/shared/config/infoPages` (the info-page content needs the slug type; path builders stay in the frontend). Explicit export `./data/products` → `dist/data/products/index.js` for Node. ESLint: the "data only inside `src/api`" rule and the `client-boundary` rule now target `@nivora/shared/data`. Checks: frontend lint 0, typecheck 0, build OK; shared typecheck 0, guard OK (28 files), Prettier clean; Node `require` of products (154), seed orders (NIV-2026-000001..4) and `ApiError` from `dist` OK. Catalog data-quality: 154 products / 346 variants ALL PASS; check-015 (seed users/orders/states/info pages) ALL PASS; all other Phase 1 node suites + journeys ALL PASS; HTTP check-035/040/039 PASS. **Bundle:** the catalog text appears in exactly one static chunk, and that chunk is not among the initial scripts of `/`, `/c/fashion/men`, `/cart`, `/checkout` or a product page — still lazily loaded.

- [x] **P2-006 — Shared package unit tests (Jest)**
  - **Goal:** The Phase 1 scenario scripts become permanent automated tests.
  - **Depends on:** P2-005
  - **Requirements:** barch §18
  - **Implementation notes:**
    - Jest in `packages/shared`; port the scenario checks for pricing/delivery, stock, filters/facets/sort/search, cart merge/line issues, order building/cancel, Zod schemas and messages, listing params, variant selection rules.
    - `npm test -w packages/shared` in CI-style root script.
  - **Acceptance criteria:** every rule verified in Phase 1 has a Jest test; all pass.
  - **Verification:**
    - 🤖 Jest run with a coverage summary for `domain/`.
  - **Verification log:** Claude: ✅ 2026-10-06 — Jest 30 + ts-jest (`jest.config.js`, `tsconfig.test.json`; tests in `src/__tests__`, excluded from `dist`). `features/product/variantSelection.ts` moved to `@nivora/shared/domain/variantSelection` (pure; the backend needs the same "which option is missing" rule) and its 3 frontend importers updated. **7 suites, 89 tests, all pass:** `data` (taxonomy, 154/346 catalog quality, stock/price scenario coverage, seed orders recomputed, states, info pages), `catalog` (delivery/summary/discount, stock, listing price, filters/facets AND/OR, sort, search incl. plurals/accents/multi-word, collections, pagination), `cartOrders` (lines, quantity checks, merge, line issues, build/snapshot/cancel/canCancel/summary), `validation` (all req §28 messages; signup/login/address/profile/cart input), `listingParams` (parse/serialise round trips, garbage, price ranges, clear-all, collection default sort), `variantSelection` (all check-041 rules), `errorsFormat` (ApiError, ₹ grouping, IST dates). Mutation check: changing the free-delivery threshold 499→500 fails 1 test. **Coverage** (`domain/`, `lib/`, `errors`): statements 97.7%, branches 88.5%, functions 98.1%, lines 98.5%. Test typecheck 0, import guard OK, Prettier clean; root `npm test` runs the suite. UI-only rules (error-message wording, filter config) stay covered by the frontend scratch suites (check-018, check-034).

- [x] **P2-007 — Frontend regression after the move**
  - **Goal:** Prove the restructure changed nothing for customers.
  - **Depends on:** P2-006
  - **Requirements:** req §34
  - **Implementation notes:** Re-run every Phase 1 check against a fresh production build in mock mode.
  - **Acceptance criteria:** identical results to the end of Phase 1.
  - **Verification:**
    - 🤖 HTTP suites (categories, product details, SEO on/off), link crawl, accessibility audit, journeys script, protected-route check; screenshots of Home and a product page.
  - **Verification log:** Claude: ✅ 2026-10-06 — clean `rm -rf .next && next build` (21 routes, no warnings), Prettier clean. HTTP: check-035 (categories), check-040 (product details), check-057 (discovery), check-039 (SEO off), a11y audit — ALL PASS; crawl: 209 URLs all 200, no broken links, all 154 products / 5 categories / 24 subcategories / 6 info pages reachable from Home. Protected routes: the TASK-060 guard check (skeleton, no customer data in visible HTML, noindex) ALL PASS on all 7 protected URLs. The older check-stage7-11 script flagged `/account/orders` and `/account/addresses` because their static `<h1>` text sits in the RSC payload; it predates the TASK-060 rule (visible HTML only), neither page changed in Phase 2 (mtimes before P2-002), so the script was aligned → ALL PASS. Node suites in mock mode: check-018/020/021/022/023/024/034/041, check-stage3, check-delivery, e2e-journeys ALL PASS; shared Jest 89/89. Screenshots of Home (1280) and the Oxford shirt page (1280 + 375) match Phase 1.

## Stage P2 — Backend scaffold

- [x] **P2-008 — Scaffold the NestJS app**
  - **Goal:** A clean NestJS 12 workspace in `backend/`.
  - **Depends on:** P2-007
  - **Requirements:** barch §2.1, §3
  - **Implementation notes:**
    - Nest CLI scaffold (npm), strict TypeScript, ESLint + Prettier aligned with the frontend, Jest wired, scripts (`start:dev`, `build`, `lint`, `typecheck`, `test`, `test:e2e`).
    - Remove starter controller/service; add `src/modules/`, `src/common/`, `src/config/`, `src/prisma/` folders.
  - **Acceptance criteria:** `npm run start:dev -w backend` serves on port 4000.
  - **Verification:**
    - 🤖 Lint/typecheck/build; `curl :4000` responds; Jest runs (empty suite passes).
  - **Verification log:** Claude: ✅ 2026-10-06 — **Findings:** Nest 12 is ESM-only (`"type": "module"` in every `@nestjs/*` package), its scaffold defaults to Vitest + oxlint, and `@nestjs/cli`/`@nestjs/schematics` require TypeScript ≥ 6. **Decisions:** the backend is an ES module app (`module: nodenext`, `.js` import suffixes); we keep the approved **Jest** (native ESM: ts-jest `useESM` + `--experimental-vm-modules`) and ESLint (typescript-eslint + Prettier, root `.prettierrc`); the whole repo moved to **TypeScript ~6.0** (one compiler) — the shared package switched from the deprecated `node10` to `node16` resolution and declares `types: ["node"]` (TS 6 no longer auto-includes `@types`). Recorded in barch §2.1 and §18. Scaffold written by hand from a reference `nest new` (no nested git/lockfile): `package.json` (scripts `start:dev`, `build` (+ `prebuild` builds shared), `start`, `typecheck`, `lint`, `format(:check)`, `test`, `test:e2e`), `tsconfig`(+`.build`), `nest-cli.json`, `jest.config.js`, `test/jest-e2e.config.js`, `eslint.config.js` (backend may not import frontend code or reach into `packages/shared` by path), `src/main.ts` (port `PORT` ‖ 4000), empty `AppModule`, folders `src/modules`, `src/common`, `src/config`, `src/prisma`. `backend` added to the root workspaces (+ `dev:api`). Checks: typecheck 0, lint 0, Prettier clean, `nest build` OK; `npm run start:dev -w backend` → "Found 0 errors" and `curl :4000/` answers (Nest 404 JSON); unit Jest (no tests yet) exits 0; e2e Jest boots the app with Supertest → 1/1 pass. Re-verified after the TS 6 move: shared typecheck/build + 89 tests, frontend typecheck + lint OK. `npm audit`: 5 high findings, all in dev-only lint tooling (braces/micromatch via `eslint-config-next`) → triage in P2-035.

- [x] **P2-009 — Config, bootstrap and cross-cutting concerns**
  - **Goal:** Production-shaped app wiring.
  - **Depends on:** P2-008
  - **Requirements:** barch §4, §13, §15, §19
  - **Implementation notes:**
    - Env schema (Zod) via `@nestjs/config` — refuse to start on bad config (`DATABASE_URL`, `DIRECT_URL`, `PORT`, `FRONTEND_ORIGIN`, `COOKIE_SECURE`, `SESSION_TTL_DAYS`, `NODE_ENV`).
    - `main.ts`: global prefix `/api/v1`, `helmet`, `cookie-parser`, request id, structured logger, `@nestjs/throttler` defaults, JSON-only body parsing, Origin check for mutating requests.
  - **Acceptance criteria:** missing/invalid env → clear startup error; security headers present.
  - **Verification:**
    - 🤖 Start with a broken env (expect failure message), then valid; `curl -I` shows helmet headers; a cross-origin POST is rejected.
  - **Verification log:** Claude: ✅ 2026-10-06 — `src/config/env.ts` (Zod: `NODE_ENV`, `PORT`=4000, `DATABASE_URL`/`DIRECT_URL` postgresql URLs, `FRONTEND_ORIGIN` origin-only (trailing slash normalised), `COOKIE_SECURE`, `SESSION_TTL_DAYS`=30) via `@nestjs/config` (`ENV_FILE` picks `.env.test` for tests; real env vars win); typed `AppConfig`. `app.setup.ts` (`configureApp`, shared by `main.ts` and e2e): prefix `/api/v1`, helmet, `x-powered-by` off, `trust proxy` 1, request-id + one-line request log (method, path without query, status, ms — no bodies/cookies), JSON-only body parser (100 kb), cookie-parser, shutdown hooks; production uses Nest's JSON logger. `OriginCheckMiddleware` (Nest middleware so rejections reach the exception filter): mutating requests need Origin (or Referer) = `FRONTEND_ORIGIN` (403) and a JSON body (415). **Rate limiting:** `@nestjs/throttler` replaced by an in-house `RateLimitGuard` + `@RateLimit` (throttler is CommonJS and can't load ESM-only Nest 12 under Jest on Node 22) — 300/min/IP default + stricter per-route buckets, 429 + `Retry-After`; barch §2.2/§13 updated. `.env`, `.env.test` (PORT 4100, NODE_ENV test) and `.env.example` gained the new keys. **Checks:** broken env → exits 1 with `Invalid environment configuration:` listing each variable and problem, no values echoed; valid start → `curl -I` shows CSP, HSTS, nosniff, X-Frame-Options, COOP/CORP, Referrer-Policy, X-Request-Id, no X-Powered-By; cross-origin POST 403, no-Origin POST 403, same-origin (Origin or Referer) passes, form body 415, GET from another origin allowed; X-Request-Id reused when well-formed, replaced otherwise; logs show `/api/v1/...` without the query string. Jest: unit 8/8 (env ×5, rate limit ×3: per-route limit + Retry-After, window reset, 300/min default), e2e 6/6 (headers/request id, origin rules, JSON only). Lint 0, typecheck 0, Prettier clean. Note: a live 429 is exercised once a real route exists (P2-011 `/health`).

- [x] **P2-010 — Validation pipe and error envelope**
  - **Goal:** Every error looks the same and maps to the shared codes.
  - **Depends on:** P2-009
  - **Requirements:** barch §7, §12; req §28
  - **Implementation notes:**
    - `ZodValidationPipe` using shared schemas → `VALIDATION`/`INVALID_ADDRESS` with `details.fields`.
    - `ApiExceptionFilter`: `ApiError` → `{ error: { code, message, details } }` + HTTP status table (barch §7); Prisma known errors mapped; anything else → `UNKNOWN` 500 with no internals leaked.
  - **Acceptance criteria:** the error envelope and status codes match barch §7 for every code.
  - **Verification:**
    - 🤖 Jest unit tests for the filter (each `ApiErrorCode` → status + message) and the pipe (field messages from req §28).
  - **Verification log:** Claude: ✅ 2026-10-06 — **Shared:** customer wording moved from `frontend/src/lib/errorMessages.ts` to `@nivora/shared/errorMessages` and the mock `validate()` helper to `@nivora/shared/validate` (API and UI now produce identical req §28 text; 15 frontend imports updated); `API_ERROR_CODES` list + `isApiErrorCode`; new codes `FORBIDDEN` and `RATE_LIMITED` with friendly messages. **Backend:** `ApiExceptionFilter` (global `APP_FILTER`) → `{ error: { code, message, details } }` with the status table now in barch §7 (field errors 422; framework 404/405 → NOT_FOUND, 403 → FORBIDDEN, 400/413/415 → VALIDATION keeping the precise status, Prisma P2001/P2018/P2025 → NOT_FOUND, everything else → UNKNOWN 500 logged with request id, never leaked); `ZodValidationPipe(schema, "VALIDATION" | "INVALID_ADDRESS")`; Origin check and rate limiter now throw `ApiError` (`FORBIDDEN`, `RATE_LIMITED`). **Tests:** shared Jest 107/107 (+18: every req §28 row, all codes have non-technical messages, `validate`/`fieldErrors`); backend unit 35/35 (filter: all 17 codes → status + message, details, 422, framework/body-parser/Prisma mapping, no leaks; pipe: trimming, req §28 field messages, INVALID_ADDRESS, missing body); backend e2e 12/12 (pipe 422 + success, malformed JSON 400 with no parser text, 113 kb body 413, unknown route/cross-origin/form body envelopes, crash → UNKNOWN 500 without internals, live 429 + Retry-After). Live server: `/api/v1/nope` and a cross-origin POST return the envelope. Frontend typecheck/lint OK; mock suites check-018/020–024, check-stage3, journeys ALL PASS.

- [x] **P2-011 — Prisma 7 on Neon + health endpoint**
  - **Goal:** The app talks to Neon through Prisma.
  - **Depends on:** P2-010
  - **Requirements:** barch §14, §19
  - **Implementation notes:**
    - `prisma.config.ts` (schema path, `DIRECT_URL` for migrate, seed command), generator `prisma-client` with `output`, `PrismaService` with `@prisma/adapter-pg` on the pooled `DATABASE_URL`.
    - **Decide and verify the module format** (Prisma client generated as CommonJS vs Nest as ESM) — record the decision in barch §14.
    - `GET /api/v1/health` → `{ status: "ok", db: "ok" }` via `SELECT 1`.
  - **Acceptance criteria:** health is green against Neon; shutdown closes connections cleanly.
  - **Verification:**
    - 🤖 `curl /api/v1/health`; Jest e2e for health; `psql` shows the connection from the app during the call.
  - **Verification log:** Claude: ✅ 2026-10-06 — Prisma **7.10.0** (`prisma`, `@prisma/client`, `@prisma/adapter-pg` pinned to 7.x; npm `latest` is 8.0 RC) + `dotenv` 18 + `tsx`. `prisma.config.ts` (schema/migrations paths, seed `tsx prisma/seed.ts`, `DIRECT_URL` datasource, `.env` or `ENV_FILE`; datasource optional so `prisma generate` works on a fresh clone), generator `prisma-client` → `src/generated/prisma`; scripts `postinstall`/`pretypecheck`/`prebuild` run `prisma generate`. **Module format decided: ESM throughout** (barch §14). `PrismaService` (global `PrismaModule`): `PrismaPg` pool (max 10, `application_name=nivora-api`), `?schema=` moved to the adapter option, `sslmode` made `verify-full`, warm-up `SELECT 1` on start (warns, doesn't crash, if the DB is down), `$disconnect` on shutdown. `GET /api/v1/health` → `{status:"ok",db:"ok"}` (`no-store`), 503 `{status:"degraded",db:"down"}` + a warning log on failure. **Found & fixed:** every Node connection to Neon timed out (ETIMEDOUT) — Node's happy-eyeballs 250 ms per-address limit vs ~400 ms RTT to us-east-2 (proved: default 0/8 connects, 2 s attempt timeout 8/8); `src/common/network.ts` sets 2 s, imported first by `main.ts` and the test setup. **Checks:** live `curl /api/v1/health` → 200 ok (first call 2.0 s before warm-up was added, then ~0.25–0.32 s); `psql` `pg_stat_activity` shows the `nivora-api` connection; SIGTERM → "Database connections closed", port freed; `prisma migrate status` reaches Neon via the direct URL. Jest: unit 37/37 (+`splitSchema` ×2), e2e 15/15 (+health ok/no-store, schema `nivora_test` from `.env.test`, simulated outage → 503). Lint 0, typecheck 0, Prettier clean.

## Stage P3 — Database: schema, migrations, seed, test harness

- [x] **P2-012 — Prisma schema and first migration**
  - **Goal:** The full data model in Neon.
  - **Depends on:** P2-011
  - **Requirements:** barch §6, §11
  - **Implementation notes:**
    - All models from barch §6 (users, sessions, taxonomy, products, variants, carts, wishlist, addresses, checkout sessions, orders, order items, status events, idempotency key).
    - Migration SQL adds CHECK constraints (`stock >= 0`, `quantity >= 1`, totals ≥ 0) and `order_number_seq`.
    - Indexes per barch §6; snake_case tables via `@@map`.
  - **Acceptance criteria:** `prisma migrate dev` applies cleanly on Neon (direct URL) to `public` and to the `nivora_test` schema.
  - **Verification:**
    - 🤖 `psql \d` on key tables shows columns, constraints, indexes and the sequence; an INSERT violating `stock >= 0` is rejected (in a rolled-back transaction).
  - **Verification log:** Claude: ✅ 2026-10-06 — `prisma/schema.prisma`: 14 models (users, sessions, addresses, categories, subcategories, products, variants, carts, cart_items, wishlist_items, checkout_sessions, orders, order_items, order_status_events) + enums `OrderStatus`, `CheckoutSource`, `DeliveryOption`; snake_case tables; `position` columns, `timestamptz(3)`, cascades for customer-owned rows; indexes per barch §6 plus session expiry / cart `updatedAt` for cleanup. Migration `20261006143428_init` (generated `--create-only`, then hand-extended): 6 CHECK constraints (stock ≥ 0; 0 < price ≤ MRP; cart quantity ≥ 1; Buy Now session shape; order amounts ≥ 0 and total = subtotal − discount + delivery; order-item quantity/price/line total) and `order_number_seq`. **Checks:** `prisma migrate dev` applied cleanly to `public` and (via `.env.test`) to `nivora_test`; a second `migrate dev` → "Already in sync" (no drift from the hand-written SQL). `psql`: both schemas have 15 tables (14 + `_prisma_migrations`), the sequence and 6 CHECK constraints; `\d variants`/`\d orders` show columns, indexes, CHECKs and FKs. In a rolled-back transaction in `nivora_test`: stock −1, price > MRP, cart quantity 0, a plain over-decrement and inconsistent order totals were each rejected by their CHECK; the guarded `stock >= q` decrement updated 0 rows; `nextval` returned 1, 2 (sequences are non-transactional; the test harness resets it). No rows left behind. barch §6 updated.

- [x] **P2-013 — Idempotent seed**
  - **Goal:** The database holds the same catalog, test user and sample orders as Phase 1.
  - **Depends on:** P2-012
  - **Requirements:** barch §16; req §7.1, §9, §15, §25.5
  - **Implementation notes:**
    - `prisma/seed.ts` (run via `tsx`): 5 categories / 24 subcategories, 154 products / 346 variants (`stock` = Phase 1 initial stock), Joseph (argon2 hash of `password123`), 4 sample orders (`isSample`), sequence advanced past them.
    - Upserts only; never resets live stock or customer data unless `--reset` (dev only).
  - **Acceptance criteria:** seeding twice gives identical counts; data matches the shared catalog exactly.
  - **Verification:**
    - 🤖 `psql` counts (5/24/154/346/1 user/4 orders); a script compares every product and variant in the DB with `@nivora/shared/data`; second seed run changes nothing.
  - **Verification log:** Claude: ✅ 2026-10-06 — `prisma/seed.ts` (tsx; `npm run db:seed`): taxonomy → products → variants (stock on insert only) → Joseph (argon2id via `src/modules/auth/password.ts`) → 4 sample orders with items + status history (`isSample`, no stock change) → `order_number_seq` advanced; bulk `createMany` + diff-only updates (≈15 s first run over the ~250 ms link, a few reads afterwards); `--reset` (TRUNCATE + sequence restart) refused in production. `prisma/check-seed.ts` (`npm run db:check`) compares taxonomy, all products (every field incl. category, rating, dates, JSON) and variants, the test user (argon2id hash verifies `password123`) and sample orders (items, totals, address, history) with `@nivora/shared/data`. **Found & fixed:** raw SQL ignored the adapter's schema option, so the first test-schema seed read `public`'s sequence — no writes to `public` happened (verified 0 rows, sequence untouched) — fixed with `qualify()`/`prisma.table()` for all raw SQL + an ESLint ban on `*Unsafe` raw APIs (barch §14). **Checks:** `nivora_test` and `public` each seeded twice → first run `categories+=5 subcategories+=24 products+=154 variants+=346 users+=1 orders+=4`, second run "nothing to change"; `psql` public: 5/24/154/346/1/4, stock Σ 7180 = shared initial stock, sequence at 4 (next NIV-…-000005); `db:check` ✓ on both schemas. Drift drill in `nivora_test`: changed a price + stock → checker reported the price, seed repaired it (`variants~=1`) and kept the live stock; `--reset` rebuilt everything; `public` row counts unchanged throughout test-schema runs. Unit tests 39/39 (+`qualify` ×2).

- [x] **P2-014 — Test harness (Jest + Supertest + `nivora_test` schema)**
  - **Goal:** Reliable, isolated backend tests.
  - **Depends on:** P2-013
  - **Requirements:** barch §18
  - **Implementation notes:**
    - `test/` e2e setup: load `.env.test`, reset + migrate + seed **only the `nivora_test` schema** (guard: refuse to run unless the connection's schema is exactly `nivora_test` — never `public`), boot the Nest app once, Supertest agent with cookie jar helpers.
    - Prisma with `@prisma/adapter-pg` must target the test schema at runtime too (adapter `schema` option / `search_path`) — verify, don't assume.
    - Root `npm test` runs shared unit + backend unit + backend e2e.
  - **Acceptance criteria:** e2e suite runs from a clean `nivora_test` schema every time; the `public` schema (real data) is never touched by tests.
  - **Verification:**
    - 🤖 Two consecutive e2e runs pass; `public` row counts are identical before and after; a deliberate run pointed at `public` is refused by the guard.
  - **Verification log:** Claude: ✅ 2026-10-06 — `test/guard.ts` (`assertTestDatabase`: NODE_ENV=test, TEST_SCHEMA=nivora_test, both URLs `?schema=nivora_test`), `test/global-setup.ts` (once per run: guard → `prisma migrate deploy` → `seed --reset`, only on `nivora_test`; Jest loads it via Node's ESM loader, so it imports `guard.ts` by URL — Node 22 strips the types), `test/setup-env.ts` (each worker: network fix, `.env.test`, guard again), `PrismaService` refuses NODE_ENV=test on any other schema, `test/http-client.ts` (`browser(app)`: Supertest agent with a cookie jar + frontend Origin on mutating requests; `uniqueEmail()`), `test/harness.e2e-spec.ts`. One Nest app per test file (Jest isolates modules per file; ~2 s each) instead of one per run. Root `npm test` = shared unit → backend unit → backend e2e. Expected error logs in tests are captured and asserted instead of printed. **Verified, not assumed:** a user created through Prisma raises the `nivora_test.users` count and leaves `public.users` unchanged; `prisma.table("orders")` → `"nivora_test"."orders"`. **Checks:** two consecutive e2e runs → 4 suites / 19 tests pass from a freshly reset+seeded schema (~38 s each); `public` snapshot (products 154, variants 346, Σstock 7180, users 1, orders 4, sequence 4) identical before and after; `DATABASE_URL=<public URL> npm run test:e2e` → globalSetup refuses ("DATABASE_URL must use ?schema=nivora_test (found no schema → public)") before any reset, `public` unchanged; root `npm test` → 107 + 40 + 19 pass (~40 s).

## Stage P4 — Catalog + content API

- [x] **P2-015 — Categories, collections, slugs and content endpoints**
  - **Goal:** Read-only catalog metadata over HTTP.
  - **Depends on:** P2-014
  - **Requirements:** barch §5, §7, §10; req §8.3, §9, §9.1
  - **Implementation notes:** `GET /categories`, `GET /collections/:id?limit=`, `GET /products/slugs`, `GET /content/pages/:slug` (404 envelope for unknown).
  - **Acceptance criteria:** responses match the shared contract types exactly.
  - **Verification:**
    - 🤖 e2e: shapes, counts (5/24, collections 49/150/28 with default sorts), unknown → `NOT_FOUND` 404.
  - **Verification log:** Claude: ✅ 2026-10-06 — `CatalogModule`: `CatalogIndex` loads taxonomy + products (variants in position order, category via subcategory, rating → number, dates → ISO) from the database at startup; `CatalogService` + `CatalogController`: `GET /categories`, `GET /products/slugs`, `GET /collections/:id?limit=` (shared `COLLECTIONS` + default sort, live stock; unknown id → 404 `NOT_FOUND`; limit must be 1–999 else 422 `VALIDATION` with `fields.limit`); `ContentModule`: `GET /content/pages/:slug` (shared content; unknown → 404 `entity: "page"`). e2e `catalog-metadata` 7/7: categories deep-equal the shared `CATEGORIES` (5/24), slugs equal the catalog order (154), each collection deep-equals the shared pipeline with its default sort — best sellers 49 (`relevance`), special offers 150 (`discount`), new arrivals 28 (`newest`) — and `limit=10` = first 10; bad collection/limits rejected; all 6 info pages equal shared content, unknown → 404. Live curl on `public` agrees.

- [x] **P2-016 — Product listing endpoint**
  - **Goal:** Filters, facets, sort, search and pagination identical to Phase 1.
  - **Depends on:** P2-015
  - **Requirements:** barch §10; req §12, §13; arch §13
  - **Implementation notes:**
    - `GET /products` parses query params with the shared `parseListingParams`; in-memory product index (loaded at startup) + **live stock map from the DB per request** → shared `queryCatalog`.
    - Response: `ProductListResult`.
  - **Acceptance criteria:** for a broad set of queries the API returns exactly what the Phase 1 mock catalog returns (with equal stock).
  - **Verification:**
    - 🤖 Parity e2e: ~30 queries (each category/subcategory, every filter type, every sort, search terms, pagination, garbage params) compared with the shared pipeline on seed data.
    - 🤖 After a stock change in the DB, "In stock only" and out-of-stock ordering reflect it immediately.
  - **Verification log:** Claude: ✅ 2026-10-06 — `GET /products` parses the query with the new shared wire format `fromApiSearch` (listing params + `in_category` / `in_collection`, explicit sort; `toApiSearch` for the frontend adapter; round trip proven exact for 8 page shapes in shared Jest, 117 tests) and runs the shared `queryCatalog` over the index with **live stock from one `SELECT id, stock FROM variants` per request** (in responses a variant's `initialStock` is its current stock, so shared rules need no adjustments). e2e `catalog-listing`: **42 listing pages** — all 5 categories, a subcategory of each, every filter type (brand, size/colour, price ranges incl. open-ended, rating, discount, in-stock, RAM/storage, capacity/energy, skin type, age group, multi-sub), all 6 sorts, 6 searches (incl. plural, multi-word, accent, no results), 3 collections, pagination incl. page 99 clamp, garbage params — each `toEqual` the shared pipeline over the shared catalog with the database's stock as adjustments (items, totals, pages **and facets**); raw garbage on the wire (bad scopes too) → full catalog page 1; zeroing the Oxford shirt's stock removes it from "In stock only" and moves it into the out-of-stock tail immediately, restoring brings it back. ~0.3 s per listing request from India (one Neon round trip).

- [x] **P2-017 — Product details with live stock**
  - **Goal:** `GET /products/:slug` returns the product and current stock per variant.
  - **Depends on:** P2-016
  - **Requirements:** barch §7, §10; req §16
  - **Implementation notes:** Response = `Product` + `available: Record<variantId, number>` (the existing `PurchasableProduct` shape); unknown slug → 404 envelope.
  - **Acceptance criteria:** stock reflects the DB at request time.
  - **Verification:**
    - 🤖 e2e: a few products incl. out-of-stock and partly-out-of-stock; change stock in a transaction and re-read.
  - **Verification log:** Claude: ✅ 2026-10-06 — `GET /products/:slug` → `PurchasableProduct` (shared product, variants' `initialStock` = current DB stock, `available` map), unknown slug → 404 "This product is no longer available." (`entity: "product"`). e2e `product-details` 8/8: S24 Ultra, Oxford shirt, realme Narzo (fully out of stock → all 0), Saanjh kaftan each deep-equal the shared product with live stock; White/XXL = 0 and Sky Blue/S = 2; setting Sky Blue/S to 1 is visible on the next request and restoring shows 2. Full e2e run: 7 suites / 79 tests pass (e2e timeout raised to 30 s: app boot loads the catalog over the ~250 ms link).

## Stage P5 — Authentication, sessions, profile

- [x] **P2-018 — Session infrastructure**
  - **Goal:** Secure DB-backed sessions.
  - **Depends on:** P2-017
  - **Requirements:** barch §8, §13
  - **Implementation notes:**
    - 32-byte random token → cookie `nivora_session` (HttpOnly, SameSite=Lax, Secure per env, 30 days, sliding refresh); SHA-256 hash stored in `sessions`.
    - Middleware resolves the user; `SessionGuard` (401 `UNAUTHENTICATED`), `@CurrentUser()` decorator; expired sessions ignored.
  - **Acceptance criteria:** raw tokens never stored or logged.
  - **Verification:**
    - 🤖 Unit tests for token/hash/cookie options; `psql` shows only hashes; e2e: a protected test route returns 401 without a cookie and 200 with one.
  - **Verification log:** Claude: ✅ 2026-10-06 — `src/modules/auth`: `session-token.ts` (32-byte base64url token, SHA-256 hex hash, well-formedness check, cookie options HttpOnly/SameSite=Lax/Path=/ /Secure per `COOKIE_SECURE`/TTL), `SessionService` (start → stores hash only + sets `nivora_session`; resolve → unknown/malformed/expired = guest and the cookie is cleared, sliding refresh after a day; end), `SessionMiddleware` (global, **lazy and memoised**: routes that never ask for the user — catalog, content, health — do no session lookup), `AuthGuard` (401 `UNAUTHENTICATED`), `OptionalAuthGuard` (guest → null), `@CurrentUser()`. Tokens never reach logs (the request log has method/path/status only). **Checks:** unit 44/44 (+4: 1000 unique 32-byte tokens, hash-only, malformed tokens rejected, cookie flags); e2e `session` 6/6: protected route 401 → 200 after a session starts, `Set-Cookie: nivora_session=<43 chars>; Max-Age=2592000; Path=/; HttpOnly; SameSite=Lax`, the DB holds `sha256(token)` and never the token, optional route null/user, malformed/unknown/expired → 401 with the cookie cleared, a session last seen 2 days ago is extended to +30 days, a catalog request with a bogus cookie does no lookup (no Set-Cookie). Test user confirmed in `public` (`user-joseph`, argon2id hash verifies `password123` via `db:check`).

- [x] **P2-019 — Signup, login, logout, session endpoints**
  - **Goal:** Account flows of req §7 over HTTP.
  - **Depends on:** P2-018
  - **Requirements:** req §7, §27, §28; barch §8
  - **Implementation notes:**
    - `POST /auth/signup` (shared schema, `EMAIL_TAKEN` 409, argon2id), `POST /auth/login` (generic `INVALID_CREDENTIALS`), `POST /auth/logout` (delete session, clear cookie, clear pending Buy Now), `GET /auth/session`.
    - Rate limits on login/signup (per IP and per email) → 429.
  - **Acceptance criteria:** behaviour matches the Phase 1 auth tests; nobody is logged in automatically.
  - **Verification:**
    - 🤖 e2e: port the Phase 1 auth scenarios (wrong password, case-insensitive email, duplicate signup, weak password field errors, logout keeps data, session persists across requests); throttling returns 429.
  - **Verification log:** Claude: ✅ 2026-10-06 — `AuthService` + `AuthController`: `GET /auth/session` → `{ user }` (null for guests), `POST /auth/signup` (shared schema → 422 field errors; lower-cased email; `EMAIL_TAKEN` 409 with the email field message, also when two signups race on the unique index; argon2id; 201 `AuthResult`), `POST /auth/login` (any bad input/unknown email/wrong password → the same `INVALID_CREDENTIALS` 401; unknown emails still cost one argon2 verify; new token every login, previous session ended), `POST /auth/logout` (204; deletes the session, clears the cookie and the pending Buy Now; other data kept). Rate limits: login 30/min/IP, signup 30/10 min/IP (`@RateLimit`), 5 failed logins per email per 15 min → `RATE_LIMITED` 429. `GuestCartMerger` hook (returns false until the cart module, P2-022). **Joseph's request:** the predefined test user (joseph@example.com / password123) lives in the real `public` database (seeded in P2-013, create-only so it is never overwritten) — **live login against `public` via curl: 200 `{user: Joseph}`, also as `Joseph@Example.com `; wrong password → "Incorrect email or password."; logout 204 → guest.** e2e `auth` 14/14: no auto-login, test user login, case/whitespace-insensitive email, 4 invalid-login variants (no cookie set), signup (lower-cased, argon2id, logged in), duplicate signup 409, weak/mismatch/missing fields 422, session persists across requests, logout clears session + pending Buy Now but keeps addresses, re-login works, new token per login (old one dead), email lock after 5 failures (even with the right password), 31st login from one IP → 429.

- [x] **P2-020 — Profile endpoints**
  - **Goal:** `GET /me`, `PATCH /me`.
  - **Depends on:** P2-019
  - **Requirements:** req §26
  - **Implementation notes:** Name + optional phone (shared schema); email read-only (ignored if sent).
  - **Acceptance criteria:** matches Phase 1 profile behaviour.
  - **Verification:**
    - 🤖 e2e: update name/phone, clear phone, invalid phone 422, email unchanged, guest 401.
  - **Verification log:** Claude: ✅ 2026-10-06 — `ProfileModule`: `GET /me` and `PATCH /me` behind `AuthGuard`; shared `profileSchema` (trimmed name ≤ 60, optional Indian mobile); empty phone stores NULL and the response omits `phone`; extra fields such as `email` are stripped by the schema, so the email never changes. e2e `profile` 4/4: guest GET/PATCH → 401 "Please log in to continue."; read; update name (trimmed) + phone with an `email` attempt ignored, session shows the new name; clearing the phone; `phone: "123"` + empty name → 422 with "Please enter a valid 10-digit mobile number." and nothing saved. Full root `npm test`: shared 117, backend unit 44, backend e2e 103 — all pass.

## Stage P6 — Cart + wishlist

- [x] **P2-021 — Carts (guest cookie + customer)**
  - **Goal:** Server-side carts with revalidation and totals.
  - **Depends on:** P2-020
  - **Requirements:** req §17; barch §9
  - **Implementation notes:**
    - Cart owner resolution: customer cart, else guest cart via `nivora_cart` cookie (created lazily, token hashed).
    - `GET /cart`, `POST /cart/items`, `PATCH /cart/items/:variantId`, `DELETE /cart/items/:variantId` → `CartView` with shared `assessLine` + `summarize`; removed products reported once.
  - **Acceptance criteria:** behaviour matches the Phase 1 cart tests.
  - **Verification:**
    - 🤖 e2e: port the Phase 1 cart scenarios (same variant merges, separate variants, stock caps, invalid quantity/variant, update/remove, totals, sold-out flag) for both a guest cookie and a customer.
  - **Verification log:** Claude: ✅ 2026-10-06 — `resolveLines` moved from the frontend mock to `@nivora/shared/domain/resolveLines` (lookup-function signature; the mock wraps it — mock suites check-017/022/023/024 + journeys still pass). `CartModule`: `CartService` (owner = customer cart, else guest cart via `nivora_cart` cookie — 32-byte token, stored hashed, HttpOnly/SameSite=Lax, created lazily on the first write only; every read revalidates with shared `assessLine`/`summarize` against live stock; lines whose product left the catalog are dropped and reported once), `CartController` (`GET /cart`, `POST /cart/items`, `PATCH`/`DELETE /cart/items/:variantId`, all → `CartView`). Errors: `INVALID_VARIANT` 400, `INVALID_QUANTITY` 400, `INSUFFICIENT_STOCK` 409 with `available`, `OUT_OF_STOCK` 409, unknown line `NOT_FOUND` 404. e2e `cart` (run as guest **and** customer) 7×2 + isolation 2 = 16/16: empty cart creates nothing (no cookie), same variant → one line ×2, different variant → separate line with options, server totals (3 items: MRP 5997, discount 2100, total 3897, free delivery), stock caps (`INSUFFICIENT_STOCK:2`, then `:0`), out of stock, invalid variant + 5 invalid quantities, update/limit/min/unknown line, remove keeps order, sold-out line flagged then cleared on restock, removed-product notice reported once; separate carts per guest cookie, bogus cookie = empty cart.

- [x] **P2-022 — Guest cart merge on login/signup**
  - **Goal:** D4/D12 behaviour on the server.
  - **Depends on:** P2-021
  - **Requirements:** req §17.5; barch §9
  - **Implementation notes:** In the login/signup transaction: shared `mergeCarts` capped at live stock, guest cart deleted, cookie cleared, `mergedSavedItems` in the response.
  - **Acceptance criteria:** identical outcomes to the Phase 1 merge tests.
  - **Verification:**
    - 🤖 e2e: overlap summed and capped, new lines added, `mergedSavedItems` false/true cases, guest cart gone afterwards.
  - **Verification log:** Claude: ✅ 2026-10-06 — `CartService.mergeIntoUser` (the `GuestCartMerger` used by login/signup; auth endpoints moved to `AuthApiModule` to avoid a module cycle): one transaction — guest cart + saved cart, shared `mergeCarts` capped at live stock, only changed lines written, guest cart deleted, `nivora_cart` cookie cleared; `mergedSavedItems` = saved cart existed and received items (same rule as the mock). e2e `cart-merge` 5/5: overlap LOW 1+2 capped at 2, M kept, L added, `mergedSavedItems: true`, cookie cleared, guest cart row gone, cart empty again after logout; no saved cart → false and guest lines carried over; empty guest cart → false and saved cart untouched; signup carries the guest cart; same variant in both → true, quantity 2. (Test fix: a made-up kaftan variant id was correctly rejected with `INVALID_VARIANT`.)

- [x] **P2-023 — Wishlist endpoints**
  - **Goal:** Wishlist over HTTP.
  - **Depends on:** P2-022
  - **Requirements:** req §18
  - **Implementation notes:** `GET /wishlist` (summaries with live stock), `PUT/DELETE /wishlist/:productId`, `POST /wishlist/:productId/move-to-cart` (variant check, stock check, add 1, remove from wishlist — one transaction).
  - **Acceptance criteria:** matches Phase 1 wishlist tests.
  - **Verification:**
    - 🤖 e2e: guest 401, duplicates impossible, move to cart, wrong-product variant, out-of-stock can't move, per-user isolation.
  - **Verification log:** Claude: ✅ 2026-10-06 — `WishlistModule` (🔒 `AuthGuard`): `GET /wishlist` (summaries via shared `toProductSummary` with live stock, in the order added), `PUT /wishlist/:productId` (idempotent upsert; unknown product → 404 `entity: product`), `DELETE /wishlist/:productId`, `POST /wishlist/:productId/move-to-cart` (variant must belong to the product → `INVALID_VARIANT`; stock check with shared `checkQuantity` → `OUT_OF_STOCK`/`INSUFFICIENT_STOCK`; add 1 to the cart and remove from the wishlist in **one transaction**). e2e `wishlist` 6/6: guest 401 on all four routes; duplicate add → one entry, order kept, summary shape, unknown → 404; move to cart adds qty 1 and removes the entry, wrong-product variant 400; out-of-stock product stays in the wishlist with nothing added; cart already holding the last unit → `INSUFFICIENT_STOCK` (0) and the entry stays; per-customer isolation.

## Stage P7 — Addresses, checkout, orders

- [x] **P2-024 — Address endpoints**
  - **Goal:** Address book over HTTP.
  - **Depends on:** P2-023
  - **Requirements:** req §21
  - **Implementation notes:** CRUD + `POST /addresses/:id/default`; first address default; deleting the default promotes another; `INVALID_ADDRESS` field errors; listed default-first.
  - **Acceptance criteria:** matches Phase 1 address tests.
  - **Verification:**
    - 🤖 e2e: port the Phase 1 address scenarios incl. ownership (another user's address → 404).
  - **Verification log:** Claude: ✅ 2026-10-06 — `AddressesModule` (🔒): `GET /addresses` (default first, then oldest first), `POST` (shared `addressSchema` via `ZodValidationPipe(…, "INVALID_ADDRESS")` → 422 field errors; first address becomes default; empty line 2 dropped), `PUT /:id` (keeps id and default flag), `DELETE /:id` (204; deleting the default promotes the oldest remaining one), `POST /:id/default` (204) — default changes in transactions so exactly one default exists; every lookup is scoped to the customer, so another customer's address is `NOT_FOUND` "We couldn't find that address.". e2e `addresses` 4/4: guest 401; invalid PIN/phone/state/country → `INVALID_ADDRESS` 422 with req §28 field messages and nothing saved; first default, set default reorders, single default, edit keeps default flag + line 2, delete promotes; unknown ids and another customer's address (edit/delete/set default) → 404 with no change, lists isolated.

- [x] **P2-025 — Checkout sessions and checkout view**
  - **Goal:** Buy Now vs cart checkout on the server.
  - **Depends on:** P2-024
  - **Requirements:** req §19, §20, §22
  - **Implementation notes:** `POST /checkout/buy-now` (full-stock limit, replaces pending), `POST /checkout/cart`, `GET /checkout?deliveryOption=` → `CheckoutView` (falls back to cart; totals per delivery option).
  - **Acceptance criteria:** matches Phase 1 checkout tests.
  - **Verification:**
    - 🤖 e2e: Buy Now replaces previous, cart untouched, Express ₹99 and free-standard threshold, fallback after Buy Now cleared.
  - **Verification log:** Claude: ✅ 2026-10-06 — `OrdersModule` / `CheckoutService` + `CheckoutController` (🔒): `POST /checkout/buy-now` (shared `cartItemInputSchema` → `INVALID_QUANTITY`; unknown variant → `INVALID_VARIANT`; limit = full live stock → `INSUFFICIENT_STOCK`/`OUT_OF_STOCK`; upsert replaces any pending Buy Now; 204), `POST /checkout/cart` (204), `GET /checkout?deliveryOption=` → `CheckoutView` (a valid pending Buy Now, else the cart; shared `resolveLines` with live stock and the chosen delivery option; bad option → 422 field message). e2e `checkout` 5/5: guest 401 ×3; cart view (2 lines, free standard), Express +₹99, invalid option 422; ₹299 face wash → standard ₹40; second Buy Now replaces the first, cart untouched, stock limit (`INSUFFICIENT_STOCK` 2), invalid variant/quantity 400; cart checkout and logout both fall back to the cart.

- [x] **P2-026 — Place order (transactional)**
  - **Goal:** Stock-safe, idempotent order creation.
  - **Depends on:** P2-025
  - **Requirements:** req §24; barch §11
  - **Implementation notes:**
    - `POST /orders` with `Idempotency-Key`; one transaction: re-validate (req §24.1), conditional `UPDATE … stock = stock - q WHERE stock >= q` per line, totals via shared `buildOrder`, `NIV-<year>-<seq>` from `order_number_seq`, snapshots, first status event, cart lines removed or Buy Now cleared.
    - Same key again → the existing order (no duplicate).
  - **Acceptance criteria:** matches Phase 1 order tests; stock in the DB decreases exactly by ordered quantities.
  - **Verification:**
    - 🤖 e2e: EMPTY_CART, ADDRESS_REQUIRED, INSUFFICIENT_STOCK with no partial writes (row counts unchanged), Buy Now leaves the cart, cart order removes purchased lines, sequential order numbers, idempotent retry returns the same order.
  - **Verification log:** Claude: ✅ 2026-10-06 — `POST /orders` (201 new / 200 idempotent replay): optional `Idempotency-Key` (8–100 `[A-Za-z0-9_-]`, else 422); one interactive transaction — checkout items (Buy Now or cart) → `EMPTY_CART`; the customer's own address re-validated with the shared schema → `ADDRESS_REQUIRED`/`INVALID_ADDRESS`; lines re-resolved with live stock → issue errors; per line **conditional `UPDATE variants SET stock = stock − q WHERE id = … AND stock >= q`** (0 rows → `OUT_OF_STOCK`/`INSUFFICIENT_STOCK` with the current stock, rollback); `nextval` on the schema-qualified `order_number_seq`; shared `buildOrder` (totals recomputed) with year in India time; order + item snapshots + first `Placed` event; purchased cart lines removed (cart source) and the checkout session cleared. Same key again → existing order; a concurrent duplicate hitting the unique `(customerId, idempotencyKey)` index is caught and answered with the existing order. Order JSON = shared `Order` (`orderId` = order number; `isSample` only on samples). e2e (in `orders`): empty cart 409; no/unknown/another customer's address → `ADDRESS_REQUIRED`; Buy Now order (express, COD, Placed, ₹2×69,900 + 99, MRP/discount, address + item snapshots, one history event, iPhone stock −2 exactly, cart unchanged, checkout falls back to cart); cart order removes purchased lines and decrements stock exactly (−2/−1); idempotent retry → 200 with the identical order and order/item/event row counts unchanged; next order number = previous + 1; bad key 422; stock dropped under the cart → `INSUFFICIENT_STOCK` (available 1) with **no writes** (row counts, stock and cart unchanged). **Measured latency from India** (~250–300 ms per Neon round trip): add to cart 4.7 s, cart 1.5 s, checkout view 1.5 s, place order 5.3 s, orders 1.2 s → round-trip reduction in P2-037; an Asia-region database is the main fix (barch §21). e2e per-test timeout raised to 120 s.

- [x] **P2-027 — Orders: list, details, cancel**
  - **Goal:** Order history and cancellation on the server.
  - **Depends on:** P2-026
  - **Requirements:** req §25
  - **Implementation notes:** `GET /orders` (newest first, tie-break by order number), `GET /orders/:orderNumber` (own only → else 404), `POST /orders/:orderNumber/cancel` (Placed/Confirmed only; restore stock unless `isSample`; status event) in a transaction.
  - **Acceptance criteria:** matches Phase 1 order tests.
  - **Verification:**
    - 🤖 e2e: list order, ownership 404, cancel restores stock, sample cancel doesn't, Shipped/Delivered → `ORDER_NOT_CANCELLABLE`, double cancel rejected.
  - **Verification log:** Claude: ✅ 2026-10-06 — `OrdersService` + `OrdersController` (🔒): `GET /orders` (shared `toOrderSummary`, newest first, tie-break by order number desc), `GET /orders/:orderNumber` (own only, else 404 "We couldn't find that order."), `POST /orders/:orderNumber/cancel` (transaction: **conditional** status update `WHERE status IN (Placed, Confirmed)` — 0 rows → `ORDER_NOT_CANCELLABLE` — then a `Cancelled` event and stock `+q` per item unless `isSample`). e2e (in `orders`, 6 tests total for P2-026/027): list newest first with summary fields, details equal the placed order, cancel → Cancelled with history [Placed, Cancelled] and iPhone stock back exactly, second cancel 409 with stock unchanged, another customer → 404 for details and cancel and an empty list; Joseph (seeded test user, logged in with joseph@example.com / password123): 4 sample orders listed, Delivered/Shipped → `ORDER_NOT_CANCELLABLE`, Confirmed sample cancels without changing stock.

- [x] **P2-028 — Concurrency and integrity tests**
  - **Goal:** Prove the money/stock invariants under parallel load.
  - **Depends on:** P2-027
  - **Requirements:** barch §11, §18
  - **Implementation notes:** Parallel requests against the `nivora_test` schema.
  - **Acceptance criteria:** invariants hold in every run.
  - **Verification:**
    - 🤖 e2e: 10 simultaneous orders for the last 3 units → exactly 3 succeed, stock ends at 0, never negative; 5 parallel Place Order calls with one idempotency key → one order; parallel cancels → stock restored once; run 5 times.
  - **Verification log:** Claude: ✅ 2026-10-06 — e2e `concurrency` (10 customers with addresses, against `nivora_test`; each scenario loops **5 rounds**): 10 simultaneous Place Orders (Buy Now ×1 each) for 3 remaining units → every round exactly three 201 and seven 409 (`OUT_OF_STOCK`/`INSUFFICIENT_STOCK`), stock exactly 0, exactly 3 new orders with distinct numbers; 5 parallel Place Orders with one Idempotency-Key → statuses [200,200,200,200,201], one order id, order count +1, stock −1 exactly (losing transactions rolled back by the unique index); 5 parallel cancels of one order → [200,409,409,409,409], stock restored exactly once, one Cancelled event; afterwards no variant has negative stock and every order satisfies total = subtotal − discount + delivery and subtotal = Σ MRP × qty. 4/4 pass (3 m 52 s over the ~250 ms link).

## Stage P8 — Frontend integration

- [x] **P2-029 — HTTP client foundation and same-origin proxy**
  - **Goal:** The frontend can call the API with cookies.
  - **Depends on:** P2-028
  - **Requirements:** barch §13, §17; arch §21
  - **Implementation notes:**
    - `next.config.ts` rewrites `/api/:path*` → `${BACKEND_URL}/api/v1/:path*`; env `BACKEND_URL`, `NEXT_PUBLIC_DATA_SOURCE=http|mock`.
    - `frontend/src/api/http/client.ts`: `fetch` wrapper (`credentials: "include"`, JSON, error envelope → `ApiError`, idempotency key helper); adapter selection in `api/client/index.ts` and `api/server/index.ts` by data source.
  - **Acceptance criteria:** a test call from the browser reaches the API with cookies; mock mode unaffected.
  - **Verification:**
    - 🤖 `curl localhost:3000/api/health` proxies to the backend; Jest/unit test of the envelope → `ApiError` mapping.
  - **Verification log:** Claude: ✅ 2026-10-07 — `NEXT_PUBLIC_DATA_SOURCE=mock|http` (`siteConfig.dataSource`), `BACKEND_URL` (server-only; `.env`/`.env.example` documented). `next.config.ts` rewrites `/api/:path*` → `${BACKEND_URL}/api/v1/:path*` (baked in at build). `src/api/http/client.ts`: `apiFetch` (browser → same-origin `/api`, server → `BACKEND_URL` directly; `credentials: "include"`; JSON; 204 → undefined; network failure → `ApiError("UNKNOWN")`; error envelope → `ApiError` via the new shared `fromErrorEnvelope`), `orNull` (NOT_FOUND → null for contract methods that return null), `newIdempotencyKey`. Adapter selection in `api/client/index.ts` and `api/server/index.ts`. **Checks:** shared Jest 127/127 (+10 `fromErrorEnvelope`: code/details kept, field errors kept, 7 malformed payloads → UNKNOWN, array details ignored); frontend typecheck/lint clean; backend on the `nivora_test` schema (port 4100) + frontend built in `http` mode (`next start` on 3100): `/api/health` through the proxy → `{status:"ok",db:"ok"}`; login as joseph@example.com through the proxy → 200 + `nivora_session` cookie stored in the jar, `/api/auth/session` with that cookie → Joseph, logout 204; a cross-origin POST through the proxy → 403 `FORBIDDEN` (Origin forwarded); unknown product → 404 envelope. Mock mode unaffected: mock build + all Phase 1 suites pass. **Note:** the Phase 1 verification scripts were lost when the session scratchpad was cleared; they were recovered from the session transcript into the repo at `scripts/verify/` (paths made relative, later fixes re-applied) and re-validated: 16 node suites + check-035/039/040/057/stage7-11/guard, a11y and crawl all pass on a mock build.

- [x] **P2-030 — Server catalog HTTP adapter**
  - **Goal:** Server Components read the catalog from the API.
  - **Depends on:** P2-029
  - **Requirements:** barch §10, §17; arch §3, §10
  - **Implementation notes:** `CatalogApi`/`ContentApi` over HTTP with Next `fetch` caching (listings revalidate in minutes, product pages pre-built + revalidated, slugs for `generateStaticParams` and the sitemap from the API).
  - **Acceptance criteria:** all catalog pages render server-side from the API with unchanged HTML structure and SEO.
  - **Verification:**
    - 🤖 Phase 1 HTTP suites (categories, product, SEO) pass in `http` mode; build pre-renders all 154 products from the API.
  - **Verification log:** Claude: ✅ 2026-10-07 — `src/api/http/server.ts`: `httpCatalog` (`/categories`, `/products?<toApiSearch>`, `/products/:slug` → `Product` (live `available` dropped; purchase UI re-reads stock in the browser), `/collections/:id?limit`, `/products/slugs`) and `httpContent` (`/content/pages/:slug`), NOT_FOUND → null/[] as the contract expects; Next data cache: taxonomy/slugs 1 h, listings 60 s, products 5 min, content 1 h (tags `catalog`/`stock`/`content`). `next build` in `http` mode against the API (backend on `nivora_test`): 20 s, all 154 product pages pre-rendered from `/products/slugs` + `/products/:slug`. **Found & fixed:** `next start` read `BACKEND_URL` from `frontend/.env` (port 4000) while the build used 4100 → on-demand pages failed with a bare UNKNOWN; the server adapter now logs the cause ("Nivora API unreachable: … <url>") and the docs say build and start need the same `BACKEND_URL`. **Checks (`http` mode):** check-035 (categories/404s), check-040 (product details), check-057 (discovery), check-039 off **and** on (separate `NEXT_PUBLIC_ALLOW_INDEXING=true` build; sitemap 193 URLs from the API), check-stage7-11, protected-route guard, a11y — ALL PASS; crawl: 209 URLs all 200, no broken links, 154/154 products reachable from Home.

- [x] **P2-031 — Client HTTP adapters**
  - **Goal:** Customer features use the API.
  - **Depends on:** P2-030
  - **Requirements:** barch §17; arch §7.1
  - **Implementation notes:** `auth`, `profile`, `cart`, `wishlist`, `addresses`, `checkout` (+ idempotency key on Place Order), `orders`, `catalog.getProduct` over HTTP; TanStack Query keys unchanged.
  - **Acceptance criteria:** every UI flow works against the backend with no component changes.
  - **Verification:**
    - 🤖 The Phase 1 journeys script re-pointed at the HTTP adapters (Node, with a cookie jar) passes end to end.
  - **Verification log:** Claude: ✅ 2026-10-07 — `src/api/http/browser.ts` (`httpApi: ClientApi`): catalog.getProduct (404 → null), auth (session/login/signup/logout), cart, wishlist, addresses, checkout, orders, profile — same contracts and TanStack Query keys, no component changes; `inventory.getAdjustments` → `{}` (no overlay in http mode). Place Order idempotency: one `Idempotency-Key` per attempt; concurrent calls (double click) share one request, a retry after a network failure reuses the key, any server answer ends the attempt. `scripts/verify/http-shim.mjs`: Node gets a browser-like fetch — same-origin `/api/...` through the **real Next.js proxy** (:3100), cookie jar from `Set-Cookie` (incl. clearing), browser Origin on mutations. `e2e-journeys.mjs` made mode-aware (stock via the API in http mode, unique signup email). **Checks** (fresh `nivora_test` seed, backend :4100, `http` build): journeys — all 6 journeys, 31 checks **ALL PASS** (guest cart, wishlist intent → login → merge, signup/login/logout, guarded features 401, Buy Now → login → checkout, addresses, COD order NIV-2026-000005, stock −1 via the API, cart checkout, history, cancel restores stock, sample not cancellable, profile); `check-stage3` (login intents, D12 merged landing, safe redirects) ALL PASS in http mode; both still ALL PASS in mock mode.

- [x] **P2-032 — Remove the Phase 1 inventory overlay in HTTP mode**
  - **Goal:** One source of stock truth.
  - **Depends on:** P2-031
  - **Requirements:** arch §3.1, §21; barch §17
  - **Implementation notes:** In `http` mode, card/product stock comes from the API (no localStorage adjustments); `useInventory` becomes a no-op; mutations invalidate product/listing caches after orders and cancellations.
  - **Acceptance criteria:** after an order, listings and product pages show the new stock (within the revalidation window for server pages, immediately for client islands).
  - **Verification:**
    - 🤖 Place an order through the API, then check the product page's live stock and a listing's "In stock only" result.
  - **Verification log:** Claude: ✅ 2026-10-07 — In `http` mode the inventory adapter returns no adjustments, so `useInventory` is a no-op and every stock number comes from the API: server pages carry the stock at render time (listings cached 60 s, product pages 5 min) and the new `useLiveProduct` hook makes the PDP purchase panel read live stock from `/api/products/:slug` (mock mode: unchanged, overlay as before). Place Order and Cancel now also invalidate the `["product"]` queries. **Check** (http build, backend on `nivora_test`): PlayForge Dragon Guardian Figure (1 unit) listed under Action Figures "In stock only"; Joseph bought the last unit through the proxy (order NIV-2026-000007) → `/api/products/:slug` reports 0 immediately; a headless-Chrome screenshot of the cached product page shows **"Out of Stock"** with Add to Cart / Buy Now disabled (client island, immediate); the "In stock only" listing still showed it within its 60 s window and dropped it after the window (revalidated).

- [x] **P2-033 — Server-side route protection (`proxy.ts`)**
  - **Goal:** Guests are redirected before protected pages render.
  - **Depends on:** P2-032
  - **Requirements:** arch §9.3, §21; req §6.1
  - **Implementation notes:** Next.js 16 `proxy.ts`: no `nivora_session` cookie → redirect to `/login?from=…` for `/account*`, `/checkout`, `/wishlist`, `/order-confirmation*`; `RequireAuth` stays as the client fallback (expired sessions).
  - **Acceptance criteria:** guests get an HTTP redirect; logged-in users see pages normally.
  - **Verification:**
    - 🤖 `curl -I` protected routes without a cookie → 307 to `/login?from=…`; with a valid session cookie → 200.
  - **Verification log:** Claude: ✅ 2026-10-07 — `frontend/src/proxy.ts` (Next 16 `proxy`, Node runtime): in `http` mode, no `nivora_session` cookie → 307 to `/login?from=<path+query>` for `/account`, `/account/*`, `/checkout`, `/wishlist`, `/order-confirmation/*` (matcher); presence-only check (no API call); an expired/bogus cookie still reaches the page where `RequireAuth` redirects in the browser; mock mode → passthrough (the data-source check is inlined and compiled away in http builds). New suite `scripts/verify/check-proxy.py`: 7 protected routes → 307 with the right `from` (query string kept), 7 public pages 200 for guests, login sets the cookie, protected pages 200 with it — **ALL PASS**; headless screenshot: guest → `/account/orders` lands on Login with "Please log in to continue.". **Tooling fix:** `serve.sh`/`api.sh` relied on `lsof` (silent here), so a leftover server could keep answering on :3100 while a new `start` failed — the first proxy check hit an old build. Both now refuse to start on a busy port and stop by killing the port's listener (`ss`).

- [x] **P2-034 — Full frontend regression in HTTP mode**
  - **Goal:** Phase 1 quality holds on the real backend.
  - **Depends on:** P2-033
  - **Requirements:** req §34
  - **Implementation notes:** Fresh `nivora_test` schema (reset + seed) and production builds of both apps.
  - **Acceptance criteria:** everything that passed in mock mode passes in `http` mode.
  - **Verification:**
    - 🤖 HTTP suites, link crawl, accessibility audit, journeys, protected-route checks; headless screenshots of Home, listing, product, cart and checkout.
    - 👤 [`docs/manual-testing.md`](docs/manual-testing.md) §A–§E against the real backend.
  - **Verification log:** Claude: ✅ 2026-10-07 — Clean state: backend rebuilt, `nivora_test` migrated (no pending) and reset + seeded (5/24/154/346/1/4), API restarted on :4100; frontend `rm -rf .next` + production build in `http` mode (21 routes, no warnings, 154 product pages pre-rendered from the API). **Results (`http` mode):** check-035 (categories, 404s), check-040 (product details), check-057 (discovery), check-039 SEO off, check-proxy (server-side protection), a11y audit — ALL PASS; crawl 209 URLs all 200, no broken links, 154/154 products reachable; journeys (31 checks) and check-stage3 (intents) through the HTTP adapters + Next proxy — ALL PASS; message/listing/variant suites (check-018/034/041) ALL PASS. The mock-mode skeleton checks (check-guard, check-stage7-11) are replaced in http mode by check-proxy, because guests are now redirected on the server before any HTML. **Screenshots** (`scripts/verify/shot-session.mjs`: headless Chrome over the DevTools protocol with the session cookie): Home, Men listing, Oxford shirt (guest); Cart and Checkout as Joseph (server cart 3 items ₹3,297, saved addresses, delivery options) at 1280 px and checkout at 375 px — all match Phase 1. 👤 Joseph's browser walkthrough (§A–§E) against the real backend is still open.

## Stage P9 — Hardening, docs, sign-off

- [x] **P2-035 — Security review**
  - **Goal:** No obvious holes before anything goes public.
  - **Depends on:** P2-034
  - **Requirements:** barch §13; req §5.3, §23
  - **Implementation notes:** Review cookies, CSRF/Origin checks, rate limits, ownership checks on every customer route, error leakage, log redaction, dependency audit.
  - **Acceptance criteria:** findings fixed or explicitly accepted.
  - **Verification:**
    - 🤖 e2e: another user's address/order/wishlist inaccessible; cross-origin mutation rejected; stack traces never returned; `npm audit` summary; logs contain no passwords/tokens/phones.
  - **Verification log:** Claude: ✅ 2026-10-07 — **Reviewed:** cookies (HttpOnly, SameSite=Lax, Secure per env, hashed tokens, new token per login), CSRF (Origin/Referer + JSON-only on every mutating route), rate limits (per IP + per-email lock), ownership (every customer query scoped by the session user), error leakage (global filter), log content, dependencies. **Fixed:** (1) the API now refuses to start with `NODE_ENV=production` unless `COOKIE_SECURE=true` (+ unit test); (2) frontend sends `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera/mic/geo/payment off) and no `X-Powered-By` (verified with `curl -I`). **New e2e `security` (15/15):** an intruder customer gets 404 on the owner's address (edit/delete/default) and order (read/cancel), can't place an order to the owner's address (`ADDRESS_REQUIRED`), and wishlist/cart deletes only touch their own lists — the owner's data is unchanged; 12 mutating routes from another origin → 403 `FORBIDDEN`; malformed/hostile inputs (bad URL encoding, huge page, NoSQL-style object, SQL text, broken JSON, path traversal) never return stack traces, file paths, Prisma or SQL text; session cookie flags checked; captured logs from signup/login/address/failed login contain no session token, password, phone or email. Backend unit 45/45. **`npm audit`:** 0 critical; dev tooling only (eslint-config-next → braces/micromatch); production tree: 4 high, all inside the **Prisma CLI** (`@prisma/config` → `deepmerge-ts` 7, `mysql2` for MySQL Studio) — not loaded by the running API; npm's fix is a downgrade to Prisma 6 and `overrides` broke the CLI (reverted). **Accepted (recorded in barch §21):** those CLI advisories until a Prisma 7.x patch; the IP rate limit trusts one proxy hop (the API must stay behind the Next proxy/host load balancer — the per-email login lock still applies); in-memory limits per instance; signup reveals that an email exists (req §28 wording); no CSP on the frontend yet (Next inline scripts need nonces); **rotate the Neon password before going public** (it was shared in chat).

- [x] **P2-036 — Cleanup jobs and observability**
  - **Goal:** The database stays tidy; problems are visible.
  - **Depends on:** P2-035
  - **Requirements:** barch §19
  - **Implementation notes:** Scheduled purge of expired sessions and 30-day-old guest carts; request-id'd structured logs; health includes DB latency.
  - **Acceptance criteria:** cleanup removes only expired data.
  - **Verification:**
    - 🤖 e2e with backdated rows: only expired sessions/carts removed.
  - **Verification log:** Claude: ✅ 2026-10-07 — `MaintenanceModule` / `CleanupService`: deletes sessions with `expiresAt <= now` and guest carts (`userId` null) not updated for 30 days (items cascade); hourly `setInterval` (unref'd, first pass 30 s after start, failures logged as a warning) — no scheduler library added (`@nestjs/schedule` was not on the approved list); disabled under `NODE_ENV=test`, where tests call `run()`; customer carts, orders and accounts are never touched; idempotent, so safe with several instances. Observability: request-id'd one-line request logs (P2-009), JSON logger in production, `GET /health` now returns `dbLatencyMs`. e2e `cleanup` 1/1 with backdated rows: expired session removed, live session kept; guest cart idle 31 days removed with its items, 29 days kept; a customer cart idle 400 days kept; user kept; second run harmless. `health` e2e updated for `dbLatencyMs` (3/3).

- [x] **P2-037 — Performance check**
  - **Goal:** Fast enough on Neon.
  - **Depends on:** P2-036
  - **Requirements:** barch §10, §14
  - **Implementation notes:** Measure p50/p95 for listing, product, cart and place-order against Neon; check for N+1 queries; add indexes if needed; note region impact (us-east-2).
  - **Acceptance criteria:** results recorded; no endpoint has an N+1 pattern.
  - **Verification:**
    - 🤖 Timing script (100 requests per endpoint) + Prisma query logging review.
  - **Verification log:** Claude: ✅ 2026-10-07 — Tools: `PRISMA_LOG_QUERIES=1` (opt-in SQL log in `PrismaService`), `scripts/verify/query-count.sh` (statements per endpoint), `scripts/verify/perf.mjs` (p50/p95). **N+1 review:** statement counts are constant per endpoint (they don't grow with items/orders/wishlist size) — no N+1. **Round trips removed:** session lookup = 1 parameterised, schema-qualified JOIN (was session + user, runs on every customer request); cart view = items ⨝ variants in one JOIN; customer cart found-then-created instead of Prisma's multi-statement upsert; cart line writes = native `INSERT … ON CONFLICT` upsert / plain update/delete, in parallel with the cart's `updatedAt` touch; Place Order returns the order it built instead of re-reading it (`relationJoins` is still a Prisma 7.10 preview feature, so it was not enabled). Statements: session 2 → 1, GET /cart 5 → 3, POST /cart/items 15 → 7, POST /orders 17 → 14. **Timings** (from India to Neon us-east-2, `nivora_test`): health p50 292 / p95 377 ms; listing 304 / 449; product 298 / 419; session 291 / 445; cart 604 / 746; add to cart 1,522 / 1,763 (was ~4.7 s); checkout 922 / 1,061; orders 933 / 1,189; place order (incl. Buy Now call) 5,318 / 5,522. Model: latency ≈ sequential round trips × ~290 ms (API CPU time is negligible: `/health` = one `SELECT 1`). Indexes: every hot lookup is by primary/unique key or an indexed FK — none needed. **Region:** recorded in barch §21 — an Asia-region Neon project would bring every endpoint to roughly 10–100 ms; Place Order's 14 statements must stay sequential inside its transaction. All backend unit/e2e suites re-run after the changes.

- [x] **P2-038 — Documentation and runbook**
  - **Goal:** Anyone can run, migrate and seed the project.
  - **Depends on:** P2-037
  - **Requirements:** barch §15, §16
  - **Implementation notes:** Root/backend/frontend READMEs (install, env files, migrate, seed, run both apps, tests, switching `mock`/`http`), API reference table, update barch with final decisions.
  - **Acceptance criteria:** a fresh clone can be set up from the README alone.
  - **Verification:**
    - 🤖 Follow the README in a clean temporary checkout against the `nivora_test` schema (install → migrate → seed → run → health).
  - **Verification log:** Claude: ✅ 2026-10-07 — Rewritten: root `README.md` (structure, status, quick start for mock and http mode, env, database, tests), `backend/README.md` (setup, every env var, scripts, test-schema guard, **API reference table**, error statuses, operations, troubleshooting), `frontend/README.md` (data sources, `BACKEND_URL`, data layer, proxy, boundaries), new `scripts/verify/README.md` (every suite and helper), `docs/README.md`; barch §17 "as built" and §21 final open items. Root scripts `db:migrate`/`db:seed`/`db:check`; `@nivora/shared` gained `prepare` (builds on `npm install`, needed by the backend on a fresh clone); `backend/.prettierignore` (generated client). **Clean checkout** (only committable files copied to a temp dir — no node_modules, .env, dist or generated code): `npm install` (23 s; shared built, Prisma client generated without any `.env`); mock-mode `next build` OK (21 routes), workspace typecheck + lint clean; `backend/.env` pointed at `nivora_test` → `npm run db:migrate` (no pending), `npm run db:seed`, `npm run db:check` ✓, `npm run build -w backend`, start → `GET /api/v1/health` `{status:"ok",db:"ok"}` and 154 slugs. Prettier clean on all docs.

- [x] **P2-039 — Phase 2 scope check and sign-off**
  - **Goal:** Confirm Phase 2 is complete and still within scope.
  - **Depends on:** P2-038
  - **Requirements:** req §35, §36
  - **Implementation notes:** Re-run the Phase 1 scope check (no online payments, no admin/seller, no OTP/email/SMS, no shipping integration) plus a map from barch features to verifying tasks.
  - **Acceptance criteria:** all 39 tasks verified; open items listed.
  - **Verification:**
    - 🤖 Scope scan + verification map.
    - 👤 Joseph's sign-off.
  - **Verification log:** Claude: ✅ 2026-10-07 — **Scope scan** (292 source files in frontend, backend, shared, Prisma): no payment gateway or card/UPI handling (only hit: the "Blue Stripe" shirt colour), no email/SMS/OTP libraries or flows, no admin/seller UI (hits: `isBestSeller`, a comment "no admin editing yet"), no shipping/courier integration; payment is Cash on Delivery only; runtime dependencies = the approved stack (frontend: next, react, TanStack Query, Zustand, RHF, Zod; backend: Nest, @nestjs/config, Prisma client + adapter-pg, argon2, cookie-parser, helmet, express (already Nest's HTTP platform), zod; shared: zod). **Final test run:** shared Jest 127/127, backend unit 45/45, backend e2e 19 suites / 165 tests — all pass; lint, typecheck, Prettier clean in every workspace.

    **Verification map (barch feature → tasks → evidence):**

    | Feature | Tasks | Evidence |
    |---|---|---|
    | Shared rules, contracts, data | P2-003 – P2-007 | shared Jest (127), mock-mode regression |
    | Config, security headers, CSRF, rate limits, error envelope | P2-009, P2-010, P2-035 | unit + e2e `app`, `errors`, `security` |
    | Prisma/Neon, schema, constraints, seed, test isolation | P2-011 – P2-014 | `health`, `harness`, psql checks, `db:check` |
    | Catalog, listings (parity), product stock, content | P2-015 – P2-017, P2-030 | `catalog-metadata`, `catalog-listing` (42 pages), `product-details`, http-mode HTTP suites + crawl |
    | Sessions, auth, profile | P2-018 – P2-020 | `session`, `auth`, `profile`; live login as Joseph |
    | Carts, merge, wishlist | P2-021 – P2-023 | `cart` (guest + customer), `cart-merge`, `wishlist` |
    | Addresses, checkout, orders, cancel | P2-024 – P2-027 | `addresses`, `checkout`, `orders` |
    | Stock/money invariants under load | P2-028 | `concurrency` (5 rounds each) |
    | Frontend on the API, one stock truth, server-side protection | P2-029 – P2-034 | journeys + intents through the Next proxy, sell-out check, `check-proxy`, screenshots |
    | Cleanup, observability, performance, docs | P2-036 – P2-038 | `cleanup`, timing/query-count tools, clean-checkout run |

    **Open items** (barch §21): rotate the Neon password before going public; move Neon to an Asia region (latency); choose hosting (API behind a proxy); frontend CSP; Prisma CLI advisories; shared rate-limit store when scaling out; order status progression stays out of scope. 👤 **Pending:** Joseph's browser walkthrough (docs/manual-testing.md §A–§E) in `http` mode and Phase 2 sign-off.
