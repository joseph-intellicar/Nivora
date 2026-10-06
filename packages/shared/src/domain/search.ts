import type { Product } from "./types";

/** Lower-case, accent-free words. */
function words(text: string): string[] {
  return text
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

/** Very small stemmer so "shoes" matches "shoe" and "phones" matches "phone". */
function stem(word: string): string {
  if (word.length > 4 && word.endsWith("es")) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

export function tokenize(query: string): string[] {
  return Array.from(new Set(words(query)));
}

type Field = { weight: number; words: string[]; text: string };

export type SearchNames = { categoryName: string; subcategoryName: string };

const WEIGHTS = {
  name: 10,
  brand: 8,
  subcategory: 6,
  category: 5,
  tags: 4,
  specs: 3,
  description: 1,
};

function fieldsOf(product: Product, names: SearchNames): Field[] {
  const make = (weight: number, text: string): Field => ({
    weight,
    words: words(text),
    text: words(text).join(" "),
  });
  return [
    make(WEIGHTS.name, product.name),
    make(WEIGHTS.brand, product.brand),
    make(WEIGHTS.subcategory, names.subcategoryName),
    make(WEIGHTS.category, names.categoryName),
    make(WEIGHTS.tags, product.tags.join(" ")),
    make(
      WEIGHTS.specs,
      [
        ...product.specifications.map((spec) => spec.value),
        ...product.options.flatMap((option) => option.values),
        ...Object.values(product.attributes).flat(),
      ].join(" "),
    ),
    make(WEIGHTS.description, product.description),
  ];
}

function tokenMatches(token: string, field: Field): boolean {
  const tokenStem = stem(token);
  return (
    field.words.some(
      (word) => word.startsWith(token) || stem(word) === tokenStem || word.startsWith(tokenStem),
    ) ||
    (token.length >= 4 && field.text.includes(token))
  );
}

/**
 * Relevance score for a search (arch §13.4), or null when the product does not match.
 * A product matches only if every query word matches some field; each word scores the
 * weight of the best field it matches (name > brand > subcategory > category > tags > specs > description).
 */
export function scoreProduct(
  product: Product,
  tokens: string[],
  names: SearchNames,
): number | null {
  if (tokens.length === 0) return 0;
  const fields = fieldsOf(product, names);
  let score = 0;
  for (const token of tokens) {
    const best = Math.max(
      0,
      ...fields.filter((field) => tokenMatches(token, field)).map((field) => field.weight),
    );
    if (best === 0) return null;
    score += best;
  }
  const phrase = tokens.join(" ");
  if (tokens.length > 1 && fields[0].text.includes(phrase)) score += 5;
  return score;
}
