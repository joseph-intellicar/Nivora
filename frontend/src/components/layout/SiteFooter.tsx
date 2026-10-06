import Link from "next/link";
import { INFO_PAGES, type InfoPageSlug } from "@nivora/shared/config/infoPages";
import { paths } from "@/config/routes";
import { Container } from "./Container";
import { Logo } from "./Logo";

const titleOf = (slug: InfoPageSlug) => INFO_PAGES.find((page) => page.slug === slug)!.title;

const GROUPS: Array<{ heading: string; links: InfoPageSlug[] }> = [
  { heading: "Nivora", links: ["about", "contact"] },
  { heading: "Customer care", links: ["help", "returns"] },
  { heading: "Policies", links: ["privacy", "terms"] },
];

/** Shop footer (requirements §8.3). */
export function SiteFooter() {
  return (
    <footer className="mt-16 bg-brand-950 text-brand-100">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo tone="inverse" />
          <p className="mt-3 max-w-xs text-sm text-brand-200">
            Fashion, home appliances, beauty, toys and mobiles, delivered across India with Cash on
            Delivery.
          </p>
        </div>
        {GROUPS.map((group) => (
          <nav key={group.heading} aria-label={group.heading}>
            <h2 className="text-sm font-bold tracking-wide text-white uppercase">
              {group.heading}
            </h2>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {group.links.map((slug) => (
                <li key={slug}>
                  <Link href={paths.info(slug)} className="hover:text-white hover:underline">
                    {titleOf(slug)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>
      <div className="border-t border-brand-900">
        <Container className="flex flex-col gap-1 py-5 text-xs text-brand-200 sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Nivora. All rights reserved.</p>
          <p>Cash on Delivery on every order.</p>
        </Container>
      </div>
    </footer>
  );
}
