import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import { Container } from "@/components/layout/Container";
import type { ProductSummary } from "@/domain/types";
import { ProductCard } from "./ProductCard";
import { ProductGrid, ProductGridItem } from "./ProductGrid";
import type { ReactNode } from "react";

type ProductSectionProps = {
  id: string;
  title: string;
  subtitle?: string;
  viewAllHref: string;
  products: ProductSummary[];
  /** Renders card actions (client islands) for a product. */
  renderActions?: (product: ProductSummary) => { actions?: ReactNode; overlayAction?: ReactNode };
};

/** A Home row of product cards with a View All link (requirements §10). */
export function ProductSection({
  id,
  title,
  subtitle,
  viewAllHref,
  products,
  renderActions,
}: ProductSectionProps) {
  if (products.length === 0) return null;
  return (
    <section aria-labelledby={id} className="py-8 sm:py-10">
      <Container>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 id={id} className="text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
              {title}
            </h2>
            {subtitle ? <p className="mt-1 text-sm text-ink-muted">{subtitle}</p> : null}
          </div>
          <Link
            href={viewAllHref}
            className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:underline"
          >
            View All <span className="sr-only">{title}</span>
            <ChevronRightIcon className="size-4" />
          </Link>
        </div>
        <ProductGrid>
          {products.map((product) => (
            <ProductGridItem key={product.id}>
              <ProductCard product={product} {...renderActions?.(product)} />
            </ProductGridItem>
          ))}
        </ProductGrid>
      </Container>
    </section>
  );
}
