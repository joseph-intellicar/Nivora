# Nivora — Product Requirements

| | |
|---|---|
| **Product** | Nivora — consumer e-commerce web application |
| **Document status** | Phase 1 requirements, reviewed; decisions recorded in §33 |
| **Current phase** | Phase 1: customer-facing frontend with mock data and localStorage |
| **Last updated** | 2026-10-06 |

This document is the source of truth for what Nivora must do. Architecture and technology choices are out of scope here; they are described in [`docs/architecture.md`](docs/architecture.md).

**Conventions**

- **must** = required for Phase 1 completion. **should** = expected unless there is a good reason not to. **may** = optional.
- Currency is Indian Rupees (₹). Prices are shown with the `₹` symbol and Indian digit grouping (e.g. `₹1,24,999`).
- "Guest" = a visitor with no active session. "Customer" / "logged-in user" = a visitor with an active session.

---

## Table of contents

1. [Overview](#1-overview)
2. [Branding](#2-branding)
3. [Repository structure](#3-repository-structure)
4. [Phase 1 scope](#4-phase-1-scope)
5. [Data layer and persistence](#5-data-layer-and-persistence)
6. [Guest vs. authenticated access](#6-guest-vs-authenticated-access)
7. [Authentication](#7-authentication)
8. [Header and navigation](#8-header-and-navigation)
9. [Category taxonomy (fixed)](#9-category-taxonomy-fixed)
10. [Home page](#10-home-page)
11. [Category pages](#11-category-pages)
12. [Product listing, filters and sorting](#12-product-listing-filters-and-sorting)
13. [Search](#13-search)
14. [Product card](#14-product-card)
15. [Mock product data](#15-mock-product-data)
16. [Product Details page](#16-product-details-page)
17. [Cart](#17-cart)
18. [Wishlist](#18-wishlist)
19. [Buy Now](#19-buy-now)
20. [Checkout](#20-checkout)
21. [Addresses](#21-addresses)
22. [Delivery](#22-delivery)
23. [Payment — Cash on Delivery](#23-payment--cash-on-delivery)
24. [Placing an order](#24-placing-an-order)
25. [Orders and order status](#25-orders-and-order-status)
26. [Profile / Account](#26-profile--account)
27. [Logout](#27-logout)
28. [Validation and error handling](#28-validation-and-error-handling)
29. [Empty, loading and other UI states](#29-empty-loading-and-other-ui-states)
30. [Responsive behavior](#30-responsive-behavior)
31. [UI/UX quality bar](#31-uiux-quality-bar)
32. [End-to-end user flows](#32-end-to-end-user-flows)
33. [Product decisions](#33-product-decisions)
34. [Phase 1 completion criteria](#34-phase-1-completion-criteria)
35. [Explicitly excluded from Phase 1](#35-explicitly-excluded-from-phase-1)
36. [Phase 2 considerations](#36-phase-2-considerations)

---

## 1. Overview

Nivora is a modern consumer e-commerce website. It is a long-term project that will be built in phases inside a single repository:

- **Phase 1 (this document's focus):** a complete, realistic customer-side shopping experience — browse, search, filter, view products, cart, wishlist, checkout, place orders (Cash on Delivery) and view orders. There is no real backend: products are mock data, users/auth are mocked, and customer data is persisted in the browser's localStorage.
- **Phase 2:** a real backend API and database built in `backend/`, replacing the Phase 1 mock/localStorage layer **without rewriting the UI**.

Even though Phase 1 data is mocked, from the customer's point of view Nivora must behave like a real, connected e-commerce product — not a collection of unrelated demo pages.

## 2. Branding

- The product name is **Nivora**, used consistently everywhere, including:
  - Logo / brand mark in the header (links to Home)
  - Browser tab title (e.g. `Nivora — Online Shopping`, and page-specific titles such as `Cart | Nivora`, `<Product name> | Nivora`)
  - Login and Signup pages (e.g. "Login to Nivora", "Create your Nivora account")
  - Checkout and Order Confirmation (e.g. "Thank you for shopping with Nivora")
  - Footer ("About Nivora", copyright line)
  - Empty states where appropriate
  - README and documentation
- Nivora must have **its own visual identity** (logo treatment, color palette, typography, component style).
- Proven usability patterns from large e-commerce platforms (e.g. Amazon, Flipkart) may inform layout and interaction decisions, but Nivora must **not** copy their branding, exact layouts, colors or visual components.

## 3. Repository structure

```
nivora/
├── frontend/         Customer-facing web app — the only area worked on in Phase 1
├── backend/          Placeholder only; built in Phase 2
├── docs/             Project documentation (architecture.md)
├── requirements.md   This document
├── conversation.md   Running log of working sessions and decisions
├── tasks.md          Implementation roadmap
├── README.md         Project overview
└── .gitignore
```

- `backend/` exists as a placeholder with no implementation. The backend technology and database are **not chosen yet**; they will be decided at the architecture stage.
- No new technologies are introduced without discussion. The frontend stack is set out in [`docs/architecture.md`](docs/architecture.md): Next.js (App Router), React, TypeScript, Tailwind CSS, TanStack Query, Zustand, React Hook Form and Zod.

## 4. Phase 1 scope

### 4.1 In scope

- Customer-facing frontend only.
- Mock product and category data (in code/data modules).
- Mock users and mock authentication (localStorage).
- Mock cart, wishlist, addresses, orders and profile (localStorage).
- Cash on Delivery as the only payment method.
- Order statuses (no automatic progression; see §25.1).
- Responsive design for desktop, tablet and mobile.

### 4.2 Out of scope

See [§35](#35-explicitly-excluded-from-phase-1) for the full exclusion list (real backend, database, real auth, any online payment, OTP/email/SMS, admin/seller dashboards, real inventory/shipping, returns/refunds, etc.).

## 5. Data layer and persistence

### 5.1 Separation of concerns

- React components **must not** call `localStorage` directly.
- All persistence must go through a dedicated data/persistence layer (e.g. service/repository modules) that exposes domain operations such as "get products", "log in", "add to cart", "place order".
- Business rules (stock validation, price calculation, cart merging, order creation, access checks) should live outside presentational components so they can move to the backend in Phase 2.
- The data layer's interface should be **asynchronous** (promise-based) even though localStorage is synchronous, so that swapping to network APIs in Phase 2 does not change how the UI calls it. As a consequence, the UI must handle loading and failure states for data operations.
- Phase 2 must be able to replace the implementation of this layer (localStorage → backend API) without rewriting UI components.

### 5.2 Where data lives

| Data | Phase 1 location | Notes |
|---|---|---|
| Categories / subcategories | Code/data module | Fixed taxonomy (§9) |
| Products (incl. variants, specs, images, initial stock) | Code/data module | Not stored in localStorage |
| Stock adjustments | localStorage `inventory` | Changes in stock from orders/cancellations, applied on top of the initial stock (§24.4) |
| Users (registered accounts) | localStorage `users` | Seeded with the test user (§7.1) |
| Active session | localStorage `auth_session` | Absent on first launch |
| Cart | localStorage `cart` | Available to guests (§17.5) |
| Wishlist | localStorage `wishlist` | Keyed by user |
| Addresses | localStorage `addresses` | Keyed by user |
| Orders | localStorage `orders` | Keyed by user; seeded with sample orders for the test user (§25.5) |
| Pending checkout | localStorage `checkout_session` | The pending Buy Now selection (§19) |
| Pending intent | In-memory UI state + router state (not persisted) | The action a guest started before being asked to log in (§6.1) |
| Profile | localStorage `profile` (or part of `users`) | Keyed by user |

- Storage keys should be namespaced (e.g. `nivora:cart`) and stored data should be versioned so the schema can evolve.
- Corrupt or unreadable stored data must not crash the app; it should fall back to a safe empty state.
- Per-user data (wishlist, addresses, orders, profile) must be logically associated with the user's ID.

### 5.3 Phase 1 security caveat

Mock users' passwords are stored in localStorage. This is acceptable **only** for the Phase 1 mock and must not be treated as a security model. Real credential handling is a Phase 2 concern.

## 6. Guest vs. authenticated access

| Feature | Guest | Logged in |
|---|:---:|:---:|
| View Home | ✅ | ✅ |
| Browse categories / subcategories | ✅ | ✅ |
| Search, filter, sort | ✅ | ✅ |
| View Product Details | ✅ | ✅ |
| Add to Cart, view Cart, modify Cart | ✅ | ✅ |
| Wishlist (add, view, remove, move to cart) | ❌ login required | ✅ |
| Buy Now | ❌ login required | ✅ |
| Checkout / place orders | ❌ login required | ✅ |
| View Orders / Order Details | ❌ login required | ✅ |
| Manage Addresses | ❌ login required | ✅ |
| Profile / Account | ❌ login required | ✅ |

### 6.1 Login-required experience

When a guest attempts a protected action or visits a protected page:

- **Protected action** (e.g. Wishlist button, Buy Now, Proceed to Checkout): show a clear login-required prompt (dialog or equivalent) explaining why login is needed, with **Login** and **Cancel**. Cancel leaves the user exactly where they were.
- **Protected page** (e.g. direct visit to `/orders`, `/checkout`, `/account`, `/wishlist`): redirect to Login with a message such as "Please log in to continue."
- After a successful login (or signup), return the user to where they were and **continue the intended action** where practical:
  - Wishlist button on a product (card or Product Details) → the product is added to the wishlist and the user is back on the page they came from (the product page or the listing).
  - Wishlist icon in the header → the user lands on the Wishlist page.
  - Buy Now → the user goes to checkout with the same product, variant and quantity.
  - Proceed to Checkout → the user goes to cart checkout.
  - Protected page → the user lands on that page.
- The intended action must still be re-validated after login (e.g. stock may be insufficient).
- The pending intent survives switching between Login and Signup. It is discarded if the user cancels or leaves the login flow, so it never triggers later by surprise.

## 7. Authentication

Authentication is mocked using localStorage.

### 7.1 Predefined test user

| Field | Value |
|---|---|
| Name | Joseph |
| Email | joseph@example.com |
| Password | password123 |

- The test user is seeded into the users store if not already present, together with a few sample past orders (§25.5).
- **The user is never logged in automatically.** On first launch, `isAuthenticated = false`. The user must enter credentials and click Login.

### 7.2 Login

- Fields: **Email**, **Password**, **Login** button, link to **Signup**.
- Validation:
  - Required fields.
  - Valid email format.
  - Correct credentials. On failure show a generic message such as "Incorrect email or password." (do not reveal which part was wrong).
- Email matching is case-insensitive and ignores surrounding whitespace.
- On success:
  - Create an active session and persist it to localStorage.
  - Redirect: to the originating page/intended action (§6.1) if any, otherwise to Home.
  - Merge the guest cart into the user's cart (§17.5).
- The session survives page refresh and browser restart until logout.
- A logged-in user visiting Login or Signup is redirected to Home (or their intended destination).

### 7.3 Signup

- Fields: **Name**, **Email**, **Password**, **Confirm Password**, **Signup** button, link to **Login**.
- Validation:
  - Required fields.
  - Valid email format.
  - Password requirements: at least 8 characters, containing at least one letter and one number. (The test user's `password123` satisfies this.)
  - Password and Confirm Password must match.
  - Email must not already be registered (case-insensitive): "An account with this email already exists. Try logging in."
- On success:
  - Create and persist the mock user.
  - Authenticate the user (create a session).
  - Redirect as for Login (§7.2), including returning to an intended action.

### 7.4 Session

- A session identifies the logged-in user (user ID, plus whatever the data layer needs).
- If the stored session refers to a user that no longer exists or is malformed, treat the visitor as a guest.

## 8. Header and navigation

### 8.1 Header (all pages)

- Nivora logo/name (links to Home).
- Global search (§13).
- Wishlist icon (guest: triggers the login-required prompt; logged in: opens Wishlist). May show a count for logged-in users.
- Cart icon with **cart item count** (total quantity of items in the cart), visible to guests and logged-in users.
- Account area:
  - Guest: **Login** (and access to Signup).
  - Logged in: user's name/greeting with a menu linking to Profile, Orders, Wishlist, Addresses and Logout.

### 8.2 Main navigation

Shown directly in this order:

**Home · Fashion · Home Appliances · Beauty · Toys · Mobiles**

- Clicking a main category opens that category's page (§11).
- Subcategories should be discoverable from the main navigation (e.g. dropdown/flyout on desktop, expandable sections in the mobile menu).
- The active section should be visually indicated.
- There is **no "More" item** in Phase 1 (decision D1). Best Sellers, Special Offers and New Arrivals are reached from their Home page sections ("View All"). Under ₹999, On Sale and Best Rated are available through the price, discount and rating filters/sorting on any listing, and may also be used as targets for hero/promo CTAs.

### 8.3 Footer (all pages)

- About Nivora
- Contact
- Help
- Returns
- Privacy
- Terms
- Copyright line (e.g. "© 2026 Nivora")

Footer links lead to simple static informational pages in Phase 1. The Returns page only describes a policy; there is no returns/refunds functionality (§35).

### 8.4 Not-found page

Unknown routes, and product/category IDs that don't exist, show a Nivora-branded "page not found" / "product not found" state with a way back to shopping.

### 8.5 Page inventory

Every page Phase 1 must provide. Paths are illustrative; the final routes are set at the architecture stage.

| Page | Example path | Access | Section |
|---|---|---|---|
| Home | `/` | Everyone | §10 |
| Category | `/c/fashion` | Everyone | §11 |
| Subcategory | `/c/fashion/men` | Everyone | §11 |
| Collection (Best Sellers, Special Offers, New Arrivals) | `/collections/best-sellers` | Everyone | §9.1 |
| Search results | `/search?q=…` | Everyone | §13 |
| Product Details | `/p/<slug>` | Everyone | §16 |
| Cart | `/cart` | Everyone | §17 |
| Login | `/login` | Guests only | §7.2 |
| Signup | `/signup` | Guests only | §7.3 |
| Wishlist | `/wishlist` | Logged in | §18 |
| Checkout (cart or Buy Now) | `/checkout` | Logged in | §20 |
| Order Confirmation | `/order-confirmation/<orderId>` | Logged in, own order | §24.3 |
| Account › Profile | `/account` | Logged in | §26 |
| Account › Orders | `/account/orders` | Logged in | §25.3 |
| Account › Order Details | `/account/orders/<orderId>` | Logged in, own order | §25.4 |
| Account › Addresses | `/account/addresses` | Logged in | §21 |
| About, Contact, Help, Returns, Privacy, Terms | `/about` etc. | Everyone | §8.3 |
| Not found | any unknown path | Everyone | §8.4 |

Shared UI used across pages: header, main navigation, mobile menu, footer, product card, filter panel/drawer, login-required dialog, variant picker dialog (§14), toasts, confirmation dialogs.

## 9. Category taxonomy (fixed)

The taxonomy is fixed. **No additional categories or subcategories may be added.**

| Category | Subcategories |
|---|---|
| **Fashion** | Men · Women · Kids · Footwear · Accessories |
| **Home Appliances** | Refrigerators · Washing Machines · Air Conditioner · Kitchen |
| **Beauty** | Skincare · Haircare · Makeup · Fragrances · Personal Care |
| **Toys** | Educational Toys · Action Figures · Dolls · Remote Control Toys · Outdoor Toys · Board Games |
| **Mobiles** | Smartphones · Mobile Accessories · Cases & Covers · Chargers |

- 5 categories, 24 subcategories.
- Every product belongs to exactly one category and exactly one subcategory within it.
- "Home" in the navigation is the homepage, not a product category.

### 9.1 Collections are not categories

Groupings such as **Under ₹999**, **On Sale**, **Best Rated**, **New Arrivals**, **Best Sellers** and **Special Offers** are **collections/filters**, not categories or subcategories. They must not appear in the taxonomy. They are implemented as predefined filter/sort combinations over the product dataset, viewed through the standard product listing page.

| Collection | Definition |
|---|---|
| Under ₹999 | Current price ≤ ₹999 |
| On Sale / Special Offers | Product has a discount (current price < original price) |
| Best Rated | Rating ≥ 4.0, sorted by rating |
| New Arrivals | Products flagged `isNewArrival`, sorted by newest (`createdAt`). A flag is used rather than a date window, so the collection doesn't empty out as time passes |
| Best Sellers | Products flagged as best sellers (mock popularity data) |

## 10. Home page

The Home page is for **product discovery and promotions**. It must **not** list every product, and must **not** include a permanent "Shop by Category" section (categories are already in the main navigation).

Sections, in order:

1. **Header and main navigation** (§8).
2. **Hero / promotional banner**: headline, supporting text, a CTA (e.g. "Shop Now") linking to a relevant listing, and a visual/banner area. May rotate between a small number of promotions (a carousel is optional; if used, it must be keyboard-accessible and pausable).
3. **Best Sellers**: a row/grid of product cards (§14), with **View All** linking to the Best Sellers collection listing.
4. **Special Offers**: discounted / on-offer products, with **View All**.
5. **New Arrivals**: recently added products, with **View All**.
6. **Footer** (§8.3).

Each section shows a limited number of products (e.g. 8–12).

## 11. Category pages

Opened by clicking a main category (e.g. Fashion). Contains:

- Breadcrumb (Home › Fashion).
- Category heading.
- Category description (short marketing copy).
- Product count.
- Subcategory navigation — the fixed subcategories for that category (e.g. Men, Women, Kids, Footwear, Accessories). Selecting one narrows the listing to that subcategory (a subcategory view, with breadcrumb Home › Fashion › Men). On category pages this navigation *is* the subcategory filter. It selects one subcategory at a time, and "All" returns to the full category.
- Filters (§12.2), including category-specific filters.
- Sorting (§12.3).
- Product listing (§12.1).

The same structure applies to all five categories.

## 12. Product listing, filters and sorting

The same listing system is used for category pages, subcategory pages, collections and search results.

### 12.1 Listing

- Product grid using the reusable product card (§14).
- Product count reflecting the current filters (e.g. "Showing 24 products").
- Pagination or "load more" for long lists.
- Empty state when filters produce no results (§29).

### 12.2 Filters

**Common filters (all listings):**

| Filter | Behavior |
|---|---|
| Subcategory | On category pages, via the subcategory navigation (single select). On search results and collections, Category and Subcategory filters (multi-select) |
| Brand | Multi-select, from brands present in the current result set |
| Price | Range (min/max) and/or predefined price bands |
| Rating | Minimum rating (e.g. 4★ & above, 3★ & above) |
| Discount | Minimum discount (e.g. 10%+, 25%+, 50%+) |
| Availability | Include/exclude out-of-stock products ("In stock only") |

**Category-specific filters (in addition to the common filters):**

| Category | Specific filters |
|---|---|
| Fashion | Size, Color |
| Mobiles | RAM, Storage |
| Home Appliances | Capacity, Energy Rating |
| Beauty | Skin/Hair Type, Product Type *(proposed)* |
| Toys | Age Group *(proposed)* |

Rules:

- Filter options are derived from the product data in the current result set, so users never see options that can't match anything.
- Multiple values within one filter combine with OR; different filters combine with AND.
- Active filters are shown as removable chips, with a **Clear all** action.
- Filter and sort state should be reflected in the URL so that refresh, back/forward and shared links preserve it.
- Products whose variants are filterable (e.g. size, color, RAM, storage) match if **any** variant matches.
- On mobile, filters open in a drawer/modal (§30).

### 12.3 Sorting

- Relevance (default)
- Price: Low to High
- Price: High to Low
- Rating
- Newest
- Discount

For products whose variants have different prices, the **listing price** is the lowest price among in-stock variants (or among all variants if none are in stock). The listing price is used consistently for the product card, the price filter, price sorting, the discount filter and discount sorting.

For category listings with no search term, "Relevance" uses a sensible default ordering (e.g. popularity/best-seller rank). Out-of-stock products should sort after in-stock products under Relevance.

## 13. Search

- Global search in the header on all pages.
- Searches the mock product dataset, matching (case-insensitive, partial words) against at least: product name, brand, category, subcategory, and relevant fields (e.g. tags, key specs, description).
- Submitting a search opens a search results page (e.g. `/search?q=...`) showing:
  - The query ("Results for 'running shoes'").
  - Product count.
  - Filters (common filters plus Category/Subcategory; category-specific filters appear when results are narrowed to a single category).
  - Sorting (Relevance ranks name/brand matches above description matches).
  - The standard product grid.
- Empty or whitespace-only queries are not submitted.
- Search suggestions/autocomplete are **optional** in Phase 1.
- **No results:** show "**No products found.**" with **Clear Filters** (when filters are active) and a way back to shopping (e.g. **Continue Shopping** to Home).

## 14. Product card

One reusable product card component used everywhere products are listed: Home sections (Best Sellers, Special Offers, New Arrivals), category/subcategory pages, collections, search results and Wishlist.

The card shows:

- Product image
- Product name (truncated cleanly if long)
- Rating and review count
- Current price (the listing price, §12.3; may be shown as "From ₹X" when variants have different prices)
- Original price (struck through) when discounted
- Discount percentage (e.g. "23% off")
- Wishlist action (filled/active when already wishlisted; guest → login-required prompt)
- Add to Cart action where appropriate (see below)
- Out-of-stock state ("Out of Stock" badge; purchase actions disabled)

Behavior:

- Clicking the card (image or name) opens the Product Details page.
- Wishlist and Add to Cart actions do not navigate away.
- **Add to Cart from a card**: when the product has required variants, the card's action must not silently pick a variant — it opens the shared **variant picker dialog** (variant options with per-variant stock, quantity 1, and Add to Cart). The dialog also links to the full Product Details page. Products without required variants are added directly (quantity 1) with confirmation feedback.
- In the Wishlist context, the card's primary action is **Move to Cart** and it includes **Remove**.

## 15. Mock product data

A sufficiently large, realistic dataset is a core Phase 1 deliverable.

### 15.1 Coverage

- Every one of the 24 subcategories has products — **at least 6 per subcategory** (roughly 150+ products overall), enough to make filtering, sorting and pagination meaningful.
- The dataset must demonstrate: category and subcategory pages, search, every filter, every sort, Best Sellers, New Arrivals, Special Offers, Product Details, variants, cart, wishlist, checkout and orders.
- It must include:
  - Discounted and non-discounted products, with a range of discount percentages.
  - Products under ₹999 and premium products.
  - A spread of ratings and review counts.
  - Products with and without variants.
  - Fully out-of-stock products **and** products where only some variants are out of stock.
  - Low-stock items (e.g. 1–3 units) to demonstrate quantity limits.
  - Multiple brands per subcategory: a mix of real brands (e.g. for Mobiles and Home Appliances) and realistic fictional brands elsewhere (decision D3).
  - Several products flagged as best sellers and as new arrivals.
- Sample order history for the test user is seeded as described in §25.5.

### 15.2 Product fields (minimum)

| Field | Notes |
|---|---|
| id, slug | Stable identifiers |
| name, brand | Realistic |
| categoryId, subcategoryId | Must reference the fixed taxonomy |
| description | Realistic, a few sentences |
| images | Main image + gallery (multiple images) |
| price (current), originalPrice (MRP) | Discount % derived from these |
| rating (0–5, one decimal), reviewCount | |
| specifications | Key/value list relevant to the product type |
| variants | Variant dimensions (e.g. color, size, RAM, storage), each with a stable ID. Each variant combination has its own price, original price and stock where these differ from the product's |
| stock | Per product (no variants) or per variant combination |
| filter attributes | e.g. capacity, energy rating, age group, skin type |
| isBestSeller, createdAt / isNewArrival | Drive collections and "Newest" sort |
| tags | Extra search terms |

### 15.3 Images

Product images are realistic free stock photos referenced by external URL (decision D2), e.g. from a free stock photo service. Each image must clearly fit its product. Because they load over the network:

- An image that is missing or fails to load must degrade to a neutral Nivora placeholder, never a broken-image icon.
- Images reserve their space (fixed aspect ratio) so layouts don't jump while loading.
- Images below the fold should load lazily.

Using real brand names does not mean using official product photos or logos; brand names appear as text only.

## 16. Product Details page

### 16.1 Content

- Breadcrumb (Home › Category › Subcategory › Product).
- Main product image with an image gallery/thumbnails (selecting a thumbnail changes the main image).
- Product name and brand.
- Rating and review count.
- Current price, original price, discount percentage.
- Stock status (In stock / Only N left / Out of Stock), reflecting the selected variant.
- Variant selectors where applicable.
- Quantity selector.
- **Add to Cart** and **Buy Now**.
- **Wishlist** action.
- Description.
- Specifications.
- May include a "similar products" row from the same subcategory (optional).

Customer reviews (reading or writing review text) are not part of Phase 1; only the rating and review count are shown.

### 16.2 Variants

- Variant types include Color, Size, Storage, RAM and other product-specific options.
- **Required** variants must be selected before Add to Cart or Buy Now. If not selected, show an inline message (e.g. "Please select a size").
- Products with a single option for a variant dimension may preselect it.
- If a variant combination changes the price (e.g. a higher storage tier), the displayed price updates.
- Out-of-stock variants are shown at the variant level (e.g. disabled/struck-through option labeled out of stock) and cannot be purchased.

### 16.3 Quantity

- Controls: decrease (−), current quantity, increase (+).
- Minimum 1; maximum = available stock for the selected product/variant.
- The decrease control is disabled at 1; increase is disabled at the stock limit, with a hint (e.g. "Only 3 left").
- For **Add to Cart**, if the cart already contains some of this exact item, the maximum addable is reduced accordingly (§17.2). **Buy Now** is independent of the cart, so its maximum is the full available stock.
- Changing the variant resets or clamps the quantity to the new variant's stock.

### 16.4 Out of stock

- When the product (or selected variant) is out of stock: show **Out of Stock**, disable Add to Cart, Buy Now and quantity controls. Wishlist remains available.

## 17. Cart

### 17.1 Add to Cart

Available to guests and logged-in users.

Before adding, validate: required variants selected, quantity valid (≥ 1), sufficient stock (including quantity already in the cart).

After adding:

- Update cart state and persist it to localStorage.
- Update the header cart count.
- Show a confirmation (e.g. a toast "Added to cart" with a **View Cart** link).
- **Stay on the current page** (Product Details).

### 17.2 Line items

- A cart line is identified by **product + selected variant combination**.
- Adding the same product with the same variants **increases the quantity** of the existing line (capped at stock; if the cap is hit, add what's possible and tell the user, or reject with a clear message).
- Different variants are **separate lines**, e.g. "Black / Large × 2" and "White / Medium × 1".

### 17.3 Cart page

Each line shows: product image, product name (links to Product Details), selected variants, unit price, quantity controls, item total, and Remove.

The user can: increase quantity (up to stock), decrease quantity (minimum 1; removing is a separate action), remove an item, Continue Shopping, and **Proceed to Checkout**.

Price summary:

| Line | Calculation |
|---|---|
| Subtotal (MRP) | Σ original price × quantity |
| Discounts | Σ (original price − current price) × quantity, shown as a saving |
| Delivery charge | See §22; shown as an estimate on the Cart page, final at checkout |
| **Total** | Subtotal − Discounts + Delivery charge |

Coupons/promo codes are not part of Phase 1.

### 17.4 Cart validity

- The cart survives page refresh and browser restart.
- On load, cart lines are re-validated against current product data: lines whose product/variant no longer exists are removed with a notice; lines that are now out of stock or exceed stock are flagged, and checkout is blocked until resolved.
- Proceed to Checkout is disabled (or shows an error) when the cart is empty or contains invalid lines.
- Guest → Proceed to Checkout → login-required → after login, continue to checkout (§6.1).

### 17.5 Guest cart and login

- The cart works for guests and persists in localStorage.
- On login/signup, the guest cart is **merged** into the user's cart: matching lines are combined (quantities summed, capped at stock); other lines are added.
- If the guest was proceeding to checkout and the merge brought in items saved from an earlier visit, the user lands on the **Cart** with a notice ("We've added items saved from your last visit"), so they can review before checking out. If the merge added nothing new, they continue straight to checkout.
- Logged-in users' carts are associated with their user ID so that each user sees their own cart.
- On logout, the user's cart remains stored for that user and the visitor starts with an empty guest cart.

## 18. Wishlist

Requires authentication.

- A logged-in user can: add products, remove products, view the wishlist, **Move to Cart**, and Continue Shopping.
- Persisted in localStorage, associated with the logged-in user.
- No duplicates: a product appears at most once.
- The wishlist action shows an active/filled state when the product is already wishlisted; clicking it again removes it.
- Wishlist entries are at the product level. **Move to Cart**:
  - If the product needs variant selection, the variant picker dialog (§14) opens in place so the user can choose without leaving the Wishlist.
  - If the product is out of stock, Move to Cart is disabled.
  - On success, the item is added to the cart and removed from the wishlist, with confirmation.
- Guest clicking Wishlist (header, card or Product Details): login-required prompt with **Login** and **Cancel**. After login, return to the relevant product and add it to the wishlist.
- Empty wishlist: "**Your wishlist is empty.**" with **Explore Products**.

## 19. Buy Now

Buy Now purchases only the currently selected **product + variants + quantity**, separately from the cart.

```
Product Details → Buy Now → authentication check → Checkout
```

- Guest: Buy Now → Login → return to checkout with the same selection.
- Logged in: Buy Now → Checkout directly.
- Same pre-validation as Add to Cart (variants, quantity, stock).
- Buy Now **does not** add the product to the persistent cart and **does not** change the cart.
- Checkout knows its source: **cart checkout** vs **buy-now checkout**. The pending buy-now selection should survive a refresh during checkout (and the login redirect).
- Placing a buy-now order does not clear or modify the cart.
- Only one pending Buy Now exists at a time. A new Buy Now replaces it. Starting a cart checkout clears it. It is also cleared once the order is placed or the user logs out.
- Opening checkout without a valid pending selection (e.g. a direct visit after the order was placed) falls back to cart checkout.

## 20. Checkout

Requires authentication. Checkout is a single connected flow covering:

1. **Delivery address** — select, add, edit (§21).
2. **Delivery option** — Standard or Express (§22).
3. **Order summary** — items (image, name, variants, quantity, unit price, item total), subtotal, discounts, delivery charge, total.
4. **Payment method** — Cash on Delivery (§23).
5. **Place Order**.

- The layout may be a single page with sections or a step-by-step flow; either way the user can review and change earlier selections before placing the order.
- Checkout opened with an empty cart (cart source) shows an appropriate message and a way back to shopping.
- Checkout cannot proceed without a valid selected address.
- Quantities may be adjusted on the Cart page; checkout shows them read-only (buy-now quantity is changed by going back to the product).

## 21. Addresses

- Persisted in localStorage, associated with the logged-in user.
- Managed from **Checkout** and from **Account › Addresses**.
- The user can: select an existing address (at checkout), add, edit, delete, and set a default address.
- At checkout, the default (or most recently used) address is preselected; if the user has none, the Add Address form is shown.
- Deleting the currently selected checkout address clears the selection. Past orders keep their own copy of the delivery address and are unaffected by later edits/deletion.

Fields and validation:

| Field | Required | Validation |
|---|:---:|---|
| Full Name | ✅ | Non-empty |
| Phone | ✅ | 10-digit Indian mobile number |
| Address Line 1 | ✅ | Non-empty |
| Address Line 2 | ❌ | — |
| City | ✅ | Non-empty |
| State | ✅ | Selected from a list of Indian states/UTs |
| Postal Code | ✅ | 6-digit PIN code |
| Country | ✅ | India (Phase 1 delivers within India only) |

## 22. Delivery

Two options with mock charges. Default values (adjustable):

| Option | Estimated delivery | Charge |
|---|---|---|
| Standard Delivery | 4–6 days | ₹40; **free** when the order value (after discounts) is ₹499 or more |
| Express Delivery | 1–2 days | ₹99 |

- Standard is preselected.
- The selected option is reflected in the order summary and final total, and stored on the order.
- An estimated delivery date range is shown.

## 23. Payment — Cash on Delivery

- **Cash on Delivery is the only payment method in Phase 1.**
- Checkout clearly shows: **Payment Method: Cash on Delivery**.
- No other payment options are shown — no credit/debit card, UPI, wallet, net banking, online gateway, mock card form or mock payment gateway.
- No payment credentials are collected or stored.
- Any authenticated user with a valid address and valid checkout information can place an order with Cash on Delivery.

## 24. Placing an order

### 24.1 Validation before placing

- User is authenticated.
- A valid delivery address is selected.
- Items (cart or buy-now) exist and are not empty.
- Every product and variant still exists.
- Every required variant is selected.
- Every quantity is ≥ 1 and ≤ available stock.
- A delivery option is selected.
- Totals are recalculated from current product data (not trusted from earlier UI state).

If validation fails, the order is not created, and the user sees a specific, customer-friendly message (e.g. "Only 2 units of Aurora Sneakers are available. Please update the quantity.").

### 24.2 Order record

| Field | Notes |
|---|---|
| orderId | Human-readable, unique (e.g. `NIV-2026-000123`) |
| customerId | Logged-in user ID |
| orderDate | Timestamp |
| source | `cart` or `buy_now` |
| items[] | For each: productId, productName, image, selected variants, quantity, unit price, original price, discount, item total — **snapshotted** at order time |
| subtotal | MRP total |
| discount | Total discount |
| deliveryOption | Standard / Express |
| deliveryCharge | |
| total | Final amount payable |
| deliveryAddress | Snapshot of the address |
| paymentMethod | Always `Cash on Delivery` |
| status | Initially `Placed` |
| statusHistory | Status changes with timestamps |

### 24.3 After placing

- Persist the order.
- **Cart checkout:** remove the purchased items from the cart. **Buy-now checkout:** leave the cart unchanged and clear the pending buy-now selection.
- Show an **Order Confirmation** page: Nivora thank-you message, order ID, item summary, total, delivery address, estimated delivery, "Payment: Cash on Delivery", with **View Order Details** and **Continue Shopping**.
- Placing an order must not be possible twice by double-clicking (the button is disabled while processing).
- Refreshing the confirmation page must not create a duplicate order.

### 24.4 Stock changes

- Placing an order **reduces** the available stock of each purchased product/variant by the ordered quantity (decision D5).
- Cancelling an order **restores** that stock.
- Stock adjustments are persisted in localStorage and applied on top of the initial stock in the mock data, so all stock shown across Nivora (listings, Product Details, cart, checkout) reflects them.
- A product/variant whose available stock reaches 0 becomes Out of Stock everywhere.
- Stock is shared across all users on the same browser (it is store inventory, not per-user data).
- Seeded sample orders (§25.5) do not affect stock.

## 25. Orders and order status

### 25.1 Statuses

`Placed` → `Confirmed` → `Shipped` → `Delivered`, or `Cancelled`.

- There is **no automatic status progression** in Phase 1. A newly placed order stays `Placed` until the customer cancels it.
- `Confirmed`, `Shipped` and `Delivered` appear on the seeded sample orders (§25.5), so every status can be displayed.
- `Delivered` and `Cancelled` are final.
- Status progression (simulated or real) can be added later; the order record already keeps a `statusHistory`.

### 25.2 Cancellation

- The customer can cancel an order while it is `Placed` or `Confirmed`, after a confirmation prompt.
- Cancelling sets the status to `Cancelled`, records it in the status history and restores stock (§24.4). No refund flow is needed (Cash on Delivery).
- Returns and refunds are not supported in Phase 1.

### 25.3 Orders page (authenticated)

- Lists the user's orders, newest first, each showing: Order ID, date, product summary (e.g. first item image/name + "and 2 more"), total, payment method (Cash on Delivery), status.
- Clicking an order opens Order Details.
- Empty: "**You haven't placed any orders yet.**" with **Start Shopping**.

### 25.4 Order Details (authenticated, own orders only)

Shows: order ID, date, status (with a simple status timeline), complete item information (image, name, variants, quantity, unit price, original price, discount, item total), subtotal, discounts, delivery option and charge, total, delivery address, payment method "**Cash on Delivery**", and Cancel Order where allowed.

A user must not be able to view another user's order (e.g. by editing the URL); show "order not found" instead.

### 25.5 Seeded sample orders

- The test user (Joseph) starts with **3–4 sample past orders** covering several statuses: e.g. one `Delivered`, one `Shipped`, one `Confirmed` and one `Cancelled`.
- Seeded orders use real products from the mock dataset, and have complete, valid order records (§24.2) with Cash on Delivery and a sample delivery address.
- They are seeded once, together with the test user, and are not re-created after that.
- They are historical: seeding them does not change stock, and cancelling a seeded `Confirmed` order does not restore stock.
- Newly signed-up users start with no orders and see the empty state.

## 26. Profile / Account

Authenticated Account area with navigation to: **Profile**, **Orders**, **Wishlist**, **Addresses**, **Logout**.

Profile fields:

| Field | Editable | Validation |
|---|:---:|---|
| Name | ✅ | Required |
| Email | ❌ (read-only in Phase 1; it is the login identifier) | — |
| Phone | ✅ | Optional; 10-digit Indian mobile number if given |

- Persisted in localStorage for the user.
- Name changes are reflected in the header greeting.
- Password change is not required in Phase 1.

## 27. Logout

- Clears the active session (only the session).
- Redirects to Home.
- The app switches back to Guest mode immediately (header, protected actions, protected pages).
- Protected pages are no longer accessible (including via the browser back button).
- The user's persisted data (account, wishlist, addresses, orders, profile, cart) is **not** deleted and is available again on next login.

## 28. Validation and error handling

All messages must be understandable to ordinary customers. Never show stack traces, raw exception text or technical identifiers. Unexpected errors show a friendly fallback (e.g. "Something went wrong. Please try again.") with a way to recover, and must not leave a blank screen.

| Case | Example message / behavior |
|---|---|
| Invalid login | "Incorrect email or password." |
| Existing signup email | "An account with this email already exists. Try logging in." |
| Password mismatch | "Passwords do not match." |
| Weak password | "Password must be at least 8 characters and include a letter and a number." |
| Missing fields | Inline per field, e.g. "Please enter your email." |
| Invalid email | "Please enter a valid email address." |
| Invalid quantity | Quantity is clamped by the controls; any invalid value shows "Please choose a valid quantity." |
| Required variant not selected | "Please select a size." (names the missing option) |
| Out of stock | "This item is currently out of stock." Purchase actions disabled |
| Insufficient stock | "Only 3 left in stock." |
| Invalid address | Inline per field (e.g. "Please enter a valid 6-digit PIN code.") |
| Checkout without an address | "Please add or select a delivery address." |
| Empty cart checkout | "Your cart is empty." Checkout blocked |
| Invalid product/variant | "This product is no longer available." / product-not-found page |
| Protected feature as guest | Login-required prompt or redirect (§6.1) |

Form behavior: validate on submit and show inline errors next to the relevant fields; move focus to the first invalid field; preserve the user's input on error.

## 29. Empty, loading and other UI states

### 29.1 Empty states

| Where | Message | Action |
|---|---|---|
| Cart | **Your cart is empty.** | **Continue Shopping** |
| Wishlist | **Your wishlist is empty.** | **Explore Products** |
| Search / filtered listing with no results | **No products found.** | **Clear Filters** (and a way back to shopping) |
| Orders | **You haven't placed any orders yet.** | **Start Shopping** |
| Addresses | "You haven't saved any addresses yet." | **Add Address** |

### 29.2 Other required states

- **Loading:** skeletons or spinners while data-layer calls are pending (listing, product details, cart, checkout, orders).
- **Error:** friendly error with retry or a way back.
- **Disabled:** clearly styled disabled buttons (e.g. out of stock, invalid form, placing order).
- **Out of stock:** at product, card and variant level.
- **Confirmation feedback:** toasts/inline messages for add to cart, wishlist add/remove, move to cart, address saved/deleted, profile saved, order placed, order cancelled, logout.

## 30. Responsive behavior

Nivora must work well on **desktop, tablet and mobile**.

- **Desktop:** horizontal main navigation (with subcategory dropdowns); multi-column product grids; persistent filter sidebar on listing pages.
- **Tablet:** fewer grid columns; navigation and filters adapt as space requires.
- **Mobile:**
  - Navigation collapses into a mobile menu (e.g. hamburger → drawer) containing categories, subcategories and account links.
  - Search remains easily accessible.
  - Product grids adapt (e.g. 2 columns).
  - Filters and sorting open in a drawer/modal, with an "Apply"/results count.
  - Product Details is comfortable to use (swipeable or tappable gallery, easily reachable purchase buttons).
  - Cart and Checkout are mobile-friendly (single-column layout, adequate tap targets, clear totals).
- No horizontal page scrolling at any supported width.

## 31. UI/UX quality bar

Nivora should feel like a real, modern e-commerce product:

- Consistent spacing and a clear typography hierarchy.
- Clear primary/secondary buttons and calls to action.
- Reusable cards and components with a consistent look.
- Clear pricing (current, original, discount, savings).
- Good product imagery with consistent aspect ratios.
- Accessible controls: semantic elements, labels for inputs and icon buttons, sufficient color contrast, visible focus states, accessible dialogs/drawers (focus trap, Escape to close).
- Keyboard-friendly interactions where practical (navigation, menus, filters, variant selectors, quantity controls, dialogs).
- Loading, error, empty, disabled and out-of-stock states everywhere they apply (§29).
- Clear confirmation feedback after actions.
- Pages are connected by real flows — every page is reachable from the UI, and every action leads somewhere sensible.

### 31.1 SEO

Nivora must be built to be search-engine friendly, so it can rank and be shared well once it goes live:

- Public shopping pages (Home, categories, subcategories, collections, Product Details, info pages) are delivered as fully rendered HTML, not built only in the browser.
- Each public page has a unique title (`<Page> | Nivora`), meta description, canonical URL and social preview (Open Graph) metadata; product previews show the product's image, name and price.
- Product pages include structured data (product, price in ₹, availability, rating) and breadcrumbs.
- A sitemap and robots rules are provided. Private pages (cart, checkout, account, wishlist, login, signup, order confirmation) and search results are not indexed.
- Filtered/sorted listing URLs point search engines to the unfiltered page (canonical).
- Clean, readable URLs; one main heading per page; descriptive image alt text; good page speed.
- **Phase 1 safety:** because Phase 1 uses mock data, indexing is switched off by default and enabled only when Nivora launches with real data.

## 32. End-to-end user flows

All of the following must work end-to-end.

**Guest shopping**
```
Home → Category → Subcategory → Product Listing → Product Details → Add to Cart → Cart
```
A guest does not need to log in to add products to the cart.

**Wishlist**
```
Product Details → Wishlist → Login (if required) → Wishlist → Move to Cart
```

**Buy Now**
```
Product Details → Buy Now → Login (if required) → Checkout → Address → Delivery
  → Order Summary → Cash on Delivery → Place Order → Order Confirmation → Order Details
```

**Cart checkout**
```
Product Details → Add to Cart → Cart → Proceed to Checkout → Login (if required)
  → Address → Delivery → Order Summary → Cash on Delivery → Place Order
  → Order Confirmation → Order Details
```

**Orders**
```
Profile → Orders → Order Details
```

**Search**
```
Header search → Search Results → Filter / Sort → Product Details
```

**Login-required intent (applies to Wishlist, Buy Now, Checkout and protected pages)**
```
Guest action → Login-required prompt → Login (or Signup) → back to the originating page → intended action completes
                                     ↘ Cancel → stays on the same page, nothing changes
```

**Order cancellation**
```
Account → Orders → Order Details (Placed / Confirmed) → Cancel Order → Confirm → Cancelled, stock restored
```

**Signup / Login / Logout**
```
Signup → (logged in) → … → Logout → Home (guest) → Login → session restored after refresh
```

## 33. Product decisions

Decisions made during requirements review:

| ID | Decision | Outcome |
|---|---|---|
| D1 | Contents of a "More" navigation item | **Removed.** No "More" item in Phase 1; the main navigation is Home + the five categories (§8.2) |
| D2 | Product image source | **External free stock photo URLs**, with placeholder fallback (§15.3) |
| D3 | Brand names in mock data | **Mix**: real brands for some categories (e.g. Mobiles, Home Appliances), fictional brands elsewhere; text only, no logos (§15.1, §15.3) |
| D4 | Guest cart on login/logout | Merge guest cart into the user's cart on login; the user's cart stays with their account on logout (§17.5) |
| D5 | Stock after ordering | **Orders reduce stock and cancellations restore it**, persisted in localStorage (§24.4) |
| D7 | Order status progression | **Not handled in Phase 1.** New orders stay `Placed` unless cancelled (§25.1) |
| D11 | Sample order history | **Seed 3–4 past orders** for the test user across several statuses (§25.5) |

Defaults this document assumes, which can be adjusted at any time:

| ID | Topic | Default |
|---|---|---|
| D6 | Mock delivery charges and free-delivery threshold | §22 values |
| D8 | Beauty and Toys category-specific filters | §12.2 proposals |
| D9 | Password rule | At least 8 characters, with a letter and a number (§7.3) |
| D10 | Delivery country | India only, 6-digit PIN, 10-digit mobile (§21) |
| D12 | Login with a guest cart while heading to checkout | Land on the Cart for review if earlier saved items were merged in; otherwise go straight to checkout (§17.5) |
| D13 | Choosing variants from a card or the Wishlist | Shared variant picker dialog (§14, §18) |
| D14 | Listing price of variant products | Lowest in-stock variant price (§12.3) |

## 34. Phase 1 completion criteria

Phase 1 is complete when all of the following work, as one connected application:

- [ ] Guest can open Nivora (not logged in by default)
- [ ] Home page works
- [ ] Main categories work
- [ ] Fixed subcategories work
- [ ] Search works
- [ ] Filters work (common and category-specific)
- [ ] Sorting works
- [ ] Product Details works
- [ ] Product variants work
- [ ] Add to Cart works
- [ ] Cart survives refresh
- [ ] Cart quantity works
- [ ] Cart removal works
- [ ] Guest wishlist requires login
- [ ] Signup works
- [ ] Login works
- [ ] Login session survives refresh
- [ ] Wishlist works
- [ ] Wishlist persists
- [ ] Wishlist to Cart works
- [ ] Buy Now works
- [ ] Checkout works
- [ ] Address management works
- [ ] Delivery selection works
- [ ] Order summary works
- [ ] Only Cash on Delivery is available
- [ ] Place Order works
- [ ] Order confirmation works
- [ ] Order history works
- [ ] Order Details works
- [ ] Orders display Cash on Delivery
- [ ] Logout works
- [ ] Protected features require authentication
- [ ] Order cancellation works and restores stock
- [ ] Placing an order reduces stock; out-of-stock states show correctly
- [ ] Buy Now does not change the cart
- [ ] Validation, error and empty states behave as specified
- [ ] Responsive on desktop, tablet and mobile
- [ ] No raw localStorage access in UI components
- [ ] Public pages are server-rendered with titles, descriptions, canonical URLs and product structured data (§31.1)

## 35. Explicitly excluded from Phase 1

- Real backend, real APIs
- Database
- Real authentication provider; JWT/session backend
- Real payment gateway; any online payment — cards, UPI, wallets, net banking; mock card forms or mock gateways
- Production payment security
- OTP, real email, real SMS
- Admin dashboard; seller dashboard
- Backend inventory system; real shipping integration; real order processing
- Advanced recommendation engine
- Complex returns/refunds system
- Customer reviews (writing/reading review text), coupons/promo codes
- Additional categories or subcategories beyond §9
- Choosing the backend technology or database

## 36. Phase 2 considerations

Phase 2 will add a real backend in `backend/`, moving from:

```
Mock data + localStorage   →   Frontend → Backend API → Database
```

without rewriting the frontend. The backend is expected eventually to own: authentication, users, products, categories and subcategories, inventory, cart, wishlist, addresses, orders and order status, payment integration, shipping and other business logic.

Phase 1 decisions that keep this path open:

- A single data/persistence layer with an async interface (§5.1); swapping its implementation should not require UI changes.
- Business rules (pricing, stock checks, order creation) kept out of presentational components so they can move server-side; the backend will become the authority for prices, stock and totals.
- Stable IDs for products, variants, categories, users, addresses and orders.
- Order records that snapshot item and address data (§24.2).
- The guest cart + merge-on-login behavior (§17.5) maps naturally to a server-side cart.
- None of this is implemented in Phase 1.

**Phase 2 stack (decided 2026-10-06):** NestJS + TypeScript, Prisma ORM, Neon PostgreSQL. Design: [`docs/backend-architecture.md`](docs/backend-architecture.md).
