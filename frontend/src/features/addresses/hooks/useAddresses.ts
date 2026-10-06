"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, queryKeys } from "@/api/client";
import type { AddressInput } from "@/domain/types";
import { useSession } from "@/features/auth/hooks/useSession";

/** Saved addresses, default first (requirements §21). */
export function useAddresses() {
  const { user } = useSession();
  return useQuery({
    queryKey: queryKeys.addresses(user?.id ?? ""),
    queryFn: () => api.addresses.list(),
    enabled: Boolean(user),
  });
}

function useAddressMutation<TInput, TResult>(run: (input: TInput) => Promise<TResult>) {
  const queryClient = useQueryClient();
  const { user } = useSession();
  return useMutation({
    mutationFn: run,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.addresses(user?.id ?? "") }),
  });
}

export function useSaveAddress() {
  return useAddressMutation(({ id, input }: { id?: string; input: AddressInput }) =>
    id ? api.addresses.update(id, input) : api.addresses.create(input),
  );
}

export function useDeleteAddress() {
  return useAddressMutation((id: string) => api.addresses.remove(id));
}

export function useSetDefaultAddress() {
  return useAddressMutation((id: string) => api.addresses.setDefault(id));
}
