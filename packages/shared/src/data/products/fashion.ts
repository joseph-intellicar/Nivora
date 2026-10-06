import type { Product } from "../../domain/types";

/**
 * Fashion: Men, Women, Kids, Footwear, Accessories.
 * Generated mock data (Phase 1). Images: Unsplash (Unsplash License).
 */
export const FASHION_PRODUCTS: Product[] = [
  {
    id: "urbano-classic-oxford-shirt",
    slug: "urbano-classic-oxford-shirt",
    name: "Urbano Classic Oxford Shirt",
    brand: "Urbano",
    categoryId: "fashion",
    subcategoryId: "fashion-men",
    description:
      "A wardrobe staple in breathable 100% cotton Oxford weave. Button-down collar, curved hem and a regular fit that works tucked in for the office or untucked on weekends.",
    images: [
      "https://images.unsplash.com/photo-1602810316693-3667c854239a?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1740711152088-88a009e877bb?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.4,
    reviewCount: 2184,
    specifications: [
      {
        label: "Fabric",
        value: "100% Cotton Oxford",
      },
      {
        label: "Fit",
        value: "Regular",
      },
      {
        label: "Sleeve",
        value: "Full sleeve",
      },
      {
        label: "Collar",
        value: "Button-down",
      },
      {
        label: "Care",
        value: "Machine wash",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Sky Blue", "White"],
      },
      {
        name: "Size",
        values: ["S", "M", "L", "XL", "XXL"],
      },
    ],
    variants: [
      {
        id: "urbano-classic-oxford-shirt-sky-blue-s",
        optionValues: {
          Color: "Sky Blue",
          Size: "S",
        },
        price: 1299,
        originalPrice: 1999,
        initialStock: 2,
      },
      {
        id: "urbano-classic-oxford-shirt-sky-blue-m",
        optionValues: {
          Color: "Sky Blue",
          Size: "M",
        },
        price: 1299,
        originalPrice: 1999,
        initialStock: 25,
      },
      {
        id: "urbano-classic-oxford-shirt-sky-blue-l",
        optionValues: {
          Color: "Sky Blue",
          Size: "L",
        },
        price: 1299,
        originalPrice: 1999,
        initialStock: 25,
      },
      {
        id: "urbano-classic-oxford-shirt-sky-blue-xl",
        optionValues: {
          Color: "Sky Blue",
          Size: "XL",
        },
        price: 1299,
        originalPrice: 1999,
        initialStock: 25,
      },
      {
        id: "urbano-classic-oxford-shirt-sky-blue-xxl",
        optionValues: {
          Color: "Sky Blue",
          Size: "XXL",
        },
        price: 1299,
        originalPrice: 1999,
        initialStock: 25,
      },
      {
        id: "urbano-classic-oxford-shirt-white-s",
        optionValues: {
          Color: "White",
          Size: "S",
        },
        price: 1299,
        originalPrice: 1999,
        initialStock: 25,
      },
      {
        id: "urbano-classic-oxford-shirt-white-m",
        optionValues: {
          Color: "White",
          Size: "M",
        },
        price: 1299,
        originalPrice: 1999,
        initialStock: 25,
      },
      {
        id: "urbano-classic-oxford-shirt-white-l",
        optionValues: {
          Color: "White",
          Size: "L",
        },
        price: 1299,
        originalPrice: 1999,
        initialStock: 25,
      },
      {
        id: "urbano-classic-oxford-shirt-white-xl",
        optionValues: {
          Color: "White",
          Size: "XL",
        },
        price: 1299,
        originalPrice: 1999,
        initialStock: 25,
      },
      {
        id: "urbano-classic-oxford-shirt-white-xxl",
        optionValues: {
          Color: "White",
          Size: "XXL",
        },
        price: 1299,
        originalPrice: 1999,
        initialStock: 0,
      },
    ],
    attributes: {},
    tags: ["shirt", "formal", "office", "cotton"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-11-02T10:00:00.000Z",
  },
  {
    id: "urbano-slim-fit-checked-shirt",
    slug: "urbano-slim-fit-checked-shirt",
    name: "Urbano Slim Fit Checked Shirt",
    brand: "Urbano",
    categoryId: "fashion",
    subcategoryId: "fashion-men",
    description:
      "A sharp slim-fit shirt in a soft brushed check. Easy to dress up with chinos or down with denim.",
    images: [
      "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1642764873649-5c228ce3fe74?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.1,
    reviewCount: 856,
    specifications: [
      {
        label: "Fabric",
        value: "Cotton blend",
      },
      {
        label: "Fit",
        value: "Slim",
      },
      {
        label: "Sleeve",
        value: "Full sleeve",
      },
      {
        label: "Pattern",
        value: "Checked",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Charcoal Check"],
      },
      {
        name: "Size",
        values: ["S", "M", "L", "XL", "XXL"],
      },
    ],
    variants: [
      {
        id: "urbano-slim-fit-checked-shirt-charcoal-check-s",
        optionValues: {
          Color: "Charcoal Check",
          Size: "S",
        },
        price: 999,
        originalPrice: 1599,
        initialStock: 25,
      },
      {
        id: "urbano-slim-fit-checked-shirt-charcoal-check-m",
        optionValues: {
          Color: "Charcoal Check",
          Size: "M",
        },
        price: 999,
        originalPrice: 1599,
        initialStock: 25,
      },
      {
        id: "urbano-slim-fit-checked-shirt-charcoal-check-l",
        optionValues: {
          Color: "Charcoal Check",
          Size: "L",
        },
        price: 999,
        originalPrice: 1599,
        initialStock: 25,
      },
      {
        id: "urbano-slim-fit-checked-shirt-charcoal-check-xl",
        optionValues: {
          Color: "Charcoal Check",
          Size: "XL",
        },
        price: 999,
        originalPrice: 1599,
        initialStock: 25,
      },
      {
        id: "urbano-slim-fit-checked-shirt-charcoal-check-xxl",
        optionValues: {
          Color: "Charcoal Check",
          Size: "XXL",
        },
        price: 999,
        originalPrice: 1599,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["shirt", "casual", "checks"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-12-10T10:00:00.000Z",
  },
  {
    id: "kavya-weaves-cotton-kurta",
    slug: "kavya-weaves-cotton-kurta",
    name: "Kavya Weaves Cotton Kurta",
    brand: "Kavya Weaves",
    categoryId: "fashion",
    subcategoryId: "fashion-men",
    description:
      "Hand-finished straight kurta in breathable cotton with a mandarin collar. Made for festive days and long summer evenings.",
    images: [
      "https://images.unsplash.com/photo-1770359993283-a2c2f386584e?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1772736243289-872f9ac73cf8?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.5,
    reviewCount: 412,
    specifications: [
      {
        label: "Fabric",
        value: "100% Cotton",
      },
      {
        label: "Fit",
        value: "Straight",
      },
      {
        label: "Length",
        value: "Knee length",
      },
      {
        label: "Occasion",
        value: "Festive, Casual",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Indigo", "Teal"],
      },
      {
        name: "Size",
        values: ["S", "M", "L", "XL", "XXL"],
      },
    ],
    variants: [
      {
        id: "kavya-weaves-cotton-kurta-indigo-s",
        optionValues: {
          Color: "Indigo",
          Size: "S",
        },
        price: 1499,
        originalPrice: 2499,
        initialStock: 25,
      },
      {
        id: "kavya-weaves-cotton-kurta-indigo-m",
        optionValues: {
          Color: "Indigo",
          Size: "M",
        },
        price: 1499,
        originalPrice: 2499,
        initialStock: 25,
      },
      {
        id: "kavya-weaves-cotton-kurta-indigo-l",
        optionValues: {
          Color: "Indigo",
          Size: "L",
        },
        price: 1499,
        originalPrice: 2499,
        initialStock: 25,
      },
      {
        id: "kavya-weaves-cotton-kurta-indigo-xl",
        optionValues: {
          Color: "Indigo",
          Size: "XL",
        },
        price: 1499,
        originalPrice: 2499,
        initialStock: 25,
      },
      {
        id: "kavya-weaves-cotton-kurta-indigo-xxl",
        optionValues: {
          Color: "Indigo",
          Size: "XXL",
        },
        price: 1499,
        originalPrice: 2499,
        initialStock: 25,
      },
      {
        id: "kavya-weaves-cotton-kurta-teal-s",
        optionValues: {
          Color: "Teal",
          Size: "S",
        },
        price: 1499,
        originalPrice: 2499,
        initialStock: 25,
      },
      {
        id: "kavya-weaves-cotton-kurta-teal-m",
        optionValues: {
          Color: "Teal",
          Size: "M",
        },
        price: 1499,
        originalPrice: 2499,
        initialStock: 25,
      },
      {
        id: "kavya-weaves-cotton-kurta-teal-l",
        optionValues: {
          Color: "Teal",
          Size: "L",
        },
        price: 1499,
        originalPrice: 2499,
        initialStock: 25,
      },
      {
        id: "kavya-weaves-cotton-kurta-teal-xl",
        optionValues: {
          Color: "Teal",
          Size: "XL",
        },
        price: 1499,
        originalPrice: 2499,
        initialStock: 25,
      },
      {
        id: "kavya-weaves-cotton-kurta-teal-xxl",
        optionValues: {
          Color: "Teal",
          Size: "XXL",
        },
        price: 1499,
        originalPrice: 2499,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["kurta", "ethnic", "festive", "traditional"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-09-12T10:00:00.000Z",
  },
  {
    id: "northline-pique-polo-t-shirt",
    slug: "northline-pique-polo-t-shirt",
    name: "Northline Piqué Polo T-Shirt",
    brand: "Northline",
    categoryId: "fashion",
    subcategoryId: "fashion-men",
    description:
      "Classic piqué polo with a ribbed collar and two-button placket. Soft, durable and great value.",
    images: [
      "https://images.unsplash.com/photo-1623658580851-3b25bf83b4ea?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1584642520442-5c5fbe4e7427?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.2,
    reviewCount: 3410,
    specifications: [
      {
        label: "Fabric",
        value: "Cotton piqué",
      },
      {
        label: "Fit",
        value: "Regular",
      },
      {
        label: "Sleeve",
        value: "Half sleeve",
      },
      {
        label: "Neck",
        value: "Polo collar",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Royal Blue", "Black"],
      },
      {
        name: "Size",
        values: ["S", "M", "L", "XL", "XXL"],
      },
    ],
    variants: [
      {
        id: "northline-pique-polo-t-shirt-royal-blue-s",
        optionValues: {
          Color: "Royal Blue",
          Size: "S",
        },
        price: 699,
        originalPrice: 1199,
        initialStock: 25,
      },
      {
        id: "northline-pique-polo-t-shirt-royal-blue-m",
        optionValues: {
          Color: "Royal Blue",
          Size: "M",
        },
        price: 699,
        originalPrice: 1199,
        initialStock: 25,
      },
      {
        id: "northline-pique-polo-t-shirt-royal-blue-l",
        optionValues: {
          Color: "Royal Blue",
          Size: "L",
        },
        price: 699,
        originalPrice: 1199,
        initialStock: 25,
      },
      {
        id: "northline-pique-polo-t-shirt-royal-blue-xl",
        optionValues: {
          Color: "Royal Blue",
          Size: "XL",
        },
        price: 699,
        originalPrice: 1199,
        initialStock: 25,
      },
      {
        id: "northline-pique-polo-t-shirt-royal-blue-xxl",
        optionValues: {
          Color: "Royal Blue",
          Size: "XXL",
        },
        price: 699,
        originalPrice: 1199,
        initialStock: 25,
      },
      {
        id: "northline-pique-polo-t-shirt-black-s",
        optionValues: {
          Color: "Black",
          Size: "S",
        },
        price: 699,
        originalPrice: 1199,
        initialStock: 25,
      },
      {
        id: "northline-pique-polo-t-shirt-black-m",
        optionValues: {
          Color: "Black",
          Size: "M",
        },
        price: 699,
        originalPrice: 1199,
        initialStock: 25,
      },
      {
        id: "northline-pique-polo-t-shirt-black-l",
        optionValues: {
          Color: "Black",
          Size: "L",
        },
        price: 699,
        originalPrice: 1199,
        initialStock: 25,
      },
      {
        id: "northline-pique-polo-t-shirt-black-xl",
        optionValues: {
          Color: "Black",
          Size: "XL",
        },
        price: 699,
        originalPrice: 1199,
        initialStock: 25,
      },
      {
        id: "northline-pique-polo-t-shirt-black-xxl",
        optionValues: {
          Color: "Black",
          Size: "XXL",
        },
        price: 699,
        originalPrice: 1199,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["polo", "t-shirt", "tshirt", "casual"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-08-21T10:00:00.000Z",
  },
  {
    id: "urbano-printed-casual-shirt",
    slug: "urbano-printed-casual-shirt",
    name: "Urbano Printed Casual Shirt",
    brand: "Urbano",
    categoryId: "fashion",
    subcategoryId: "fashion-men",
    description:
      "A playful all-over print on lightweight cotton. Relaxed fit with a classic spread collar.",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1740711152088-88a009e877bb?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 3.9,
    reviewCount: 204,
    specifications: [
      {
        label: "Fabric",
        value: "Cotton",
      },
      {
        label: "Fit",
        value: "Relaxed",
      },
      {
        label: "Sleeve",
        value: "Full sleeve",
      },
      {
        label: "Pattern",
        value: "Printed",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Blue Print"],
      },
      {
        name: "Size",
        values: ["S", "M", "L", "XL", "XXL"],
      },
    ],
    variants: [
      {
        id: "urbano-printed-casual-shirt-blue-print-s",
        optionValues: {
          Color: "Blue Print",
          Size: "S",
        },
        price: 849,
        originalPrice: 849,
        initialStock: 3,
      },
      {
        id: "urbano-printed-casual-shirt-blue-print-m",
        optionValues: {
          Color: "Blue Print",
          Size: "M",
        },
        price: 849,
        originalPrice: 849,
        initialStock: 3,
      },
      {
        id: "urbano-printed-casual-shirt-blue-print-l",
        optionValues: {
          Color: "Blue Print",
          Size: "L",
        },
        price: 849,
        originalPrice: 849,
        initialStock: 3,
      },
      {
        id: "urbano-printed-casual-shirt-blue-print-xl",
        optionValues: {
          Color: "Blue Print",
          Size: "XL",
        },
        price: 849,
        originalPrice: 849,
        initialStock: 3,
      },
      {
        id: "urbano-printed-casual-shirt-blue-print-xxl",
        optionValues: {
          Color: "Blue Print",
          Size: "XXL",
        },
        price: 849,
        originalPrice: 849,
        initialStock: 3,
      },
    ],
    attributes: {},
    tags: ["shirt", "printed", "casual"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-10-05T10:00:00.000Z",
  },
  {
    id: "northline-formal-striped-shirt",
    slug: "northline-formal-striped-shirt",
    name: "Northline Formal Striped Shirt",
    brand: "Northline",
    categoryId: "fashion",
    subcategoryId: "fashion-men",
    description: "Crisp pinstriped shirt with a wrinkle-resistant finish, built for long workdays.",
    images: [
      "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1624835567150-0c530a20d8cc?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.3,
    reviewCount: 689,
    specifications: [
      {
        label: "Fabric",
        value: "Cotton blend",
      },
      {
        label: "Fit",
        value: "Tailored",
      },
      {
        label: "Sleeve",
        value: "Full sleeve",
      },
      {
        label: "Finish",
        value: "Wrinkle resistant",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Blue Stripe"],
      },
      {
        name: "Size",
        values: ["S", "M", "L", "XL", "XXL"],
      },
    ],
    variants: [
      {
        id: "northline-formal-striped-shirt-blue-stripe-s",
        optionValues: {
          Color: "Blue Stripe",
          Size: "S",
        },
        price: 1599,
        originalPrice: 2299,
        initialStock: 0,
      },
      {
        id: "northline-formal-striped-shirt-blue-stripe-m",
        optionValues: {
          Color: "Blue Stripe",
          Size: "M",
        },
        price: 1599,
        originalPrice: 2299,
        initialStock: 0,
      },
      {
        id: "northline-formal-striped-shirt-blue-stripe-l",
        optionValues: {
          Color: "Blue Stripe",
          Size: "L",
        },
        price: 1599,
        originalPrice: 2299,
        initialStock: 0,
      },
      {
        id: "northline-formal-striped-shirt-blue-stripe-xl",
        optionValues: {
          Color: "Blue Stripe",
          Size: "XL",
        },
        price: 1599,
        originalPrice: 2299,
        initialStock: 0,
      },
      {
        id: "northline-formal-striped-shirt-blue-stripe-xxl",
        optionValues: {
          Color: "Blue Stripe",
          Size: "XXL",
        },
        price: 1599,
        originalPrice: 2299,
        initialStock: 0,
      },
    ],
    attributes: {},
    tags: ["shirt", "formal", "office", "stripes"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-09-14T10:00:00.000Z",
  },
  {
    id: "urbano-premium-linen-shirt",
    slug: "urbano-premium-linen-shirt",
    name: "Urbano Premium Linen Shirt",
    brand: "Urbano",
    categoryId: "fashion",
    subcategoryId: "fashion-men",
    description:
      "Pure linen that gets softer with every wash. Breathable, textured and perfect for warm days.",
    images: [
      "https://images.unsplash.com/photo-1602810316498-ab67cf68c8e1?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1642764873649-5c228ce3fe74?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.6,
    reviewCount: 318,
    specifications: [
      {
        label: "Fabric",
        value: "100% Linen",
      },
      {
        label: "Fit",
        value: "Regular",
      },
      {
        label: "Sleeve",
        value: "Full sleeve",
      },
      {
        label: "Care",
        value: "Gentle wash",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["White", "Sand"],
      },
      {
        name: "Size",
        values: ["S", "M", "L", "XL", "XXL"],
      },
    ],
    variants: [
      {
        id: "urbano-premium-linen-shirt-white-s",
        optionValues: {
          Color: "White",
          Size: "S",
        },
        price: 2499,
        originalPrice: 3499,
        initialStock: 25,
      },
      {
        id: "urbano-premium-linen-shirt-white-m",
        optionValues: {
          Color: "White",
          Size: "M",
        },
        price: 2499,
        originalPrice: 3499,
        initialStock: 25,
      },
      {
        id: "urbano-premium-linen-shirt-white-l",
        optionValues: {
          Color: "White",
          Size: "L",
        },
        price: 2499,
        originalPrice: 3499,
        initialStock: 25,
      },
      {
        id: "urbano-premium-linen-shirt-white-xl",
        optionValues: {
          Color: "White",
          Size: "XL",
        },
        price: 2499,
        originalPrice: 3499,
        initialStock: 25,
      },
      {
        id: "urbano-premium-linen-shirt-white-xxl",
        optionValues: {
          Color: "White",
          Size: "XXL",
        },
        price: 2499,
        originalPrice: 3499,
        initialStock: 25,
      },
      {
        id: "urbano-premium-linen-shirt-sand-s",
        optionValues: {
          Color: "Sand",
          Size: "S",
        },
        price: 2499,
        originalPrice: 3499,
        initialStock: 25,
      },
      {
        id: "urbano-premium-linen-shirt-sand-m",
        optionValues: {
          Color: "Sand",
          Size: "M",
        },
        price: 2499,
        originalPrice: 3499,
        initialStock: 25,
      },
      {
        id: "urbano-premium-linen-shirt-sand-l",
        optionValues: {
          Color: "Sand",
          Size: "L",
        },
        price: 2499,
        originalPrice: 3499,
        initialStock: 25,
      },
      {
        id: "urbano-premium-linen-shirt-sand-xl",
        optionValues: {
          Color: "Sand",
          Size: "XL",
        },
        price: 2499,
        originalPrice: 3499,
        initialStock: 25,
      },
      {
        id: "urbano-premium-linen-shirt-sand-xxl",
        optionValues: {
          Color: "Sand",
          Size: "XXL",
        },
        price: 2499,
        originalPrice: 3499,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["shirt", "linen", "premium", "summer"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-08-28T10:00:00.000Z",
  },
  {
    id: "mira-floral-wrap-midi-dress",
    slug: "mira-floral-wrap-midi-dress",
    name: "Mira Floral Wrap Midi Dress",
    brand: "Mira",
    categoryId: "fashion",
    subcategoryId: "fashion-women",
    description:
      "A flattering wrap silhouette in a flowing floral print with long sleeves and a tie waist.",
    images: [
      "https://images.unsplash.com/photo-1616313253719-c46514cddee1?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602010069450-0a62034f235c?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.5,
    reviewCount: 1920,
    specifications: [
      {
        label: "Fabric",
        value: "Viscose crepe",
      },
      {
        label: "Length",
        value: "Midi",
      },
      {
        label: "Neck",
        value: "V-neck",
      },
      {
        label: "Occasion",
        value: "Day out, Brunch",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Black Floral"],
      },
      {
        name: "Size",
        values: ["XS", "S", "M", "L", "XL"],
      },
    ],
    variants: [
      {
        id: "mira-floral-wrap-midi-dress-black-floral-xs",
        optionValues: {
          Color: "Black Floral",
          Size: "XS",
        },
        price: 1799,
        originalPrice: 2999,
        initialStock: 1,
      },
      {
        id: "mira-floral-wrap-midi-dress-black-floral-s",
        optionValues: {
          Color: "Black Floral",
          Size: "S",
        },
        price: 1799,
        originalPrice: 2999,
        initialStock: 25,
      },
      {
        id: "mira-floral-wrap-midi-dress-black-floral-m",
        optionValues: {
          Color: "Black Floral",
          Size: "M",
        },
        price: 1799,
        originalPrice: 2999,
        initialStock: 25,
      },
      {
        id: "mira-floral-wrap-midi-dress-black-floral-l",
        optionValues: {
          Color: "Black Floral",
          Size: "L",
        },
        price: 1799,
        originalPrice: 2999,
        initialStock: 25,
      },
      {
        id: "mira-floral-wrap-midi-dress-black-floral-xl",
        optionValues: {
          Color: "Black Floral",
          Size: "XL",
        },
        price: 1799,
        originalPrice: 2999,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["dress", "floral", "midi"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-10-18T10:00:00.000Z",
  },
  {
    id: "mira-summer-strappy-sundress",
    slug: "mira-summer-strappy-sundress",
    name: "Mira Summer Strappy Sundress",
    brand: "Mira",
    categoryId: "fashion",
    subcategoryId: "fashion-women",
    description: "Lightweight cotton sundress with adjustable straps and a breezy flared hem.",
    images: [
      "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1762154057377-cc9d3dd6900c?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.2,
    reviewCount: 644,
    specifications: [
      {
        label: "Fabric",
        value: "Cotton",
      },
      {
        label: "Length",
        value: "Knee length",
      },
      {
        label: "Neck",
        value: "Square neck",
      },
      {
        label: "Occasion",
        value: "Vacation, Casual",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Blue Floral"],
      },
      {
        name: "Size",
        values: ["XS", "S", "M", "L", "XL"],
      },
    ],
    variants: [
      {
        id: "mira-summer-strappy-sundress-blue-floral-xs",
        optionValues: {
          Color: "Blue Floral",
          Size: "XS",
        },
        price: 1299,
        originalPrice: 1999,
        initialStock: 25,
      },
      {
        id: "mira-summer-strappy-sundress-blue-floral-s",
        optionValues: {
          Color: "Blue Floral",
          Size: "S",
        },
        price: 1299,
        originalPrice: 1999,
        initialStock: 25,
      },
      {
        id: "mira-summer-strappy-sundress-blue-floral-m",
        optionValues: {
          Color: "Blue Floral",
          Size: "M",
        },
        price: 1299,
        originalPrice: 1999,
        initialStock: 25,
      },
      {
        id: "mira-summer-strappy-sundress-blue-floral-l",
        optionValues: {
          Color: "Blue Floral",
          Size: "L",
        },
        price: 1299,
        originalPrice: 1999,
        initialStock: 25,
      },
      {
        id: "mira-summer-strappy-sundress-blue-floral-xl",
        optionValues: {
          Color: "Blue Floral",
          Size: "XL",
        },
        price: 1299,
        originalPrice: 1999,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["dress", "sundress", "summer", "floral"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-09-03T10:00:00.000Z",
  },
  {
    id: "saanjh-printed-kaftan",
    slug: "saanjh-printed-kaftan",
    name: "Saanjh Printed Kaftan",
    brand: "Saanjh",
    categoryId: "fashion",
    subcategoryId: "fashion-women",
    description:
      "An easy, free-size kaftan in a vibrant print. Relaxed, elegant and effortless to wear.",
    images: [
      "https://images.unsplash.com/photo-1753192108753-81be0db2f7fe?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1753192108606-b4a2bc9e5661?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.3,
    reviewCount: 512,
    specifications: [
      {
        label: "Fabric",
        value: "Rayon",
      },
      {
        label: "Fit",
        value: "Relaxed",
      },
      {
        label: "Length",
        value: "Ankle length",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Ivory Print", "Blue Print"],
      },
      {
        name: "Size",
        values: ["Free Size"],
      },
    ],
    variants: [
      {
        id: "saanjh-printed-kaftan-ivory-print-free-size",
        optionValues: {
          Color: "Ivory Print",
          Size: "Free Size",
        },
        price: 1099,
        originalPrice: 1699,
        initialStock: 25,
      },
      {
        id: "saanjh-printed-kaftan-blue-print-free-size",
        optionValues: {
          Color: "Blue Print",
          Size: "Free Size",
        },
        price: 1099,
        originalPrice: 1699,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["kaftan", "ethnic", "resort"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-01-12T10:00:00.000Z",
  },
  {
    id: "saanjh-floral-cotton-kurti-set",
    slug: "saanjh-floral-cotton-kurti-set",
    name: "Saanjh Floral Cotton Kurti Set",
    brand: "Saanjh",
    categoryId: "fashion",
    subcategoryId: "fashion-women",
    description:
      "A printed cotton kurti paired with a matching flared skirt. Comfortable for everyday and festive wear.",
    images: [
      "https://images.unsplash.com/photo-1789110520185-e1a6a694b795?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.4,
    reviewCount: 873,
    specifications: [
      {
        label: "Fabric",
        value: "Cotton",
      },
      {
        label: "Set",
        value: "Kurti + Skirt",
      },
      {
        label: "Sleeve",
        value: "Three-quarter",
      },
      {
        label: "Occasion",
        value: "Festive, Casual",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Red Floral"],
      },
      {
        name: "Size",
        values: ["XS", "S", "M", "L", "XL"],
      },
    ],
    variants: [
      {
        id: "saanjh-floral-cotton-kurti-set-red-floral-xs",
        optionValues: {
          Color: "Red Floral",
          Size: "XS",
        },
        price: 1499,
        originalPrice: 2499,
        initialStock: 2,
      },
      {
        id: "saanjh-floral-cotton-kurti-set-red-floral-s",
        optionValues: {
          Color: "Red Floral",
          Size: "S",
        },
        price: 1499,
        originalPrice: 2499,
        initialStock: 2,
      },
      {
        id: "saanjh-floral-cotton-kurti-set-red-floral-m",
        optionValues: {
          Color: "Red Floral",
          Size: "M",
        },
        price: 1499,
        originalPrice: 2499,
        initialStock: 2,
      },
      {
        id: "saanjh-floral-cotton-kurti-set-red-floral-l",
        optionValues: {
          Color: "Red Floral",
          Size: "L",
        },
        price: 1499,
        originalPrice: 2499,
        initialStock: 2,
      },
      {
        id: "saanjh-floral-cotton-kurti-set-red-floral-xl",
        optionValues: {
          Color: "Red Floral",
          Size: "XL",
        },
        price: 1499,
        originalPrice: 2499,
        initialStock: 2,
      },
    ],
    attributes: {},
    tags: ["kurti", "kurta", "ethnic", "festive"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-12-22T10:00:00.000Z",
  },
  {
    id: "denimly-high-rise-skinny-jeans",
    slug: "denimly-high-rise-skinny-jeans",
    name: "Denimly High-Rise Skinny Jeans",
    brand: "Denimly",
    categoryId: "fashion",
    subcategoryId: "fashion-women",
    description:
      "Stretchy high-rise skinny jeans that hold their shape all day. A versatile mid-blue wash.",
    images: [
      "https://images.unsplash.com/photo-1554838687-235089c27977?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1598948982052-50435a6e879c?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.2,
    reviewCount: 2640,
    specifications: [
      {
        label: "Fabric",
        value: "Cotton stretch denim",
      },
      {
        label: "Rise",
        value: "High rise",
      },
      {
        label: "Fit",
        value: "Skinny",
      },
      {
        label: "Closure",
        value: "Zip and button",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Mid Blue"],
      },
      {
        name: "Size",
        values: ["26", "28", "30", "32", "34"],
      },
    ],
    variants: [
      {
        id: "denimly-high-rise-skinny-jeans-mid-blue-26",
        optionValues: {
          Color: "Mid Blue",
          Size: "26",
        },
        price: 1199,
        originalPrice: 1999,
        initialStock: 25,
      },
      {
        id: "denimly-high-rise-skinny-jeans-mid-blue-28",
        optionValues: {
          Color: "Mid Blue",
          Size: "28",
        },
        price: 1199,
        originalPrice: 1999,
        initialStock: 25,
      },
      {
        id: "denimly-high-rise-skinny-jeans-mid-blue-30",
        optionValues: {
          Color: "Mid Blue",
          Size: "30",
        },
        price: 1199,
        originalPrice: 1999,
        initialStock: 25,
      },
      {
        id: "denimly-high-rise-skinny-jeans-mid-blue-32",
        optionValues: {
          Color: "Mid Blue",
          Size: "32",
        },
        price: 1199,
        originalPrice: 1999,
        initialStock: 25,
      },
      {
        id: "denimly-high-rise-skinny-jeans-mid-blue-34",
        optionValues: {
          Color: "Mid Blue",
          Size: "34",
        },
        price: 1199,
        originalPrice: 1999,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["jeans", "denim", "casual"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-07-30T10:00:00.000Z",
  },
  {
    id: "mira-little-black-dress",
    slug: "mira-little-black-dress",
    name: "Mira Little Black Dress",
    brand: "Mira",
    categoryId: "fashion",
    subcategoryId: "fashion-women",
    description:
      "The timeless little black dress with a fitted bodice and long sleeves. Dress it up or down.",
    images: [
      "https://images.unsplash.com/photo-1599662875272-64de8289f6d8?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.6,
    reviewCount: 431,
    specifications: [
      {
        label: "Fabric",
        value: "Polyester crepe",
      },
      {
        label: "Length",
        value: "Knee length",
      },
      {
        label: "Sleeve",
        value: "Full sleeve",
      },
      {
        label: "Occasion",
        value: "Party, Evening",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Black"],
      },
      {
        name: "Size",
        values: ["XS", "S", "M", "L", "XL"],
      },
    ],
    variants: [
      {
        id: "mira-little-black-dress-black-xs",
        optionValues: {
          Color: "Black",
          Size: "XS",
        },
        price: 2199,
        originalPrice: 2199,
        initialStock: 25,
      },
      {
        id: "mira-little-black-dress-black-s",
        optionValues: {
          Color: "Black",
          Size: "S",
        },
        price: 2199,
        originalPrice: 2199,
        initialStock: 25,
      },
      {
        id: "mira-little-black-dress-black-m",
        optionValues: {
          Color: "Black",
          Size: "M",
        },
        price: 2199,
        originalPrice: 2199,
        initialStock: 25,
      },
      {
        id: "mira-little-black-dress-black-l",
        optionValues: {
          Color: "Black",
          Size: "L",
        },
        price: 2199,
        originalPrice: 2199,
        initialStock: 25,
      },
      {
        id: "mira-little-black-dress-black-xl",
        optionValues: {
          Color: "Black",
          Size: "XL",
        },
        price: 2199,
        originalPrice: 2199,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["dress", "black dress", "party"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-11-25T10:00:00.000Z",
  },
  {
    id: "aura-white-linen-dress",
    slug: "aura-white-linen-dress",
    name: "Aura White Linen Dress",
    brand: "Aura",
    categoryId: "fashion",
    subcategoryId: "fashion-women",
    description: "Minimal sleeveless dress in airy linen with a relaxed A-line cut.",
    images: [
      "https://images.unsplash.com/photo-1534875756527-5e8e4392005f?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1667665970124-2273c6ef3489?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.4,
    reviewCount: 167,
    specifications: [
      {
        label: "Fabric",
        value: "Linen blend",
      },
      {
        label: "Length",
        value: "Midi",
      },
      {
        label: "Sleeve",
        value: "Sleeveless",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["White"],
      },
      {
        name: "Size",
        values: ["XS", "S", "M", "L", "XL"],
      },
    ],
    variants: [
      {
        id: "aura-white-linen-dress-white-xs",
        optionValues: {
          Color: "White",
          Size: "XS",
        },
        price: 2799,
        originalPrice: 3999,
        initialStock: 25,
      },
      {
        id: "aura-white-linen-dress-white-s",
        optionValues: {
          Color: "White",
          Size: "S",
        },
        price: 2799,
        originalPrice: 3999,
        initialStock: 0,
      },
      {
        id: "aura-white-linen-dress-white-m",
        optionValues: {
          Color: "White",
          Size: "M",
        },
        price: 2799,
        originalPrice: 3999,
        initialStock: 0,
      },
      {
        id: "aura-white-linen-dress-white-l",
        optionValues: {
          Color: "White",
          Size: "L",
        },
        price: 2799,
        originalPrice: 3999,
        initialStock: 25,
      },
      {
        id: "aura-white-linen-dress-white-xl",
        optionValues: {
          Color: "White",
          Size: "XL",
        },
        price: 2799,
        originalPrice: 3999,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["dress", "linen", "summer", "premium"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-08-19T10:00:00.000Z",
  },
  {
    id: "tiny-trails-cotton-crew-t-shirt-pack-of-2",
    slug: "tiny-trails-cotton-crew-t-shirt-pack-of-2",
    name: "Tiny Trails Cotton Crew T-Shirt (Pack of 2)",
    brand: "Tiny Trails",
    categoryId: "fashion",
    subcategoryId: "fashion-kids",
    description: "Two soft, everyday crew-neck tees in breathable cotton, made for active kids.",
    images: [
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622290291165-d341f1938b8a?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.4,
    reviewCount: 1288,
    specifications: [
      {
        label: "Fabric",
        value: "100% Cotton",
      },
      {
        label: "Pack",
        value: "2 T-shirts",
      },
      {
        label: "Neck",
        value: "Crew neck",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["White"],
      },
      {
        name: "Size",
        values: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
      },
    ],
    variants: [
      {
        id: "tiny-trails-cotton-crew-t-shirt-pack-of-2-white-2-3y",
        optionValues: {
          Color: "White",
          Size: "2-3Y",
        },
        price: 549,
        originalPrice: 899,
        initialStock: 25,
      },
      {
        id: "tiny-trails-cotton-crew-t-shirt-pack-of-2-white-4-5y",
        optionValues: {
          Color: "White",
          Size: "4-5Y",
        },
        price: 549,
        originalPrice: 899,
        initialStock: 25,
      },
      {
        id: "tiny-trails-cotton-crew-t-shirt-pack-of-2-white-6-7y",
        optionValues: {
          Color: "White",
          Size: "6-7Y",
        },
        price: 549,
        originalPrice: 899,
        initialStock: 25,
      },
      {
        id: "tiny-trails-cotton-crew-t-shirt-pack-of-2-white-8-9y",
        optionValues: {
          Color: "White",
          Size: "8-9Y",
        },
        price: 549,
        originalPrice: 899,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["kids t-shirt", "tshirt", "boys", "girls"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-09-09T10:00:00.000Z",
  },
  {
    id: "tiny-trails-organic-baby-onesie-set",
    slug: "tiny-trails-organic-baby-onesie-set",
    name: "Tiny Trails Organic Baby Onesie Set",
    brand: "Tiny Trails",
    categoryId: "fashion",
    subcategoryId: "fashion-kids",
    description: "A set of three gentle organic-cotton onesies with easy snap closures.",
    images: [
      "https://images.unsplash.com/photo-1622290319146-7b63df48a635?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622290291720-ac961c43ee30?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.7,
    reviewCount: 642,
    specifications: [
      {
        label: "Fabric",
        value: "Organic cotton",
      },
      {
        label: "Pack",
        value: "3 onesies",
      },
      {
        label: "Closure",
        value: "Snap buttons",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["White & Blue", "Pink Bear"],
      },
      {
        name: "Size",
        values: ["0-3M", "3-6M", "6-12M"],
      },
    ],
    variants: [
      {
        id: "tiny-trails-organic-baby-onesie-set-white-and-blue-0-3m",
        optionValues: {
          Color: "White & Blue",
          Size: "0-3M",
        },
        price: 799,
        originalPrice: 1199,
        initialStock: 25,
      },
      {
        id: "tiny-trails-organic-baby-onesie-set-white-and-blue-3-6m",
        optionValues: {
          Color: "White & Blue",
          Size: "3-6M",
        },
        price: 799,
        originalPrice: 1199,
        initialStock: 25,
      },
      {
        id: "tiny-trails-organic-baby-onesie-set-white-and-blue-6-12m",
        optionValues: {
          Color: "White & Blue",
          Size: "6-12M",
        },
        price: 799,
        originalPrice: 1199,
        initialStock: 25,
      },
      {
        id: "tiny-trails-organic-baby-onesie-set-pink-bear-0-3m",
        optionValues: {
          Color: "Pink Bear",
          Size: "0-3M",
        },
        price: 799,
        originalPrice: 1199,
        initialStock: 25,
      },
      {
        id: "tiny-trails-organic-baby-onesie-set-pink-bear-3-6m",
        optionValues: {
          Color: "Pink Bear",
          Size: "3-6M",
        },
        price: 799,
        originalPrice: 1199,
        initialStock: 25,
      },
      {
        id: "tiny-trails-organic-baby-onesie-set-pink-bear-6-12m",
        optionValues: {
          Color: "Pink Bear",
          Size: "6-12M",
        },
        price: 799,
        originalPrice: 1199,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["baby", "onesie", "newborn", "infant"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-09-08T10:00:00.000Z",
  },
  {
    id: "pip-and-pop-girls-party-dress",
    slug: "pip-and-pop-girls-party-dress",
    name: "Pip & Pop Girls Party Dress",
    brand: "Pip & Pop",
    categoryId: "fashion",
    subcategoryId: "fashion-kids",
    description: "A twirl-ready party dress with soft lining and a satin waist bow.",
    images: [
      "https://images.unsplash.com/photo-1560506840-ec148e82a604?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1684244160171-97f5dac39204?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.3,
    reviewCount: 377,
    specifications: [
      {
        label: "Fabric",
        value: "Polyester with cotton lining",
      },
      {
        label: "Occasion",
        value: "Party",
      },
      {
        label: "Sleeve",
        value: "Full sleeve",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Multicolour"],
      },
      {
        name: "Size",
        values: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
      },
    ],
    variants: [
      {
        id: "pip-and-pop-girls-party-dress-multicolour-2-3y",
        optionValues: {
          Color: "Multicolour",
          Size: "2-3Y",
        },
        price: 1099,
        originalPrice: 1699,
        initialStock: 25,
      },
      {
        id: "pip-and-pop-girls-party-dress-multicolour-4-5y",
        optionValues: {
          Color: "Multicolour",
          Size: "4-5Y",
        },
        price: 1099,
        originalPrice: 1699,
        initialStock: 25,
      },
      {
        id: "pip-and-pop-girls-party-dress-multicolour-6-7y",
        optionValues: {
          Color: "Multicolour",
          Size: "6-7Y",
        },
        price: 1099,
        originalPrice: 1699,
        initialStock: 25,
      },
      {
        id: "pip-and-pop-girls-party-dress-multicolour-8-9y",
        optionValues: {
          Color: "Multicolour",
          Size: "8-9Y",
        },
        price: 1099,
        originalPrice: 1699,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["girls", "dress", "party"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-12-01T10:00:00.000Z",
  },
  {
    id: "pip-and-pop-boys-denim-shorts",
    slug: "pip-and-pop-boys-denim-shorts",
    name: "Pip & Pop Boys Denim Shorts",
    brand: "Pip & Pop",
    categoryId: "fashion",
    subcategoryId: "fashion-kids",
    description: "Durable denim shorts with an adjustable elastic waist for growing kids.",
    images: [
      "https://images.unsplash.com/photo-1632337950445-ba446cb0e26f?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622218286192-95f6a20083c7?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.0,
    reviewCount: 519,
    specifications: [
      {
        label: "Fabric",
        value: "Cotton denim",
      },
      {
        label: "Waist",
        value: "Adjustable elastic",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Light Blue"],
      },
      {
        name: "Size",
        values: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
      },
    ],
    variants: [
      {
        id: "pip-and-pop-boys-denim-shorts-light-blue-2-3y",
        optionValues: {
          Color: "Light Blue",
          Size: "2-3Y",
        },
        price: 499,
        originalPrice: 699,
        initialStock: 25,
      },
      {
        id: "pip-and-pop-boys-denim-shorts-light-blue-4-5y",
        optionValues: {
          Color: "Light Blue",
          Size: "4-5Y",
        },
        price: 499,
        originalPrice: 699,
        initialStock: 25,
      },
      {
        id: "pip-and-pop-boys-denim-shorts-light-blue-6-7y",
        optionValues: {
          Color: "Light Blue",
          Size: "6-7Y",
        },
        price: 499,
        originalPrice: 699,
        initialStock: 25,
      },
      {
        id: "pip-and-pop-boys-denim-shorts-light-blue-8-9y",
        optionValues: {
          Color: "Light Blue",
          Size: "8-9Y",
        },
        price: 499,
        originalPrice: 699,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["boys", "shorts", "denim"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-02-14T10:00:00.000Z",
  },
  {
    id: "little-gentleman-boys-party-suit",
    slug: "little-gentleman-boys-party-suit",
    name: "Little Gentleman Boys Party Suit",
    brand: "Little Gentleman",
    categoryId: "fashion",
    subcategoryId: "fashion-kids",
    description: "A smart two-piece suit with a matching cap for weddings and special occasions.",
    images: [
      "https://images.unsplash.com/photo-1673340979193-481dd0eb49c8?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1741992556912-3b2d62461e75?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.5,
    reviewCount: 226,
    specifications: [
      {
        label: "Fabric",
        value: "Poly-viscose",
      },
      {
        label: "Set",
        value: "Blazer, trousers, cap",
      },
      {
        label: "Occasion",
        value: "Wedding, Party",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Navy Blue"],
      },
      {
        name: "Size",
        values: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
      },
    ],
    variants: [
      {
        id: "little-gentleman-boys-party-suit-navy-blue-2-3y",
        optionValues: {
          Color: "Navy Blue",
          Size: "2-3Y",
        },
        price: 1999,
        originalPrice: 2999,
        initialStock: 0,
      },
      {
        id: "little-gentleman-boys-party-suit-navy-blue-4-5y",
        optionValues: {
          Color: "Navy Blue",
          Size: "4-5Y",
        },
        price: 1999,
        originalPrice: 2999,
        initialStock: 25,
      },
      {
        id: "little-gentleman-boys-party-suit-navy-blue-6-7y",
        optionValues: {
          Color: "Navy Blue",
          Size: "6-7Y",
        },
        price: 1999,
        originalPrice: 2999,
        initialStock: 25,
      },
      {
        id: "little-gentleman-boys-party-suit-navy-blue-8-9y",
        optionValues: {
          Color: "Navy Blue",
          Size: "8-9Y",
        },
        price: 1999,
        originalPrice: 2999,
        initialStock: 0,
      },
    ],
    attributes: {},
    tags: ["boys", "suit", "party", "wedding"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-10-27T10:00:00.000Z",
  },
  {
    id: "pip-and-pop-girls-polka-dot-top-and-shorts",
    slug: "pip-and-pop-girls-polka-dot-top-and-shorts",
    name: "Pip & Pop Girls Polka Dot Top & Shorts",
    brand: "Pip & Pop",
    categoryId: "fashion",
    subcategoryId: "fashion-kids",
    description: "A cheerful polka-dot top with comfy shorts. Easy to wear, easy to wash.",
    images: [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.1,
    reviewCount: 302,
    specifications: [
      {
        label: "Fabric",
        value: "Cotton",
      },
      {
        label: "Set",
        value: "Top + Shorts",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Black & White"],
      },
      {
        name: "Size",
        values: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
      },
    ],
    variants: [
      {
        id: "pip-and-pop-girls-polka-dot-top-and-shorts-black-and-white-2-3y",
        optionValues: {
          Color: "Black & White",
          Size: "2-3Y",
        },
        price: 699,
        originalPrice: 999,
        initialStock: 25,
      },
      {
        id: "pip-and-pop-girls-polka-dot-top-and-shorts-black-and-white-4-5y",
        optionValues: {
          Color: "Black & White",
          Size: "4-5Y",
        },
        price: 699,
        originalPrice: 999,
        initialStock: 1,
      },
      {
        id: "pip-and-pop-girls-polka-dot-top-and-shorts-black-and-white-6-7y",
        optionValues: {
          Color: "Black & White",
          Size: "6-7Y",
        },
        price: 699,
        originalPrice: 999,
        initialStock: 2,
      },
      {
        id: "pip-and-pop-girls-polka-dot-top-and-shorts-black-and-white-8-9y",
        optionValues: {
          Color: "Black & White",
          Size: "8-9Y",
        },
        price: 699,
        originalPrice: 999,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["girls", "set", "summer"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-04-02T10:00:00.000Z",
  },
  {
    id: "stride-cloud-runner-sneakers",
    slug: "stride-cloud-runner-sneakers",
    name: "Stride Cloud Runner Sneakers",
    brand: "Stride",
    categoryId: "fashion",
    subcategoryId: "fashion-footwear",
    description:
      "Lightweight running sneakers with responsive foam cushioning and a breathable mesh upper.",
    images: [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.5,
    reviewCount: 5320,
    specifications: [
      {
        label: "Upper",
        value: "Engineered mesh",
      },
      {
        label: "Sole",
        value: "EVA foam",
      },
      {
        label: "Closure",
        value: "Lace-up",
      },
      {
        label: "Use",
        value: "Running, Training",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["White/Orange"],
      },
      {
        name: "Size",
        values: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
      },
    ],
    variants: [
      {
        id: "stride-cloud-runner-sneakers-white-orange-uk-6",
        optionValues: {
          Color: "White/Orange",
          Size: "UK 6",
        },
        price: 2499,
        originalPrice: 3999,
        initialStock: 25,
      },
      {
        id: "stride-cloud-runner-sneakers-white-orange-uk-7",
        optionValues: {
          Color: "White/Orange",
          Size: "UK 7",
        },
        price: 2499,
        originalPrice: 3999,
        initialStock: 25,
      },
      {
        id: "stride-cloud-runner-sneakers-white-orange-uk-8",
        optionValues: {
          Color: "White/Orange",
          Size: "UK 8",
        },
        price: 2499,
        originalPrice: 3999,
        initialStock: 25,
      },
      {
        id: "stride-cloud-runner-sneakers-white-orange-uk-9",
        optionValues: {
          Color: "White/Orange",
          Size: "UK 9",
        },
        price: 2499,
        originalPrice: 3999,
        initialStock: 25,
      },
      {
        id: "stride-cloud-runner-sneakers-white-orange-uk-10",
        optionValues: {
          Color: "White/Orange",
          Size: "UK 10",
        },
        price: 2499,
        originalPrice: 3999,
        initialStock: 25,
      },
      {
        id: "stride-cloud-runner-sneakers-white-orange-uk-11",
        optionValues: {
          Color: "White/Orange",
          Size: "UK 11",
        },
        price: 2499,
        originalPrice: 3999,
        initialStock: 2,
      },
    ],
    attributes: {},
    tags: ["shoes", "sneakers", "running", "sports"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-08-11T10:00:00.000Z",
  },
  {
    id: "stride-everyday-white-sneakers",
    slug: "stride-everyday-white-sneakers",
    name: "Stride Everyday White Sneakers",
    brand: "Stride",
    categoryId: "fashion",
    subcategoryId: "fashion-footwear",
    description:
      "Clean, minimal white sneakers that go with everything. Cushioned insole for all-day comfort.",
    images: [
      "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.3,
    reviewCount: 4110,
    specifications: [
      {
        label: "Upper",
        value: "Synthetic leather",
      },
      {
        label: "Sole",
        value: "Rubber",
      },
      {
        label: "Closure",
        value: "Lace-up",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["White"],
      },
      {
        name: "Size",
        values: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
      },
    ],
    variants: [
      {
        id: "stride-everyday-white-sneakers-white-uk-6",
        optionValues: {
          Color: "White",
          Size: "UK 6",
        },
        price: 1799,
        originalPrice: 2499,
        initialStock: 25,
      },
      {
        id: "stride-everyday-white-sneakers-white-uk-7",
        optionValues: {
          Color: "White",
          Size: "UK 7",
        },
        price: 1799,
        originalPrice: 2499,
        initialStock: 25,
      },
      {
        id: "stride-everyday-white-sneakers-white-uk-8",
        optionValues: {
          Color: "White",
          Size: "UK 8",
        },
        price: 1799,
        originalPrice: 2499,
        initialStock: 25,
      },
      {
        id: "stride-everyday-white-sneakers-white-uk-9",
        optionValues: {
          Color: "White",
          Size: "UK 9",
        },
        price: 1799,
        originalPrice: 2499,
        initialStock: 25,
      },
      {
        id: "stride-everyday-white-sneakers-white-uk-10",
        optionValues: {
          Color: "White",
          Size: "UK 10",
        },
        price: 1799,
        originalPrice: 2499,
        initialStock: 25,
      },
      {
        id: "stride-everyday-white-sneakers-white-uk-11",
        optionValues: {
          Color: "White",
          Size: "UK 11",
        },
        price: 1799,
        originalPrice: 2499,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["shoes", "sneakers", "white", "casual"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-09-27T10:00:00.000Z",
  },
  {
    id: "cobbler-and-co-leather-penny-loafers",
    slug: "cobbler-and-co-leather-penny-loafers",
    name: "Cobbler & Co. Leather Penny Loafers",
    brand: "Cobbler & Co.",
    categoryId: "fashion",
    subcategoryId: "fashion-footwear",
    description: "Hand-stitched full-grain leather loafers with a cushioned footbed.",
    images: [
      "https://images.unsplash.com/photo-1616406432452-07bc5938759d?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563434564528-8fdf5996e622?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.4,
    reviewCount: 688,
    specifications: [
      {
        label: "Upper",
        value: "Full-grain leather",
      },
      {
        label: "Sole",
        value: "TPR",
      },
      {
        label: "Closure",
        value: "Slip-on",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Tan"],
      },
      {
        name: "Size",
        values: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
      },
    ],
    variants: [
      {
        id: "cobbler-and-co-leather-penny-loafers-tan-uk-6",
        optionValues: {
          Color: "Tan",
          Size: "UK 6",
        },
        price: 2999,
        originalPrice: 4499,
        initialStock: 25,
      },
      {
        id: "cobbler-and-co-leather-penny-loafers-tan-uk-7",
        optionValues: {
          Color: "Tan",
          Size: "UK 7",
        },
        price: 2999,
        originalPrice: 4499,
        initialStock: 25,
      },
      {
        id: "cobbler-and-co-leather-penny-loafers-tan-uk-8",
        optionValues: {
          Color: "Tan",
          Size: "UK 8",
        },
        price: 2999,
        originalPrice: 4499,
        initialStock: 25,
      },
      {
        id: "cobbler-and-co-leather-penny-loafers-tan-uk-9",
        optionValues: {
          Color: "Tan",
          Size: "UK 9",
        },
        price: 2999,
        originalPrice: 4499,
        initialStock: 25,
      },
      {
        id: "cobbler-and-co-leather-penny-loafers-tan-uk-10",
        optionValues: {
          Color: "Tan",
          Size: "UK 10",
        },
        price: 2999,
        originalPrice: 4499,
        initialStock: 25,
      },
      {
        id: "cobbler-and-co-leather-penny-loafers-tan-uk-11",
        optionValues: {
          Color: "Tan",
          Size: "UK 11",
        },
        price: 2999,
        originalPrice: 4499,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["shoes", "loafers", "leather", "formal"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-11-15T10:00:00.000Z",
  },
  {
    id: "cobbler-and-co-oxford-derby-shoes",
    slug: "cobbler-and-co-oxford-derby-shoes",
    name: "Cobbler & Co. Oxford Derby Shoes",
    brand: "Cobbler & Co.",
    categoryId: "fashion",
    subcategoryId: "fashion-footwear",
    description: "Classic leather derby shoes with a polished finish for office and occasions.",
    images: [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1625357165350-bdbcb6d7d524?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592776063351-ce91e931457c?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.6,
    reviewCount: 543,
    specifications: [
      {
        label: "Upper",
        value: "Genuine leather",
      },
      {
        label: "Sole",
        value: "Leather-look rubber",
      },
      {
        label: "Closure",
        value: "Lace-up",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Brown", "Black"],
      },
      {
        name: "Size",
        values: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
      },
    ],
    variants: [
      {
        id: "cobbler-and-co-oxford-derby-shoes-brown-uk-6",
        optionValues: {
          Color: "Brown",
          Size: "UK 6",
        },
        price: 3299,
        originalPrice: 4999,
        initialStock: 25,
      },
      {
        id: "cobbler-and-co-oxford-derby-shoes-brown-uk-7",
        optionValues: {
          Color: "Brown",
          Size: "UK 7",
        },
        price: 3299,
        originalPrice: 4999,
        initialStock: 25,
      },
      {
        id: "cobbler-and-co-oxford-derby-shoes-brown-uk-8",
        optionValues: {
          Color: "Brown",
          Size: "UK 8",
        },
        price: 3299,
        originalPrice: 4999,
        initialStock: 25,
      },
      {
        id: "cobbler-and-co-oxford-derby-shoes-brown-uk-9",
        optionValues: {
          Color: "Brown",
          Size: "UK 9",
        },
        price: 3299,
        originalPrice: 4999,
        initialStock: 25,
      },
      {
        id: "cobbler-and-co-oxford-derby-shoes-brown-uk-10",
        optionValues: {
          Color: "Brown",
          Size: "UK 10",
        },
        price: 3299,
        originalPrice: 4999,
        initialStock: 25,
      },
      {
        id: "cobbler-and-co-oxford-derby-shoes-brown-uk-11",
        optionValues: {
          Color: "Brown",
          Size: "UK 11",
        },
        price: 3299,
        originalPrice: 4999,
        initialStock: 25,
      },
      {
        id: "cobbler-and-co-oxford-derby-shoes-black-uk-6",
        optionValues: {
          Color: "Black",
          Size: "UK 6",
        },
        price: 3299,
        originalPrice: 4999,
        initialStock: 0,
      },
      {
        id: "cobbler-and-co-oxford-derby-shoes-black-uk-7",
        optionValues: {
          Color: "Black",
          Size: "UK 7",
        },
        price: 3299,
        originalPrice: 4999,
        initialStock: 25,
      },
      {
        id: "cobbler-and-co-oxford-derby-shoes-black-uk-8",
        optionValues: {
          Color: "Black",
          Size: "UK 8",
        },
        price: 3299,
        originalPrice: 4999,
        initialStock: 25,
      },
      {
        id: "cobbler-and-co-oxford-derby-shoes-black-uk-9",
        optionValues: {
          Color: "Black",
          Size: "UK 9",
        },
        price: 3299,
        originalPrice: 4999,
        initialStock: 25,
      },
      {
        id: "cobbler-and-co-oxford-derby-shoes-black-uk-10",
        optionValues: {
          Color: "Black",
          Size: "UK 10",
        },
        price: 3299,
        originalPrice: 4999,
        initialStock: 25,
      },
      {
        id: "cobbler-and-co-oxford-derby-shoes-black-uk-11",
        optionValues: {
          Color: "Black",
          Size: "UK 11",
        },
        price: 3299,
        originalPrice: 4999,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["shoes", "formal", "leather", "office"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-01-20T10:00:00.000Z",
  },
  {
    id: "trekline-chelsea-leather-boots",
    slug: "trekline-chelsea-leather-boots",
    name: "Trekline Chelsea Leather Boots",
    brand: "Trekline",
    categoryId: "fashion",
    subcategoryId: "fashion-footwear",
    description: "Rugged Chelsea boots with elastic side panels and a grippy lug sole.",
    images: [
      "https://images.unsplash.com/photo-1605733160314-4fc7dac4bb16?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1638609348722-aa2a3a67db26?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.2,
    reviewCount: 291,
    specifications: [
      {
        label: "Upper",
        value: "Suede leather",
      },
      {
        label: "Sole",
        value: "Rubber lug",
      },
      {
        label: "Closure",
        value: "Pull-on",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Brown"],
      },
      {
        name: "Size",
        values: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
      },
    ],
    variants: [
      {
        id: "trekline-chelsea-leather-boots-brown-uk-6",
        optionValues: {
          Color: "Brown",
          Size: "UK 6",
        },
        price: 3999,
        originalPrice: 5999,
        initialStock: 25,
      },
      {
        id: "trekline-chelsea-leather-boots-brown-uk-7",
        optionValues: {
          Color: "Brown",
          Size: "UK 7",
        },
        price: 3999,
        originalPrice: 5999,
        initialStock: 25,
      },
      {
        id: "trekline-chelsea-leather-boots-brown-uk-8",
        optionValues: {
          Color: "Brown",
          Size: "UK 8",
        },
        price: 3999,
        originalPrice: 5999,
        initialStock: 25,
      },
      {
        id: "trekline-chelsea-leather-boots-brown-uk-9",
        optionValues: {
          Color: "Brown",
          Size: "UK 9",
        },
        price: 3999,
        originalPrice: 5999,
        initialStock: 25,
      },
      {
        id: "trekline-chelsea-leather-boots-brown-uk-10",
        optionValues: {
          Color: "Brown",
          Size: "UK 10",
        },
        price: 3999,
        originalPrice: 5999,
        initialStock: 25,
      },
      {
        id: "trekline-chelsea-leather-boots-brown-uk-11",
        optionValues: {
          Color: "Brown",
          Size: "UK 11",
        },
        price: 3999,
        originalPrice: 5999,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["boots", "shoes", "leather", "winter"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-09-01T10:00:00.000Z",
  },
  {
    id: "belle-step-peep-toe-block-heels",
    slug: "belle-step-peep-toe-block-heels",
    name: "Belle Step Peep-Toe Block Heels",
    brand: "Belle Step",
    categoryId: "fashion",
    subcategoryId: "fashion-footwear",
    description: "Comfortable 6 cm block heels with a cushioned footbed and an elegant peep toe.",
    images: [
      "https://images.unsplash.com/photo-1621996659490-3275b4d0d951?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.0,
    reviewCount: 734,
    specifications: [
      {
        label: "Heel height",
        value: "6 cm",
      },
      {
        label: "Upper",
        value: "Synthetic leather",
      },
      {
        label: "Closure",
        value: "Slip-on",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Tan"],
      },
      {
        name: "Size",
        values: ["UK 3", "UK 4", "UK 5", "UK 6", "UK 7", "UK 8"],
      },
    ],
    variants: [
      {
        id: "belle-step-peep-toe-block-heels-tan-uk-3",
        optionValues: {
          Color: "Tan",
          Size: "UK 3",
        },
        price: 1599,
        originalPrice: 2299,
        initialStock: 25,
      },
      {
        id: "belle-step-peep-toe-block-heels-tan-uk-4",
        optionValues: {
          Color: "Tan",
          Size: "UK 4",
        },
        price: 1599,
        originalPrice: 2299,
        initialStock: 25,
      },
      {
        id: "belle-step-peep-toe-block-heels-tan-uk-5",
        optionValues: {
          Color: "Tan",
          Size: "UK 5",
        },
        price: 1599,
        originalPrice: 2299,
        initialStock: 25,
      },
      {
        id: "belle-step-peep-toe-block-heels-tan-uk-6",
        optionValues: {
          Color: "Tan",
          Size: "UK 6",
        },
        price: 1599,
        originalPrice: 2299,
        initialStock: 25,
      },
      {
        id: "belle-step-peep-toe-block-heels-tan-uk-7",
        optionValues: {
          Color: "Tan",
          Size: "UK 7",
        },
        price: 1599,
        originalPrice: 2299,
        initialStock: 25,
      },
      {
        id: "belle-step-peep-toe-block-heels-tan-uk-8",
        optionValues: {
          Color: "Tan",
          Size: "UK 8",
        },
        price: 1599,
        originalPrice: 2299,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["heels", "women", "shoes", "party"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-12-18T10:00:00.000Z",
  },
  {
    id: "stride-pastel-court-sneakers",
    slug: "stride-pastel-court-sneakers",
    name: "Stride Pastel Court Sneakers",
    brand: "Stride",
    categoryId: "fashion",
    subcategoryId: "fashion-footwear",
    description: "Retro court sneakers in soft pastel tones with a padded collar.",
    images: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 3.8,
    reviewCount: 96,
    specifications: [
      {
        label: "Upper",
        value: "Canvas",
      },
      {
        label: "Sole",
        value: "Rubber",
      },
      {
        label: "Closure",
        value: "Lace-up",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Pastel"],
      },
      {
        name: "Size",
        values: ["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11"],
      },
    ],
    variants: [
      {
        id: "stride-pastel-court-sneakers-pastel-uk-6",
        optionValues: {
          Color: "Pastel",
          Size: "UK 6",
        },
        price: 1499,
        originalPrice: 1499,
        initialStock: 25,
      },
      {
        id: "stride-pastel-court-sneakers-pastel-uk-7",
        optionValues: {
          Color: "Pastel",
          Size: "UK 7",
        },
        price: 1499,
        originalPrice: 1499,
        initialStock: 25,
      },
      {
        id: "stride-pastel-court-sneakers-pastel-uk-8",
        optionValues: {
          Color: "Pastel",
          Size: "UK 8",
        },
        price: 1499,
        originalPrice: 1499,
        initialStock: 25,
      },
      {
        id: "stride-pastel-court-sneakers-pastel-uk-9",
        optionValues: {
          Color: "Pastel",
          Size: "UK 9",
        },
        price: 1499,
        originalPrice: 1499,
        initialStock: 25,
      },
      {
        id: "stride-pastel-court-sneakers-pastel-uk-10",
        optionValues: {
          Color: "Pastel",
          Size: "UK 10",
        },
        price: 1499,
        originalPrice: 1499,
        initialStock: 25,
      },
      {
        id: "stride-pastel-court-sneakers-pastel-uk-11",
        optionValues: {
          Color: "Pastel",
          Size: "UK 11",
        },
        price: 1499,
        originalPrice: 1499,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["shoes", "sneakers", "pastel"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-09-15T10:00:00.000Z",
  },
  {
    id: "tempo-heritage-chronograph-watch",
    slug: "tempo-heritage-chronograph-watch",
    name: "Tempo Heritage Chronograph Watch",
    brand: "Tempo",
    categoryId: "fashion",
    subcategoryId: "fashion-accessories",
    description:
      "A classic chronograph with a stainless-steel case, sapphire-coated glass and a genuine leather strap.",
    images: [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.5,
    reviewCount: 1460,
    specifications: [
      {
        label: "Movement",
        value: "Quartz chronograph",
      },
      {
        label: "Case",
        value: "42 mm stainless steel",
      },
      {
        label: "Strap",
        value: "Genuine leather",
      },
      {
        label: "Water resistance",
        value: "50 m",
      },
    ],
    options: [],
    variants: [
      {
        id: "tempo-heritage-chronograph-watch",
        optionValues: {},
        price: 4999,
        originalPrice: 7999,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["watch", "men", "chronograph"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-10-09T10:00:00.000Z",
  },
  {
    id: "tempo-classic-steel-analog-watch",
    slug: "tempo-classic-steel-analog-watch",
    name: "Tempo Classic Steel Analog Watch",
    brand: "Tempo",
    categoryId: "fashion",
    subcategoryId: "fashion-accessories",
    description: "A minimal analog watch with a brushed steel bracelet.",
    images: [
      "https://images.unsplash.com/photo-1620625515032-6ed0c1790c75?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611243705491-71487c2ed137?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.3,
    reviewCount: 812,
    specifications: [
      {
        label: "Movement",
        value: "Quartz",
      },
      {
        label: "Case",
        value: "40 mm",
      },
      {
        label: "Strap",
        value: "Stainless steel",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Silver Dial", "Blue Dial"],
      },
    ],
    variants: [
      {
        id: "tempo-classic-steel-analog-watch-silver-dial",
        optionValues: {
          Color: "Silver Dial",
        },
        price: 3499,
        originalPrice: 4999,
        initialStock: 25,
      },
      {
        id: "tempo-classic-steel-analog-watch-blue-dial",
        optionValues: {
          Color: "Blue Dial",
        },
        price: 3499,
        originalPrice: 4999,
        initialStock: 3,
      },
    ],
    attributes: {},
    tags: ["watch", "analog", "steel"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-02-03T10:00:00.000Z",
  },
  {
    id: "luxe-lane-leather-tote-handbag",
    slug: "luxe-lane-leather-tote-handbag",
    name: "Luxe Lane Leather Tote Handbag",
    brand: "Luxe Lane",
    categoryId: "fashion",
    subcategoryId: "fashion-accessories",
    description: "A roomy structured tote in soft vegan leather with an inner zip pocket.",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1614179689702-355944cd0918?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.4,
    reviewCount: 1035,
    specifications: [
      {
        label: "Material",
        value: "Vegan leather",
      },
      {
        label: "Compartments",
        value: "2 + zip pocket",
      },
      {
        label: "Closure",
        value: "Magnetic snap",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Red", "Brown", "Black"],
      },
    ],
    variants: [
      {
        id: "luxe-lane-leather-tote-handbag-red",
        optionValues: {
          Color: "Red",
        },
        price: 2299,
        originalPrice: 3999,
        initialStock: 25,
      },
      {
        id: "luxe-lane-leather-tote-handbag-brown",
        optionValues: {
          Color: "Brown",
        },
        price: 2299,
        originalPrice: 3999,
        initialStock: 25,
      },
      {
        id: "luxe-lane-leather-tote-handbag-black",
        optionValues: {
          Color: "Black",
        },
        price: 2299,
        originalPrice: 3999,
        initialStock: 0,
      },
    ],
    attributes: {},
    tags: ["handbag", "bag", "tote", "women"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-11-07T10:00:00.000Z",
  },
  {
    id: "luxe-lane-crossbody-sling-bag",
    slug: "luxe-lane-crossbody-sling-bag",
    name: "Luxe Lane Crossbody Sling Bag",
    brand: "Luxe Lane",
    categoryId: "fashion",
    subcategoryId: "fashion-accessories",
    description:
      "A compact crossbody with an adjustable strap, sized for your phone, wallet and keys.",
    images: [
      "https://images.unsplash.com/photo-1559563458-527698bf5295?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605733513597-a8f8341084e6?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.2,
    reviewCount: 466,
    specifications: [
      {
        label: "Material",
        value: "Vegan leather",
      },
      {
        label: "Strap",
        value: "Adjustable",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Grey"],
      },
    ],
    variants: [
      {
        id: "luxe-lane-crossbody-sling-bag-grey",
        optionValues: {
          Color: "Grey",
        },
        price: 1499,
        originalPrice: 2199,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["sling bag", "crossbody", "bag"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-03-04T10:00:00.000Z",
  },
  {
    id: "solace-polarized-aviator-sunglasses",
    slug: "solace-polarized-aviator-sunglasses",
    name: "Solace Polarized Aviator Sunglasses",
    brand: "Solace",
    categoryId: "fashion",
    subcategoryId: "fashion-accessories",
    description: "Lightweight metal aviators with polarized, UV400 lenses that cut glare.",
    images: [
      "https://images.unsplash.com/photo-1567473810954-507d59716c25?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.1,
    reviewCount: 903,
    specifications: [
      {
        label: "Lens",
        value: "Polarized, UV400",
      },
      {
        label: "Frame",
        value: "Metal",
      },
    ],
    options: [],
    variants: [
      {
        id: "solace-polarized-aviator-sunglasses",
        optionValues: {},
        price: 1199,
        originalPrice: 1999,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["sunglasses", "aviator", "eyewear"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-08-29T10:00:00.000Z",
  },
  {
    id: "solace-classic-wayfarer-sunglasses",
    slug: "solace-classic-wayfarer-sunglasses",
    name: "Solace Classic Wayfarer Sunglasses",
    brand: "Solace",
    categoryId: "fashion",
    subcategoryId: "fashion-accessories",
    description: "The everyday wayfarer: durable frame, UV400 protection and timeless style.",
    images: [
      "https://images.unsplash.com/photo-1584036553516-bf83210aa16c?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1577803645773-f96470509666?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.0,
    reviewCount: 1377,
    specifications: [
      {
        label: "Lens",
        value: "UV400",
      },
      {
        label: "Frame",
        value: "Acetate",
      },
    ],
    options: [],
    variants: [
      {
        id: "solace-classic-wayfarer-sunglasses",
        optionValues: {},
        price: 899,
        originalPrice: 1499,
        initialStock: 25,
      },
    ],
    attributes: {},
    tags: ["sunglasses", "wayfarer", "eyewear"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-07-16T10:00:00.000Z",
  },
  {
    id: "cobbler-and-co-leather-wallet-and-belt-gift-set",
    slug: "cobbler-and-co-leather-wallet-and-belt-gift-set",
    name: "Cobbler & Co. Leather Wallet & Belt Gift Set",
    brand: "Cobbler & Co.",
    categoryId: "fashion",
    subcategoryId: "fashion-accessories",
    description: "A genuine leather bi-fold wallet and reversible belt in a gift box.",
    images: [
      "https://images.unsplash.com/photo-1637868796504-32f45a96d5a0?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.3,
    reviewCount: 238,
    specifications: [
      {
        label: "Material",
        value: "Genuine leather",
      },
      {
        label: "Set",
        value: "Wallet + Belt",
      },
      {
        label: "Packaging",
        value: "Gift box",
      },
    ],
    options: [],
    variants: [
      {
        id: "cobbler-and-co-leather-wallet-and-belt-gift-set",
        optionValues: {},
        price: 1299,
        originalPrice: 1999,
        initialStock: 2,
      },
    ],
    attributes: {},
    tags: ["wallet", "belt", "gift", "men"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-08-30T10:00:00.000Z",
  },
];
