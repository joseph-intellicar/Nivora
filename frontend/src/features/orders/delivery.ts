import { DELIVERY } from "@nivora/shared/config/constants";
import type { DeliveryOption } from "@nivora/shared/domain/types";
import { formatDate } from "@nivora/shared/lib/format";

const DAY = 24 * 60 * 60 * 1000;

/** "Arrives 10 Oct 2026 – 12 Oct 2026" style range from a start date (requirements §22). */
export function deliveryWindow(option: DeliveryOption, from: string | Date = new Date()): string {
  const start = new Date(from).getTime();
  const { min, max } = DELIVERY[option].estimatedDays;
  return `${formatDate(new Date(start + min * DAY))} – ${formatDate(new Date(start + max * DAY))}`;
}
