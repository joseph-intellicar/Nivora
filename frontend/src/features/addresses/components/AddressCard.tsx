"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import type { Address } from "@nivora/shared/domain/types";

/** Address text block, shared by address cards, checkout and orders. */
export function AddressText({
  address,
}: {
  address: Pick<
    Address,
    "fullName" | "phone" | "line1" | "line2" | "city" | "state" | "postalCode" | "country"
  >;
}) {
  return (
    <address className="text-sm leading-6 text-ink-muted not-italic">
      <span className="block font-semibold text-ink">{address.fullName}</span>
      {address.line1}
      {address.line2 ? <>, {address.line2}</> : null}
      <br />
      {address.city}, {address.state} {address.postalCode}, {address.country}
      <br />
      Phone: {address.phone}
    </address>
  );
}

/** A saved address with its actions (requirements §21). */
export function AddressCard({
  address,
  selectControl,
  actions,
}: {
  address: Address;
  selectControl?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex gap-3 rounded-card bg-surface p-4 ring-1 ring-line has-[:checked]:ring-2 has-[:checked]:ring-brand-600">
      {selectControl}
      <div className="min-w-0 flex-1">
        {address.isDefault ? (
          <Badge variant="brand" className="mb-2">
            Default
          </Badge>
        ) : null}
        <AddressText address={address} />
        {actions ? (
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">{actions}</div>
        ) : null}
      </div>
    </div>
  );
}
