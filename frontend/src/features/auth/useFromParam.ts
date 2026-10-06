"use client";

import { useSearchParams } from "next/navigation";
import { isSafeInternalPath } from "@/config/routes";

/** The internal path to return to after login (`?from=`); unsafe values are ignored (no open redirects). */
export function useFromParam(): string | null {
  const from = useSearchParams().get("from");
  return isSafeInternalPath(from) ? from : null;
}
