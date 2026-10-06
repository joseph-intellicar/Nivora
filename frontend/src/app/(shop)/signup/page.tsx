import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCardSkeleton } from "@/features/auth/components/AuthCard";
import { SignupView } from "@/features/auth/components/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <Suspense fallback={<AuthCardSkeleton title="Create your Nivora account" />}>
      <SignupView />
    </Suspense>
  );
}
