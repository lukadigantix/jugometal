import type { MetadataRoute } from "next";
import catalog from "@/data/catalog.json";
import { partGroups, searchIndex } from "@/data/featured-parts";
import machines from "@/data/machine-list.json";
import tractors from "@/data/tractor-list.json";
import { atvModels } from "@/data/atv";
import { abs } from "@/lib/site";

/* Sve javne strane (bez korpe). Delovi su sada u sitemap-u - na starom sajtu nisu bili. */
export default function sitemap(): MetadataRoute.Sitemap {
  const page = (path: string, priority: number, changeFrequency: "daily" | "weekly" | "monthly" = "weekly") => ({ url: abs(path), changeFrequency, priority });
  return [
    page("/", 1, "daily"),
    page("/rezervni-delovi", 0.9, "daily"),
    page("/traktori", 0.9),
    page("/prikljucne-masine", 0.9),
    page("/atv", 0.8),
    page("/akcije", 0.7, "daily"),
    page("/servis", 0.6, "monthly"),
    page("/subvencije", 0.6, "monthly"),
    page("/o-nama", 0.5, "monthly"),
    page("/kontakt", 0.6, "monthly"),
    page("/politika-privatnosti", 0.2, "monthly"),
    page("/uslovi-koriscenja", 0.2, "monthly"),
    ...partGroups.flatMap((g) => [page(`/rezervni-delovi/${g.slug}`, 0.7), ...g.brands.map((b) => page(b.href, 0.7))]),
    ...searchIndex.map((p) => page(p.href, 0.6)),
    ...catalog.tractorBrands.map((b) => page(`/traktori/${b.slug}`, 0.7)),
    ...tractors.map((t) => page(t.href, 0.7)),
    ...[...new Set(machines.map((m) => m.category))].map((c) => page(`/prikljucne-masine/${c}`, 0.6)),
    ...machines.map((m) => page(m.href, 0.6)),
    ...atvModels.map((m) => page(m.href, 0.7)),
  ];
}
