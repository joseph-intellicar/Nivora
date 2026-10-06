import { create } from "zustand";
import type { PendingIntent } from "@/features/auth/intent";

type LoginPromptState = {
  /** Login-required dialog visibility. */
  isOpen: boolean;
  /** Survives switching between /login and /signup; cleared when leaving the auth pages. */
  intent: PendingIntent | null;
  open: (intent: PendingIntent) => void;
  /** Cancel: close and discard the intent (requirements §6.1). */
  cancel: () => void;
  /** Login: close the dialog but keep the intent for after authentication. */
  proceed: () => void;
  /** Returns and clears the pending intent. */
  take: () => PendingIntent | null;
  clear: () => void;
};

export const useLoginPromptStore = create<LoginPromptState>((set, get) => ({
  isOpen: false,
  intent: null,
  open: (intent) => set({ isOpen: true, intent }),
  cancel: () => set({ isOpen: false, intent: null }),
  proceed: () => set({ isOpen: false }),
  take: () => {
    const { intent } = get();
    set({ intent: null });
    return intent;
  },
  clear: () => set({ intent: null }),
}));

type AuthFlowState = {
  /** True between starting a logout and arriving on Home, so route guards don't bounce to /login. */
  leaving: boolean;
  setLeaving: (leaving: boolean) => void;
};

export const useAuthFlowStore = create<AuthFlowState>((set) => ({
  leaving: false,
  setLeaving: (leaving) => set({ leaving }),
}));
