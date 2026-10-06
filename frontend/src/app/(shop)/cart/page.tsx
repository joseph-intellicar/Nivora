import type { Metadata } from "next";
import { CartView } from "@/features/cart/components/CartView";

export const metadata: Metadata = {
  title: "Cart",
  robots: { index: false, follow: false },
};

/** Cart (requirements §17). `?merged=1` shows the saved-items notice after login (decision D12). */
export default async function CartPage({ searchParams }: PageProps<"/cart">) {
  return <CartView merged={(await searchParams).merged === "1"} />;
}
