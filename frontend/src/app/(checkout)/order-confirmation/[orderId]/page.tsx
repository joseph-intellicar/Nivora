import type { Metadata } from "next";
import { OrderConfirmationView } from "@/features/orders/components/OrderConfirmationView";

export const metadata: Metadata = {
  title: "Order Confirmation",
  robots: { index: false, follow: false },
};

export default async function OrderConfirmationPage({
  params,
}: PageProps<"/order-confirmation/[orderId]">) {
  return <OrderConfirmationView orderId={decodeURIComponent((await params).orderId)} />;
}
