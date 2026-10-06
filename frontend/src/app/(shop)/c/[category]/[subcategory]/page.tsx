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
}: PageProps<"/c/[category]/[subcategory]">): Promise<Metadata> {
  const { category: c, subcategory: s } = await params;
  const found = await findCategory(c, s);
  if (!found?.subcategory) return {};
  const { category, subcategory } = found;
  return pageMetadata({
    title: `${subcategory.name} · ${category.name}`,
    description: `Shop ${subcategory.name.toLowerCase()} in ${category.name} at Nivora. ${category.description}`,
    path: listingCanonical(
      paths.subcategory(category.slug, subcategory.slug),
      (await searchParams).page,
    ),
  });
}

export default async function SubcategoryPage({
  params,
  searchParams,
}: PageProps<"/c/[category]/[subcategory]">) {
  const { category: c, subcategory: s } = await params;
  const { category, subcategory } = await resolveCategory(c, s);
  return (
    <CategoryListingPage
      category={category}
      subcategory={subcategory}
      searchParams={await searchParams}
    />
  );
}
