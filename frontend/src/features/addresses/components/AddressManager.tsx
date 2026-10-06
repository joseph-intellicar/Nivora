"use client";

import { useState } from "react";
import { MapPinIcon, PlusIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorState } from "@/components/ui/ErrorState";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Address } from "@nivora/shared/domain/types";
import { getErrorMessage } from "@nivora/shared/errorMessages";
import { toast } from "@/stores/toastStore";
import { useAddresses, useDeleteAddress, useSetDefaultAddress } from "../hooks/useAddresses";
import { AddressCard } from "./AddressCard";
import { AddressForm } from "./AddressForm";

type Editing = { mode: "add" } | { mode: "edit"; address: Address } | null;

/**
 * Address list with add / edit / delete / set default (requirements §21). In "select" mode
 * (checkout) each address is a radio and `selectedId`/`onSelect` control the choice.
 */
export function AddressManager({
  mode = "manage",
  selectedId,
  onSelect,
}: {
  mode?: "manage" | "select";
  selectedId?: string | null;
  onSelect?: (id: string | null) => void;
}) {
  const addresses = useAddresses();
  const remove = useDeleteAddress();
  const setDefault = useSetDefaultAddress();
  const [editing, setEditing] = useState<Editing>(null);
  const [deleting, setDeleting] = useState<Address | null>(null);

  if (addresses.isPending) {
    return (
      <div className="space-y-3" role="status" aria-label="Loading addresses">
        {[0, 1].map((i) => (
          <Skeleton key={i} className="h-28 w-full" />
        ))}
      </div>
    );
  }
  if (addresses.isError) return <ErrorState onRetry={() => addresses.refetch()} />;

  const list = addresses.data;
  const action = "font-semibold text-brand-700 hover:underline disabled:opacity-50";

  const onSaved = (address: Address) => {
    toast.success(editing?.mode === "edit" ? "Address updated." : "Address saved.");
    if (mode === "select") onSelect?.(address.id);
    setEditing(null);
  };

  const confirmDelete = () => {
    if (!deleting) return;
    const target = deleting;
    remove.mutate(target.id, {
      onSuccess: () => {
        toast.info("Address deleted.");
        if (selectedId === target.id) onSelect?.(null);
        setDeleting(null);
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {list.length === 0 ? (
        mode === "select" ? (
          <div className="rounded-card bg-surface p-4 ring-1 ring-line">
            <p className="mb-4 text-sm text-ink-muted">
              You haven&apos;t saved any addresses yet. Add a delivery address to continue.
            </p>
            <AddressForm onSaved={onSaved} submitLabel="Save and Deliver Here" />
          </div>
        ) : (
          <EmptyState
            icon={<MapPinIcon />}
            title="You haven't saved any addresses yet."
            action={
              <Button onClick={() => setEditing({ mode: "add" })}>
                <PlusIcon className="size-4" />
                Add Address
              </Button>
            }
          />
        )
      ) : (
        <>
          <ul
            className="flex flex-col gap-3"
            role={mode === "select" ? "radiogroup" : undefined}
            aria-label={mode === "select" ? "Delivery address" : "Saved addresses"}
          >
            {list.map((address) => (
              <li key={address.id}>
                <AddressCard
                  address={address}
                  selectControl={
                    mode === "select" ? (
                      <input
                        type="radio"
                        name="delivery-address"
                        aria-label={`Deliver to ${address.fullName}, ${address.line1}, ${address.city}`}
                        checked={selectedId === address.id}
                        onChange={() => onSelect?.(address.id)}
                        className="mt-1 size-4 shrink-0 accent-brand-700"
                      />
                    ) : undefined
                  }
                  actions={
                    <>
                      <button
                        type="button"
                        className={action}
                        onClick={() => setEditing({ mode: "edit", address })}
                      >
                        Edit
                      </button>
                      <button type="button" className={action} onClick={() => setDeleting(address)}>
                        Delete
                      </button>
                      {!address.isDefault ? (
                        <button
                          type="button"
                          className={action}
                          disabled={setDefault.isPending}
                          onClick={() =>
                            setDefault.mutate(address.id, {
                              onSuccess: () => toast.success("Default address updated."),
                            })
                          }
                        >
                          Set as default
                        </button>
                      ) : null}
                    </>
                  }
                />
              </li>
            ))}
          </ul>
          <Button
            variant="secondary"
            className="self-start"
            onClick={() => setEditing({ mode: "add" })}
          >
            <PlusIcon className="size-4" />
            Add a new address
          </Button>
        </>
      )}

      <Dialog
        open={editing !== null}
        onClose={() => setEditing(null)}
        size="lg"
        title={editing?.mode === "edit" ? "Edit address" : "Add a new address"}
      >
        {editing ? (
          <AddressForm
            key={editing.mode === "edit" ? editing.address.id : "new"}
            address={editing.mode === "edit" ? editing.address : undefined}
            onSaved={onSaved}
            onCancel={() => setEditing(null)}
          />
        ) : null}
      </Dialog>

      <Dialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        size="sm"
        title="Delete this address?"
        description="Past orders keep their own copy of the address."
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleting(null)}>
              Keep
            </Button>
            <Button variant="danger" onClick={confirmDelete} loading={remove.isPending}>
              Delete
            </Button>
          </>
        }
      />
    </div>
  );
}
