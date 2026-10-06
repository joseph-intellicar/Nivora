# Nivora — Implementation Tasks (Phase 1)

| | |
|---|---|
| **Based on** | [`requirements.md`](requirements.md) (req §) · [`docs/architecture.md`](docs/architecture.md) (arch §) · [`conversation.md`](conversation.md) |
| **Scope** | Phase 1 frontend only (`frontend/`). No backend work |
| **Last updated** | 2026-10-06 |

This is the step-by-step implementation roadmap for Phase 1. It adds no new requirements or architecture decisions. Every task traces back to the two documents above.

> **Naming:** to avoid confusion with product **Phase 1 / Phase 2** (frontend vs. backend), the implementation phases below are called **Stages 0–13**.

---

## How we work through this file

### Status markers

| Marker | Meaning |
|---|---|
| `[ ]` | Not started |
| `[~]` | In progress |
| `[x]` | Done: implemented **and** Claude's verification passed |

Each task ends with a **Verification log** line, filled in on completion:
`Claude: ✅ <date> — <what was checked> · Manual: ⏳ pending / ✅ <date>`

### Workflow per task

1. Work on **one task at a time**, in order, after checking that its dependencies are done.
2. Implement only what the task describes.
3. **Claude runs the 🤖 verification steps** and fixes anything that fails before marking the task `[x]`.
4. Claude updates this file (status + verification log) and adds a short entry to `conversation.md`.
5. Claude reports the results and lists the **👤 manual browser checks** for Joseph. Joseph's confirmation is recorded as `Manual: ✅`.
6. Claude doesn't start the next task until Joseph says to continue (unless Joseph asks for several tasks in a row).

### Verification methods

| Symbol | Who | How |
|---|---|---|
| 🤖 | Claude | `npm run lint`, `npm run typecheck`, `npm run build`; HTTP checks against the running app with `curl` (status codes, server-rendered HTML, titles, meta tags, JSON-LD); `grep` checks on the source (e.g. no `localStorage` outside the storage module); logic checks with throwaway Node scripts in the scratchpad (never committed) |
| 👤 | Joseph | Interactive checks in a real browser: clicking, dialogs, localStorage-backed flows, responsive layouts (DevTools device toolbar at ~375px, ~768px, ~1280px). Claude cannot drive a browser in this environment (no browser automation tool was adopted, arch §2.2) |

**Standard checks**: every code task must also pass `npm run lint`, `npm run typecheck` and `npm run build` with no errors. This is not repeated in each task.

### Stage overview

| Stage | Name | Tasks | Architecture milestone |
|---|---|---|---|
| 0 | Project setup | TASK-001 – 005 | M1 |
| 1 | Foundation | TASK-006 – 011 | M1 |
| 2 | Data and service layer | TASK-012 – 024 | M2 |
| 3 | Authentication | TASK-025 – 030 | M5 |
| 4 | Product discovery | TASK-031 – 039 | M3 |
| 5 | Product details | TASK-040 – 045 | M4 |
| 6 | Cart | TASK-046 – 047 | M4 |
| 7 | Wishlist | TASK-048 | M6 |
| 8 | Checkout and addresses | TASK-049 – 050 | M7 |
| 9 | Orders | TASK-051 – 054 | M7 |
| 10 | Account | TASK-055 | M8 |
| 11 | Static pages and navigation completion | TASK-056 | M8 |
| 12 | Integration and validation | TASK-057 – 060 | M9 |
| 13 | Final quality pass | TASK-061 – 065 | M9 |

> Authentication (Stage 3) comes before product discovery (Stage 4), unlike the milestone order in arch §22. That way, product cards and Product Details can use real login-required behaviour as soon as they're built. All customer-data adapters are built in Stage 2, so later stages only build UI on top of them.

### Progress

**65 / 65 tasks done** (Claude's verification). Joseph's browser checks are listed in [`docs/manual-testing.md`](docs/manual-testing.md).

---

## Stage 0 — Project setup

- [x] **TASK-001 — Repository structure**
  - **Goal:** Create the monorepo layout with placeholders for later phases.
  - **Depends on:** —
  - **Requirements:** req §3; arch §5
  - **Implementation notes:**
    - `frontend/`, `backend/` (placeholder README only; no technology chosen) and `docs/`.
    - Root `README.md`, `.gitignore`, `requirements.md` and `conversation.md`.
  - **Acceptance criteria:**
    - The folders and files exist.
    - `backend/` contains only a README stating that the backend is built in product Phase 2.
  - **Verification:**
    - 🤖 List the repository tree and confirm that `backend/` has no implementation.
  - **Verification log:** Claude: ✅ 2026-10-06 — structure listed; backend/ contains only README.md · Manual: n/a

- [x] **TASK-002 — Scaffold the Next.js app**
  - **Goal:** A clean Next.js App Router project in `frontend/`.
  - **Depends on:** TASK-001
  - **Requirements:** arch §2.1, §5, §20
  - **Implementation notes:**
    - Use `create-next-app` with npm, TypeScript, Tailwind CSS, ESLint, App Router, the `src/` directory and the `@/*` import alias.
    - Remove the starter boilerplate (demo page content, demo assets).
    - Keep the existing `frontend/README.md` content and merge it into the new one.
    - **Do not** create `src/pages`.
  - **Acceptance criteria:**
    - `npm run dev` serves a blank Nivora placeholder page at `/`.
    - `package-lock.json` exists, and there are no other lockfiles.
    - `strict: true` is set.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 🤖 `curl -s localhost:3000` returns 200.
    - 🤖 Confirm that no `src/pages` folder exists and that the only lockfile is `package-lock.json`.
  - **Verification log:** Claude: ✅ 2026-10-06 — Next.js 16.3.8 / React 19.2.8 scaffolded with `create-next-app --empty` (TS, Tailwind 4, ESLint, App Router, `src/`, `@/*`, npm, no git); lint clean; `tsc --noEmit` clean; `npm run build` OK (`/` static); dev `curl /` → 200 with `<title>Nivora</title>` and `<h1>Nivora</h1>`; no `src/pages`; only `package-lock.json`; `strict: true`. Notes: Next.js generated `AGENTS.md`/`CLAUDE.md` (kept; they point agents to version-matched docs); `npm audit` reports 5 high issues, all one dev-only `braces` advisory via `eslint-config-next`; the forced fix would downgrade to Next 14, so it was left for an upstream fix · Manual: ⏳ optional — run `npm run dev` and open http://localhost:3000

- [x] **TASK-003 — Install agreed dependencies**
  - **Goal:** Add only the libraries agreed in arch §2.1.
  - **Depends on:** TASK-002
  - **Requirements:** arch §2.1, §2.2
  - **Implementation notes:**
    - Install `@tanstack/react-query`, `zustand`, `react-hook-form`, `zod` and `@hookform/resolvers` (provides `zodResolver`, arch §15).
    - Install `prettier` and `eslint-config-prettier` as dev dependencies.
    - Nothing else. Any further library needs Joseph's approval first.
  - **Acceptance criteria:**
    - `package.json` dependencies match the agreed list.
    - No Radix UI, icon library, test framework, React Router or UI kit.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 🤖 Diff `package.json` dependencies against the agreed list.
  - **Verification log:** Claude: ✅ 2026-10-06 — installed @tanstack/react-query 5.104, zustand 5.0, react-hook-form 7.89, zod 4.6, @hookform/resolvers 5.9; dev: prettier 3.9, eslint-config-prettier 10.1; a script confirmed dependencies and devDependencies match the agreed lists exactly and no banned packages are present; `npm audit` unchanged (same dev-only `braces` chain); lint, typecheck and build clean · Manual: n/a

- [x] **TASK-004 — Base configuration and environment**
  - **Goal:** The project configuration that the architecture relies on.
  - **Depends on:** TASK-003
  - **Requirements:** arch §5, §10.3, §17.2, §20
  - **Implementation notes:**
    - **Prettier:** `.prettierrc`.
    - **npm scripts:** `typecheck` (`tsc --noEmit`) and `format`.
    - **ESLint project rules** (arch §20):
      - Ban `localStorage`/`sessionStorage` except in `src/api/client/mock/storage.ts`.
      - `no-restricted-imports` for `@/api/*/mock/*` and `@/data/*` outside `src/api`.
      - Server/client boundary restrictions.
    - **Environment:** `.env.example` with `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_DATA_SOURCE=mock`, `NEXT_PUBLIC_MOCK_LATENCY_MS=250` and `NEXT_PUBLIC_ALLOW_INDEXING=false`.
    - **Config modules:**
      - `src/config/site.ts`: reads the env with safe defaults.
      - `src/config/constants.ts`: delivery charges, free-delivery threshold, page size (req §22).
    - **Images:** `next.config.ts` with a placeholder `images.remotePatterns` (the final host is set in TASK-015).
  - **Acceptance criteria:**
    - The lint rules fire. A temporary test file using `localStorage` outside the storage module fails lint, and the file is then deleted.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 🤖 Run lint against a temporary violating file and confirm it errors.
    - 🤖 `npm run format:check` passes.
  - **Verification log:** Claude: ✅ 2026-10-06 — added `.prettierrc`/`.prettierignore`; scripts `typecheck`, `format`, `format:check` (a separate check script instead of `format -- --check`, since Prettier's `--write` and `--check` don't combine); ESLint rules for the storage ban, mock/data import ban, route-file/browser/server boundaries, components/domain limits, and an in-config `nivora/client-boundary` rule for `'use client'` files; `eslint-config-prettier`; `.env.example` + `.env` (at Joseph's request; git-ignored, `.env.example` stays tracked, checked with `git check-ignore`); `src/config/site.ts` (literal `process.env.NEXT_PUBLIC_*` reads per the Next 16 docs) and `src/config/constants.ts`; `next.config.ts` with empty `images.remotePatterns`; README documents the scripts, env and boundaries. Checks: 7 temporary violating files each failed lint with the intended message, and the permitted `storage.ts` passed (all temporary files deleted); a scratch script confirmed `siteConfig` defaults, valid overrides and safe fallbacks on invalid values; format:check, lint, typecheck and build clean · Manual: n/a

- [x] **TASK-005 — Application entry point and README**
  - **Goal:** The root layout, providers and project documentation for running the app.
  - **Depends on:** TASK-004
  - **Requirements:** req §2; arch §5, §10.1, §11.1
  - **Implementation notes:**
    - **`src/app/layout.tsx`:** `<html lang="en">`, global CSS, and default metadata (`metadataBase`, title template `%s | Nivora`, default title `Nivora — Online Shopping`, description).
    - **`src/providers/Providers.tsx`:** a client component that creates the `QueryClient` per browser session with the defaults from arch §11.1.
    - **`frontend/README.md`:** prerequisites (Node LTS, npm), setup, scripts and environment variables.
  - **Acceptance criteria:**
    - The browser tab shows "Nivora — Online Shopping".
    - The providers render without hydration warnings.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 🤖 `curl` `/` and confirm that `<title>Nivora — Online Shopping</title>` and `lang="en"` are present.
    - 👤 Open `/` in the browser and confirm the console has no errors or hydration warnings.
  - **Verification log:** Claude: ✅ 2026-10-06 — root layout with `metadataBase` (from `siteConfig.url`), title template `%s | Nivora`, default `Nivora — Online Shopping`, description, application name and Open Graph basics (site name, `en_IN`, website); `Providers` (client) with a per-session `QueryClient` (`retry: false`, `refetchOnWindowFocus: false`); `siteConfig.description` added; frontend README already covers prerequisites, setup, scripts and env (TASK-004). Checks: format:check, lint, typecheck and build clean; production server `curl /` → `lang="en"`, the correct `<title>`, description, application-name and `og:*` tags; a temporary `/tmpcheck` page titled "Cart" rendered `<title>Cart | Nivora</title>`, confirming the template (page deleted, build re-run) · Manual: ⏳ open http://localhost:3000 with DevTools Console and confirm no errors or hydration warnings

## Stage 1 — Foundation

- [x] **TASK-006 — Design tokens, typography and brand assets**
  - **Goal:** Nivora's own visual identity, defined once.
  - **Depends on:** TASK-005
  - **Requirements:** req §2, §31; arch §17.1
  - **Implementation notes:**
    - **Tokens:** `@theme` in `globals.css` for brand/accent colours, neutrals, semantic colours (success, warning, danger, sale), type scale, radii and shadows.
    - **Fonts:** loaded with `next/font`.
    - **Brand assets:** Nivora wordmark/logo (`Logo` component), `app/icon.svg` and `public/og/nivora-default.png`.
    - **Distinct identity:** the palette and logo must not resemble Amazon or Flipkart.
    - **Approval:** show Joseph the palette and logo before building on them.
  - **Acceptance criteria:**
    - Tokens are usable as Tailwind utilities (e.g. `bg-brand-600`).
    - The favicon shows.
    - Body text meets WCAG AA contrast.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 🤖 Calculate the contrast ratios of the main text and button colour pairs with a scratch script, and confirm they are ≥ 4.5:1.
    - 👤 Review and approve the palette, typography and logo.
  - **Verification log:** Claude: ✅ 2026-10-06 — tokens in `globals.css` `@theme` (brand "lagoon" teal 50–950, coral accent 50–700, ink/canvas/surface/line neutrals, success/warning/danger/sale/rating, radii, shadows); Plus Jakarta Sans via `next/font` (`--font-jakarta`); global `:focus-visible` ring and reduced-motion rule; `Logo`/`LogoMark` components, `app/icon.svg` favicon, `public/og/nivora-default.png` (1200×630, set as the default OG/Twitter image), `public/images/placeholder-product.svg`. Checks: 21 text/UI contrast pairs all pass WCAG AA (body text 16.8:1, primary button 7.0:1, sale 5.5:1; `line-strong` darkened to 3.5:1 and `success` darkened for margin); a temporary page using every token confirmed all 35 colour tokens and 4 shape/depth tokens compile to utilities (page deleted); production server: font class on `<html>`, `<link rel="icon">` + `/icon.svg` 200, `og:image` + `summary_large_image`, focus styles in CSS · Manual: ⏳ Joseph to review and approve the palette, typography and logo on `/dev/ui`

- [x] **TASK-007 — Basic UI primitives and icons**
  - **Goal:** The reusable building blocks of the UI kit.
  - **Depends on:** TASK-006
  - **Requirements:** req §31; arch §17.2, §17.4, §18
  - **Implementation notes:**
    - **Components:** `cn()`, Button (primary/secondary/ghost/danger; sizes; loading and disabled states), IconButton (requires `aria-label`), Input, Select, Checkbox, Radio (with labels, error text and `aria-invalid`/`aria-describedby`), Badge, Spinner, Skeleton and VisuallyHidden.
    - **Icons:** the in-house SVG set listed in arch §17.4.
    - **Dev preview:** a temporary page at `/dev/ui` that shows every primitive. It is removed in TASK-064.
  - **Acceptance criteria:**
    - All variants and states render.
    - Controls have visible focus rings and are keyboard operable.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 🤖 `grep` confirms that every IconButton usage has an `aria-label`.
    - 👤 Tab through `/dev/ui` and check the focus rings and the disabled and loading states.
  - **Verification log:** Claude: ✅ 2026-10-06 — `cn()`; Button (4 variants, 3 sizes, loading with spinner + `aria-busy`, disabled, `buttonClasses()` for links), IconButton (`label` is a required prop → `aria-label`), Input/Select (label, hint, error, `aria-invalid`, `aria-describedby`, `useId`), Checkbox/Radio, Badge (6 variants), Spinner (`role="status"`), Skeleton, VisuallyHidden; 24 in-house SVG icons (decorative by default); `/dev/ui` preview (`noindex, nofollow`). Checks: lint, typecheck, build; every `<IconButton>` has a label, and a temporary file without one failed typecheck (TS2741); `curl /dev/ui` shows every primitive, the error/ARIA attributes, disabled buttons and 32 icons; the swatch classes and `focus-visible:ring-2` are in the CSS. Fixed during verification: dynamically built swatch class names would not compile under Tailwind, so they became literals · Manual: ⏳ Tab through `/dev/ui` (focus rings; disabled and loading button states)

- [x] **TASK-008 — Overlays, toasts and focus management**
  - **Goal:** Accessible overlays, built in-house.
  - **Depends on:** TASK-007
  - **Requirements:** req §31; arch §11.2, §18
  - **Implementation notes:**
    - **Hooks:** `useFocusTrap`, `useMediaQuery` and `useHasMounted`.
    - **Dialog:** `role="dialog"`, `aria-modal`, labelled title, focus trap, focus returned to the trigger, Escape to close, scroll lock.
    - **Drawer:** the same behaviour, sliding in from the side.
    - **Dropdown:** keyboard opening, arrow-key navigation, Escape to close, `aria-expanded`.
    - **Toasts:** `toastStore` (Zustand) and a `Toaster` with an `aria-live="polite"` region, mounted in Providers.
  - **Acceptance criteria:**
    - Dialog, Drawer and Dropdown can be fully operated by keyboard.
    - Toasts are announced to screen readers and auto-dismiss.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 👤 On `/dev/ui`:
      - open a dialog;
      - Tab cycles within it;
      - Escape closes it and focus returns to the trigger;
      - the drawer behaves the same way;
      - the dropdown works with the arrow keys;
      - a toast appears and disappears.
  - **Verification log:** Claude: ✅ 2026-10-06 — hooks `useFocusTrap` (initial focus incl. `data-autofocus`, Tab/Shift+Tab cycling, focus return), `useMediaQuery`, `useHasMounted` (`useSyncExternalStore`, hydration-safe); shared `ModalLayer` (portal, backdrop, `role="dialog"` + `aria-modal` + labelled title, Escape, inert background, nested-safe scroll lock); `Dialog` (bottom sheet on mobile) and `Drawer` (left/right/bottom); `Dropdown` menu button (Enter/Space/ArrowDown/ArrowUp open, arrows/Home/End, Escape returns focus, Tab and outside click close); `toastStore` (Zustand; max 3, auto-dismiss 5 s, `toast.success/error/info`) + `Toaster` (`aria-live="polite"` region, pause on hover/focus, link action) mounted in Providers; animation tokens. Checks: a script tested the toast store (defaults, unique IDs, cap of 3, dismiss); every required ARIA/keyboard behaviour is present in the source; the live region is server-rendered on `/` and `/dev/ui`; lint, typecheck, build. Improvement made during review: the toaster region is kept out of the inert background so toasts stay announced while a dialog is open · Manual: ⏳ on `/dev/ui`: dialog Tab trap, Escape, focus return; drawers; dropdown arrow keys; toasts appear and auto-dismiss

- [x] **TASK-009 — Commerce display primitives and states**
  - **Goal:** Shared components for pricing, ratings, images and page states.
  - **Depends on:** TASK-007
  - **Requirements:** req §14, §29, §31; arch §6, §17.2
  - **Implementation notes:**
    - **Formatting:** `lib/format.ts` (₹ with `en-IN` digit grouping; dates).
    - **Price:** current price, struck-through original price and "% off".
    - **Rating:** stars plus review count, with an accessible label.
    - **ProductImage:** wraps `next/image` with a fixed aspect ratio, `sizes`, optional `priority`, and a placeholder fallback.
    - **Other components:** Breadcrumbs (`nav` + `aria-current`), EmptyState (message + action), ErrorState (message + Try again).
  - **Acceptance criteria:**
    - `₹124999` displays as `₹1,24,999`.
    - A broken image URL shows the placeholder, not a broken-image icon.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 🤖 A scratch script checks the `format.ts` outputs (₹0, ₹999, ₹1,24,999).
    - 👤 On `/dev/ui`, the broken-image example shows the placeholder.
  - **Verification log:** Claude: ✅ 2026-10-06 — `lib/format.ts` (`formatPrice` ₹ en-IN with no decimals, `formatCount`, `formatDate`/`formatDateTime` fixed to Asia/Kolkata so server and browser agree); Price (current, struck `<del>` original, "% off" from a domain-supplied percentage, optional "From" prefix, screen-reader labels), Rating (full/half/empty stars, one spoken label), ProductImage (fixed aspect ratio, `sizes`, lazy by default, `loading="eager"` + `fetchPriority="high"` for priority images per the Next 16 docs, since `priority` is deprecated; falls back to the placeholder on error), Breadcrumbs (`aria-current="page"`), EmptyState, ErrorState (`role="alert"`, Try again). Checks: a script confirmed ₹0, ₹999, ₹1,24,999, ₹1,299, ₹1,00,00,000, 12,840, 6 Oct 2026 and the IST date rollover; `curl /dev/ui` shows the formatted prices, `<del>`, % off, rating labels, breadcrumb, empty/error states; the image optimizer returns 400 for the missing file (triggers `onError` → placeholder), 200 for a real image, and the placeholder SVG is served · Manual: ⏳ on `/dev/ui`, the broken-image example shows the Nivora placeholder

- [x] **TASK-010 — Layout shell: header, footer, responsive container**
  - **Goal:** The page frame shared by every shop page.
  - **Depends on:** TASK-008, TASK-009
  - **Requirements:** req §8.1, §8.3, §30, §31; arch §9.1, §17.3, §18
  - **Implementation notes:**
    - **`(shop)/layout.tsx`:** skip-to-content link, `Header`, `<main id="content">`, `Footer`.
    - **Header:**
      - Logo linking to `/`.
      - A search input slot (wired in TASK-038).
      - Wishlist icon, cart icon with count, and account area slots. These show stable placeholders for now and are wired in TASKs 025, 042 and 044.
      - Nav slot (wired in TASK-031).
    - **Footer:** About Nivora, Contact, Help, Returns, Privacy, Terms, plus "© 2026 Nivora".
    - **Container:** a max-width wrapper.
    - **Mobile header layout:** logo, full-width search row, wishlist, cart and menu button. `MobileMenu` is a Drawer.
    - **(checkout) layout:** a simplified header.
  - **Acceptance criteria:**
    - The header and footer render on every `(shop)` page.
    - There is no horizontal scrolling at any width from 320px to 1440px.
    - The skip link works.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 🤖 `curl` `/` and confirm the HTML contains the `header`, `nav`, `main` and `footer` landmarks and all six footer links.
    - 👤 Resize to ~375px, ~768px and ~1280px and check the layout. The mobile menu opens and closes with the keyboard.
  - **Verification log:** Claude: ✅ 2026-10-06 — `ShopShell` (skip link, sticky `SiteHeader`, `<main id="content">`, `SiteFooter`) used by `(shop)/layout.tsx`; `CheckoutShell` (logo, "Back to cart", small footer) used by `(checkout)/layout.tsx`; header: logo link ("Nivora home"), GET search form (desktop inline, full-width row below `md`), Wishlist/Cart icon links, Login link (session-aware in TASK-025), `MobileMenu` drawer below `lg`, Main nav row (Home only until TASK-031); footer with 3 link groups covering all 6 info pages + "© 2026 Nivora"; `Container`; `config/routes.ts` path builders + `INFO_PAGES` + `isSafeInternalPath`; `Logo` gains an inverse tone. Checks: lint, typecheck, format, build; `curl /` → 200 with the header/nav/main/footer landmarks, skip link, search role, labelled icon links and all 6 footer links with correct text; the two search inputs have unique ids; footer contrast 11–16:1. Fixed during review: at 320px the header contents measured ~321px against 288px available, so the logo and action buttons are slightly smaller below `sm` (~280px) · Manual: ⏳ check ~375/768/1280px for no horizontal scroll; mobile menu opens and closes with the keyboard

- [x] **TASK-011 — Routing skeleton and error/not-found patterns**
  - **Goal:** Every route in arch §9.2 exists as a stub with the correct layout, plus the error handling patterns.
  - **Depends on:** TASK-010
  - **Requirements:** req §8.4, §8.5, §29; arch §9.1, §9.2, §16
  - **Implementation notes:**
    - **Route files:** create every route file under `(shop)` and `(checkout)`, including `(info)/[page]`.
    - **Paths:** `config/routes.ts` path builders. No hand-written paths in components.
    - **Error and loading patterns:**
      - `app/not-found.tsx`: Nivora 404 page with a way back to shopping.
      - `(shop)/error.tsx` and `(checkout)/error.tsx`: "Something went wrong" with Retry and a link home.
      - `global-error.tsx`.
      - A `loading.tsx` pattern using Skeletons.
    - **Titles:** each stub sets its page title through metadata.
  - **Acceptance criteria:**
    - Every route in arch §9.2 responds.
    - Unknown paths return the Nivora 404 page with status 404.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 🤖 A `curl` loop over all routes from arch §9.2 checks for 200, and that `/does-not-exist` returns 404 with the Nivora 404 content.
    - 🤖 Check that each stub's `<title>` follows `<Page> | Nivora`.
  - **Verification log:** Claude: ✅ 2026-10-06 — read the Next.js 16 docs first (error boundaries use `retry()`; unmatched URLs render outside route-group layouts; streaming fixes the status at 200). Created every route in arch §9.2 as a stub: `(shop)` home, `c/[category]`, `c/[category]/[subcategory]`, `collections/[collection]`, `search`, `p/[slug]` (+ `loading.tsx`), `cart`, `wishlist`, `login`, `signup`, `account/` (layout + `loading.tsx`, profile, orders, order details, addresses), `(info)/[page]` (6 pages pre-built, `dynamicParams = false`); `(checkout)` `checkout` and `order-confirmation/[orderId]`. Private pages are `noindex, nofollow`. Patterns: `app/not-found.tsx` (wraps `ShopShell`) + `(shop)/not-found.tsx`; `(shop)/error.tsx` and `(checkout)/error.tsx` via `RouteErrorView` (Try again → `retry()`, Go to Home); `global-error.tsx` (own document); `PageSkeleton` loading pattern. Decision recorded in arch §9.2: no group-wide `loading.tsx`, and `notFound()` must run before anything that streams, so 404s keep a real 404 status. Checks: lint, typecheck, format, build; all 24 routes return the expected status, title, layout and robots meta; `/does-not-exist` and `/some/deep/unknown/path` → 404 with the Nivora 404 page inside the shop layout; a temporary throwing route returned 500 without leaking the error message (route removed). Limitation: Next 16 renders the error boundary UI in the browser during hydration, so its visual check needs a browser (re-checked in TASK-062) · Manual: optional — visit a few stub routes and a bad URL

## Stage 2 — Data and service layer

> Builds the full data layer from arch §6–§8. After this stage, no UI may touch `localStorage`. Every later stage builds UI on these services.

- [x] **TASK-012 — Domain types and constants**
  - **Goal:** The typed domain model.
  - **Depends on:** TASK-004
  - **Requirements:** req §15.2, §24.2; arch §6
  - **Implementation notes:**
    - **`domain/types.ts`:** Category, Subcategory, Product, ProductOption, Variant, ProductSummary, ProductQuery, ProductListResult, Facets, CartLine, CartView, PriceSummary, Address, User, Order, OrderItem, OrderStatus, CheckoutView, DeliveryOption and CollectionId.
    - **Modelling rules:** every product has at least one variant; money is whole rupees.
  - **Acceptance criteria:**
    - Types compile.
    - The Order type contains every field in req §24.2.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 🤖 Cross-check the Order fields against req §24.2 field by field.
  - **Verification log:** Claude: ✅ 2026-10-06 — `domain/types.ts`: catalog (Category, Subcategory, Collection, Product, ProductOption, Variant, ProductSummary), listing (SortOption, ProductQuery, Facets, PriceBand, ProductListResult, StockAdjustments), cart/pricing (CartLine, CartIssue, ResolvedLine, CartView, CheckoutView, PriceSummary, DeliveryOption), customers (User, Address, inputs) and orders (Order, OrderItem snapshots, OrderSummary, statusHistory, isSample). Constants were already in `config/constants.ts`. Added the ESLint rule `@typescript-eslint/consistent-type-imports` and a scratch resolver so verification scripts can run the real source in Node. Checks: typecheck; a script confirmed all 15 req §24.2 fields map to Order/OrderItem · Manual: n/a

- [x] **TASK-013 — Category taxonomy and collections data**
  - **Goal:** The fixed taxonomy and the collection definitions.
  - **Depends on:** TASK-012
  - **Requirements:** req §9, §9.1, §11; arch §5
  - **Implementation notes:**
    - **`data/categories.ts`:** exactly 5 categories and 24 subcategories with the names from req §9, plus slugs and descriptions.
    - **`data/collections.ts`:** Best Sellers, Special Offers and New Arrivals, with their definitions from req §9.1.
    - Collections are **not** part of the taxonomy.
  - **Acceptance criteria:**
    - The category and subcategory names match req §9 exactly.
    - There are no extra categories or subcategories.
  - **Verification:**
    - 🤖 A scratch script compares the names to the req §9 table (5 / 24, exact strings).
  - **Verification log:** Claude: ✅ 2026-10-06 — `data/categories.ts` (5 categories in nav order with descriptions; 24 subcategories with ids `<category>-<slug>`) and `data/collections.ts` (best-sellers, special-offers, new-arrivals with default sorts). Checks: a script confirmed exact names and order against req §9, 24 unique ids, URL-safe slugs, and that collections are not in the taxonomy · Manual: n/a

- [x] **TASK-014 — Mock products: Fashion and Mobiles**
  - **Goal:** A realistic dataset for the two variant-heavy categories.
  - **Depends on:** TASK-013
  - **Requirements:** req §15, §16.2; decisions D2, D3, D14
  - **Implementation notes:**
    - **Coverage:** at least 6 products per subcategory (9 subcategories).
    - **Fashion variants:** Size and Color.
    - **Mobiles variants:** RAM and Storage (and Color), with per-variant prices.
    - **Brands:** real brand names for Mobiles; a mix elsewhere; text only (D3).
    - **Images:** realistic stock-photo URLs from one host (D2), several per product.
    - **Other data:** specifications and filter attributes.
    - **Required cases:** some fully out-of-stock products, products with some out-of-stock variants, and low-stock variants (1–3).
    - **Spread:** best-seller and new-arrival flags, a range of discounts (including none), products under ₹999 and premium products.
  - **Acceptance criteria:** Every requirement in req §15.1 is represented in these categories.
  - **Verification:**
    - 🤖 A scratch script checks:
      - counts per subcategory;
      - unique IDs, slugs and variant IDs;
      - every variant has `price ≤ originalPrice`;
      - each listed required case exists;
      - every image URL uses the chosen host.
    - 🤖 `curl -I` on a sample of image URLs returns 200.
  - **Verification log:** Claude: ✅ 2026-10-06 — Images: 288 free Unsplash photos (Unsplash License) found per subcategory through the web fetch tool (direct API/HTML access is blocked) and **every URL checked with curl (288/288 → 200 image/\*)**. A scratch generator turns compact specs into typed data: `data/products/fashion.ts` (34 products, sizes/colours) and `data/products/mobiles.ts` (29; real brands such as Samsung, Apple, OnePlus, Xiaomi, Google, Sony; phones use explicit RAM+Storage combos with per-variant prices). Fixed during checks: numeric RAM ordering; slug rules (`+` dropped, accents normalised: `pique`, `lumiere`). Checks: a data-quality script — ≥6 per subcategory, unique ids/slugs/variant ids, price ≤ MRP, one valid value per option, image host, 4 fully out-of-stock, 7 partly out of stock, 14 low-stock, discounts 0–80%, ≤ ₹999 and ≥ ₹20,000 items, 17 brands per category · Manual: n/a

- [x] **TASK-015 — Mock products: Home Appliances, Beauty, Toys + seeded orders**
  - **Goal:** Complete the dataset and the sample order history.
  - **Depends on:** TASK-014
  - **Requirements:** req §12.2, §15, §25.5; decisions D8, D11
  - **Implementation notes:**
    - **Coverage:** at least 6 products per subcategory (15 subcategories).
    - **Home Appliances attributes:** Capacity and Energy Rating.
    - **Beauty attributes:** Product Type and Skin/Hair Type.
    - **Toys attributes:** Age Group.
    - **Seeded orders:** `data/seedOrders.ts` has 3–4 orders for the test user (Delivered, Shipped, Confirmed, Cancelled) using real product snapshots, with Cash on Delivery, `isSample: true` and correct totals.
    - **Other data:** `data/indianStates.ts` and `data/infoPages.ts` (stub copy).
    - **Images:** set the final `images.remotePatterns` host in `next.config.ts`.
  - **Acceptance criteria:**
    - All 24 subcategories have at least 6 products (~150+ in total).
    - The seeded order totals are consistent.
  - **Verification:**
    - 🤖 The TASK-014 script extended to the full dataset.
    - 🤖 A script recomputes the seeded order totals from their items.
    - 🤖 `npm run build` succeeds with the remote pattern set.
  - **Verification log:** Claude: ✅ 2026-10-06 — `homeAppliances.ts` (25; real brands LG, Samsung, Whirlpool, Godrej, Haier, IFB, Bosch, Voltas, Daikin, …; capacity + energy rating), `beauty.ts` (30; fictional brands; productType + skinHairType; lipstick/foundation shades, 50/100 ml perfume sizes), `toys.ts` (36; fictional brands; ageGroup); `products/index.ts` (154 products, 346 variants); `seedUsers.ts` (test user); `seedOrders.ts` (4 orders generated from the catalog: Delivered, Cancelled/Express, Shipped, Confirmed/₹40 delivery; `isSample`; counter = 4); `indianStates.ts` (36); `infoPages.ts` (stub copy for 6 pages); `next.config.ts` remotePatterns limited to `images.unsplash.com/photo-**` with the exact catalog query string. Checks: full-catalog data script (all pass after adding missing fragrance tags); a script recomputed every seed-order total and checked the snapshots against the catalog; lint, typecheck, build; the optimizer served a product photo (200 image/jpeg) and rejected the same photo with a different query (400) · Manual: n/a

- [x] **TASK-016 — Domain rules: catalog (pricing, stock, filters, sort, search)**
  - **Goal:** Pure functions behind listings and product pages.
  - **Depends on:** TASK-012
  - **Requirements:** req §9.1, §12, §13; arch §6, §13
  - **Implementation notes:**
    - **`pricing.ts`:** listing price (lowest in-stock variant, D14), discount %, line totals, cart summary, delivery charge (Standard ₹40, free at ₹499 or more after discounts; Express ₹99).
    - **`stock.ts`:** effective stock, availability, maximum addable quantity.
    - **`filters.ts`:**
      - applies the common and category-specific filters;
      - OR within a filter, AND across filters;
      - a product matches a variant filter if any of its variants matches;
      - builds facets from the result set.
    - **`sort.ts`:** the six sort orders, with out-of-stock last under relevance.
    - **`search.ts`:** tokens, field-weighted scoring.
  - **Acceptance criteria:** The behaviour matches req §12–§13 and arch §13.
  - **Verification:**
    - 🤖 A scratch script with representative cases:
      - delivery charge at ₹498 / ₹499 / Express;
      - listing price for variant products;
      - an OR/AND filter combination;
      - each sort order;
      - a search ranking where a name match beats a description match.
  - **Verification log:** Claude: ✅ 2026-10-06 — `pricing.ts` (discount %, listing variant per D14, delivery charge, `summarize`), `stock.ts` (effective stock, max addable, stock status), `catalog.ts` (`toProductSummary`, `findVariant`, `formatOptions`, taxonomy helpers), `search.ts` (accent-free tokens, light stemming, every-word matching, field weights + phrase bonus), `sort.ts` (6 comparators; relevance: in-stock first, then score, then best seller/rating/popularity), `filters.ts` (`FILTER_SOURCES` mapping filter keys to variant options or attributes; OR within / AND across; facets that ignore their own filter; price bands; collections; `queryCatalog` pipeline with pagination). Checks: 31 scenario tests on the real catalog — delivery at ₹498/₹499/express, summary maths, listing price moves when cheap variants sell out, OR/AND filters, array attributes, facet behaviour, all 6 sorts, out-of-stock last, plural and accent-insensitive search, name-first ranking, collections, pagination clamp · Manual: n/a

- [x] **TASK-017 — Domain rules: commerce and validation schemas**
  - **Goal:** Pure rules for carts and orders, and the shared Zod schemas.
  - **Depends on:** TASK-016
  - **Requirements:** req §7.3, §17.2, §17.5, §21, §24, §25.2, §26; arch §12.3, §15
  - **Implementation notes:**
    - **`cart.ts`:**
      - line identity by `variantId`;
      - add/increment capped at stock;
      - `mergeCarts`;
      - cart validation issues (missing, out of stock, exceeds stock).
    - **`orders.ts`:** build an order with snapshots and recomputed totals; `canCancel` (Placed/Confirmed).
    - **`validation.ts`:** login, signup (≥ 8 characters, a letter and a number; passwords match), address (mobile `^[6-9]\d{9}$`, PIN `^[1-9]\d{5}$`, state from the list, India), profile, and data-layer input schemas.
  - **Acceptance criteria:**
    - The merge sums quantities and caps them.
    - The schemas accept the valid examples and reject the invalid ones.
  - **Verification:**
    - 🤖 A scratch script checks:
      - merging overlapping and new lines;
      - the cap at stock;
      - `canCancel` for each status;
      - the schemas: `password123` is valid, `password` is invalid, PIN `000000` is invalid, mobile `5123456789` is invalid.
  - **Verification log:** Claude: ✅ 2026-10-06 — `domain/cart.ts` (`checkQuantity`, `addLine`/`setLineQuantity`/`removeLine`, `mergeCarts` summing + capping at stock with `mergedSavedItems` per D12, `assessLine`), `domain/orders.ts` (`buildOrder` with recomputed totals and snapshots, `formatOrderId`, `canCancel`, `cancelOrder`, `toOrderSummary`), `domain/validation.ts` (Zod 4: login, signup, address, profile, quantity/cart-item, delivery option; messages from req §28; each `satisfies` its domain input type). The Indian states list moved to `src/config/indianStates.ts` because domain code may not import `src/data` (architecture tree updated). Checks: 25 scenario tests — merge overlap/new/cap, add checks, line issues, order building/snapshots/cancel, and every validation example in the task · Manual: n/a

- [x] **TASK-018 — API contracts, errors and customer messages**
  - **Goal:** The contract that the UI codes against.
  - **Depends on:** TASK-012
  - **Requirements:** req §5.1, §28; arch §7.1, §7.3, §16
  - **Implementation notes:**
    - **`api/contracts.ts`:** CatalogApi, InventoryApi, AuthApi, CartApi, WishlistApi, AddressApi, CheckoutApi, OrderApi and ProfileApi, exactly as in arch §7.1.
    - **`api/errors.ts`:** `ApiError` and its codes.
    - **`lib/errorMessages.ts`:** customer wording for every code, matching the req §28 table.
  - **Acceptance criteria:** Every req §28 case has a message, and no message exposes technical text.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 🤖 Cross-check the req §28 rows against the `errorMessages` map.
  - **Verification log:** Claude: ✅ 2026-10-06 — `api/contracts.ts` (CatalogApi, ContentApi, ClientCatalogApi, InventoryApi, AuthApi, CartApi, WishlistApi, AddressApi, CheckoutApi, OrderApi, ProfileApi, ClientApi). Two additions to arch §7.1, both forced by the import rules: `ContentApi.getInfoPage` (route files can't read `@/data`) and `ClientCatalogApi.getProduct` with live stock (for the variant picker). `api/errors.ts` (`ApiError` with code + details, no TS parameter properties), `lib/errorMessages.ts`. Checks: all 15 req §28 rows produce the exact required wording (from the message map or the schemas); the req §24.1 'Only 2 units of …' example matches; no message contains technical text; unknown errors get the friendly fallback · Manual: n/a

- [x] **TASK-019 — Server catalog adapter**
  - **Goal:** The Phase 1 implementation of `CatalogApi`.
  - **Depends on:** TASK-015, TASK-016, TASK-018
  - **Requirements:** req §9–§13; arch §7.1, §13.1
  - **Implementation notes:**
    - **`api/server/mock/catalog.ts`:**
      - `getCategories`;
      - `listProducts` (filter → search → sort → paginate, plus facets);
      - `getProduct` (null when unknown);
      - `getCollection`;
      - `getAllProductSlugs`.
    - Pure: no storage and no latency.
    - **`api/server/index.ts`:** exports `catalog`.
  - **Acceptance criteria:**
    - Results, totals and facets are correct for representative queries.
    - Unknown slugs return null.
  - **Verification:**
    - 🤖 A scratch script queries: a category; a subcategory; a brand + price filter; `q=phone`; each collection; an unknown slug.
  - **Verification log:** Claude: ✅ 2026-10-06 — `api/server/mock/catalog.ts` (`listProducts` via `queryCatalog` with PAGE_SIZE 24, `getProduct`, `getCollection` using each collection's default sort, `getAllProductSlugs`, `getCategories` returning copies) + `mockContent.getInfoPage`; `api/server/index.ts` exports `catalog`, `content`, `collections`. Pure: no storage, no latency. Checks: 14 tests — category/subcategory totals and paging, brand+price, `q=phone`, each collection (membership + sort order), unknown slug → null, info pages; ~2 ms per search query · Manual: n/a

- [x] **TASK-020 — Client data infrastructure: storage, latency, seeding, session**
  - **Goal:** The only localStorage access point, plus the shared client plumbing.
  - **Depends on:** TASK-017, TASK-018
  - **Requirements:** req §5, §7.1, §7.4; arch §7.2, §8
  - **Implementation notes:**
    - **`storage.ts`:**
      - `nivora:v1:` prefix;
      - no-op fallbacks when `window` is undefined;
      - safe JSON parsing with fallbacks;
      - exceptions converted to `ApiError('UNKNOWN')`.
    - **`latency.ts`:** delay from `NEXT_PUBLIC_MOCK_LATENCY_MS`.
    - **`seed.ts`:** `ensureSeeded()` inserts the test user and the seeded orders once (`seed_version`) and **never creates a session**.
    - **`session.ts`:** resolves the current user and treats an invalid session as a guest.
    - **Query keys:** a central `queryKeys` object (arch §11.1).
  - **Acceptance criteria:**
    - First launch: the test user exists and there is no `auth_session`.
    - Corrupt JSON in any key does not crash anything.
  - **Verification:**
    - 🤖 A scratch script with an in-memory `localStorage` shim checks:
      - seeding is idempotent;
      - there is no session after seeding;
      - a corrupt `cart` value falls back to empty;
      - a session pointing to a missing user resolves to a guest.
    - 🤖 `grep` shows `localStorage` only in `storage.ts`.
  - **Verification log:** Claude: ✅ 2026-10-06 — `storage.ts` (the only storage access; `nivora:v1:` keys; server-safe; JSON/shape-guarded reads; in-memory fallback when localStorage is blocked; write failures → ApiError UNKNOWN), `records.ts`, `latency.ts` (`request()` = latency + seeding + error normalisation), `seed.ts` (`SEED_VERSION`; test user + 4 sample orders + order counter; never creates a session), `session.ts`, `lib/ids.ts`, `api/client/queryKeys.ts` (user-scoped keys + roots to clear on identity change). Checks: 17 tests with a localStorage shim — first-launch seeding, no session, idempotent re-seed, namespacing, corrupt/wrong-shape data, orphaned/malformed session → guest, request wrapper, blocked storage fallback, server-side reads/writes; grep: no storage access outside `storage.ts` · Manual: n/a

- [x] **TASK-021 — Client adapters: auth and profile**
  - **Goal:** The mock implementations of `AuthApi` and `ProfileApi`.
  - **Depends on:** TASK-020
  - **Requirements:** req §7, §17.5, §26, §27; arch §12.3
  - **Implementation notes:**
    - **login:** case-insensitive, trimmed email; on failure `INVALID_CREDENTIALS`; creates the session; merges the guest cart and returns `mergedSavedItems`.
    - **signup:** `EMAIL_TAKEN` on duplicates; creates the user and the session; merges the cart.
    - **logout:** removes `auth_session` and the user's `checkout_session` only.
    - **profile get/update:** name and phone; the email is read-only.
  - **Acceptance criteria:** Behaviour matches req §7 and §27.
  - **Verification:**
    - 🤖 A scratch script with the storage shim checks:
      - a wrong password is rejected;
      - `JOSEPH@example.com ` logs in;
      - a duplicate signup is rejected;
      - after logout the wishlist, addresses and orders still exist;
      - the merge result is correct.
  - **Verification log:** Claude: ✅ 2026-10-06 — `auth.ts` (login with case-insensitive trimmed email, generic INVALID_CREDENTIALS; signup with EMAIL_TAKEN and field errors; both start a session and merge the guest cart; logout clears only the session and that user's pending Buy Now), `profile.ts` (name/phone, email read-only), plus shared `catalogData.ts` (lazy product index via dynamic import), `inventory.ts`, `cartStore.ts`, `validate.ts`. Checks: 19 tests — wrong password, `JOSEPH@example.com␠`, duplicate signup in any case, data kept after logout, merge sum/cap, `mergedSavedItems` false/true cases, signup keeps the guest cart, profile rules, guest → UNAUTHENTICATED · Manual: n/a

- [x] **TASK-022 — Client adapters: inventory and cart**
  - **Goal:** The mock `InventoryApi` and `CartApi`.
  - **Depends on:** TASK-020
  - **Requirements:** req §17, §24.4; arch §3.1, §8
  - **Implementation notes:**
    - **Inventory:** `getAdjustments`, plus internal adjust/restore helpers.
    - **Cart:**
      - the guest cart vs. `byUser[userId]`;
      - add (stock including the quantity already in the cart), update and remove;
      - `getCart` returns resolved lines, issues and the PriceSummary (with the Standard delivery estimate);
      - lines with unknown products are removed and reported.
    - Product data is loaded with a dynamic `import()`.
  - **Acceptance criteria:** Adding the same variant increments the quantity; different variants create separate lines; stock caps are enforced.
  - **Verification:**
    - 🤖 A scratch script checks:
      - add same variant ×2 → one line with qty 2;
      - a different variant → 2 lines;
      - exceeding stock → `INSUFFICIENT_STOCK`;
      - the summary maths;
      - the guest and user carts are isolated.
  - **Verification log:** Claude: ✅ 2026-10-06 — `cart.ts` (add/update/remove with stock checks counting what's already in the cart; responses are always a fresh `CartView`), `resolve.ts` (lines resolved against current data: issues per line, missing products removed once with a notice, summary with the Standard delivery estimate), `catalog.ts` (`getProduct` with live stock per variant), `inventory.ts` (`getAdjustments`, `adjustStock`). Checks: 20 tests — one line per variant, separate lines per variant, summary maths, INSUFFICIENT_STOCK/OUT_OF_STOCK/INVALID_VARIANT/INVALID_QUANTITY, update/remove, guest vs user isolation, removed-product notice, sold-out flag and its recovery, live stock lookup · Manual: n/a

- [x] **TASK-023 — Client adapters: wishlist and addresses**
  - **Goal:** The mock `WishlistApi` and `AddressApi`.
  - **Depends on:** TASK-022
  - **Requirements:** req §18, §21
  - **Implementation notes:**
    - **Wishlist:**
      - requires auth;
      - no duplicates;
      - `moveToCart` adds to the cart and removes from the wishlist, with an out-of-stock check.
    - **Addresses:**
      - CRUD with schema validation;
      - `setDefault`;
      - the first address becomes the default.
  - **Acceptance criteria:** A guest call throws `UNAUTHENTICATED`; adding a duplicate is a no-op.
  - **Verification:**
    - 🤖 A scratch script checks:
      - guest calls are rejected;
      - adding twice leaves one entry;
      - move-to-cart works;
      - an invalid PIN is rejected;
      - default handling is correct.
  - **Verification log:** Claude: ✅ 2026-10-06 — `wishlist.ts` (login required; no duplicates; summaries with live stock; missing products cleaned; `moveToCart` validates the variant and stock, adds 1, removes from wishlist), `addresses.ts` (validated create/update with INVALID_ADDRESS field messages; first address is the default; exactly one default; deleting the default promotes another; listed default-first). Checks: 15 tests — guest rejection, duplicate add, move to cart, wrong-product variant, out-of-stock can't move, persistence across login, invalid PIN/phone, default rules, NOT_FOUND ids, per-user isolation · Manual: n/a

- [x] **TASK-024 — Client adapters: checkout and orders**
  - **Goal:** The mock `CheckoutApi` and `OrderApi`.
  - **Depends on:** TASK-022, TASK-023
  - **Requirements:** req §19, §20, §22–§25; arch §14.4–§14.7
  - **Implementation notes:**
    - **Checkout:**
      - `startBuyNow` replaces any pending Buy Now;
      - `startCartCheckout` clears it;
      - `getCheckout` falls back to the cart.
    - **`placeOrder`:**
      - runs every check in req §24.1 and recomputes totals;
      - creates an order ID like `NIV-2026-000123`;
      - snapshots the items and address;
      - reduces stock;
      - clears the purchased cart lines or the Buy Now.
    - **Orders:**
      - `list` (newest first);
      - `get` (`NOT_FOUND` for other users' orders);
      - `cancel` (Placed/Confirmed only; restores stock unless `isSample`).
  - **Acceptance criteria:** Behaviour matches req §19, §24 and §25.
  - **Verification:**
    - 🤖 A scratch script checks:
      - Buy Now leaves the cart untouched;
      - cart checkout removes only the purchased lines;
      - stock goes down after an order and back up after cancelling it;
      - cancelling a sample order doesn't change stock;
      - another user's order returns `NOT_FOUND`;
      - an empty cart gives `EMPTY_CART`;
      - a missing address gives `ADDRESS_REQUIRED`;
      - order IDs are unique and sequential.
  - **Verification log:** Claude: ✅ 2026-10-06 — `checkout.ts` (`startBuyNow` replaces any pending Buy Now and is limited by full stock; `startCartCheckout`; `getCheckout` falls back to the cart; `placeOrder` re-runs every req §24.1 check, recomputes totals, creates `NIV-<year>-NNNNNN`, snapshots items/address, reduces stock, removes purchased cart lines or clears the Buy Now), `orders.ts` (newest-first list, own-order access, cancel Placed/Confirmed with stock restore except sample orders), `api/client/index.ts` (assembled `api`). Checks: 21 tests through the `api` object — every case in the task plus Express charge, INSUFFICIENT_STOCK at place time with no order created, ORDER_NOT_CANCELLABLE. Then a full regression run: lint, typecheck, format, build and every Stage 2 suite (13, 15, 16–24 + data) all pass · Manual: n/a

## Stage 3 — Authentication

- [x] **TASK-025 — Session hook and header account area**
  - **Goal:** The UI knows who is logged in, without hydration flicker.
  - **Depends on:** TASK-011, TASK-021
  - **Requirements:** req §6, §7.1, §8.1; arch §11.1, §12.1
  - **Implementation notes:**
    - **`useSession()`:** returns `{ user, isAuthenticated, isLoading }`.
    - **Header account area:**
      - a placeholder on the server and first render;
      - then **Login** for guests, or a greeting plus an `AccountMenu` dropdown for logged-in users (Profile, Orders, Wishlist, Addresses, Logout).
  - **Acceptance criteria:**
    - First launch shows Login, not logged in.
    - No hydration warnings.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 🤖 `curl` `/` and confirm that the server HTML has the placeholder and no user name.
    - 👤 With fresh storage, the header shows Login and the console has no warnings.
  - **Verification log:** Claude: ✅ 2026-10-06 — `useSession` (TanStack Query, `staleTime: Infinity`, `isLoading` until read), `applyIdentity` (sets the session and removes user-scoped queries), `HeaderAccount` (placeholder → Login links for guests → 'Hi, <name>' dropdown with Profile, Orders, Wishlist, Addresses, Logout). Architecture fix: `components/layout` may not import features, so `SiteHeader`/`ShopShell` take header **slots** and the new `features/shell/ShopFrame` composes them; `(shop)/layout` and `app/not-found` use `ShopFrame`. Checks: lint, typecheck, build; server HTML for `/` and the 404 page has the placeholder and no greeting/login state · Manual: ⏳ fresh storage → header shows Login; no console warnings

- [x] **TASK-026 — Login page**
  - **Goal:** Working mock login.
  - **Depends on:** TASK-025
  - **Requirements:** req §7.2, §28; arch §15
  - **Implementation notes:**
    - **`LoginForm`:** React Hook Form + `loginSchema`, fields Email and Password, a Login button and a Signup link (forwarding `from`).
    - **Errors:** inline field errors; a form-level "Incorrect email or password."; focus moves to the first invalid field.
    - **On success:** set the session in the cache and redirect to `from` or Home (intents are added in TASK-030).
    - **Copy and metadata:** "Login to Nivora"; `noindex`.
  - **Acceptance criteria:** Every req §7.2 validation works, and joseph@example.com / password123 logs in.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 🤖 `curl` `/login` and confirm the `noindex` meta is present.
    - 👤 Try empty submit, an invalid email and a wrong password (check each message), then a correct login; refresh and confirm you're still logged in.
  - **Verification log:** Claude: ✅ 2026-10-06 — `LoginView`/`LoginForm` (React Hook Form + `loginSchema`; inline field errors; focus to first invalid; form-level 'Incorrect email or password.'; 'Please log in to continue.' when arriving via `?from=`; Signup link forwards `from`), `useLogin` → `applyIdentity` + `resumeIntent`; page wraps the `useSearchParams` reader in `<Suspense>` per the Next 16 docs. Checks: lint, typecheck, build; `/login` → 200, `noindex, nofollow`, skeleton fallback in server HTML · Manual: ⏳ empty submit, invalid email, wrong password messages; correct login; refresh keeps the session

- [x] **TASK-027 — Signup page**
  - **Goal:** Working mock signup.
  - **Depends on:** TASK-026
  - **Requirements:** req §7.3, §28
  - **Implementation notes:**
    - **`SignupForm`:** Name, Email, Password, Confirm Password; `signupSchema`; `EMAIL_TAKEN` shown on the email field.
    - **On success:** authenticate and redirect (same as login).
    - **Copy and metadata:** "Create your Nivora account"; `noindex`.
  - **Acceptance criteria:** Every req §7.3 validation works, and a new user is logged in after signing up.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 👤 Check:
      - password mismatch, weak password and existing email each show the right error;
      - a valid signup logs you in;
      - after logging out, you can log in again with the new account.
  - **Verification log:** Claude: ✅ 2026-10-06 — `SignupView`/`SignupForm` (Name, Email, Password with the rule as a hint, Confirm Password; `signupSchema`; data-layer field errors such as EMAIL_TAKEN are put back on the field; Login link forwards `from`), `useSignup`. Checks: lint, typecheck, build; `/signup` → 200 + `noindex`; data-layer behaviour already covered by TASK-021 tests · Manual: ⏳ mismatch / weak password / existing email messages; valid signup logs in; logout and log back in

- [x] **TASK-028 — Logout and identity changes**
  - **Goal:** A clean switch back to guest mode.
  - **Depends on:** TASK-026
  - **Requirements:** req §27; arch §11.1
  - **Implementation notes:**
    - **`useLogout`:** clears the session, removes all user-scoped queries, redirects to `/`, and shows a toast.
    - **Login/signup:** also reset user-scoped queries when the identity changes.
  - **Acceptance criteria:**
    - After logout the header shows Login.
    - The data persisted for the user remains in storage.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 👤 Log in, log out, and confirm you land on Home as a guest. In DevTools → Application, the user's wishlist, addresses and orders keys are still present.
  - **Verification log:** Claude: ✅ 2026-10-06 — `useLogout` (sets a short-lived 'leaving' flag so guards don't bounce to Login, navigates Home, `applyIdentity(null)` clears user-scoped cache, toast 'You have been logged out.'); Logout added to the account menu; login/signup also reset user-scoped queries. Checks: lint, typecheck, build; data kept after logout already verified in TASK-021 · Manual: ⏳ log in → log out → Home as guest; storage keys still present

- [x] **TASK-029 — Route guards**
  - **Goal:** Protected and guest-only pages behave correctly.
  - **Depends on:** TASK-028
  - **Requirements:** req §6, §6.1, §27; arch §9.3
  - **Implementation notes:**
    - **`RequireAuth`:** in `account/layout.tsx`, `(checkout)/layout.tsx` and the wishlist page.
      - Shows a skeleton while the session loads.
      - Guests get `router.replace('/login?from=…')` with "Please log in to continue."
    - **`GuestOnly`:** on login and signup.
    - **Redirect safety:** `from` must be an internal path.
  - **Acceptance criteria:**
    - Guests can't see protected content.
    - The Back button after logout doesn't reveal protected pages.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 🤖 A scratch check that `from=https://evil.example` is rejected by the path sanitiser.
    - 👤 Check:
      - as a guest, visit `/account`, `/checkout` and `/wishlist`; each redirects to login, and after logging in you return to the page you asked for;
      - a logged-in user visiting `/login` is redirected;
      - after logout, pressing Back doesn't show protected content.
  - **Verification log:** Claude: ✅ 2026-10-06 — `RequireAuth` (skeleton while loading; guests → `router.replace('/login?from=<path+query>')`; skips while logging out) on `account/layout`, `(checkout)/layout` and the wishlist page; `GuestOnly` on Login/Signup (only redirects customers who *arrived* logged in, so post-login intents can navigate; written with the 'store state during render' pattern after the React hooks lint flagged a ref read). Hardened `isSafeInternalPath` (rejects `//`, `/\`, control characters). Checks: script — unsafe `from` values (absolute URL, `//`, `/\`, `javascript:`, control chars) rejected, internal paths accepted; HTTP — all 7 protected routes serve only the guard skeleton (no page content in server HTML) · Manual: ⏳ guest visits to /account, /checkout, /wishlist redirect and return after login; logged-in /login redirects; Back after logout

- [x] **TASK-030 — Login-required dialog, pending intents and cart merge landing**
  - **Goal:** Guests are guided through login and their action continues afterwards.
  - **Depends on:** TASK-029, TASK-022, TASK-023, TASK-024
  - **Requirements:** req §6.1, §17.5, §18, §19; arch §12.2, §12.3; D12
  - **Implementation notes:**
    - **Store and hooks:** `loginPromptStore`; `useRequireAuth()`; `LoginRequiredDialog` (Login / Cancel) mounted in Providers.
    - **`resumeIntent()`** after login or signup:
      - `wishlist-add` → add, show a toast, return to `from`;
      - `buy-now` → `startBuyNow` → `/checkout`;
      - `checkout` → `/cart` with a notice if `mergedSavedItems`, otherwise `startCartCheckout` → `/checkout`;
      - `navigate` → `from`.
    - **Lifetime:** the intent survives switching between login and signup, and is cleared when leaving the auth pages any other way.
  - **Acceptance criteria:** Each intent type resumes correctly; Cancel changes nothing.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 👤 Fully verified with the real buttons in TASK-044 (wishlist), TASK-045 (Buy Now) and TASK-046 (checkout). Here, trigger the dialog from the header wishlist icon and check that Cancel keeps you on the page and Login then lands on `/wishlist`.
  - **Verification log:** Claude: ✅ 2026-10-06 — `PendingIntent` + `resumeIntent` (wishlist-add, buy-now, checkout with the D12 merge landing, navigate; re-validated through the data layer, errors toast and return to the origin), `loginPromptStore` (open / cancel discards / proceed keeps / take), `useRequireAuth`, `LoginRequiredDialog` (Login, Cancel, Create an account) mounted in Providers, `AuthEffects` (clears the intent when leaving the auth pages; ends the logout flag), `HeaderWishlistLink` (guests get the prompt). Checks: 18 scripted scenarios with fake router/toast over the real data layer — every intent type, out-of-stock Buy Now after login, merge landing, unsafe targets, store lifecycle · Manual: ⏳ header wishlist icon as guest → dialog; Cancel stays; Login → /wishlist

## Stage 4 — Product discovery

- [x] **TASK-031 — Main navigation**
  - **Goal:** Category navigation on desktop and mobile.
  - **Depends on:** TASK-019, TASK-010
  - **Requirements:** req §8.2, §30; arch §17.3, §18
  - **Implementation notes:**
    - **Items:** Home, Fashion, Home Appliances, Beauty, Toys, Mobiles. **No "More"** (D1).
    - **Desktop:** a horizontal `MainNav` with subcategory dropdowns, keyboard accessible.
    - **Mobile:** `MobileMenu` with expandable categories → subcategories, plus account links.
    - **Active state:** the current section is highlighted.
    - **Data:** categories come from `catalog` on the server.
  - **Acceptance criteria:** Every category and subcategory is reachable from the nav on desktop and mobile.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 🤖 `curl` `/` and confirm the HTML contains links to all 5 category paths and all 24 subcategory paths, and no "More" item.
    - 👤 Use the desktop dropdowns with the keyboard; use the mobile menu at 375px.
  - **Verification log:** Claude: ✅ 2026-10-06 — `features/shell/MainNav` (Home + 5 categories, subcategory flyouts on hover/focus-within so every link is a real crawlable anchor, active state via `aria-current`), `features/shell/MobileMenu` (moved from components/layout: expandable categories → subcategories, session-aware account links incl. Logout, fixing the earlier static Login link); header gains `nav`/`mobileMenu` slots; `ShopFrame` loads categories from the server catalog. Checks: server HTML of `/` has links to all 5 categories and 24 subcategories, no 'More', `aria-current` on Home and on `/c/fashion/men` · Manual: ⏳ keyboard through the desktop flyouts; mobile menu at 375px

- [x] **TASK-032 — Product card and product grid (display)**
  - **Goal:** One reusable card for every listing.
  - **Depends on:** TASK-009, TASK-019
  - **Requirements:** req §14; arch §13.5, §3.1
  - **Implementation notes:**
    - **`ProductCard`** (server component): image, name (cleanly truncated), rating + review count, listing price (with "From ₹X" when variant prices differ), original price, % off, and an out-of-stock badge. It links to `/p/<slug>`.
    - **`useInventory()`:** an overlay hook (client) that applies stock adjustments to a card's out-of-stock state.
    - **`ProductGrid`:** responsive columns of 2 / 3 / 4 / 5.
    - **Actions slot:** the card actions are added in TASK-043 and TASK-044.
  - **Acceptance criteria:**
    - Cards are identical wherever they're used.
    - Out-of-stock products are clearly marked.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 👤 Compare the grid at the three widths; an out-of-stock product shows its badge.
  - **Verification log:** Claude: ✅ 2026-10-06 — `ProductCard` (server: image link, brand, 2-line name heading link, rating, price with 'From' for variant price ranges, % off, actions/overlay slots), `CardAvailability` client island + `useInventory` (applies stored stock adjustments; `ProductSummary` gained an `initialStock` map for this), `ProductGrid` (2/3/4–5 columns, one fewer beside the filter sidebar). Checks: Home HTML has 30 cards, each with a product link, rating label, price and optimizer image; 'From' prefix present; an out-of-stock product shows the badge server-side (category check) · Manual: ⏳ grid at 375/768/1280px

- [x] **TASK-033 — Home page**
  - **Goal:** A discovery and promotions homepage.
  - **Depends on:** TASK-031, TASK-032
  - **Requirements:** req §10; arch §13.5
  - **Implementation notes:**
    - **Hero:** headline, supporting text, a "Shop Now" CTA linking to a collection or category, and a visual.
    - **Sections:** Best Sellers, Special Offers and New Arrivals (8–12 cards each) with **View All** links to `/collections/*`.
    - **Not included:** no "Shop by Category" section, and not every product.
  - **Acceptance criteria:** All three sections render server-side with the correct products.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 🤖 `curl` `/` and confirm:
      - the hero and three section headings are present;
      - the product names are in the HTML (server-rendered);
      - there's no "Shop by Category";
      - the product count is far below the full dataset.
    - 👤 Visual review at three widths.
  - **Verification log:** Claude: ✅ 2026-10-06 — `HeroBanner` (headline, supporting text, 'Shop Now' + 'See New Arrivals' CTAs, three new-arrival photos loaded eagerly with high priority; contrast 13–16:1), three `ProductSection`s (10 cards each + View All). Checks: one `<h1>`, three section headings, View All/CTA links to all three collections, 30 server-rendered cards (catalog has 154), no 'Shop by Category', optimized product image 200 · Manual: ⏳ visual review at three widths

- [x] **TASK-034 — Listing params and filter configuration**
  - **Goal:** The URL format and the per-category filter definitions.
  - **Depends on:** TASK-016
  - **Requirements:** req §12.2, §12.3; arch §9.4, §13.2, §13.3
  - **Implementation notes:**
    - **`listingParams.ts`:** `parse(searchParams) → ProductQuery` and `serialise(query) → URLSearchParams`. Unknown params are ignored, and `page` resets when filters change.
    - **`filterConfig.ts`:** the per-context filter lists from arch §13.2.
  - **Acceptance criteria:** Parsing then serialising gives the same canonical URL.
  - **Verification:**
    - 🤖 A scratch script checks round trips for the arch §13.3 example URLs, garbage values being ignored, and the page reset.
  - **Verification log:** Claude: ✅ 2026-10-06 — `listingParams.ts` (parse from URLSearchParams or Next searchParams objects; validated sort/page/rating/discount/price/category; attribute params from `FILTER_SOURCES`; serialise omits path-implied fields, default sort and page 1; readable commas; `withChange` resets page; `clearRefinements`; `hasRefinements`), `filterConfig.ts` (per-category lists from arch §13.2; `crossCategoryFilters`). Checks: 12 tests — both arch example URLs round-trip, garbage/unknown params ignored, open/inverted price ranges, page reset, Clear all, implicit collection sort, config matches §13.2 · Manual: n/a

- [x] **TASK-035 — Category and subcategory pages**
  - **Goal:** Category listings with subcategory navigation, sorting and pagination.
  - **Depends on:** TASK-032, TASK-034
  - **Requirements:** req §11, §12.1, §12.3; arch §13.1
  - **Implementation notes:**
    - **`/c/[category]` and `/c/[category]/[subcategory]`:** breadcrumb, heading, description, product count, `SubcategoryNav` (single select + "All"), `SortSelect`, `ProductGrid` and `Pagination`.
    - **Unknown slugs:** `notFound()`.
    - **Updating:** sort and pagination update the URL inside a transition, with a pending state shown.
  - **Acceptance criteria:**
    - Each of the 5 categories and 24 subcategories works.
    - The count matches the results.
    - All six sorts work.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 🤖 Loop over all 29 paths: each returns 200 and shows the correct heading and count. `/c/unknown` returns 404.
    - 🤖 For `sort=price-asc` and `price-desc`, the prices in the HTML are in order.
    - 👤 Click through the subcategories and sorts, and use pagination with the Back button.
  - **Verification log:** Claude: ✅ 2026-10-06 — shared `ProductListing` (breadcrumb, h1, description, 'Showing x–y of N products', `SubcategoryNav` chips with counts, `SortSelect` updating the URL in a transition, dimmed `ListingResults` while pending, crawlable `Pagination`, empty state), `categoryPage.tsx` (`resolveCategory` 404s unknown slugs before rendering; `findCategory` for metadata). Next 16 findings: streamed metadata kept titles out of `<head>` for dynamic pages, so `htmlLimitedBots: /.*/` now resolves metadata first (catalog reads are ~2 ms); dynamic `notFound()` returns a real 404 but Next renders its body in the browser (a bare root-level test page behaves the same) — accepted, browser check added. Also removed an empty stray root `package-lock.json` (85 bytes, no packages) that confused Next's root detection. Checks: all 29 category/subcategory pages (200, one h1, count, sub-nav); Fashion pages 1/2 counts; unknown slugs → 404 with the Nivora 404 payload; price-asc/desc order in HTML; out-of-stock product badged and last; bogus sort/page handled · Manual: ⏳ click subcategories/sorts; pagination + Back; open `/c/unknown` and confirm the Nivora 404 page shows

- [x] **TASK-036 — Filters UI**
  - **Goal:** Filtering on every listing, on desktop and mobile.
  - **Depends on:** TASK-035
  - **Requirements:** req §12.2, §29, §30; arch §13.2, §17.3
  - **Implementation notes:**
    - **`FilterPanel`** (desktop sidebar) and **`FilterDrawer`** (mobile, with Apply showing the result count). Both render from config and facets.
    - **Filter types:** brand multi-select, price range/bands, minimum rating, minimum discount, In stock only, and category-specific attributes.
    - **`ActiveFilterChips`:** removable chips plus **Clear all**.
    - **Empty result:** "No products found." with **Clear Filters**.
  - **Acceptance criteria:**
    - Each filter narrows the results correctly and is reflected in the URL.
    - Refresh, Back and shared links preserve the state.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 🤖 `curl` filtered URLs (e.g. `/c/mobiles?ram=8GB&brand=…`) and confirm the counts match the scratch-script expectations.
    - 🤖 An impossible filter combination renders "No products found."
    - 👤 Apply and remove filters on desktop, use the drawer at 375px, use Clear all, refresh and Back.
  - **Verification log:** Claude: ✅ 2026-10-06 — `FilterPanel` (config-driven sections: category/subcategory/brand/attribute checkbox lists with counts and 'Show all', price bands + custom range, rating, discount, In stock only; selected values stay visible), `FilterDrawer` (mobile, 'Filters (n)' button, 'Show N products'), `ActiveFilterChips` (plain links, Clear all), `activeFilters.ts`. Checks: five filtered URLs return exactly the data layer's counts (mobiles RAM+brands, fashion size+color, appliances energy+price, skincare skin type, toys age+rating+in stock); each category shows its required sections; chips + Clear all; removing one chip keeps the others; selected checkbox checked; impossible combination → 'No products found.' + Clear Filters; drawer button rendered (one test expectation corrected: Fashion has no 50%+ items) · Manual: ⏳ apply/remove filters, drawer at 375px, Clear all, refresh and Back

- [x] **TASK-037 — Collection pages**
  - **Goal:** "View All" destinations.
  - **Depends on:** TASK-036
  - **Requirements:** req §9.1, §10
  - **Implementation notes:** `/collections/[collection]` uses the standard listing (Category/Subcategory filters, sorting). Unknown collections return 404.
  - **Acceptance criteria:** Best Sellers, Special Offers and New Arrivals each list the correct products.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 🤖 `curl` each collection and compare the product set with the collection definitions (scratch script).
  - **Verification log:** Claude: ✅ 2026-10-06 — `/collections/[collection]` via shared `CrossCategoryListing` (Category, Subcategory + common filters; category-specific filters when results are in one category; each collection's default sort, implicit in the URL); unknown → 404. Checks: best sellers 49, special offers 150, new arrivals 28 — counts and first items match the data layer in default order; filter sections start Category/Subcategory/Brand · Manual: n/a

- [x] **TASK-038 — Search**
  - **Goal:** Header search and a results page.
  - **Depends on:** TASK-036
  - **Requirements:** req §13, §29; arch §13.4
  - **Implementation notes:**
    - **`SearchBar`:** in the header (desktop and the mobile row); ignores empty input.
    - **`/search?q=`:**
      - shows "Results for '…'", the count, filters (Category, Subcategory + common, plus category-specific when the results are within one category), sorting and the grid;
      - no results: "No products found." with Clear Filters + Continue Shopping;
      - `noindex`;
      - an empty `q` redirects to `/`.
  - **Acceptance criteria:** Search matches name, brand, category, subcategory, tags, specs and description, ranked by relevance.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 🤖 `curl` `/search?q=` with a brand, a subcategory name and a nonsense string; check the results, the empty state and the `noindex` meta.
    - 👤 Search from the header on desktop and mobile; combine search with a filter.
  - **Verification log:** Claude: ✅ 2026-10-06 — `SearchBar` (client, keeps the current `q`, ignores empty input; wrapped in Suspense with the no-JS `HeaderSearch` form as fallback; header `search` slot), `/search` (empty `q` → 307 to Home, 'Results for “q”', `noindex, follow`, cross-category filters). Checks: 'samsung' 9, 'refrigerators' 6, 'wireless headphones' 2 (= data layer); search box shows the query; narrowing to Mobiles reveals RAM/Storage; nonsense → 'No products found.' + Continue Shopping (Clear Filters only when filters are active); `/search`, `?q=`, `?q=%20%20` → 307 / · Manual: ⏳ header search on desktop and mobile; search + filter

- [x] **TASK-039 — SEO for discovery pages**
  - **Goal:** The metadata, structured data and crawl files from arch §10.
  - **Depends on:** TASK-033, TASK-035, TASK-037
  - **Requirements:** req §31.1; arch §10
  - **Implementation notes:**
    - **`generateMetadata`:** for Home, category, subcategory and collection pages (title, description, canonical with filters stripped, Open Graph).
    - **JSON-LD:** Organization + WebSite (with SearchAction) on Home; BreadcrumbList + ItemList on listings.
    - **`sitemap.ts`.**
    - **`robots.ts`:** disallows the private paths; disallows everything unless `NEXT_PUBLIC_ALLOW_INDEXING=true`; `noindex` on every page when indexing is off.
  - **Acceptance criteria:** Matches arch §10.
  - **Verification:**
    - 🤖 `curl` checks:
      - the titles, descriptions and canonical URLs (a filtered URL's canonical is the unfiltered path);
      - the `og:*` tags;
      - the JSON-LD parses as valid JSON with the expected `@type`s;
      - `/sitemap.xml` lists all categories, subcategories, collections and products;
      - `/robots.txt` is in "disallow all" mode by default;
      - with the indexing flag set to true, `/robots.txt` shows the private-path rules.
  - **Verification log:** Claude: ✅ 2026-10-06 — `features/seo`: `pageMetadata` (title, description, canonical, Open Graph + Twitter with default image restated because Next merges `openGraph` shallowly), `listingCanonical` (filters stripped, `?page=n` kept), `JsonLd` (escapes `<` per the Next JSON-LD guide), builders for Organization, WebSite+SearchAction, BreadcrumbList, ItemList; Home/category/subcategory/collection metadata; JSON-LD on Home and every listing; `app/sitemap.ts`; `app/robots.ts`; root layout adds `noindex, nofollow` unless `NEXT_PUBLIC_ALLOW_INDEXING=true`. Checks (two builds): indexing off — titles, canonicals (filtered → unfiltered, page 2 → itself), og:url/og:image, JSON-LD types parse, sitemap 193 URLs (1+5+24+3+154+6, no private pages), robots Disallow all, public pages noindex; indexing on — robots private rules + sitemap, public pages indexable, private pages and search still noindex · Manual: n/a

## Stage 5 — Product details

- [x] **TASK-040 — Product Details page (server content)**
  - **Goal:** A complete, server-rendered product page.
  - **Depends on:** TASK-032, TASK-039
  - **Requirements:** req §16.1, §31.1; arch §9.2, §10, §14.1
  - **Implementation notes:**
    - **`/p/[slug]`:** `generateStaticParams` for every product; `notFound()` for unknown slugs.
    - **Content:** breadcrumb, `ImageGallery` (a thumbnail changes the main image; swipe/tap on mobile), name, brand, rating + review count, price, original price, discount, description and `Specifications`.
    - **SEO:** `generateMetadata` (with the product image as the OG image) and Product + BreadcrumbList JSON-LD.
    - **Not included:** no review text (req §16.1).
  - **Acceptance criteria:** Every product page is built at build time and contains all the content.
  - **Verification:**
    - 🤖 The `npm run build` output lists the pre-rendered `/p/*` pages.
    - 🤖 `curl` sample products and confirm the name, price, description, specs, `og:image` and Product JSON-LD (INR offer, rating).
    - 🤖 An unknown slug returns 404.
    - 👤 Use the gallery with mouse, keyboard and touch.
  - **Verification log:** Claude: ✅ 2026-10-06 — `/p/[slug]` with `generateStaticParams` + `dynamicParams = false` (all products pre-built; unknown slugs are a static 404 that is fully rendered, unlike dynamic 404s), breadcrumb, `ImageGallery` (thumbnails, prev/next, arrow keys, swipe, image counter), brand/h1/rating, description, `Specifications`; `pageMetadata` with the first product photo as og:image; Product (INR AggregateOffer, availability, rating, brand, sku) + BreadcrumbList JSON-LD. Checks: build lists 154 pre-rendered `/p/*` pages; S24 Ultra HTML has one h1, title, og:image, From ₹1,29,999, description/specs, gallery controls, 3 variant radio groups, valid Product and Breadcrumb JSON-LD; realme Narzo shows Out of Stock with both purchase buttons disabled and OutOfStock JSON-LD; `/p/does-not-exist` → 404 with full Nivora 404 HTML · Manual: ⏳ gallery with mouse, keyboard and touch

- [x] **TASK-041 — Purchase panel: variants, quantity and stock**
  - **Goal:** The interactive purchase controls.
  - **Depends on:** TASK-040, TASK-022
  - **Requirements:** req §16.2–§16.4, §35; arch §3.1, §14.1, §18
  - **Implementation notes:**
    - **`PurchasePanel`** (client) contains:
      - `VariantSelector` (radio groups; out-of-stock options disabled and announced; a single-value option is preselected; the price updates with the chosen variant);
      - `QuantitySelector` (min 1, max = effective stock − quantity already in the cart for Add to Cart, or full stock for Buy Now; clamped when the variant changes);
      - `StockStatus` (In stock / Only N left / Out of Stock), based on the inventory overlay.
    - **Missing variant:** "Please select a size" (names the missing option).
    - **Mobile:** a sticky action bar.
  - **Acceptance criteria:** Behaviour matches req §16.2–§16.4.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 👤 On a Fashion product, check:
      - an out-of-stock size is disabled;
      - quantity can't go below 1 or above stock;
      - the price updates on a Mobiles storage variant;
      - a fully out-of-stock product disables the purchase actions.
  - **Verification log:** Claude: ✅ 2026-10-06 — pure `features/product/variantSelection.ts` (preselect single values, value availability incl. non-existent combinations, selected variant, missing option, price for partial/full selection, stock, quantity clamp); `VariantSelector` (native radios as chips, disabled + '(unavailable)' for out-of-stock/non-existent values, inline 'Please select a size.' with focus), `QuantitySelector` (−/value/+, live value, disabled at 1 and at stock), `StockStatus` (In stock / Only N left / Out of Stock), `PurchasePanel` (live stock via the inventory overlay, price updates, Add-to-Cart limit counts what's already in the cart, sticky mobile action bar). Checks: 11 logic tests on real products (Oxford shirt White/XXL disabled, Only 2 left, Free Size preselected, OnePlus 8 GB+256 GB unavailable, S24 price ₹1,29,999→₹1,39,999, sold-out product stock 0, live adjustments, clamp); HTTP: options render with no premature error · Manual: ⏳ out-of-stock size disabled; quantity bounds; storage price change; sold-out product disables actions

- [x] **TASK-042 — Add to Cart from Product Details + header cart count**
  - **Goal:** Adding to the cart works and the header updates.
  - **Depends on:** TASK-041
  - **Requirements:** req §17.1, §17.2, §8.1; arch §14.2
  - **Implementation notes:**
    - **`useAddToCart`:**
      - checks on the client first (options, quantity);
      - then calls `api.cart.addItem`;
      - writes the returned `CartView` into the cache;
      - shows a toast "Added to cart" with **View Cart**;
      - stays on the page.
    - **`CartIcon`:** the total quantity, with a placeholder until mount.
  - **Acceptance criteria:**
    - The header count updates immediately and survives refresh.
    - Adding the same variant increments its line; a different variant adds a new line.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 👤 Check:
      - add without a size → message;
      - add with a size → toast and the count goes up;
      - add the same again → count up, still one line;
      - add another colour → new line;
      - refresh → the count persists.
  - **Verification log:** Claude: ✅ 2026-10-06 — `useCart` (per guest/customer key, waits for the session), `useAddToCart` (writes the returned CartView into the cache; toast 'Added to cart' with View Cart; stays on the page), `useUpdateCartLine`/`useRemoveCartLine`, header `CartIcon` (total quantity badge, no count until loaded; `cart` header slot). Data-layer behaviour (same variant increments, different variant new line, stock limits, persistence) verified in TASK-022. Checks: lint, typecheck, build; header cart link in server HTML without a count · Manual: ⏳ add without size → message; add → toast + count; add same → still one line; other colour → new line; refresh keeps the count

- [x] **TASK-043 — Variant picker dialog + card Add to Cart**
  - **Goal:** Add to Cart from any product card.
  - **Depends on:** TASK-042, TASK-008
  - **Requirements:** req §14; arch §11.2, §13.5; D13
  - **Implementation notes:**
    - **`variantPickerStore`.**
    - **`VariantPickerDialog`:** options with per-variant stock, quantity 1, an Add button and a link to the full product page.
    - **`CardActions` (client island) on `ProductCard`:**
      - single-variant products are added directly;
      - products with options open the picker;
      - out of stock → disabled.
  - **Acceptance criteria:** Cards never pick a variant silently.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 👤 Add from a card on Home, a category page and search: a simple product is added directly; a sized product opens the picker. Check the dialog's keyboard behaviour.
  - **Verification log:** Claude: ✅ 2026-10-06 — `variantPickerStore`, `VariantPickerDialog` (loads the product with live stock in the browser, shared VariantSelector, price + stock, quantity 1, 'View full details', modes add-to-cart / move-to-cart) mounted in Providers; `CardActions` (single-variant → direct add; options → picker; sold out → disabled 'Out of Stock'); every `ProductCard` now renders CardActions and a wishlist heart by default (overridable for the Wishlist page). Checks: lint, typecheck, build; Home HTML has Add to Cart buttons and wishlist hearts on all 30 cards · Manual: ⏳ simple product adds directly; sized product opens the picker; dialog keyboard behaviour

- [x] **TASK-044 — Wishlist button (Product Details and cards)**
  - **Goal:** Wishlisting from anywhere, with the guest prompt.
  - **Depends on:** TASK-030, TASK-043
  - **Requirements:** req §14, §18, §6.1
  - **Implementation notes:**
    - **`WishlistButton`:** filled when wishlisted; toggles add/remove; optimistic update with rollback (arch §11.1); a toast.
    - **Guests:** `requireAuth({ type: 'wishlist-add', productId })`.
    - **Header wishlist icon:** guests get the prompt with a `navigate` intent; logged-in users go to `/wishlist`.
  - **Acceptance criteria:** After login, the intended product gets wishlisted and you return to the page you were on.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 👤 Check:
      - as a guest, click the heart on a listing card → dialog → Cancel → nothing changes;
      - again → Login → you're back on the listing and the heart is filled;
      - toggle it off and on;
      - refresh → the state persists.
  - **Verification log:** Claude: ✅ 2026-10-06 — `useWishlist` (customers only), `useToggleWishlist` (optimistic add/remove with rollback, toasts, revalidation), `WishlistButton` (icon on cards, button on Product Details; filled + `aria-pressed` when saved; guests → login prompt with a `wishlist-add` intent back to the current page). Resume-after-login behaviour verified in the Stage 3 intent tests · Manual: ⏳ guest heart → dialog → Cancel / Login → back on the listing with the heart filled; toggle; refresh

- [x] **TASK-045 — Buy Now**
  - **Goal:** A separate path from product to checkout.
  - **Depends on:** TASK-041, TASK-030
  - **Requirements:** req §19, §16.3; arch §14.4
  - **Implementation notes:**
    - **Buy Now:**
      - validates the selection;
      - `requireAuth({ type: 'buy-now', variantId, quantity })`;
      - `api.checkout.startBuyNow`;
      - `/checkout`.
    - The cart is never touched.
    - The checkout page stays a stub until TASK-050; for now, confirm the pending selection is stored.
  - **Acceptance criteria:**
    - The cart count is unchanged after Buy Now.
    - A guest returns to checkout with the same selection after login.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 👤 Check:
      - as a guest, Buy Now → login → you land on `/checkout`;
      - the `checkout_session` key holds the variant and quantity;
      - the cart count is unchanged.
  - **Verification log:** Claude: ✅ 2026-10-06 — Buy Now in `PurchasePanel`: validates options/stock → `requireAuth({ type: 'buy-now', variantId, quantity, returnTo })` → `api.checkout.startBuyNow` → `/checkout`; errors toast. Cart untouched and full-stock limit verified in TASK-024; guest resume verified in the Stage 3 intent tests · Manual: ⏳ guest Buy Now → login → /checkout; `checkout_session` holds the variant and quantity; cart count unchanged

## Stage 6 — Cart

> The cart data model, persistence, guest/user carts, merge and price calculations are implemented in the data layer (TASK-017, TASK-021, TASK-022). This stage builds the Cart UI on top of them.

- [x] **TASK-046 — Cart page**
  - **Goal:** A full cart experience.
  - **Depends on:** TASK-042, TASK-030
  - **Requirements:** req §17.3, §17.4, §29, §30
  - **Implementation notes:**
    - **`CartLineItem`:** image, name (links to the product), variant labels, unit price, quantity controls (1 to stock), item total, Remove.
    - **`PriceSummary`:** subtotal (MRP), discounts (as savings), delivery estimate and total, all from `CartView`.
    - **Actions:** Continue Shopping; **Proceed to Checkout** using `requireAuth({ type: 'checkout' })`, then `startCartCheckout` → `/checkout`.
    - **Empty cart:** "Your cart is empty." with Continue Shopping.
    - **Mobile:** single column with a sticky checkout bar.
  - **Acceptance criteria:** Quantities, removal and totals are correct and persist across refresh.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 🤖 `curl` `/cart` and confirm the `noindex` meta.
    - 👤 Check:
      - increase and decrease (the min and max controls disable);
      - remove;
      - the totals match a hand calculation (including the ₹499 free-delivery threshold);
      - the empty state;
      - a guest using Proceed to Checkout sees the login prompt.
  - **Verification log:** Claude: ✅ 2026-10-06 — `CartView` (loading skeleton, error state with retry, empty 'Your cart is empty.' + Continue Shopping, line list, Continue Shopping link, sticky mobile checkout bar), `CartLineItem` (image, name link, options, unit price + MRP, quantity stepper capped at stock, line total, Remove with labelled button), `PriceSummary` (price (n items) MRP, discount, delivery with the free-delivery hint, total, 'You save'), Proceed to Checkout via `requireAuth({ type: 'checkout' })` → `startCartCheckout` → `/checkout`. Totals come only from the data layer (maths verified in TASK-016/022). Checks: lint, typecheck, build; `/cart` → 200, `noindex, nofollow`, loading skeleton in server HTML · Manual: ⏳ +/− and bounds, remove, totals incl. the ₹499 threshold, empty state, guest Proceed → login prompt

- [x] **TASK-047 — Cart revalidation, issues and merge notice**
  - **Goal:** The cart stays valid as stock changes, and the merge is communicated.
  - **Depends on:** TASK-046
  - **Requirements:** req §17.4, §17.5; D12
  - **Implementation notes:**
    - **Issues:** shown per line (out of stock, exceeds stock, removed product notice). Proceed to Checkout is disabled while any issue exists.
    - **Merge notice:** shown on `/cart` when the login merge brought in saved items ("We've added items saved from your last visit").
  - **Acceptance criteria:** Invalid carts can't proceed, and the merge flow matches D12.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 👤 Check:
      - as a logged-in user, add an item, log out, add another as a guest, then Proceed to Checkout → login → you land on `/cart` with the notice and both items;
      - edit `nivora:v1:inventory` in DevTools so that a cart item becomes out of stock → its line is flagged and checkout is disabled.
  - **Verification log:** Claude: ✅ 2026-10-06 — per-line issue messages (out of stock / only N left / unavailable), a page-level 'needs your attention' alert and Proceed to Checkout disabled while issues exist; removed-product notice; the D12 merge notice is now a banner on `/cart?merged=1` (resumeIntent navigates there instead of showing a toast, so the notice survives a refresh). Revalidation itself is in the data layer (TASK-022 tests: removed once, out-of-stock flag and recovery). Checks: Stage 3 intent test updated and passing (`/cart?merged=1`); `/cart?merged=1` renders; full regression of every Node and HTTP suite passes · Manual: ⏳ merge flow lands on /cart with the banner; edit inventory in DevTools → line flagged, checkout disabled

## Stage 7 — Wishlist

> Wishlist persistence, duplicate prevention and guest protection are in the data layer (TASK-023) and the button (TASK-044).

- [x] **TASK-048 — Wishlist page and Move to Cart**
  - **Goal:** View and manage the wishlist.
  - **Depends on:** TASK-044, TASK-043
  - **Requirements:** req §18, §29
  - **Implementation notes:**
    - **`/wishlist`** (protected): `ProductGrid` of cards in wishlist mode, with **Move to Cart** and **Remove**.
    - **Move to Cart:** opens the variant picker (mode `move-to-cart`) for products with options, otherwise moves directly. Disabled when out of stock.
    - **Other:** Continue Shopping; empty state "Your wishlist is empty." with Explore Products; `noindex`.
  - **Acceptance criteria:** A moved item ends up in the cart and is removed from the wishlist.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 👤 Check:
      - move a simple product and a sized product;
      - remove an item;
      - an out-of-stock item can't be moved;
      - the empty state;
      - refresh keeps the state.
  - **Verification log:** Claude: ✅ 2026-10-06 — `WishlistView` (protected; loading/error states; empty 'Your wishlist is empty.' + Explore Products; heading with count; Continue Shopping) rendering the shared `ProductCard` with wishlist actions: Move to Cart (single variant → direct via `useMoveToCart`; options → variant picker in move-to-cart mode; sold out → disabled) and a Remove button. Data rules (no duplicates, move adds 1 and removes, sold-out can't move) verified in TASK-023. Checks: build (ProductCard works inside the client view); `/wishlist` → guard skeleton only, noindex · Manual: ⏳ move a simple and a sized product; remove; out-of-stock item can't move; empty state; refresh

## Stage 8 — Checkout and addresses

- [x] **TASK-049 — Address management components**
  - **Goal:** Add, edit, delete and set a default address, reusable in checkout and the account area.
  - **Depends on:** TASK-023, TASK-008
  - **Requirements:** req §21, §28
  - **Implementation notes:**
    - **`AddressForm`:** React Hook Form + `addressSchema`, with a state select from `indianStates` and country fixed to India. Opens in a Dialog.
    - **`AddressCard` and `AddressList`:** select, edit, delete (with confirmation), set default.
    - **Empty state:** "You haven't saved any addresses yet." with Add Address.
  - **Acceptance criteria:** Every field validates per req §21, and the default address works.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 👤 Check:
      - add an address with an invalid PIN, phone or missing field (each error shows);
      - add a valid address;
      - edit it;
      - set a default;
      - delete it.
  - **Verification log:** Claude: ✅ 2026-10-06 — `useAddresses`/`useSaveAddress`/`useDeleteAddress`/`useSetDefaultAddress`; `AddressForm` (React Hook Form + shared `addressSchema`, state select of 36 states/UTs, country fixed to India, data-layer field errors mapped back, hints for phone/PIN); `AddressCard`/`AddressText`; `AddressManager` (manage and select modes, add/edit dialog, delete confirmation 'Past orders keep their own copy', Set as default, inline add form at checkout when none exist, empty state 'You haven't saved any addresses yet.' + Add Address). Validation messages and default rules verified in TASK-017/023. Checks: lint, typecheck, build · Manual: ⏳ invalid PIN/phone/missing field messages; add, edit, set default, delete

- [x] **TASK-050 — Checkout page**
  - **Goal:** A connected checkout for both the cart and Buy Now.
  - **Depends on:** TASK-049, TASK-045, TASK-046
  - **Requirements:** req §20, §22, §23; arch §14.5
  - **Implementation notes:**
    - **`CheckoutView`:** source-aware (cart or Buy Now; falls back to the cart).
    - **Sections:**
      1. **Address**: the default is preselected; if there are no addresses, the add form is shown.
      2. **Delivery**: Standard (preselected) / Express, with estimated date ranges.
      3. **Order Summary**: totals re-requested when the delivery option changes.
      4. **Payment Method: Cash on Delivery**: static, no inputs, no other options.
      5. **Place Order**: wired in TASK-051.
    - **Blocked states:**
      - an empty cart shows a message and a link back to shopping;
      - issues or a missing address disable Place Order and show an inline reason.
    - **Other:** `noindex`.
  - **Acceptance criteria:**
    - Only Cash on Delivery is visible.
    - The totals change with the delivery option.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 🤖 `grep` the source for the words card, UPI, wallet and net banking, to confirm no payment options were added.
    - 👤 Check:
      - cart checkout and Buy Now checkout each show the correct items;
      - switching to Express changes the total by the right amount;
      - with no address, Place Order is disabled with a message.
  - **Verification log:** Claude: ✅ 2026-10-06 — `CheckoutView` (4 numbered steps: Delivery Address with the default preselected, Delivery Options with each option's real charge and an estimated date range, Order Summary labelled Cart/Buy Now with read-only lines and stock issues, Payment Method = Cash on Delivery with no inputs; `PriceSummary` re-requested per delivery option; empty-cart state; blocked reasons for a missing address or stock issues; sticky mobile Place Order bar); `useCheckout` (keeps the previous data while switching options); `deliveryWindow` helper. Checks: `/checkout` → guard skeleton only, noindex; whole-word scan finds no UPI/wallet/net banking/credit/debit/CVV anywhere in the source; delivery window tests (standard 4–6 days, express 1–2, crossing the year) · Manual: ⏳ cart vs Buy Now items; Express changes the total by the right amount; no address → disabled with message

## Stage 9 — Orders

> Order creation, ID generation, snapshots, stock reduction and restoration are in the data layer (TASK-024). This stage wires the UI.

- [x] **TASK-051 — Place order flow**
  - **Goal:** Placing an order safely.
  - **Depends on:** TASK-050
  - **Requirements:** req §24.1, §24.3, §24.4; arch §14.6
  - **Implementation notes:**
    - **`usePlaceOrder`:**
      - the button is disabled while pending;
      - on success, invalidate cart, checkout, orders and inventory, then `router.replace` to the confirmation page;
      - on failure, show the customer message (e.g. `INSUFFICIENT_STOCK`) inline.
  - **Acceptance criteria:**
    - No duplicate orders on double-click.
    - Stock goes down.
    - Cart checkout clears only the purchased lines; Buy Now leaves the cart alone.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 👤 Check:
      - place a cart order → the cart count drops to zero for those items;
      - place a Buy Now order → the cart is unchanged;
      - double-click Place Order → exactly one order;
      - the product page shows the reduced stock.
  - **Verification log:** Claude: ✅ 2026-10-06 — `usePlaceOrder` (button disabled + 'Placing your order…' while pending and after success, so double clicks can't submit twice; on success `router.replace` to the confirmation, seeds the order cache, refreshes cart/orders/stock, clears checkout data; failures shown inline with customer wording). Data-layer behaviour (stock reduction, purchased lines removed, Buy Now leaves the cart, INSUFFICIENT_STOCK at place time with no order) verified in TASK-024 · Manual: ⏳ cart order clears those lines; Buy Now order leaves the cart; double-click → one order; product page shows reduced stock

- [x] **TASK-052 — Order confirmation page**
  - **Goal:** A clear confirmation after placing an order.
  - **Depends on:** TASK-051
  - **Requirements:** req §24.3, §2
  - **Implementation notes:**
    - **`/order-confirmation/[orderId]`:**
      - shows "Thank you for shopping with Nivora", the order ID, item summary, total, address, estimated delivery and "Payment: Cash on Delivery";
      - has **View Order Details** and **Continue Shopping**.
    - It only reads the order.
    - Another user's order shows "not found".
  - **Acceptance criteria:** Refreshing the page shows the same order and creates nothing new.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 👤 Refresh the confirmation page → still one order in the history. Visiting another user's order ID shows "not found".
  - **Verification log:** Claude: ✅ 2026-10-06 — `OrderConfirmationView` (read-only: 'Thank you for shopping with Nivora!', order ID, estimated delivery from the order date, 'Payment: Cash on Delivery', items, address, payment summary, View Order Details + Continue Shopping; NOT_FOUND → 'We couldn't find that order.'). Ownership verified in TASK-024. Checks: `/order-confirmation/<id>` → guard skeleton only, noindex · Manual: ⏳ refresh → still one order; another user's order id → not found

- [x] **TASK-053 — Orders list and Order Details**
  - **Goal:** Order history.
  - **Depends on:** TASK-052
  - **Requirements:** req §25.1, §25.3, §25.4, §25.5, §29
  - **Implementation notes:**
    - **`/account/orders`:** newest first; ID, date, product summary ("and N more"), total, Cash on Delivery and a status badge.
    - **Empty state:** "You haven't placed any orders yet." with Start Shopping.
    - **`/account/orders/[orderId]`:**
      - every item detail (variants, quantities, prices, discounts), delivery option and charge, total, address and payment method;
      - a `StatusTimeline` from `statusHistory`;
      - "Order not found" for unknown or other users' orders.
  - **Acceptance criteria:**
    - Joseph's seeded orders show every status.
    - A new user sees the empty state.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 👤 Log in as Joseph → 3–4 sample orders plus any you placed; open each one; a new signup sees the empty state.
  - **Verification log:** Claude: ✅ 2026-10-06 — `OrdersView` (newest first; ID, status badge, first item + 'and N more', date, Cash on Delivery, total; empty 'You haven't placed any orders yet.' + Start Shopping), `OrderDetailsView` (status timeline from the history incl. Cancelled, snapshotted items with options/quantities/prices/savings, delivery address, totals with delivery option and payment method, 'We couldn't find that order.' for other users), `OrderStatusBadge`, `StatusTimeline`, `OrderItems`, `OrderTotals`. Checks: both routes → guard skeleton only, no customer data in server HTML (only static headings in the hydration payload) · Manual: ⏳ Joseph's 4 sample orders + new ones; each opens; new signup sees the empty state

- [x] **TASK-054 — Order cancellation**
  - **Goal:** Cancelling eligible orders.
  - **Depends on:** TASK-053
  - **Requirements:** req §25.2, §24.4, §25.5
  - **Implementation notes:**
    - **Cancel Order:** shown only for Placed and Confirmed orders.
    - **`CancelOrderDialog`:** a confirmation step.
    - **On success:** the status becomes Cancelled, the timeline updates, a toast shows, and the inventory query is invalidated.
  - **Acceptance criteria:**
    - Cancelling a placed order restores stock.
    - Cancelling a sample order doesn't change stock.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 👤 Check:
      - place an order (stock N−q), cancel it → stock is back to N;
      - Shipped and Delivered orders have no Cancel button.
  - **Verification log:** Claude: ✅ 2026-10-06 — `CancelOrderButton` + confirmation dialog (Keep Order / Cancel Order), shown only when `canCancel` (Placed/Confirmed); `useCancelOrder` updates the order and timeline, refreshes orders and stock, toasts. Stock restore (and no restore for sample orders) verified in TASK-024; `canCancel` re-checked · Manual: ⏳ place → stock N−q → cancel → N; Shipped/Delivered have no Cancel button

## Stage 10 — Account

- [x] **TASK-055 — Account area: layout, profile and addresses**
  - **Goal:** The authenticated account hub.
  - **Depends on:** TASK-049, TASK-053, TASK-028
  - **Requirements:** req §26, §27, §21
  - **Implementation notes:**
    - **`account/layout.tsx`:** side navigation (mobile: tabs or a menu) with Profile, Orders, Wishlist, Addresses and Logout.
    - **Profile page:** `ProfileForm` (name required; phone optional and validated; email read-only). Saving updates the header greeting.
    - **Addresses page:** `AddressList` with full management.
    - **Other:** `noindex`.
  - **Acceptance criteria:** Every account section is reachable and protected, and profile edits persist.
  - **Verification:**
    - 🤖 Run the standard checks.
    - 👤 Check:
      - edit the name → the header greeting updates and survives refresh;
      - an invalid phone is rejected;
      - the email can't be edited;
      - every nav link works;
      - Logout works from the account nav.
  - **Verification log:** Claude: ✅ 2026-10-06 — `account/layout` (RequireAuth + `AccountNav`: Profile, Orders, Wishlist, Addresses, Logout; side nav on desktop, scrollable tabs on mobile, `aria-current`), `ProfileForm` (name required, email read-only with explanation, optional validated phone; saving updates the session so the header greeting changes), Addresses page with the full `AddressManager`. All placeholder stubs are now replaced (`PageStub` removed). Checks: all account routes → guard skeleton only, noindex · Manual: ⏳ edit name → greeting updates and survives refresh; invalid phone rejected; email not editable; every nav link; Logout

## Stage 11 — Static pages and navigation completion

- [x] **TASK-056 — Info pages and not-found completion**
  - **Goal:** Finish the footer destinations and the not-found states.
  - **Depends on:** TASK-011, TASK-039
  - **Requirements:** req §8.3, §8.4; arch §9.2, §10
  - **Implementation notes:**
    - **Info pages:** About Nivora, Contact, Help, Returns (policy text only, no returns functionality), Privacy and Terms, with content from `data/infoPages.ts`, metadata, and inclusion in the sitemap.
    - **Not-found states:** check the 404 for an unknown product, category and collection, and the "not found" for orders.
  - **Acceptance criteria:**
    - All six footer links work.
    - Every "not found" case gives a branded page with a way back.
  - **Verification:**
    - 🤖 `curl` all six info pages for 200, a title and an `<h1>`.
    - 🤖 Unknown product, category and collection paths each return 404.
  - **Verification log:** Claude: ✅ 2026-10-06 — `(info)/[page]` renders content from `content.getInfoPage` (breadcrumb, h1, summary, sections, links to the other info pages) with `pageMetadata` (canonical, Open Graph); six pages pre-built, others a static 404. Checks: all six → 200, one h1, sections, canonical; Help explains COD-only and delivery charges; Returns is policy text only; `/p/does-not-exist` and `/xyz` → 404 with full HTML; `/c/unknown`, `/collections/unknown` → 404 (body rendered in the browser, as documented in TASK-035); sitemap still 193 · Manual: n/a

## Stage 12 — Integration and validation

> End-to-end checks of the flows in req §32 and the completion criteria in req §34. Claude prepares an exact click-path checklist for each flow and runs every check that can be done with HTTP or a script. Joseph runs the browser paths. Bugs found here are fixed (and noted in the log) before the task is marked `[x]`.

- [x] **TASK-057 — Discovery flows**
  - **Goal:** Browsing works end to end.
  - **Depends on:** Stages 4–5
  - **Requirements:** req §32 (Guest shopping, Search), §34
  - **Covers:** guest browsing; Home → Category → Subcategory → Product; Search → Filter → Product; product variant selection.
  - **Verification:**
    - 🤖 HTTP crawl from `/`: follow the nav and card links to a product; check there are no broken internal links (all 200s).
    - 👤 Walk both flows on desktop and mobile with fresh storage (not logged in).
  - **Verification log:** Claude: ✅ 2026-10-06 — HTTP crawl from `/` following every internal link: 209 URLs, all 200, **no broken links**; all 154 products, 5 categories, 24 subcategories, 3 collections and 6 info pages reachable by links alone. Scripted paths: Home → /c/fashion → /c/fashion/men → product (Add to Cart + Buy Now present); Search 'phone' → Mobiles + Samsung → S24 Ultra; variant selectors present. Click-path checklist written: `docs/manual-testing.md` §A · Manual: ⏳ `docs/manual-testing.md` §A on desktop and mobile

- [x] **TASK-058 — Cart, wishlist and authentication flows**
  - **Goal:** The guest-to-customer journey works.
  - **Depends on:** Stages 3, 5–7
  - **Requirements:** req §32 (Wishlist, Signup/Login/Logout), §34
  - **Covers:** guest Add to Cart; guest cart persistence; guest wishlist → login; signup; login/logout; session after refresh; guest cart merge; Wishlist → Move to Cart.
  - **Verification:**
    - 🤖 Re-run the scratch-script suites from TASK-020 to TASK-023 against the final code.
    - 👤 Walk each path on the checklist.
  - **Verification log:** Claude: ✅ 2026-10-06 — scripted journeys through the real data layer + intent logic (`e2e-journeys`): guest add to cart (merge same variant, separate variants), cart survives refresh, quantity/removal, guest wishlist → login → wishlisted and back on the listing, guest cart merged, session survives refresh, wishlist → move to cart, wishlist persists across logout/login, logout → guest with empty cart, 5 protected features reject guests, signup keeps the guest cart, new account logs back in; TASK-020–023 suites re-run and passing · Manual: ⏳ `docs/manual-testing.md` §B

- [x] **TASK-059 — Purchase and order flows**
  - **Goal:** Buying works end to end.
  - **Depends on:** Stages 8–9
  - **Requirements:** req §32 (Buy Now, Cart checkout, Orders), §34
  - **Covers:** Buy Now; cart checkout; address management; Cash on Delivery; order placement; confirmation; order history; Order Details; cancellation; stock reduction and restoration.
  - **Verification:**
    - 🤖 Re-run the TASK-024 script suite.
    - 👤 Walk both purchase flows to Order Details; cancel; check the stock before, after placing and after cancelling.
  - **Verification log:** Claude: ✅ 2026-10-06 — scripted journeys: guest Buy Now → login → checkout with only that item (Express ₹99), no-address block, address add/edit/default, COD order to the chosen address, Buy Now leaves the cart, stock −1, confirmation/details read the order; cart checkout totals match and clear purchased items; history newest first, all COD; cancel restores stock; Delivered sample can't be cancelled; profile edit; details protected after logout (32 checks, one test assertion corrected); TASK-024 suite re-run and passing · Manual: ⏳ `docs/manual-testing.md` §C

- [x] **TASK-060 — Protected routes and responsive behaviour**
  - **Goal:** Access rules and layouts hold everywhere.
  - **Depends on:** TASK-057 – 059
  - **Requirements:** req §6, §30, §34
  - **Covers:** every protected page and action as a guest; logout + Back; desktop, tablet and mobile on every page in req §8.5.
  - **Verification:**
    - 🤖 `curl` every protected route and confirm the server HTML contains no customer data (only the guard skeleton).
    - 👤 Go through the protected-route checklist; check every page at ~375px, ~768px and ~1280px for no horizontal scrolling and usable controls.
  - **Verification log:** Claude: ✅ 2026-10-06 — all 7 protected routes: guard skeleton only, no customer data in the visible server HTML (checked with scripts stripped), `noindex, nofollow`; static scan for fixed widths that could overflow 320px: only `w-96` (paired with `max-w-full`) and the desktop-only nav flyout · Manual: ⏳ `docs/manual-testing.md` §D (redirects, Back after logout, three widths)

## Stage 13 — Final quality pass

- [x] **TASK-061 — Accessibility review**
  - **Goal:** Meet the accessibility bar in req §31 and arch §18.
  - **Depends on:** Stage 12
  - **Verification:**
    - 🤖 `grep` audits:
      - inputs have labels;
      - IconButtons have `aria-label`s;
      - images have `alt` text;
      - there is one `<h1>` per page (via `curl` of each public page).
    - 👤 A keyboard-only walkthrough of a full purchase.
    - 👤 Optional: a Lighthouse accessibility audit in Chrome DevTools (built into the browser, nothing to install).
  - **Verification log:** Claude: ✅ 2026-10-06 — HTML audit script over 12 key pages (Home, category, filtered subcategory, collection, search, 2 products, info, login, signup, cart, 404): `lang`, skip link, header/nav/main/footer landmarks, exactly one h1, no skipped heading levels, every img has alt, every link/button has an accessible name, every input labelled. Fix made: Login, Signup and Cart had no h1 in their server HTML (content loads in the browser) → visually hidden h1 added to their loading states; all 12 pages now pass. Source scan: the only mouse-only handler is the dialog backdrop (hidden from assistive tech; Escape and Close cover keyboard users). IconButton labels are enforced by TypeScript · Manual: ⏳ `docs/manual-testing.md` §E keyboard-only purchase; optional Lighthouse

- [x] **TASK-062 — States and form validation review**
  - **Goal:** Loading, error, empty, disabled and out-of-stock states, and every validation message, are present and consistent.
  - **Depends on:** Stage 12
  - **Requirements:** req §28, §29, §35
  - **Verification:**
    - 🤖 Cross-check every row of req §28 and §29.1 against the code paths that produce it.
    - 👤 Set `NEXT_PUBLIC_MOCK_LATENCY_MS=1500` and check that loading states appear; trigger each validation message once.
  - **Verification log:** Claude: ✅ 2026-10-06 — cross-check script: all 5 req §29.1 empty states with their actions; all 15 req §28 messages present in `lib/errorMessages.ts` / `domain/validation.ts` (exact wording verified in TASK-018); loading skeleton + error handling in all 8 data-driven views (cart, wishlist, checkout, orders, order details, confirmation, addresses, variant picker); disabled/out-of-stock states (sold-out purchase buttons, unavailable variants, Place Order and Proceed to Checkout blocked with reasons) · Manual: ⏳ `docs/manual-testing.md` §E slow-loading check; trigger each validation message

- [x] **TASK-063 — Navigation, SEO and performance review**
  - **Goal:** Every page is reachable, SEO matches arch §10, and the app performs well.
  - **Depends on:** Stage 12
  - **Verification:**
    - 🤖 Check the page list in req §8.5 against the reachable links.
    - 🤖 Re-run the TASK-039 SEO checks across all public page types.
    - 🤖 Review the `npm run build` route table (static vs. dynamic as in arch §9.2, and the first-load JS sizes).
    - 👤 Optional: a Lighthouse performance and SEO audit.
  - **Verification log:** Claude: ✅ 2026-10-06 — every req §8.5 page is linked from the UI (path builders used across features); build route table matches arch §9.2 (Home static; categories/collections/search dynamic; 154 products + 6 info pages pre-built; account/auth/cart/checkout shells load data in the browser); SEO suite re-run (indexing off) passes. Performance: initial JS ≈ 300 KB gzip per page (≈150 KB React/Next framework, 104 KB app chunk incl. Zod, TanStack Query and the browser mock data layer); the 172 KB product catalog is a separate lazily loaded chunk, not in any initial bundle (arch §19). Recorded as a Phase 2 opportunity: HTTP adapters replace the mock layer, and Zod's lighter build is an option · Manual: ⏳ optional Lighthouse

- [x] **TASK-064 — Code quality and boundaries**
  - **Goal:** Clean code that follows the architecture.
  - **Depends on:** Stage 12
  - **Implementation notes:** remove the `/dev/ui` page; remove dead code and duplication; check naming and file placement against arch §5 and §20.
  - **Verification:**
    - 🤖 `grep` shows `localStorage`/`sessionStorage` only in `storage.ts`.
    - 🤖 No `@/api/*/mock` or `@/data` imports outside `src/api`.
    - 🤖 No `src/pages` folder.
    - 🤖 No `any` in `domain/` or `api/`.
    - 🤖 Lint has zero warnings.
  - **Verification log:** Claude: ✅ 2026-10-06 — removed `/dev/ui`; unused-export scan → removed `VisuallyHidden`, `useMediaQuery`, `SortIcon`, `isProductInStock`, `IndianState`; duplication removed: `variantSelection.available` now uses domain `effectiveStock`, PurchasePanel uses domain `maxAddable` (architecture doc file lists updated). Checks: lint **0 errors / 0 warnings**, typecheck, format; browser storage only in `storage.ts`; no `@/api/*/mock` or `@/data` imports outside `src/api`; no deep relative imports; no `src/pages`; no `any` in `src/domain`/`src/api`; no `'use client'` file imports server-only modules; regression (domain, cart, checkout, variants, journeys, categories, product, a11y, crawl) all pass · Manual: n/a

- [x] **TASK-065 — Scope check and Phase 1 sign-off**
  - **Goal:** Confirm that Phase 1 is complete and hasn't grown beyond the agreed scope.
  - **Depends on:** TASK-061 – 064
  - **Requirements:** req §34, §35
  - **Verification:**
    - 🤖 Check every exclusion in req §35: no backend code, no online payment options, no admin or seller UI, no extra categories, and dependencies matching arch §2.
    - 🤖 Mark every req §34 criterion, each with a link to the task that verified it.
    - 👤 Joseph's final sign-off.
  - **Verification log:** Claude: ✅ 2026-10-06 — every req §35 exclusion checked against the repo: no backend code (backend/ = README), no fetch/XHR/API URLs/Route Handlers, no database or auth-provider packages, no online payment terms in app code (catalog product names like 'Wallet Flip Cover' excluded), single Cash on Delivery constant, no OTP/email/SMS, no admin/seller UI, no shipping integration, no reviews/coupons, no returns feature; taxonomy exactly 5/24; dependencies exactly the agreed stack; npm only; dev preview removed. All 40 req §34 criteria mapped to verifying tasks (table below) · Manual: ⏳ Joseph's final sign-off after `docs/manual-testing.md`

---

## Phase 1 completion criteria → verification map

Requirements §34, with the tasks whose checks cover each criterion. 🤖 = verified by Claude (scripts/HTTP); 👤 = browser check in `docs/manual-testing.md`.

| # | Criterion | Verified by | Status |
|---|---|---|---|
| 1 | Guest can open Nivora (not logged in by default) | TASK-020, 025, 058 | 🤖 ✅ · 👤 §A |
| 2 | Home page works | TASK-033, 057 | 🤖 ✅ · 👤 §A |
| 3 | Main categories work | TASK-031, 035, 057 | 🤖 ✅ · 👤 §A |
| 4 | Fixed subcategories work | TASK-013, 035, 057 | 🤖 ✅ · 👤 §A |
| 5 | Search works | TASK-016, 038 | 🤖 ✅ · 👤 §A |
| 6 | Filters work (common and category-specific) | TASK-016, 034, 036 | 🤖 ✅ · 👤 §A |
| 7 | Sorting works | TASK-016, 035 | 🤖 ✅ · 👤 §A |
| 8 | Product Details works | TASK-040 | 🤖 ✅ · 👤 §B |
| 9 | Product variants work | TASK-041 | 🤖 ✅ · 👤 §B |
| 10 | Add to Cart works | TASK-022, 042, 043, 058 | 🤖 ✅ · 👤 §B |
| 11 | Cart survives refresh | TASK-022, 058 | 🤖 ✅ · 👤 §B |
| 12 | Cart quantity works | TASK-022, 046, 058 | 🤖 ✅ · 👤 §B |
| 13 | Cart removal works | TASK-022, 046, 058 | 🤖 ✅ · 👤 §B |
| 14 | Guest wishlist requires login | TASK-023, 030, 044, 058 | 🤖 ✅ · 👤 §B |
| 15 | Signup works | TASK-021, 027, 058 | 🤖 ✅ · 👤 §B |
| 16 | Login works | TASK-021, 026, 058 | 🤖 ✅ · 👤 §B |
| 17 | Login session survives refresh | TASK-020, 058 | 🤖 ✅ · 👤 §B |
| 18 | Wishlist works | TASK-023, 044, 048 | 🤖 ✅ · 👤 §B |
| 19 | Wishlist persists | TASK-023, 058 | 🤖 ✅ · 👤 §B |
| 20 | Wishlist to Cart works | TASK-023, 048, 058 | 🤖 ✅ · 👤 §B |
| 21 | Buy Now works | TASK-024, 045, 059 | 🤖 ✅ · 👤 §C |
| 22 | Checkout works | TASK-024, 050, 059 | 🤖 ✅ · 👤 §C |
| 23 | Address management works | TASK-023, 049, 059 | 🤖 ✅ · 👤 §C |
| 24 | Delivery selection works | TASK-016, 050, 059 | 🤖 ✅ · 👤 §C |
| 25 | Order summary works | TASK-050, 059 | 🤖 ✅ · 👤 §C |
| 26 | Only Cash on Delivery is available | TASK-050, 065 | 🤖 ✅ · 👤 §C |
| 27 | Place Order works | TASK-024, 051, 059 | 🤖 ✅ · 👤 §C |
| 28 | Order confirmation works | TASK-052, 059 | 🤖 ✅ · 👤 §C |
| 29 | Order history works | TASK-024, 053, 059 | 🤖 ✅ · 👤 §C |
| 30 | Order Details works | TASK-053, 059 | 🤖 ✅ · 👤 §C |
| 31 | Orders display Cash on Delivery | TASK-024, 053, 059 | 🤖 ✅ · 👤 §C |
| 32 | Logout works | TASK-021, 028, 058 | 🤖 ✅ · 👤 §B |
| 33 | Protected features require authentication | TASK-029, 058, 060 | 🤖 ✅ · 👤 §D |
| 34 | Order cancellation works and restores stock | TASK-024, 054, 059 | 🤖 ✅ · 👤 §C |
| 35 | Placing an order reduces stock; out-of-stock states show correctly | TASK-024, 032, 041, 059 | 🤖 ✅ · 👤 §C |
| 36 | Buy Now does not change the cart | TASK-024, 059 | 🤖 ✅ · 👤 §C |
| 37 | Validation, error and empty states behave as specified | TASK-017, 018, 062 | 🤖 ✅ · 👤 §E |
| 38 | Responsive on desktop, tablet and mobile | TASK-010, 060 | 🤖 (static scan) · 👤 §D |
| 39 | No raw localStorage access in UI components | TASK-004, 020, 064 | 🤖 ✅ |
| 40 | Public pages are server-rendered with titles, descriptions, canonical URLs and product structured data | TASK-039, 040, 063 | 🤖 ✅ |

**Sign-off:** Phase 1 is complete from Claude's side. Final sign-off is Joseph's, after the browser checks in `docs/manual-testing.md`.
