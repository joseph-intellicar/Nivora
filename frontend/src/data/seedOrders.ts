import type { Order } from "@/domain/types";

/**
 * Sample order history for the test user (requirements §25.5, decision D11).
 * Historical: seeding them never changes stock, and cancelling one never restores stock.
 * Generated from the mock catalog so snapshots and totals match the product data.
 */
export const SEED_ORDERS: Order[] = [
  {
    orderId: "NIV-2026-000001",
    customerId: "user-joseph",
    orderDate: "2026-08-14T09:20:00.000Z",
    source: "cart",
    items: [
      {
        productId: "stride-everyday-white-sneakers",
        variantId: "stride-everyday-white-sneakers-white-uk-9",
        productSlug: "stride-everyday-white-sneakers",
        productName: "Stride Everyday White Sneakers",
        brand: "Stride",
        image:
          "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=1200&q=80&auto=format&fit=crop",
        options: {
          Color: "White",
          Size: "UK 9",
        },
        quantity: 1,
        unitPrice: 1799,
        unitOriginalPrice: 2499,
        discount: 700,
        lineTotal: 1799,
      },
      {
        productId: "northline-pique-polo-t-shirt",
        variantId: "northline-pique-polo-t-shirt-black-l",
        productSlug: "northline-pique-polo-t-shirt",
        productName: "Northline Piqué Polo T-Shirt",
        brand: "Northline",
        image:
          "https://images.unsplash.com/photo-1623658580851-3b25bf83b4ea?w=1200&q=80&auto=format&fit=crop",
        options: {
          Color: "Black",
          Size: "L",
        },
        quantity: 2,
        unitPrice: 699,
        unitOriginalPrice: 1199,
        discount: 1000,
        lineTotal: 1398,
      },
    ],
    subtotal: 4897,
    discount: 1700,
    deliveryOption: "standard",
    deliveryCharge: 0,
    total: 3197,
    deliveryAddress: {
      fullName: "Joseph",
      phone: "9876543210",
      line1: "42, 3rd Cross, Indiranagar",
      line2: "Near 100 Feet Road",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560038",
      country: "India",
    },
    paymentMethod: "Cash on Delivery",
    status: "Delivered",
    statusHistory: [
      {
        status: "Placed",
        at: "2026-08-14T09:20:00.000Z",
      },
      {
        status: "Confirmed",
        at: "2026-08-14T11:05:00.000Z",
      },
      {
        status: "Shipped",
        at: "2026-08-15T16:40:00.000Z",
      },
      {
        status: "Delivered",
        at: "2026-08-19T13:10:00.000Z",
      },
    ],
    isSample: true,
  },
  {
    orderId: "NIV-2026-000002",
    customerId: "user-joseph",
    orderDate: "2026-09-02T14:45:00.000Z",
    source: "cart",
    items: [
      {
        productId: "sony-wh-1000xm5-wireless-headphones",
        variantId: "sony-wh-1000xm5-wireless-headphones-black",
        productSlug: "sony-wh-1000xm5-wireless-headphones",
        productName: "Sony WH-1000XM5 Wireless Headphones",
        brand: "Sony",
        image:
          "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=1200&q=80&auto=format&fit=crop",
        options: {
          Color: "Black",
        },
        quantity: 1,
        unitPrice: 26990,
        unitOriginalPrice: 34990,
        discount: 8000,
        lineTotal: 26990,
      },
    ],
    subtotal: 34990,
    discount: 8000,
    deliveryOption: "express",
    deliveryCharge: 99,
    total: 27089,
    deliveryAddress: {
      fullName: "Joseph",
      phone: "9876543210",
      line1: "42, 3rd Cross, Indiranagar",
      line2: "Near 100 Feet Road",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560038",
      country: "India",
    },
    paymentMethod: "Cash on Delivery",
    status: "Cancelled",
    statusHistory: [
      {
        status: "Placed",
        at: "2026-09-02T14:45:00.000Z",
      },
      {
        status: "Cancelled",
        at: "2026-09-02T18:30:00.000Z",
      },
    ],
    isSample: true,
  },
  {
    orderId: "NIV-2026-000003",
    customerId: "user-joseph",
    orderDate: "2026-09-27T07:55:00.000Z",
    source: "cart",
    items: [
      {
        productId: "dewra-10-niacinamide-face-serum",
        variantId: "dewra-10-niacinamide-face-serum",
        productSlug: "dewra-10-niacinamide-face-serum",
        productName: "Dewra 10% Niacinamide Face Serum",
        brand: "Dewra",
        image:
          "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?w=1200&q=80&auto=format&fit=crop",
        options: {},
        quantity: 1,
        unitPrice: 549,
        unitOriginalPrice: 699,
        discount: 150,
        lineTotal: 549,
      },
      {
        productId: "sunveil-spf-50-pa-sunscreen",
        variantId: "sunveil-spf-50-pa-sunscreen",
        productSlug: "sunveil-spf-50-pa-sunscreen",
        productName: "Sunveil SPF 50 PA++++ Sunscreen",
        brand: "Sunveil",
        image:
          "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&q=80&auto=format&fit=crop",
        options: {},
        quantity: 2,
        unitPrice: 399,
        unitOriginalPrice: 499,
        discount: 200,
        lineTotal: 798,
      },
    ],
    subtotal: 1697,
    discount: 350,
    deliveryOption: "standard",
    deliveryCharge: 0,
    total: 1347,
    deliveryAddress: {
      fullName: "Joseph",
      phone: "9876543210",
      line1: "42, 3rd Cross, Indiranagar",
      line2: "Near 100 Feet Road",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560038",
      country: "India",
    },
    paymentMethod: "Cash on Delivery",
    status: "Shipped",
    statusHistory: [
      {
        status: "Placed",
        at: "2026-09-27T07:55:00.000Z",
      },
      {
        status: "Confirmed",
        at: "2026-09-27T09:30:00.000Z",
      },
      {
        status: "Shipped",
        at: "2026-09-29T12:00:00.000Z",
      },
    ],
    isSample: true,
  },
  {
    orderId: "NIV-2026-000004",
    customerId: "user-joseph",
    orderDate: "2026-10-04T16:10:00.000Z",
    source: "cart",
    items: [
      {
        productId: "gamenight-ludo-and-snakes-and-ladders-2-in-1",
        variantId: "gamenight-ludo-and-snakes-and-ladders-2-in-1",
        productSlug: "gamenight-ludo-and-snakes-and-ladders-2-in-1",
        productName: "Gamenight Ludo & Snakes and Ladders 2-in-1",
        brand: "Gamenight",
        image:
          "https://images.unsplash.com/photo-1629760946220-5693ee4c46ac?w=1200&q=80&auto=format&fit=crop",
        options: {},
        quantity: 1,
        unitPrice: 399,
        unitOriginalPrice: 599,
        discount: 200,
        lineTotal: 399,
      },
    ],
    subtotal: 599,
    discount: 200,
    deliveryOption: "standard",
    deliveryCharge: 40,
    total: 439,
    deliveryAddress: {
      fullName: "Joseph",
      phone: "9876543210",
      line1: "42, 3rd Cross, Indiranagar",
      line2: "Near 100 Feet Road",
      city: "Bengaluru",
      state: "Karnataka",
      postalCode: "560038",
      country: "India",
    },
    paymentMethod: "Cash on Delivery",
    status: "Confirmed",
    statusHistory: [
      {
        status: "Placed",
        at: "2026-10-04T16:10:00.000Z",
      },
      {
        status: "Confirmed",
        at: "2026-10-04T17:00:00.000Z",
      },
    ],
    isSample: true,
  },
];

/** Next order number after the seeded orders. */
export const SEED_ORDER_COUNTER = 4;
