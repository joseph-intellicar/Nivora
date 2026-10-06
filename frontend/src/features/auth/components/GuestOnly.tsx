"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { paths } from "@/config/routes";
import { useSession } from "../hooks/useSession";
import { AuthCardSkeleton } from "./AuthCard";

/**
 * Login/Signup are for guests (arch §9.3). A customer who arrives already logged in is sent on;
 * a guest who logs in here is navigated by the login flow itself (so intents can resume).
 */
export function GuestOnly({
  from,
  title,
  children,
}: {
  from: string | null;
  title: string;
  children: ReactNode;
}) {
  const { isAuthenticated, isLoading } = useSession();
  const router = useRouter();
  // Session state when the page first finished loading; later changes (logging in here) don't count.
  const [arrivedAuthenticated, setArrivedAuthenticated] = useState<boolean | null>(null);
  if (!isLoading && arrivedAuthenticated === null) setArrivedAuthenticated(isAuthenticated);

  useEffect(() => {
    if (arrivedAuthenticated) router.replace(from ?? paths.home());
  }, [arrivedAuthenticated, from, router]);

  if (arrivedAuthenticated !== false) return <AuthCardSkeleton title={title} />;
  return children;
}
