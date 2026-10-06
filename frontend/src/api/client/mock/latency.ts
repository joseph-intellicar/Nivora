import { siteConfig } from "@/config/site";
import { ApiError } from "@nivora/shared/errors";
import { ensureSeeded } from "./seed";

function delay(ms: number): Promise<void> {
  return ms > 0 ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve();
}

/**
 * Wraps every mock "request" (arch §7.2): seeds once, waits for simulated network latency,
 * runs the handler, and converts unexpected failures into ApiError("UNKNOWN").
 */
export async function request<T>(handler: () => T | Promise<T>): Promise<T> {
  await delay(siteConfig.mockLatencyMs);
  try {
    ensureSeeded();
    return await handler();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("UNKNOWN");
  }
}
