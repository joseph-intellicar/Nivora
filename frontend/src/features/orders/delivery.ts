import { DELIVERY } from "@/config/constants";
import type { DeliveryOption } from "@/domain/types";
import { formatDate } from "@/lib/format";

const DAY = 24 * 60 * 60 * 1000;

/** "Arrives 10 Oct 2026 – 12 Oct 2026" style range from a start date (requirements §22). */
export function deliveryWindow(option: DeliveryOption, from: string | Date = new Date()): string {
  const start = new Date(from).getTime();
  const { min, max } = DELIVERY[option].estimatedDays;
  return `${formatDate(new Date(start + min * DAY))} – ${formatDate(new Date(start + max * DAY))}`;
}
