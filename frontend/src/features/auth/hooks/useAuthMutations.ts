"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { api } from "@/api/client";
import type { AuthResult } from "@nivora/shared/contracts";
import { paths } from "@/config/routes";
import type { LoginInput, SignupInput } from "@nivora/shared/domain/types";
import { toast } from "@/stores/toastStore";
import { useAuthFlowStore, useLoginPromptStore } from "@/stores/loginPromptStore";
import { applyIdentity } from "../identity";
import { resumeIntent } from "../intent";

/** After login/signup: store the identity, then continue the pending intent (arch §12.2). */
function useCompleteAuth(from: string | null) {
  const queryClient = useQueryClient();
  const router = useRouter();
  return async (result: AuthResult) => {
    applyIdentity(queryClient, result.user);
    const intent = useLoginPromptStore.getState().take();
    await resumeIntent(
      intent,
      { userId: result.user.id, mergedSavedItems: result.mergedSavedItems, from },
      { api, queryClient, navigate: (path) => router.replace(path), notify: toast },
    );
  };
}

export function useLogin(from: string | null) {
  const complete = useCompleteAuth(from);
  return useMutation({
    mutationFn: (input: LoginInput) => api.auth.login(input),
    onSuccess: complete,
  });
}

export function useSignup(from: string | null) {
  const complete = useCompleteAuth(from);
  return useMutation({
    mutationFn: (input: SignupInput) => api.auth.signup(input),
    onSuccess: complete,
  });
}

/** Clears only the session, returns to Home in guest mode (requirements §27). */
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: () => api.auth.logout(),
    onMutate: () => useAuthFlowStore.getState().setLeaving(true),
    onSuccess: () => {
      router.push(paths.home());
      applyIdentity(queryClient, null);
      toast.info("You have been logged out.");
    },
    onError: () => {
      useAuthFlowStore.getState().setLeaving(false);
      toast.error("We couldn't log you out. Please try again.");
    },
  });
}
