import type { Metadata } from "next";
import { OrdersView } from "@/features/orders/components/OrdersView";

export const metadata: Metadata = { title: "Orders" };

export default function OrdersPage() {
  return (
    <>
      <h1 className="mb-5 text-2xl font-extrabold tracking-tight text-ink">Your Orders</h1>
      <OrdersView />
    </>
  );
}
