"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, queryKeys } from "@/api/client";
import type { CartView } from "@/domain/types";
import { useSession } from "@/features/auth/hooks/useSession";
import { getErrorMessage } from "@/lib/errorMessages";
import { paths } from "@/config/routes";
import { toast } from "@/stores/toastStore";

/** The current cart (guest or customer), with lines, issues and totals (arch §11.1). */
export function useCart() {
  const { user, isLoading } = useSession();
  return useQuery({
    queryKey: queryKeys.cart(user?.id ?? null),
    queryFn: () => api.cart.getCart(),
    enabled: !isLoading,
  });
}

/** Cart mutations write the returned CartView straight into the cache. */
function useCartMutation<TInput>(run: (input: TInput) => Promise<CartView>) {
  const queryClient = useQueryClient();
  const { user } = useSession();
  return useMutation({
    mutationFn: run,
    onSuccess: (view) => queryClient.setQueryData(queryKeys.cart(user?.id ?? null), view),
  });
}

export function useAddToCart() {
  const mutation = useCartMutation((input: { variantId: string; quantity: number }) =>
    api.cart.addItem(input),
  );
  return {
    ...mutation,
    add: (
      input: { variantId: string; quantity: number },
      options?: { onSuccess?: () => void; onError?: (message: string) => void },
    ) =>
      mutation.mutate(input, {
        onSuccess: () => {
          toast.success("Added to cart", { action: { label: "View Cart", href: paths.cart() } });
          options?.onSuccess?.();
        },
        onError: (error) => {
          const message = getErrorMessage(error);
          if (options?.onError) options.onError(message);
          else toast.error(message);
        },
      }),
  };
}

export function useUpdateCartLine() {
  return useCartMutation((input: { variantId: string; quantity: number }) =>
    api.cart.updateQuantity(input.variantId, input.quantity),
  );
}

export function useRemoveCartLine() {
  return useCartMutation((variantId: string) => api.cart.removeItem(variantId));
}
