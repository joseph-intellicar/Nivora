import type { Product } from "@/domain/types";

/**
 * Beauty: Skincare, Haircare, Makeup, Fragrances, Personal Care.
 * Generated mock data (Phase 1). Images: Unsplash (Unsplash License).
 */
export const BEAUTY_PRODUCTS: Product[] = [
  {
    id: "dewra-10-niacinamide-face-serum",
    slug: "dewra-10-niacinamide-face-serum",
    name: "Dewra 10% Niacinamide Face Serum",
    brand: "Dewra",
    categoryId: "beauty",
    subcategoryId: "beauty-skincare",
    description:
      "Minimises the look of pores and evens skin tone with 10% niacinamide and 1% zinc.",
    images: [
      "https://images.unsplash.com/photo-1620916297397-a4a5402a3c6c?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1748543668676-ea8241cb3886?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.3,
    reviewCount: 9420,
    specifications: [
      {
        label: "Volume",
        value: "30 ml",
      },
      {
        label: "Key ingredients",
        value: "Niacinamide, Zinc",
      },
      {
        label: "Skin concern",
        value: "Pores, uneven tone",
      },
    ],
    options: [],
    variants: [
      {
        id: "dewra-10-niacinamide-face-serum",
        optionValues: {},
        price: 549,
        originalPrice: 699,
        initialStock: 60,
      },
    ],
    attributes: {
      productType: "Serum",
      skinHairType: ["Oily", "Combination"],
    },
    tags: ["serum", "niacinamide", "skincare", "face"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-08-15T10:00:00.000Z",
  },
  {
    id: "dewra-hydra-boost-gel-moisturiser",
    slug: "dewra-hydra-boost-gel-moisturiser",
    name: "Dewra Hydra Boost Gel Moisturiser",
    brand: "Dewra",
    categoryId: "beauty",
    subcategoryId: "beauty-skincare",
    description: "An oil-free gel moisturiser with hyaluronic acid for 72-hour hydration.",
    images: [
      "https://images.unsplash.com/photo-1616750819456-5cdee9b85d22?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1638609927040-8a7e97cd9d6a?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.4,
    reviewCount: 7310,
    specifications: [
      {
        label: "Volume",
        value: "50 g",
      },
      {
        label: "Key ingredients",
        value: "Hyaluronic acid",
      },
      {
        label: "Texture",
        value: "Gel",
      },
    ],
    options: [],
    variants: [
      {
        id: "dewra-hydra-boost-gel-moisturiser",
        optionValues: {},
        price: 449,
        originalPrice: 599,
        initialStock: 50,
      },
    ],
    attributes: {
      productType: "Moisturiser",
      skinHairType: ["All Skin Types"],
    },
    tags: ["moisturiser", "moisturizer", "hydrating", "skincare"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-10-02T10:00:00.000Z",
  },
  {
    id: "sunveil-spf-50-pa-sunscreen",
    slug: "sunveil-spf-50-pa-sunscreen",
    name: "Sunveil SPF 50 PA++++ Sunscreen",
    brand: "Sunveil",
    categoryId: "beauty",
    subcategoryId: "beauty-skincare",
    description: "A lightweight, no white-cast sunscreen with broad-spectrum protection.",
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1620917669809-1af0497965de?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.2,
    reviewCount: 11800,
    specifications: [
      {
        label: "Volume",
        value: "50 g",
      },
      {
        label: "SPF",
        value: "50, PA++++",
      },
      {
        label: "Finish",
        value: "Matte",
      },
    ],
    options: [],
    variants: [
      {
        id: "sunveil-spf-50-pa-sunscreen",
        optionValues: {},
        price: 399,
        originalPrice: 499,
        initialStock: 25,
      },
    ],
    attributes: {
      productType: "Sunscreen",
      skinHairType: ["All Skin Types"],
    },
    tags: ["sunscreen", "spf", "sun protection"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-07-05T10:00:00.000Z",
  },
  {
    id: "velvessa-vitamin-c-glow-kit",
    slug: "velvessa-vitamin-c-glow-kit",
    name: "Velvessa Vitamin C Glow Kit",
    brand: "Velvessa",
    categoryId: "beauty",
    subcategoryId: "beauty-skincare",
    description: "A three-step routine: vitamin C cleanser, serum and cream for a radiant glow.",
    images: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.5,
    reviewCount: 1460,
    specifications: [
      {
        label: "Contents",
        value: "Cleanser, Serum, Cream",
      },
      {
        label: "Key ingredients",
        value: "Vitamin C, Ferulic acid",
      },
    ],
    options: [],
    variants: [
      {
        id: "velvessa-vitamin-c-glow-kit",
        optionValues: {},
        price: 1299,
        originalPrice: 1999,
        initialStock: 25,
      },
    ],
    attributes: {
      productType: "Kit",
      skinHairType: ["Normal", "Dry"],
    },
    tags: ["vitamin c", "kit", "glow", "gift"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-09-04T10:00:00.000Z",
  },
  {
    id: "dewra-gentle-foaming-face-wash",
    slug: "dewra-gentle-foaming-face-wash",
    name: "Dewra Gentle Foaming Face Wash",
    brand: "Dewra",
    categoryId: "beauty",
    subcategoryId: "beauty-skincare",
    description: "A soap-free face wash with ceramides that cleans without stripping.",
    images: [
      "https://images.unsplash.com/photo-1620917669809-1af0497965de?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1616750819456-5cdee9b85d22?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.1,
    reviewCount: 5600,
    specifications: [
      {
        label: "Volume",
        value: "100 ml",
      },
      {
        label: "Key ingredients",
        value: "Ceramides",
      },
      {
        label: "pH",
        value: "5.5",
      },
    ],
    options: [],
    variants: [
      {
        id: "dewra-gentle-foaming-face-wash",
        optionValues: {},
        price: 299,
        originalPrice: 349,
        initialStock: 25,
      },
    ],
    attributes: {
      productType: "Face Wash",
      skinHairType: ["Dry", "Sensitive"],
    },
    tags: ["face wash", "cleanser", "skincare"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-01-14T10:00:00.000Z",
  },
  {
    id: "velvessa-retinol-night-cream",
    slug: "velvessa-retinol-night-cream",
    name: "Velvessa Retinol Night Cream",
    brand: "Velvessa",
    categoryId: "beauty",
    subcategoryId: "beauty-skincare",
    description: "Encapsulated retinol works overnight to smooth fine lines.",
    images: [
      "https://images.unsplash.com/photo-1613803745799-ba6c10aace85?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1670201203208-055d6d79db4a?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.0,
    reviewCount: 880,
    specifications: [
      {
        label: "Volume",
        value: "50 g",
      },
      {
        label: "Key ingredients",
        value: "Retinol, Peptides",
      },
    ],
    options: [],
    variants: [
      {
        id: "velvessa-retinol-night-cream",
        optionValues: {},
        price: 899,
        originalPrice: 1299,
        initialStock: 2,
      },
    ],
    attributes: {
      productType: "Night Cream",
      skinHairType: ["Normal", "Combination"],
    },
    tags: ["retinol", "night cream", "anti ageing"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-03-19T10:00:00.000Z",
  },
  {
    id: "kesh-ayur-onion-hair-oil",
    slug: "kesh-ayur-onion-hair-oil",
    name: "Kesh Ayur Onion Hair Oil",
    brand: "Kesh Ayur",
    categoryId: "beauty",
    subcategoryId: "beauty-haircare",
    description: "Cold-pressed onion and bhringraj oil to reduce hair fall and nourish the scalp.",
    images: [
      "https://images.unsplash.com/photo-1704307068094-c2c88c467014?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585232350744-974fc9804d65?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.2,
    reviewCount: 13300,
    specifications: [
      {
        label: "Volume",
        value: "200 ml",
      },
      {
        label: "Key ingredients",
        value: "Onion, Bhringraj",
      },
    ],
    options: [],
    variants: [
      {
        id: "kesh-ayur-onion-hair-oil",
        optionValues: {},
        price: 349,
        originalPrice: 499,
        initialStock: 55,
      },
    ],
    attributes: {
      productType: "Hair Oil",
      skinHairType: ["All Hair Types"],
    },
    tags: ["hair oil", "onion oil", "hair fall"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-07-19T10:00:00.000Z",
  },
  {
    id: "kesh-ayur-anti-dandruff-shampoo",
    slug: "kesh-ayur-anti-dandruff-shampoo",
    name: "Kesh Ayur Anti-Dandruff Shampoo",
    brand: "Kesh Ayur",
    categoryId: "beauty",
    subcategoryId: "beauty-haircare",
    description: "Tea tree and neem cleanse flakes while keeping hair soft.",
    images: [
      "https://images.unsplash.com/photo-1701992678972-d5a053ad0fb0?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1701992678962-41703126549c?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.0,
    reviewCount: 6750,
    specifications: [
      {
        label: "Volume",
        value: "250 ml",
      },
      {
        label: "Key ingredients",
        value: "Tea tree, Neem",
      },
    ],
    options: [],
    variants: [
      {
        id: "kesh-ayur-anti-dandruff-shampoo",
        optionValues: {},
        price: 299,
        originalPrice: 399,
        initialStock: 25,
      },
    ],
    attributes: {
      productType: "Shampoo",
      skinHairType: ["Oily", "Dandruff"],
    },
    tags: ["shampoo", "anti dandruff", "hair"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-09-30T10:00:00.000Z",
  },
  {
    id: "silkara-keratin-smooth-shampoo-and-conditioner",
    slug: "silkara-keratin-smooth-shampoo-and-conditioner",
    name: "Silkara Keratin Smooth Shampoo & Conditioner",
    brand: "Silkara",
    categoryId: "beauty",
    subcategoryId: "beauty-haircare",
    description: "A frizz-control duo with keratin and argan oil for smooth, shiny hair.",
    images: [
      "https://images.unsplash.com/photo-1747098393451-6b985f62a2c2?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1747858989102-cca0f4dc4a11?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.3,
    reviewCount: 2410,
    specifications: [
      {
        label: "Volume",
        value: "2 × 250 ml",
      },
      {
        label: "Key ingredients",
        value: "Keratin, Argan oil",
      },
    ],
    options: [],
    variants: [
      {
        id: "silkara-keratin-smooth-shampoo-and-conditioner",
        optionValues: {},
        price: 699,
        originalPrice: 999,
        initialStock: 25,
      },
    ],
    attributes: {
      productType: "Shampoo & Conditioner",
      skinHairType: ["Frizzy", "Dry"],
    },
    tags: ["shampoo", "conditioner", "keratin", "frizz"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-12-09T10:00:00.000Z",
  },
  {
    id: "silkara-ionic-hair-dryer-1600-w",
    slug: "silkara-ionic-hair-dryer-1600-w",
    name: "Silkara Ionic Hair Dryer 1600 W",
    brand: "Silkara",
    categoryId: "beauty",
    subcategoryId: "beauty-haircare",
    description: "Ionic technology for faster, frizz-free drying with two speeds and a cool shot.",
    images: [
      "https://images.unsplash.com/photo-1727364438136-6edc10ef0a52?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522336284037-91f7da073525?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.2,
    reviewCount: 3120,
    specifications: [
      {
        label: "Power",
        value: "1600 W",
      },
      {
        label: "Settings",
        value: "2 heat, 2 speed, cool shot",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Black", "Red"],
      },
    ],
    variants: [
      {
        id: "silkara-ionic-hair-dryer-1600-w-black",
        optionValues: {
          Color: "Black",
        },
        price: 1499,
        originalPrice: 2499,
        initialStock: 25,
      },
      {
        id: "silkara-ionic-hair-dryer-1600-w-red",
        optionValues: {
          Color: "Red",
        },
        price: 1499,
        originalPrice: 2499,
        initialStock: 25,
      },
    ],
    attributes: {
      productType: "Hair Dryer",
      skinHairType: ["All Hair Types"],
    },
    tags: ["hair dryer", "dryer", "styling"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-11-03T10:00:00.000Z",
  },
  {
    id: "kesh-ayur-hibiscus-hair-mask",
    slug: "kesh-ayur-hibiscus-hair-mask",
    name: "Kesh Ayur Hibiscus Hair Mask",
    brand: "Kesh Ayur",
    categoryId: "beauty",
    subcategoryId: "beauty-haircare",
    description: "A deep-conditioning mask with hibiscus and shea butter for damaged hair.",
    images: [
      "https://images.unsplash.com/photo-1610705267928-1b9f2fa7f1c5?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.1,
    reviewCount: 1180,
    specifications: [
      {
        label: "Volume",
        value: "200 g",
      },
      {
        label: "Use",
        value: "Once a week",
      },
    ],
    options: [],
    variants: [
      {
        id: "kesh-ayur-hibiscus-hair-mask",
        optionValues: {},
        price: 449,
        originalPrice: 599,
        initialStock: 25,
      },
    ],
    attributes: {
      productType: "Hair Mask",
      skinHairType: ["Damaged", "Dry"],
    },
    tags: ["hair mask", "conditioning", "repair"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-08-27T10:00:00.000Z",
  },
  {
    id: "silkara-paddle-detangling-brush",
    slug: "silkara-paddle-detangling-brush",
    name: "Silkara Paddle Detangling Brush",
    brand: "Silkara",
    categoryId: "beauty",
    subcategoryId: "beauty-haircare",
    description: "Flexible bristles glide through knots without pulling.",
    images: [
      "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.4,
    reviewCount: 940,
    specifications: [
      {
        label: "Bristles",
        value: "Flexible nylon",
      },
      {
        label: "Use",
        value: "Wet and dry hair",
      },
    ],
    options: [],
    variants: [
      {
        id: "silkara-paddle-detangling-brush",
        optionValues: {},
        price: 399,
        originalPrice: 499,
        initialStock: 0,
      },
    ],
    attributes: {
      productType: "Hair Brush",
      skinHairType: ["All Hair Types"],
    },
    tags: ["hair brush", "detangler", "comb"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-02-23T10:00:00.000Z",
  },
  {
    id: "velvessa-matte-lipstick",
    slug: "velvessa-matte-lipstick",
    name: "Velvessa Matte Lipstick",
    brand: "Velvessa",
    categoryId: "beauty",
    subcategoryId: "beauty-makeup",
    description: "A creamy matte lipstick with 12-hour wear that never feels dry.",
    images: [
      "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1619352520578-8fefbfa2f904?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.3,
    reviewCount: 8840,
    specifications: [
      {
        label: "Finish",
        value: "Matte",
      },
      {
        label: "Weight",
        value: "4.2 g",
      },
      {
        label: "Wear",
        value: "Up to 12 hours",
      },
    ],
    options: [
      {
        name: "Shade",
        values: ["Ruby Red", "Nude Rose", "Berry Wine", "Coral Kiss"],
      },
    ],
    variants: [
      {
        id: "velvessa-matte-lipstick-ruby-red",
        optionValues: {
          Shade: "Ruby Red",
        },
        price: 499,
        originalPrice: 699,
        initialStock: 45,
      },
      {
        id: "velvessa-matte-lipstick-nude-rose",
        optionValues: {
          Shade: "Nude Rose",
        },
        price: 499,
        originalPrice: 699,
        initialStock: 45,
      },
      {
        id: "velvessa-matte-lipstick-berry-wine",
        optionValues: {
          Shade: "Berry Wine",
        },
        price: 499,
        originalPrice: 699,
        initialStock: 0,
      },
      {
        id: "velvessa-matte-lipstick-coral-kiss",
        optionValues: {
          Shade: "Coral Kiss",
        },
        price: 499,
        originalPrice: 699,
        initialStock: 2,
      },
    ],
    attributes: {
      productType: "Lipstick",
      skinHairType: ["All Skin Types"],
    },
    tags: ["lipstick", "matte", "lips", "makeup"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-08-19T10:00:00.000Z",
  },
  {
    id: "velvessa-liquid-lip-set-pack-of-5",
    slug: "velvessa-liquid-lip-set-pack-of-5",
    name: "Velvessa Liquid Lip Set (Pack of 5)",
    brand: "Velvessa",
    categoryId: "beauty",
    subcategoryId: "beauty-makeup",
    description: "Five transfer-proof liquid lipsticks in everyday shades.",
    images: [
      "https://images.unsplash.com/photo-1571646034647-52e6ea84b28c?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1631214499500-2e34edcaccfe?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.2,
    reviewCount: 2210,
    specifications: [
      {
        label: "Contents",
        value: "5 × 3 ml",
      },
      {
        label: "Finish",
        value: "Matte",
      },
    ],
    options: [],
    variants: [
      {
        id: "velvessa-liquid-lip-set-pack-of-5",
        optionValues: {},
        price: 999,
        originalPrice: 1499,
        initialStock: 25,
      },
    ],
    attributes: {
      productType: "Lipstick",
      skinHairType: ["All Skin Types"],
    },
    tags: ["lipstick", "liquid lipstick", "set", "gift"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-01-22T10:00:00.000Z",
  },
  {
    id: "lumiere-skin-tint-foundation-spf-20",
    slug: "lumiere-skin-tint-foundation-spf-20",
    name: "Lumière Skin Tint Foundation SPF 20",
    brand: "Lumière",
    categoryId: "beauty",
    subcategoryId: "beauty-makeup",
    description: "A lightweight, buildable foundation with a natural dewy finish.",
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598528738936-c50861cc75a9?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.1,
    reviewCount: 1640,
    specifications: [
      {
        label: "Volume",
        value: "30 ml",
      },
      {
        label: "Finish",
        value: "Dewy",
      },
      {
        label: "SPF",
        value: "20",
      },
    ],
    options: [
      {
        name: "Shade",
        values: ["Ivory", "Sand", "Honey", "Caramel"],
      },
    ],
    variants: [
      {
        id: "lumiere-skin-tint-foundation-spf-20-ivory",
        optionValues: {
          Shade: "Ivory",
        },
        price: 799,
        originalPrice: 999,
        initialStock: 25,
      },
      {
        id: "lumiere-skin-tint-foundation-spf-20-sand",
        optionValues: {
          Shade: "Sand",
        },
        price: 799,
        originalPrice: 999,
        initialStock: 25,
      },
      {
        id: "lumiere-skin-tint-foundation-spf-20-honey",
        optionValues: {
          Shade: "Honey",
        },
        price: 799,
        originalPrice: 999,
        initialStock: 25,
      },
      {
        id: "lumiere-skin-tint-foundation-spf-20-caramel",
        optionValues: {
          Shade: "Caramel",
        },
        price: 799,
        originalPrice: 999,
        initialStock: 25,
      },
    ],
    attributes: {
      productType: "Foundation",
      skinHairType: ["Normal", "Dry"],
    },
    tags: ["foundation", "base", "makeup"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-10-26T10:00:00.000Z",
  },
  {
    id: "lumiere-10-piece-makeup-brush-set",
    slug: "lumiere-10-piece-makeup-brush-set",
    name: "Lumière 10-Piece Makeup Brush Set",
    brand: "Lumière",
    categoryId: "beauty",
    subcategoryId: "beauty-makeup",
    description: "Soft synthetic brushes for face and eyes with a travel pouch.",
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.4,
    reviewCount: 3280,
    specifications: [
      {
        label: "Pieces",
        value: "10",
      },
      {
        label: "Bristles",
        value: "Synthetic",
      },
    ],
    options: [],
    variants: [
      {
        id: "lumiere-10-piece-makeup-brush-set",
        optionValues: {},
        price: 899,
        originalPrice: 1599,
        initialStock: 25,
      },
    ],
    attributes: {
      productType: "Brushes",
      skinHairType: ["All Skin Types"],
    },
    tags: ["makeup brushes", "brush set", "tools"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-12-16T10:00:00.000Z",
  },
  {
    id: "velvessa-kohl-kajal",
    slug: "velvessa-kohl-kajal",
    name: "Velvessa Kohl Kajal",
    brand: "Velvessa",
    categoryId: "beauty",
    subcategoryId: "beauty-makeup",
    description: "Smudge-proof, waterproof kajal with deep black colour for 24 hours.",
    images: [
      "https://images.unsplash.com/photo-1631730486572-226d1f595b68?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.3,
    reviewCount: 15400,
    specifications: [
      {
        label: "Weight",
        value: "0.35 g",
      },
      {
        label: "Wear",
        value: "24 hours",
      },
      {
        label: "Waterproof",
        value: "Yes",
      },
    ],
    options: [],
    variants: [
      {
        id: "velvessa-kohl-kajal",
        optionValues: {},
        price: 199,
        originalPrice: 249,
        initialStock: 80,
      },
    ],
    attributes: {
      productType: "Kajal",
      skinHairType: ["All Skin Types"],
    },
    tags: ["kajal", "kohl", "eyes", "makeup"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-09-13T10:00:00.000Z",
  },
  {
    id: "lumiere-glow-makeup-essentials-kit",
    slug: "lumiere-glow-makeup-essentials-kit",
    name: "Lumière Glow Makeup Essentials Kit",
    brand: "Lumière",
    categoryId: "beauty",
    subcategoryId: "beauty-makeup",
    description: "Foundation, blush, highlighter and lip tint in one travel-ready kit.",
    images: [
      "https://images.unsplash.com/photo-1555050455-f96634b5cba6?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.0,
    reviewCount: 620,
    specifications: [
      {
        label: "Contents",
        value: "4 products",
      },
      {
        label: "Finish",
        value: "Glow",
      },
    ],
    options: [],
    variants: [
      {
        id: "lumiere-glow-makeup-essentials-kit",
        optionValues: {},
        price: 1799,
        originalPrice: 2999,
        initialStock: 3,
      },
    ],
    attributes: {
      productType: "Kit",
      skinHairType: ["All Skin Types"],
    },
    tags: ["makeup kit", "gift", "essentials"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-03-02T10:00:00.000Z",
  },
  {
    id: "maison-aria-oudh-royale-eau-de-parfum",
    slug: "maison-aria-oudh-royale-eau-de-parfum",
    name: "Oudh Royale Eau de Parfum",
    brand: "Maison Aria",
    categoryId: "beauty",
    subcategoryId: "beauty-fragrances",
    description: "A warm, woody fragrance with oudh, saffron and amber.",
    images: [
      "https://images.unsplash.com/photo-1585218334450-afcf929da36e?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1733660227163-01bc46e0d7d7?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.4,
    reviewCount: 3210,
    specifications: [
      {
        label: "Type",
        value: "Eau de Parfum",
      },
      {
        label: "Notes",
        value: "Oudh, Saffron, Amber",
      },
      {
        label: "Longevity",
        value: "6–8 hours",
      },
    ],
    options: [
      {
        name: "Size",
        values: ["50 ml", "100 ml"],
      },
    ],
    variants: [
      {
        id: "maison-aria-oudh-royale-eau-de-parfum-50-ml",
        optionValues: {
          Size: "50 ml",
        },
        price: 1499,
        originalPrice: 2499,
        initialStock: 25,
      },
      {
        id: "maison-aria-oudh-royale-eau-de-parfum-100-ml",
        optionValues: {
          Size: "100 ml",
        },
        price: 2299,
        originalPrice: 3999,
        initialStock: 25,
      },
    ],
    attributes: {
      productType: "Eau de Parfum",
      skinHairType: ["All Skin Types"],
    },
    tags: ["perfume", "fragrance", "scent", "eau de parfum", "oudh", "saffron", "amber"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-10-07T10:00:00.000Z",
  },
  {
    id: "maison-aria-blossom-muse-eau-de-parfum",
    slug: "maison-aria-blossom-muse-eau-de-parfum",
    name: "Blossom Muse Eau de Parfum",
    brand: "Maison Aria",
    categoryId: "beauty",
    subcategoryId: "beauty-fragrances",
    description: "A soft floral bouquet of jasmine, peony and white musk.",
    images: [
      "https://images.unsplash.com/photo-1595425959632-34f2822322ce?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1613521140785-e85e427f8002?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.3,
    reviewCount: 2640,
    specifications: [
      {
        label: "Type",
        value: "Eau de Parfum",
      },
      {
        label: "Notes",
        value: "Jasmine, Peony, White musk",
      },
      {
        label: "Longevity",
        value: "6–8 hours",
      },
    ],
    options: [
      {
        name: "Size",
        values: ["50 ml", "100 ml"],
      },
    ],
    variants: [
      {
        id: "maison-aria-blossom-muse-eau-de-parfum-50-ml",
        optionValues: {
          Size: "50 ml",
        },
        price: 1299,
        originalPrice: 1999,
        initialStock: 25,
      },
      {
        id: "maison-aria-blossom-muse-eau-de-parfum-100-ml",
        optionValues: {
          Size: "100 ml",
        },
        price: 1999,
        originalPrice: 2999,
        initialStock: 25,
      },
    ],
    attributes: {
      productType: "Eau de Parfum",
      skinHairType: ["All Skin Types"],
    },
    tags: ["perfume", "fragrance", "scent", "eau de parfum", "jasmine", "peony", "white musk"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-02-11T10:00:00.000Z",
  },
  {
    id: "coastline-aqua-drift-eau-de-toilette",
    slug: "coastline-aqua-drift-eau-de-toilette",
    name: "Aqua Drift Eau de Toilette",
    brand: "Coastline",
    categoryId: "beauty",
    subcategoryId: "beauty-fragrances",
    description: "A fresh aquatic scent with citrus and sea salt for everyday wear.",
    images: [
      "https://images.unsplash.com/photo-1615160460366-2c9a41771b51?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1458538977777-0549b2370168?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.1,
    reviewCount: 4110,
    specifications: [
      {
        label: "Type",
        value: "Eau de Toilette",
      },
      {
        label: "Notes",
        value: "Bergamot, Sea salt, Cedar",
      },
      {
        label: "Longevity",
        value: "6–8 hours",
      },
    ],
    options: [
      {
        name: "Size",
        values: ["50 ml", "100 ml"],
      },
    ],
    variants: [
      {
        id: "coastline-aqua-drift-eau-de-toilette-50-ml",
        optionValues: {
          Size: "50 ml",
        },
        price: 899,
        originalPrice: 1499,
        initialStock: 25,
      },
      {
        id: "coastline-aqua-drift-eau-de-toilette-100-ml",
        optionValues: {
          Size: "100 ml",
        },
        price: 1399,
        originalPrice: 2299,
        initialStock: 25,
      },
    ],
    attributes: {
      productType: "Eau de Toilette",
      skinHairType: ["All Skin Types"],
    },
    tags: ["perfume", "fragrance", "scent", "eau de toilette", "bergamot", "sea salt", "cedar"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-08-30T10:00:00.000Z",
  },
  {
    id: "maison-aria-noir-velour-eau-de-parfum",
    slug: "maison-aria-noir-velour-eau-de-parfum",
    name: "Noir Velour Eau de Parfum",
    brand: "Maison Aria",
    categoryId: "beauty",
    subcategoryId: "beauty-fragrances",
    description: "An intense evening fragrance of black pepper, leather and vanilla.",
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.5,
    reviewCount: 980,
    specifications: [
      {
        label: "Type",
        value: "Eau de Parfum",
      },
      {
        label: "Notes",
        value: "Black pepper, Leather, Vanilla",
      },
      {
        label: "Longevity",
        value: "6–8 hours",
      },
    ],
    options: [
      {
        name: "Size",
        values: ["50 ml", "100 ml"],
      },
    ],
    variants: [
      {
        id: "maison-aria-noir-velour-eau-de-parfum-50-ml",
        optionValues: {
          Size: "50 ml",
        },
        price: 1799,
        originalPrice: 2999,
        initialStock: 25,
      },
      {
        id: "maison-aria-noir-velour-eau-de-parfum-100-ml",
        optionValues: {
          Size: "100 ml",
        },
        price: 2799,
        originalPrice: 4499,
        initialStock: 0,
      },
    ],
    attributes: {
      productType: "Eau de Parfum",
      skinHairType: ["All Skin Types"],
    },
    tags: ["perfume", "fragrance", "scent", "eau de parfum", "black pepper", "leather", "vanilla"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-09-02T10:00:00.000Z",
  },
  {
    id: "coastline-citrus-bloom-body-mist",
    slug: "coastline-citrus-bloom-body-mist",
    name: "Citrus Bloom Body Mist",
    brand: "Coastline",
    categoryId: "beauty",
    subcategoryId: "beauty-fragrances",
    description: "A light, refreshing body mist with orange blossom and lime.",
    images: [
      "https://images.unsplash.com/photo-1543422655-ac1c6ca993ed?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608721279136-cd41b752fa41?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.0,
    reviewCount: 6230,
    specifications: [
      {
        label: "Type",
        value: "Body Mist",
      },
      {
        label: "Notes",
        value: "Orange blossom, Lime",
      },
      {
        label: "Longevity",
        value: "6–8 hours",
      },
    ],
    options: [
      {
        name: "Size",
        values: ["50 ml", "100 ml"],
      },
    ],
    variants: [
      {
        id: "coastline-citrus-bloom-body-mist-50-ml",
        optionValues: {
          Size: "50 ml",
        },
        price: 349,
        originalPrice: 499,
        initialStock: 45,
      },
      {
        id: "coastline-citrus-bloom-body-mist-100-ml",
        optionValues: {
          Size: "100 ml",
        },
        price: 549,
        originalPrice: 799,
        initialStock: 45,
      },
    ],
    attributes: {
      productType: "Body Mist",
      skinHairType: ["All Skin Types"],
    },
    tags: ["perfume", "fragrance", "scent", "body mist", "orange blossom", "lime"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-12-24T10:00:00.000Z",
  },
  {
    id: "petale-rose-petal-eau-de-parfum",
    slug: "petale-rose-petal-eau-de-parfum",
    name: "Rose Petal Eau de Parfum",
    brand: "Petalé",
    categoryId: "beauty",
    subcategoryId: "beauty-fragrances",
    description: "A romantic Indian rose layered with soft musk.",
    images: [
      "https://images.unsplash.com/photo-1615108395437-df128ad79e80?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1594125311687-3b1b3eafa9f4?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.2,
    reviewCount: 1430,
    specifications: [
      {
        label: "Type",
        value: "Eau de Parfum",
      },
      {
        label: "Notes",
        value: "Indian rose, Musk",
      },
      {
        label: "Longevity",
        value: "6–8 hours",
      },
    ],
    options: [
      {
        name: "Size",
        values: ["50 ml", "100 ml"],
      },
    ],
    variants: [
      {
        id: "petale-rose-petal-eau-de-parfum-50-ml",
        optionValues: {
          Size: "50 ml",
        },
        price: 999,
        originalPrice: 1499,
        initialStock: 2,
      },
      {
        id: "petale-rose-petal-eau-de-parfum-100-ml",
        optionValues: {
          Size: "100 ml",
        },
        price: 1499,
        originalPrice: 2299,
        initialStock: 25,
      },
    ],
    attributes: {
      productType: "Eau de Parfum",
      skinHairType: ["All Skin Types"],
    },
    tags: ["perfume", "fragrance", "scent", "eau de parfum", "indian rose", "musk"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-03-15T10:00:00.000Z",
  },
  {
    id: "brite-smile-sonic-electric-toothbrush",
    slug: "brite-smile-sonic-electric-toothbrush",
    name: "Brite Smile Sonic Electric Toothbrush",
    brand: "Brite Smile",
    categoryId: "beauty",
    subcategoryId: "beauty-personal-care",
    description: "31,000 strokes per minute, a 2-minute timer and 3 modes for a deeper clean.",
    images: [
      "https://images.unsplash.com/photo-1559592892-19db4235d786?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.3,
    reviewCount: 4720,
    specifications: [
      {
        label: "Modes",
        value: "Clean, White, Sensitive",
      },
      {
        label: "Battery",
        value: "Up to 30 days",
      },
      {
        label: "Heads",
        value: "2 included",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Pink", "White"],
      },
    ],
    variants: [
      {
        id: "brite-smile-sonic-electric-toothbrush-pink",
        optionValues: {
          Color: "Pink",
        },
        price: 1999,
        originalPrice: 2999,
        initialStock: 25,
      },
      {
        id: "brite-smile-sonic-electric-toothbrush-white",
        optionValues: {
          Color: "White",
        },
        price: 1999,
        originalPrice: 2999,
        initialStock: 25,
      },
    ],
    attributes: {
      productType: "Electric Toothbrush",
      skinHairType: ["All"],
    },
    tags: ["electric toothbrush", "oral care", "toothbrush"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-09-12T10:00:00.000Z",
  },
  {
    id: "groomline-cordless-beard-trimmer",
    slug: "groomline-cordless-beard-trimmer",
    name: "Groomline Cordless Beard Trimmer",
    brand: "Groomline",
    categoryId: "beauty",
    subcategoryId: "beauty-personal-care",
    description: "Precision trimming with 20 length settings and 90 minutes of runtime.",
    images: [
      "https://images.unsplash.com/photo-1647900893846-e6ab4048e824?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1646376241249-f261e72c2029?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.2,
    reviewCount: 8910,
    specifications: [
      {
        label: "Settings",
        value: "20 lengths, 0.5–10 mm",
      },
      {
        label: "Runtime",
        value: "90 minutes",
      },
      {
        label: "Charging",
        value: "USB-C",
      },
    ],
    options: [],
    variants: [
      {
        id: "groomline-cordless-beard-trimmer",
        optionValues: {},
        price: 1299,
        originalPrice: 2199,
        initialStock: 25,
      },
    ],
    attributes: {
      productType: "Trimmer",
      skinHairType: ["All"],
    },
    tags: ["trimmer", "beard trimmer", "grooming", "men"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-08-08T10:00:00.000Z",
  },
  {
    id: "brite-smile-bamboo-toothbrush-pack-of-4",
    slug: "brite-smile-bamboo-toothbrush-pack-of-4",
    name: "Brite Smile Bamboo Toothbrush (Pack of 4)",
    brand: "Brite Smile",
    categoryId: "beauty",
    subcategoryId: "beauty-personal-care",
    description: "Eco-friendly bamboo handles with soft charcoal-infused bristles.",
    images: [
      "https://images.unsplash.com/photo-1634082980789-f93655ed39d2?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553691158-91a7f9183156?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1532120308961-b163b7ae0791?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.1,
    reviewCount: 3340,
    specifications: [
      {
        label: "Pack",
        value: "4 toothbrushes",
      },
      {
        label: "Bristles",
        value: "Soft, charcoal infused",
      },
    ],
    options: [],
    variants: [
      {
        id: "brite-smile-bamboo-toothbrush-pack-of-4",
        optionValues: {},
        price: 249,
        originalPrice: 299,
        initialStock: 70,
      },
    ],
    attributes: {
      productType: "Toothbrush",
      skinHairType: ["All"],
    },
    tags: ["toothbrush", "bamboo", "eco friendly", "oral care"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-01-27T10:00:00.000Z",
  },
  {
    id: "dewra-shea-butter-body-lotion",
    slug: "dewra-shea-butter-body-lotion",
    name: "Dewra Shea Butter Body Lotion",
    brand: "Dewra",
    categoryId: "beauty",
    subcategoryId: "beauty-personal-care",
    description: "48-hour moisture with shea butter and glycerin for soft, smooth skin.",
    images: [
      "https://images.unsplash.com/photo-1655892810227-c0cffe1d9717?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1660090455967-24cf8b0eb58d?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.4,
    reviewCount: 5170,
    specifications: [
      {
        label: "Volume",
        value: "400 ml",
      },
      {
        label: "Key ingredients",
        value: "Shea butter, Glycerin",
      },
    ],
    options: [],
    variants: [
      {
        id: "dewra-shea-butter-body-lotion",
        optionValues: {},
        price: 399,
        originalPrice: 499,
        initialStock: 25,
      },
    ],
    attributes: {
      productType: "Body Lotion",
      skinHairType: ["Dry", "Normal"],
    },
    tags: ["body lotion", "moisturiser", "body care"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-11-17T10:00:00.000Z",
  },
  {
    id: "groomline-precision-shaver",
    slug: "groomline-precision-shaver",
    name: "Groomline Precision Shaver",
    brand: "Groomline",
    categoryId: "beauty",
    subcategoryId: "beauty-personal-care",
    description: "A wet-and-dry rotary shaver with flexible heads for a close, comfortable shave.",
    images: [
      "https://images.unsplash.com/photo-1508380702597-707c1b00695c?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1647900893846-e6ab4048e824?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.0,
    reviewCount: 760,
    specifications: [
      {
        label: "Use",
        value: "Wet and dry",
      },
      {
        label: "Runtime",
        value: "60 minutes",
      },
    ],
    options: [],
    variants: [
      {
        id: "groomline-precision-shaver",
        optionValues: {},
        price: 2499,
        originalPrice: 3499,
        initialStock: 3,
      },
    ],
    attributes: {
      productType: "Shaver",
      skinHairType: ["All"],
    },
    tags: ["shaver", "razor", "grooming", "men"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-09-05T10:00:00.000Z",
  },
  {
    id: "dewra-aloe-body-wash",
    slug: "dewra-aloe-body-wash",
    name: "Dewra Aloe Body Wash",
    brand: "Dewra",
    categoryId: "beauty",
    subcategoryId: "beauty-personal-care",
    description: "A refreshing aloe vera and cucumber body wash with a gentle lather.",
    images: [
      "https://images.unsplash.com/photo-1700709678035-b6606373aa52?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1660090455967-24cf8b0eb58d?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.1,
    reviewCount: 2280,
    specifications: [
      {
        label: "Volume",
        value: "250 ml",
      },
      {
        label: "Key ingredients",
        value: "Aloe vera, Cucumber",
      },
    ],
    options: [],
    variants: [
      {
        id: "dewra-aloe-body-wash",
        optionValues: {},
        price: 299,
        originalPrice: 349,
        initialStock: 0,
      },
    ],
    attributes: {
      productType: "Body Wash",
      skinHairType: ["All"],
    },
    tags: ["body wash", "shower gel", "bath"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-02-28T10:00:00.000Z",
  },
];
