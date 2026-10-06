import type { ReactNode } from "react";
import { Container } from "@/components/layout/Container";
import { LogoMark } from "@/components/layout/Logo";

/** Centered card layout for Login and Signup. */
export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <Container className="flex justify-center py-10 sm:py-16">
      <div className="w-full max-w-md rounded-card bg-surface p-6 shadow-card sm:p-8">
        <LogoMark className="mb-5 size-10" />
        <h1 className="text-2xl font-extrabold tracking-tight text-ink">{title}</h1>
        <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
    </Container>
  );
}

/** Loading placeholder; keeps the page heading in the HTML for screen readers. */
export function AuthCardSkeleton({ title }: { title?: string }) {
  return (
    <Container className="flex justify-center py-10 sm:py-16">
      {title ? <h1 className="sr-only">{title}</h1> : null}
      <div
        className="h-96 w-full max-w-md animate-pulse rounded-card bg-surface shadow-card"
        aria-hidden="true"
      />
    </Container>
  );
}
