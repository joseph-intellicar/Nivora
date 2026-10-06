import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { paths } from "@/config/routes";
import { CrossCategoryListing } from "@/features/catalog/crossCategoryPage";

const queryOf = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value)?.trim() ?? "";

export async function generateMetadata({ searchParams }: PageProps<"/search">): Promise<Metadata> {
  const q = queryOf((await searchParams).q);
  return { title: q ? `Results for “${q}”` : "Search", robots: { index: false, follow: true } };
}

/** Search results (requirements §13). Empty queries go back Home. */
export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const params = await searchParams;
  const q = queryOf(params.q);
  if (!q) redirect(paths.home());
  return (
    <CrossCategoryListing
      title={`Results for “${q}”`}
      basePath={paths.search()}
      breadcrumbLabel="Search"
      context={{}}
      searchParams={params}
    />
  );
}
