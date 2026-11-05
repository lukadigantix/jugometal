"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Search } from "lucide-react";
import AddToCart from "./AddToCart";
import { CatalogCta, CatalogHero, Empty, FilterCard, FilterSheet, HelpCard, ListBar, Marquee, type Chip } from "./catalog/CatalogKit";
import { formatRsd, normalize, type PartItem, type PartsData } from "@/data/featured-parts";
import { useSite } from "@/lib/site-context";

type Data = Pick<PartsData, "searchIndex" | "partGroups" | "filterTree" | "totalParts">;

/* Online prodavnica, u jeziku strane Akcije: tamni hero sa brojkama, crvena traka, pa lista sa filterima u kartici.
 * Filter po grupi/brendu (svaki brend ima svoju adresu), pretraga po nazivu/šifri, sortiranje, "Prikaži još". */

type Sort = "preporuceno" | "cena-rastuce" | "cena-opadajuce" | "naziv";
const PAGE = 24;
let lastSort: Sort = "preporuceno"; // pamti sortiranje između strana brendova
const SORTS = [
  { value: "preporuceno", label: "Preporučeno" },
  { value: "cena-rastuce", label: "Cena rastuće" },
  { value: "cena-opadajuce", label: "Cena opadajuće" },
  { value: "naziv", label: "Naziv A-Š" },
];
/** 1 artikal, 3 artikla, 5 artikala */
const artikala = (n: number) => {
  const l = n % 10, teen = n % 100 >= 11 && n % 100 <= 14;
  return `${n} ${l === 1 && !teen ? "artikal" : l >= 2 && l <= 4 && !teen ? "artikla" : "artikala"}`;
};
export const STOCK: Record<PartItem["stockStatus"], { label: string; dot: string }> = {
  na_stanju: { label: "Na stanju", dot: "bg-emerald-500" },
  po_porudzbini: { label: "Po porudžbini", dot: "bg-amber-500" },
  na_upit: { label: "Na upit", dot: "bg-mist" },
  nema: { label: "Nema na stanju", dot: "bg-[#e02a33]" },
};

const Count = ({ n, on = false }: { n: number | string; on?: boolean }) => (
  <span className={`grid h-5 min-w-6 shrink-0 place-items-center rounded-full px-1.5 text-[11px] tabular-nums ${on ? "bg-[#18191b] text-white" : "bg-canvas text-mist"}`}>{n}</span>
);

/* Kategorije (desktop i telefon): „Svi delovi", pa grupe koje se otvaraju u brendove; otvorena je trenutna grupa. */
function FilterTree({ data, group, brand, onPick }: { data: Data; group?: string; brand?: string; onPick?: () => void }) {
  const { filterTree, totalParts } = data;
  const [open, setOpen] = useState<string | null>(group ?? filterTree[0]?.slug ?? null);
  const row = (on: boolean) => `flex items-center gap-2.5 rounded-[8px] px-2 py-2 text-[13px] transition-colors ${on ? "bg-canvas font-medium" : "hover:bg-canvas"}`;
  return (
    <div>
      <div className="border-b border-line px-2 py-2">
        <Link href="/rezervni-delovi" onClick={onPick} className={row(!group)}>
          <span className={`size-1.5 shrink-0 rounded-full ${!group ? "bg-[#e02a33]" : "bg-transparent"}`} />
          <span className="flex-1">Svi delovi</span>
          <Count n={totalParts} on={!group} />
        </Link>
      </div>
      {filterTree.map((x) => {
        const isOpen = open === x.slug;
        return (
          <div key={x.slug} className="border-b border-line px-4 py-3.5 last:border-b-0">
            <button type="button" onClick={() => setOpen(isOpen ? null : x.slug)} aria-expanded={isOpen} className="flex w-full items-center gap-2 text-left text-[13px] font-medium">
              <span className="flex-1">{x.name}</span>
              <span className="text-[12px] font-normal tabular-nums text-mist">{x.total > 0 ? x.total : "uskoro"}</span>
              <svg viewBox="0 0 12 12" aria-hidden className={`size-3 shrink-0 text-mist transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}>
                <path d="m2.5 4.5 3.5 3.5 3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {isOpen && (
              <ul className="-mx-2 mt-2.5 animate-[heroIn_.3s_ease-out_both] space-y-0.5">
                {x.total > 0 && (
                  <li>
                    <Link href={`/rezervni-delovi/${x.slug}`} onClick={onPick} className={row(x.slug === group && !brand)}>
                      <span className={`size-1.5 shrink-0 rounded-full ${x.slug === group && !brand ? "bg-[#e02a33]" : "bg-transparent"}`} />
                      <span className="flex-1">Sve iz grupe</span>
                      <Count n={x.total} on={x.slug === group && !brand} />
                    </Link>
                  </li>
                )}
                {x.subs.map((c) => (
                  <li key={c.slug}>
                    {c.count > 0 ? (
                      <Link href={c.href} onClick={onPick} className={row(c.slug === brand)}>
                        <span className={`size-1.5 shrink-0 rounded-full ${c.slug === brand ? "bg-[#e02a33]" : "bg-transparent"}`} />
                        <span className="min-w-0 flex-1 truncate">{c.name}</span>
                        <Count n={c.count} on={c.slug === brand} />
                      </Link>
                    ) : (
                      <span className="flex items-center gap-2.5 px-2 py-2 text-[13px] text-mist/70">
                        <span className="size-1.5 shrink-0" />
                        <span className="min-w-0 flex-1 truncate">{c.name}</span>
                        <Count n="uskoro" />
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* Kartica dela, u jeziku kartica sa strane Akcije (kompaktna, dve u redu na telefonu):
 * deo na beloj podlozi, proizvođač gore levo, popust gore desno, naziv, šifra i stanje,
 * tamna traka sa cenom i dugmetom „U korpu" ispod nje (cena se nikad ne preklapa sa dugmetom); na hover traka postaje crvena. */
export function PartCard({ p }: { p: PartItem }) {
  const cut = p.onSale && p.regularPrice > p.priceRsd;
  const pct = cut ? Math.round(((p.regularPrice - p.priceRsd) / p.regularPrice) * 100) : 0;
  const st = STOCK[p.stockStatus];
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[12px] bg-paper shadow-[0_1px_2px_rgba(24,25,27,0.05)] ring-1 ring-black/[0.06] transition-shadow duration-500 ease-[var(--ease-brand)] hover:shadow-[0_32px_64px_-32px_rgba(24,25,27,0.45)]">
      <div className="relative aspect-square overflow-hidden border-b border-line bg-white md:aspect-[5/4]">
        {p.image && (
          // eslint-disable-next-line @next/next/no-img-element -- slika sa backenda
          <img
            src={p.image}
            alt={p.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain px-5 pb-5 pt-10 transition-transform duration-700 ease-[var(--ease-brand)] group-hover:-translate-y-1 group-hover:scale-[1.04] md:px-8 md:pb-6 md:pt-11"
          />
        )}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2 md:inset-x-4 md:top-4">
          {p.logo ? (
            // eslint-disable-next-line @next/next/no-img-element -- logo proizvođača
            <img src={p.logo} alt={p.brand} className="h-4 w-auto max-w-[72px] object-contain object-left md:h-5 md:max-w-[90px]" />
          ) : (
            <span className="truncate pt-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-ink/50 md:text-[11px]">{p.brand}</span>
          )}
          {cut && <span className="shrink-0 rounded-[4px] bg-[#e02a33] px-2 py-1 text-[11px] font-medium leading-none text-white md:px-2.5 md:py-1.5 md:text-[12px]">−{pct}%</span>}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3 md:p-4">
        {/* proizvođač (brend) iznad naziva */}
        <p className="truncate text-[10px] font-medium uppercase tracking-[0.16em] text-mist md:text-[11px]">{p.brand}</p>
        <h2 className="mt-1 line-clamp-2 min-h-[2.6em] text-[14px] font-medium leading-snug tracking-[-0.01em] md:text-[15px]">
          <Link href={p.href} className="after:absolute after:inset-0 after:z-10 focus-visible:outline-none">
            {p.name}
          </Link>
        </h2>
        <div className="mt-2 flex items-center justify-between gap-2 border-t border-line pt-2 text-[11px] md:text-[12px]">
          <span className="min-w-0 truncate text-mist">{p.code && !/\s/.test(p.code) ? <>Šifra <span className="text-ink tabular-nums">{p.code}</span></> : null}</span>
          {st && (
            <span className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap text-mist sm:inline-flex">
              <span className={`size-1.5 rounded-full ${st.dot}`} />
              {st.label}
            </span>
          )}
        </div>

        <div className="mt-auto pt-3">
          <div className="flex flex-col gap-2.5 rounded-[8px] bg-[#18191b] p-2.5 text-white transition-colors duration-300 group-hover:bg-[#e02a33] md:p-3">
            <p className="flex min-w-0 flex-wrap items-baseline gap-x-2 px-1">
              <span className="whitespace-nowrap text-[16px] font-medium leading-none tracking-[-0.01em] tabular-nums md:text-[18px]">{formatRsd(p.priceRsd)}</span>
              {cut && <span className="whitespace-nowrap text-[11px] text-white/45 line-through transition-colors group-hover:text-white/70">{formatRsd(p.regularPrice)}</span>}
            </p>
            <AddToCart id={p.id} name={p.name} price={p.priceRsd} tone="light" className="relative z-20 h-9 w-full justify-center px-3.5 py-0 text-[12px] font-medium" />
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ShopCatalog({ data, group, brand }: { data: Data; group?: string; brand?: string }) {
  const { searchIndex, partGroups, totalParts, filterTree } = data;
  const router = useRouter();
  const { contact } = useSite();
  const partsPhone = contact.phoneParts || contact.phone;
  const [q, setQ] = useState("");
  const [sort, setSortState] = useState<Sort>(() => lastSort);
  const setSort = (v: Sort) => {
    lastSort = v;
    setSortState(v);
  };
  const [shown, setShown] = useState(PAGE);
  const [sheet, setSheet] = useState(false);
  const closeSheet = useCallback(() => setSheet(false), []);

  const g = partGroups.find((x) => x.slug === group);
  const b = g?.brands.find((x) => x.slug === brand);
  const title = b ? `${b.name} delovi` : g ? g.name : "Online prodavnica";

  const list = useMemo(() => {
    let r = searchIndex.filter((p) => (!group || p.group === group) && (!brand || p.sub === brand));
    const terms = normalize(q).split(/\s+/).filter((w) => w.length > 1);
    if (terms.length) r = r.filter((p) => terms.every((w) => p.hay.includes(w)));
    if (sort === "cena-rastuce") r = [...r].sort((a, c) => a.priceRsd - c.priceRsd);
    if (sort === "cena-opadajuce") r = [...r].sort((a, c) => c.priceRsd - a.priceRsd);
    if (sort === "naziv") r = [...r].sort((a, c) => a.name.localeCompare(c.name, "sr"));
    return r;
  }, [searchIndex, group, brand, q, sort]);

  const chips: Chip[] = [
    ...(g ? [{ k: "g", label: g.name, off: () => router.push("/rezervni-delovi") }] : []),
    ...(b && g ? [{ k: "b", label: b.name, off: () => router.push(`/rezervni-delovi/${g.slug}`) }] : []),
    ...(q.trim() ? [{ k: "q", label: `„${q.trim()}"`, off: () => setQ("") }] : []),
  ];
  const clear = () => {
    setQ("");
    if (g) router.push("/rezervni-delovi");
  };


  const search = (
    <label className="flex h-11 items-center gap-2.5 rounded-[10px] bg-paper px-4 ring-1 ring-line transition focus-within:ring-ink/40">
      <Search className="size-4 shrink-0 text-mist" strokeWidth={1.8} aria-hidden />
      <span className="sr-only">Pretraga</span>
      <input
        type="search"
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setShown(PAGE);
        }}
        placeholder="Naziv ili šifra dela"
        className="w-full min-w-0 bg-transparent text-[14px] placeholder:text-mist focus:outline-none"
      />
    </label>
  );

  return (
    <>
      <CatalogHero
        crumbs={[
          { label: "Početna", href: "/" },
          ...(g ? [{ label: "Online prodavnica", href: "/rezervni-delovi" }] : [{ label: "Online prodavnica" }]),
          ...(g ? [b ? { label: g.name, href: `/rezervni-delovi/${g.slug}` } : { label: g.name }] : []),
          ...(b ? [{ label: b.name }] : []),
        ]}
        title={title}
        text={
          <>
            {b ? `Rezervni delovi ${b.name}, sa cenama u RSD.` : g ? `${g.name}, sa cenama u RSD.` : `${totalParts} rezervnih delova za traktore i priključne mašine, sa cenama u RSD.`}
            <br />
            Poručite online ili pozovite odeljenje delova.
          </>
        }
        image="/banners/delovi3.jpg"
        listLabel="Pogledaj delove"
        phone={partsPhone}
      />
      <Marquee phrases={[...filterTree.filter((x) => x.total > 0).map((x) => x.name), "Poručivanje online", "Cene u RSD", "Jugometal Svilajnac"]} />

      <div className="bg-canvas">
        <section id="ponuda" className="mx-auto w-full max-w-[1600px] scroll-mt-24 px-4 pb-14 pt-10 md:px-9 md:pb-24 md:pt-14">
          <ListBar
            eyebrow="Prodavnica"
            title={b ? `${b.name} delovi` : g ? g.name : "Svi delovi"}
            note="cene u RSD"
            count={list.length}
            noun={artikala(list.length).replace(/^\d+ /, "")}
            sort={sort}
            sorts={SORTS}
            onSort={(v) => setSort(v as Sort)}
            chips={chips}
            onClear={clear}
            onOpenFilters={() => setSheet(true)}
            search={search}
          />

          <div className="mt-4 grid gap-6 lg:mt-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
            <aside className="hidden lg:block">
              <div data-lenis-prevent className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto overflow-x-hidden pb-1">
                <FilterCard active={g ? 1 : 0} onClear={clear}>
                  <FilterTree data={data} group={group} brand={brand} />
                </FilterCard>
                <HelpCard eyebrow="Ne nalazite deo?" title="Pozovite odeljenje delova, pomoći ćemo da nađete pravi deo." phone={partsPhone} />
              </div>
            </aside>

            <div className="min-w-0">
              <div>
                {list.length === 0 ? (
                  <Empty
                    text={q.trim() ? `Nema rezultata za „${q.trim()}".` : "Nema delova u ovoj grupi."}
                    hint={`Proverite šifru ili pozovite odeljenje delova${partsPhone ? ` na ${partsPhone}` : ""}.`}
                    clearLabel="Obriši pretragu"
                    onClear={clear}
                  />
                ) : (
                  <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
                    {list.slice(0, shown).map((p) => (
                      <li key={p.id} className="h-full">
                        <PartCard p={p} />
                      </li>
                    ))}
                  </ul>
                )}
                {shown < list.length && (
                  <div className="mt-10 flex flex-col items-center gap-3">
                    <div className="h-1 w-48 overflow-hidden rounded-full bg-line">
                      <div className="h-full rounded-full bg-[#e02a33]" style={{ width: `${(shown / list.length) * 100}%` }} />
                    </div>
                    <p className="text-[13px] text-mist">
                      Prikazano {shown} od {list.length}
                    </p>
                    <button type="button" onClick={() => setShown((n) => n + PAGE)} className="inline-flex h-11 items-center rounded-full bg-[#18191b] px-8 text-[14px] font-medium text-white transition-colors hover:bg-[#e02a33]">
                      Prikaži još
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <CatalogCta eyebrow="Ne nalazite deo?" title="Pozovite. Za veće količine i delove koji nisu na sajtu uvek ima dogovora." />
      </div>

      <FilterSheet open={sheet} onClose={closeSheet} active={g ? 1 : 0} onClear={clear} resultLabel={`Prikaži ${artikala(list.length)}`}>
        <FilterTree data={data} group={group} brand={brand} onPick={closeSheet} />
      </FilterSheet>
    </>
  );
}
