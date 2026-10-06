import type { Metadata } from "next";
import { catalog } from "@/api/server";
import { HOME_SECTION_LIMIT } from "@nivora/shared/config/constants";
import { paths } from "@/config/routes";
import { siteConfig } from "@/config/site";
import { HeroBanner } from "@/features/catalog/components/HeroBanner";
import { ProductSection } from "@/features/catalog/components/ProductSection";
import { JsonLd } from "@/features/seo/JsonLd";
import { pageMetadata } from "@/features/seo/metadata";
import { organizationLd, websiteLd } from "@/features/seo/structuredData";

export const metadata: Metadata = pageMetadata({
  description: siteConfig.description,
  path: paths.home(),
});

/** Home: discovery and promotions, not the whole catalog (requirements §10). */
export default async function HomePage() {
  const [bestSellers, specialOffers, newArrivals] = await Promise.all([
    catalog.getCollection("best-sellers", HOME_SECTION_LIMIT),
    catalog.getCollection("special-offers", HOME_SECTION_LIMIT),
    catalog.getCollection("new-arrivals", HOME_SECTION_LIMIT),
  ]);

  return (
    <>
      <JsonLd data={[organizationLd(), websiteLd()]} />
      <HeroBanner showcase={newArrivals.filter((product) => product.inStock)} />
      <ProductSection
        id="best-sellers"
        title="Best Sellers"
        subtitle="The products Nivora customers love most."
        viewAllHref={paths.collection("best-sellers")}
        products={bestSellers}
      />
      <ProductSection
        id="special-offers"
        title="Special Offers"
        subtitle="Big savings across every category."
        viewAllHref={paths.collection("special-offers")}
        products={specialOffers}
      />
      <ProductSection
        id="new-arrivals"
        title="New Arrivals"
        subtitle="Fresh additions, newest first."
        viewAllHref={paths.collection("new-arrivals")}
        products={newArrivals}
      />
    </>
  );
}
