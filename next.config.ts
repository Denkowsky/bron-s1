import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pełny eksport do katalogu `out/` pod Cloudflare Pages (bez serwera Node).
  output: "export",
  images: { unoptimized: true },
  // cacheComponents (PPR) i partialPrefetching wymagają serwera Next.js
  // i są niekompatybilne z output: "export".
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
