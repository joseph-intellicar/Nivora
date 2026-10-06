import { CheckIcon, InfoIcon } from "@/components/icons";
import { stockStatus } from "@nivora/shared/domain/stock";

/** In stock / Only N left / Out of Stock (requirements §16.1, §35). */
export function StockStatus({ available }: { available: number }) {
  const status = stockStatus(available);
  if (status === "out_of_stock") {
    return (
      <p className="inline-flex items-center gap-1.5 text-sm font-bold text-danger">
        <InfoIcon className="size-4" />
        Out of Stock
      </p>
    );
  }
  if (status === "low_stock") {
    return (
      <p className="inline-flex items-center gap-1.5 text-sm font-bold text-warning">
        <InfoIcon className="size-4" />
        Only {available} left
      </p>
    );
  }
  return (
    <p className="inline-flex items-center gap-1.5 text-sm font-bold text-success">
      <CheckIcon className="size-4" />
      In stock
    </p>
  );
}
