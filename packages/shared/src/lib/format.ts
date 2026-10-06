/**
 * Display formatting for India (₹, en-IN digit grouping). Dates use a fixed time zone so
 * server-rendered and browser-rendered text match (no hydration mismatches).
 */

const LOCALE = "en-IN";
const TIME_ZONE = "Asia/Kolkata";

const priceFormatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const countFormatter = new Intl.NumberFormat(LOCALE);

const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: TIME_ZONE,
});

const dateTimeFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: TIME_ZONE,
});

/** Whole rupees → "₹1,24,999". */
export function formatPrice(amount: number): string {
  return priceFormatter.format(amount);
}

/** 12345 → "12,345". */
export function formatCount(value: number): string {
  return countFormatter.format(value);
}

/** ISO date → "6 Oct 2026". */
export function formatDate(value: string | Date): string {
  return dateFormatter.format(typeof value === "string" ? new Date(value) : value);
}

/** ISO date → "6 Oct 2026, 4:05 pm". */
export function formatDateTime(value: string | Date): string {
  return dateTimeFormatter.format(typeof value === "string" ? new Date(value) : value);
}
