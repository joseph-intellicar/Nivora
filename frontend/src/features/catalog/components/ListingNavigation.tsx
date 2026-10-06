"use client";

import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useTransition, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type ListingNavigation = {
  /** Navigate to this listing with a new search string, inside a transition (arch §11.3). */
  go: (search: string, options?: { replace?: boolean }) => void;
  isPending: boolean;
};

const Context = createContext<ListingNavigation | null>(null);

export function ListingNavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const go: ListingNavigation["go"] = (search, options) => {
    const url = search ? `${pathname}?${search}` : pathname;
    startTransition(() => {
      if (options?.replace) router.replace(url, { scroll: false });
      else router.push(url, { scroll: false });
    });
  };
  return <Context.Provider value={{ go, isPending }}>{children}</Context.Provider>;
}

export function useListingNavigation(): ListingNavigation {
  const context = useContext(Context);
  if (!context)
    throw new Error("useListingNavigation must be used inside ListingNavigationProvider");
  return context;
}

/** Keeps the current results visible but dimmed while new results load. */
export function ListingResults({ children }: { children: ReactNode }) {
  const { isPending } = useListingNavigation();
  return (
    <div
      aria-busy={isPending}
      className={cn("transition-opacity", isPending && "pointer-events-none opacity-50")}
    >
      <p role="status" className="sr-only">
        {isPending ? "Updating results…" : ""}
      </p>
      {children}
    </div>
  );
}
