import { looksLikeHtml, sanitizeHtml } from "@/lib/html";

/* Online prodavnica: pomoćne funkcije i izvedeni podaci (indeks za pretragu, grupe, filteri, istaknuti delovi).
 * Delovi stižu iz baze preko API-ja (src/lib/catalog.ts → getPartsData); ovde je samo čista obrada,
 * pa isti kod radi i na serveru i u browseru. */

export type ApiPart = {
  id: string;
  name: string;
  slug: string;
  code: string | null;
  href: string | null;
  brand: { slug: string; name: string; logo: string | null } | null;
  price: number | null;
  regularPrice: number | null;
  onSale: boolean;
  currency: string;
  stockStatus: "na_stanju" | "po_porudzbini" | "nema" | "na_upit";
  image: string | null;
  images: (string | null)[];
  description: string | null;
  /** opis iz admina kao HTML (editor); description je isti tekst bez oznaka */
  descriptionHtml?: string | null;
  /** tehnički podaci iz admina [{label, value}] */
  specs?: { label: string; value: string }[] | null;
  isFeatured: boolean;
  group: string;
  sub: string;
  subName: string;
};

export type ApiGroup = {
  slug: string;
  name: string;
  image: string | null;
  subcategories: { slug: string; name: string; image: string | null }[];
};

/* Obrađena "studio" verzija slike dela (scripts/studio-sve.sh): isti kadar, senka, fon.
 * Postoji samo za PNG isečke iz public/products; za ostalo (i slike iz admina) vraća original. */
export const studioImage = (image: string) =>
  image.startsWith("/products/") && image.endsWith(".png") ? image.replace(/^\/products\//, "/products/studio/").replace(/\.png$/, ".webp") : image;

/* Logo proizvođača po podkategoriji delova. Jinma i poljska kosa nemaju logo - stoji ime. */
export const BRAND_LOGO: Record<string, string> = {
  imt: "/brands/trim/imt.svg",
  "massey-ferguson": "/brands/trim/massey.svg",
  solis: "/brands/trim/solis.svg",
  yto: "/brands/trim/yto.svg",
  "agromehanika-kranj": "/brands/trim/kranj.svg",
  "ino-brezice": "/brands/trim/ino.svg",
  "fpm-agromehanika": "/brands/trim/fpm.svg",
  majevica: "/brands/trim/majevica.svg",
  landini: "/brands/trim/landini.svg",
  "sip-sempeter": "/brands/trim/sip.svg",
};

/* Naziv iz baze je VELIKIM SLOVIMA - za prikaz ga pretvaramo u rečenicu, a skraćenice i šifre ostaju velike. */
const KEEP = new Set(["TAFE", "IMT", "IMR", "MF", "AC", "KPL", "YTO", "SIP", "INO", "FPM", "PVC", "IPM", "LED", "TFT", "RMS", "MKM", "MKL", "MKS", "AGP", "NT", "II", "III", "IV", "DI", "R65"]);
const PROPER = new Set(["Landini", "Jinma", "Solis", "Massey", "Ferguson", "Agromehanika", "Kranj", "Šempeter", "Brežice", "Majevica", "Siena", "Delphi", "Mistral", "Comer"]);
export function prettyName(raw: string) {
  const words = raw.trim().split(/\s+/);
  return words
    .map((w, i) => {
      const bare = w.replace(/[.()]/g, "");
      // "IMT,IMR" i slično: ako su svi delovi skraćenice, ostaje kako jeste
      if (bare.split(/[,/]/).filter(Boolean).every((x) => KEEP.has(x)) || /\d/.test(w)) return w.replace(/,(?=\S)/g, ", ");
      const lower = w.toLocaleLowerCase("sr");
      const cap = lower.charAt(0).toLocaleUpperCase("sr") + lower.slice(1);
      if (PROPER.has(cap.replace(/[,.()]/g, ""))) return cap;
      return i === 0 ? cap : lower;
    })
    .join(" ");
}

export const formatRsd = (n: number) => `${n.toLocaleString("sr-RS", { maximumFractionDigits: 0 })} RSD`;

/* Pretraga bez kvačica i na ćirilici: "sempeter" nalazi "Šempeter", "шемпетер" isto. */
const CYR: Record<string, string> = { а: "a", б: "b", в: "v", г: "g", д: "d", ђ: "dj", е: "e", ж: "z", з: "z", и: "i", ј: "j", к: "k", л: "l", љ: "lj", м: "m", н: "n", њ: "nj", о: "o", п: "p", р: "r", с: "s", т: "t", ћ: "c", у: "u", ф: "f", х: "h", ц: "c", ч: "c", џ: "dz", ш: "s" };
export const normalize = (v: string) =>
  v
    .toLocaleLowerCase("sr")
    .replace(/[а-шђјљњћџ]/g, (c) => CYR[c] ?? c)
    .replace(/đ/g, "dj")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

export type PartItem = {
  id: string;
  name: string;
  code: string;
  brand: string;
  priceRsd: number;
  regularPrice: number;
  onSale: boolean;
  stockStatus: ApiPart["stockStatus"];
  image: string;
  /** sve slike dela (prva je glavna) */
  images: string[];
  href: string;
  slug: string;
  description: string;
  /** očišćen HTML opisa, prazno ako je opis običan tekst */
  descriptionHtml: string;
  /** tehnički podaci (naziv, vrednost) */
  specs: { label: string; value: string }[];
  sub: string;
  group: string;
  logo?: string;
  isFeatured: boolean;
  hay: string;
};

export type FeaturedPart = Pick<PartItem, "id" | "name" | "code" | "brand" | "logo" | "priceRsd" | "image" | "href">;

export type ShopBrand = { slug: string; name: string; count: number; logo?: string; href: string };
export type PartGroup = { slug: string; name: string; brands: ShopBrand[] };
export type FilterGroup = { slug: string; name: string; total: number; subs: { slug: string; name: string; count: number; logo?: string; href: string }[] };

export type PartsData = {
  searchIndex: PartItem[];
  partGroups: PartGroup[];
  filterTree: FilterGroup[];
  shopBrands: ShopBrand[];
  featuredParts: FeaturedPart[];
  totalParts: number;
  comingSoonGroups: { slug: string; name: string; subs: string[] }[];
};

/** Sve što prodavnica izvodi iz liste delova i stabla grupa (isti oblik kao pre prelaska na bazu). */
export function buildPartsData(parts: ApiPart[], groups: ApiGroup[]): PartsData {
  // u korpu i na listu idu delovi sa cenom u dinarima; ostali (cena na upit) se vide samo na svojoj strani
  const sellable = parts.filter((p) => p.href);
  const subName = new Map(groups.flatMap((g) => g.subcategories.map((s) => [s.slug, s.name] as const)));
  const groupOf = new Map(groups.flatMap((g) => g.subcategories.map((s) => [s.slug, g.slug] as const)));

  const searchIndex: PartItem[] = sellable.map((p) => {
    const brand = subName.get(p.sub) ?? p.subName ?? p.sub;
    return {
      id: p.id,
      name: prettyName(p.name),
      code: p.code ?? "",
      brand,
      priceRsd: p.price ?? 0,
      regularPrice: p.regularPrice ?? p.price ?? 0,
      onSale: p.onSale,
      stockStatus: p.stockStatus,
      image: p.image ?? "",
      images: (p.images ?? []).filter((x): x is string => !!x).length ? (p.images ?? []).filter((x): x is string => !!x) : p.image ? [p.image] : [],
      href: p.href!,
      slug: p.slug,
      description: p.description ?? "",
      descriptionHtml: looksLikeHtml(p.descriptionHtml) ? sanitizeHtml(p.descriptionHtml) : "",
      specs: (p.specs ?? []).filter((x) => x?.label && x?.value),
      sub: p.sub,
      group: groupOf.get(p.sub) ?? p.group,
      logo: BRAND_LOGO[p.sub] ?? p.brand?.logo ?? undefined,
      isFeatured: p.isFeatured,
      hay: normalize(`${p.name} ${p.code ?? ""} ${p.code?.replace(/[\s.\-/]/g, "") ?? ""} ${brand}`),
    };
  });

  const counts = searchIndex.reduce<Record<string, number>>((acc, p) => {
    acc[p.sub] = (acc[p.sub] ?? 0) + 1;
    return acc;
  }, {});
  const shopBrands: ShopBrand[] = Object.entries(counts)
    .map(([slug, count]) => ({ slug, name: subName.get(slug) ?? slug, count, logo: BRAND_LOGO[slug], href: `/rezervni-delovi/${groupOf.get(slug)}/${slug}` }))
    .sort((a, b) => b.count - a.count);

  const partGroups = groups
    .map((g) => ({ slug: g.slug, name: g.name, brands: shopBrands.filter((b) => groupOf.get(b.slug) === g.slug) }))
    .filter((g) => g.brands.length > 0);

  const comingSoonGroups = groups.filter((g) => !partGroups.some((x) => x.slug === g.slug)).map((g) => ({ slug: g.slug, name: g.name, subs: g.subcategories.map((x) => x.name) }));

  /* Stablo filtera istim redosledom kao grupe u adminu; kategorije bez artikala ostaju vidljive, ali neaktivne ("uskoro"). */
  const filterTree: FilterGroup[] = groups.map((g) => {
    const subs = g.subcategories.map((x) => ({ slug: x.slug, name: x.name, count: counts[x.slug] ?? 0, logo: BRAND_LOGO[x.slug], href: `/rezervni-delovi/${g.slug}/${x.slug}` }));
    return { slug: g.slug, name: g.name, total: subs.reduce((n, x) => n + x.count, 0), subs };
  });

  /* Istaknuti delovi = označeni u adminu („Istaknut"); ako nijedan nije, prvih 8 sa slikom. */
  const pick = searchIndex.filter((p) => p.isFeatured && p.priceRsd > 0);
  const featuredParts: FeaturedPart[] = (pick.length ? pick : searchIndex.filter((p) => p.image && p.priceRsd > 0).slice(0, 8)).map((p) => ({
    id: p.id,
    name: p.name,
    code: p.code,
    brand: p.brand,
    logo: p.logo,
    priceRsd: p.priceRsd,
    image: p.image,
    href: p.href,
  }));

  return { searchIndex, partGroups, filterTree, shopBrands, featuredParts, totalParts: searchIndex.length, comingSoonGroups };
}
