import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { AccountNav } from "@/features/account/components/AccountNav";
import { RequireAuth } from "@/features/auth/components/RequireAuth";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** Authenticated account area (requirements §26). */
export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return (
    <RequireAuth>
      <Container className="py-6 sm:py-8">
        <div className="grid gap-6 lg:grid-cols-[14rem_1fr] lg:gap-10">
          <aside>
            <AccountNav />
          </aside>
          <div className="min-w-0">{children}</div>
        </div>
      </Container>
    </RequireAuth>
  );
}
