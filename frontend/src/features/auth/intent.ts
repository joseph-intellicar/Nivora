import type { QueryClient } from "@tanstack/react-query";
import type { ClientApi } from "@/api/contracts";
import { queryKeys } from "@/api/client/queryKeys";
import { paths, isSafeInternalPath } from "@/config/routes";
import { getErrorMessage } from "@/lib/errorMessages";

/** What a guest was trying to do before being asked to log in (requirements §6.1, arch §12.2). */
export type PendingIntent =
  | { type: "wishlist-add"; productId: string; returnTo: string }
  | { type: "buy-now"; variantId: string; quantity: number; returnTo: string }
  | { type: "checkout"; returnTo: string }
  | { type: "navigate"; to: string };

/** Where the login page should send the guest back to if they cancel nothing and just log in. */
export function intentReturnPath(intent: PendingIntent): string {
  return intent.type === "navigate" ? intent.to : intent.returnTo;
}

export function intentReason(intent: PendingIntent): string {
  switch (intent.type) {
    case "wishlist-add":
      return "Log in to save items to your wishlist.";
    case "buy-now":
      return "Log in to buy this item.";
    case "checkout":
      return "Log in to continue to checkout.";
    case "navigate":
      return "Log in to continue.";
  }
}

export type ResumeDeps = {
  api: Pick<ClientApi, "wishlist" | "checkout">;
  queryClient: QueryClient;
  navigate: (path: string) => void;
  notify: {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
  };
};

/**
 * Continues the intended action after login or signup (arch §12.2). The action is re-validated
 * by the data layer; if it fails, the customer sees the normal error and lands on the page
 * they came from.
 */
export async function resumeIntent(
  intent: PendingIntent | null,
  context: { userId: string; mergedSavedItems: boolean; from: string | null },
  deps: ResumeDeps,
): Promise<void> {
  const fallback = isSafeInternalPath(context.from) ? context.from : paths.home();
  if (!intent) return deps.navigate(fallback);

  try {
    switch (intent.type) {
      case "wishlist-add":
        await deps.api.wishlist.add(intent.productId);
        await deps.queryClient.invalidateQueries({ queryKey: queryKeys.wishlist(context.userId) });
        deps.notify.success("Added to your wishlist.");
        return deps.navigate(intent.returnTo);
      case "buy-now":
        await deps.api.checkout.startBuyNow({
          variantId: intent.variantId,
          quantity: intent.quantity,
        });
        return deps.navigate(paths.checkout());
      case "checkout":
        if (context.mergedSavedItems) {
          // The Cart page shows the saved-items notice (decision D12).
          return deps.navigate(`${paths.cart()}?merged=1`);
        }
        await deps.api.checkout.startCartCheckout();
        return deps.navigate(paths.checkout());
      case "navigate":
        return deps.navigate(isSafeInternalPath(intent.to) ? intent.to : fallback);
    }
  } catch (error) {
    deps.notify.error(getErrorMessage(error));
    deps.navigate(intentReturnPath(intent));
  }
}
