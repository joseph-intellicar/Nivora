import type { Product } from "@/domain/types";

/**
 * Toys: Educational Toys, Action Figures, Dolls, Remote Control Toys, Outdoor Toys, Board Games.
 * Generated mock data (Phase 1). Images: Unsplash (Unsplash License).
 */
export const TOYS_PRODUCTS: Product[] = [
  {
    id: "brightminds-500-piece-building-bricks-set",
    slug: "brightminds-500-piece-building-bricks-set",
    name: "BrightMinds 500-Piece Building Bricks Set",
    brand: "BrightMinds",
    categoryId: "toys",
    subcategoryId: "toys-educational-toys",
    description: "500 colourful interlocking bricks with idea cards to spark creativity.",
    images: [
      "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1585628198535-fc932ac6dca2?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1558907353-ceb54f3882ed?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.6,
    reviewCount: 4210,
    specifications: [
      {
        label: "Pieces",
        value: "500",
      },
      {
        label: "Material",
        value: "BPA-free ABS plastic",
      },
      {
        label: "Recommended age",
        value: "6-8 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "brightminds-500-piece-building-bricks-set",
        optionValues: {},
        price: 1299,
        originalPrice: 1999,
        initialStock: 25,
      },
    ],
    attributes: {
      ageGroup: "6-8 Years",
    },
    tags: ["building blocks", "bricks", "stem", "lego"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-09-03T10:00:00.000Z",
  },
  {
    id: "brightminds-wooden-alphabet-blocks",
    slug: "brightminds-wooden-alphabet-blocks",
    name: "BrightMinds Wooden Alphabet Blocks",
    brand: "BrightMinds",
    categoryId: "toys",
    subcategoryId: "toys-educational-toys",
    description: "Smooth, painted wooden blocks for learning letters, numbers and stacking.",
    images: [
      "https://images.unsplash.com/photo-1558907353-ceb54f3882ed?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1784116740430-8a5ebc57cddf?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.5,
    reviewCount: 1880,
    specifications: [
      {
        label: "Pieces",
        value: "30",
      },
      {
        label: "Material",
        value: "Natural wood",
      },
      {
        label: "Recommended age",
        value: "0-2 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "brightminds-wooden-alphabet-blocks",
        optionValues: {},
        price: 699,
        originalPrice: 999,
        initialStock: 25,
      },
    ],
    attributes: {
      ageGroup: "0-2 Years",
    },
    tags: ["wooden toys", "alphabet", "learning", "blocks"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-11-10T10:00:00.000Z",
  },
  {
    id: "thinkerz-stem-robotics-kit",
    slug: "thinkerz-stem-robotics-kit",
    name: "Thinkerz STEM Robotics Kit",
    brand: "Thinkerz",
    categoryId: "toys",
    subcategoryId: "toys-educational-toys",
    description: "Build and code 5 different robots with this beginner-friendly STEM kit.",
    images: [
      "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1659883718058-e03d7ec598ca?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.4,
    reviewCount: 860,
    specifications: [
      {
        label: "Projects",
        value: "5 robots",
      },
      {
        label: "Batteries",
        value: "4 × AA (not included)",
      },
      {
        label: "Recommended age",
        value: "9-12 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "thinkerz-stem-robotics-kit",
        optionValues: {},
        price: 2499,
        originalPrice: 3999,
        initialStock: 25,
      },
    ],
    attributes: {
      ageGroup: "9-12 Years",
    },
    tags: ["stem", "robotics", "coding", "science"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-09-01T10:00:00.000Z",
  },
  {
    id: "brightminds-wooden-train-set",
    slug: "brightminds-wooden-train-set",
    name: "BrightMinds Wooden Train Set",
    brand: "BrightMinds",
    categoryId: "toys",
    subcategoryId: "toys-educational-toys",
    description: "A 40-piece wooden railway with bridges, engines and a station.",
    images: [
      "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1638802538115-041e14d28d6a?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.3,
    reviewCount: 1120,
    specifications: [
      {
        label: "Pieces",
        value: "40",
      },
      {
        label: "Material",
        value: "Pine wood",
      },
      {
        label: "Recommended age",
        value: "3-5 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "brightminds-wooden-train-set",
        optionValues: {},
        price: 1599,
        originalPrice: 2299,
        initialStock: 2,
      },
    ],
    attributes: {
      ageGroup: "3-5 Years",
    },
    tags: ["train set", "wooden toys", "pretend play"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-01-08T10:00:00.000Z",
  },
  {
    id: "thinkerz-magnetic-tiles-60-pieces",
    slug: "thinkerz-magnetic-tiles-60-pieces",
    name: "Thinkerz Magnetic Tiles (60 Pieces)",
    brand: "Thinkerz",
    categoryId: "toys",
    subcategoryId: "toys-educational-toys",
    description: "Clear, magnetic shapes for building 3D structures and learning geometry.",
    images: [
      "https://images.unsplash.com/photo-1784116740430-8a5ebc57cddf?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560113562-a0a37ada6d91?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.5,
    reviewCount: 2340,
    specifications: [
      {
        label: "Pieces",
        value: "60",
      },
      {
        label: "Material",
        value: "ABS with magnets",
      },
      {
        label: "Recommended age",
        value: "3-5 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "thinkerz-magnetic-tiles-60-pieces",
        optionValues: {},
        price: 1999,
        originalPrice: 2999,
        initialStock: 25,
      },
    ],
    attributes: {
      ageGroup: "3-5 Years",
    },
    tags: ["magnetic tiles", "stem", "building"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-08-22T10:00:00.000Z",
  },
  {
    id: "thinkerz-speed-cube-3x3",
    slug: "thinkerz-speed-cube-3x3",
    name: "Thinkerz Speed Cube 3x3",
    brand: "Thinkerz",
    categoryId: "toys",
    subcategoryId: "toys-educational-toys",
    description: "A smooth, stickerless speed cube for beginners and speedcubers.",
    images: [
      "https://images.unsplash.com/photo-1659883718058-e03d7ec598ca?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.2,
    reviewCount: 5260,
    specifications: [
      {
        label: "Type",
        value: "3x3",
      },
      {
        label: "Finish",
        value: "Stickerless",
      },
      {
        label: "Recommended age",
        value: "6-8 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "thinkerz-speed-cube-3x3",
        optionValues: {},
        price: 349,
        originalPrice: 499,
        initialStock: 60,
      },
    ],
    attributes: {
      ageGroup: "6-8 Years",
    },
    tags: ["puzzle cube", "brain teaser", "cube"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-03-12T10:00:00.000Z",
  },
  {
    id: "playforge-galaxy-ranger-action-figure",
    slug: "playforge-galaxy-ranger-action-figure",
    name: "Playforge Galaxy Ranger Action Figure",
    brand: "Playforge",
    categoryId: "toys",
    subcategoryId: "toys-action-figures",
    description: "A 30 cm poseable space hero with 14 points of articulation and a blaster.",
    images: [
      "https://images.unsplash.com/photo-1606663889134-b1dedb5ed8b7?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1762089423685-60f5cef02cda?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.3,
    reviewCount: 1640,
    specifications: [
      {
        label: "Height",
        value: "30 cm",
      },
      {
        label: "Articulation",
        value: "14 points",
      },
      {
        label: "Recommended age",
        value: "6-8 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "playforge-galaxy-ranger-action-figure",
        optionValues: {},
        price: 899,
        originalPrice: 1299,
        initialStock: 25,
      },
    ],
    attributes: {
      ageGroup: "6-8 Years",
    },
    tags: ["action figure", "superhero", "space"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-10-15T10:00:00.000Z",
  },
  {
    id: "playforge-transforming-robot-car",
    slug: "playforge-transforming-robot-car",
    name: "Playforge Transforming Robot Car",
    brand: "Playforge",
    categoryId: "toys",
    subcategoryId: "toys-action-figures",
    description: "Converts from sports car to robot in 12 steps.",
    images: [
      "https://images.unsplash.com/photo-1608278047522-58806a6ac85b?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1700909415800-6d2a5a83a234?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.4,
    reviewCount: 2210,
    specifications: [
      {
        label: "Height",
        value: "22 cm",
      },
      {
        label: "Feature",
        value: "Converts car ↔ robot",
      },
      {
        label: "Recommended age",
        value: "6-8 Years",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Red", "Blue"],
      },
    ],
    variants: [
      {
        id: "playforge-transforming-robot-car-red",
        optionValues: {
          Color: "Red",
        },
        price: 1299,
        originalPrice: 1999,
        initialStock: 25,
      },
      {
        id: "playforge-transforming-robot-car-blue",
        optionValues: {
          Color: "Blue",
        },
        price: 1299,
        originalPrice: 1999,
        initialStock: 25,
      },
    ],
    attributes: {
      ageGroup: "6-8 Years",
    },
    tags: ["robot", "transforming", "action figure"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-09-24T10:00:00.000Z",
  },
  {
    id: "playforge-mech-warrior-figure",
    slug: "playforge-mech-warrior-figure",
    name: "Playforge Mech Warrior Figure",
    brand: "Playforge",
    categoryId: "toys",
    subcategoryId: "toys-action-figures",
    description: "A battle-ready mech figure with light-up eyes and removable armour.",
    images: [
      "https://images.unsplash.com/photo-1630710478039-9c680b99f800?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1700909415800-6d2a5a83a234?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.1,
    reviewCount: 720,
    specifications: [
      {
        label: "Height",
        value: "25 cm",
      },
      {
        label: "Feature",
        value: "Light-up eyes",
      },
      {
        label: "Recommended age",
        value: "9-12 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "playforge-mech-warrior-figure",
        optionValues: {},
        price: 999,
        originalPrice: 1499,
        initialStock: 25,
      },
    ],
    attributes: {
      ageGroup: "9-12 Years",
    },
    tags: ["robot", "mech", "action figure"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-08-29T10:00:00.000Z",
  },
  {
    id: "heroic-squad-mini-figures-pack-of-6",
    slug: "heroic-squad-mini-figures-pack-of-6",
    name: "Heroic Squad Mini Figures (Pack of 6)",
    brand: "Heroic Squad",
    categoryId: "toys",
    subcategoryId: "toys-action-figures",
    description: "Six collectible mini heroes with interchangeable accessories.",
    images: [
      "https://images.unsplash.com/photo-1597422232698-1a27a1289cea?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1741512612523-d6b9b7cdd18b?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.0,
    reviewCount: 1950,
    specifications: [
      {
        label: "Pack",
        value: "6 figures",
      },
      {
        label: "Height",
        value: "5 cm each",
      },
      {
        label: "Recommended age",
        value: "3-5 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "heroic-squad-mini-figures-pack-of-6",
        optionValues: {},
        price: 599,
        originalPrice: 899,
        initialStock: 25,
      },
    ],
    attributes: {
      ageGroup: "3-5 Years",
    },
    tags: ["mini figures", "collectible", "action figure"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-02-02T10:00:00.000Z",
  },
  {
    id: "playforge-dragon-guardian-figure",
    slug: "playforge-dragon-guardian-figure",
    name: "Playforge Dragon Guardian Figure",
    brand: "Playforge",
    categoryId: "toys",
    subcategoryId: "toys-action-figures",
    description: "A detailed dragon figure with movable wings and tail.",
    images: [
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549056572-75914d5d5fd4?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.5,
    reviewCount: 540,
    specifications: [
      {
        label: "Wingspan",
        value: "35 cm",
      },
      {
        label: "Material",
        value: "PVC",
      },
      {
        label: "Recommended age",
        value: "9-12 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "playforge-dragon-guardian-figure",
        optionValues: {},
        price: 1499,
        originalPrice: 2199,
        initialStock: 1,
      },
    ],
    attributes: {
      ageGroup: "9-12 Years",
    },
    tags: ["dragon", "fantasy", "figure"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-12-20T10:00:00.000Z",
  },
  {
    id: "heroic-squad-toy-soldier-battle-set",
    slug: "heroic-squad-toy-soldier-battle-set",
    name: "Heroic Squad Toy Soldier Battle Set",
    brand: "Heroic Squad",
    categoryId: "toys",
    subcategoryId: "toys-action-figures",
    description: "50 classic toy soldiers with flags and barriers for epic battles.",
    images: [
      "https://images.unsplash.com/photo-1635875560469-2b94b774c187?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 3.9,
    reviewCount: 830,
    specifications: [
      {
        label: "Pieces",
        value: "50",
      },
      {
        label: "Recommended age",
        value: "6-8 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "heroic-squad-toy-soldier-battle-set",
        optionValues: {},
        price: 449,
        originalPrice: 699,
        initialStock: 0,
      },
    ],
    attributes: {
      ageGroup: "6-8 Years",
    },
    tags: ["toy soldiers", "army", "playset"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-07-25T10:00:00.000Z",
  },
  {
    id: "dollyhaven-princess-fashion-doll",
    slug: "dollyhaven-princess-fashion-doll",
    name: "Dollyhaven Princess Fashion Doll",
    brand: "Dollyhaven",
    categoryId: "toys",
    subcategoryId: "toys-dolls",
    description: "A fashion doll with a ball gown, tiara and brushable hair.",
    images: [
      "https://images.unsplash.com/photo-1612506001235-f0d0892aa11b?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1613626253486-e2d1d9fd9bc9?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.4,
    reviewCount: 3120,
    specifications: [
      {
        label: "Height",
        value: "30 cm",
      },
      {
        label: "Includes",
        value: "Gown, tiara, shoes",
      },
      {
        label: "Recommended age",
        value: "3-5 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "dollyhaven-princess-fashion-doll",
        optionValues: {},
        price: 999,
        originalPrice: 1499,
        initialStock: 25,
      },
    ],
    attributes: {
      ageGroup: "3-5 Years",
    },
    tags: ["doll", "fashion doll", "princess"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-09-07T10:00:00.000Z",
  },
  {
    id: "snugglebuds-classic-teddy-bear",
    slug: "snugglebuds-classic-teddy-bear",
    name: "Snugglebuds Classic Teddy Bear",
    brand: "Snugglebuds",
    categoryId: "toys",
    subcategoryId: "toys-dolls",
    description: "An ultra-soft 40 cm teddy with a bow tie, perfect for cuddles.",
    images: [
      "https://images.unsplash.com/photo-1602734846297-9299fc2d4703?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1701256813731-8bc46bf6f9c8?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.6,
    reviewCount: 5400,
    specifications: [
      {
        label: "Height",
        value: "40 cm",
      },
      {
        label: "Material",
        value: "Plush polyester",
      },
      {
        label: "Recommended age",
        value: "0-2 Years",
      },
    ],
    options: [
      {
        name: "Size",
        values: ["40 cm", "60 cm"],
      },
    ],
    variants: [
      {
        id: "snugglebuds-classic-teddy-bear-40-cm",
        optionValues: {
          Size: "40 cm",
        },
        price: 799,
        originalPrice: 1199,
        initialStock: 25,
      },
      {
        id: "snugglebuds-classic-teddy-bear-60-cm",
        optionValues: {
          Size: "60 cm",
        },
        price: 1299,
        originalPrice: 1799,
        initialStock: 25,
      },
    ],
    attributes: {
      ageGroup: "0-2 Years",
    },
    tags: ["teddy bear", "soft toy", "plush"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-08-01T10:00:00.000Z",
  },
  {
    id: "dollyhaven-knit-cap-twin-dolls",
    slug: "dollyhaven-knit-cap-twin-dolls",
    name: "Dollyhaven Knit Cap Twin Dolls",
    brand: "Dollyhaven",
    categoryId: "toys",
    subcategoryId: "toys-dolls",
    description: "Two soft-bodied dolls in cosy knit caps and outfits.",
    images: [
      "https://images.unsplash.com/photo-1574627958512-8c12d94ec295?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.3,
    reviewCount: 640,
    specifications: [
      {
        label: "Height",
        value: "25 cm each",
      },
      {
        label: "Pack",
        value: "2 dolls",
      },
      {
        label: "Recommended age",
        value: "3-5 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "dollyhaven-knit-cap-twin-dolls",
        optionValues: {},
        price: 1199,
        originalPrice: 1699,
        initialStock: 25,
      },
    ],
    attributes: {
      ageGroup: "3-5 Years",
    },
    tags: ["doll", "soft doll", "twins"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-09-03T10:00:00.000Z",
  },
  {
    id: "dollyhaven-doll-collection-set",
    slug: "dollyhaven-doll-collection-set",
    name: "Dollyhaven Doll Collection Set",
    brand: "Dollyhaven",
    categoryId: "toys",
    subcategoryId: "toys-dolls",
    description: "Three dolls with changeable outfits and accessories.",
    images: [
      "https://images.unsplash.com/photo-1546792913-cfec613d2163?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1698252984895-65af4243f7ce?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.2,
    reviewCount: 410,
    specifications: [
      {
        label: "Pack",
        value: "3 dolls",
      },
      {
        label: "Accessories",
        value: "12 pieces",
      },
      {
        label: "Recommended age",
        value: "6-8 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "dollyhaven-doll-collection-set",
        optionValues: {},
        price: 1799,
        originalPrice: 2499,
        initialStock: 3,
      },
    ],
    attributes: {
      ageGroup: "6-8 Years",
    },
    tags: ["doll", "doll set", "dress up"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-01-19T10:00:00.000Z",
  },
  {
    id: "snugglebuds-russian-nesting-dolls",
    slug: "snugglebuds-russian-nesting-dolls",
    name: "Snugglebuds Russian Nesting Dolls",
    brand: "Snugglebuds",
    categoryId: "toys",
    subcategoryId: "toys-dolls",
    description: "Five hand-painted wooden nesting dolls that fit neatly inside one another.",
    images: [
      "https://images.unsplash.com/photo-1598811629267-faffa0027fe4?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.1,
    reviewCount: 780,
    specifications: [
      {
        label: "Pieces",
        value: "5",
      },
      {
        label: "Material",
        value: "Wood",
      },
      {
        label: "Recommended age",
        value: "3-5 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "snugglebuds-russian-nesting-dolls",
        optionValues: {},
        price: 699,
        originalPrice: 999,
        initialStock: 25,
      },
    ],
    attributes: {
      ageGroup: "3-5 Years",
    },
    tags: ["nesting dolls", "matryoshka", "wooden"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-11-28T10:00:00.000Z",
  },
  {
    id: "snugglebuds-plush-animal-friends-pack-of-3",
    slug: "snugglebuds-plush-animal-friends-pack-of-3",
    name: "Snugglebuds Plush Animal Friends (Pack of 3)",
    brand: "Snugglebuds",
    categoryId: "toys",
    subcategoryId: "toys-dolls",
    description: "Three huggable animal plushies: a bunny, a puppy and a kitten.",
    images: [
      "https://images.unsplash.com/photo-1701256813731-8bc46bf6f9c8?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602734846297-9299fc2d4703?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.4,
    reviewCount: 1270,
    specifications: [
      {
        label: "Pack",
        value: "3 plush toys",
      },
      {
        label: "Height",
        value: "20 cm each",
      },
      {
        label: "Recommended age",
        value: "0-2 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "snugglebuds-plush-animal-friends-pack-of-3",
        optionValues: {},
        price: 899,
        originalPrice: 1299,
        initialStock: 25,
      },
    ],
    attributes: {
      ageGroup: "0-2 Years",
    },
    tags: ["soft toy", "plush", "stuffed animals"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-03-05T10:00:00.000Z",
  },
  {
    id: "zoomracers-4wd-monster-truck",
    slug: "zoomracers-4wd-monster-truck",
    name: "ZoomRacers 4WD Monster Truck",
    brand: "ZoomRacers",
    categoryId: "toys",
    subcategoryId: "toys-remote-control-toys",
    description:
      "An all-terrain 4WD monster truck that reaches 25 km/h with shock-absorbing suspension.",
    images: [
      "https://images.unsplash.com/photo-1643236873141-6511884b19e2?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1675301592430-575f35755167?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.4,
    reviewCount: 2980,
    specifications: [
      {
        label: "Scale",
        value: "1:16",
      },
      {
        label: "Speed",
        value: "Up to 25 km/h",
      },
      {
        label: "Range",
        value: "50 m",
      },
      {
        label: "Battery",
        value: "Rechargeable, 25 min",
      },
      {
        label: "Recommended age",
        value: "9-12 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "zoomracers-4wd-monster-truck",
        optionValues: {},
        price: 2499,
        originalPrice: 3999,
        initialStock: 25,
      },
    ],
    attributes: {
      ageGroup: "9-12 Years",
    },
    tags: ["rc car", "monster truck", "remote control"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-09-19T10:00:00.000Z",
  },
  {
    id: "zoomracers-rock-crawler",
    slug: "zoomracers-rock-crawler",
    name: "ZoomRacers Rock Crawler",
    brand: "ZoomRacers",
    categoryId: "toys",
    subcategoryId: "toys-remote-control-toys",
    description: "A rugged rock crawler with independent suspension for climbing obstacles.",
    images: [
      "https://images.unsplash.com/photo-1579271723124-a758848c2753?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1630029546304-981fdadbb842?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.2,
    reviewCount: 1420,
    specifications: [
      {
        label: "Scale",
        value: "1:18",
      },
      {
        label: "Range",
        value: "40 m",
      },
      {
        label: "Recommended age",
        value: "6-8 Years",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Blue", "Yellow"],
      },
    ],
    variants: [
      {
        id: "zoomracers-rock-crawler-blue",
        optionValues: {
          Color: "Blue",
        },
        price: 1999,
        originalPrice: 2999,
        initialStock: 25,
      },
      {
        id: "zoomracers-rock-crawler-yellow",
        optionValues: {
          Color: "Yellow",
        },
        price: 1999,
        originalPrice: 2999,
        initialStock: 25,
      },
    ],
    attributes: {
      ageGroup: "6-8 Years",
    },
    tags: ["rc car", "rock crawler", "off road"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-12-07T10:00:00.000Z",
  },
  {
    id: "zoomracers-off-road-jeep",
    slug: "zoomracers-off-road-jeep",
    name: "ZoomRacers Off-Road Jeep",
    brand: "ZoomRacers",
    categoryId: "toys",
    subcategoryId: "toys-remote-control-toys",
    description: "A detailed off-road jeep with working headlights.",
    images: [
      "https://images.unsplash.com/photo-1629840963351-f5e2e6578f38?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1675301586777-2c56ee8aa5ef?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.1,
    reviewCount: 880,
    specifications: [
      {
        label: "Scale",
        value: "1:16",
      },
      {
        label: "Feature",
        value: "LED headlights",
      },
      {
        label: "Recommended age",
        value: "6-8 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "zoomracers-off-road-jeep",
        optionValues: {},
        price: 1799,
        originalPrice: 2499,
        initialStock: 2,
      },
    ],
    attributes: {
      ageGroup: "6-8 Years",
    },
    tags: ["rc car", "jeep", "remote control"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-02-15T10:00:00.000Z",
  },
  {
    id: "skyhop-mini-camera-drone",
    slug: "skyhop-mini-camera-drone",
    name: "SkyHop Mini Camera Drone",
    brand: "SkyHop",
    categoryId: "toys",
    subcategoryId: "toys-remote-control-toys",
    description: "A foldable beginner drone with an HD camera, altitude hold and one-key take-off.",
    images: [
      "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504890135076-e4fcdd71043c?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.3,
    reviewCount: 1650,
    specifications: [
      {
        label: "Camera",
        value: "720p HD",
      },
      {
        label: "Flight time",
        value: "12 minutes",
      },
      {
        label: "Range",
        value: "80 m",
      },
      {
        label: "Recommended age",
        value: "12+ Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "skyhop-mini-camera-drone",
        optionValues: {},
        price: 3499,
        originalPrice: 5999,
        initialStock: 25,
      },
    ],
    attributes: {
      ageGroup: "12+ Years",
    },
    tags: ["drone", "quadcopter", "camera drone", "rc"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-10-30T10:00:00.000Z",
  },
  {
    id: "skyhop-stunt-drone",
    slug: "skyhop-stunt-drone",
    name: "SkyHop Stunt Drone",
    brand: "SkyHop",
    categoryId: "toys",
    subcategoryId: "toys-remote-control-toys",
    description: "Flips, rolls and headless mode make this a fun first drone.",
    images: [
      "https://images.unsplash.com/photo-1617165556464-ba1248d57001?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1559555302-e56712597e88?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.0,
    reviewCount: 920,
    specifications: [
      {
        label: "Flight time",
        value: "8 minutes",
      },
      {
        label: "Feature",
        value: "360° flips",
      },
      {
        label: "Recommended age",
        value: "9-12 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "skyhop-stunt-drone",
        optionValues: {},
        price: 1999,
        originalPrice: 2999,
        initialStock: 25,
      },
    ],
    attributes: {
      ageGroup: "9-12 Years",
    },
    tags: ["drone", "stunt", "rc"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-09-08T10:00:00.000Z",
  },
  {
    id: "zoomracers-mini-racing-car",
    slug: "zoomracers-mini-racing-car",
    name: "ZoomRacers Mini Racing Car",
    brand: "ZoomRacers",
    categoryId: "toys",
    subcategoryId: "toys-remote-control-toys",
    description: "A speedy palm-sized racer with a 2.4 GHz controller.",
    images: [
      "https://images.unsplash.com/photo-1727622738048-29e6f37b2a8c?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1675301590589-c56007c935d4?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 3.9,
    reviewCount: 2310,
    specifications: [
      {
        label: "Scale",
        value: "1:24",
      },
      {
        label: "Range",
        value: "30 m",
      },
      {
        label: "Recommended age",
        value: "6-8 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "zoomracers-mini-racing-car",
        optionValues: {},
        price: 799,
        originalPrice: 1199,
        initialStock: 0,
      },
    ],
    attributes: {
      ageGroup: "6-8 Years",
    },
    tags: ["rc car", "racing car", "mini"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-08-17T10:00:00.000Z",
  },
  {
    id: "sunnyplay-kids-balance-bike",
    slug: "sunnyplay-kids-balance-bike",
    name: "SunnyPlay Kids Balance Bike",
    brand: "SunnyPlay",
    categoryId: "toys",
    subcategoryId: "toys-outdoor-toys",
    description:
      "A lightweight balance bike that teaches toddlers to ride, with adjustable seat height.",
    images: [
      "https://images.unsplash.com/photo-1791129371692-d0a696eb9f60?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1763941172376-8721a5909089?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.5,
    reviewCount: 1180,
    specifications: [
      {
        label: "Frame",
        value: "Wood",
      },
      {
        label: "Seat height",
        value: "Adjustable",
      },
      {
        label: "Recommended age",
        value: "3-5 Years",
      },
    ],
    options: [
      {
        name: "Color",
        values: ["Red", "Blue"],
      },
    ],
    variants: [
      {
        id: "sunnyplay-kids-balance-bike-red",
        optionValues: {
          Color: "Red",
        },
        price: 2999,
        originalPrice: 4499,
        initialStock: 25,
      },
      {
        id: "sunnyplay-kids-balance-bike-blue",
        optionValues: {
          Color: "Blue",
        },
        price: 2999,
        originalPrice: 4499,
        initialStock: 25,
      },
    ],
    attributes: {
      ageGroup: "3-5 Years",
    },
    tags: ["balance bike", "bike", "ride on"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-09-28T10:00:00.000Z",
  },
  {
    id: "sunnyplay-3-wheel-kick-scooter",
    slug: "sunnyplay-3-wheel-kick-scooter",
    name: "SunnyPlay 3-Wheel Kick Scooter",
    brand: "SunnyPlay",
    categoryId: "toys",
    subcategoryId: "toys-outdoor-toys",
    description: "A stable 3-wheel scooter with light-up wheels and adjustable handlebar.",
    images: [
      "https://images.unsplash.com/photo-1761644048584-4f7d8692eb79?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.4,
    reviewCount: 2560,
    specifications: [
      {
        label: "Wheels",
        value: "3 LED PU wheels",
      },
      {
        label: "Max load",
        value: "50 kg",
      },
      {
        label: "Recommended age",
        value: "3-5 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "sunnyplay-3-wheel-kick-scooter",
        optionValues: {},
        price: 1799,
        originalPrice: 2699,
        initialStock: 25,
      },
    ],
    attributes: {
      ageGroup: "3-5 Years",
    },
    tags: ["scooter", "kick scooter", "ride on"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-07-14T10:00:00.000Z",
  },
  {
    id: "sunnyplay-bubble-blaster-gun",
    slug: "sunnyplay-bubble-blaster-gun",
    name: "SunnyPlay Bubble Blaster Gun",
    brand: "SunnyPlay",
    categoryId: "toys",
    subcategoryId: "toys-outdoor-toys",
    description: "Blows hundreds of bubbles a minute; includes bubble solution.",
    images: [
      "https://images.unsplash.com/photo-1783004907964-b31796149d89?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.1,
    reviewCount: 3410,
    specifications: [
      {
        label: "Includes",
        value: "Bubble solution 2 × 100 ml",
      },
      {
        label: "Batteries",
        value: "3 × AA",
      },
      {
        label: "Recommended age",
        value: "3-5 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "sunnyplay-bubble-blaster-gun",
        optionValues: {},
        price: 499,
        originalPrice: 799,
        initialStock: 45,
      },
    ],
    attributes: {
      ageGroup: "3-5 Years",
    },
    tags: ["bubbles", "bubble gun", "summer"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-03-17T10:00:00.000Z",
  },
  {
    id: "skyhigh-rainbow-kite",
    slug: "skyhigh-rainbow-kite",
    name: "SkyHigh Rainbow Kite",
    brand: "SkyHigh",
    categoryId: "toys",
    subcategoryId: "toys-outdoor-toys",
    description: "A big, easy-flying kite with 50 m of string and a winder.",
    images: [
      "https://images.unsplash.com/photo-1596554817336-19fbecb23705?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1489011397388-494518edf378?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1622987136970-7deac3fb494f?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.0,
    reviewCount: 1290,
    specifications: [
      {
        label: "Size",
        value: "120 cm",
      },
      {
        label: "String",
        value: "50 m",
      },
      {
        label: "Recommended age",
        value: "6-8 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "skyhigh-rainbow-kite",
        optionValues: {},
        price: 349,
        originalPrice: 499,
        initialStock: 25,
      },
    ],
    attributes: {
      ageGroup: "6-8 Years",
    },
    tags: ["kite", "outdoor", "flying"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-08-31T10:00:00.000Z",
  },
  {
    id: "sunnyplay-beach-and-sand-toy-set",
    slug: "sunnyplay-beach-and-sand-toy-set",
    name: "SunnyPlay Beach & Sand Toy Set",
    brand: "SunnyPlay",
    categoryId: "toys",
    subcategoryId: "toys-outdoor-toys",
    description: "A 10-piece sand set with bucket, spade, rake and moulds.",
    images: [
      "https://images.unsplash.com/photo-1769939770753-a9b298feb454?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1779315256200-a6c049776a86?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.2,
    reviewCount: 980,
    specifications: [
      {
        label: "Pieces",
        value: "10",
      },
      {
        label: "Recommended age",
        value: "0-2 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "sunnyplay-beach-and-sand-toy-set",
        optionValues: {},
        price: 599,
        originalPrice: 899,
        initialStock: 3,
      },
    ],
    attributes: {
      ageGroup: "0-2 Years",
    },
    tags: ["sand toys", "beach", "bucket"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-02-04T10:00:00.000Z",
  },
  {
    id: "sunnyplay-classic-tricycle",
    slug: "sunnyplay-classic-tricycle",
    name: "SunnyPlay Classic Tricycle",
    brand: "SunnyPlay",
    categoryId: "toys",
    subcategoryId: "toys-outdoor-toys",
    description: "A sturdy steel-frame tricycle with a rear basket and safety grip.",
    images: [
      "https://images.unsplash.com/photo-1774815352751-d35e671a0c33?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.3,
    reviewCount: 640,
    specifications: [
      {
        label: "Frame",
        value: "Steel",
      },
      {
        label: "Max load",
        value: "30 kg",
      },
      {
        label: "Recommended age",
        value: "3-5 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "sunnyplay-classic-tricycle",
        optionValues: {},
        price: 3499,
        originalPrice: 4999,
        initialStock: 0,
      },
    ],
    attributes: {
      ageGroup: "3-5 Years",
    },
    tags: ["tricycle", "ride on", "cycle"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-10-23T10:00:00.000Z",
  },
  {
    id: "gamenight-classic-wooden-chess-set",
    slug: "gamenight-classic-wooden-chess-set",
    name: "Gamenight Classic Wooden Chess Set",
    brand: "Gamenight",
    categoryId: "toys",
    subcategoryId: "toys-board-games",
    description: "A handcrafted wooden chessboard with weighted pieces and felt bases.",
    images: [
      "https://images.unsplash.com/photo-1695480542225-bc22cac128d0?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602968407815-5963b28c66af?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1536743939714-23ec5ac2dbae?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.6,
    reviewCount: 2870,
    specifications: [
      {
        label: "Board",
        value: "38 cm × 38 cm",
      },
      {
        label: "Material",
        value: "Sheesham wood",
      },
      {
        label: "Recommended age",
        value: "6-8 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "gamenight-classic-wooden-chess-set",
        optionValues: {},
        price: 1499,
        originalPrice: 2299,
        initialStock: 25,
      },
    ],
    attributes: {
      ageGroup: "6-8 Years",
    },
    tags: ["chess", "board game", "strategy"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-08-25T10:00:00.000Z",
  },
  {
    id: "gamenight-ludo-and-snakes-and-ladders-2-in-1",
    slug: "gamenight-ludo-and-snakes-and-ladders-2-in-1",
    name: "Gamenight Ludo & Snakes and Ladders 2-in-1",
    brand: "Gamenight",
    categoryId: "toys",
    subcategoryId: "toys-board-games",
    description: "Two family favourites on one foldable board, with dice and tokens.",
    images: [
      "https://images.unsplash.com/photo-1629760946220-5693ee4c46ac?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1642056446459-1f10774273f2?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.4,
    reviewCount: 6120,
    specifications: [
      {
        label: "Players",
        value: "2–4",
      },
      {
        label: "Includes",
        value: "Board, 4 dice, 16 tokens",
      },
      {
        label: "Recommended age",
        value: "6-8 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "gamenight-ludo-and-snakes-and-ladders-2-in-1",
        optionValues: {},
        price: 399,
        originalPrice: 599,
        initialStock: 50,
      },
    ],
    attributes: {
      ageGroup: "6-8 Years",
    },
    tags: ["ludo", "snakes and ladders", "family game"],
    isBestSeller: true,
    isNewArrival: false,
    createdAt: "2025-07-10T10:00:00.000Z",
  },
  {
    id: "gamenight-business-tycoon-board-game",
    slug: "gamenight-business-tycoon-board-game",
    name: "Gamenight Business Tycoon Board Game",
    brand: "Gamenight",
    categoryId: "toys",
    subcategoryId: "toys-board-games",
    description: "Buy, sell and trade your way to riches in this classic property game.",
    images: [
      "https://images.unsplash.com/photo-1741321650126-32cbd6990f94?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1547638375-ebf04735d792?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.3,
    reviewCount: 1750,
    specifications: [
      {
        label: "Players",
        value: "2–6",
      },
      {
        label: "Play time",
        value: "60–90 minutes",
      },
      {
        label: "Recommended age",
        value: "9-12 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "gamenight-business-tycoon-board-game",
        optionValues: {},
        price: 899,
        originalPrice: 1299,
        initialStock: 25,
      },
    ],
    attributes: {
      ageGroup: "9-12 Years",
    },
    tags: ["board game", "property", "trading", "family"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2025-11-29T10:00:00.000Z",
  },
  {
    id: "gamenight-dice-quest-adventure-game",
    slug: "gamenight-dice-quest-adventure-game",
    name: "Gamenight Dice Quest Adventure Game",
    brand: "Gamenight",
    categoryId: "toys",
    subcategoryId: "toys-board-games",
    description: "A cooperative dungeon adventure with custom dice and heroes.",
    images: [
      "https://images.unsplash.com/photo-1642056446459-1f10774273f2?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1589804845133-49b5e06cc415?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.1,
    reviewCount: 520,
    specifications: [
      {
        label: "Players",
        value: "1–4",
      },
      {
        label: "Play time",
        value: "45 minutes",
      },
      {
        label: "Recommended age",
        value: "12+ Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "gamenight-dice-quest-adventure-game",
        optionValues: {},
        price: 1199,
        originalPrice: 1799,
        initialStock: 25,
      },
    ],
    attributes: {
      ageGroup: "12+ Years",
    },
    tags: ["board game", "strategy", "adventure"],
    isBestSeller: false,
    isNewArrival: true,
    createdAt: "2026-09-09T10:00:00.000Z",
  },
  {
    id: "thinkerz-word-builder-letter-cubes",
    slug: "thinkerz-word-builder-letter-cubes",
    name: "Thinkerz Word Builder Letter Cubes",
    brand: "Thinkerz",
    categoryId: "toys",
    subcategoryId: "toys-board-games",
    description: "Roll letter cubes and race to build words before the timer runs out.",
    images: [
      "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.0,
    reviewCount: 830,
    specifications: [
      {
        label: "Players",
        value: "2–6",
      },
      {
        label: "Includes",
        value: "14 cubes, timer",
      },
      {
        label: "Recommended age",
        value: "6-8 Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "thinkerz-word-builder-letter-cubes",
        optionValues: {},
        price: 499,
        originalPrice: 699,
        initialStock: 2,
      },
    ],
    attributes: {
      ageGroup: "6-8 Years",
    },
    tags: ["word game", "spelling", "family"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-01-25T10:00:00.000Z",
  },
  {
    id: "gamenight-glass-chess-set",
    slug: "gamenight-glass-chess-set",
    name: "Gamenight Glass Chess Set",
    brand: "Gamenight",
    categoryId: "toys",
    subcategoryId: "toys-board-games",
    description: "A contemporary chess set with frosted and clear glass pieces.",
    images: [
      "https://images.unsplash.com/photo-1619163413327-546fdb903195?w=1200&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=1200&q=80&auto=format&fit=crop",
    ],
    rating: 4.2,
    reviewCount: 310,
    specifications: [
      {
        label: "Board",
        value: "35 cm glass",
      },
      {
        label: "Pieces",
        value: "32 glass",
      },
      {
        label: "Recommended age",
        value: "12+ Years",
      },
    ],
    options: [],
    variants: [
      {
        id: "gamenight-glass-chess-set",
        optionValues: {},
        price: 1999,
        originalPrice: 2999,
        initialStock: 0,
      },
    ],
    attributes: {
      ageGroup: "12+ Years",
    },
    tags: ["chess", "glass chess", "decor"],
    isBestSeller: false,
    isNewArrival: false,
    createdAt: "2026-03-22T10:00:00.000Z",
  },
];
