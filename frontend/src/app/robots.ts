import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { absoluteUrl } from "@/features/seo/metadata";

/**
 * Crawl rules (arch §10.3). Phase 1 safety switch: unless NEXT_PUBLIC_ALLOW_INDEXING=true,
 * everything is disallowed so mock data never gets indexed.
 */
export default function robots(): MetadataRoute.Robots {
  if (!siteConfig.allowIndexing) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/cart",
        "/checkout",
        "/account",
        "/wishlist",
        "/login",
        "/signup",
        "/order-confirmation",
        "/search",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
