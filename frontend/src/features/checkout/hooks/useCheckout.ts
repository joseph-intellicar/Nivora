"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api, queryKeys } from "@/api/client";
import { paths } from "@/config/routes";
import type { DeliveryOption } from "@/domain/types";
import { useSession } from "@/features/auth/hooks/useSession";

/** Checkout items and totals for the chosen delivery option (requirements §20). */
export function useCheckout(deliveryOption: DeliveryOption) {
  const { user } = useSession();
  return useQuery({
    queryKey: queryKeys.checkout(user?.id ?? "", deliveryOption),
    queryFn: () => api.checkout.getCheckout(deliveryOption),
    enabled: Boolean(user),
    placeholderData: keepPreviousData,
  });
}

/**
 * Places the order (requirements §24): on success go to the confirmation page (replace, so Back
 * doesn't return to checkout) and refresh cart, checkout, orders and stock.
 */
export function usePlaceOrder() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useSession();
  return useMutation({
    mutationFn: (input: { addressId: string; deliveryOption: DeliveryOption }) =>
      api.checkout.placeOrder(input),
    onSuccess: (order) => {
      router.replace(paths.orderConfirmation(order.orderId));
      const userId = user?.id ?? "";
      queryClient.setQueryData(queryKeys.order(userId, order.orderId), order);
      void queryClient.invalidateQueries({ queryKey: queryKeys.cart(userId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders(userId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.inventory() });
      queryClient.removeQueries({ queryKey: ["checkout", userId] });
    },
  });
}
