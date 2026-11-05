"use client";

import { createContext, useContext } from "react";
import catalog from "@/data/catalog.json";
import type { NavItem } from "./catalog";

/* Brendovi traktora iz admina (logo, baner, opis) za klijentske komponente: filter i hero na /traktori,
 * strana modela, meni. Layout ih učita iz GET /shop/catalog (isti keš kao katalog) i prosledi ovde.
 * Kad backend ne odgovara ili brend nema logo/baner u adminu, koriste se fajlovi iz public/ (catalog.json). */

export type TractorBrand = { slug: string; name: string; logo: string; banner: string | null; description: string | null };

const STATIC: Record<string, TractorBrand> = Object.fromEntries(
  catalog.tractorBrands.map((b) => [
    b.slug,
    { slug: b.slug, name: b.name, logo: `/brands/trim/${b.slug === "john-deere" ? "deere" : b.slug}.svg`, banner: b.banner || null, description: b.description || null },
  ]),
);

const BrandsContext = createContext<NavItem[] | null>(null);

export function BrandsProvider({ brands, children }: { brands: NavItem[]; children: React.ReactNode }) {
  return <BrandsContext.Provider value={brands}>{children}</BrandsContext.Provider>;
}

/** svi brendovi traktora (redosled iz admina); polja koja admin nema popunjena dolaze iz public/ */
export function useTractorBrands(): TractorBrand[] {
  const api = useContext(BrandsContext);
  const list = api?.length ? api : catalog.tractorBrands.map((b) => ({ slug: b.slug, name: b.name, count: 0 }) as NavItem);
  return list.map((b) => {
    const s = STATIC[b.slug];
    return { slug: b.slug, name: b.name, logo: b.logo || s?.logo || "", banner: b.banner || s?.banner || null, description: b.description || s?.description || null };
  });
}

export function useTractorBrand(slug: string): TractorBrand | undefined {
  return useTractorBrands().find((b) => b.slug === slug);
}
