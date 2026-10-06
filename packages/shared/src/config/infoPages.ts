/** Customer information pages (req §29): slugs and link titles. Content: `data/infoPages`. */

export const INFO_PAGES = [
  { slug: "about", title: "About Nivora" },
  { slug: "contact", title: "Contact" },
  { slug: "help", title: "Help" },
  { slug: "returns", title: "Returns" },
  { slug: "privacy", title: "Privacy" },
  { slug: "terms", title: "Terms" },
] as const;

export type InfoPageSlug = (typeof INFO_PAGES)[number]["slug"];
