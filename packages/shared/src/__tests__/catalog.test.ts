import { CATEGORIES } from "../data/categories";
import { PRODUCTS } from "../data/products";
import { createTaxonomy, findVariant, toProductSummary } from "../domain/catalog";
import { filterValues, queryCatalog } from "../domain/filters";
import { deliveryCharge, discountPercent, summarize } from "../domain/pricing";
import { effectiveStock, maxAddable, stockStatus } from "../domain/stock";
import type { ProductQuery, ProductSummary, Variant } from "../domain/types";
import { product } from "./helpers";

const taxonomy = createTaxonomy(CATEGORIES);
const query = (over: Partial<ProductQuery> = {}) =>
  queryCatalog(PRODUCTS, { sort: "relevance", page: 1, ...over }, taxonomy, 1000);
const source = (summary: ProductSummary) => PRODUCTS.find((p) => p.id === summary.id)!;

describe("pricing and delivery (req §21)", () => {
  it("charges ₹40 below ₹499, free from ₹499, ₹99 express and nothing for an empty cart", () => {
    expect(deliveryCharge(498, "standard")).toBe(40);
    expect(deliveryCharge(499, "standard")).toBe(0);
    expect(deliveryCharge(5000, "express")).toBe(99);
    expect(deliveryCharge(0, "standard", 0)).toBe(0);
  });

  it("summarises item count, subtotal, discount, delivery and total", () => {
    const lines = [
      { unitPrice: 799, unitOriginalPrice: 1299, quantity: 2 },
      { unitPrice: 349, unitOriginalPrice: 699, quantity: 1 },
    ];
    expect(summarize(lines, "standard")).toMatchObject({
      itemCount: 3,
      subtotal: 3297,
      discount: 1350,
      deliveryCharge: 0,
      total: 1947,
    });
  });

  it("rounds discount percentages", () => {
    expect(discountPercent(799, 1299)).toBe(38);
    expect(discountPercent(849, 849)).toBe(0);
  });
});

describe("stock (req §24)", () => {
  const variant = {
    id: "x",
    optionValues: {},
    price: 1,
    originalPrice: 1,
    initialStock: 5,
  } as Variant;

  it("applies adjustments without going below zero", () => {
    expect(effectiveStock(variant, { x: -3 })).toBe(2);
    expect(effectiveStock(variant, { x: -9 })).toBe(0);
  });

  it("limits what can be added and labels low and out of stock", () => {
    expect(maxAddable(5, 2)).toBe(3);
    expect(stockStatus(2)).toBe("low_stock");
    expect(stockStatus(0)).toBe("out_of_stock");
    expect(stockStatus(10)).toBe("in_stock");
  });
});

describe("product summaries", () => {
  const s24 = product("samsung-galaxy-s24-ultra");

  it("lists a multi-variant product at its cheapest variant with a price range", () => {
    expect(toProductSummary(s24)).toMatchObject({
      price: 129999,
      hasPriceRange: true,
      requiresOptions: true,
      singleVariantId: null,
    });
  });

  it("moves the listing price to the cheapest in-stock variant", () => {
    const soldOut256 = Object.fromEntries(
      s24.variants
        .filter((v) => v.optionValues.Storage === "256 GB")
        .map((v) => [v.id, -v.initialStock]),
    );
    expect(toProductSummary(s24, soldOut256).price).toBe(139999);
    const allOut = Object.fromEntries(s24.variants.map((v) => [v.id, -v.initialStock]));
    expect(toProductSummary(s24, allOut)).toMatchObject({ inStock: false, price: 129999 });
  });

  it("resolves valid option combinations only", () => {
    expect(
      findVariant(s24, { Color: "Titanium Gray", RAM: "12 GB", Storage: "512 GB" })?.price,
    ).toBe(139999);
    expect(
      findVariant(s24, { Color: "Titanium Gray", RAM: "8 GB", Storage: "512 GB" }),
    ).toBeFalsy();
  });
});

describe("filters and facets (req §13)", () => {
  it("scopes to a category", () => {
    expect(query({ categoryId: "fashion" }).total).toBe(
      PRODUCTS.filter((p) => p.categoryId === "fashion").length,
    );
  });

  it("ORs values within a filter and ANDs across filters", () => {
    const two = query({ categoryId: "mobiles", brands: ["Samsung", "Apple"] });
    expect(new Set(two.items.map((p) => p.brand))).toEqual(new Set(["Samsung", "Apple"]));
    const both = query({
      categoryId: "mobiles",
      brands: ["Samsung", "Apple"],
      attributes: { storage: ["512 GB"] },
    });
    expect(both.items.length).toBeGreaterThanOrEqual(1);
    for (const p of both.items) {
      expect(["Samsung", "Apple"]).toContain(p.brand);
      expect(filterValues(source(p), "storage")).toContain("512 GB");
    }
    expect(two.facets.brands.length).toBeGreaterThan(2);
  });

  it("filters on variant options and keeps other values in that facet", () => {
    const xxl = query({ categoryId: "fashion", attributes: { size: ["XXL"] } });
    expect(xxl.total).toBeGreaterThan(0);
    expect(xxl.facets.attributes.size.some((o) => o.value === "S")).toBe(true);
  });

  it("applies price, rating, discount and availability filters", () => {
    const cheapToys = query({ categoryId: "toys", priceMax: 999 });
    expect(cheapToys.total).toBeGreaterThan(0);
    expect(cheapToys.items.every((p) => p.price <= 999)).toBe(true);
    expect(query({ minRating: 4.5 }).items.every((p) => p.rating >= 4.5)).toBe(true);
    expect(query({ minDiscount: 50 }).items.every((p) => p.discountPercent >= 50)).toBe(true);
    const inStock = query({ inStockOnly: true });
    expect(inStock.items.every((p) => p.inStock)).toBe(true);
    expect(inStock.total).toBeLessThan(query().total);
  });

  it("matches array attributes (skin type)", () => {
    const oily = query({ categoryId: "beauty", attributes: { skinHairType: ["Oily"] } });
    expect(oily.total).toBeGreaterThan(0);
    for (const p of oily.items) expect(filterValues(source(p), "skinHairType")).toContain("Oily");
  });

  it("offers the category's facets, price bands and ratings", () => {
    expect(Object.keys(query({ categoryId: "home-appliances" }).facets.attributes).sort()).toEqual([
      "capacity",
      "color",
      "energyRating",
    ]);
    const fashion = query({ categoryId: "fashion" });
    expect(fashion.facets.price?.bands.length).toBeGreaterThanOrEqual(2);
    expect(fashion.facets.ratings.length).toBeGreaterThanOrEqual(1);
  });
});

describe("sorting (req §14)", () => {
  const ordered = (
    sort: ProductQuery["sort"],
    key: (p: ProductSummary) => number | string,
    dir: 1 | -1,
  ) => {
    const values = query({ categoryId: "fashion", sort }).items.map(key);
    return values.every((x, i) => i === 0 || (dir > 0 ? values[i - 1] <= x : values[i - 1] >= x));
  };

  it("sorts by price, rating, newest and discount", () => {
    expect(ordered("price-asc", (p) => p.price, 1)).toBe(true);
    expect(ordered("price-desc", (p) => p.price, -1)).toBe(true);
    expect(ordered("rating", (p) => p.rating, -1)).toBe(true);
    expect(ordered("newest", (p) => p.createdAt, -1)).toBe(true);
    expect(ordered("discount", (p) => p.discountPercent, -1)).toBe(true);
  });

  it("puts out-of-stock products last for relevance", () => {
    const items = query({ categoryId: "fashion" }).items;
    const firstOut = items.findIndex((p) => !p.inStock);
    if (firstOut >= 0) expect(items.slice(firstOut).every((p) => !p.inStock)).toBe(true);
  });
});

describe("search (req §12)", () => {
  it("finds phones, plurals and multi-word matches", () => {
    const phone = query({ q: "phone" });
    expect(phone.total).toBeGreaterThan(0);
    expect(query({ q: "shoes" }).items.some((p) => p.subcategoryId === "fashion-footwear")).toBe(
      true,
    );
    const fridges = query({ q: "samsung refrigerator" }).items;
    expect(fridges.length).toBeGreaterThan(0);
    for (const p of fridges) {
      expect(p.brand).toBe("Samsung");
      expect(p.subcategoryId).toBe("home-appliances-refrigerators");
    }
  });

  it("ranks name matches first, ignores accents and returns nothing for nonsense", () => {
    expect(query({ q: "mixer" }).items[0]?.name).toContain("Mixer");
    expect(query({ q: "pique" }).total).toBeGreaterThanOrEqual(1);
    expect(query({ q: "Piqué" }).total).toBeGreaterThanOrEqual(1);
    expect(query({ q: "zzzqx" }).total).toBe(0);
  });
});

describe("collections and pagination", () => {
  it("selects best sellers, special offers and new arrivals", () => {
    expect(query({ collection: "best-sellers" }).items.every((p) => p.isBestSeller)).toBe(true);
    expect(query({ collection: "special-offers" }).items.every((p) => p.discountPercent > 0)).toBe(
      true,
    );
    expect(query({ collection: "new-arrivals" }).items.every((p) => p.isNewArrival)).toBe(true);
  });

  it("pages 24 at a time and clamps pages past the end", () => {
    const page2 = queryCatalog(PRODUCTS, { sort: "price-asc", page: 2 }, taxonomy, 24);
    expect(page2).toMatchObject({
      page: 2,
      total: PRODUCTS.length,
      pageCount: Math.ceil(PRODUCTS.length / 24),
    });
    expect(page2.items).toHaveLength(24);
    expect(queryCatalog(PRODUCTS, { sort: "relevance", page: 99 }, taxonomy, 24).page).toBe(
      page2.pageCount,
    );
  });
});
