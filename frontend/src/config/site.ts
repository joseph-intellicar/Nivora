/**
 * Site-wide configuration read from environment variables (see `.env.example`).
 *
 * `NEXT_PUBLIC_*` variables are inlined at build time, so each one must be read
 * with a literal `process.env.NEXT_PUBLIC_...` reference.
 */

export type DataSource = "mock";

function parseLatency(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 250;
}

function parseDataSource(value: string | undefined): DataSource {
  // Phase 1 only implements the mock data layer.
  return value === "mock" ? value : "mock";
}

function parseSiteUrl(value: string | undefined): string {
  const fallback = "http://localhost:3000";
  if (!value) return fallback;
  try {
    return new URL(value).origin;
  } catch {
    return fallback;
  }
}

export const siteConfig = {
  name: "Nivora",
  defaultTitle: "Nivora — Online Shopping",
  description:
    "Shop fashion, home appliances, beauty, toys and mobiles at Nivora. Great prices and Cash on Delivery on every order.",
  url: parseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL),
  dataSource: parseDataSource(process.env.NEXT_PUBLIC_DATA_SOURCE),
  mockLatencyMs: parseLatency(process.env.NEXT_PUBLIC_MOCK_LATENCY_MS),
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true",
} as const;
