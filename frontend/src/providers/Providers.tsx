"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { Toaster } from "@/components/ui/Toaster";
import { AuthEffects } from "@/features/auth/components/AuthEffects";
import { LoginRequiredDialog } from "@/features/auth/components/LoginRequiredDialog";
import { VariantPickerDialog } from "@/features/product/components/VariantPickerDialog";
import { createQueryClient } from "./queryClient";

/** App-wide client providers plus global overlays (toasts, login-required dialog). */
export function Providers({ children }: { children: ReactNode }) {
  // One client per browser session; never shared between server requests.
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster />
      <LoginRequiredDialog />
      <VariantPickerDialog />
      <AuthEffects />
    </QueryClientProvider>
  );
}
