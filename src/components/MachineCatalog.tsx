"use client";

import { useCallback, useMemo, useState } from "react";
import MachineCard from "./MachineCard";
import { CatalogCta, CatalogHero, Check, Empty, FilterCard, FilterSection, FilterSheet, ListBar, Marquee, type Chip } from "./catalog/CatalogKit";
import list from "@/data/machine-list.json";
import catalog from "@/data/catalog.json";

/* Priključne mašine, u jeziku strane Akcije: tamni hero sa brojkama, crvena traka, pa lista sa filterima u kartici.
 * Filteri: namena, vrsta mašine, proizvođač (više odjednom, brojevi uživo).
 * /prikljucne-masine/<kategorija> otvara sa tom kategorijom uključenom (adrese kao na starom sajtu). */

type T = (typeof list)[number];
const CATS = catalog.implementCategories.map((c) => ({ k: c.slug, label: c.name })).filter((c) => list.some((m) => m.category === c.k));
const USES = catalog.implementUsageGroups.map((g) => ({ k: g.slug, label: g.name }));
const MAKERS = [...new Map(list.map((m) => [m.brand, { k: m.brand, label: m.brandName, logo: m.logo }])).values()].sort((a, b) => a.label.localeCompare(b.label, "sr"));
type Sort = "kategorija" | "naziv" | "proizvodjac";
const SORTS = [
  { value: "kategorija", label: "Vrsta mašine" },
  { value: "naziv", label: "Naziv A-Š" },
  { value: "proizvodjac", label: "Proizvođač" },
];

type F = { cats: string[]; uses: string[]; makers: string[] };
const match = (t: T, f: F, skip?: keyof F) =>
  (skip === "cats" || !f.cats.length || f.cats.includes(t.category)) &&
  (skip === "uses" || !f.uses.length || f.uses.includes(t.use)) &&
  (skip === "makers" || !f.makers.length || f.makers.includes(t.brand));

const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
/** 1 mašina, 3 mašine, 5 mašina */
const masina = (n: number) => {
  const l = n % 10, teen = n % 100 >= 11 && n % 100 <= 14;
  return `${n} ${l >= 2 && l <= 4 && !teen ? "mašine" : "mašina"}`;
};

function Filters({ f, setF }: { f: F; setF: (f: F) => void }) {
  const opt = (key: keyof F, k: string) => list.filter((t) => (key === "cats" ? t.category : key === "uses" ? t.use : t.brand) === k && match(t, f, key)).length;
  return (
    <div>
      <FilterSection title="Namena" active={f.uses.length}>
        {USES.map((u) => {
          const n = opt("uses", u.k);
          return (
            <Check key={u.k} on={f.uses.includes(u.k)} disabled={n === 0} count={n} onChange={() => setF({ ...f, uses: toggle(f.uses, u.k) })}>
              {u.label}
            </Check>
          );
        })}
      </FilterSection>
      <FilterSection title="Vrsta mašine" active={f.cats.length}>
        {CATS.map((c) => {
          const n = opt("cats", c.k);
          return (
            <Check key={c.k} on={f.cats.includes(c.k)} disabled={n === 0} count={n} onChange={() => setF({ ...f, cats: toggle(f.cats, c.k) })}>
              {c.label}
            </Check>
          );
        })}
      </FilterSection>
      <FilterSection title="Proizvođač" active={f.makers.length} defaultOpen={false}>
        {MAKERS.map((m) => {
          const n = opt("makers", m.k);
          return (
            <Check key={m.k} on={f.makers.includes(m.k)} disabled={n === 0} count={n} onChange={() => setF({ ...f, makers: toggle(f.makers, m.k) })}>
              {m.label}
            </Check>
          );
        })}
      </FilterSection>
    </div>
  );
}

export default function MachineCatalog({ category }: { category?: string }) {
  const [f, setF] = useState<F>({ cats: category ? [category] : [], uses: [], makers: [] });
  const [sort, setSort] = useState<Sort>("kategorija");
  const [sheet, setSheet] = useState(false);
  const closeSheet = useCallback(() => setSheet(false), []);
  const b = CATS.find((x) => x.k === category);

  const items = useMemo(() => {
    const r = list.filter((t) => match(t, f));
    return [...r].sort((a, c) => (sort === "naziv" ? a.name.localeCompare(c.name, "sr") : sort === "proizvodjac" ? a.brandName.localeCompare(c.brandName, "sr") : a.categoryName.localeCompare(c.categoryName, "sr") || a.name.localeCompare(c.name, "sr")));
  }, [f, sort]);

  const chips: Chip[] = [
    ...f.uses.map((x) => ({ k: `u${x}`, label: USES.find((y) => y.k === x)!.label, off: () => setF({ ...f, uses: f.uses.filter((y) => y !== x) }) })),
    ...f.cats.map((x) => ({ k: `c${x}`, label: CATS.find((y) => y.k === x)!.label, off: () => setF({ ...f, cats: f.cats.filter((y) => y !== x) }) })),
    ...f.makers.map((x) => ({ k: `m${x}`, label: MAKERS.find((y) => y.k === x)!.label, off: () => setF({ ...f, makers: f.makers.filter((y) => y !== x) }) })),
  ];
  const clear = () => setF({ cats: [], uses: [], makers: [] });


  return (
    <>
      <CatalogHero
        crumbs={[{ label: "Početna", href: "/" }, ...(b ? [{ label: "Priključne mašine", href: "/prikljucne-masine" }, { label: b.label }] : [{ label: "Priključne mašine" }])]}
        title={b ? b.label : "Priključne mašine"}
        text={
          <>
            {b ? `${b.label} u ponudi Jugometala, od domaćih i regionalnih proizvođača.` : `${CATS.length} vrsta mašina za ratarstvo, stočarstvo, voćarstvo i transport.`}
            <br />
            Savet oko izbora, rezervni delovi i pomoć oko subvencija.
          </>
        }
        image="/banners/masine.jpg"
        listLabel="Pogledaj mašine"
      />
      <Marquee phrases={[...USES.map((u) => u.label), "Domaći proizvođači", "Rezervni delovi", "Jugometal Svilajnac"]} />

      <div className="bg-canvas">
        <section id="ponuda" className="mx-auto w-full max-w-[1600px] scroll-mt-24 px-4 pb-14 pt-10 md:px-9 md:pb-24 md:pt-14">
          <ListBar
            eyebrow="Ponuda"
            title={b ? b.label : "Sve mašine"}
            note="cena na upit"
            count={items.length}
            noun={masina(items.length).replace(/^\d+ /, "")}
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
                  <Filters f={f} setF={setF} />
                </FilterCard>
              </div>
            </aside>

            <div className="min-w-0">
              <div>
                {items.length === 0 ? (
                  <Empty text="Nema mašina za izabrane filtere." onClear={clear} />
                ) : (
                  <ul className="grid gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
                    {items.map((t) => (
                      <li key={t.slug} className="h-full">
                        <MachineCard m={t} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>

        <CatalogCta eyebrow="Niste sigurni koja mašina?" title="Pozovite. Pomažemo oko izbora, finansiranja i subvencija." />
      </div>

      <FilterSheet open={sheet} onClose={closeSheet} active={chips.length} onClear={clear} resultLabel={`Prikaži ${masina(items.length)}`}>
        <Filters f={f} setF={setF} />
      </FilterSheet>
    </>
  );
}
