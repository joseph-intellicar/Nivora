import { CheckoutShell } from "@/components/layout/CheckoutShell";
import { RequireAuth } from "@/features/auth/components/RequireAuth";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <CheckoutShell>
      <RequireAuth>{children}</RequireAuth>
    </CheckoutShell>
  );
}
