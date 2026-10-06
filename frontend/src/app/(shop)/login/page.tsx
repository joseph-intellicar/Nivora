import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCardSkeleton } from "@/features/auth/components/AuthCard";
import { LoginView } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<AuthCardSkeleton title="Login to Nivora" />}>
      <LoginView />
    </Suspense>
  );
}
