"use client";

import { useQuery } from "@tanstack/react-query";
import { api, queryKeys } from "@/api/client";
import { siteConfig } from "@/config/site";
import type { Product } from "@nivora/shared/domain/types";

/**
 * The product with current stock for purchase controls (arch §3.1, barch §17). In `http` mode
 * the server-rendered page may be minutes old, so live stock is read from the API (and re-read
 * after orders and cancellations); in `mock` mode stock comes from the browser overlay instead.
 */
export function useLiveProduct(product: Product): Product {
  const live = useQuery({
    queryKey: queryKeys.product(product.slug),
    queryFn: () => api.catalog.getProduct(product.slug),
    enabled: siteConfig.dataSource === "http",
  });
  const available = live.data?.available;
  if (!available) return product;
  return {
    ...product,
    variants: product.variants.map((variant) => ({
      ...variant,
      initialStock: available[variant.id] ?? 0,
    })),
  };
}
