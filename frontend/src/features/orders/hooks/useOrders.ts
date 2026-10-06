"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, queryKeys } from "@/api/client";
import { isApiError } from "@/api/errors";
import { useSession } from "@/features/auth/hooks/useSession";
import { getErrorMessage } from "@/lib/errorMessages";
import { toast } from "@/stores/toastStore";

export function useOrders() {
  const { user } = useSession();
  return useQuery({
    queryKey: queryKeys.orders(user?.id ?? ""),
    queryFn: () => api.orders.list(),
    enabled: Boolean(user),
  });
}

/** One of the customer's orders; other customers' orders are NOT_FOUND (requirements §25.4). */
export function useOrder(orderId: string) {
  const { user } = useSession();
  return useQuery({
    queryKey: queryKeys.order(user?.id ?? "", orderId),
    queryFn: () => api.orders.get(orderId),
    enabled: Boolean(user),
    retry: false,
  });
}

export const isNotFound = (error: unknown) => isApiError(error) && error.code === "NOT_FOUND";

/** Cancel a Placed/Confirmed order (requirements §25.2); stock is restored by the data layer. */
export function useCancelOrder() {
  const queryClient = useQueryClient();
  const { user } = useSession();
  return useMutation({
    mutationFn: (orderId: string) => api.orders.cancel(orderId),
    onSuccess: (order) => {
      const userId = user?.id ?? "";
      queryClient.setQueryData(queryKeys.order(userId, order.orderId), order);
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders(userId) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.inventory() });
      toast.success(`Order ${order.orderId} has been cancelled.`);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
