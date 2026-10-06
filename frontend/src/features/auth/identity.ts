import type { QueryClient } from "@tanstack/react-query";
import { queryKeys, USER_SCOPED_ROOTS } from "@/api/client";
import type { User } from "@/domain/types";

/**
 * Called on login, signup and logout (arch §11.1): stores the new identity and removes every
 * user-scoped query so no data from the previous identity can remain in the cache.
 */
export function applyIdentity(queryClient: QueryClient, user: User | null): void {
  queryClient.setQueryData(queryKeys.session(), user);
  for (const root of USER_SCOPED_ROOTS) queryClient.removeQueries({ queryKey: [root] });
}
