import type { Metadata } from "next";
import { OrderDetailsView } from "@/features/orders/components/OrderDetailsView";

export const metadata: Metadata = { title: "Order Details" };

export default async function OrderDetailsPage({ params }: PageProps<"/account/orders/[orderId]">) {
  return <OrderDetailsView orderId={decodeURIComponent((await params).orderId)} />;
}
