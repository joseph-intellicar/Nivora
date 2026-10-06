import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { siteConfig } from "@/config/site";
import { Providers } from "@/providers/Providers";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    template: `%s | ${siteConfig.name}`,
    default: siteConfig.defaultTitle,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  // Phase 1 safety switch (arch §10.3): no indexing until real data goes live.
  ...(siteConfig.allowIndexing ? {} : { robots: { index: false, follow: false } }),
  openGraph: {
    siteName: siteConfig.name,
    locale: "en_IN",
    type: "website",
    images: [{ url: "/og/nivora-default.png", width: 1200, height: 630, alt: "Nivora" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og/nivora-default.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={jakarta.variable}>
      {/*
        Browser extensions (e.g. ColorZilla's cz-shortcut-listen) add attributes to <body> before
        React hydrates. suppressHydrationWarning ignores attribute differences on this element only;
        its children are still checked.
      */}
      <body className="font-sans" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
