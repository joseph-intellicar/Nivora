import type { ClientApi } from "@nivora/shared/contracts";
import { siteConfig } from "@/config/site";
import { httpApi } from "../http/browser";
import { mockAddresses } from "./mock/addresses";
import { mockAuth } from "./mock/auth";
import { mockCart } from "./mock/cart";
import { mockClientCatalog } from "./mock/catalog";
import { mockCheckout } from "./mock/checkout";
import { mockInventory } from "./mock/inventory";
import { mockOrders } from "./mock/orders";
import { mockProfile } from "./mock/profile";
import { mockWishlist } from "./mock/wishlist";

/**
 * Browser-side data layer (arch §7.1). NEXT_PUBLIC_DATA_SOURCE picks the adapters: "mock"
 * (Phase 1, browser storage) or "http" (the Nivora API) — same contract either way.
 */
const mockApi: ClientApi = {
  catalog: mockClientCatalog,
  inventory: mockInventory,
  auth: mockAuth,
  cart: mockCart,
  wishlist: mockWishlist,
  addresses: mockAddresses,
  checkout: mockCheckout,
  orders: mockOrders,
  profile: mockProfile,
};

export const api: ClientApi = siteConfig.dataSource === "http" ? httpApi : mockApi;

export { queryKeys, USER_SCOPED_ROOTS } from "./queryKeys";
