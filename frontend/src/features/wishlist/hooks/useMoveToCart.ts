"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, queryKeys } from "@/api/client";
import { paths } from "@/config/routes";
import { useSession } from "@/features/auth/hooks/useSession";
import { getErrorMessage } from "@nivora/shared/errorMessages";
import { toast } from "@/stores/toastStore";

/** Moves a single-variant product from the wishlist to the cart (requirements §18). */
export function useMoveToCart() {
  const queryClient = useQueryClient();
  const { user } = useSession();
  return useMutation({
    mutationFn: (input: { productId: string; variantId: string }) => api.wishlist.moveToCart(input),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.wishlist(user?.id ?? "") }),
        queryClient.invalidateQueries({ queryKey: queryKeys.cart(user?.id ?? null) }),
      ]);
      toast.success("Moved to your cart", { action: { label: "View Cart", href: paths.cart() } });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
