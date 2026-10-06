import type { Metadata } from "next";
import { AddressManager } from "@/features/addresses/components/AddressManager";

export const metadata: Metadata = { title: "Addresses" };

export default function AddressesPage() {
  return (
    <>
      <h1 className="mb-5 text-2xl font-extrabold tracking-tight text-ink">Saved Addresses</h1>
      <AddressManager />
    </>
  );
}
