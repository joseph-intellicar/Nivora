"use client";

import { RouteErrorView } from "@/components/layout/RouteErrorView";

export default function RouteError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return <RouteErrorView retry={retry} />;
}
