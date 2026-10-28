import type { NextConfig } from "next";
import redirects from "./src/data/redirects.json";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // 301 sa starih adresa jugometal.co.rs (src/data/redirects.json, docs/SEO-MIGRACIJA.md)
  async redirects() {
    return redirects;
  },
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
