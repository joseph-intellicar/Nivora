const { catalog } = await import("@/api/server");
const { parseListingParams } = await import("@nivora/shared/domain/listingParams");
const cases = [["/c/mobiles", "mobiles", null, "ram=8 GB&brand=Samsung,Xiaomi"], ["/c/fashion", "fashion", null, "size=XXL&color=White"], ["/c/home-appliances", "home-appliances", null, "energyRating=5 Star&price=20000-49999"], ["/c/beauty/skincare", "beauty", "beauty-skincare", "skinHairType=Oily"], ["/c/toys", "toys", null, "ageGroup=3-5 Years&rating=4&instock=1"], ["/c/fashion", "fashion", null, "discount=50"]];
const out = [];
for (const [path, cat, sub, qs] of cases) {
  const q = parseListingParams(new URLSearchParams(qs), { categoryId: cat, ...(sub ? { subcategoryId: sub } : {}) });
  out.push({ path, qs, total: (await catalog.listProducts(q)).total });
}
console.log(JSON.stringify(out));
