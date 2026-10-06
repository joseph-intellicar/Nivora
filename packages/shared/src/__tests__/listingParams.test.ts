import {
  clearRefinements,
  fromApiSearch,
  hasRefinements,
  parseListingParams,
  serialiseListingParams,
  toApiSearch,
  withChange,
} from "../domain/listingParams";

const params = (value: string) => new URLSearchParams(value);
const men = { categoryId: "fashion", subcategoryId: "fashion-men" } as const;
const CATEGORY_URL =
  "brand=Levis,Urbano&size=M,L&price=500-2000&rating=4&discount=25&instock=1&sort=price-asc&page=2";

describe("listing URL parameters (arch §13.3)", () => {
  const parsed = parseListingParams(params(CATEGORY_URL), men);

  it("parses a category URL into a product query", () => {
    expect(parsed).toMatchObject({
      categoryId: "fashion",
      subcategoryIds: ["fashion-men"],
      brands: ["Levis", "Urbano"],
      attributes: { size: ["M", "L"] },
      priceMin: 500,
      priceMax: 2000,
      minRating: 4,
      minDiscount: 25,
      inStockOnly: true,
      sort: "price-asc",
      page: 2,
    });
  });

  it("serialises back to the same canonical parameters", () => {
    expect(serialiseListingParams(parsed, men)).toBe(CATEGORY_URL);
  });

  it("round-trips a search URL", () => {
    const search = parseListingParams(params("q=wireless+earbuds&category=mobiles&sort=rating"));
    expect(search).toMatchObject({
      q: "wireless earbuds",
      categoryIds: ["mobiles"],
      sort: "rating",
    });
    expect(serialiseListingParams(search)).toBe("q=wireless+earbuds&category=mobiles&sort=rating");
  });

  it("ignores garbage values and unknown parameters", () => {
    const junk = parseListingParams(
      params(
        "sort=cheapest&page=-3&rating=7&discount=33&price=abc&instock=yes&category=cars,toys&evil=1&sub=../x",
      ),
    );
    expect(junk).toMatchObject({ sort: "relevance", page: 1, categoryIds: ["toys"] });
    expect(junk.minRating).toBeUndefined();
    expect(junk.minDiscount).toBeUndefined();
    expect(junk.priceMin).toBeUndefined();
    expect(junk.inStockOnly).toBeFalsy();
    expect(junk.subcategoryIds).toBeUndefined();
    expect(serialiseListingParams(junk)).toBe("category=toys");
  });

  it("handles open-ended and inverted price ranges", () => {
    expect(parseListingParams(params("price=2000-500")).priceMax).toBeUndefined();
    expect(parseListingParams(params("price=-999")).priceMax).toBe(999);
    expect(parseListingParams(params("price=50000-")).priceMin).toBe(50000);
  });

  it("accepts plain-object parameters (Next.js searchParams)", () => {
    expect(parseListingParams({ size: ["S", "M"], brand: "A" }).attributes?.size).toEqual(["S"]);
  });

  it("resets the page when a filter changes", () => {
    expect(withChange(parsed, { brands: ["Urbano"] })).toMatchObject({
      page: 1,
      brands: ["Urbano"],
    });
  });

  it("Clear all keeps the search, sort and category path", () => {
    const cleared = clearRefinements({ ...parsed, q: "shirt" }, men);
    expect(serialiseListingParams(cleared, men)).toBe("q=shirt&sort=price-asc");
    expect(cleared.subcategoryIds).toEqual(["fashion-men"]);
    expect(hasRefinements(parsed, men)).toBe(true);
    expect(hasRefinements(cleared, men)).toBe(false);
  });

  it("keeps a collection's default sort out of the URL", () => {
    const collection = { collection: "new-arrivals", defaultSort: "newest" } as const;
    const empty = parseListingParams(params(""), collection);
    expect(empty.sort).toBe("newest");
    expect(serialiseListingParams(empty, collection)).toBe("");
  });
});

describe("API wire format (GET /products)", () => {
  const pages: Array<[string, Parameters<typeof parseListingParams>[1]]> = [
    ["", {}],
    [CATEGORY_URL, men],
    ["brand=Urbano&sub=fashion-men,fashion-women&sort=rating", { categoryId: "fashion" }],
    ["q=wireless+earbuds&category=mobiles,toys&ram=8 GB&page=3", {}],
    ["", { collection: "new-arrivals", defaultSort: "newest" }],
    ["sort=price-desc&discount=50", { collection: "special-offers", defaultSort: "discount" }],
    [
      "price=-999&instock=1&ageGroup=3-5 years",
      { categoryId: "toys", subcategoryId: "toys-board-games" },
    ],
    ["q=Piqué &skinHairType=Oily,Dry", { categoryId: "beauty" }],
  ];

  it.each(pages)("round-trips %p exactly", (search, context) => {
    const query = parseListingParams(params(search), context);
    const wire = toApiSearch(query);
    expect(fromApiSearch(new URLSearchParams(wire))).toEqual(query);
  });

  it("writes the scope and an explicit sort", () => {
    const query = parseListingParams(params(""), {
      collection: "new-arrivals",
      defaultSort: "newest",
    });
    expect(toApiSearch(query)).toBe("sort=newest&in_collection=new-arrivals");
    expect(toApiSearch(parseListingParams(params("size=M"), men))).toBe(
      "sub=fashion-men&size=M&in_category=fashion",
    );
  });

  it("ignores unknown scopes", () => {
    expect(fromApiSearch(params("in_category=cars&in_collection=sale"))).toEqual({
      sort: "relevance",
      page: 1,
    });
  });
});
