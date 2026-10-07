const { catalog } = await import("@/api/server");
const out = {};
for (const id of ["best-sellers", "special-offers", "new-arrivals"]) { const all = await catalog.getCollection(id); out[id] = { total: all.length, first: all.slice(0, 3).map(p => p.slug) }; }
for (const q of ["samsung", "refrigerators", "wireless headphones"]) out["q:" + q] = (await catalog.listProducts({ q, sort: "relevance", page: 1 })).total;
console.log(JSON.stringify(out));
