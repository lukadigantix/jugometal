import { cacheLife, cacheTag } from "next/cache";
import catalogJson from "@/data/catalog.json";
import partsJson from "@/data/parts.json";
import { buildPartsData, type ApiGroup, type ApiPart, type PartsData } from "@/data/featured-parts";
import { API_URL } from "./api";

/* Katalog iz baze (GET /shop/catalog), keširan pod oznakom "katalog".
 * Backend posle svake izmene u adminu zove /api/osvezi, koji briše keš (revalidateTag) - nova cena se vidi odmah.
 * Ako backend ne odgovara (npr. build bez interneta), koristi se poslednji izvoz iz src/data, kratko keširan. */

export const CATALOG_TAG = "katalog";

/** Brend traktora ili kategorija mašina za navigaciju (footer): naziv, slug i broj artikala na sajtu */
export type NavItem = { slug: string; name: string; count: number; /** brendovi traktora: logo, baner i opis iz admina */ logo?: string | null; banner?: string | null; description?: string | null };

/** Artikal na akciji (strana Akcije), bilo koje vrste; cene u RSD, popust zaokružen na ceo procenat */
export type SaleItem = {
  id: string;
  name: string;
  href: string;
  image: string | null;
  code: string | null;
  brand: string | null;
  kind: "deo" | "traktor" | "masina" | "atv";
  /** vrsta ili kategorija za karticu („Mulčari", „Traktor", „Benda ATV") */
  kindLabel: string;
  price: number;
  regularPrice: number;
  /** popust u procentima; 0 kad je ponuda samo oznaka (npr. poklon uz kupovinu) */
  percent: number;
  promotion: { id: string; name: string; label: string | null } | null;
  /** „Oznaka na kartici" i „Napomena uz cenu" iz admina (ATV: „Akcija", „Poklon") */
  badge: string | null;
  priceNote: string | null;
  currency: "RSD" | "EUR";
  /** do 3 glavne specifikacije iz admina; delovi ih nemaju */
  specs: { label: string; value: string }[];
};

type Catalog = {
  parts: ApiPart[];
  partGroups: ApiGroup[];
  tractorBrands: NavItem[];
  machineCategories: NavItem[];
  saleItems: SaleItem[];
  /** slike traktora i mašina iz admina po adresi strane (href → slike, prva je glavna) */
  media: Record<string, string[]>;
  source: "api" | "fallback";
};

/** polja proizvoda koja su ista za sve vrste u GET /shop/catalog */
type ApiSaleProduct = {
  id: string;
  name: string;
  href: string | null;
  code: string | null;
  brand: { name: string } | null;
  price: number | null;
  regularPrice: number | null;
  onSale: boolean;
  image: string | null;
  currency?: string;
  promotion?: { id: string; name: string; label: string | null } | null;
  saleBadge?: string | null;
  priceNote?: string | null;
  specs?: { label: string; value: string }[] | null;
};

type ApiCatalog = {
  parts: ApiPart[];
  partGroups: ApiGroup[];
  tractors?: (ApiSaleProduct & { brand: { slug: string; name: string; logo?: string | null; banner?: string | null; description?: string | null } | null })[];
  machines?: (ApiSaleProduct & { category: string; categoryName: string })[];
  machineCategories?: Array<{ slug: string; name: string }>;
  atv?: ApiSaleProduct[];
};

// sve što backend označi kao akciju: snižena cena (akcijska cena ili akcija iz admina) ili oznaka na kartici; najveći popust prvi
function saleFromApi(d: ApiCatalog): SaleItem[] {
  const out: SaleItem[] = [];
  const add = (p: ApiSaleProduct, kind: SaleItem["kind"], kindLabel: string) => {
    if (!p.onSale || !p.href || p.price == null) return;
    const regular = p.regularPrice != null && p.regularPrice > p.price ? p.regularPrice : p.price;
    const percent = regular > p.price ? Math.round((1 - p.price / regular) * 100) : 0;
    const badge = p.saleBadge?.trim() || null;
    if (percent === 0 && !badge) return;
    out.push({
      id: p.id,
      name: p.name,
      href: p.href,
      image: p.image,
      code: p.code,
      brand: p.brand?.name ?? null,
      kind,
      kindLabel,
      price: p.price,
      regularPrice: regular,
      percent,
      promotion: p.promotion ?? null,
      badge,
      priceNote: p.priceNote?.trim() || null,
      currency: p.currency === "EUR" ? "EUR" : "RSD",
      specs: (p.specs ?? []).filter((x) => x && x.label && x.value).slice(0, 3),
    });
  };
  for (const p of d.tractors ?? []) add(p, "traktor", "Traktor");
  for (const p of d.machines ?? []) add(p, "masina", p.categoryName || "Priključna mašina");
  for (const p of d.atv ?? []) add(p, "atv", "ATV · Benda");
  for (const p of d.parts) add(p, "deo", p.subName || "Rezervni deo");
  return out.sort((a, b) => b.percent - a.percent);
}

// brendovi redom kako ih admin ređa, kategorije samo one koje imaju artikle
function navFromApi(d: ApiCatalog): Pick<Catalog, "tractorBrands" | "machineCategories"> {
  const brands = new Map<string, NavItem>();
  for (const t of d.tractors ?? []) {
    if (!t.brand) continue;
    const b = brands.get(t.brand.slug) ?? { slug: t.brand.slug, name: t.brand.name, count: 0, logo: t.brand.logo ?? null, banner: t.brand.banner ?? null, description: t.brand.description ?? null };
    b.count += 1;
    brands.set(b.slug, b);
  }
  const perCat = new Map<string, number>();
  for (const m of d.machines ?? []) perCat.set(m.category, (perCat.get(m.category) ?? 0) + 1);
  return {
    tractorBrands: [...brands.values()],
    machineCategories: (d.machineCategories ?? []).map((c) => ({ slug: c.slug, name: c.name, count: perCat.get(c.slug) ?? 0 })).filter((c) => c.count > 0),
  };
}

// slike iz admina: traktori i mašine, po adresi strane; bez slike u adminu ostaje slika iz src/data
function mediaFromApi(d: ApiCatalog): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const p of [...(d.tractors ?? []), ...(d.machines ?? [])] as (ApiSaleProduct & { images?: (string | null)[] })[]) {
    const imgs = (p.images ?? []).filter((x): x is string => !!x);
    if (p.href && imgs.length) out[p.href] = imgs;
  }
  return out;
}

function fallback(): Catalog {
  const groups: ApiGroup[] = catalogJson.partsGroups.map((g) => ({
    slug: g.slug,
    name: g.name,
    image: null,
    subcategories: g.subcategories.map((s) => ({ slug: s.slug, name: s.name, image: s.image ?? null })),
  }));
  const subName = new Map(groups.flatMap((g) => g.subcategories.map((s) => [s.slug, s.name] as const)));
  const parts: ApiPart[] = partsJson.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    code: p.code,
    href: p.href,
    brand: null,
    price: p.priceRsd ?? null,
    regularPrice: p.priceRsd ?? null,
    onSale: false,
    currency: "RSD",
    stockStatus: "na_stanju",
    image: p.image,
    images: [p.image],
    description: p.description,
    isFeatured: false,
    group: p.group,
    sub: p.subcategory,
    subName: subName.get(p.subcategory) ?? p.subcategory,
  }));
  return {
    parts,
    partGroups: groups,
    tractorBrands: catalogJson.tractorBrands.map((b) => ({ slug: b.slug, name: b.name, count: b.models.length })),
    machineCategories: catalogJson.implementCategories.map((c) => ({ slug: c.slug, name: c.name, count: c.products.length })).filter((c) => c.count > 0),
    saleItems: [],
    media: {},
    source: "fallback",
  };
}

export async function getShopCatalog(): Promise<Catalog> {
  "use cache";
  cacheTag(CATALOG_TAG);
  try {
    const res = await fetch(`${API_URL}/shop/catalog`, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { data } = (await res.json()) as { data: ApiCatalog };
    cacheLife("hours");
    return { parts: data.parts, partGroups: data.partGroups, ...navFromApi(data), saleItems: saleFromApi(data), media: mediaFromApi(data), source: "api" };
  } catch (err) {
    console.warn(`[katalog] API ${API_URL} ne odgovara (${err instanceof Error ? err.message : err}) - koristim src/data/parts.json`);
    cacheLife("minutes");
    return fallback();
  }
}

export async function getPartsData(): Promise<PartsData> {
  const c = await getShopCatalog();
  return buildPartsData(c.parts, c.partGroups);
}
