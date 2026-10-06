import type { Metadata } from "next";
import { NotFoundContent } from "@/components/layout/NotFoundContent";
import { ShopFrame } from "@/features/shell/ShopFrame";

export const metadata: Metadata = { title: "Page not found" };

/** Unmatched URLs render outside the (shop) layout, so this page brings its own frame. */
export default function NotFound() {
  return (
    <ShopFrame>
      <NotFoundContent />
    </ShopFrame>
  );
}
