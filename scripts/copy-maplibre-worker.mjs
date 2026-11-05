// MapLibre worker za mapu (components/ui/map.tsx) se služi sa našeg domena (public/maplibre), ne sa unpkg-a.
// Pokreće se posle svakog npm install (postinstall), pa je verzija uvek ista kao instalirani maplibre-gl.
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "node_modules", "maplibre-gl", "dist");
const dest = join(root, "public", "maplibre");
mkdirSync(dest, { recursive: true });
for (const f of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) copyFileSync(join(src, f), join(dest, f));
console.log("maplibre worker → public/maplibre");
