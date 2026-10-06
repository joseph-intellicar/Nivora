import type { InfoPageSlug } from "../config/infoPages";

export type InfoPage = {
  slug: InfoPageSlug;
  title: string;
  summary: string;
  sections: Array<{ heading: string; body: string }>;
};

/** Static copy for footer pages (requirements §8.3). Finalised in TASK-056. */
export const INFO_PAGES_CONTENT: InfoPage[] = [
  {
    slug: "about",
    title: "About Nivora",
    summary: "Nivora is an online store for fashion, home appliances, beauty, toys and mobiles.",
    sections: [
      {
        heading: "Who we are",
        body: "Nivora brings together everyday essentials and favourite brands in one easy place to shop, with clear prices and Cash on Delivery on every order.",
      },
      {
        heading: "What we sell",
        body: "Fashion for men, women and kids; refrigerators, washing machines, air conditioners and kitchen appliances; beauty and personal care; toys and games; and smartphones with their accessories.",
      },
    ],
  },
  {
    slug: "contact",
    title: "Contact",
    summary: "We're here to help with orders, deliveries and anything else.",
    sections: [
      { heading: "Email", body: "support@nivora.example — we reply within one working day." },
      { heading: "Hours", body: "Monday to Saturday, 9 am to 7 pm IST." },
    ],
  },
  {
    slug: "help",
    title: "Help",
    summary: "Answers to common questions about shopping on Nivora.",
    sections: [
      {
        heading: "How do I pay?",
        body: "Nivora accepts Cash on Delivery only. Pay the delivery partner when your order arrives.",
      },
      {
        heading: "How long does delivery take?",
        body: "Standard Delivery takes 4–6 days and is free on orders of ₹499 or more. Express Delivery takes 1–2 days for ₹99.",
      },
      {
        heading: "Can I cancel an order?",
        body: "Yes, while the order is Placed or Confirmed. Open Orders in your account and choose Cancel Order.",
      },
    ],
  },
  {
    slug: "returns",
    title: "Returns",
    summary: "Our returns policy.",
    sections: [
      {
        heading: "Returns policy",
        body: "If an item arrives damaged or incorrect, contact us within 7 days of delivery and we'll help put it right. Online returns and refunds are not available yet.",
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy",
    summary: "How Nivora handles your information.",
    sections: [
      {
        heading: "Your data",
        body: "We use your name, email, phone and delivery addresses only to manage your account and deliver your orders. We never ask for card or bank details.",
      },
    ],
  },
  {
    slug: "terms",
    title: "Terms",
    summary: "The terms that apply when you shop on Nivora.",
    sections: [
      {
        heading: "Orders",
        body: "Prices and availability are shown at the time of ordering. Orders are paid by Cash on Delivery when they arrive.",
      },
      {
        heading: "Accounts",
        body: "Keep your login details private. You are responsible for activity on your account.",
      },
    ],
  },
];
