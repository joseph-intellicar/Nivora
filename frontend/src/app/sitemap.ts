import type { MetadataRoute } from "next";
import { catalog, collections } from "@/api/server";
import { INFO_PAGES } from "@nivora/shared/config/infoPages";
import { paths } from "@/config/routes";
import { absoluteUrl } from "@/features/seo/metadata";

/** All public, indexable pages (arch §10.3). Private pages and search are excluded. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, slugs] = await Promise.all([
    catalog.getCategories(),
    catalog.getAllProductSlugs(),
  ]);
  const entry = (
    path: string,
    priority: number,
    changeFrequency: "daily" | "weekly" | "monthly",
  ) => ({
    url: absoluteUrl(path),
    changeFrequency,
    priority,
  });
  return [
    entry(paths.home(), 1, "daily"),
    ...categories.map((category) => entry(paths.category(category.slug), 0.9, "daily")),
    ...categories.flatMap((category) =>
      category.subcategories.map((sub) =>
        entry(paths.subcategory(category.slug, sub.slug), 0.8, "daily"),
      ),
    ),
    ...(["best-sellers", "special-offers", "new-arrivals"] as const)
      .filter((id) => collections.getMeta(id))
      .map((id) => entry(paths.collection(id), 0.7, "daily")),
    ...slugs.map((slug) => entry(paths.product(slug), 0.6, "weekly")),
    ...INFO_PAGES.map((page) => entry(paths.info(page.slug), 0.3, "monthly")),
  ];
}
