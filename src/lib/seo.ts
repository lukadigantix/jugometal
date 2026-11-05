import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { API_URL } from "./api";
import { CATALOG_TAG } from "./catalog";

/* Ručni SEO naslov i opis iz admina (Podešavanja → SEO), po adresi strane: GET /shop/seo → { "/traktori/solis": { title, description } }.
 * Keš pod oznakom kataloga, pa izmena u adminu odmah važi. Bez upisanog teksta (ili bez backenda) ostaje automatski naslov strane. */

/** slika za deljenje (Facebook, WhatsApp, Viber, LinkedIn, X), 1200 × 630.
 *  JPG je prvi jer ga prikazuju sve mreže i aplikacije za poruke; WebP je dodatni za one koje ga podržavaju. */
export const OG_IMAGES = [
  { url: "/opengraph.jpg", width: 1200, height: 630, type: "image/jpeg", alt: "Jugometal - Snaga za svaku njivu" },
  { url: "/opengraph.webp", width: 1200, height: 630, type: "image/webp", alt: "Jugometal - Snaga za svaku njivu" },
];

type SeoMap = Record<string, { title: string | null; description: string | null }>;

async function getSeoMap(): Promise<SeoMap> {
  "use cache";
  cacheTag(CATALOG_TAG);
  try {
    const res = await fetch(`${API_URL}/shop/seo`, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { data } = (await res.json()) as { data: SeoMap };
    cacheLife("hours");
    return data ?? {};
  } catch {
    cacheLife("minutes");
    return {};
  }
}

/** Automatski metapodaci strane + ručni SEO iz admina, ako je upisan za tu adresu */
export async function withSeo(path: string, meta: Metadata): Promise<Metadata> {
  const o = (await getSeoMap())[path];
  if (!o || (!o.title && !o.description)) return meta;
  const title = o.title ?? meta.title;
  const description = o.description ?? meta.description;
  return {
    ...meta,
    title,
    description,
    // strana koja menja openGraph gubi sliku iz layout-a, pa se ovde vraća podrazumevana
    openGraph: { images: OG_IMAGES, ...(meta.openGraph ?? {}), ...(o.title ? { title: o.title } : {}), ...(o.description ? { description: o.description } : {}) },
  };
}
