import type { Category, CategoryId, Subcategory } from "@/domain/types";

/**
 * Fixed Phase 1 taxonomy (requirements §9): exactly 5 categories and 24 subcategories.
 * Do not add categories or subcategories.
 */

const sub = (categoryId: CategoryId, slug: string, name: string): Subcategory => ({
  id: `${categoryId}-${slug}`,
  categoryId,
  slug,
  name,
});

export const CATEGORIES: Category[] = [
  {
    id: "fashion",
    slug: "fashion",
    name: "Fashion",
    description:
      "Everyday wear, occasion outfits, footwear and accessories for men, women and kids.",
    subcategories: [
      sub("fashion", "men", "Men"),
      sub("fashion", "women", "Women"),
      sub("fashion", "kids", "Kids"),
      sub("fashion", "footwear", "Footwear"),
      sub("fashion", "accessories", "Accessories"),
    ],
  },
  {
    id: "home-appliances",
    slug: "home-appliances",
    name: "Home Appliances",
    description:
      "Energy-efficient refrigerators, washing machines, air conditioners and kitchen appliances for every home.",
    subcategories: [
      sub("home-appliances", "refrigerators", "Refrigerators"),
      sub("home-appliances", "washing-machines", "Washing Machines"),
      sub("home-appliances", "air-conditioner", "Air Conditioner"),
      sub("home-appliances", "kitchen", "Kitchen"),
    ],
  },
  {
    id: "beauty",
    slug: "beauty",
    name: "Beauty",
    description: "Skincare, haircare, makeup, fragrances and personal care essentials.",
    subcategories: [
      sub("beauty", "skincare", "Skincare"),
      sub("beauty", "haircare", "Haircare"),
      sub("beauty", "makeup", "Makeup"),
      sub("beauty", "fragrances", "Fragrances"),
      sub("beauty", "personal-care", "Personal Care"),
    ],
  },
  {
    id: "toys",
    slug: "toys",
    name: "Toys",
    description:
      "Learning toys, action figures, dolls, remote control toys, outdoor play and board games for all ages.",
    subcategories: [
      sub("toys", "educational-toys", "Educational Toys"),
      sub("toys", "action-figures", "Action Figures"),
      sub("toys", "dolls", "Dolls"),
      sub("toys", "remote-control-toys", "Remote Control Toys"),
      sub("toys", "outdoor-toys", "Outdoor Toys"),
      sub("toys", "board-games", "Board Games"),
    ],
  },
  {
    id: "mobiles",
    slug: "mobiles",
    name: "Mobiles",
    description: "The latest smartphones plus accessories, cases and chargers to go with them.",
    subcategories: [
      sub("mobiles", "smartphones", "Smartphones"),
      sub("mobiles", "mobile-accessories", "Mobile Accessories"),
      sub("mobiles", "cases-covers", "Cases & Covers"),
      sub("mobiles", "chargers", "Chargers"),
    ],
  },
];
