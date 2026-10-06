/** Business constants for Phase 1 (requirements §12, §22; decision D6). Amounts are whole rupees. */

export const DELIVERY = {
  standard: {
    label: "Standard Delivery",
    charge: 40,
    /** Standard delivery is free when the order value after discounts is at least this amount. */
    freeThreshold: 499,
    estimatedDays: { min: 4, max: 6 },
  },
  express: {
    label: "Express Delivery",
    charge: 99,
    estimatedDays: { min: 1, max: 2 },
  },
} as const;

export const PAYMENT_METHOD = "Cash on Delivery" as const;

/** Products per page on listing and search pages. */
export const PAGE_SIZE = 24;

/** Products shown in each Home page section (Best Sellers, Special Offers, New Arrivals). */
export const HOME_SECTION_LIMIT = 10;

/** Stock at or below this level shows "Only N left". */
export const LOW_STOCK_THRESHOLD = 3;
