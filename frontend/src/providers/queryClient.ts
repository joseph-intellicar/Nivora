import { QueryClient } from "@tanstack/react-query";

/**
 * Creates the TanStack Query client for browser-side customer data (docs/architecture.md §11.1).
 * Data-layer errors are business outcomes (e.g. out of stock) that will not succeed on retry,
 * and Phase 1 data lives in this browser, so window-focus refetching is unnecessary.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}
