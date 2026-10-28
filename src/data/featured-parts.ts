import catalog from "./catalog.json";
import parts from "./parts.json";

/* Istaknuti proizvodi iz online prodavnice (ručni izbor po id-u iz parts.json;
 * kad klijent da podatke o prodaji, ovde se menja spisak). */
const IDS = [
  "imt-180", // IMT hladnjak 539/549
  "massey-ferguson-333", // MF pumpa hidraulike
  "imt-167", // IMT/IMR alternator
  "jinma-214", // Jinma anlaser
  "solis-360", // Solis filter ulja motora
  "landini-269", // Landini felna sa gumom
  "sip-sempeter-135", // SIP klizač 170D
  "agromehanika-kranj-015", // Agromehanika tropotilni ventil
];

const subName = new Map(catalog.partsGroups.flatMap((g) => g.subcategories.map((s) => [s.slug, s.name] as const)));

/* Obrađena "studio" verzija slike dela (scripts/studio-sve.sh): isti kadar, senka, fon.
 * Postoji samo za PNG isečke; za ostalo vraća original. */
export const studioImage = (image: string) =>
  image.startsWith("/products/") && image.endsWith(".png") ? image.replace(/^\/products\//, "/products/studio/").replace(/\.png$/, ".webp") : image;

/* Logo proizvođača po podkategoriji delova. Jinma i poljska kosa nemaju logo - stoji ime. */
export const BRAND_LOGO: Record<string, string> = {
  imt: "/brands/trim/imt.png",
  "massey-ferguson": "/brands/trim/massey.png",
  solis: "/brands/trim/solis.png",
  yto: "/brands/trim/yto.png",
  "agromehanika-kranj": "/brands/trim/kranj.png",
  "ino-brezice": "/brands/trim/ino.png",
  "fpm-agromehanika": "/brands/trim/fpm.png",
  majevica: "/brands/trim/majevica.png",
  landini: "/brands/trim/landini.png",
  "sip-sempeter": "/brands/trim/sip.png",
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

export type FeaturedPart = {
  id: string;
  name: string;
  code: string;
  brand: string;
  logo?: string;
  priceRsd: number;
  image: string;
  href: string;
};

export const featuredParts: FeaturedPart[] = IDS.map((id) => {
  const p = parts.find((x) => x.id === id)!;
  return {
    id,
    name: prettyName(p.name),
    code: p.code,
    brand: subName.get(p.subcategory) ?? p.subcategory,
    logo: BRAND_LOGO[p.subcategory],
    priceRsd: p.priceRsd ?? 0,
    image: p.image,
    href: p.href,
  };
});

export const formatRsd = (n: number) => `${n.toLocaleString("sr-RS", { maximumFractionDigits: 0 })} RSD`;

/* Brendovi u prodavnici (broj artikala iz parts.json), za red "Kupujte po brendu". */
const groupOf = new Map(catalog.partsGroups.flatMap((g) => g.subcategories.map((s) => [s.slug, g.slug] as const)));
export const shopBrands = Object.entries(
  parts.reduce<Record<string, number>>((acc, p) => {
    acc[p.subcategory] = (acc[p.subcategory] ?? 0) + 1;
    return acc;
  }, {}),
)
  .map(([slug, count]) => ({
    slug,
    name: subName.get(slug) ?? slug,
    count,
    logo: BRAND_LOGO[slug],
    href: `/rezervni-delovi/${groupOf.get(slug)}/${slug}`,
  }))
  .sort((a, b) => b.count - a.count);

export const totalParts = parts.length;

/* Indeks za pretragu (naziv + šifra + brend). */
export const searchIndex = parts.map((p) => ({
  id: p.id,
  name: prettyName(p.name),
  code: p.code,
  brand: subName.get(p.subcategory) ?? p.subcategory,
  priceRsd: p.priceRsd ?? 0,
  image: p.image,
  href: p.href,
  slug: p.slug,
  description: p.description,
  sub: p.subcategory,
  group: groupOf.get(p.subcategory) ?? "",
  logo: BRAND_LOGO[p.subcategory] as string | undefined,
  hay: `${p.name} ${p.code} ${subName.get(p.subcategory) ?? ""}`.toLocaleLowerCase("sr"),
}));

/* Grupe delova sa brendovima koji imaju artikle (za filtere i rute). */
export const partGroups = catalog.partsGroups
  .map((g) => ({
    slug: g.slug,
    name: g.name,
    brands: shopBrands.filter((b) => groupOf.get(b.slug) === g.slug),
  }))
  .filter((g) => g.brands.length > 0);

/* Grupe sa starog sajta koje još nemaju artikle ("Ostalo": kardani, ulja i maziva...) - u filterima kao "uskoro". */
export const comingSoonGroups = catalog.partsGroups
  .filter((g) => !partGroups.some((x) => x.slug === g.slug))
  .map((g) => ({ slug: g.slug, name: g.name, subs: g.subcategories.map((x) => x.name) }));

/* Stablo filtera tačno kao na starom sajtu (isti redosled grupa i kategorija iz catalog.json);
 * kategorije bez artikala ostaju vidljive, ali neaktivne ("uskoro"). */
const countOf = new Map(shopBrands.map((b) => [b.slug, b.count]));
export const filterTree = catalog.partsGroups.map((g) => {
  const subs = g.subcategories.map((x) => ({
    slug: x.slug,
    name: x.name,
    count: countOf.get(x.slug) ?? 0,
    logo: BRAND_LOGO[x.slug] as string | undefined,
    href: `/rezervni-delovi/${g.slug}/${x.slug}`,
  }));
  return { slug: g.slug, name: g.name, total: subs.reduce((n, x) => n + x.count, 0), subs };
});
