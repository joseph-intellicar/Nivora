import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Business rules, contracts and catalog data live in the `@nivora/shared` workspace package
  // (barch §3). tsconfig `paths` points the frontend at its TypeScript source, so Next compiles
  // it like app code (fast refresh, tree shaking); Node and the backend use its built `dist/`.
  transpilePackages: ["@nivora/shared"],
  // Resolve metadata before sending HTML for every client (not only HTML-limited bots), so
  // titles, canonical URLs and 404 pages are always in the initial HTML (arch §10). Catalog reads
  // are in-memory, so blocking costs only milliseconds.
  htmlLimitedBots: /.*/,
  images: {
    // Product photos: free Unsplash images (decision D2). Only this host, path prefix and the
    // exact query string used by the mock catalog are allowed through the image optimizer.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/photo-**",
        search: "?w=1200&q=80&auto=format&fit=crop",
      },
    ],
  },
};

export default nextConfig;
