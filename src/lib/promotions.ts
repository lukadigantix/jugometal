import { cacheLife, cacheTag } from "next/cache";
import { API_URL } from "./api";
import { CATALOG_TAG } from "./catalog";

/* Aktivne akcije iz admina (GET /shop/promotions): naziv, natpis, popust i do kada važe - za stranu Akcije.
 * Keš kao katalog: backend briše keš posle izmene u adminu i kad akcija počne ili istekne. Bez backenda - prazno. */

export type Promotion = {
  id: string;
  name: string;
  label: string | null;
  brand: string | null;
  discountType: "procenat" | "dinari";
  discountValue: number;
  activeFrom: string;
  activeTo: string | null;
};

export async function getPromotions(): Promise<Promotion[]> {
  "use cache";
  cacheTag(CATALOG_TAG);
  try {
    const res = await fetch(`${API_URL}/shop/promotions`, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { data } = (await res.json()) as { data: Promotion[] };
    cacheLife("hours");
    return data;
  } catch (err) {
    console.warn(`[akcije] API ${API_URL} ne odgovara (${err instanceof Error ? err.message : err})`);
    cacheLife("minutes");
    return [];
  }
}
