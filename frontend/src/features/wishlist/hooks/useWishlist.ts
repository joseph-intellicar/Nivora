"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, queryKeys } from "@/api/client";
import type { ProductSummary } from "@/domain/types";
import { useSession } from "@/features/auth/hooks/useSession";
import { getErrorMessage } from "@/lib/errorMessages";
import { toast } from "@/stores/toastStore";

/** The customer's wishlist; empty and disabled for guests (requirements §18). */
export function useWishlist() {
  const { user } = useSession();
  return useQuery({
    queryKey: queryKeys.wishlist(user?.id ?? ""),
    queryFn: () => api.wishlist.getWishlist(),
    enabled: Boolean(user),
  });
}

/** Optimistic add/remove with rollback on error (arch §11.1). */
export function useToggleWishlist() {
  const queryClient = useQueryClient();
  const { user } = useSession();
  const key = queryKeys.wishlist(user?.id ?? "");
  return useMutation({
    mutationFn: ({ product, add }: { product: Pick<ProductSummary, "id">; add: boolean }) =>
      add ? api.wishlist.add(product.id) : api.wishlist.remove(product.id),
    onMutate: async ({ product, add }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<ProductSummary[]>(key);
      queryClient.setQueryData<ProductSummary[]>(key, (list = []) =>
        add
          ? [...list.filter((p) => p.id !== product.id), product as ProductSummary]
          : list.filter((p) => p.id !== product.id),
      );
      return { previous };
    },
    onError: (error, _input, context) => {
      queryClient.setQueryData(key, context?.previous);
      toast.error(getErrorMessage(error));
    },
    onSuccess: (_data, { add }) =>
      toast.success(add ? "Added to your wishlist." : "Removed from your wishlist."),
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
}
