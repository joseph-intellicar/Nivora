"use client";

import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import { paths } from "@/config/routes";
import { useAuthFlowStore } from "@/stores/loginPromptStore";
import { useSession } from "../hooks/useSession";

/**
 * Protects customer pages (arch §9.3). The session lives in the browser in Phase 1, so this
 * runs client-side: skeleton while loading, redirect guests to Login with a return path.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useSession();
  const leaving = useAuthFlowStore((state) => state.leaving);
  const router = useRouter();

  useEffect(() => {
    if (isLoading || isAuthenticated || leaving) return;
    const current = window.location.pathname + window.location.search;
    router.replace(paths.login(current));
  }, [isLoading, isAuthenticated, leaving, router]);

  if (isLoading || !isAuthenticated) return <PageSkeleton />;
  return children;
}
