import type { Product } from "../../domain/types";

/**
 * Home Appliances: Refrigerators, Washing Machines, Air Conditioner, Kitchen.
 * Generated mock data (Phase 1). Images: Unsplash (Unsplash License).
 */
export const HOME_APPLIANCES_PRODUCTS: Product[] = [
  {
    id: "lg-242-l-frost-free-double-door-refrigerator",
    slug: "lg-242-l-frost-free-double-door-refrigerator",
    name: "LG 242 L Frost-Free Double Door Refrigerator",
    brand: "LG",
    categoryId: "home-appliances",
    subcategoryId: "home-appliances-refrigerators",
    description:
      "Smart Inverter Compressor, Multi Air Flow cooling and a convertible freezer for flexible storage.",
    images: [
      "https://images.unsplash.com/photo-1536353284924-9220c464e262?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1588854337115-1c67d9247e4d?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.4,
    reviewCount: 6120,
    specifications: [
      {
        label: "Capacity",
        value: "242 L",
      },
      {
        label: "Type",
        value: "Double door",
      },
      {
        label: "Energy rating",
        value: "3 Star",
      },
      {
        label: "Compressor",
        value: "Inverter",
      },
      {
        label: "Warranty",
        value: "1 year product, 10 years compressor",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Shiny Steel", "Ebony Sheen"],
      },
    ],
    variants: [
      {
        id: "lg-242-l-frost-free-double-door-refrigerator-shiny-steel",
        optionValues: {
          Color: "Shiny Steel",
        },
        price: 25990,
        originalPrice: 32999,
        initialStock: 9,
      },
      {
        id: "lg-242-l-frost-free-double-door-refrigerator-ebony-sheen",
        optionValues: {
          Color: "Ebony Sheen",
        },
        price: 25990,
        originalPrice: 32999,
        initialStock: 9,
      },
    ],
    attributes: {
      capacity: "242 L",
      energyRating: "3 Star",
    },
    tags: ["fridge", "refrigerator", "double door", "frost free"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-09-18T10:00:00.000Z",
  },
  {
    id: "samsung-653-l-side-by-side-refrigerator",
    slug: "samsung-653-l-side-by-side-refrigerator",
    name: "Samsung 653 L Side-by-Side Refrigerator",
    brand: "Samsung",
    categoryId: "home-appliances",
    subcategoryId: "home-appliances-refrigerators",
    description:
      "A spacious side-by-side refrigerator with SpaceMax technology and twin cooling for families.",
    images: [
      "https://images.unsplash.com/photo-1588854337115-1c67d9247e4d?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1721613877687-c9099b698faa?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.5,
    reviewCount: 1840,
    specifications: [
      {
        label: "Capacity",
        value: "653 L",
      },
      {
        label: "Type",
        value: "Side by side",
      },
      {
        label: "Energy rating",
        value: "3 Star",
      },
      {
        label: "Compressor",
        value: "Inverter",
      },
      {
        label: "Warranty",
        value: "1 year product, 10 years compressor",
      },
    ],
    options: [],
    variants: [
      {
        id: "samsung-653-l-side-by-side-refrigerator",
        optionValues: {},
        price: 74990,
        originalPrice: 99990,
        initialStock: 4,
      },
    ],
    attributes: {
      capacity: "653 L",
      energyRating: "3 Star",
    },
    tags: ["fridge", "refrigerator", "side by side", "large"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-11-04T10:00:00.000Z",
  },
  {
    id: "whirlpool-192-l-direct-cool-single-door-refrigerator",
    slug: "whirlpool-192-l-direct-cool-single-door-refrigerator",
    name: "Whirlpool 192 L Direct-Cool Single Door Refrigerator",
    brand: "Whirlpool",
    categoryId: "home-appliances",
    subcategoryId: "home-appliances-refrigerators",
    description: "Insulated Capillary Technology keeps food cool for hours during power cuts.",
    images: [
      "https://images.unsplash.com/photo-1721563927724-74b1a0ddef33?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582484898866-ac15ca496f0d?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.1,
    reviewCount: 8930,
    specifications: [
      {
        label: "Capacity",
        value: "192 L",
      },
      {
        label: "Type",
        value: "Single door",
      },
      {
        label: "Energy rating",
        value: "4 Star",
      },
      {
        label: "Compressor",
        value: "Inverter",
      },
      {
        label: "Warranty",
        value: "1 year product, 10 years compressor",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Wine Blue", "Alpha Steel"],
      },
    ],
    variants: [
      {
        id: "whirlpool-192-l-direct-cool-single-door-refrigerator-wine-blue",
        optionValues: {
          Color: "Wine Blue",
        },
        price: 13490,
        originalPrice: 16990,
        initialStock: 25,
      },
      {
        id: "whirlpool-192-l-direct-cool-single-door-refrigerator-alpha-steel",
        optionValues: {
          Color: "Alpha Steel",
        },
        price: 13490,
        originalPrice: 16990,
        initialStock: 25,
      },
    ],
    attributes: {
      capacity: "192 L",
      energyRating: "4 Star",
    },
    tags: ["fridge", "refrigerator", "single door", "budget"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-07-22T10:00:00.000Z",
  },
  {
    id: "godrej-236-l-frost-free-double-door-refrigerator",
    slug: "godrej-236-l-frost-free-double-door-refrigerator",
    name: "Godrej 236 L Frost-Free Double Door Refrigerator",
    brand: "Godrej",
    categoryId: "home-appliances",
    subcategoryId: "home-appliances-refrigerators",
    description: "Cool Balance technology and a large vegetable tray to keep produce fresh longer.",
    images: [
      "https://images.unsplash.com/photo-1630459065645-549fe5a56db4?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1722603929403-de9e80c46a9a?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.2,
    reviewCount: 2310,
    specifications: [
      {
        label: "Capacity",
        value: "236 L",
      },
      {
        label: "Type",
        value: "Double door",
      },
      {
        label: "Energy rating",
        value: "2 Star",
      },
      {
        label: "Compressor",
        value: "Inverter",
      },
      {
        label: "Warranty",
        value: "1 year product, 10 years compressor",
      },
    ],
    options: [],
    variants: [
      {
        id: "godrej-236-l-frost-free-double-door-refrigerator",
        optionValues: {},
        price: 22990,
        originalPrice: 27990,
        initialStock: 2,
      },
    ],
    attributes: {
      capacity: "236 L",
      energyRating: "2 Star",
    },
    tags: ["fridge", "refrigerator", "double door"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-02-06T10:00:00.000Z",
  },
  {
    id: "haier-325-l-bottom-mount-refrigerator",
    slug: "haier-325-l-bottom-mount-refrigerator",
    name: "Haier 325 L Bottom-Mount Refrigerator",
    brand: "Haier",
    categoryId: "home-appliances",
    subcategoryId: "home-appliances-refrigerators",
    description: "Bottom-mounted freezer with Twin Inverter and a deodoriser to keep odours away.",
    images: [
      "https://images.unsplash.com/photo-1643356472833-5b1f2cd4ca3c?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1737363625030-164e39339156?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.3,
    reviewCount: 980,
    specifications: [
      {
        label: "Capacity",
        value: "325 L",
      },
      {
        label: "Type",
        value: "Bottom mount",
      },
      {
        label: "Energy rating",
        value: "3 Star",
      },
      {
        label: "Compressor",
        value: "Inverter",
      },
      {
        label: "Warranty",
        value: "1 year product, 10 years compressor",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Moonlight Glass", "Black Steel"],
      },
    ],
    variants: [
      {
        id: "haier-325-l-bottom-mount-refrigerator-moonlight-glass",
        optionValues: {
          Color: "Moonlight Glass",
        },
        price: 32990,
        originalPrice: 42990,
        initialStock: 25,
      },
      {
        id: "haier-325-l-bottom-mount-refrigerator-black-steel",
        optionValues: {
          Color: "Black Steel",
        },
        price: 32990,
        originalPrice: 42990,
        initialStock: 0,
      },
    ],
    attributes: {
      capacity: "325 L",
      energyRating: "3 Star",
    },
    tags: ["fridge", "refrigerator", "bottom freezer", "convertible"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-09-09T10:00:00.000Z",
  },
  {
    id: "samsung-385-l-convertible-5-in-1-refrigerator",
    slug: "samsung-385-l-convertible-5-in-1-refrigerator",
    name: "Samsung 385 L Convertible 5-in-1 Refrigerator",
    brand: "Samsung",
    categoryId: "home-appliances",
    subcategoryId: "home-appliances-refrigerators",
    description: "Five conversion modes, Digital Inverter and a sleek matt finish.",
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.4,
    reviewCount: 1410,
    specifications: [
      {
        label: "Capacity",
        value: "385 L",
      },
      {
        label: "Type",
        value: "Double door",
      },
      {
        label: "Energy rating",
        value: "3 Star",
      },
      {
        label: "Compressor",
        value: "Inverter",
      },
      {
        label: "Warranty",
        value: "1 year product, 10 years compressor",
      },
    ],
    options: [],
    variants: [
      {
        id: "samsung-385-l-convertible-5-in-1-refrigerator",
        optionValues: {},
        price: 42990,
        originalPrice: 54990,
        initialStock: 0,
      },
    ],
    attributes: {
      capacity: "385 L",
      energyRating: "3 Star",
    },
    tags: ["fridge", "refrigerator", "convertible", "double door"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-12-14T10:00:00.000Z",
  },
  {
    id: "lg-8-kg-front-load-washing-machine",
    slug: "lg-8-kg-front-load-washing-machine",
    name: "LG 8 kg Front Load Washing Machine",
    brand: "LG",
    categoryId: "home-appliances",
    subcategoryId: "home-appliances-washing-machines",
    description:
      "AI Direct Drive picks the optimal wash motion, and Steam removes 99.9% of allergens.",
    images: [
      "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1597418048367-7dd01e4404ee?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.5,
    reviewCount: 4210,
    specifications: [
      {
        label: "Capacity",
        value: "8 kg",
      },
      {
        label: "Type",
        value: "Fully automatic front load",
      },
      {
        label: "Energy rating",
        value: "5 Star",
      },
      {
        label: "Max spin speed",
        value: "740 RPM",
      },
      {
        label: "Warranty",
        value: "2 years product, 10 years motor",
      },
    ],
    options: [],
    variants: [
      {
        id: "lg-8-kg-front-load-washing-machine",
        optionValues: {},
        price: 33990,
        originalPrice: 45990,
        initialStock: 7,
      },
    ],
    attributes: {
      capacity: "8 kg",
      energyRating: "5 Star",
    },
    tags: ["washing machine", "washer", "front load", "steam"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-10-11T10:00:00.000Z",
  },
  {
    id: "ifb-7-kg-front-load-washing-machine",
    slug: "ifb-7-kg-front-load-washing-machine",
    name: "IFB 7 kg Front Load Washing Machine",
    brand: "IFB",
    categoryId: "home-appliances",
    subcategoryId: "home-appliances-washing-machines",
    description: "Aqua Energie water softener, 2D wash system and a built-in heater for hot wash.",
    images: [
      "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622473590925-e3616c0a41bf?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.4,
    reviewCount: 3380,
    specifications: [
      {
        label: "Capacity",
        value: "7 kg",
      },
      {
        label: "Type",
        value: "Fully automatic front load",
      },
      {
        label: "Energy rating",
        value: "5 Star",
      },
      {
        label: "Max spin speed",
        value: "740 RPM",
      },
      {
        label: "Warranty",
        value: "2 years product, 10 years motor",
      },
    ],
    options: [],
    variants: [
      {
        id: "ifb-7-kg-front-load-washing-machine",
        optionValues: {},
        price: 27990,
        originalPrice: 35990,
        initialStock: 25,
      },
    ],
    attributes: {
      capacity: "7 kg",
      energyRating: "5 Star",
    },
    tags: ["washing machine", "washer", "front load"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-12-03T10:00:00.000Z",
  },
  {
    id: "samsung-7-kg-top-load-washing-machine",
    slug: "samsung-7-kg-top-load-washing-machine",
    name: "Samsung 7 kg Top Load Washing Machine",
    brand: "Samsung",
    categoryId: "home-appliances",
    subcategoryId: "home-appliances-washing-machines",
    description:
      "Diamond drum and Wobble technology for gentle, thorough cleaning with less tangling.",
    images: [
      "https://images.unsplash.com/photo-1662220984920-3bd1f88e846f?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1604335398980-ededcadcc37d?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.2,
    reviewCount: 7640,
    specifications: [
      {
        label: "Capacity",
        value: "7 kg",
      },
      {
        label: "Type",
        value: "Fully automatic top load",
      },
      {
        label: "Energy rating",
        value: "5 Star",
      },
      {
        label: "Max spin speed",
        value: "740 RPM",
      },
      {
        label: "Warranty",
        value: "2 years product, 10 years motor",
      },
    ],
    options: [],
    variants: [
      {
        id: "samsung-7-kg-top-load-washing-machine",
        optionValues: {},
        price: 17990,
        originalPrice: 22990,
        initialStock: 25,
      },
    ],
    attributes: {
      capacity: "7 kg",
      energyRating: "5 Star",
    },
    tags: ["washing machine", "washer", "top load"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-08-26T10:00:00.000Z",
  },
  {
    id: "whirlpool-7-5-kg-semi-automatic-washing-machine",
    slug: "whirlpool-7-5-kg-semi-automatic-washing-machine",
    name: "Whirlpool 7.5 kg Semi-Automatic Washing Machine",
    brand: "Whirlpool",
    categoryId: "home-appliances",
    subcategoryId: "home-appliances-washing-machines",
    description: "Ace Wash station with built-in scrubber and a powerful 3D scrub technology.",
    images: [
      "https://images.unsplash.com/photo-1610305401607-8745a10c75dd?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1696546761269-a8f9d2b80512?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.0,
    reviewCount: 5520,
    specifications: [
      {
        label: "Capacity",
        value: "7.5 kg",
      },
      {
        label: "Type",
        value: "Semi automatic top load",
      },
      {
        label: "Energy rating",
        value: "5 Star",
      },
      {
        label: "Max spin speed",
        value: "740 RPM",
      },
      {
        label: "Warranty",
        value: "2 years product, 10 years motor",
      },
    ],
    options: [],
    variants: [
      {
        id: "whirlpool-7-5-kg-semi-automatic-washing-machine",
        optionValues: {},
        price: 11990,
        originalPrice: 14990,
        initialStock: 3,
      },
    ],
    attributes: {
      capacity: "7.5 kg",
      energyRating: "5 Star",
    },
    tags: ["washing machine", "semi automatic", "twin tub", "budget"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-01-17T10:00:00.000Z",
  },
  {
    id: "bosch-9-kg-front-load-washing-machine",
    slug: "bosch-9-kg-front-load-washing-machine",
    name: "Bosch 9 kg Front Load Washing Machine",
    brand: "Bosch",
    categoryId: "home-appliances",
    subcategoryId: "home-appliances-washing-machines",
    description: "EcoSilence Drive, AntiStain programmes and Steam Hygiene for heavy loads.",
    images: [
      "https://images.unsplash.com/photo-1585314293845-4db3b9d0c6e9?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.6,
    reviewCount: 1120,
    specifications: [
      {
        label: "Capacity",
        value: "9 kg",
      },
      {
        label: "Type",
        value: "Fully automatic front load",
      },
      {
        label: "Energy rating",
        value: "5 Star",
      },
      {
        label: "Max spin speed",
        value: "740 RPM",
      },
      {
        label: "Warranty",
        value: "2 years product, 10 years motor",
      },
    ],
    options: [],
    variants: [
      {
        id: "bosch-9-kg-front-load-washing-machine",
        optionValues: {},
        price: 44990,
        originalPrice: 58990,
        initialStock: 5,
      },
    ],
    attributes: {
      capacity: "9 kg",
      energyRating: "5 Star",
    },
    tags: ["washing machine", "washer", "front load", "large"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-09-11T10:00:00.000Z",
  },
  {
    id: "haier-6-5-kg-top-load-washing-machine",
    slug: "haier-6-5-kg-top-load-washing-machine",
    name: "Haier 6.5 kg Top Load Washing Machine",
    brand: "Haier",
    categoryId: "home-appliances",
    subcategoryId: "home-appliances-washing-machines",
    description: "Oceanus wave drum and magic filter in a compact footprint for small homes.",
    images: [
      "https://images.unsplash.com/photo-1662220984920-3bd1f88e846f?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1696546761269-a8f9d2b80512?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 3.9,
    reviewCount: 2040,
    specifications: [
      {
        label: "Capacity",
        value: "6.5 kg",
      },
      {
        label: "Type",
        value: "Fully automatic top load",
      },
      {
        label: "Energy rating",
        value: "4 Star",
      },
      {
        label: "Max spin speed",
        value: "740 RPM",
      },
      {
        label: "Warranty",
        value: "2 years product, 10 years motor",
      },
    ],
    options: [],
    variants: [
      {
        id: "haier-6-5-kg-top-load-washing-machine",
        optionValues: {},
        price: 13490,
        originalPrice: 17990,
        initialStock: 0,
      },
    ],
    attributes: {
      capacity: "6.5 kg",
      energyRating: "4 Star",
    },
    tags: ["washing machine", "washer", "top load", "compact"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-11-21T10:00:00.000Z",
  },
  {
    id: "voltas-1-5-ton-3-star-inverter-split-ac",
    slug: "voltas-1-5-ton-3-star-inverter-split-ac",
    name: "Voltas 1.5 Ton 3 Star Inverter Split AC",
    brand: "Voltas",
    categoryId: "home-appliances",
    subcategoryId: "home-appliances-air-conditioner",
    description:
      "Adjustable 4-in-1 cooling modes, copper condenser and anti-dust filter for Indian summers.",
    images: [
      "https://images.unsplash.com/photo-1762341123870-d706f257a12e?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1757219525975-03b5984bc6e8?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.2,
    reviewCount: 9870,
    specifications: [
      {
        label: "Capacity",
        value: "1.5 Ton",
      },
      {
        label: "Type",
        value: "Split",
      },
      {
        label: "Energy rating",
        value: "3 Star",
      },
      {
        label: "Compressor",
        value: "Inverter rotary",
      },
      {
        label: "Warranty",
        value: "1 year product, 5 years PCB, 10 years compressor",
      },
    ],
    options: [],
    variants: [
      {
        id: "voltas-1-5-ton-3-star-inverter-split-ac",
        optionValues: {},
        price: 33990,
        originalPrice: 57990,
        initialStock: 10,
      },
    ],
    attributes: {
      capacity: "1.5 Ton",
      energyRating: "3 Star",
    },
    tags: ["ac", "air conditioner", "split ac", "inverter"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-08-07T10:00:00.000Z",
  },
  {
    id: "daikin-1-5-ton-5-star-inverter-split-ac",
    slug: "daikin-1-5-ton-5-star-inverter-split-ac",
    name: "Daikin 1.5 Ton 5 Star Inverter Split AC",
    brand: "Daikin",
    categoryId: "home-appliances",
    subcategoryId: "home-appliances-air-conditioner",
    description: "Coanda airflow, PM 2.5 filter and Econo mode for efficient, comfortable cooling.",
    images: [
      "https://images.unsplash.com/photo-1726614846573-c1ac2e6161d1?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1759772238012-9d5ad59ae637?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.5,
    reviewCount: 4320,
    specifications: [
      {
        label: "Capacity",
        value: "1.5 Ton",
      },
      {
        label: "Type",
        value: "Split",
      },
      {
        label: "Energy rating",
        value: "5 Star",
      },
      {
        label: "Compressor",
        value: "Inverter rotary",
      },
      {
        label: "Warranty",
        value: "1 year product, 5 years PCB, 10 years compressor",
      },
    ],
    options: [],
    variants: [
      {
        id: "daikin-1-5-ton-5-star-inverter-split-ac",
        optionValues: {},
        price: 45990,
        originalPrice: 64990,
        initialStock: 6,
      },
    ],
    attributes: {
      capacity: "1.5 Ton",
      energyRating: "5 Star",
    },
    tags: ["ac", "air conditioner", "split ac", "5 star"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-09-25T10:00:00.000Z",
  },
  {
    id: "lg-1-ton-4-star-ai-dual-inverter-split-ac",
    slug: "lg-1-ton-4-star-ai-dual-inverter-split-ac",
    name: "LG 1 Ton 4 Star AI Dual Inverter Split AC",
    brand: "LG",
    categoryId: "home-appliances",
    subcategoryId: "home-appliances-air-conditioner",
    description: "AI Convertible 6-in-1 cooling adjusts capacity to the room and saves energy.",
    images: [
      "https://images.unsplash.com/photo-1757219525975-03b5984bc6e8?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1702443418982-9aeb9e04b322?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.3,
    reviewCount: 2210,
    specifications: [
      {
        label: "Capacity",
        value: "1 Ton",
      },
      {
        label: "Type",
        value: "Split",
      },
      {
        label: "Energy rating",
        value: "4 Star",
      },
      {
        label: "Compressor",
        value: "Inverter rotary",
      },
      {
        label: "Warranty",
        value: "1 year product, 5 years PCB, 10 years compressor",
      },
    ],
    options: [],
    variants: [
      {
        id: "lg-1-ton-4-star-ai-dual-inverter-split-ac",
        optionValues: {},
        price: 36990,
        originalPrice: 49990,
        initialStock: 25,
      },
    ],
    attributes: {
      capacity: "1 Ton",
      energyRating: "4 Star",
    },
    tags: ["ac", "air conditioner", "split ac", "small room"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-02-20T10:00:00.000Z",
  },
  {
    id: "blue-star-2-ton-3-star-inverter-split-ac",
    slug: "blue-star-2-ton-3-star-inverter-split-ac",
    name: "Blue Star 2 Ton 3 Star Inverter Split AC",
    brand: "Blue Star",
    categoryId: "home-appliances",
    subcategoryId: "home-appliances-air-conditioner",
    description: "Turbo cool and a self-clean function for large living rooms.",
    images: [
      "https://images.unsplash.com/photo-1759772238012-9d5ad59ae637?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1545649311-24d0ac00ae82?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.1,
    reviewCount: 980,
    specifications: [
      {
        label: "Capacity",
        value: "2 Ton",
      },
      {
        label: "Type",
        value: "Split",
      },
      {
        label: "Energy rating",
        value: "3 Star",
      },
      {
        label: "Compressor",
        value: "Inverter rotary",
      },
      {
        label: "Warranty",
        value: "1 year product, 5 years PCB, 10 years compressor",
      },
    ],
    options: [],
    variants: [
      {
        id: "blue-star-2-ton-3-star-inverter-split-ac",
        optionValues: {},
        price: 52990,
        originalPrice: 72990,
        initialStock: 2,
      },
    ],
    attributes: {
      capacity: "2 Ton",
      energyRating: "3 Star",
    },
    tags: ["ac", "air conditioner", "large room"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-12-28T10:00:00.000Z",
  },
  {
    id: "lloyd-1-5-ton-3-star-window-ac",
    slug: "lloyd-1-5-ton-3-star-window-ac",
    name: "Lloyd 1.5 Ton 3 Star Window AC",
    brand: "Lloyd",
    categoryId: "home-appliances",
    subcategoryId: "home-appliances-air-conditioner",
    description: "A reliable window AC with a copper condenser, turbo mode and auto-restart.",
    images: [
      "https://images.unsplash.com/photo-1436473849883-bb3464c23e93?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552853160-8ec65527b252?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.0,
    reviewCount: 1650,
    specifications: [
      {
        label: "Capacity",
        value: "1.5 Ton",
      },
      {
        label: "Type",
        value: "Window",
      },
      {
        label: "Energy rating",
        value: "3 Star",
      },
      {
        label: "Compressor",
        value: "Inverter rotary",
      },
      {
        label: "Warranty",
        value: "1 year product, 5 years PCB, 10 years compressor",
      },
    ],
    options: [],
    variants: [
      {
        id: "lloyd-1-5-ton-3-star-window-ac",
        optionValues: {},
        price: 29990,
        originalPrice: 41990,
        initialStock: 25,
      },
    ],
    attributes: {
      capacity: "1.5 Ton",
      energyRating: "3 Star",
    },
    tags: ["ac", "window ac", "air conditioner"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-03-27T10:00:00.000Z",
  },
  {
    id: "samsung-1-5-ton-5-star-windfree-split-ac",
    slug: "samsung-1-5-ton-5-star-windfree-split-ac",
    name: "Samsung 1.5 Ton 5 Star WindFree Split AC",
    brand: "Samsung",
    categoryId: "home-appliances",
    subcategoryId: "home-appliances-air-conditioner",
    description: "WindFree cooling spreads air through micro-holes for draught-free comfort.",
    images: [
      "https://images.unsplash.com/photo-1718203862467-c33159fdc504?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1762341123870-d706f257a12e?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.6,
    reviewCount: 640,
    specifications: [
      {
        label: "Capacity",
        value: "1.5 Ton",
      },
      {
        label: "Type",
        value: "Split",
      },
      {
        label: "Energy rating",
        value: "5 Star",
      },
      {
        label: "Compressor",
        value: "Inverter rotary",
      },
      {
        label: "Warranty",
        value: "1 year product, 5 years PCB, 10 years compressor",
      },
    ],
    options: [],
    variants: [
      {
        id: "samsung-1-5-ton-5-star-windfree-split-ac",
        optionValues: {},
        price: 54990,
        originalPrice: 74990,
        initialStock: 4,
      },
    ],
    attributes: {
      capacity: "1.5 Ton",
      energyRating: "5 Star",
    },
    tags: ["ac", "air conditioner", "windfree", "premium"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-09-06T10:00:00.000Z",
  },
  {
    id: "philips-750-w-mixer-grinder",
    slug: "philips-750-w-mixer-grinder",
    name: "Philips 750 W Mixer Grinder",
    brand: "Philips",
    categoryId: "home-appliances",
    subcategoryId: "home-appliances-kitchen",
    description: "Powerful 750 W motor with three stainless-steel jars for wet and dry grinding.",
    images: [
      "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.3,
    reviewCount: 15200,
    specifications: [
      {
        label: "Power",
        value: "750 W",
      },
      {
        label: "Jars",
        value: "3",
      },
      {
        label: "Speed",
        value: "3-speed + pulse",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Black", "White"],
      },
    ],
    variants: [
      {
        id: "philips-750-w-mixer-grinder-black",
        optionValues: {
          Color: "Black",
        },
        price: 3999,
        originalPrice: 5995,
        initialStock: 25,
      },
      {
        id: "philips-750-w-mixer-grinder-white",
        optionValues: {
          Color: "White",
        },
        price: 3999,
        originalPrice: 5995,
        initialStock: 25,
      },
    ],
    attributes: {
      capacity: "3 Jars",
    },
    tags: ["mixer", "grinder", "mixer grinder", "kitchen"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-07-27T10:00:00.000Z",
  },
  {
    id: "samsung-23-l-solo-microwave-oven",
    slug: "samsung-23-l-solo-microwave-oven",
    name: "Samsung 23 L Solo Microwave Oven",
    brand: "Samsung",
    categoryId: "home-appliances",
    subcategoryId: "home-appliances-kitchen",
    description: "Ceramic enamel cavity, quick defrost and 6 power levels for everyday reheating.",
    images: [
      "https://images.unsplash.com/photo-1596552183299-000ef779e88d?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1543503103-f94a0036ed9d?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.2,
    reviewCount: 6430,
    specifications: [
      {
        label: "Capacity",
        value: "23 L",
      },
      {
        label: "Type",
        value: "Solo",
      },
      {
        label: "Power",
        value: "800 W",
      },
    ],
    options: [],
    variants: [
      {
        id: "samsung-23-l-solo-microwave-oven",
        optionValues: {},
        price: 6490,
        originalPrice: 8490,
        initialStock: 25,
      },
    ],
    attributes: {
      capacity: "23 L",
    },
    tags: ["microwave", "oven", "kitchen"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-10-19T10:00:00.000Z",
  },
  {
    id: "morphy-richards-2-slice-pop-up-toaster",
    slug: "morphy-richards-2-slice-pop-up-toaster",
    name: "Morphy Richards 2-Slice Pop-Up Toaster",
    brand: "Morphy Richards",
    categoryId: "home-appliances",
    subcategoryId: "home-appliances-kitchen",
    description: "Seven browning levels, reheat and defrost functions, and a removable crumb tray.",
    images: [
      "https://images.unsplash.com/photo-1618506408870-64d8bec48248?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.1,
    reviewCount: 4120,
    specifications: [
      {
        label: "Slots",
        value: "2",
      },
      {
        label: "Power",
        value: "800 W",
      },
      {
        label: "Functions",
        value: "Reheat, Defrost, Cancel",
      },
    ],
    options: [],
    variants: [
      {
        id: "morphy-richards-2-slice-pop-up-toaster",
        optionValues: {},
        price: 1699,
        originalPrice: 2495,
        initialStock: 25,
      },
    ],
    attributes: {
      capacity: "2 Slices",
    },
    tags: ["toaster", "bread", "kitchen", "breakfast"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-01-30T10:00:00.000Z",
  },
  {
    id: "prestige-drip-coffee-maker",
    slug: "prestige-drip-coffee-maker",
    name: "Prestige Drip Coffee Maker",
    brand: "Prestige",
    categoryId: "home-appliances",
    subcategoryId: "home-appliances-kitchen",
    description: "Brews up to 6 cups with a keep-warm plate and anti-drip function.",
    images: [
      "https://images.unsplash.com/photo-1608354580875-30bd4168b351?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1522725843938-035891590561?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.0,
    reviewCount: 2140,
    specifications: [
      {
        label: "Capacity",
        value: "0.75 L (6 cups)",
      },
      {
        label: "Power",
        value: "650 W",
      },
      {
        label: "Feature",
        value: "Keep warm",
      },
    ],
    options: [],
    variants: [
      {
        id: "prestige-drip-coffee-maker",
        optionValues: {},
        price: 2999,
        originalPrice: 4295,
        initialStock: 25,
      },
    ],
    attributes: {
      capacity: "0.75 L",
    },
    tags: ["coffee maker", "coffee", "kitchen"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-08-26T10:00:00.000Z",
  },
  {
    id: "bajaj-espresso-coffee-machine",
    slug: "bajaj-espresso-coffee-machine",
    name: "Bajaj Espresso Coffee Machine",
    brand: "Bajaj",
    categoryId: "home-appliances",
    subcategoryId: "home-appliances-kitchen",
    description: "15-bar pressure espresso with a steam wand for cappuccinos and lattes at home.",
    images: [
      "https://images.unsplash.com/photo-1545936055-22b27770efca?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581701663554-291c6c9e56d2?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.1,
    reviewCount: 860,
    specifications: [
      {
        label: "Pressure",
        value: "15 bar",
      },
      {
        label: "Capacity",
        value: "1.2 L water tank",
      },
      {
        label: "Feature",
        value: "Milk frother",
      },
    ],
    options: [],
    variants: [
      {
        id: "bajaj-espresso-coffee-machine",
        optionValues: {},
        price: 8999,
        originalPrice: 12999,
        initialStock: 2,
      },
    ],
    attributes: {
      capacity: "1.2 L",
    },
    tags: ["espresso", "coffee machine", "kitchen", "cafe"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-03-08T10:00:00.000Z",
  },
  {
    id: "ifb-25-l-convection-microwave-oven",
    slug: "ifb-25-l-convection-microwave-oven",
    name: "IFB 25 L Convection Microwave Oven",
    brand: "IFB",
    categoryId: "home-appliances",
    subcategoryId: "home-appliances-kitchen",
    description: "Bake, grill and roast with convection and 101 auto-cook menus.",
    images: [
      "https://images.unsplash.com/photo-1543503103-f94a0036ed9d?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596552183299-000ef779e88d?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.4,
    reviewCount: 2310,
    specifications: [
      {
        label: "Capacity",
        value: "25 L",
      },
      {
        label: "Type",
        value: "Convection",
      },
      {
        label: "Auto-cook menus",
        value: "101",
      },
    ],
    options: [],
    variants: [
      {
        id: "ifb-25-l-convection-microwave-oven",
        optionValues: {},
        price: 12990,
        originalPrice: 16990,
        initialStock: 25,
      },
    ],
    attributes: {
      capacity: "25 L",
    },
    tags: ["microwave", "convection", "oven", "baking"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-11-12T10:00:00.000Z",
  },
  {
    id: "pigeon-electric-kettle-1-5-l",
    slug: "pigeon-electric-kettle-1-5-l",
    name: "Pigeon Electric Kettle 1.5 L",
    brand: "Pigeon",
    categoryId: "home-appliances",
    subcategoryId: "home-appliances-kitchen",
    description: "Boils water in minutes with auto shut-off and a stainless-steel body.",
    images: [
      "https://images.unsplash.com/photo-1565452344518-47faca79dc69?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1623114112815-74a4b9fe505d?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.0,
    reviewCount: 18900,
    specifications: [
      {
        label: "Capacity",
        value: "1.5 L",
      },
      {
        label: "Power",
        value: "1500 W",
      },
      {
        label: "Safety",
        value: "Auto shut-off",
      },
    ],
    options: [],
    variants: [
      {
        id: "pigeon-electric-kettle-1-5-l",
        optionValues: {},
        price: 749,
        originalPrice: 1195,
        initialStock: 40,
      },
    ],
    attributes: {
      capacity: "1.5 L",
    },
    tags: ["kettle", "electric kettle", "kitchen", "tea"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-06-24T10:00:00.000Z",
  },
];
