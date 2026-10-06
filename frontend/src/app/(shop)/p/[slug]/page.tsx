import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { catalog } from "@/api/server";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Rating } from "@/components/ui/Rating";
import { paths } from "@/config/routes";
import { ImageGallery } from "@/features/product/components/ImageGallery";
import { PurchasePanel } from "@/features/product/components/PurchasePanel";
import { Specifications } from "@/features/product/components/Specifications";
import { JsonLd } from "@/features/seo/JsonLd";
import { pageMetadata } from "@/features/seo/metadata";
import { breadcrumbLd, productLd } from "@/features/seo/structuredData";

/** Every product page is built at build time; unknown slugs are a static 404 (arch §9.2). */
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await catalog.getAllProductSlugs()).map((slug) => ({ slug }));
}

async function load(slug: string) {
  const product = await catalog.getProduct(slug);
  if (!product) return null;
  const category = (await catalog.getCategories()).find((item) => item.id === product.categoryId)!;
  const subcategory = category.subcategories.find((item) => item.id === product.subcategoryId)!;
  return { product, category, subcategory };
}

export async function generateMetadata({ params }: PageProps<"/p/[slug]">): Promise<Metadata> {
  const data = await load((await params).slug);
  if (!data) return {};
  const { product } = data;
  return pageMetadata({
    title: product.name,
    description:
      product.description.length > 155
        ? `${product.description.slice(0, 152)}…`
        : product.description,
    path: paths.product(product.slug),
    image: { url: product.images[0], alt: product.name },
  });
}

/**
 * Product Details (requirements §16). Tablet/desktop: gallery on the left (stays in view while
 * scrolling), details on the right. Phones: gallery first, then details.
 */
export default async function ProductPage({ params }: PageProps<"/p/[slug]">) {
  const data = await load((await params).slug);
  if (!data) notFound();
  const { product, category, subcategory } = data;
  const crumbs = [
    { label: "Home", href: paths.home() },
    { label: category.name, href: paths.category(category.slug) },
    { label: subcategory.name, href: paths.subcategory(category.slug, subcategory.slug) },
    { label: product.name },
  ];

  return (
    <Container className="py-6 pb-28 sm:py-8 md:pb-10">
      <JsonLd data={[productLd(product), breadcrumbLd(crumbs, paths.product(product.slug))]} />
      <Breadcrumbs items={crumbs} />
      <div className="mt-5 grid gap-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-12">
        <div className="md:sticky md:top-24 md:self-start lg:top-32">
          <ImageGallery images={product.images} alt={product.name} />
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          <header className="flex flex-col gap-2 border-b border-line pb-5">
            <p className="text-sm font-bold tracking-wide text-brand-700 uppercase">
              {product.brand}
            </p>
            <h1 className="text-2xl leading-tight font-extrabold tracking-tight text-ink sm:text-3xl">
              {product.name}
            </h1>
            <div className="inline-flex self-start rounded-full bg-surface px-3 py-1 ring-1 ring-line">
              <Rating value={product.rating} reviewCount={product.reviewCount} size="md" />
            </div>
          </header>
          <PurchasePanel product={product} />
          <section aria-labelledby="description-heading" className="border-t border-line pt-6">
            <h2 id="description-heading" className="text-lg font-bold text-ink">
              Product details
            </h2>
            <p className="mt-3 leading-7 text-ink-muted">{product.description}</p>
          </section>
          <Specifications specifications={product.specifications} />
        </div>
      </div>
    </Container>
  );
}
