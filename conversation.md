# Nivora — Conversation Log

A running record of the working sessions that shape Nivora: what was asked, what was decided, and what was produced. The newest entries go at the bottom.

For the full requirements, see [`requirements.md`](requirements.md), which is the source of truth. This log records how and why decisions were made.

---

## Session 1 — 2026-10-06: Project setup and Phase 1 requirements

### Request

Joseph described Nivora, a modern consumer e-commerce website planned as a long-term, full-stack project in a single repository, and gave the complete Phase 1 product requirements. For this step he asked for:

- The repository structure: `frontend/`, `backend/` (placeholder), `docs/`, `requirements.md`, `README.md` and `.gitignore`.
- A `requirements.md` capturing everything discussed, reviewed for contradictions and missing pieces.
- **No coding yet**: no application code, no backend, no choice of backend technology or database, no `architecture.md`, and no new technologies without discussion.
- Questions on any genuine ambiguity, then wait for the go-ahead before the architecture stage.

### What Joseph specified (summary)

- **Phases:** Phase 1 is frontend-only, with mock data, mock authentication and localStorage. Phase 2 replaces the mock/localStorage layer with a real backend and database without rewriting the UI.
- **Data layer:** no raw localStorage calls in React components. Persistence is separated from the UI and business logic.
- **Branding:** use "Nivora" consistently. Nivora has its own visual identity: usability patterns may be inspired by Amazon or Flipkart, but their branding, layouts and colours must not be copied.
- **Fixed taxonomy:** 5 categories with 24 subcategories (Fashion, Home Appliances, Beauty, Toys, Mobiles). No additions. Collections such as Under ₹999, On Sale, Best Rated and New Arrivals are filters, not categories.
- **Home page:** hero, Best Sellers, Special Offers, New Arrivals and a footer. There is no "Shop by Category" section, and the Home page does not show every product.
- **Listings:** one reusable product card. The common filters plus category-specific filters for Fashion, Mobiles and Home Appliances, and six sort options.
- **Search:** searches the mock dataset. Results support filters and sorting, and an empty search shows "No products found."
- **Authentication:** mocked. The test user is Joseph / joseph@example.com / password123. The user is **never logged in automatically**.
- **Guest vs. logged-in users:** guests can browse and use the cart. Wishlist, Buy Now, checkout, orders, addresses and profile need login, and after login the user continues the action they started.
- **Cart:** each line is a product plus its variant. Adding the same product and variant increases the quantity. The cart survives a refresh.
- **Buy Now:** a separate flow that does not touch the cart.
- **Checkout:** addresses, Standard or Express delivery, and **Cash on Delivery only**. No other payment methods and no payment credentials.
- **Orders:** statuses are Placed, Confirmed, Shipped, Delivered and Cancelled, simulated. Cancellation is allowed and returns/refunds are excluded.
- **Profile and logout:** logging out clears only the session.
- **Quality:** validation, error, empty and out-of-stock states, responsive design and accessibility.
- **Sign-off:** the end-to-end user flows, the Phase 1 completion criteria and the Phase 1 exclusion list.

### Work done

- Created the repository structure:
  - `frontend/README.md`: placeholder; tooling to be confirmed at the architecture stage.
  - `backend/README.md`: placeholder; technology and database not chosen.
  - `docs/README.md`: placeholder for future documentation.
  - Root `README.md` and `.gitignore`.
- Wrote `requirements.md` (36 sections) covering every requested topic.
- Reviewed it and filled in details the brief did not specify. Each one is recorded as a default in §33:
  - **Guest cart:** it merges into the user's cart on login and stays with the account on logout.
  - **Passwords:** at least 8 characters, with at least one letter and one number.
  - **Delivery:** within India only (6-digit PIN code, 10-digit mobile number). Standard costs ₹40 and is free from ₹499; Express costs ₹99.
  - **Order status:** progresses automatically over time. Orders can be cancelled while Placed or Confirmed.
  - **Beauty and Toys filters:** Skin/Hair Type, Product Type and Age Group are proposals.
  - **Data layer:** asynchronous, so moving to a real backend in Phase 2 doesn't change how the UI calls it.
  - **Filter and sort settings:** kept in the page URL, so refresh, the back button and shared links preserve them.
  - **Email:** read-only on the Profile page, because it is the login identifier.
  - **Order records:** each order keeps its own copy of the item and address details.
  - **Excluded:** customer review text and coupon codes are out of scope for Phase 1.
- **Frontend tooling:** React is assumed because the brief mentions React components. The build tool, TypeScript, routing, styling and testing are deferred to the architecture stage.

### Decisions asked and answered

| ID | Question | Joseph's decision |
|---|---|---|
| D1 | What should the "More" navigation item contain? | **Remove it.** The navigation is Home plus the five categories. |
| D2 | Where should product images come from? | **External stock photo URLs** (with a placeholder if an image fails to load) |
| D3 | Real or fictional brand names? | **Mix.** Real brands for some categories (e.g. Mobiles, Home Appliances), fictional elsewhere. Brand names appear as text only. |
| D4 | Should placing an order reduce mock stock? | **Yes.** Orders reduce stock and cancellations restore it, persisted in localStorage. |

*(Note: in `requirements.md` the stock question is recorded as D5, and D4 there is the guest-cart default.)*

Follow-up from removing "More": Best Sellers, Special Offers and New Arrivals are reached from their Home page "View All" links. Under ₹999, On Sale and Best Rated are reached through the filters and sorting on any listing.

### Outcome

The requirements were captured and reviewed with no remaining blocking questions. Git has not been initialised.

### Follow-up in the same session

Joseph asked to keep a `conversation.md` at the repository root, updated as the project progresses. This file was created.

### Requirements review pass

Joseph asked for a review of `requirements.md` to confirm everything is covered and the flows to build are clear. Every topic in the original brief was covered, but the review found gaps that would block or confuse implementation. These changes were made:

- **Page inventory (§8.5):** a list of every page with an example path, who can access it and the section that specifies it, plus the shared UI pieces.
- **Login-required return (§6.1):**
  - After login, the user returns to the page they came from, which may be a listing rather than the product page.
  - The header Wishlist icon leads to the Wishlist page after login.
  - The pending action survives switching between Login and Signup, and is discarded if the user cancels.
- **Buy Now (§19):**
  - Only one pending Buy Now exists at a time. A new Buy Now replaces it, and starting a cart checkout clears it.
  - Opening checkout without a valid Buy Now falls back to cart checkout.
  - Buy Now's quantity limit is the full stock, not reduced by what is already in the cart (§16.3).
- **Cart merge landing (§17.5):** when a guest logs in on the way to checkout and saved items get merged in, they land on the Cart to review first.
- **Variant picker dialog (§14, §18):** one shared dialog for Add to Cart on cards and Move to Cart in the Wishlist, replacing the earlier "either/or".
- **Variant pricing:**
  - Each variant has its own price, original price and stock (§15.2).
  - The listing price is the lowest in-stock variant price, used for cards, price/discount filters and sorting (§12.3).
- **New Arrivals:** based on a product flag rather than a date window, so the collection doesn't empty out over time.
- **Subcategory navigation:** on category pages it is a single-select filter. On search results and collections, Category and Subcategory are multi-select filters.
- **Data storage table:** now includes the pending Buy Now selection and the pending login action.
- **Completion criteria:** added cancellation, stock updates, Buy Now not changing the cart, and validation/empty states.
- **User flows (§32):** added the login-required flow and the order cancellation flow.
- **Scope (§4.1):** "Simulated order statuses" now reads "Order statuses (no automatic progression)", to match the decision below.

### Decisions asked and answered (review pass)

| Question | Joseph's decision |
|---|---|
| How fast should order statuses progress automatically? | **"No need to handle that."** No automatic progression in Phase 1. New orders stay `Placed` unless cancelled. |
| Should the test user start with past orders? | **Yes, seed a few.** 3–4 sample orders for Joseph across Delivered, Shipped, Confirmed and Cancelled. |

Follow-up: seeded orders are historical. They don't change stock, and cancelling a seeded order doesn't restore stock (§25.5). Recorded as D7 and D11 in `requirements.md` §33. Defaults D12–D14 were added for the merge landing, the variant picker and variant listing price.

### Outcome of the review pass

`requirements.md` covers every topic in Joseph's original brief, and the flows to build are now specified end to end. There are no open questions. Product decisions are in §33: Joseph's choices are D1–D5, D7 and D11, and adjustable defaults are D6, D8–D10 and D12–D14. Joseph then asked for this log to be updated with the review, and it was.

### Next step

Wait for Joseph's instruction to begin the **architecture stage**.

---

## Session 1 (continued): Frontend architecture

### Request

Joseph asked for `docs/architecture.md`, covering:
- the frameworks and technologies needed to implement the requirements;
- the full frontend architecture and folder structure, since Phase 1 is frontend-only;
- routing, the pages and state management.

### Technology decisions asked and answered

| Question | Joseph's decision |
|---|---|
| Language | **TypeScript** (with Vite + React) |
| Styling | **Tailwind CSS** |
| Data and state | **TanStack Query + Zustand** |
| Supporting libraries (multi-select) | **React Hook Form + Zod** only |

Radix UI, lucide-react icons and the testing tools (Vitest, Testing Library, Playwright) were offered but **not selected**. As a result:
- dialogs, drawers and dropdowns are built in-house, with accessibility handled ourselves;
- icons are in-house SVG components;
- automated testing is not adopted for Phase 1, and verification is manual against requirements §34.

Assumed and awaiting confirmation: **React Router** for routing, **ESLint + Prettier** for linting and formatting, and **npm** as the package manager.

### Work done

Created `docs/architecture.md` (21 sections), covering:
- **Principles:** the UI never touches storage; one data-layer contract with swappable implementations; the mock adapter behaves like a server; business rules live in pure domain functions; the URL is the source of truth for what the user is viewing.
- **Layers:** pages → feature components and hooks → data-layer contracts → mock adapter (Phase 1) or HTTP adapter (Phase 2), with import rules between layers.
- **Folder structure** for `frontend/`: `app`, `layouts`, `pages`, `features/*`, `components`, `api` (contracts + mock), `domain`, `data`, `stores`, `hooks`, `config`, `lib`, `styles`.
- **Domain model:** every product has at least one variant; a cart line is identified by its variant; money is stored as whole rupees.
- **Data layer:** a typed API per area, a typed error model, and simulated latency.
- **localStorage:** a key table under `nivora:v1:`, with one-time seeding.
- **Routing:** the route table, layouts, `RequireAuth`/`GuestOnly` guards, lazy-loaded pages and page titles.
- **State management:**
  - TanStack Query for persisted data;
  - the URL for listings;
  - Zustand for UI state (toasts, login prompt, variant picker);
  - React Hook Form for forms;
  - local component state for the rest.
- **Flows:** pending-intent login flow, the listing pipeline, filter config per category, the URL format, search scoring, and the Add to Cart, Buy Now, checkout, place order and cancel flows.
- **Quality:** forms and validation, error handling, Tailwind design tokens, the responsive breakpoint plan, accessibility requirements for the in-house components, and performance.
- **Next phase:** the Phase 2 migration path and nine implementation milestones (M1–M9).

Also updated:
- `requirements.md`: the stack is linked from §3, and the pending intent is clarified as in-memory and not persisted.
- `README.md`, `frontend/README.md` and `docs/README.md`: now list the stack and link the architecture.

### Next step

Joseph to confirm the assumed tooling (React Router, ESLint + Prettier, npm) and review the architecture. Implementation starts with milestone M1 only when Joseph says to proceed.

---

## Session 1 (continued): Switching to Next.js for SEO

### Request

Joseph asked whether Nivora needs good SEO and whether Next.js would be better. (He initially wrote "SSO" and later clarified that he meant SEO.)

### Discussion

- **The problem:** the Vite single-page app sends almost empty HTML, so search engines index it less reliably, and link previews (WhatsApp, Facebook, X) show a generic card instead of the product.
- **The fix:** Next.js server-renders public pages, with per-page metadata, structured data and a sitemap.
- **What carries over:** all previously approved choices (TypeScript, Tailwind, TanStack Query, Zustand, React Hook Form, Zod), the data-layer contract and the domain rules.
- **Trade-offs:**
  - Deciding which code runs on the server and which in the browser.
  - Hosting needs a Node.js server or a platform like Vercel.
  - Next.js must stay frontend-only, with the backend still in `backend/`.
- **Timing:** switching now costs only a document rewrite. Switching after building would mean reworking routing and every page.

### Decisions

| Question | Joseph's decision |
|---|---|
| Switch from Vite + React Router to Next.js (App Router)? | **Yes, switch to Next.js** |
| Confirm ESLint + Prettier? | **Confirmed** |
| Confirm npm? | **Not confirmed.** The package manager is an open item |

React Router is no longer needed. Next.js provides routing.

### Work done

Rewrote `docs/architecture.md` for Next.js (23 sections). The main additions and changes:

- **Rendering strategy (§3):**
  - Catalog pages (Home, category, subcategory, collection, product, info, search) render on the server. Product pages are pre-built.
  - Cart, wishlist, checkout, account and the auth pages run in the browser, because their Phase 1 data is in localStorage.
  - Interactive parts are client "islands" inside server-rendered pages.
- **Stock in Phase 1 (§3.1):**
  - Server-rendered pages use the initial stock. A browser-side "inventory overlay" applies the stock changes from orders, which are stored in localStorage.
  - All purchase checks use the actual remaining stock.
  - There is a small, documented Phase 1 inconsistency in server-side "In stock only" filtering. It goes away in Phase 2.
- **Data layer:**
  - The catalog contract is used on the server (`api/server`). Customer-data contracts are used in the browser (`api/client`).
  - The storage module is safe to import on the server.
- **Routing (§9):**
  - App Router folders with `(shop)` and `(checkout)` route groups, and a route table showing how each page renders, who can access it, and whether it's indexed.
  - Login checks run in the browser in Phase 1. In Phase 2, `middleware.ts` will check a real session cookie on the server.
  - There is no `src/pages` folder, since Next.js would treat it as its legacy router.
- **SEO (§10):**
  - Per-page metadata: title template, description, canonical URL and Open Graph.
  - JSON-LD structured data (Organization/WebSite, BreadcrumbList, ItemList, Product with an INR offer, availability and rating).
  - A sitemap and robots rules, with private pages and search set to noindex and filtered listing URLs pointing to the unfiltered page.
  - A **Phase 1 indexing safety switch** (`NEXT_PUBLIC_ALLOW_INDEXING=false`), so mock data never gets indexed.
- **State management:**
  - Catalog data comes from Server Components.
  - Listing filters and sorts are URL changes that re-render the server page inside a transition.
  - TanStack Query holds customer data, with a stable placeholder on first render to avoid hydration mismatches.
  - Zustand holds UI state.
- **Other updates:**
  - `next/image` (allowed remote host, placeholder fallback) and `next/font`.
  - Lint rules for the server/browser import boundaries.
  - The Phase 2 migration table, including removing the inventory overlay.
  - Milestones updated; SEO is now part of M3.

Also updated:
- `requirements.md`: new **§31.1 SEO** requirements, a new SEO completion criterion, and the stack listed in §3.
- `README.md` and `frontend/README.md`: stack updated.
- `docs/README.md`: architecture description updated.

### Open items

- **Package manager** (npm, pnpm or yarn): needs a decision before milestone M1.
- **Hosting:** Next.js needs a Node.js server or a platform like Vercel. To be decided before any public deployment.

### Next step

Joseph to choose the package manager and review the updated architecture. M1 starts only when Joseph says to proceed.

### Package manager decision

Joseph chose **npm only**. `docs/architecture.md` now lists npm (with Node.js LTS) in the agreed stack, `package-lock.json` is committed, and no other lockfiles are allowed. The open item was removed.

### Next step (updated)

All technology decisions for Phase 1 are made. The only remaining open item, hosting, matters only before a public deployment. M1 (scaffold and design foundation) starts only when Joseph says to proceed.

---

## Session 1 (continued): Implementation roadmap (`tasks.md`)

### Request

Joseph asked for `tasks.md` at the repository root: an implementation roadmap of small, dependency-ordered tasks, each with verification steps. Claude must verify each task after completing it. No coding yet, and no new requirements or architecture decisions. Joseph supplied a suggested structure (Phase 0 project setup through Phase 13 final quality pass) and a task format (Goal, Depends on, Requirements, Implementation notes, Acceptance criteria).

### Work done

- Created `tasks.md` with **65 tasks in 14 stages**, following Joseph's structure.
- **Naming:** the stages are called "Stages 0–13" instead of "Phases", so they aren't confused with product Phase 1 (frontend) and Phase 2 (backend).
- **Task format:** each task has a Goal, Depends on, Requirements (req §/arch §), Implementation notes, Acceptance criteria, **Verification** steps and a **Verification log**.
- **Workflow rules** at the top of the file:
  - one task at a time;
  - Claude runs the verification and fixes failures before marking a task `[x]`;
  - Claude updates `tasks.md` and `conversation.md` after each task;
  - Claude waits for Joseph before starting the next task.
- **Verification split:**
  - 🤖 **Claude** runs lint, typecheck, build, `curl` checks of server-rendered HTML, SEO and status codes, `grep` boundary checks, and throwaway scratch scripts for logic.
  - 👤 **Joseph** does interactive browser checks, because no browser automation tool was adopted.
- **Ordering:**
  - All customer-data adapters are built in Stage 2, so later stages only build UI.
  - Authentication (Stage 3) comes before product discovery (Stage 4), so cards and product pages can use real login-required behaviour as soon as they're built. A stage-to-milestone mapping table explains this against arch §22.
- **TASK-001** (repository structure) is marked done and was verified: the tree was listed and `backend/` contains only its README.
- **Consistency:** the task IDs were checked to be sequential (TASK-001 to TASK-065).
- `README.md` and the `requirements.md` §3 tree now list `tasks.md`.

### Next step

Start **TASK-002 (Scaffold the Next.js app)** when Joseph says to proceed.

---

## Session 1 (continued): TASK-002 — Scaffold the Next.js app

Joseph confirmed that TASK-001 was done and asked to start implementation with TASK-002.

### Work done

- **Scaffold:** ran `create-next-app@16.3.8` into `frontend/` with TypeScript, Tailwind CSS 4, ESLint, App Router, the `src/` directory, the `@/*` alias, npm, `--empty` (minimal boilerplate) and `--disable-git` (no nested repository).
- **Not enabled:** React Compiler and Rspack, because they weren't agreed.
- **Versions:** Next.js 16.3.8, React 19.2.8.
- **Placeholder content:**
  - The starter page was replaced with a minimal Nivora placeholder (`<h1>Nivora</h1>`, title "Nivora").
  - Full metadata comes in TASK-005.
- **Housekeeping:**
  - The package was renamed to `nivora-frontend`.
  - `frontend/README.md` combines the earlier placeholder text with setup instructions.
- **Generated agent files:** Next.js created `AGENTS.md` (plus a `CLAUDE.md` pointer to it). It tells coding agents to read the version-matched docs in `node_modules/next/dist/docs/`, because Next.js 16 APIs differ from older versions. It was kept, and `next dev` re-adds it anyway.

### Verification (Claude)

All passed:
- lint;
- `tsc --noEmit`;
- `npm run build` (`/` prerendered as static);
- the dev server returns 200 at `/` with the Nivora title and heading;
- no `src/pages` folder;
- `package-lock.json` is the only lockfile;
- `strict: true` is set.

### Note: npm audit

`npm audit` reports 5 high-severity findings. They are all one `braces` advisory pulled in by `eslint-config-next`, which is development-only lint tooling and never ships to users. `npm audit fix --force` would downgrade the lint config to Next.js 14, so it was not applied. To be re-checked when an upstream fix is released.

### Next step

TASK-003 (install the agreed dependencies), when Joseph says to proceed.

---

## Session 1 (continued): TASK-003 and TASK-004

Joseph asked for TASK-003 and TASK-004 to be done together and verified one after the other. Joseph also asked where the dev server runs: http://localhost:3000, or the next free port if 3000 is taken.

### TASK-003 — Install agreed dependencies

- **Installed:**
  - Runtime: `@tanstack/react-query`, `zustand`, `react-hook-form`, `zod`, `@hookform/resolvers`.
  - Dev: `prettier`, `eslint-config-prettier`.
- **Verified (Claude):**
  - A script confirmed `package.json` matches the agreed lists exactly, with no banned packages.
  - `npm audit` is unchanged.
  - Lint, typecheck and build are clean.

### TASK-004 — Base configuration and environment

- **Prettier:** `.prettierrc` and `.prettierignore`.
- **Scripts:** `typecheck`, `format`, and `format:check`. The separate check script replaces the planned `format -- --check`, because Prettier's `--write` and `--check` don't combine.
- **ESLint rules:**
  - Browser storage is banned outside `src/api/client/mock/storage.ts`.
  - Mock adapters and mock data may only be imported inside `src/api`.
  - Route files may not import browser-only APIs or stores.
  - Browser-side shared code may not import the server catalog.
  - The UI kit may not depend on features or the data layer.
  - Domain code may not import React, Next.js, the data layer or features.
  - Server and client data-layer code are kept separate.
  - A small rule defined inside the config file (`nivora/client-boundary`, no new dependency) blocks `'use client'` files from importing server-only modules.
  - `eslint-config-prettier` comes last.
- **Environment:**
  - `.env.example` documents the variables.
  - At Joseph's request, `.env` was also created with the same defaults. It is git-ignored, while `.env.example` stays tracked.
- **Config modules:**
  - `src/config/site.ts` reads the env with safe fallbacks. It uses literal `process.env.NEXT_PUBLIC_*` references, as the Next.js 16 docs require.
  - `src/config/constants.ts`: delivery charges (Standard ₹40, free at ₹499 or more; Express ₹99), Cash on Delivery, page size 24, Home section limit 10, low-stock threshold 3.
- **Images:** `next.config.ts` has empty `images.remotePatterns`. The stock-photo host is added in TASK-015.
- **README:** `frontend/README.md` documents the scripts, environment variables and enforced code boundaries.
- **Verified (Claude):**
  - Seven temporary files, one for each rule, each failed lint with the intended message.
  - The permitted `storage.ts` passed.
  - All temporary files were deleted.
  - A scratch script confirmed the `siteConfig` defaults, valid overrides, and safe fallbacks for invalid values.
  - `git check-ignore` confirmed `.env` is ignored and `.env.example` is not.
  - format:check, lint, typecheck and build are clean.

### Next step

TASK-005 (application entry point: root layout, providers, metadata), when Joseph says to proceed.

---

## Session 1 (continued): TASK-005 — Application entry point

### Work done

- Read the Next.js 16 metadata docs first, as `AGENTS.md` asks. The title template applies only to child segments, and a default title is required.
- **`src/app/layout.tsx`:**
  - `<html lang="en">`.
  - Global CSS.
  - The app wrapped in `Providers`.
  - Default metadata: `metadataBase` from `siteConfig.url`, title template `%s | Nivora`, default title `Nivora — Online Shopping`, description, application name, and Open Graph basics (site name, `en_IN` locale, type website).
- **`src/providers/`:**
  - `queryClient.ts`: `createQueryClient()` with no retries and no refetch on window focus (arch §11.1).
  - `Providers.tsx`: a client component that creates one `QueryClient` per browser session with `useState`.
- **`src/config/site.ts`:** added the site description: "Shop fashion, home appliances, beauty, toys and mobiles at Nivora. Great prices and Cash on Delivery on every order." It was worded so it doesn't imply a returns feature.
- **README:** `frontend/README.md` already covered prerequisites, setup, scripts and environment from TASK-004, so it was left unchanged.

### Verification (Claude)

All passed:
- format:check, lint, typecheck and build.
- The production server (`next start`) serves `/` with `lang="en"`, `<title>Nivora — Online Shopping</title>`, the description, application-name and `og:*` tags.
- A temporary child page titled "Cart" rendered `<title>Cart | Nivora</title>`, confirming the title template. It was then deleted and the app rebuilt.

**Manual check pending (Joseph):** open the app and confirm the browser console has no errors or hydration warnings.

### Next step

TASK-006 (design tokens, typography and brand assets), when Joseph says to proceed. This task includes Joseph reviewing and approving the Nivora palette and logo.

---

## Session 1 (continued): TASK-006 to TASK-009 — Design foundation and UI kit

Joseph asked for TASK-006 to TASK-009 to be done in one run, with each task's acceptance criteria checked before moving on.

### Findings along the way

- **Next.js 16 renamed `middleware.ts` to `proxy.ts`** (found in the bundled docs). The two Phase 2 references in `docs/architecture.md` (§9.3, §21) were updated.
- **The `next/image` `priority` prop is deprecated in Next.js 16.** `ProductImage` uses `loading="eager"` + `fetchPriority="high"` instead, as the docs recommend.
- **A stale production server** from an earlier check was still holding port 3100 and gave misleading results. It was stopped. Verification servers now run through a scratch helper that starts and stops the whole process group, and Joseph's own dev server on port 3000 is never touched.

### TASK-006 — Design tokens, typography and brand assets

- **Visual identity:** a deep "lagoon" teal brand colour with a coral accent, chosen to stay clear of Amazon (orange/navy) and Flipkart (blue/yellow).
- **Tokens:** defined as Tailwind `@theme` tokens: brand and accent scales, neutrals, semantic colours, radii, shadows and motion.
- **Font:** Plus Jakarta Sans via `next/font`, self-hosted.
- **Accessibility basics:** a global focus ring and a reduced-motion rule.
- **Brand assets:**
  - `Logo` and `LogoMark`: a teal tile with an "n" arch and a coral spark, plus the "nivora" wordmark.
  - Favicon (`app/icon.svg`).
  - Default social-preview image (`public/og/nivora-default.png`, 1200×630, rendered in the brand font with a scratch script).
  - Product image placeholder.
- **Verified:**
  - All 21 colour pairs pass WCAG AA (two greys/greens were darkened for margin).
  - Every token compiles to a utility class.
  - The favicon, preview image and font are served correctly.
- **Pending:** Joseph's approval of the palette, typography and logo.

### TASK-007 — Basic UI primitives and icons

- **Built:** Button (variants, sizes, loading and disabled states, plus `buttonClasses()` for links), IconButton (label required by type), Input, Select, Checkbox, Radio, Badge, Spinner, Skeleton, VisuallyHidden, and 24 in-house SVG icons.
- **Preview page:** `/dev/ui` (`noindex`; removed in TASK-064).
- **Verified:**
  - A temporary file with an unlabelled `IconButton` failed the type check.
  - HTTP checks show every primitive and its ARIA attributes.
- **Bug fixed:** class names built at runtime, which Tailwind can't detect, were replaced with literals.

### TASK-008 — Overlays, toasts and focus management

- **Built:**
  - Hooks: `useFocusTrap`, `useMediaQuery`, `useHasMounted`.
  - A shared `ModalLayer` (portal, backdrop, `role="dialog"` + `aria-modal`, focus trap and return, Escape, inert background, scroll lock).
  - `Dialog` (bottom sheet on mobile) and `Drawer` (left/right/bottom).
  - A keyboard-complete `Dropdown` menu.
  - `toastStore` (Zustand) and a `Toaster` live region mounted in Providers.
- **Verified:**
  - A script tested the toast store logic.
  - Every required ARIA and keyboard behaviour is present in the code.
  - The live region renders on every page.
- **Improvement:** the toaster is kept out of the inert background, so toasts are still announced while a dialog is open.

### TASK-009 — Commerce display primitives and states

- **Built:**
  - `lib/format.ts`: `₹` with Indian digit grouping, and dates fixed to the Asia/Kolkata time zone so server and browser text match.
  - Price, Rating, ProductImage (with placeholder fallback), Breadcrumbs, EmptyState and ErrorState.
- **Verified:**
  - A script checked the formatter outputs, including ₹1,24,999, ₹1,00,00,000 and the IST date rollover.
  - HTTP checks show the rendered components.
  - The image optimizer rejects the missing file (400), which triggers the placeholder in the browser.

### Manual checks pending (Joseph, on http://localhost:3000/dev/ui)

1. Approve the palette, typography and logo (TASK-006).
2. Tab through the controls: focus rings, plus disabled and loading buttons (TASK-007).
3. Dialog: Tab stays inside, Escape closes it, focus returns to the button. Also check the drawers, the dropdown's arrow keys, and that toasts appear and disappear (TASK-008).
4. The broken-image example shows the Nivora placeholder (TASK-009).

### Next step

TASK-010 (layout shell: header, footer, responsive container), when Joseph says to proceed.

---

## Session 1 (continued): Hydration warning from a browser extension

Joseph reported a hydration-mismatch warning in the browser console.

- **Cause:** the diff showed `cz-shortcut-listen="true"` on `<body>`. That attribute is injected by the **ColorZilla** browser extension before React hydrates. It was not caused by Nivora code.
- **Fix:** added `suppressHydrationWarning` to `<body>` in `src/app/layout.tsx`, with a comment explaining why. It ignores attribute differences on `<body>` only. Child elements are still checked, so real mismatches in Nivora pages will still be reported.
- **Verified:** lint, typecheck and build are clean, and the production server renders `<body class="font-sans">` as before.
- **Tip:** hydration warnings can also be checked in a private window, where extensions are usually disabled.

---

## Session 1 (continued): TASK-010 and TASK-011 — Layout shell and routing skeleton

Joseph asked for TASK-010 and TASK-011.

### TASK-010 — Layout shell

- **`ShopShell`**, used by `(shop)/layout.tsx` and by the global 404 page. It contains:
  - a skip link;
  - a sticky header with:
    - the logo link;
    - a search form (inline on desktop, a full-width row on mobile);
    - Wishlist and Cart icon links;
    - a Login link;
    - a hamburger `MobileMenu` drawer below `lg`;
    - a Main nav row (Home only until TASK-031);
  - `<main id="content">`;
  - a dark lagoon footer with the 6 info links in three groups and "© 2026 Nivora".
- **`CheckoutShell`**, used by `(checkout)/layout.tsx`: a simplified header (logo, "Back to cart") and a small footer.
- **`config/routes.ts`:** path builders, the `INFO_PAGES` list, and `isSafeInternalPath` (to prevent open redirects).
- **Placeholders:** the search form is a plain GET form, replaced in TASK-038. The account area is a static Login link, made session-aware in TASK-025.
- **Fixed during review:** at 320px the header contents measured ~321px against 288px available. The logo and icon buttons are now slightly smaller below `sm` (~280px).
- **Verified:** all landmarks, the skip link, the labelled icon links, all six footer links, unique search input IDs, and footer contrast (11–16:1).

### TASK-011 — Routing skeleton

- **Next.js 16 findings from the bundled docs:**
  - Error boundaries receive `retry()` (re-fetch and re-render). `reset()` is the older, rarely needed option.
  - Unmatched URLs render the root `not-found.tsx` **outside** route-group layouts.
  - Once a response starts streaming, the status code is locked at 200, so a later `notFound()` becomes a "soft 404".
- **Decision, recorded in arch §9.2:**
  - No group-wide `loading.tsx`. Loading skeletons only on `p/[slug]` (pre-built) and `account/` (no 404 cases).
  - Pages that can 404 must call `notFound()` before anything that streams.
- **Created:**
  - A stub for every route in arch §9.2, with the right layout and a `<Page> | Nivora` title, and `noindex` on private pages.
  - Info pages pre-built for the six footer slugs only (`dynamicParams = false`).
  - Not-found pages: `app/not-found.tsx` (with the full shop shell) and `(shop)/not-found.tsx`.
  - `error.tsx` for both route groups (Try again uses `retry()`, plus Go to Home).
  - `global-error.tsx`.
  - The `PageSkeleton` loading pattern.
- **Verified:**
  - All 24 routes return the expected status, title, layout and robots meta.
  - Unknown paths return a real **404** with the Nivora page.
  - A temporary failing route returned 500 without leaking its error message, and was then removed.
- **Limitation:** Next.js 16 renders the error-boundary UI in the browser, so its visual check needs a browser. It is re-checked in TASK-062.

### Manual checks pending (Joseph)

- At ~375px, ~768px and ~1280px: no horizontal scrolling, and the mobile menu opens and closes with the keyboard.
- Optional: click through a few stub pages and try a bad URL.

### Next step

TASK-012 (domain types and constants), the start of Stage 2 (data and service layer), when Joseph says to proceed.

---

## Session 1 (continued): Stage 2 — Data and service layer (TASK-012 to TASK-024)

Joseph asked for TASK-012 to TASK-016, then extended the run to TASK-024 to finish Stage 2, and then asked to continue with Stages 3 and 4. Each task was verified before moving on.

### Product images (decision D2 in practice)

- **Blocked routes:** Unsplash's search API needs authorization, and both Unsplash's search pages and Pexels block scripted `curl` access.
- **What worked:** the web fetch tool can read Unsplash search results. Candidate photos were collected for every subcategory.
- **Verified:** because that tool summarises pages with a small model, **every URL was checked over HTTP: 288 of 288 returned real images**.
- **Licence:** Unsplash License (free to use, no attribution required).
- **Config:** `next.config.ts` allows only `images.unsplash.com/photo-**` with the catalog's exact query string. The image optimizer serves catalog photos and rejects any other query string.

### What was built

- **TASK-012 — Domain types:** catalog, listing, cart/pricing, customer and order types. An ESLint rule now requires `import type` for type-only imports. Together with a scratch resolver, this lets verification scripts run the real source directly in Node.
- **TASK-013 — Taxonomy:** 5 categories and 24 subcategories with the exact names from requirements §9, plus 3 collections kept out of the taxonomy.
- **TASK-014 and TASK-015 — Catalogue:**
  - **154 products and 346 variants**, generated from compact specs by a scratch script.
  - **Brands:** real for Mobiles and Home Appliances (Samsung, Apple, LG, …), fictional elsewhere (decision D3).
  - **Edge cases:** 12 fully out-of-stock products, 10 with some variants out of stock, and 29 with low stock.
  - **Sample orders:** 4 orders for Joseph (Delivered, Shipped, Confirmed, Cancelled), generated from the catalog so every snapshot and total matches.
  - **Also:** the Indian states list, stub info-page copy and the test-user seed data.
- **TASK-016 — Catalog rules:**
  - pricing (listing price per D14, delivery per D6);
  - stock;
  - search (accent-insensitive, simple plurals, every word must match, field weights);
  - the six sorts (relevance puts out-of-stock items last);
  - filters (OR within a filter, AND across filters, facet counts that ignore their own filter);
  - the listing pipeline with pagination.
- **TASK-017 — Commerce rules and validation:** cart rules (merge with cap, D12 flag), order building and cancellation, and Zod 4 schemas with the requirements §28 messages.
- **TASK-018 — API contracts:** contracts, `ApiError`, and the customer message map.
  - Two contract additions forced by the import rules: `ContentApi.getInfoPage`, and `ClientCatalogApi.getProduct` (live stock for the variant picker).
- **TASK-019 — Server catalog adapter:** pure, with no storage or latency. A search query takes about 2 ms.
- **TASK-020 to TASK-024 — Browser mock adapters:**
  - storage (the only localStorage access, with an in-memory fallback);
  - seeding (never logs anyone in);
  - sessions;
  - auth with guest-cart merge;
  - profile;
  - cart with line revalidation;
  - inventory;
  - wishlist;
  - addresses;
  - checkout (Buy Now vs cart);
  - orders (cancel restores stock, except for sample orders);
  - the assembled `api` object.

### Decisions and adjustments recorded

- The Indian states list moved from `src/data` to `src/config`. It is reference data, and domain validation needs it, but domain code may not import mock data.
- Slug rules: accents are normalised and `+` is dropped (e.g. `northline-pique-polo-t-shirt`, `sunveil-spf-50-pa-sunscreen`).
- Login with input that fails validation returns the generic "Incorrect email or password." rather than revealing which field was wrong.

### Verification

Every task has its own scratch test suite, run against the real source and real data (Stage 2 total: about 190 checks).
- The browser-side suites use an inspectable localStorage shim with zero latency.
- One test expectation was wrong (7 orders, not 8) and was corrected. No code defects remained.
- Final regression: lint, typecheck, format and build are clean, and every Stage 2 suite passes.
- No manual browser checks are needed for Stage 2, because there is no UI yet.

### Next step

Stage 3 (authentication UI, TASK-025 to TASK-030), then Stage 4 (product discovery, TASK-031 to TASK-039), as Joseph requested.

---

## Session 1 (continued): Stage 3 — Authentication, and Stage 4 — Product discovery

Joseph asked for Stages 3 and 4 after Stage 2, and then for Stages 5 and 6 after Stage 4.

### Stage 3 (TASK-025 to TASK-030)

- **Session and header:**
  - `useSession` and `applyIdentity`, which clears all user-scoped cached data whenever the identity changes.
  - The header account area: a placeholder, then Login, then "Hi, Joseph" with a menu.
- **Architecture fix:** `components/layout` can't import features, so the header takes slots, and `features/shell/ShopFrame` composes them.
- **Login and Signup:** React Hook Form with the shared Zod schemas. Data-layer field errors go back onto the fields, and pages wrap `useSearchParams` in `<Suspense>` as Next.js 16 requires.
- **Logout:** a short "leaving" flag stops the route guard from bouncing to Login during logout.
- **Route guards:**
  - `RequireAuth` runs client-side, because the session lives in the browser in Phase 1.
  - `GuestOnly` only redirects customers who *arrived* logged in, so post-login intents can navigate.
  - The redirect check now also rejects `/\host` and control characters.
- **Login-required dialog and pending intents:** wishlist-add, buy-now, checkout (with the D12 merge landing) and navigate. Intents survive switching between Login and Signup, and are discarded when leaving the auth pages.
- **Verified:**
  - 18 scripted intent scenarios over the real data layer.
  - Every protected route's server HTML contains only the guard skeleton.

### Stage 4 (TASK-031 to TASK-039)

- **Navigation:**
  - Desktop main nav with subcategory flyouts, which work without JavaScript and are crawlable.
  - The mobile menu is now session-aware.
- **Product card:** server-rendered, with a client stock-overlay island. `ProductSummary` gained an `initialStock` map for this.
- **Home:** hero plus Best Sellers, Special Offers and New Arrivals.
- **One listing system:** URL-synced filters and sorting, a filter sidebar and drawer, active chips, crawlable pagination, and empty states. It is used by category, subcategory, collection and search pages.
- **Search:** an interactive header search, a `noindex` results page, and empty queries redirect Home.
- **SEO:**
  - per-page metadata and canonical URLs;
  - JSON-LD;
  - a sitemap of 193 URLs;
  - `robots.txt`;
  - the Phase 1 indexing safety switch, verified in both modes.

### Findings and decisions

- **Streaming metadata (Next.js 16):** by default, titles and canonicals for dynamic pages are streamed into `<body>` for ordinary browsers. `htmlLimitedBots: /.*/` now makes them render in `<head>` for everyone. The catalog reads take about 2 ms, so the cost is negligible.
- **Dynamic 404s:** dynamic `notFound()` returns a correct 404 status, but Next.js 16 renders the page body in the browser. A bare test page at the root behaved the same, so this was accepted, with a browser check for Joseph.
- **Stray lockfile:** removed an empty `package-lock.json` (85 bytes, no packages) from the repository root. It was probably created by an npm command run from the root, and it confused Next.js's workspace detection.
- **Readable URLs:** listing URLs keep commas literal (`brand=A,B`).

### Verification

- Every task's checks passed. In two cases a test expectation of mine was wrong and was corrected; the code was right.
- The final regressions pass: lint, typecheck, format and build, plus the category, collection, search, domain, listing-params and auth suites.

### Manual checks pending (Joseph)

- Login, signup and logout flows, and the guarded pages (TASK-026 to TASK-030).
- Desktop flyouts with the keyboard, and the mobile menu (TASK-031).
- Grid and Home at three widths (TASK-032, TASK-033).
- Sorting, pagination and Back; filters including the drawer; header search (TASK-035 to TASK-038).
- `/c/unknown` shows the Nivora 404 page.

### Next step

Stage 5 (product details, TASK-040 to TASK-045), then Stage 6 (cart, TASK-046 to TASK-047), as Joseph requested.

---

## Session 1 (continued): Stage 5 — Product details, and Stage 6 — Cart

### Stage 5 (TASK-040 to TASK-045)

- **Product pages:** all 154 are pre-built at build time (`generateStaticParams` + `dynamicParams = false`). Unknown slugs get a *static* 404 that is fully rendered in HTML, which sidesteps the dynamic-404 behaviour found in Stage 4.
- **Page content:** an image gallery (thumbnails, buttons, arrow keys, swipe), description, specifications, product metadata with the product photo for social previews, and Product + Breadcrumb JSON-LD.
- **Variant logic (pure, unit-tested):**
  - option values are unavailable when out of stock or when the combination doesn't exist (e.g. OnePlus 8 GB + 256 GB);
  - single-value options are preselected;
  - the price updates with the selection;
  - the quantity is clamped to the available stock.
- **Purchase panel:** variant chips (native radios), quantity stepper, live stock status, Add to Cart (counting what's already in the cart), Buy Now (login-gated, cart untouched), Wishlist, and a sticky mobile action bar.
- **Cards:** every card now has Add to Cart (direct for single-variant products, otherwise the shared variant picker dialog) and a wishlist heart (optimistic toggle; guests get the login prompt).
- **Header:** the cart icon shows the total quantity once the cart has loaded.

### Stage 6 (TASK-046 and TASK-047)

- **Cart page:**
  - line items with quantity steppers capped at stock;
  - a price summary from the data layer (MRP, discount, delivery with a free-delivery hint, total, savings);
  - empty, loading and error states;
  - a sticky mobile checkout bar.
- **Checkout gating:** Proceed to Checkout is login-gated and blocked while any line has a stock issue.
- **Notices:** per-line issue messages, and a removed-items notice.
- **D12 merge notice:** now a banner on `/cart?merged=1` instead of a toast, so it survives a refresh. The intent logic and its test were updated.

### Verification

- New scripted checks: 11 variant-logic tests, plus 13 Product Details HTTP checks covering content, JSON-LD, the out-of-stock page, the static 404 and the card actions.
- Full regression against a fresh build:
  - every Node suite (TASK-013 to TASK-024, listing params, variant logic, auth intents, catalogue data) passes;
  - every HTTP suite (categories, Product Details, SEO) passes;
  - lint, typecheck and format are clean;
  - no storage access outside `storage.ts`.
- Interactive behaviour (adding to cart, the picker, wishlist toggles, Buy Now, cart editing) runs on data-layer logic tested in Stage 2. The UI needs Joseph's browser checks.

### Manual checks pending (Joseph)

- **Product page:** gallery, variant selection, quantity bounds, Add to Cart toast and header count, Buy Now (as a guest and logged in), wishlist heart.
- **Cards:** Add to Cart (direct, and via the picker) and wishlist hearts.
- **Cart:** quantity changes, remove, totals around ₹499, empty state, the guest checkout prompt, the merge banner, and an out-of-stock line via DevTools.

### Next step

Stage 7 (TASK-048, the Wishlist page) when Joseph says to proceed.

---

## Session 1 (continued): Stages 7–11 — Wishlist, checkout, orders, account and info pages

Joseph asked for Stages 7 to 11 (TASK-048 to TASK-056).

### What was built

- **Stage 7 — Wishlist page:**
  - shared product cards with **Move to Cart** (direct for single-variant products, otherwise via the variant picker) and **Remove**;
  - sold-out items can't be moved;
  - an empty state.
- **Stage 8 — Addresses and checkout:**
  - **Address management:** the form uses the shared schema with an Indian states list and India fixed, plus edit, delete (with confirmation), set as default, and an inline form when you have none.
  - **Checkout steps:** the address (default preselected), delivery options with real charges and estimated dates, an order summary for Cart or Buy Now, and a fixed **Cash on Delivery** payment section with no inputs.
  - **Totals** are re-requested when the delivery option changes.
  - **Blocking:** an empty cart, a missing address or stock issues block Place Order with a reason.
- **Stage 9 — Orders:**
  - **Place Order** is protected against double clicks and replaces the history entry, so Back doesn't return to checkout.
  - The **confirmation page** only reads the order, so a refresh can't create a duplicate.
  - The **orders list** is newest first.
  - **Order details** show a status timeline, item snapshots, the address and Cash on Delivery.
  - **Cancel** (with confirmation) is offered only for Placed and Confirmed orders.
- **Stage 10 — Account area:**
  - navigation (side nav on desktop, tabs on mobile, Logout);
  - a profile form (email read-only; saving updates the header greeting);
  - an addresses page.
- **Stage 11 — Info pages:**
  - the six info pages render real content, with metadata and canonical URLs;
  - all placeholder stubs are gone.

### Verification

- **HTTP:** every protected route serves only the guard skeleton with `noindex`. A visible-HTML check confirmed no customer data before login; static headings appear only in the hydration payload.
- **Info pages:** all six have one h1, sections and a canonical URL.
- **404s:** unknown product and single-segment paths give a full-HTML 404; unknown category and collection paths give a 404 rendered in the browser, as documented earlier.
- **Payment:** a whole-word scan confirmed there are no online-payment terms (UPI, wallet, net banking, credit, debit, CVV) anywhere in the source.
- **Logic:** delivery-window tests, including crossing the year boundary.
- **Regression:** the data-layer, variant, auth and HTTP suites all still pass, and lint, typecheck, format and build are clean.
- The data rules behind these screens (addresses, wishlist, checkout, orders, stock) were already covered by the Stage 2 suites.

### Manual checks pending (Joseph)

- **Wishlist:** move a simple and a sized product, remove, the empty state.
- **Addresses:** form messages, add, edit, set default, delete.
- **Checkout:** cart vs Buy Now, Express pricing, the no-address message, Place Order, the confirmation page and its refresh.
- **Orders:** the list (Joseph's sample orders plus new ones), details, cancelling (stock goes back up), and no Cancel button on Shipped or Delivered orders.
- **Account:** editing the profile (greeting updates), the phone validation, all navigation links, Logout.

### Next step

Stage 12 (integration and validation, TASK-057 to TASK-060) when Joseph says to proceed.

---

## Session 1 (continued): Stage 12 — Integration and validation, and Stage 13 — Final quality pass

Joseph asked whether completed tasks were marked in `tasks.md`. An audit confirmed TASK-001 to TASK-056 were `[x]` with verification logs and no gaps. Joseph then asked for Stages 12 and 13.

### Stage 12 (TASK-057 to TASK-060)

- **Link crawl:** starting from Home, 209 internal URLs were crawled, all returning 200, with no broken links. All 154 products, 24 subcategories and 6 info pages are reachable by links alone.
- **Scripted journeys** for every requirements §32 flow, through the real data layer and the post-login intent logic: guest shopping, wishlist via login, signup/login/logout, Buy Now, cart checkout, addresses, Cash on Delivery, confirmation, history, cancellation, and stock going down and back up. 32 checks; one wrong test assertion was corrected.
- **Protected routes:** the visible server HTML contains no customer data.
- **Responsive:** a fixed-width scan found nothing that would overflow at 320px.
- **New `docs/manual-testing.md`:** an exact click-path checklist for the browser-only checks (§A–§E).

### Stage 13 (TASK-061 to TASK-065)

- **Accessibility audit (12 pages):** `lang`, skip link, landmarks, one h1, no skipped heading levels, image alt text, named controls, labelled inputs.
  - Fixed: Login, Signup and Cart had no h1 in their initial HTML, so visually hidden headings were added to their loading states.
- **States review:** every §29.1 empty state, every §28 message, and loading and error handling in all 8 data views are present.
- **Navigation and SEO:** every §8.5 page is linked; the route modes match arch §9.2; the SEO suite passes.
- **Performance:**
  - initial JavaScript is about 300 KB gzipped (about 150 KB of that is the framework);
  - the product catalogue is lazily loaded, as arch §19 intended;
  - a Phase 2 opportunity was noted: the app chunk shrinks when HTTP adapters replace the mock layer.
- **Code quality:**
  - removed the `/dev/ui` preview and five unused exports;
  - replaced two duplicated stock calculations with the domain functions;
  - updated the architecture doc's file lists;
  - lint shows 0 warnings, and every boundary check passes.
- **Scope check:**
  - every §35 exclusion is absent;
  - the payment and API scans flagged only product names ("Wallet Flip Cover", "Blue Stripe") and `@/api` import paths, which were confirmed as false positives;
  - the taxonomy is exactly 5/24;
  - the dependencies match the agreed stack exactly.
- **Criteria map:** a table in `tasks.md` maps all 40 completion criteria to their verifying tasks.
- **READMEs:** status, how to run, the test account, and a link to the manual checklist.

### Status

All 65 tasks are verified from Claude's side. Phase 1 sign-off is Joseph's, after the browser walkthrough in `docs/manual-testing.md`.

---

## Session 1 (continued): Product Details design update

Joseph shared two screenshots: a reference product page from a large fashion store, and our `/p/samsung-galaxy-a35-5g` rendered in his browser. He asked for:
1. images on the left and details on the right, following the core idea rather than copying the style;
2. a fix for the missing padding on some buttons.

### Diagnosis

- In Joseph's running `npm run dev`, the two-column grid and the variant-chip padding classes were not applied.
- The **production build already contained those classes**: checked in the compiled CSS, then confirmed with a headless Chrome screenshot.
- His dev server had been started at 17:15, before the product-page files existed (Stage 5), and its Tailwind compilation hadn't picked up the classes first introduced in files created afterwards.
- **Fix for the dev view:** restart `npm run dev`.

### Redesign (in Nivora's style)

- **Layout:** two columns from 768px (previously 1024px). The gallery on the left is sticky, so it stays in view while the details scroll. Phones still show the gallery first, then the details.
- **Gallery:** a vertical thumbnail rail beside a large portrait main image that fills its frame (no more letterbox bars). Thumbnails switch on hover, click, or arrow keys including Up/Down. Phones get a horizontal thumbnail strip below.
- **Details column:**
  - brand, name, and the rating in a pill;
  - the price with "MRP" struck through and a "% off" pill;
  - "Inclusive of all taxes" and the stock status;
  - "SELECT COLOR / SIZE / RAM / STORAGE" headings with the chosen value;
  - variant chips with explicit height and padding (`h-11 px-5`), rounded;
  - QUANTITY;
  - **Add to Cart, Buy Now and Wishlist in one row** on wide screens;
  - a new **Delivery & services** box: Cash on Delivery, the Standard/Express charges and timings, and no returns claims;
  - "Product details" (description) and Specifications moved into the right column.
- **Phones:** the sticky Add to Cart / Buy Now bar remains.

### Verification

- Headless-Chrome screenshots of the production build at 1440px, 820px and 390px were reviewed. A one-off thumbnail load failure in the first tablet shot was traced to a transient network fetch; all 8 thumbnails return 200 and the retake was clean.
- Regression:
  - the product-page HTTP suite (one heading expectation updated to "Product details");
  - the accessibility audit (12 pages);
  - the link crawl;
  - the variant-logic tests;
  - lint, typecheck and format.
- **Bug found during regression:** two orders placed in the same millisecond could be listed in either order. The orders list now breaks ties by order number (newest first). The journey suite passed 5 runs in a row afterwards.
