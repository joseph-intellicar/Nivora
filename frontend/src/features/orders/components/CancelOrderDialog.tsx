"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import type { Order } from "@/domain/types";
import { canCancel } from "@/domain/orders";
import { useCancelOrder } from "../hooks/useOrders";

/** Cancel Order with a confirmation step; only for Placed / Confirmed (requirements §25.2). */
export function CancelOrderButton({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const cancel = useCancelOrder();
  if (!canCancel(order.status)) return null;
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)} className="text-danger">
        Cancel Order
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        size="sm"
        title="Cancel this order?"
        description={`Order ${order.orderId} will be cancelled. As this is a Cash on Delivery order, there is nothing to refund.`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Keep Order
            </Button>
            <Button
              variant="danger"
              loading={cancel.isPending}
              onClick={() => cancel.mutate(order.orderId, { onSuccess: () => setOpen(false) })}
            >
              Cancel Order
            </Button>
          </>
        }
      />
    </>
  );
}
