"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { paths } from "@/config/routes";
import { useAuthFlowStore, useLoginPromptStore } from "@/stores/loginPromptStore";

const AUTH_PATHS = [paths.login(), paths.signup()];

/**
 * Route-change housekeeping (requirements §6.1): a pending intent survives moving between
 * /login and /signup but is discarded when the guest leaves the auth pages any other way.
 * Also ends the logout "leaving" state once navigation has happened.
 */
export function AuthEffects() {
  const pathname = usePathname();
  useEffect(() => {
    useAuthFlowStore.getState().setLeaving(false);
    const prompt = useLoginPromptStore.getState();
    if (!AUTH_PATHS.includes(pathname) && !prompt.isOpen) prompt.clear();
  }, [pathname]);
  return null;
}
