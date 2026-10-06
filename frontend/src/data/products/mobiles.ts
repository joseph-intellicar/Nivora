import type { Product } from "@/domain/types";

/**
 * Mobiles: Smartphones, Mobile Accessories, Cases & Covers, Chargers.
 * Generated mock data (Phase 1). Images: Unsplash (Unsplash License).
 */
export const MOBILES_PRODUCTS: Product[] = [
  {
    id: "samsung-galaxy-s24-ultra",
    slug: "samsung-galaxy-s24-ultra",
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    categoryId: "mobiles",
    subcategoryId: "mobiles-smartphones",
    description:
      "Galaxy AI on a flagship 6.8-inch QHD+ display, a 200 MP camera and built-in S Pen, in a durable titanium frame.",
    images: [
      "https://images.unsplash.com/photo-1592890288564-76628a30a657?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598965402089-897ce52e8355?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.6,
    reviewCount: 8420,
    specifications: [
      {
        label: "Display",
        value: '6.8" QHD+ Dynamic AMOLED 2X, 120 Hz',
      },
      {
        label: "Processor",
        value: "Snapdragon 8 Gen 3",
      },
      {
        label: "Rear camera",
        value: "200 MP + 50 MP + 12 MP + 10 MP",
      },
      {
        label: "Battery",
        value: "5000 mAh",
      },
      {
        label: "OS",
        value: "Android 14",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Titanium Black", "Titanium Gray"],
      },
      {
        name: "RAM",
        values: ["12 GB"],
      },
      {
        name: "Storage",
        values: ["256 GB", "512 GB"],
      },
    ],
    variants: [
      {
        id: "samsung-galaxy-s24-ultra-titanium-black-12-gb-256-gb",
        optionValues: {
          Color: "Titanium Black",
          RAM: "12 GB",
          Storage: "256 GB",
        },
        price: 129999,
        originalPrice: 139999,
        initialStock: 12,
      },
      {
        id: "samsung-galaxy-s24-ultra-titanium-black-12-gb-512-gb",
        optionValues: {
          Color: "Titanium Black",
          RAM: "12 GB",
          Storage: "512 GB",
        },
        price: 139999,
        originalPrice: 149999,
        initialStock: 12,
      },
      {
        id: "samsung-galaxy-s24-ultra-titanium-gray-12-gb-256-gb",
        optionValues: {
          Color: "Titanium Gray",
          RAM: "12 GB",
          Storage: "256 GB",
        },
        price: 129999,
        originalPrice: 139999,
        initialStock: 12,
      },
      {
        id: "samsung-galaxy-s24-ultra-titanium-gray-12-gb-512-gb",
        optionValues: {
          Color: "Titanium Gray",
          RAM: "12 GB",
          Storage: "512 GB",
        },
        price: 139999,
        originalPrice: 149999,
        initialStock: 2,
      },
    ],
    attributes: {},
    tags: ["android", "5g", "flagship", "s pen"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-10-01T10:00:00.000Z",
  },
  {
    id: "apple-iphone-15",
    slug: "apple-iphone-15",
    name: "Apple iPhone 15",
    brand: "Apple",
    categoryId: "mobiles",
    subcategoryId: "mobiles-smartphones",
    description:
      "Dynamic Island, a 48 MP main camera and USB-C, in a colour-infused glass and aluminium design.",
    images: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.7,
    reviewCount: 12560,
    specifications: [
      {
        label: "Display",
        value: '6.1" Super Retina XDR',
      },
      {
        label: "Chip",
        value: "A16 Bionic",
      },
      {
        label: "Rear camera",
        value: "48 MP + 12 MP",
      },
      {
        label: "Connector",
        value: "USB-C",
      },
      {
        label: "OS",
        value: "iOS 17",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Black", "Blue"],
      },
      {
        name: "RAM",
        values: ["6 GB"],
      },
      {
        name: "Storage",
        values: ["128 GB", "256 GB"],
      },
    ],
    variants: [
      {
        id: "apple-iphone-15-black-6-gb-128-gb",
        optionValues: {
          Color: "Black",
          RAM: "6 GB",
          Storage: "128 GB",
        },
        price: 69900,
        originalPrice: 79900,
        initialStock: 15,
      },
      {
        id: "apple-iphone-15-black-6-gb-256-gb",
        optionValues: {
          Color: "Black",
          RAM: "6 GB",
          Storage: "256 GB",
        },
        price: 79900,
        originalPrice: 89900,
        initialStock: 15,
      },
      {
        id: "apple-iphone-15-blue-6-gb-128-gb",
        optionValues: {
          Color: "Blue",
          RAM: "6 GB",
          Storage: "128 GB",
        },
        price: 69900,
        originalPrice: 79900,
        initialStock: 15,
      },
      {
        id: "apple-iphone-15-blue-6-gb-256-gb",
        optionValues: {
          Color: "Blue",
          RAM: "6 GB",
          Storage: "256 GB",
        },
        price: 79900,
        originalPrice: 89900,
        initialStock: 15,
      },
    ],
    attributes: {},
    tags: ["iphone", "ios", "5g"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-09-20T10:00:00.000Z",
  },
  {
    id: "oneplus-12r",
    slug: "oneplus-12r",
    name: "OnePlus 12R",
    brand: "OnePlus",
    categoryId: "mobiles",
    subcategoryId: "mobiles-smartphones",
    description:
      "A buttery-smooth 120 Hz ProXDR display, Snapdragon 8 Gen 2 and 100 W SUPERVOOC charging.",
    images: [
      "https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.4,
    reviewCount: 5210,
    specifications: [
      {
        label: "Display",
        value: '6.78" ProXDR AMOLED, 120 Hz',
      },
      {
        label: "Processor",
        value: "Snapdragon 8 Gen 2",
      },
      {
        label: "Battery",
        value: "5500 mAh, 100 W charging",
      },
      {
        label: "OS",
        value: "OxygenOS (Android 14)",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Iron Gray", "Cool Blue"],
      },
      {
        name: "RAM",
        values: ["8 GB", "16 GB"],
      },
      {
        name: "Storage",
        values: ["128 GB", "256 GB"],
      },
    ],
    variants: [
      {
        id: "oneplus-12r-iron-gray-8-gb-128-gb",
        optionValues: {
          Color: "Iron Gray",
          RAM: "8 GB",
          Storage: "128 GB",
        },
        price: 39999,
        originalPrice: 42999,
        initialStock: 18,
      },
      {
        id: "oneplus-12r-iron-gray-16-gb-256-gb",
        optionValues: {
          Color: "Iron Gray",
          RAM: "16 GB",
          Storage: "256 GB",
        },
        price: 45999,
        originalPrice: 49999,
        initialStock: 18,
      },
      {
        id: "oneplus-12r-cool-blue-8-gb-128-gb",
        optionValues: {
          Color: "Cool Blue",
          RAM: "8 GB",
          Storage: "128 GB",
        },
        price: 39999,
        originalPrice: 42999,
        initialStock: 18,
      },
      {
        id: "oneplus-12r-cool-blue-16-gb-256-gb",
        optionValues: {
          Color: "Cool Blue",
          RAM: "16 GB",
          Storage: "256 GB",
        },
        price: 45999,
        originalPrice: 49999,
        initialStock: 18,
      },
    ],
    attributes: {},
    tags: ["android", "5g", "fast charging"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-01-25T10:00:00.000Z",
  },
  {
    id: "xiaomi-redmi-note-13-pro-5g",
    slug: "xiaomi-redmi-note-13-pro-5g",
    name: "Redmi Note 13 Pro 5G",
    brand: "Xiaomi",
    categoryId: "mobiles",
    subcategoryId: "mobiles-smartphones",
    description: "A 200 MP camera, 1.5K AMOLED display and 67 W turbo charging at a great price.",
    images: [
      "https://images.unsplash.com/photo-1598965402089-897ce52e8355?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592890288564-76628a30a657?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.3,
    reviewCount: 9870,
    specifications: [
      {
        label: "Display",
        value: '6.67" 1.5K AMOLED, 120 Hz',
      },
      {
        label: "Processor",
        value: "Snapdragon 7s Gen 2",
      },
      {
        label: "Rear camera",
        value: "200 MP + 8 MP + 2 MP",
      },
      {
        label: "Battery",
        value: "5100 mAh, 67 W",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Midnight Black", "Ocean Teal"],
      },
      {
        name: "RAM",
        values: ["8 GB", "12 GB"],
      },
      {
        name: "Storage",
        values: ["128 GB", "256 GB"],
      },
    ],
    variants: [
      {
        id: "xiaomi-redmi-note-13-pro-5g-midnight-black-8-gb-128-gb",
        optionValues: {
          Color: "Midnight Black",
          RAM: "8 GB",
          Storage: "128 GB",
        },
        price: 23999,
        originalPrice: 28999,
        initialStock: 20,
      },
      {
        id: "xiaomi-redmi-note-13-pro-5g-midnight-black-8-gb-256-gb",
        optionValues: {
          Color: "Midnight Black",
          RAM: "8 GB",
          Storage: "256 GB",
        },
        price: 25999,
        originalPrice: 30999,
        initialStock: 20,
      },
      {
        id: "xiaomi-redmi-note-13-pro-5g-midnight-black-12-gb-256-gb",
        optionValues: {
          Color: "Midnight Black",
          RAM: "12 GB",
          Storage: "256 GB",
        },
        price: 27999,
        originalPrice: 32999,
        initialStock: 20,
      },
      {
        id: "xiaomi-redmi-note-13-pro-5g-ocean-teal-8-gb-128-gb",
        optionValues: {
          Color: "Ocean Teal",
          RAM: "8 GB",
          Storage: "128 GB",
        },
        price: 23999,
        originalPrice: 28999,
        initialStock: 20,
      },
      {
        id: "xiaomi-redmi-note-13-pro-5g-ocean-teal-8-gb-256-gb",
        optionValues: {
          Color: "Ocean Teal",
          RAM: "8 GB",
          Storage: "256 GB",
        },
        price: 25999,
        originalPrice: 30999,
        initialStock: 20,
      },
      {
        id: "xiaomi-redmi-note-13-pro-5g-ocean-teal-12-gb-256-gb",
        optionValues: {
          Color: "Ocean Teal",
          RAM: "12 GB",
          Storage: "256 GB",
        },
        price: 27999,
        originalPrice: 32999,
        initialStock: 0,
      },
    ],
    attributes: {},
    tags: ["android", "5g", "budget", "redmi", "mi"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-08-14T10:00:00.000Z",
  },
  {
    id: "samsung-galaxy-a35-5g",
    slug: "samsung-galaxy-a35-5g",
    name: "Samsung Galaxy A35 5G",
    brand: "Samsung",
    categoryId: "mobiles",
    subcategoryId: "mobiles-smartphones",
    description:
      "A premium glass design with a 50 MP OIS camera, Super AMOLED display and IP67 protection.",
    images: [
      "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1634403665481-74948d815f03?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.2,
    reviewCount: 3340,
    specifications: [
      {
        label: "Display",
        value: '6.6" Super AMOLED, 120 Hz',
      },
      {
        label: "Processor",
        value: "Exynos 1380",
      },
      {
        label: "Rear camera",
        value: "50 MP OIS + 8 MP + 5 MP",
      },
      {
        label: "Protection",
        value: "IP67",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Awesome Navy", "Awesome Lilac"],
      },
      {
        name: "RAM",
        values: ["8 GB"],
      },
      {
        name: "Storage",
        values: ["128 GB", "256 GB"],
      },
    ],
    variants: [
      {
        id: "samsung-galaxy-a35-5g-awesome-navy-8-gb-128-gb",
        optionValues: {
          Color: "Awesome Navy",
          RAM: "8 GB",
          Storage: "128 GB",
        },
        price: 30999,
        originalPrice: 33999,
        initialStock: 16,
      },
      {
        id: "samsung-galaxy-a35-5g-awesome-navy-8-gb-256-gb",
        optionValues: {
          Color: "Awesome Navy",
          RAM: "8 GB",
          Storage: "256 GB",
        },
        price: 33999,
        originalPrice: 36999,
        initialStock: 16,
      },
      {
        id: "samsung-galaxy-a35-5g-awesome-lilac-8-gb-128-gb",
        optionValues: {
          Color: "Awesome Lilac",
          RAM: "8 GB",
          Storage: "128 GB",
        },
        price: 30999,
        originalPrice: 33999,
        initialStock: 16,
      },
      {
        id: "samsung-galaxy-a35-5g-awesome-lilac-8-gb-256-gb",
        optionValues: {
          Color: "Awesome Lilac",
          RAM: "8 GB",
          Storage: "256 GB",
        },
        price: 33999,
        originalPrice: 36999,
        initialStock: 16,
      },
    ],
    attributes: {},
    tags: ["android", "5g", "galaxy"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-02-17T10:00:00.000Z",
  },
  {
    id: "google-pixel-8a",
    slug: "google-pixel-8a",
    name: "Google Pixel 8a",
    brand: "Google",
    categoryId: "mobiles",
    subcategoryId: "mobiles-smartphones",
    description:
      "Google AI, the brilliant Pixel camera and the Tensor G3 chip, with 7 years of updates.",
    images: [
      "https://images.unsplash.com/photo-1634403665481-74948d815f03?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.5,
    reviewCount: 1980,
    specifications: [
      {
        label: "Display",
        value: '6.1" Actua OLED, 120 Hz',
      },
      {
        label: "Chip",
        value: "Google Tensor G3",
      },
      {
        label: "Rear camera",
        value: "64 MP + 13 MP",
      },
      {
        label: "Updates",
        value: "7 years of OS updates",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Obsidian", "Porcelain"],
      },
      {
        name: "RAM",
        values: ["8 GB"],
      },
      {
        name: "Storage",
        values: ["128 GB"],
      },
    ],
    variants: [
      {
        id: "google-pixel-8a-obsidian-8-gb-128-gb",
        optionValues: {
          Color: "Obsidian",
          RAM: "8 GB",
          Storage: "128 GB",
        },
        price: 52999,
        originalPrice: 59999,
        initialStock: 8,
      },
      {
        id: "google-pixel-8a-porcelain-8-gb-128-gb",
        optionValues: {
          Color: "Porcelain",
          RAM: "8 GB",
          Storage: "128 GB",
        },
        price: 52999,
        originalPrice: 59999,
        initialStock: 3,
      },
    ],
    attributes: {},
    tags: ["android", "pixel", "5g", "google"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-09-10T10:00:00.000Z",
  },
  {
    id: "motorola-edge-50-fusion",
    slug: "motorola-edge-50-fusion",
    name: "Motorola Edge 50 Fusion",
    brand: "Motorola",
    categoryId: "mobiles",
    subcategoryId: "mobiles-smartphones",
    description: "A curved pOLED display, vegan leather finish and 68 W TurboPower charging.",
    images: [
      "https://images.unsplash.com/photo-1583291023438-41cef6453b1f?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.1,
    reviewCount: 2760,
    specifications: [
      {
        label: "Display",
        value: '6.7" curved pOLED, 144 Hz',
      },
      {
        label: "Processor",
        value: "Snapdragon 7s Gen 2",
      },
      {
        label: "Battery",
        value: "5000 mAh, 68 W",
      },
      {
        label: "Protection",
        value: "IP68",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Forest Blue", "Hot Pink"],
      },
      {
        name: "RAM",
        values: ["8 GB", "12 GB"],
      },
      {
        name: "Storage",
        values: ["128 GB", "256 GB"],
      },
    ],
    variants: [
      {
        id: "motorola-edge-50-fusion-forest-blue-8-gb-128-gb",
        optionValues: {
          Color: "Forest Blue",
          RAM: "8 GB",
          Storage: "128 GB",
        },
        price: 22999,
        originalPrice: 25999,
        initialStock: 14,
      },
      {
        id: "motorola-edge-50-fusion-forest-blue-12-gb-256-gb",
        optionValues: {
          Color: "Forest Blue",
          RAM: "12 GB",
          Storage: "256 GB",
        },
        price: 24999,
        originalPrice: 27999,
        initialStock: 14,
      },
      {
        id: "motorola-edge-50-fusion-hot-pink-8-gb-128-gb",
        optionValues: {
          Color: "Hot Pink",
          RAM: "8 GB",
          Storage: "128 GB",
        },
        price: 22999,
        originalPrice: 25999,
        initialStock: 14,
      },
      {
        id: "motorola-edge-50-fusion-hot-pink-12-gb-256-gb",
        optionValues: {
          Color: "Hot Pink",
          RAM: "12 GB",
          Storage: "256 GB",
        },
        price: 24999,
        originalPrice: 27999,
        initialStock: 14,
      },
    ],
    attributes: {},
    tags: ["android", "5g", "moto"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-08-24T10:00:00.000Z",
  },
  {
    id: "realme-narzo-70-pro-5g",
    slug: "realme-narzo-70-pro-5g",
    name: "realme Narzo 70 Pro 5G",
    brand: "realme",
    categoryId: "mobiles",
    subcategoryId: "mobiles-smartphones",
    description:
      "A 50 MP Sony camera with OIS and a 120 Hz AMOLED display, built for everyday performance.",
    images: [
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1672413514634-4781b15fd89e?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.0,
    reviewCount: 1544,
    specifications: [
      {
        label: "Display",
        value: '6.67" AMOLED, 120 Hz',
      },
      {
        label: "Processor",
        value: "Dimensity 7050",
      },
      {
        label: "Battery",
        value: "5000 mAh, 67 W",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Glass Green"],
      },
      {
        name: "RAM",
        values: ["8 GB"],
      },
      {
        name: "Storage",
        values: ["128 GB"],
      },
    ],
    variants: [
      {
        id: "realme-narzo-70-pro-5g-glass-green-8-gb-128-gb",
        optionValues: {
          Color: "Glass Green",
          RAM: "8 GB",
          Storage: "128 GB",
        },
        price: 19999,
        originalPrice: 21999,
        initialStock: 0,
      },
    ],
    attributes: {},
    tags: ["android", "5g", "realme"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-12-05T10:00:00.000Z",
  },
  {
    id: "apple-airpods-3rd-generation",
    slug: "apple-airpods-3rd-generation",
    name: "Apple AirPods (3rd Generation)",
    brand: "Apple",
    categoryId: "mobiles",
    subcategoryId: "mobiles-mobile-accessories",
    description:
      "Spatial audio with dynamic head tracking, sweat and water resistance, and up to 30 hours with the case.",
    images: [
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.6,
    reviewCount: 6420,
    specifications: [
      {
        label: "Type",
        value: "True wireless earbuds",
      },
      {
        label: "Battery",
        value: "Up to 30 hours with case",
      },
      {
        label: "Resistance",
        value: "IPX4",
      },
      {
        label: "Connectivity",
        value: "Bluetooth 5.0",
      },
    ],
    options: [],
    variants: [
      {
        id: "apple-airpods-3rd-generation",
        optionValues: {},
        price: 17900,
        originalPrice: 19900,
        initialStock: 10,
      },
    ],
    attributes: {},
    tags: ["earbuds", "airpods", "wireless", "tws", "apple"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-09-02T10:00:00.000Z",
  },
  {
    id: "boat-airdopes-141-tws-earbuds",
    slug: "boat-airdopes-141-tws-earbuds",
    name: "boAt Airdopes 141 TWS Earbuds",
    brand: "boAt",
    categoryId: "mobiles",
    subcategoryId: "mobiles-mobile-accessories",
    description:
      "Up to 42 hours of playback, low-latency gaming mode and ENx noise cancellation for calls.",
    images: [
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.1,
    reviewCount: 24500,
    specifications: [
      {
        label: "Type",
        value: "True wireless earbuds",
      },
      {
        label: "Battery",
        value: "Up to 42 hours",
      },
      {
        label: "Charging",
        value: "USB-C, fast charge",
      },
      {
        label: "Resistance",
        value: "IPX4",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Bold Black", "Cyan Blue"],
      },
    ],
    variants: [
      {
        id: "boat-airdopes-141-tws-earbuds-bold-black",
        optionValues: {
          Color: "Bold Black",
        },
        price: 899,
        originalPrice: 4490,
        initialStock: 40,
      },
      {
        id: "boat-airdopes-141-tws-earbuds-cyan-blue",
        optionValues: {
          Color: "Cyan Blue",
        },
        price: 899,
        originalPrice: 4490,
        initialStock: 40,
      },
    ],
    attributes: {},
    tags: ["earbuds", "wireless", "tws", "budget"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-07-12T10:00:00.000Z",
  },
  {
    id: "sony-wh-1000xm5-wireless-headphones",
    slug: "sony-wh-1000xm5-wireless-headphones",
    name: "Sony WH-1000XM5 Wireless Headphones",
    brand: "Sony",
    categoryId: "mobiles",
    subcategoryId: "mobiles-mobile-accessories",
    description:
      "Industry-leading noise cancellation, 30-hour battery and exceptional call quality in a lightweight design.",
    images: [
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.7,
    reviewCount: 3110,
    specifications: [
      {
        label: "Type",
        value: "Over-ear, wireless",
      },
      {
        label: "Noise cancellation",
        value: "Active (ANC)",
      },
      {
        label: "Battery",
        value: "Up to 30 hours",
      },
      {
        label: "Charging",
        value: "USB-C, 3 min = 3 hours",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Black", "Silver"],
      },
    ],
    variants: [
      {
        id: "sony-wh-1000xm5-wireless-headphones-black",
        optionValues: {
          Color: "Black",
        },
        price: 26990,
        originalPrice: 34990,
        initialStock: 6,
      },
      {
        id: "sony-wh-1000xm5-wireless-headphones-silver",
        optionValues: {
          Color: "Silver",
        },
        price: 26990,
        originalPrice: 34990,
        initialStock: 2,
      },
    ],
    attributes: {},
    tags: ["headphones", "noise cancelling", "anc", "wireless"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-01-08T10:00:00.000Z",
  },
  {
    id: "soundpulse-wireless-on-ear-headphones",
    slug: "soundpulse-wireless-on-ear-headphones",
    name: "SoundPulse Wireless On-Ear Headphones",
    brand: "SoundPulse",
    categoryId: "mobiles",
    subcategoryId: "mobiles-mobile-accessories",
    description:
      "Lightweight foldable headphones with deep bass, a built-in mic and 35-hour battery life.",
    images: [
      "https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.0,
    reviewCount: 1840,
    specifications: [
      {
        label: "Type",
        value: "On-ear, wireless",
      },
      {
        label: "Battery",
        value: "Up to 35 hours",
      },
      {
        label: "Mic",
        value: "Built-in",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Pink", "Black"],
      },
    ],
    variants: [
      {
        id: "soundpulse-wireless-on-ear-headphones-pink",
        optionValues: {
          Color: "Pink",
        },
        price: 1999,
        originalPrice: 3999,
        initialStock: 25,
      },
      {
        id: "soundpulse-wireless-on-ear-headphones-black",
        optionValues: {
          Color: "Black",
        },
        price: 1999,
        originalPrice: 3999,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["headphones", "wireless", "bluetooth"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-09-05T10:00:00.000Z",
  },
  {
    id: "noise-colorfit-pro-5-smartwatch",
    slug: "noise-colorfit-pro-5-smartwatch",
    name: "Noise ColorFit Pro 5 Smartwatch",
    brand: "Noise",
    categoryId: "mobiles",
    subcategoryId: "mobiles-mobile-accessories",
    description:
      "A 1.85-inch AMOLED smartwatch with Bluetooth calling, 100+ sports modes and 7-day battery.",
    images: [
      "https://images.unsplash.com/photo-1624096104992-9b4fa3a279dd?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.2,
    reviewCount: 7650,
    specifications: [
      {
        label: "Display",
        value: '1.85" AMOLED',
      },
      {
        label: "Calling",
        value: "Bluetooth calling",
      },
      {
        label: "Battery",
        value: "Up to 7 days",
      },
      {
        label: "Water resistance",
        value: "IP68",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Jet Black", "Silver Grey"],
      },
    ],
    variants: [
      {
        id: "noise-colorfit-pro-5-smartwatch-jet-black",
        optionValues: {
          Color: "Jet Black",
        },
        price: 3499,
        originalPrice: 6999,
        initialStock: 25,
      },
      {
        id: "noise-colorfit-pro-5-smartwatch-silver-grey",
        optionValues: {
          Color: "Silver Grey",
        },
        price: 3499,
        originalPrice: 6999,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["smartwatch", "watch", "fitness", "wearable"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-10-22T10:00:00.000Z",
  },
  {
    id: "samsung-galaxy-watch6-40mm",
    slug: "samsung-galaxy-watch6-40mm",
    name: "Samsung Galaxy Watch6 (40mm)",
    brand: "Samsung",
    categoryId: "mobiles",
    subcategoryId: "mobiles-mobile-accessories",
    description:
      "Advanced sleep coaching, body composition and heart monitoring in a slimmer design.",
    images: [
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.5,
    reviewCount: 1420,
    specifications: [
      {
        label: "Display",
        value: '1.3" Super AMOLED',
      },
      {
        label: "Connectivity",
        value: "Bluetooth",
      },
      {
        label: "Water resistance",
        value: "5ATM + IP68",
      },
    ],
    options: [],
    variants: [
      {
        id: "samsung-galaxy-watch6-40mm",
        optionValues: {},
        price: 24999,
        originalPrice: 32999,
        initialStock: 7,
      },
    ],
    attributes: {},
    tags: ["smartwatch", "galaxy watch", "wearable"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-03-11T10:00:00.000Z",
  },
  {
    id: "ambrane-20000-mah-power-bank",
    slug: "ambrane-20000-mah-power-bank",
    name: "Ambrane 20000 mAh Power Bank",
    brand: "Ambrane",
    categoryId: "mobiles",
    subcategoryId: "mobiles-mobile-accessories",
    description: "Charge your phone up to 4 times with 22.5 W fast charging and dual outputs.",
    images: [
      "https://images.unsplash.com/photo-1566554738544-d962991c3fee?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592318348310-f31b61a931c8?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.3,
    reviewCount: 11200,
    specifications: [
      {
        label: "Capacity",
        value: "20000 mAh",
      },
      {
        label: "Output",
        value: "22.5 W fast charging",
      },
      {
        label: "Ports",
        value: "2 × USB-A, 1 × USB-C",
      },
    ],
    options: [],
    variants: [
      {
        id: "ambrane-20000-mah-power-bank",
        optionValues: {},
        price: 1499,
        originalPrice: 2499,
        initialStock: 3,
      },
    ],
    attributes: {},
    tags: ["power bank", "powerbank", "portable charger"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-11-19T10:00:00.000Z",
  },
  {
    id: "portronics-pure-sound-wired-earphones",
    slug: "portronics-pure-sound-wired-earphones",
    name: "Portronics Pure Sound Wired Earphones",
    brand: "Portronics",
    categoryId: "mobiles",
    subcategoryId: "mobiles-mobile-accessories",
    description: "Tangle-free wired earphones with an in-line mic and rich, balanced sound.",
    images: [
      "https://images.unsplash.com/photo-1632200004922-bc18602c79fc?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 3.9,
    reviewCount: 3870,
    specifications: [
      {
        label: "Type",
        value: "In-ear, wired",
      },
      {
        label: "Connector",
        value: "3.5 mm",
      },
      {
        label: "Mic",
        value: "In-line",
      },
    ],
    options: [],
    variants: [
      {
        id: "portronics-pure-sound-wired-earphones",
        optionValues: {},
        price: 399,
        originalPrice: 599,
        initialStock: 50,
      },
    ],
    attributes: {},
    tags: ["earphones", "wired", "budget"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-06-30T10:00:00.000Z",
  },
  {
    id: "shieldify-clear-armor-case",
    slug: "shieldify-clear-armor-case",
    name: "Shieldify Clear Armor Case",
    brand: "Shieldify",
    categoryId: "mobiles",
    subcategoryId: "mobiles-cases-covers",
    description:
      "Crystal-clear protection with shock-absorbing corners that won't yellow over time.",
    images: [
      "https://images.unsplash.com/photo-1711033312367-247626a984d1?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1623393884989-cb3663e431c5?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.2,
    reviewCount: 6210,
    specifications: [
      {
        label: "Material",
        value: "TPU + polycarbonate",
      },
      {
        label: "Protection",
        value: "Military-grade drop tested",
      },
      {
        label: "Wireless charging",
        value: "Compatible",
      },
    ],
    options: [
      {
        name: "Model",
        values: ["iPhone 15", "Galaxy S24 Ultra", "OnePlus 12R"],
      },
    ],
    variants: [
      {
        id: "shieldify-clear-armor-case-iphone-15",
        optionValues: {
          Model: "iPhone 15",
        },
        price: 499,
        originalPrice: 999,
        initialStock: 35,
      },
      {
        id: "shieldify-clear-armor-case-galaxy-s24-ultra",
        optionValues: {
          Model: "Galaxy S24 Ultra",
        },
        price: 499,
        originalPrice: 999,
        initialStock: 35,
      },
      {
        id: "shieldify-clear-armor-case-oneplus-12r",
        optionValues: {
          Model: "OnePlus 12R",
        },
        price: 499,
        originalPrice: 999,
        initialStock: 35,
      },
    ],
    attributes: {},
    tags: ["case", "cover", "clear", "phone case"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-09-15T10:00:00.000Z",
  },
  {
    id: "shieldify-silicone-soft-case",
    slug: "shieldify-silicone-soft-case",
    name: "Shieldify Silicone Soft Case",
    brand: "Shieldify",
    categoryId: "mobiles",
    subcategoryId: "mobiles-cases-covers",
    description:
      "A soft-touch liquid silicone case with a microfibre lining to protect your phone's finish.",
    images: [
      "https://images.unsplash.com/photo-1535157412991-2ef801c1748b?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542219550-76864b1bc385?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1547658718-f4311ad64746?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.3,
    reviewCount: 2980,
    specifications: [
      {
        label: "Material",
        value: "Liquid silicone",
      },
      {
        label: "Lining",
        value: "Microfibre",
      },
      {
        label: "Compatible",
        value: "iPhone 15",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Blue", "Pink", "Black"],
      },
    ],
    variants: [
      {
        id: "shieldify-silicone-soft-case-blue",
        optionValues: {
          Color: "Blue",
        },
        price: 399,
        originalPrice: 799,
        initialStock: 25,
      },
      {
        id: "shieldify-silicone-soft-case-pink",
        optionValues: {
          Color: "Pink",
        },
        price: 399,
        originalPrice: 799,
        initialStock: 2,
      },
      {
        id: "shieldify-silicone-soft-case-black",
        optionValues: {
          Color: "Black",
        },
        price: 399,
        originalPrice: 799,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["case", "cover", "silicone", "iphone"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-12-12T10:00:00.000Z",
  },
  {
    id: "leatherworks-premium-leather-back-cover",
    slug: "leatherworks-premium-leather-back-cover",
    name: "Leatherworks Premium Leather Back Cover",
    brand: "Leatherworks",
    categoryId: "mobiles",
    subcategoryId: "mobiles-cases-covers",
    description: "Handcrafted genuine leather back cover that develops a rich patina with use.",
    images: [
      "https://images.unsplash.com/photo-1620786963525-4a74f1697a46?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.5,
    reviewCount: 640,
    specifications: [
      {
        label: "Material",
        value: "Genuine leather",
      },
      {
        label: "Finish",
        value: "Tan orange",
      },
    ],
    options: [
      {
        name: "Model",
        values: ["iPhone 15", "Galaxy S24 Ultra"],
      },
    ],
    variants: [
      {
        id: "leatherworks-premium-leather-back-cover-iphone-15",
        optionValues: {
          Model: "iPhone 15",
        },
        price: 1299,
        originalPrice: 1999,
        initialStock: 25,
      },
      {
        id: "leatherworks-premium-leather-back-cover-galaxy-s24-ultra",
        optionValues: {
          Model: "Galaxy S24 Ultra",
        },
        price: 1299,
        originalPrice: 1999,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["case", "cover", "leather", "premium"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-09-07T10:00:00.000Z",
  },
  {
    id: "shieldify-rugged-kickstand-case",
    slug: "shieldify-rugged-kickstand-case",
    name: "Shieldify Rugged Kickstand Case",
    brand: "Shieldify",
    categoryId: "mobiles",
    subcategoryId: "mobiles-cases-covers",
    description: "Dual-layer rugged protection with a built-in kickstand for hands-free viewing.",
    images: [
      "https://images.unsplash.com/photo-1623393835885-560a7c576aa2?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1623393937972-4b3102ba8c23?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.0,
    reviewCount: 1410,
    specifications: [
      {
        label: "Material",
        value: "TPU + polycarbonate",
      },
      {
        label: "Feature",
        value: "Kickstand",
      },
    ],
    options: [
      {
        name: "Model",
        values: ["Galaxy A35 5G", "Redmi Note 13 Pro 5G"],
      },
    ],
    variants: [
      {
        id: "shieldify-rugged-kickstand-case-galaxy-a35-5g",
        optionValues: {
          Model: "Galaxy A35 5G",
        },
        price: 699,
        originalPrice: 1299,
        initialStock: 25,
      },
      {
        id: "shieldify-rugged-kickstand-case-redmi-note-13-pro-5g",
        optionValues: {
          Model: "Redmi Note 13 Pro 5G",
        },
        price: 699,
        originalPrice: 1299,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["case", "rugged", "kickstand"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-02-26T10:00:00.000Z",
  },
  {
    id: "spigen-ultra-hybrid-case",
    slug: "spigen-ultra-hybrid-case",
    name: "Spigen Ultra Hybrid Case",
    brand: "Spigen",
    categoryId: "mobiles",
    subcategoryId: "mobiles-cases-covers",
    description:
      "A slim hybrid case with air-cushion technology and raised lips for screen and camera.",
    images: [
      "https://images.unsplash.com/photo-1514575110897-1253ff7b2ccb?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1621330396167-b3d451b9b83b?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.4,
    reviewCount: 3720,
    specifications: [
      {
        label: "Material",
        value: "TPU + polycarbonate",
      },
      {
        label: "Feature",
        value: "Air Cushion corners",
      },
    ],
    options: [
      {
        name: "Model",
        values: ["iPhone 15", "Galaxy S24 Ultra"],
      },
    ],
    variants: [
      {
        id: "spigen-ultra-hybrid-case-iphone-15",
        optionValues: {
          Model: "iPhone 15",
        },
        price: 1099,
        originalPrice: 1899,
        initialStock: 25,
      },
      {
        id: "spigen-ultra-hybrid-case-galaxy-s24-ultra",
        optionValues: {
          Model: "Galaxy S24 Ultra",
        },
        price: 1099,
        originalPrice: 1899,
        initialStock: 0,
      },
    ],
    attributes: {},
    tags: ["case", "cover", "spigen"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-10-30T10:00:00.000Z",
  },
  {
    id: "shieldify-wallet-flip-cover",
    slug: "shieldify-wallet-flip-cover",
    name: "Shieldify Wallet Flip Cover",
    brand: "Shieldify",
    categoryId: "mobiles",
    subcategoryId: "mobiles-cases-covers",
    description: "A faux-leather flip cover with card slots and a magnetic clasp.",
    images: [
      "https://images.unsplash.com/photo-1623393937972-4b3102ba8c23?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1711033312367-247626a984d1?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 3.8,
    reviewCount: 520,
    specifications: [
      {
        label: "Material",
        value: "Faux leather",
      },
      {
        label: "Feature",
        value: "2 card slots",
      },
    ],
    options: [
      {
        name: "Model",
        values: ["Redmi Note 13 Pro 5G"],
      },
    ],
    variants: [
      {
        id: "shieldify-wallet-flip-cover-redmi-note-13-pro-5g",
        optionValues: {
          Model: "Redmi Note 13 Pro 5G",
        },
        price: 599,
        originalPrice: 999,
        initialStock: 0,
      },
    ],
    attributes: {},
    tags: ["flip cover", "wallet case", "cover"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-01-03T10:00:00.000Z",
  },
  {
    id: "apple-20w-usb-c-power-adapter",
    slug: "apple-20w-usb-c-power-adapter",
    name: "Apple 20W USB-C Power Adapter",
    brand: "Apple",
    categoryId: "mobiles",
    subcategoryId: "mobiles-chargers",
    description:
      "Fast, efficient charging at home, in the office or on the go. Cable sold separately.",
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586254116951-5263e2cdb44c?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.6,
    reviewCount: 5140,
    specifications: [
      {
        label: "Output",
        value: "20 W USB-C PD",
      },
      {
        label: "Compatibility",
        value: "iPhone, iPad, AirPods",
      },
    ],
    options: [],
    variants: [
      {
        id: "apple-20w-usb-c-power-adapter",
        optionValues: {},
        price: 1900,
        originalPrice: 1900,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["charger", "adapter", "usb-c", "apple", "fast charging"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-08-03T10:00:00.000Z",
  },
  {
    id: "samsung-25w-super-fast-charger",
    slug: "samsung-25w-super-fast-charger",
    name: "Samsung 25W Super Fast Charger",
    brand: "Samsung",
    categoryId: "mobiles",
    subcategoryId: "mobiles-chargers",
    description: "Super Fast Charging for Galaxy devices with a USB-C to USB-C cable included.",
    images: [
      "https://images.unsplash.com/photo-1627886107121-b7daaede3974?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1725304382197-663ae3864750?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.4,
    reviewCount: 4230,
    specifications: [
      {
        label: "Output",
        value: "25 W PD 3.0",
      },
      {
        label: "Cable",
        value: "USB-C to USB-C included",
      },
    ],
    options: [],
    variants: [
      {
        id: "samsung-25w-super-fast-charger",
        optionValues: {},
        price: 1299,
        originalPrice: 1999,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["charger", "adapter", "usb-c", "fast charging", "galaxy"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-11-28T10:00:00.000Z",
  },
  {
    id: "ambrane-65w-gan-fast-charger",
    slug: "ambrane-65w-gan-fast-charger",
    name: "Ambrane 65W GaN Fast Charger",
    brand: "Ambrane",
    categoryId: "mobiles",
    subcategoryId: "mobiles-chargers",
    description:
      "A compact GaN charger with three ports that can power a laptop and phone together.",
    images: [
      "https://images.unsplash.com/photo-1725304382197-663ae3864750?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1627886107121-b7daaede3974?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.3,
    reviewCount: 860,
    specifications: [
      {
        label: "Output",
        value: "65 W total",
      },
      {
        label: "Ports",
        value: "2 × USB-C, 1 × USB-A",
      },
      {
        label: "Technology",
        value: "GaN",
      },
    ],
    options: [],
    variants: [
      {
        id: "ambrane-65w-gan-fast-charger",
        optionValues: {},
        price: 2199,
        originalPrice: 3999,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["charger", "gan", "laptop charger", "fast charging"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-09-14T10:00:00.000Z",
  },
  {
    id: "volton-braided-usb-c-cable-1-5-m",
    slug: "volton-braided-usb-c-cable-1-5-m",
    name: "Volton Braided USB-C Cable (1.5 m)",
    brand: "Volton",
    categoryId: "mobiles",
    subcategoryId: "mobiles-chargers",
    description: "A tough nylon-braided cable with 60 W fast charging and 480 Mbps data transfer.",
    images: [
      "https://images.unsplash.com/photo-1572721546624-05bf65ad7679?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603539444875-76e7684265f6?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.1,
    reviewCount: 7720,
    specifications: [
      {
        label: "Length",
        value: "1.5 m",
      },
      {
        label: "Power",
        value: "60 W",
      },
      {
        label: "Build",
        value: "Nylon braided",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Orange", "Black"],
      },
    ],
    variants: [
      {
        id: "volton-braided-usb-c-cable-1-5-m-orange",
        optionValues: {
          Color: "Orange",
        },
        price: 349,
        originalPrice: 699,
        initialStock: 60,
      },
      {
        id: "volton-braided-usb-c-cable-1-5-m-black",
        optionValues: {
          Color: "Black",
        },
        price: 349,
        originalPrice: 699,
        initialStock: 60,
      },
    ],
    attributes: {},
    tags: ["cable", "usb-c", "charging cable"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-07-08T10:00:00.000Z",
  },
  {
    id: "volton-15w-wireless-charging-pad",
    slug: "volton-15w-wireless-charging-pad",
    name: "Volton 15W Wireless Charging Pad",
    brand: "Volton",
    categoryId: "mobiles",
    subcategoryId: "mobiles-chargers",
    description: "Place-and-charge convenience for any Qi-enabled phone, with a non-slip surface.",
    images: [
      "https://images.unsplash.com/photo-1545235616-db3cd822ad8c?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.0,
    reviewCount: 1960,
    specifications: [
      {
        label: "Output",
        value: "15 W Qi",
      },
      {
        label: "Compatibility",
        value: "Qi-enabled phones",
      },
    ],
    options: [],
    variants: [
      {
        id: "volton-15w-wireless-charging-pad",
        optionValues: {},
        price: 999,
        originalPrice: 1999,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["wireless charger", "charging pad", "qi"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-03-20T10:00:00.000Z",
  },
  {
    id: "volton-lightning-to-usb-c-cable-1-m",
    slug: "volton-lightning-to-usb-c-cable-1-m",
    name: "Volton Lightning to USB-C Cable (1 m)",
    brand: "Volton",
    categoryId: "mobiles",
    subcategoryId: "mobiles-chargers",
    description: "MFi-certified cable for fast charging older iPhones with a USB-C adapter.",
    images: [
      "https://images.unsplash.com/photo-1499033300314-43c811cff6d5?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1731616103600-3fe7ccdc5a59?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 3.9,
    reviewCount: 1230,
    specifications: [
      {
        label: "Length",
        value: "1 m",
      },
      {
        label: "Certification",
        value: "MFi",
      },
    ],
    options: [],
    variants: [
      {
        id: "volton-lightning-to-usb-c-cable-1-m",
        optionValues: {},
        price: 449,
        originalPrice: 899,
        initialStock: 3,
      },
    ],
    attributes: {},
    tags: ["cable", "lightning", "iphone cable"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-10-14T10:00:00.000Z",
  },
  {
    id: "volton-universal-travel-adapter",
    slug: "volton-universal-travel-adapter",
    name: "Volton Universal Travel Adapter",
    brand: "Volton",
    categoryId: "mobiles",
    subcategoryId: "mobiles-chargers",
    description: "One adapter for 150+ countries, with two USB ports and surge protection.",
    images: [
      "https://images.unsplash.com/photo-1517320069935-381614f8c1e5?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586254116951-5263e2cdb44c?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.2,
    reviewCount: 980,
    specifications: [
      {
        label: "Plugs",
        value: "UK, US, EU, AU",
      },
      {
        label: "USB",
        value: "2 × USB-A",
      },
    ],
    options: [],
    variants: [
      {
        id: "volton-universal-travel-adapter",
        optionValues: {},
        price: 899,
        originalPrice: 1299,
        initialStock: 0,
      },
    ],
    attributes: {},
    tags: ["travel adapter", "adapter", "plug"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-02-09T10:00:00.000Z",
  },
];
