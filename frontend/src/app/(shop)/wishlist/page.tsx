import type { Metadata } from "next";
import { RequireAuth } from "@/features/auth/components/RequireAuth";
import { WishlistView } from "@/features/wishlist/components/WishlistView";

export const metadata: Metadata = {
  title: "Wishlist",
  robots: { index: false, follow: false },
};

export default function WishlistPage() {
  return (
    <RequireAuth>
      <WishlistView />
    </RequireAuth>
  );
}
