"use client";

import { Landmark, Package, Wrench } from "lucide-react";
import ProductDetail, { type Perk } from "./ProductDetail";
import TractorCard from "./TractorCard";
import list from "@/data/tractor-list.json";
import tractors from "@/data/tractors.json";
import { imt } from "@/data/imt-spotlight";
import type { PartGroup } from "@/data/featured-parts";
import { useTractorBrand } from "@/lib/brands-context";
import { useProductImages } from "@/lib/media-context";

/* Strana modela traktora: slika, ključni brojevi, upit za ponudu (e-mail sa modelom), kompletna
 * specifikacija sa starog sajta (za IMT 565.2 DI fabrička TAFE), opis, subvencije, delovi, slični modeli.
 * Cena se ne prikazuje (nema je) - "cena na upit". */

/** 1 deo, 3 dela, 12 delova */
const delova = (n: number) => {
  const l = n % 10, teen = n % 100 >= 11 && n % 100 <= 14;
  return `${n} ${l === 1 && !teen ? "deo" : l >= 2 && l <= 4 && !teen ? "dela" : "delova"}`;
};

const USE_LABEL: Record<string, string> = { kompaktni: "Kompaktni", ratarski: "Ratarski", vocarski: "Voćarski / vinogradarski" };

/** dodatna polja koja imaju modeli sa sređenim fabričkim podacima (npr. Solis) */
type Rich = {
  images?: string[];
  specGroups?: { group: string; rows: string[][] }[];
  specSource?: string;
  stats?: { value: string; unit: string; label: string }[];
  uses?: string[];
};

export default function TractorPage({ brand, model, partGroups }: { brand: string; model: string; partGroups: PartGroup[] }) {
  const t = list.find((x) => x.brand === brand && x.slug === model)!;
  const full = tractors.find((x) => x.slug === `traktori/${brand}/${model}`)!;
  const logo = useTractorBrand(brand)?.logo || `/brands/trim/${brand === "john-deere" ? "deere" : brand}.svg`;
  const isImt565 = model === "imt-5652-di";
  const rich = full as typeof full & Rich;
  const images = useProductImages(t.href, rich.images?.length ? rich.images : [t.image]);

  // specifikacija: sa starog sajta (bez duplikata) ili fabrička za IMT 565.2 DI
  const seen = new Set<string>();
  const oldSpecs = full.specs.filter((s) => !seen.has(s.label) && seen.add(s.label));
  // redosled: sređeni podaci iz tractors.json, pa ugrađeni fabrički za IMT 565.2 DI, pa stari sa sajta
  const groups: { group: string; rows: [string, string][] }[] = rich.specGroups?.length
    ? rich.specGroups.map((g) => ({ group: g.group, rows: g.rows.map((r) => [r[0], r[1]] as [string, string]) }))
    : isImt565
    ? imt.specs.map((g) => ({ group: g.group, rows: g.rows as [string, string][] }))
    : [
        {
          group: "Osnovni podaci",
          rows: [
            ["Snaga motora", `${t.ks} KS`],
            ...(t.drive ? ([["Pogon", t.drive]] as [string, string][]) : []),
            ["Namena", USE_LABEL[t.use]],
          ],
        },
        ...(oldSpecs.length ? [{ group: "Tehnički podaci", rows: oldSpecs.map((s) => [s.label, s.value] as [string, string]) }] : []),
      ];

  const baseStats = [
    { v: String(t.ks), u: "KS", l: "snaga motora" },
    ...(t.drive ? [{ v: t.drive, u: "", l: t.drive === "4WD" ? "pogon na sva 4 točka" : "zadnji pogon" }] : []),
    ...oldSpecs
      .filter((s) => /menjač|podizna|pto|težina/i.test(s.label))
      .slice(0, 4 - (t.drive ? 2 : 1))
      .map((s) => ({ v: s.value, u: "", l: s.label.toLowerCase() })),
  ];
  const stats = rich.stats?.length ? rich.stats.map((x) => ({ v: x.value, u: x.unit, l: x.label })) : isImt565 ? imt.stats.map((x) => ({ v: x.value, u: x.unit, l: x.label })) : baseStats;

  const parts = partGroups.flatMap((g) => g.brands).find((b) => b.slug === brand);
  const similar = list.filter((x) => x.slug !== model && (x.brand === brand || Math.abs(x.ks - t.ks) <= 15)).sort((a, b) => Math.abs(a.ks - t.ks) - Math.abs(b.ks - t.ks)).slice(0, 4);

  const perks: Perk[] = [
    { icon: Wrench, title: "Servis i originalni delovi", short: "Servis", href: "/servis" },
    ...(parts ? [{ icon: Package, title: `${delova(parts.count)} za ${t.brandName}`, short: delova(parts.count), href: parts.href }] : []),
    { icon: Landmark, title: "Pomoć oko subvencija", short: "Subvencije", href: "/subvencije" },
  ];

  return (
    <ProductDetail
      crumbs={[{ label: "Početna", href: "/" }, { label: "Traktori", href: "/traktori" }, { label: t.brandName, href: `/traktori/${brand}` }, { label: t.name }]}
      image={images[0]}
      images={images}
      name={t.name}
      badge={`${t.ks} KS`}
      tag={t.drive || undefined}
      logo={logo}
      brandName={t.brandName}
      eyebrow={`Traktor · ${USE_LABEL[t.use]}`}
      text={t.text}
      stats={stats}
      perks={perks}
      priceNote="Moguće uz subvencije"
      specSource={rich.specSource ?? (isImt565 ? "Fabrički podaci IMT / TAFE" : undefined)}
      specs={groups}
      aboutTitle="O modelu"
      about={full.texts}
      uses={rich.uses ?? (isImt565 ? imt.uses : undefined)}
      inquiry={{ about: `traktor ${t.name}`, placeholder: "Kabina, utovarivač, priključne mašine, kupovina uz subvenciju..." }}
      similar={
        similar.length > 0
          ? {
              title: "Slični modeli",
              link: { href: "/traktori", label: "Svi traktori" },
              items: similar.map((x) => (
                <li key={x.slug} className="w-[82%] shrink-0 snap-start sm:w-auto">
                  <TractorCard t={x} />
                </li>
              )),
            }
          : undefined
      }
    />
  );
}
