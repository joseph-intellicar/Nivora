# Nivora — Manual Browser Checklist (Phase 1)

Interactive checks that need a real browser. Claude runs everything that can be checked with HTTP requests and scripts (see the verification logs in [`../tasks.md`](../tasks.md)); this list covers the rest.

**Setup**

1. In `frontend/`, run `npm run dev` and open http://localhost:3000.
2. Start from fresh storage: DevTools → Application → Local storage → `http://localhost:3000` → clear all keys starting with `nivora:`. Then reload.
3. Test account: **joseph@example.com / password123**. Joseph has 4 sample orders.
4. Screen sizes: DevTools device toolbar at **375px** (phone), **768px** (tablet) and **1280px** (desktop).

Mark each line ✅ or ❌, and note anything odd.

---

## A. Discovery (TASK-057)

- [ ] Fresh storage: the header shows **Login** and the cart has no count.
- [ ] Desktop: hover **and** Tab into "Fashion"; the subcategory flyout opens; Tab reaches "Men"; Enter opens `/c/fashion/men`.
- [ ] Phone (375px): ☰ opens the menu; expand Fashion; tap Men; the drawer closes and the page loads.
- [ ] Home → Fashion → Men → any product: breadcrumb, gallery, price, Add to Cart and Buy Now are visible.
- [ ] Sort by Price: Low to High; the grid dims briefly, then updates; the URL gains `sort=price-asc`.
- [ ] Page 2 → Back returns to page 1.
- [ ] Filters (desktop sidebar): tick a brand and a size → chips appear → remove one chip → Clear all.
- [ ] Filters (phone): **Filters** button → drawer → tick a filter → "Show N products" closes it; the results match.
- [ ] Refresh a filtered URL: the same filters and results come back.
- [ ] Header search "phone" → results; tick Category = Mobiles → RAM/Storage filters appear → open a product.
- [ ] Search "zzqxy" → **No products found.** with Continue Shopping.
- [ ] Open `/c/unknown`, `/p/unknown` and `/xyz` → the Nivora "We couldn't find that page." page each time.

## B. Product details, cart, wishlist and authentication (TASK-058)

- [ ] Product with sizes (e.g. Urbano Classic Oxford Shirt): Add to Cart without a size → "Please select a size."
- [ ] White / XXL is shown as unavailable (struck through, can't be picked).
- [ ] Sky Blue / S shows "Only 2 left"; + stops at 2; − stops at 1.
- [ ] Samsung Galaxy S24 Ultra: choosing 512 GB changes the price to ₹1,39,999.
- [ ] realme Narzo 70 Pro 5G: "Out of Stock"; Add to Cart and Buy Now are disabled.
- [ ] Add to Cart → toast "Added to cart" with View Cart; the header count rises; you stay on the page.
- [ ] Add the same size again → the cart still has one line with quantity 2; another colour → a new line.
- [ ] Card on Home: a simple product (e.g. a charger) adds directly; a sized product opens the **variant picker** (Tab stays inside; Escape closes).
- [ ] Refresh: the cart count is unchanged.
- [ ] As a guest, click a card's ♡ → "Login required" dialog → **Cancel** → nothing changes.
- [ ] Again ♡ → **Login** → log in as Joseph → you're back on the same listing with ♡ filled.
- [ ] Header ♡ as a guest → dialog → Login → you land on **/wishlist**.
- [ ] Wishlist: **Move to Cart** on a simple product → it leaves the wishlist and appears in the cart.
- [ ] Wishlist: Move to Cart on a sized product → the picker opens in "Move to Cart" mode.
- [ ] Log out (account menu) → Home as a guest; DevTools still shows the `nivora:v1:wishlist`, `addresses` and `orders` keys.
- [ ] Guest: add 1 item → Cart → **Proceed to Checkout** → Login → if Joseph had saved items, you land on **/cart** with the "We've added items saved from your last visit" banner, otherwise straight on **/checkout**.
- [ ] Signup: mismatched passwords, a weak password and joseph@example.com each show their message; a valid signup logs you in.

## C. Purchase and orders (TASK-059)

- [ ] Logged in, product page → **Buy Now** → checkout shows only that item, labelled Buy Now; the header cart count is unchanged.
- [ ] As a guest, **Buy Now** → Login → you land on checkout with the same item and quantity.
- [ ] Checkout with no saved address: the add form shows inline; try PIN `000000` and phone `12345` (error messages), then save a valid address.
- [ ] Add a second address, edit it, set it as default, delete one (the confirmation dialog appears).
- [ ] Standard ↔ Express: the total changes (Express is ₹99; Standard is free from ₹499 after discounts, else ₹40).
- [ ] Payment shows only **Cash on Delivery**, with nothing to fill in.
- [ ] **Place Order** (try double-clicking) → exactly one order → the confirmation page with order ID, delivery estimate and "Payment: Cash on Delivery".
- [ ] Refresh the confirmation page → still the same single order in Account → Orders.
- [ ] Cart checkout: the purchased items are gone from the cart afterwards.
- [ ] Account → Orders: Joseph's 4 sample orders plus new ones, newest first, each showing Cash on Delivery.
- [ ] Open an order: status timeline, items, address and payment summary.
- [ ] Open the product you just bought: "Only N left" shows one fewer.
- [ ] Cancel the new order (confirmation dialog) → status Cancelled → the product's stock is back up.
- [ ] Delivered and Shipped sample orders have **no** Cancel button.
- [ ] Profile: change the name → the header greeting updates and survives a refresh; phone `123` is rejected; the email can't be edited.

## D. Protected routes and responsive layout (TASK-060)

- [ ] As a guest, visit `/account`, `/account/orders`, `/account/addresses`, `/wishlist` and `/checkout` → each redirects to Login with "Please log in to continue." and returns there after login.
- [ ] Logged in, visit `/login` → you're redirected away.
- [ ] Log out from an account page → Home; press **Back** → you're sent to Login, not shown the account page.
- [ ] At 375px, 768px and 1280px, these pages have **no sideways scrolling** and every control is reachable: Home, a category with filters, a product (sticky purchase bar on phones), Cart (sticky checkout bar), Checkout (sticky Place Order bar), Orders, Order Details, Profile, Login.

## E. Final quality checks (Stage 13)

- [ ] **Keyboard only:** complete a purchase from Home using only Tab, Shift+Tab, Enter, Space and arrow keys. Focus should always be visible, dialogs should trap focus, and Escape should close them.
- [ ] **Screen reader spot check** (optional): product cards announce name, rating and price; the cart icon announces the item count; toasts are announced.
- [ ] Optional: Chrome DevTools → Lighthouse → Accessibility, SEO and Performance on Home and a product page (record the scores).
- [ ] **Slow loading:** set `NEXT_PUBLIC_MOCK_LATENCY_MS=1500` in `frontend/.env` and restart `npm run dev`. The cart, wishlist, checkout, orders and the account pages should show loading skeletons (not blank screens). Set it back to `250` afterwards.

---

When you've worked through a section, tell Claude which lines passed or failed so `tasks.md` can be updated ("Manual: ✅ <date>").
