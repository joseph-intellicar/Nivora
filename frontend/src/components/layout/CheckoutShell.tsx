import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronLeftIcon } from "@/components/icons";
import { paths } from "@/config/routes";
import { Container } from "./Container";
import { Logo } from "./Logo";
import { SkipLink } from "./SkipLink";

/** Simplified frame for checkout and order confirmation (arch §9.1). */
export function CheckoutShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SkipLink />
      <header className="border-b border-line bg-surface">
        <Container className="flex h-16 items-center justify-between gap-4">
          <Link href={paths.home()} aria-label="Nivora home" className="rounded-control">
            <Logo />
          </Link>
          <Link
            href={paths.cart()}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand-800 hover:underline"
          >
            <ChevronLeftIcon className="size-4" />
            Back to cart
          </Link>
        </Container>
      </header>
      <main id="content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <footer className="border-t border-line bg-surface">
        <Container className="py-5 text-xs text-ink-subtle">
          © {new Date().getFullYear()} Nivora · Payment: Cash on Delivery
        </Container>
      </footer>
    </div>
  );
}
