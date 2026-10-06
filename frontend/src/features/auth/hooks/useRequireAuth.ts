"use client";

import { useLoginPromptStore } from "@/stores/loginPromptStore";
import type { PendingIntent } from "../intent";
import { useSession } from "./useSession";

/**
 * Gate for protected actions (requirements §6.1): runs the action for customers, or opens the
 * login-required dialog for guests and remembers the intent.
 */
export function useRequireAuth() {
  const { isAuthenticated } = useSession();
  const open = useLoginPromptStore((state) => state.open);
  return (intent: PendingIntent, run: () => void) => {
    if (isAuthenticated) run();
    else open(intent);
  };
}
