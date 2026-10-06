import { INDIAN_STATES } from "../config/indianStates";
import { INFO_PAGES } from "../config/infoPages";
import { CATEGORIES } from "../data/categories";
import { COLLECTIONS } from "../data/collections";
import { INFO_PAGES_CONTENT } from "../data/infoPages";
import { PRODUCTS } from "../data/products";
import { SEED_ORDER_COUNTER, SEED_ORDERS } from "../data/seedOrders";
import { TEST_USER } from "../data/seedUsers";

const EXPECTED_TAXONOMY: Record<string, string[]> = {
  Fashion: ["Men", "Women", "Kids", "Footwear", "Accessories"],
  "Home Appliances": ["Refrigerators", "Washing Machines", "Air Conditioner", "Kitchen"],
  Beauty: ["Skincare", "Haircare", "Makeup", "Fragrances", "Personal Care"],
  Toys: [
    "Educational Toys",
    "Action Figures",
    "Dolls",
    "Remote Control Toys",
    "Outdoor Toys",
    "Board Games",
  ],
  Mobiles: ["Smartphones", "Mobile Accessories", "Cases & Covers", "Chargers"],
};

const variants = PRODUCTS.flatMap((p) => p.variants);
const unique = (values: string[]) => new Set(values).size === values.length;

describe("taxonomy (req §5)", () => {
  const subcategories = CATEGORIES.flatMap((c) => c.subcategories);

  it("has exactly the 5 categories in navigation order", () => {
    expect(CATEGORIES.map((c) => c.name)).toEqual(Object.keys(EXPECTED_TAXONOMY));
  });

  it.each(CATEGORIES.map((c) => [c.name, c] as const))(
    "%s has the fixed subcategories",
    (name, c) => {
      expect(c.subcategories.map((s) => s.name)).toEqual(EXPECTED_TAXONOMY[name]);
    },
  );

  it("has 24 subcategories with unique, consistent, URL-safe ids", () => {
    expect(subcategories).toHaveLength(24);
    expect(unique(subcategories.map((s) => s.id))).toBe(true);
    for (const s of subcategories) {
      expect(s.slug).toMatch(/^[a-z0-9-]+$/);
      expect(s.id).toBe(`${s.categoryId}-${s.slug}`);
    }
    for (const c of CATEGORIES) {
      expect(c.id).toBe(c.slug);
      expect(c.description.length).toBeGreaterThan(20);
    }
  });

  it("keeps collections out of the taxonomy", () => {
    const names = new Set([...CATEGORIES.map((c) => c.name), ...subcategories.map((s) => s.name)]);
    expect(COLLECTIONS.map((c) => c.id)).toEqual([
      "best-sellers",
      "special-offers",
      "new-arrivals",
    ]);
    expect(COLLECTIONS.some((c) => names.has(c.name))).toBe(false);
  });
});

describe("catalog data quality (req §6)", () => {
  const subcategoryById = new Map(CATEGORIES.flatMap((c) => c.subcategories.map((s) => [s.id, s])));

  it("has 154 products and 346 variants with unique ids and slugs", () => {
    expect(PRODUCTS).toHaveLength(154);
    expect(variants).toHaveLength(346);
    expect(unique(PRODUCTS.map((p) => p.id))).toBe(true);
    expect(unique(PRODUCTS.map((p) => p.slug))).toBe(true);
    expect(unique(variants.map((v) => v.id))).toBe(true);
  });

  it("has at least 6 products in every subcategory, under the right category", () => {
    for (const s of subcategoryById.values()) {
      expect(PRODUCTS.filter((p) => p.subcategoryId === s.id).length).toBeGreaterThanOrEqual(6);
    }
    for (const p of PRODUCTS)
      expect(subcategoryById.get(p.subcategoryId)?.categoryId).toBe(p.categoryId);
  });

  it("uses clean kebab-case slugs", () => {
    for (const p of PRODUCTS) expect(p.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it("has valid prices, stock and exactly one value per option on every variant", () => {
    for (const p of PRODUCTS) {
      expect(p.variants.length).toBeGreaterThanOrEqual(1);
      for (const v of p.variants) {
        expect(Number.isInteger(v.price) && v.price > 0 && v.price <= v.originalPrice).toBe(true);
        expect(Number.isInteger(v.initialStock) && v.initialStock >= 0).toBe(true);
        expect(Object.keys(v.optionValues)).toHaveLength(p.options.length);
        for (const o of p.options) expect(o.values).toContain(v.optionValues[o.name]);
      }
    }
  });

  it("has images, ratings, descriptions, specifications and tags", () => {
    for (const p of PRODUCTS) {
      expect(p.images.length).toBeGreaterThanOrEqual(1);
      for (const url of p.images) {
        expect(url).toMatch(/^https:\/\/images\.unsplash\.com\/photo-[0-9]+-[0-9a-f]+\?/);
      }
      expect(p.rating).toBeGreaterThanOrEqual(1);
      expect(p.rating).toBeLessThanOrEqual(5);
      expect(Number.isInteger(p.reviewCount)).toBe(true);
      expect(p.description.length).toBeGreaterThan(40);
      expect(p.specifications.length).toBeGreaterThanOrEqual(2);
      expect(p.tags.length).toBeGreaterThanOrEqual(1);
    }
  });

  it("covers the stock and price scenarios the UI must handle", () => {
    const inStock = (stock: number) => stock > 0;
    expect(PRODUCTS.some((p) => p.variants.every((v) => !inStock(v.initialStock)))).toBe(true);
    expect(
      PRODUCTS.some(
        (p) =>
          p.variants.some((v) => inStock(v.initialStock)) &&
          p.variants.some((v) => !inStock(v.initialStock)),
      ),
    ).toBe(true);
    expect(variants.some((v) => v.initialStock >= 1 && v.initialStock <= 3)).toBe(true);
    const discounts = PRODUCTS.map((p) =>
      Math.round((1 - p.variants[0].price / p.variants[0].originalPrice) * 100),
    );
    expect(discounts.some((d) => d === 0)).toBe(true);
    expect(discounts.some((d) => d > 0 && d < 20)).toBe(true);
    expect(discounts.some((d) => d >= 40)).toBe(true);
    expect(variants.some((v) => v.price <= 999)).toBe(true);
    expect(variants.some((v) => v.price >= 20000)).toBe(true);
    expect(PRODUCTS.some((p) => p.isBestSeller) && PRODUCTS.some((p) => p.isNewArrival)).toBe(true);
    expect(PRODUCTS.some((p) => new Set(p.variants.map((v) => v.price)).size > 1)).toBe(true);
    expect(PRODUCTS.some((p) => p.options.length === 0)).toBe(true);
  });

  it("has at least 4 brands per category", () => {
    for (const c of CATEGORIES) {
      const brands = new Set(PRODUCTS.filter((p) => p.categoryId === c.id).map((p) => p.brand));
      expect(brands.size).toBeGreaterThanOrEqual(4);
    }
  });

  it("has the category-specific attributes filters rely on", () => {
    const of = (categoryId: string) => PRODUCTS.filter((p) => p.categoryId === categoryId);
    for (const p of of("home-appliances")) {
      expect(p.attributes).toHaveProperty("capacity");
      if (p.subcategoryId !== "home-appliances-kitchen")
        expect(p.attributes).toHaveProperty("energyRating");
    }
    for (const p of of("beauty")) {
      expect(p.attributes).toHaveProperty("productType");
      expect(p.attributes).toHaveProperty("skinHairType");
    }
    for (const p of of("toys")) expect(p.attributes).toHaveProperty("ageGroup");
  });
});

describe("seed users, orders and reference data", () => {
  it.each(SEED_ORDERS.map((o) => [o.orderId, o] as const))(
    "%s has recomputable totals and catalog snapshots",
    (_, o) => {
      const subtotal = o.items.reduce((s, i) => s + i.unitOriginalPrice * i.quantity, 0);
      const discount = o.items.reduce(
        (s, i) => s + (i.unitOriginalPrice - i.unitPrice) * i.quantity,
        0,
      );
      const value = subtotal - discount;
      const delivery = o.deliveryOption === "express" ? 99 : value >= 499 ? 0 : 40;
      expect([o.subtotal, o.discount, o.deliveryCharge, o.total]).toEqual([
        subtotal,
        discount,
        delivery,
        value + delivery,
      ]);
      for (const item of o.items) {
        const p = PRODUCTS.find((x) => x.id === item.productId);
        const v = p?.variants.find((x) => x.id === item.variantId);
        expect(item.productName).toBe(p?.name);
        expect(item.unitPrice).toBe(v?.price);
        expect(item.lineTotal).toBe(item.unitPrice * item.quantity);
      }
      expect(o.customerId).toBe(TEST_USER.id);
      expect(o.paymentMethod).toBe("Cash on Delivery");
      expect(o.isSample).toBe(true);
      expect(o.statusHistory.at(-1)?.status).toBe(o.status);
    },
  );

  it("covers Delivered, Shipped, Confirmed and Cancelled; the counter continues after them", () => {
    expect(SEED_ORDERS.map((o) => o.status).sort()).toEqual([
      "Cancelled",
      "Confirmed",
      "Delivered",
      "Shipped",
    ]);
    expect(SEED_ORDER_COUNTER).toBe(SEED_ORDERS.length);
  });

  it("lists 36 states and union territories and copy for every info page", () => {
    expect(INDIAN_STATES).toHaveLength(36);
    expect(INDIAN_STATES).toEqual(expect.arrayContaining(["Karnataka", "Ladakh"]));
    expect(INFO_PAGES_CONTENT.map((p) => p.slug)).toEqual(INFO_PAGES.map((p) => p.slug));
  });
});
