import { cacheLife, cacheTag } from "next/cache";
import { API_URL } from "./api";
import { CATALOG_TAG } from "./catalog";

/* Marketing oznake iz admina (Podešavanja → Marketing), GET /shop/marketing. Prazno = ta oznaka nije uključena.
 * Keš pod oznakom kataloga, pa izmena u adminu odmah važi. */

export type MarketingConfig = {
  metaPixelId: string;
  metaDomainVerification: string;
  ga4Id: string;
  googleAdsId: string;
  googleAdsPurchaseLabel: string;
  gtmId: string;
};

const EMPTY: MarketingConfig = { metaPixelId: "", metaDomainVerification: "", ga4Id: "", googleAdsId: "", googleAdsPurchaseLabel: "", gtmId: "" };

export async function getMarketing(): Promise<MarketingConfig> {
  "use cache";
  cacheTag(CATALOG_TAG);
  try {
    const res = await fetch(`${API_URL}/shop/marketing`, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { data } = (await res.json()) as { data: Partial<MarketingConfig> };
    cacheLife("hours");
    return { ...EMPTY, ...data };
  } catch {
    cacheLife("minutes");
    return EMPTY;
  }
}

/** Da li je uključena bar jedna oznaka koja meri posetioce (tada sajt traži pristanak na kolačiće) */
export const hasTracking = (c: MarketingConfig) => !!(c.ga4Id || c.googleAdsId || c.gtmId || c.metaPixelId);
