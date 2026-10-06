"use client";

import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { ErrorState } from "@/components/ui/ErrorState";
import { paths } from "@/config/routes";
import { Container } from "./Container";

/** Body of route error boundaries: friendly message, Retry and a link home (arch §16). */
export function RouteErrorView({ retry }: { retry: () => void }) {
  return (
    <Container className="py-8">
      <ErrorState
        onRetry={retry}
        action={
          <Link href={paths.home()} className={buttonClasses({ variant: "secondary" })}>
            Go to Home
          </Link>
        }
      />
    </Container>
  );
}
