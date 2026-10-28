"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AddToCart from "./AddToCart";
import { filterTree, formatRsd, partGroups, searchIndex, totalParts } from "@/data/featured-parts";

/* Online prodavnica: svi delovi, filter po grupi/brendu (svaki brend ima svoju adresu),
 * pretraga po nazivu/šifri, sortiranje, "Prikaži još". */

type Sort = "preporuceno" | "cena-rastuce" | "cena-opadajuce" | "naziv";
const PAGE = 24;
let lastSort: Sort = "preporuceno"; // pamti sortiranje između strana brendova
const SORTS: { v: Sort; label: string }[] = [
  { v: "preporuceno", label: "Preporučeno" },
  { v: "cena-rastuce", label: "Cena rastuće" },
  { v: "cena-opadajuce", label: "Cena opadajuće" },
  { v: "naziv", label: "Naziv A-Š" },
];

/* Harmonika filtera (desktop i telefon): grupa -> kategorije sa brojem; otvorena je trenutna grupa. */
function FilterTree({ group, brand, onPick, big = false }: { group?: string; brand?: string; onPick?: () => void; big?: boolean }) {
  const [open, setOpen] = useState<string | null>(group ?? null);
  return (
    <div>
      <Link
        href="/rezervni-delovi"
        onClick={onPick}
        className={`flex items-center justify-between rounded-[4px] px-3 ${big ? "py-3 text-[15px]" : "py-2 text-[14px]"} ${!group ? "bg-canvas font-medium" : "hover:bg-canvas"}`}
      >
        Svi delovi <span className="text-mist">{totalParts}</span>
      </Link>
      {filterTree.map((x) => {
        const isOpen = open === x.slug;
        return (
          <div key={x.slug} className="border-b border-line">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : x.slug)}
              aria-expanded={isOpen}
              className={`flex w-full items-center justify-between gap-3 px-3 text-left ${big ? "py-4 text-[15px]" : "py-3 text-[14px]"} ${x.slug === group ? "font-medium" : ""}`}
            >
              <span>{x.name}</span>
              <span className="flex shrink-0 items-center gap-3 text-[13px] text-mist">
                {x.total > 0 ? x.total : "uskoro"}
                <span className={`text-[18px] leading-none transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}>+</span>
              </span>
            </button>
            {isOpen && (
              <ul className="animate-[heroIn_.3s_ease-out_both] pb-3">
                {x.total > 0 && (
                  <li>
                    <Link
                      href={`/rezervni-delovi/${x.slug}`}
                      onClick={onPick}
                      className={`flex items-center justify-between rounded-[4px] py-2 pl-6 pr-3 text-[14px] ${x.slug === group && !brand ? "bg-canvas font-medium" : "text-mist hover:bg-canvas hover:text-ink"}`}
                    >
                      Sve iz grupe <span>{x.total}</span>
                    </Link>
                  </li>
                )}
                {x.subs.map((c) => (
                  <li key={c.slug}>
                    {c.count > 0 ? (
                      <Link
                        href={c.href}
                        onClick={onPick}
                        className={`flex items-center justify-between gap-3 rounded-[4px] py-2 pl-6 pr-3 text-[14px] ${c.slug === brand ? "bg-canvas font-medium" : "hover:bg-canvas"}`}
                      >
                        <span className="flex min-w-0 items-center gap-2.5">
                          {c.slug === brand && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#e02a33]" />}
                          <span className="truncate">{c.name}</span>
                        </span>
                        <span className="shrink-0 text-[13px] text-mist">{c.count}</span>
                      </Link>
                    ) : (
                      <span className="flex items-center justify-between py-2 pl-6 pr-3 text-[14px] text-mist/70">
                        {c.name}
                        <span className="rounded-full bg-canvas px-2 py-0.5 text-[11px]">uskoro</span>
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

export default function ShopCatalog({ group, brand }: { group?: string; brand?: string }) {
  const [q, setQ] = useState("");
  const [sort, setSortState] = useState<Sort>(() => lastSort);
  const setSort = (v: Sort) => {
    lastSort = v;
    setSortState(v);
  };
  const [shown, setShown] = useState(PAGE);
  const [sheet, setSheet] = useState(false);

  // telefon: dok je panel otvoren, stranica ispod ne skroluje; Escape zatvara
  useEffect(() => {
    if (!sheet) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSheet(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [sheet]);

  const g = partGroups.find((x) => x.slug === group);
  const b = g?.brands.find((x) => x.slug === brand);
  const title = b ? `${b.name} - rezervni delovi` : g ? g.name : "Online prodavnica";

  const list = useMemo(() => {
    let r = searchIndex.filter((p) => (!group || p.group === group) && (!brand || p.sub === brand));
    const terms = q.toLocaleLowerCase("sr").split(/\s+/).filter((w) => w.length > 1);
    if (terms.length) r = r.filter((p) => terms.every((w) => p.hay.includes(w)));
    if (sort === "cena-rastuce") r = [...r].sort((a, b) => a.priceRsd - b.priceRsd);
    if (sort === "cena-opadajuce") r = [...r].sort((a, b) => b.priceRsd - a.priceRsd);
    if (sort === "naziv") r = [...r].sort((a, b) => a.name.localeCompare(b.name, "sr"));
    return r;
  }, [group, brand, q, sort]);

  const chip = (active: boolean) =>
    `shrink-0 rounded-full border px-4 py-2 text-[13px] transition-colors ${active ? "border-accent bg-accent text-accent-contrast" : "border-line bg-paper hover:border-ink"}`;

  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 pb-16 pt-8 md:px-9 md:pb-24 md:pt-12">
      <nav aria-label="Putanja" className="text-[13px] text-mist">
        <Link href="/" className="hover:text-ink">Početna</Link>
        <span className="mx-2">/</span>
        {g ? <Link href="/rezervni-delovi" className="hover:text-ink">Online prodavnica</Link> : <span className="text-ink">Online prodavnica</span>}
        {g && (
          <>
            <span className="mx-2">/</span>
            {b ? <Link href={`/rezervni-delovi/${g.slug}`} className="hover:text-ink">{g.name}</Link> : <span className="text-ink">{g.name}</span>}
          </>
        )}
        {b && (
          <>
            <span className="mx-2">/</span>
            <span className="text-ink">{b.name}</span>
          </>
        )}
      </nav>

      <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex items-center gap-4">
          {b?.logo && <img src={b.logo} alt="" aria-hidden className="h-8 w-auto max-w-[96px] object-contain md:h-12 md:max-w-none" />}
          <div>
            <h1 className="text-[28px] font-medium leading-[1.05] md:text-[48px]">{title}</h1>
            <p className="mt-2 text-[14px] text-mist">
              {list.length} {list.length === 1 ? "artikal" : "artikala"}
              {!g && ` od ${totalParts} u ponudi`} · cene u RSD · poručivanje online
            </p>
          </div>
        </div>
        <div className="hidden w-full gap-3 lg:flex lg:w-auto">
          <label className="flex flex-1 items-center gap-3 rounded-full border border-line bg-paper px-5 py-3 focus-within:border-ink lg:w-[380px]">
            <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-mist" aria-hidden>
              <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <span className="sr-only">Pretraga</span>
            <input
              type="search"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setShown(PAGE);
              }}
              placeholder="Naziv ili šifra dela"
              className="w-full bg-transparent text-[15px] placeholder:text-mist focus:outline-none"
            />
          </label>
          <label className="flex items-center gap-2 rounded-full border border-line bg-paper px-5 py-3 text-[14px]">
            <span className="text-mist">Sortiraj:</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="bg-transparent focus:outline-none">
              <option value="preporuceno">Preporučeno</option>
              <option value="cena-rastuce">Cena rastuće</option>
              <option value="cena-opadajuce">Cena opadajuće</option>
              <option value="naziv">Naziv A-Š</option>
            </select>
          </label>
        </div>
      </div>

          {/* telefon: lepljiva traka (pretraga + Filteri) i aktivni filter */}
          <div className="sticky top-20 z-20 -mx-4 mt-4 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur lg:hidden">
            <div className="flex gap-2">
              <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-line bg-paper px-4 py-2.5 focus-within:border-ink">
                <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-mist" aria-hidden>
                  <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                <span className="sr-only">Pretraga</span>
                <input
                  type="search"
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setShown(PAGE);
                  }}
                  placeholder="Naziv ili šifra"
                  className="w-full min-w-0 bg-transparent text-[15px] placeholder:text-mist focus:outline-none"
                />
              </label>
              <button
                type="button"
                onClick={() => setSheet(true)}
                className="flex shrink-0 items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-[14px] text-accent-contrast"
              >
                <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
                  <path d="M2 4h12M4.5 8h7M7 12h2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Filteri
                {(brand || group || sort !== "preporuceno") && <span className="h-1.5 w-1.5 rounded-full bg-[#e02a33]" />}
              </button>
            </div>
            {(g || sort !== "preporuceno") && (
              <div className="mt-2 flex flex-wrap gap-2">
                {g && (
                  <Link href={b ? `/rezervni-delovi/${g.slug}` : "/rezervni-delovi"} className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-3 py-1.5 text-[12px]">
                    {b ? b.name : g.name} <span aria-hidden className="text-[14px] leading-none text-mist">×</span>
                    <span className="sr-only">ukloni filter</span>
                  </Link>
                )}
                {sort !== "preporuceno" && (
                  <button type="button" onClick={() => setSort("preporuceno")} className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-3 py-1.5 text-[12px]">
                    {SORTS.find((x) => x.v === sort)?.label} <span aria-hidden className="text-[14px] leading-none text-mist">×</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* telefon: panel sa filterima odozdo */}
          <div className={`fixed inset-0 z-[60] lg:hidden ${sheet ? "" : "pointer-events-none"}`} aria-hidden={!sheet}>
            <div onClick={() => setSheet(false)} className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${sheet ? "opacity-100" : "opacity-0"}`} />
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Filteri"
              data-lenis-prevent
              className={`absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-[16px] bg-paper transition-transform duration-300 ease-[var(--ease-expo)] ${sheet ? "translate-y-0" : "translate-y-full"}`}
            >
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <p className="text-[18px] font-medium">Filteri</p>
                <button type="button" onClick={() => setSheet(false)} aria-label="Zatvori" className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-[18px]">×</button>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-4">
                <p className="text-[12px] uppercase tracking-[0.16em] text-mist">Sortiraj</p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {SORTS.map((x) => (
                    <button key={x.v} type="button" onClick={() => setSort(x.v)} className={`rounded-[4px] border px-3 py-2.5 text-[13px] ${sort === x.v ? "border-accent bg-accent text-accent-contrast" : "border-line"}`}>
                      {x.label}
                    </button>
                  ))}
                </div>
                <p className="mt-6 text-[12px] uppercase tracking-[0.16em] text-mist">Kategorije</p>
                <div className="mt-2">
                  <FilterTree group={group} brand={brand} onPick={() => setSheet(false)} big />
                </div>
              </div>
              <div className="border-t border-line p-4">
                <button type="button" onClick={() => setSheet(false)} className="w-full rounded-full bg-accent py-3.5 text-[15px] text-accent-contrast">
                  Prikaži {list.length} {list.length === 1 ? "artikal" : "artikala"}
                </button>
              </div>
            </div>
          </div>

      <div className="mt-4 grid gap-4 lg:mt-8 lg:grid-cols-[260px_1fr] lg:gap-8">
        {/* filteri: telefon - red čipova; desktop - bočna kolona */}
        <aside className="min-w-0">
          <div className="hidden lg:sticky lg:top-28 lg:flex lg:max-h-[calc(100dvh-8rem)] lg:flex-col">
            <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto pr-1">
              <p className="px-3 pb-2 text-[12px] uppercase tracking-[0.16em] text-mist">Kategorije</p>
              <FilterTree group={group} brand={brand} />
            </div>
            <a href="tel:035311137" className="mt-4 block shrink-0 rounded-[4px] bg-ink p-4 text-paper">
              <span className="block text-[11px] uppercase tracking-[0.16em] text-paper/60">Ne nalazite deo?</span>
              <span className="mt-1 block text-[17px] font-medium">035/311-137</span>
            </a>
          </div>
        </aside>

        <div className="min-w-0">
          {list.length === 0 ? (
            <div className="rounded-[4px] bg-canvas p-10 text-center">
              <p className="text-[18px] font-medium">Nema rezultata za „{q}".</p>
              <p className="mt-2 text-[14px] text-mist">
                Pozovite odeljenje delova: <a href="tel:035311137" className="text-ink underline">035/311-137</a>
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 xl:grid-cols-4">
              {list.slice(0, shown).map((p) => (
                <li key={p.id}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-[4px] border border-line bg-paper transition-shadow duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                    <Link href={p.href} aria-label={p.name} className="relative block aspect-square bg-white">
                      {p.image && (
                        <img src={p.image} alt={p.name} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-[1.05] md:p-6" />
                      )}
                    </Link>
                    <div className="flex flex-1 flex-col border-t border-line p-3 md:p-4">
                      <div className="flex h-5 items-center">
                        {p.logo ? (
                          <img src={p.logo} alt={p.brand} className="h-5 w-auto max-w-[80px] object-contain object-left" />
                        ) : (
                          <span className="text-[11px] uppercase tracking-[0.14em] text-mist">{p.brand}</span>
                        )}
                      </div>
                      <h2 className="mt-2 line-clamp-2 min-h-[40px] text-[14px] font-medium leading-snug md:text-[15px]">
                        <Link href={p.href} className="hover:text-mist">{p.name}</Link>
                      </h2>
                      {p.code && !/\s/.test(p.code) && <p className="mt-1 truncate text-[12px] text-mist">Šifra: {p.code}</p>}
                      <div className="mt-auto flex flex-col gap-2 pt-3 sm:flex-row sm:items-center sm:justify-between">
                        <p className="whitespace-nowrap text-[17px] font-medium md:text-[18px]">{formatRsd(p.priceRsd)}</p>
                        <AddToCart id={p.id} name={p.name} className="justify-center px-4 py-2 text-[12px]" />
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
          {shown < list.length && (
            <div className="mt-10 flex flex-col items-center gap-3">
              <p className="text-[13px] text-mist">Prikazano {shown} od {list.length}</p>
              <button type="button" onClick={() => setShown((n) => n + PAGE)} className="rounded-full border border-accent px-10 py-3 text-[14px] font-medium transition-colors hover:bg-accent hover:text-accent-contrast">
                Prikaži još
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
