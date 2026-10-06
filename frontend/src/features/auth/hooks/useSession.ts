"use client";

import { useQuery } from "@tanstack/react-query";
import { api, queryKeys } from "@/api/client";
import type { User } from "@/domain/types";

export type SessionState = {
  user: User | null;
  isAuthenticated: boolean;
  /** True on the server, during hydration and until the session has been read (arch §12.1). */
  isLoading: boolean;
};

/** The current customer, read from the data layer. Nobody is logged in automatically. */
export function useSession(): SessionState {
  const query = useQuery({
    queryKey: queryKeys.session(),
    queryFn: () => api.auth.getSession(),
    staleTime: Infinity,
  });
  const user = query.data ?? null;
  return { user, isAuthenticated: user !== null, isLoading: query.isPending };
}
