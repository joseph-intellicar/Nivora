import { ApiError, fromErrorEnvelope } from "@nivora/shared/errors";

/*
 * HTTP transport for the Phase 2 adapters (barch §17). In the browser every call goes to the
 * same origin (`/api/...`), which next.config.ts rewrites to the backend, so the session and
 * guest-cart cookies are first-party. Server Components call the backend directly.
 */

const isBrowser = typeof window !== "undefined";

function baseUrl(): string {
  if (isBrowser) return "/api";
  const backend = process.env.BACKEND_URL;
  if (!backend)
    throw new Error("BACKEND_URL is not set (required when NEXT_PUBLIC_DATA_SOURCE=http).");
  return `${backend.replace(/\/$/, "")}/api/v1`;
}

export type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  /** Next.js data cache settings for server-side reads. */
  next?: { revalidate?: number | false; tags?: string[] };
};

/** Calls the API and returns the JSON body; any failure becomes an `ApiError`. */
export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, headers = {}, next } = options;
  let response: Response;
  try {
    response = await fetch(`${baseUrl()}${path}`, {
      method,
      credentials: "include",
      headers: {
        Accept: "application/json",
        ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      ...(isBrowser
        ? { cache: "no-store" as const }
        : next
          ? { next }
          : { cache: "no-store" as const }),
    });
  } catch (cause) {
    // Offline, DNS, connection refused…: a friendly UNKNOWN, never the raw network error. On the
    // server the cause is logged (e.g. a wrong BACKEND_URL), since nobody sees a browser console.
    if (!isBrowser) console.error(`Nivora API unreachable: ${method} ${baseUrl()}${path}`, cause);
    throw new ApiError("UNKNOWN");
  }
  if (response.status === 204) return undefined as T;
  const payload: unknown = await response.json().catch(() => undefined);
  if (!response.ok) throw fromErrorEnvelope(payload);
  return payload as T;
}

/** `null` instead of NOT_FOUND, for contract methods that return null for missing items. */
export async function orNull<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch (error) {
    if (error instanceof ApiError && error.code === "NOT_FOUND") return null;
    throw error;
  }
}

export function newIdempotencyKey(): string {
  return crypto.randomUUID();
}
