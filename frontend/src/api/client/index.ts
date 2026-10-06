import type { ClientApi } from "../contracts";
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
 * Browser-side data layer (arch §7.1). Phase 1 uses the mock adapters
 * (NEXT_PUBLIC_DATA_SOURCE=mock); Phase 2 swaps in HTTP adapters with the same contract.
 */
export const api: ClientApi = {
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

export { queryKeys, USER_SCOPED_ROOTS } from "./queryKeys";
