import { notFound } from "next/navigation";
import { catalog } from "@/api/server";
import { paths } from "@/config/routes";
import type { Category, Subcategory } from "@/domain/types";
import { ProductListing } from "./components/ProductListing";
import { SubcategoryNav } from "./components/SubcategoryNav";
import { CATEGORY_FILTERS } from "./filterConfig";
import { parseListingParams, type RawSearchParams } from "./listingParams";

/** Category/subcategory for metadata; null when unknown (metadata must not throw notFound). */
export async function findCategory(
  categorySlug: string,
  subcategorySlug?: string,
): Promise<{ category: Category; subcategory: Subcategory | null } | null> {
  const category = (await catalog.getCategories()).find((item) => item.slug === categorySlug);
  if (!category) return null;
  if (subcategorySlug === undefined) return { category, subcategory: null };
  const subcategory = category.subcategories.find((item) => item.slug === subcategorySlug);
  return subcategory ? { category, subcategory } : null;
}

/** Resolves category/subcategory slugs for the page; unknown slugs 404 before any rendering (arch §9.2). */
export async function resolveCategory(
  categorySlug: string,
  subcategorySlug?: string,
): Promise<{ category: Category; subcategory: Subcategory | null }> {
  const category = (await catalog.getCategories()).find((item) => item.slug === categorySlug);
  if (!category) notFound();
  if (subcategorySlug === undefined) return { category, subcategory: null };
  const subcategory = category.subcategories.find((item) => item.slug === subcategorySlug);
  if (!subcategory) notFound();
  return { category, subcategory };
}

/** Category and subcategory listing pages (requirements §11, §12). */
export async function CategoryListingPage({
  category,
  subcategory,
  searchParams,
}: {
  category: Category;
  subcategory: Subcategory | null;
  searchParams: RawSearchParams;
}) {
  const context = {
    categoryId: category.id,
    ...(subcategory ? { subcategoryId: subcategory.id } : {}),
  };
  const query = parseListingParams(searchParams, context);
  const result = await catalog.listProducts(query);
  const basePath = subcategory
    ? paths.subcategory(category.slug, subcategory.slug)
    : paths.category(category.slug);

  return (
    <ProductListing
      title={subcategory ? `${subcategory.name} · ${category.name}` : category.name}
      description={category.description}
      breadcrumbs={[
        { label: "Home", href: paths.home() },
        { label: category.name, href: paths.category(category.slug) },
        ...(subcategory ? [{ label: subcategory.name }] : []),
      ]}
      basePath={basePath}
      query={query}
      context={context}
      result={result}
      filterKeys={CATEGORY_FILTERS[category.id]}
      subNav={
        <SubcategoryNav
          category={category}
          activeId={subcategory?.id ?? null}
          counts={result.facets.subcategories}
        />
      }
    />
  );
}
