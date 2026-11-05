import { cacheLife, cacheTag } from "next/cache";
import company from "@/data/company.json";
import { t } from "@/components/copy";
import { API_URL } from "./api";
import { CATALOG_TAG } from "./catalog";

/* Podnožje i kontakt iz admina (Podešavanja → Sajt), GET /shop/site.
 * Keš pod istom oznakom kao katalog: izmena u adminu briše keš (/api/osvezi), pa se vidi odmah.
 * Ako backend ne odgovara, važe podaci iz src/data/company.json. Radno vreme je prazno dok ga admin ne sačuva. */

export type SiteInfo = {
  description: string;
  social: { facebook: string; instagram: string; twitter: string; tiktok: string };
  contact: { name: string; street: string; city: string; phone: string; phoneParts: string; email: string; pib: string; mb: string };
  workingHours: Array<{ days: string; hours: string; isOpen: boolean; note: string | null }>;
};

function fallback(): SiteInfo {
  const hq = company.locations[0];
  return {
    description: t.footer.tagline,
    social: { facebook: company.social.facebook, instagram: company.social.instagram, twitter: "", tiktok: "" },
    contact: { name: company.legalName, street: hq.street, city: `${hq.postalCode} ${hq.city}`, phone: hq.phone, phoneParts: hq.phoneParts ?? "", email: company.email, pib: "", mb: "" },
    workingHours: [],
  };
}

export async function getSiteInfo(): Promise<SiteInfo> {
  "use cache";
  cacheTag(CATALOG_TAG);
  try {
    const res = await fetch(`${API_URL}/shop/site`, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { data } = (await res.json()) as { data: SiteInfo };
    cacheLife("hours");
    // stariji backend bez telefona za delove
    return { ...data, contact: { ...fallback().contact, ...data.contact, phoneParts: data.contact.phoneParts || "" } };
  } catch (err) {
    console.warn(`[sajt] API ${API_URL} ne odgovara (${err instanceof Error ? err.message : err}) - koristim src/data/company.json`);
    cacheLife("minutes");
    return fallback();
  }
}
