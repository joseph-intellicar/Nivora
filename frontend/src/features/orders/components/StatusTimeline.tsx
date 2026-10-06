import { CheckIcon } from "@/components/icons";
import type { Order, OrderStatus } from "@nivora/shared/domain/types";
import { cn } from "@/lib/cn";
import { formatDateTime } from "@nivora/shared/lib/format";

const FLOW: OrderStatus[] = ["Placed", "Confirmed", "Shipped", "Delivered"];

/** Order progress from the status history (requirements §25.1, §25.4). */
export function StatusTimeline({ order }: { order: Order }) {
  const at = (status: OrderStatus) =>
    order.statusHistory.find((step) => step.status === status)?.at;
  const steps = order.status === "Cancelled" ? [...order.statusHistory.map((s) => s.status)] : FLOW;
  return (
    <ol aria-label="Order status" className="flex flex-col gap-0 sm:flex-row sm:gap-2">
      {steps.map((status, index) => {
        const time = at(status);
        const done = Boolean(time);
        const cancelled = status === "Cancelled";
        return (
          <li
            key={`${status}-${index}`}
            className="flex flex-1 items-start gap-3 sm:flex-col sm:items-center sm:text-center"
          >
            <span
              aria-hidden="true"
              className={cn(
                "inline-flex size-8 shrink-0 items-center justify-center rounded-full text-white",
                cancelled ? "bg-danger" : done ? "bg-success" : "bg-line text-ink-subtle",
              )}
            >
              {done ? <CheckIcon className="size-4" /> : index + 1}
            </span>
            <div className="pb-4 sm:pb-0">
              <p className={cn("text-sm font-semibold", done ? "text-ink" : "text-ink-subtle")}>
                {status}
                <span className="sr-only">{done ? " (completed)" : " (pending)"}</span>
              </p>
              {time ? <p className="text-xs text-ink-muted">{formatDateTime(time)}</p> : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
