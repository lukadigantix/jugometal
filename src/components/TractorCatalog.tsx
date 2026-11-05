"use client";

import { useCallback, useMemo, useState } from "react";
import TractorCard from "./TractorCard";
import { CatalogCta, CatalogHero, Check, Empty, FilterCard, FilterSection, FilterSheet, ListBar, Marquee, RangeFilter, type Chip } from "./catalog/CatalogKit";
import list from "@/data/tractor-list.json";
import { useTractorBrands, type TractorBrand } from "@/lib/brands-context";

/* Traktori, u jeziku strane Akcije: tamni hero sa brojkama, crvena traka, pa lista sa filterima u kartici.
 * Filteri: brend (više odjednom), snaga od-do, pogon, namena; brojevi se računaju uživo (za svaku opciju:
 * koliko bi modela ostalo uz ostale aktivne filtere). Telefon: dugme „Filteri" + panel odozdo.
 * /traktori/<brend> otvara sa tim brendom uključenim. */

type T = (typeof list)[number];
const DRIVES = [
  { k: "4WD", label: "4WD (pogon na sva 4)" },
  { k: "2WD", label: "2WD (zadnji pogon)" },
];
const USES = [
  { k: "kompaktni", label: "Kompaktni (do 30 KS)" },
  { k: "ratarski", label: "Ratarski" },
  { k: "vocarski", label: "Voćarski / vinogradarski" },
];
const MIN_KS = Math.min(...list.map((t) => t.ks));
const MAX_KS = Math.max(...list.map((t) => t.ks));
type Sort = "snaga-rastuce" | "snaga-opadajuce" | "brend";
const SORTS = [
  { value: "snaga-rastuce", label: "Snaga rastuće" },
  { value: "snaga-opadajuce", label: "Snaga opadajuće" },
  { value: "brend", label: "Brend A-Š" },
];

type F = { brands: string[]; drives: string[]; uses: string[]; ks: [number, number] };
const match = (t: T, f: F, skip?: keyof F) =>
  (skip === "brands" || !f.brands.length || f.brands.includes(t.brand)) &&
  (skip === "drives" || !f.drives.length || f.drives.includes(t.drive)) &&
  (skip === "uses" || !f.uses.length || f.uses.includes(t.use)) &&
  (skip === "ks" || (t.ks >= f.ks[0] && t.ks <= f.ks[1]));

const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
/** 1 model, 3 modela, 5 modela */
const modela = (n: number) => `${n} ${n % 10 === 1 && n % 100 !== 11 ? "model" : "modela"}`;

/** logo brenda u filteru; kad je logo skoro kvadratan (amblem, npr. IMT), uz njega ide i naziv brenda */
function BrandLogo({ src, name }: { src: string; name: string }) {
  const [emblem, setEmblem] = useState(false);
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- logo proizvođača sa backenda */}
      <img
        src={src}
        alt=""
        className={`w-auto object-contain ${emblem ? "h-6 max-w-[28px]" : "h-[18px] max-w-[104px]"}`}
        // slika iz keša može da se učita pre hidratacije (onLoad tada ne stigne), pa se proverava i pri povezivanju
        ref={(el) => {
          if (el?.complete && el.naturalWidth) setEmblem(el.naturalWidth / Math.max(1, el.naturalHeight) < 1.8);
        }}
        onLoad={(e) => setEmblem(e.currentTarget.naturalWidth / Math.max(1, e.currentTarget.naturalHeight) < 1.8)}
      />
      <span className={emblem ? "ml-2" : "sr-only"}>{name}</span>
    </>
  );
}

function Filters({ f, setF, brands }: { f: F; setF: (f: F) => void; brands: TractorBrand[] }) {
  const ksOn = f.ks[0] !== MIN_KS || f.ks[1] !== MAX_KS;
  return (
    <div>
      <FilterSection title="Brend" active={f.brands.length}>
        {brands.map((b) => {
          const n = list.filter((t) => t.brand === b.slug && match(t, f, "brands")).length;
          return (
            <Check key={b.slug} on={f.brands.includes(b.slug)} disabled={n === 0} count={n} onChange={() => setF({ ...f, brands: toggle(f.brands, b.slug) })}>
              <BrandLogo src={b.logo} name={b.name} />
            </Check>
          );
        })}
      </FilterSection>
      <FilterSection title="Snaga motora" active={ksOn ? 1 : 0}>
        <RangeFilter
          min={MIN_KS}
          max={MAX_KS}
          unit="KS"
          value={f.ks}
          onChange={(ks) => setF({ ...f, ks })}
          presets={[
            { from: MIN_KS, to: 50, label: "do 50" },
            { from: 51, to: 80, label: "51 do 80" },
            { from: 81, to: MAX_KS, label: "preko 80" },
          ]}
        />
      </FilterSection>
      <FilterSection title="Pogon" active={f.drives.length}>
        {DRIVES.map((d) => {
          const n = list.filter((t) => t.drive === d.k && match(t, f, "drives")).length;
          return (
            <Check key={d.k} on={f.drives.includes(d.k)} disabled={n === 0} count={n} onChange={() => setF({ ...f, drives: toggle(f.drives, d.k) })}>
              {d.label}
            </Check>
          );
        })}
      </FilterSection>
      <FilterSection title="Namena" active={f.uses.length}>
        {USES.map((u) => {
          const n = list.filter((t) => t.use === u.k && match(t, f, "uses")).length;
          return (
            <Check key={u.k} on={f.uses.includes(u.k)} disabled={n === 0} count={n} onChange={() => setF({ ...f, uses: toggle(f.uses, u.k) })}>
              {u.label}
            </Check>
          );
        })}
      </FilterSection>
    </div>
  );
}

export default function TractorCatalog({ brand }: { brand?: string }) {
  const [f, setF] = useState<F>({ brands: brand ? [brand] : [], drives: [], uses: [], ks: [MIN_KS, MAX_KS] });
  const [sort, setSort] = useState<Sort>("snaga-rastuce");
  const [sheet, setSheet] = useState(false);
  const closeSheet = useCallback(() => setSheet(false), []);
  const brands = useTractorBrands();
  const b = brands.find((x) => x.slug === brand);
  // hero prati izabrani brend: tačno jedan brend u filteru → njegov naslov, opis i baner
  const hb = f.brands.length === 1 ? brands.find((x) => x.slug === f.brands[0]) : undefined;

  const items = useMemo(() => {
    const r = list.filter((t) => match(t, f));
    return [...r].sort((a, c) => (sort === "brend" ? a.brandName.localeCompare(c.brandName) || a.ks - c.ks : sort === "snaga-opadajuce" ? c.ks - a.ks : a.ks - c.ks));
  }, [f, sort]);

  const chips: Chip[] = [
    ...f.brands.map((x) => ({ k: `b${x}`, label: brands.find((y) => y.slug === x)?.name ?? x, off: () => setF({ ...f, brands: f.brands.filter((y) => y !== x) }) })),
    ...(f.ks[0] !== MIN_KS || f.ks[1] !== MAX_KS ? [{ k: "ks", label: `${f.ks[0]} do ${f.ks[1]} KS`, off: () => setF({ ...f, ks: [MIN_KS, MAX_KS] }) }] : []),
    ...f.drives.map((x) => ({ k: `d${x}`, label: x, off: () => setF({ ...f, drives: f.drives.filter((y) => y !== x) }) })),
    ...f.uses.map((x) => ({ k: `u${x}`, label: USES.find((y) => y.k === x)!.label.replace(/ \(.*\)/, ""), off: () => setF({ ...f, uses: f.uses.filter((y) => y !== x) }) })),
  ];
  const clear = () => setF({ brands: [], drives: [], uses: [], ks: [MIN_KS, MAX_KS] });


  return (
    <>
      <CatalogHero
        crumbs={[{ label: "Početna", href: "/" }, ...(b ? [{ label: "Traktori", href: "/traktori" }, { label: b.name }] : [{ label: "Traktori" }])]}
        title={hb ? `${hb.name} traktori` : "Traktori"}
        text={
          <>
            {hb ? hb.description || `${hb.name} traktori u ponudi Jugometala.` : `${brands.map((x) => x.name).join(", ").replace(/, ([^,]*)$/, " i $1")}, od ${MIN_KS} do ${MAX_KS} KS.`}
            <br />
            Prodaja, servis i originalni delovi na jednom mestu.
          </>
        }
        image={hb?.banner || "/banners/traktori.jpg"}
        listLabel="Pogledaj modele"
      />
      <Marquee phrases={[...brands.map((x) => x.name), "Servis i delovi", "Pomoć oko subvencija", "Jugometal Svilajnac"]} />

      <div className="bg-canvas">
        <section id="ponuda" className="mx-auto w-full max-w-[1600px] scroll-mt-24 px-4 pb-14 pt-10 md:px-9 md:pb-24 md:pt-14">
          <ListBar
            eyebrow="Ponuda"
            title={b ? `${b.name} modeli` : "Svi modeli"}
            note="cena na upit"
            count={items.length}
            noun={items.length % 10 === 1 && items.length % 100 !== 11 ? "model" : "modela"}
            sort={sort}
            sorts={SORTS}
            onSort={(v) => setSort(v as Sort)}
            chips={chips}
            onClear={clear}
            onOpenFilters={() => setSheet(true)}
          />

          <div className="mt-4 grid gap-6 lg:mt-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
            <aside className="hidden lg:block">
              <div data-lenis-prevent className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto overflow-x-hidden pb-1">
                <FilterCard active={chips.length} onClear={clear}>
                  <Filters f={f} setF={setF} brands={brands} />
                </FilterCard>
              </div>
            </aside>

            <div className="min-w-0">
              <div>
                {items.length === 0 ? (
                  <Empty text="Nema modela za izabrane filtere." onClear={clear} />
                ) : (
                  <ul className="grid gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
                    {items.map((t) => (
                      <li key={t.slug} className="h-full">
                        <TractorCard t={t} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>

        <CatalogCta eyebrow="Niste sigurni koji model?" title="Pozovite. Pomažemo oko izbora, finansiranja i subvencija." />
      </div>

      <FilterSheet open={sheet} onClose={closeSheet} active={chips.length} onClear={clear} resultLabel={`Prikaži ${modela(items.length)}`}>
        <Filters f={f} setF={setF} brands={brands} />
      </FilterSheet>
    </>
  );
}
