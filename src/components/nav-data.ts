import catalog from "@/data/catalog.json";
import tractorList from "@/data/tractor-list.json";
import { BRAND_LOGO } from "@/data/featured-parts";

/* Struktura menija - tekst dolazi iz copy.ts, podaci iz src/data. */

const partsBrands = new Set(
  catalog.partsGroups
    .find((g) => g.slug === "traktorski-delovi")!
    .subcategories.filter((s) => s.count > 0)
    .map((s) => s.slug),
);

/* ===== podaci za novi mega-meni (levo spisak, u sredini sadržaj, desno istaknuto) ===== */

const plural = (n: number, one: string, few: string, many: string) => {
  const last = n % 10;
  const teen = n % 100 >= 11 && n % 100 <= 14;
  return `${n} ${last === 1 && !teen ? one : last >= 2 && last <= 4 && !teen ? few : many}`;
};

export type MenuTile = { name: string; href: string; img?: string; logo?: string; meta?: string; soon?: boolean };
export type MenuEntry = { key: string; label: string; logo?: string; meta: string; href: string; tiles: MenuTile[]; extra?: { label: string; href: string } };
export type MenuPromo = { eyebrow: string; title: string; text: string; img: string; href: string; cta: string };

const TRACTOR_LOGO: Record<string, string> = {
  solis: "/brands/trim/solis.png",
  imt: "/brands/trim/imt.png",
  "john-deere": "/brands/trim/deere.png",
  yto: "/brands/trim/yto.png",
  mahindra: "/brands/trim/mahindra.png",
};

export const TRACTOR_MENU: MenuEntry[] = catalog.tractorBrands.map((b) => {
  const models = tractorList.filter((t) => t.brand === b.slug);
  return {
    key: b.slug,
    label: b.name,
    logo: TRACTOR_LOGO[b.slug],
    meta: plural(models.length, "model", "modela", "modela"),
    href: `/traktori/${b.slug}`,
    tiles: models.map((m) => ({ name: m.name, href: m.href, img: m.image, meta: [m.ks && `${m.ks} KS`, m.drive].filter(Boolean).join(" · ") })),
    extra: partsBrands.has(b.slug) ? { label: `Rezervni delovi za ${b.name}`, href: `/rezervni-delovi/traktorski-delovi/${b.slug}` } : undefined,
  };
});

const catBySlug = new Map(catalog.implementCategories.map((c) => [c.slug, c]));

export const MACHINE_MENU: MenuEntry[] = catalog.implementUsageGroups.map((g) => {
  const cats = g.categories.map((s) => catBySlug.get(s)).filter((c) => c !== undefined);
  const total = cats.reduce((n, c) => n + c.products.length, 0);
  return {
    key: g.slug,
    label: g.title.replace(/^Mašine za /, "").replace(/^./, (c) => c.toLocaleUpperCase("sr")),
    meta: plural(total, "mašina", "mašine", "mašina"),
    href: "/prikljucne-masine",
    tiles: cats.map((c) => ({ name: c.name, href: `/prikljucne-masine/${c.slug}`, img: c.image, meta: plural(c.products.length, "model", "modela", "modela") })),
  };
});

export const PARTS_MENU: MenuEntry[] = catalog.partsGroups.map((g) => {
  const total = g.subcategories.reduce((n, s) => n + s.count, 0);
  return {
    key: g.slug,
    label: g.name,
    meta: total ? plural(total, "artikal", "artikla", "artikala") : "uskoro",
    href: `/rezervni-delovi/${g.slug}`,
    tiles: g.subcategories.map((s) => ({
      name: s.name,
      href: `/rezervni-delovi/${g.slug}/${s.slug}`,
      logo: BRAND_LOGO[s.slug],
      meta: s.count ? plural(s.count, "artikal", "artikla", "artikala") : "uskoro",
      soon: s.count === 0,
    })),
  };
});

export const MENU_PROMO: Record<string, MenuPromo> = {
  traktori: { eyebrow: "Subvencije", title: "Novi traktor uz podršku države", text: "Pomažemo oko dokumentacije za subvencije i finansiranje.", img: "/banners/subv.jpg", href: "/subvencije", cta: "Kako do subvencije" },
  masine: { eyebrow: "Benda ATV", title: "Redstone 550 R2 i 1000 R2", text: "Kvadovi za teren, posao i lov. Garancija 3 godine.", img: "/atv/benda-teren-2.jpg", href: "/atv", cta: "Pogledaj modele" },
  delovi: { eyebrow: "Odeljenje delova", title: "Ne znate šifru dela?", text: "Pozovite nas, pronaći ćemo pravi deo za vašu mašinu.", img: "/banners/delovi.jpg", href: "tel:035311137", cta: "035/311-137" },
};
