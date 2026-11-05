import path from "path";
import type { NextConfig } from "next";
import redirects from "./src/data/redirects.json";

const nextConfig: NextConfig = {
  // Standalone build za cPanel: `<distDir>/standalone` nosi sopstveni server.js i minimalan node_modules,
  // pa se na server šalje gotov build i NE pokreće se `npm install` (vidi DEPLOY.md).
  output: "standalone",
  // Koren projekta za standalone: bez ovoga Next uzme roditeljski folder ako u njemu nađe package-lock.json,
  // pa server.js završi u podfolderu standalone/<ime>/ i cPanel ga ne nađe.
  outputFileTracingRoot: path.join(__dirname),
  // Build za cPanel ide u poseban folder (scripts/build-cpanel.sh), pa ne dira .next lokalnog dev servera.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Bez Next optimizatora slika (traži sharp i drži slike u memoriji na shared hostingu); sajt koristi <img>.
  images: { unoptimized: true },
  // sharp (i njegove binarne datoteke za macOS iz lokalnog builda) se ne koristi jer su slike bez optimizatora,
  // a na Linux serveru ionako ne bi radio - ne ide u arhivu (~28 MB)
  outputFileTracingExcludes: { "*": ["node_modules/@img/**", "node_modules/sharp/**"] },
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
