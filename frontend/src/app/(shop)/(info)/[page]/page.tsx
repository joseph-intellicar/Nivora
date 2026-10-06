import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { content } from "@/api/server";
import { Container } from "@/components/layout/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { INFO_PAGES } from "@nivora/shared/config/infoPages";
import { paths } from "@/config/routes";
import { pageMetadata } from "@/features/seo/metadata";

// Only the six footer pages exist; any other single-segment URL is a static 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return INFO_PAGES.map(({ slug }) => ({ page: slug }));
}

export async function generateMetadata({ params }: PageProps<"/[page]">): Promise<Metadata> {
  const page = await content.getInfoPage((await params).page);
  return page
    ? pageMetadata({ title: page.title, description: page.summary, path: `/${page.slug}` })
    : {};
}

/** About, Contact, Help, Returns, Privacy, Terms (requirements §8.3). */
export default async function InfoPage({ params }: PageProps<"/[page]">) {
  const page = await content.getInfoPage((await params).page);
  if (!page) notFound();
  return (
    <Container className="max-w-3xl py-8 sm:py-12">
      <Breadcrumbs items={[{ label: "Home", href: paths.home() }, { label: page.title }]} />
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-ink">{page.title}</h1>
      <p className="mt-3 text-lg text-ink-muted">{page.summary}</p>
      <div className="mt-8 flex flex-col gap-6">
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl font-bold text-ink">{section.heading}</h2>
            <p className="mt-2 leading-7 text-ink-muted">{section.body}</p>
          </section>
        ))}
      </div>
      <nav aria-label="More information" className="mt-10 border-t border-line pt-6">
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
          {INFO_PAGES.filter((item) => item.slug !== page.slug).map((item) => (
            <li key={item.slug}>
              <Link href={paths.info(item.slug)} className="text-brand-700 hover:underline">
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
}
