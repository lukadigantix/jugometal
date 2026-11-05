"use client";

import { createContext, useContext } from "react";

/* Slike traktora i mašina iz admina (GET /shop/catalog, isti keš kao katalog), po adresi strane.
 * Kad admin promeni sliku, backend osveži keš i nova slika se odmah vidi na kartici, strani proizvoda,
 * u meniju i na početnoj. Bez slike u adminu (ili kad backend ne radi) ostaje slika iz src/data. */

const MediaContext = createContext<Record<string, string[]>>({});

export function MediaProvider({ media, children }: { media: Record<string, string[]>; children: React.ReactNode }) {
  return <MediaContext.Provider value={media}>{children}</MediaContext.Provider>;
}

/** sve slike proizvoda (iz admina ako postoje, inače `fallback`) */
export function useProductImages(href: string, fallback: string[]): string[] {
  const m = useContext(MediaContext)[href];
  return m?.length ? m : fallback;
}

/** glavna slika proizvoda */
export function useProductImage(href: string, fallback: string): string {
  return useProductImages(href, [fallback])[0];
}

/** pristup celoj mapi (npr. liste u meniju) */
export function useMediaMap(): Record<string, string[]> {
  return useContext(MediaContext);
}
