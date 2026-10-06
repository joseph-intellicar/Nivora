import type { Metadata } from "next";
import { paths } from "@/config/routes";
import {
  CategoryListingPage,
  findCategory,
  resolveCategory,
} from "@/features/catalog/categoryPage";
import { listingCanonical, pageMetadata } from "@/features/seo/metadata";

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<"/c/[category]">): Promise<Metadata> {
  const found = await findCategory((await params).category);
  if (!found) return {};
  const { category } = found;
  return pageMetadata({
    title: category.name,
    description: category.description,
    path: listingCanonical(paths.category(category.slug), (await searchParams).page),
  });
}

export default async function CategoryPage({ params, searchParams }: PageProps<"/c/[category]">) {
  const { category } = await resolveCategory((await params).category);
  return (
    <CategoryListingPage category={category} subcategory={null} searchParams={await searchParams} />
  );
}
