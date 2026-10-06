import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collections } from "@/api/server";
import { paths } from "@/config/routes";
import { collectionContext, CrossCategoryListing } from "@/features/catalog/crossCategoryPage";
import { listingCanonical, pageMetadata } from "@/features/seo/metadata";

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<"/collections/[collection]">): Promise<Metadata> {
  const meta = collections.getMeta((await params).collection);
  if (!meta) return {};
  return pageMetadata({
    title: meta.name,
    description: meta.description,
    path: listingCanonical(paths.collection(meta.slug), (await searchParams).page),
  });
}

/** "View All" destinations for Best Sellers, Special Offers and New Arrivals (req §9.1, §10). */
export default async function CollectionPage({
  params,
  searchParams,
}: PageProps<"/collections/[collection]">) {
  const meta = collections.getMeta((await params).collection);
  if (!meta) notFound();
  return (
    <CrossCategoryListing
      title={meta.name}
      description={meta.description}
      basePath={paths.collection(meta.slug)}
      breadcrumbLabel={meta.name}
      context={collectionContext(meta)}
      searchParams={await searchParams}
    />
  );
}
