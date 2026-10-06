import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { buttonClasses } from "@/components/ui/Button";
import { ProductImage } from "@/components/ui/ProductImage";
import { paths } from "@/config/routes";
import type { ProductSummary } from "@nivora/shared/domain/types";

/** Home promotional banner (requirements §10): headline, supporting text, CTA and a visual. */
export function HeroBanner({ showcase }: { showcase: ProductSummary[] }) {
  return (
    <section aria-labelledby="hero-heading" className="bg-brand-950 text-white">
      <Container className="grid items-center gap-8 py-10 md:grid-cols-2 md:py-16">
        <div>
          <p className="inline-flex rounded-full bg-accent-500/20 px-3 py-1 text-xs font-bold tracking-wide text-accent-200 uppercase">
            Festive Sale is live
          </p>
          <h1
            id="hero-heading"
            className="mt-4 text-3xl leading-tight font-extrabold tracking-tight sm:text-5xl"
          >
            Everything you love, at prices you&apos;ll love more.
          </h1>
          <p className="mt-4 max-w-lg text-brand-100">
            Up to 50% off fashion, phones, appliances, beauty and toys. Free Standard Delivery on
            orders of ₹499 or more, and Cash on Delivery on every order.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href={paths.collection("special-offers")}
              className={buttonClasses({
                size: "lg",
                className: "bg-accent-600 hover:bg-accent-700",
              })}
            >
              Shop Now
            </Link>
            <Link
              href={paths.collection("new-arrivals")}
              className={buttonClasses({
                size: "lg",
                variant: "ghost",
                className: "text-white ring-1 ring-white/40 hover:bg-white/10",
              })}
            >
              See New Arrivals
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3" aria-hidden="true">
          {showcase.slice(0, 3).map((product, index) => (
            <div key={product.id} className={index === 1 ? "translate-y-6" : undefined}>
              <ProductImage
                src={product.image}
                alt=""
                sizes="(min-width: 768px) 16vw, 30vw"
                aspect="portrait"
                priority
                className="rounded-card ring-1 ring-white/10"
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
