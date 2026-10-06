import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

const DEFAULT_IMAGE = { url: "/og/nivora-default.png", width: 1200, height: 630, alt: "Nivora" };

/**
 * Metadata for a public page (arch §10.1): title, description, canonical URL and social
 * previews. Next.js merges `openGraph` shallowly, so the defaults are repeated here.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title?: string;
  description: string;
  /** Canonical path (filters stripped; page number kept for paginated listings). */
  path: string;
  image?: { url: string; alt: string };
}): Metadata {
  const images = image ? [{ url: image.url, alt: image.alt }] : [DEFAULT_IMAGE];
  const socialTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.defaultTitle;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: "en_IN",
      title: socialTitle,
      description,
      url: path,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: images.map((i) => i.url),
    },
  };
}

/** Canonical path for a listing: the unfiltered path, plus ?page=n beyond page 1 (arch §10.3). */
export function listingCanonical(
  basePath: string,
  pageParam: string | string[] | undefined,
): string {
  const raw = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const page = raw && /^\d+$/.test(raw) ? Number(raw) : 1;
  return page > 1 ? `${basePath}?page=${page}` : basePath;
}

export const absoluteUrl = (path: string) => new URL(path, siteConfig.url).toString();
