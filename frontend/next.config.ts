import type { NextConfig } from "next";

// Phase 2 API (barch §17). Read at build time: the rewrite is baked into the build output.
const backendUrl = process.env.BACKEND_URL?.replace(/\/$/, "");

const nextConfig: NextConfig = {
  // Business rules, contracts and catalog data live in the `@nivora/shared` workspace package
  // (barch §3). tsconfig `paths` points the frontend at its TypeScript source, so Next compiles
  // it like app code (fast refresh, tree shaking); Node and the backend use its built `dist/`.
  transpilePackages: ["@nivora/shared"],
  poweredByHeader: false,
  // Baseline security headers for every page (barch §13). No CSP yet: Next's inline runtime
  // scripts need nonces, which is a separate piece of work (listed in barch §21).
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
        ],
      },
    ];
  },
  // Same-origin API: the browser calls /api/*, Next forwards it to the backend, so the session
  // and guest-cart cookies stay first-party and no CORS is needed (barch §13).
  async rewrites() {
    return backendUrl
      ? [{ source: "/api/:path*", destination: `${backendUrl}/api/v1/:path*` }]
      : [];
  },
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
