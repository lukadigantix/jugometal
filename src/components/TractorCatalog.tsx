"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import TractorCard from "./TractorCard";
import list from "@/data/tractor-list.json";
import catalog from "@/data/catalog.json";

/* Traktori: filteri brend (više odjednom), snaga od-do, pogon, namena; brojevi se računaju uživo
 * (za svaku opciju: koliko bi modela ostalo uz ostale aktivne filtere). Desktop: bočna kolona sa
 * sekcijama koje se sklapaju. Telefon: lepljiva traka + panel odozdo. /traktori/<brend> otvara sa
 * tim brendom uključenim. */

type T = (typeof list)[number];
const BRANDS = catalog.tractorBrands.map((b) => ({ slug: b.slug, name: b.name, logo: `/brands/trim/${b.slug === "john-deere" ? "deere" : b.slug}.png` }));
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

type F = { brands: string[]; drives: string[]; uses: string[]; ks: [number, number] };
const match = (t: T, f: F, skip?: keyof F) =>
  (skip === "brands" || !f.brands.length || f.brands.includes(t.brand)) &&
  (skip === "drives" || !f.drives.length || f.drives.includes(t.drive)) &&
  (skip === "uses" || !f.uses.length || f.uses.includes(t.use)) &&
  (skip === "ks" || (t.ks >= f.ks[0] && t.ks <= f.ks[1]));

const toggle = (arr: string[], v: string) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line py-3">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center justify-between text-[14px] font-medium">
        {title}
        <span className={`text-[18px] leading-none text-mist transition-transform ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && <div className="mt-2 animate-[heroIn_.3s_ease-out_both]">{children}</div>}
    </div>
  );
}

function Check({ on, disabled, onChange, children, count }: { on: boolean; disabled?: boolean; onChange: () => void; children: React.ReactNode; count: number }) {
  return (
    <label className={`flex cursor-pointer items-center gap-2.5 rounded-[4px] px-1.5 py-1.5 text-[13px] ${disabled && !on ? "cursor-default opacity-40" : "hover:bg-canvas"}`}>
      <input type="checkbox" checked={on} disabled={disabled && !on} onChange={onChange} className="peer sr-only" />
      <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border transition-colors ${on ? "border-accent bg-accent text-accent-contrast" : "border-line bg-paper"} peer-focus-visible:ring-2 peer-focus-visible:ring-ink/30`}>
        {on && (
          <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden>
            <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="flex min-w-0 flex-1 items-center">{children}</span>
      <span className="text-[12px] text-mist">{count}</span>
    </label>
  );
}

function Range({ value, onChange }: { value: [number, number]; onChange: (v: [number, number]) => void }) {
  const [lo, hi] = value;
  const pct = (v: number) => ((v - MIN_KS) / (MAX_KS - MIN_KS)) * 100;
  const thumb =
    "pointer-events-none absolute inset-x-0 top-1/2 h-1 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-accent [&::-webkit-slider-thumb]:bg-paper [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-accent [&::-moz-range-thumb]:bg-paper";
  return (
    <div className="px-2.5">
      <div className="flex justify-between text-[13px]">
        <span>{lo} KS</span>
        <span>{hi} KS</span>
      </div>
      <div className="relative mt-2 h-5">
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-line" />
        <div className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-accent" style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
        <input aria-label="Najmanja snaga" type="range" min={MIN_KS} max={MAX_KS} step={5} value={lo} onChange={(e) => onChange([Math.min(+e.target.value, hi - 5), hi])} className={thumb} />
        <input aria-label="Najveća snaga" type="range" min={MIN_KS} max={MAX_KS} step={5} value={hi} onChange={(e) => onChange([lo, Math.max(+e.target.value, lo + 5)])} className={thumb} />
      </div>
      <div className="mt-2.5 flex flex-wrap gap-1">
        {[
          [MIN_KS, 50, "do 50"],
          [51, 80, "51-80"],
          [81, MAX_KS, "preko 80"],
        ].map(([a, b, l]) => (
          <button key={l} type="button" onClick={() => onChange([a as number, b as number])} className={`rounded-full border px-2.5 py-0.5 text-[11px] ${lo === a && hi === b ? "border-accent bg-accent text-accent-contrast" : "border-line hover:border-ink"}`}>
            {l} KS
          </button>
        ))}
      </div>
    </div>
  );
}

function Filters({ f, setF }: { f: F; setF: (f: F) => void }) {
  return (
    <div>
      <Section title="Brend">
        {BRANDS.map((b) => {
          const n = list.filter((t) => t.brand === b.slug && match(t, f, "brands")).length;
          return (
            <Check key={b.slug} on={f.brands.includes(b.slug)} disabled={n === 0} count={n} onChange={() => setF({ ...f, brands: toggle(f.brands, b.slug) })}>
              <img src={b.logo} alt={b.name} className="h-5 w-auto max-w-[90px] object-contain" />
              {b.slug === "imt" && <span className="ml-2">IMT</span>}
            </Check>
          );
        })}
      </Section>
      <Section title="Snaga motora">
        <Range value={f.ks} onChange={(ks) => setF({ ...f, ks })} />
      </Section>
      <Section title="Pogon">
        {DRIVES.map((d) => {
          const n = list.filter((t) => t.drive === d.k && match(t, f, "drives")).length;
          return (
            <Check key={d.k} on={f.drives.includes(d.k)} disabled={n === 0} count={n} onChange={() => setF({ ...f, drives: toggle(f.drives, d.k) })}>
              {d.label}
            </Check>
          );
        })}
      </Section>
      <Section title="Namena">
        {USES.map((u) => {
          const n = list.filter((t) => t.use === u.k && match(t, f, "uses")).length;
          return (
            <Check key={u.k} on={f.uses.includes(u.k)} disabled={n === 0} count={n} onChange={() => setF({ ...f, uses: toggle(f.uses, u.k) })}>
              {u.label}
            </Check>
          );
        })}
      </Section>
    </div>
  );
}

export default function TractorCatalog({ brand }: { brand?: string }) {
  const empty: F = { brands: brand ? [brand] : [], drives: [], uses: [], ks: [MIN_KS, MAX_KS] };
  const [f, setF] = useState<F>(empty);
  const [sort, setSort] = useState<Sort>("snaga-rastuce");
  const [sheet, setSheet] = useState(false);
  const b = BRANDS.find((x) => x.slug === brand);

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

  const items = useMemo(() => {
    const r = list.filter((t) => match(t, f));
    return [...r].sort((a, c) => (sort === "brend" ? a.brandName.localeCompare(c.brandName) || a.ks - c.ks : sort === "snaga-opadajuce" ? c.ks - a.ks : a.ks - c.ks));
  }, [f, sort]);

  const chips = [
    ...f.brands.map((x) => ({ k: `b${x}`, label: BRANDS.find((y) => y.slug === x)!.name, off: () => setF({ ...f, brands: f.brands.filter((y) => y !== x) }) })),
    ...(f.ks[0] !== MIN_KS || f.ks[1] !== MAX_KS ? [{ k: "ks", label: `${f.ks[0]}-${f.ks[1]} KS`, off: () => setF({ ...f, ks: [MIN_KS, MAX_KS] }) }] : []),
    ...f.drives.map((x) => ({ k: `d${x}`, label: x, off: () => setF({ ...f, drives: f.drives.filter((y) => y !== x) }) })),
    ...f.uses.map((x) => ({ k: `u${x}`, label: USES.find((y) => y.k === x)!.label.replace(/ \(.*\)/, ""), off: () => setF({ ...f, uses: f.uses.filter((y) => y !== x) }) })),
  ];
  const clear = () => setF({ brands: [], drives: [], uses: [], ks: [MIN_KS, MAX_KS] });
  const sortSelect = (
    <label className="flex items-center gap-2 text-[14px]">
      <span className="text-mist">Sortiraj:</span>
      <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="bg-transparent focus:outline-none">
        <option value="snaga-rastuce">Snaga rastuće</option>
        <option value="snaga-opadajuce">Snaga opadajuće</option>
        <option value="brend">Brend</option>
      </select>
    </label>
  );

  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 pb-16 pt-8 md:px-9 md:pb-24 md:pt-12">
      <nav aria-label="Putanja" className="text-[13px] text-mist">
        <Link href="/" className="hover:text-ink">Početna</Link>
        <span className="mx-2">/</span>
        {b ? <Link href="/traktori" className="hover:text-ink">Traktori</Link> : <span className="text-ink">Traktori</span>}
        {b && (
          <>
            <span className="mx-2">/</span>
            <span className="text-ink">{b.name}</span>
          </>
        )}
      </nav>
      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-[34px] font-medium leading-[1.05] md:text-[52px]">{b ? `${b.name} traktori` : "Traktori"}</h1>
          <p className="mt-2 text-[14px] text-mist">Solis, IMT, John Deere, YTO i Mahindra · od {MIN_KS} do {MAX_KS} KS · prodaja, servis i delovi</p>
        </div>
        <Link href="/kontakt" className="hidden self-end rounded-full bg-accent px-7 py-3 text-[14px] text-accent-contrast hover:bg-accent-soft md:block">
          Zatražite ponudu
        </Link>
      </div>

      {/* telefon: lepljiva traka */}
      <div className="sticky top-20 z-20 -mx-4 mt-4 flex items-center justify-between gap-3 border-b border-line bg-paper/95 px-4 py-3 backdrop-blur lg:hidden">
        <button type="button" onClick={() => setSheet(true)} className="flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-[14px] text-accent-contrast">
          <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
            <path d="M2 4h12M4.5 8h7M7 12h2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Filteri{chips.length > 0 && ` (${chips.length})`}
        </button>
        {sortSelect}
      </div>

      <div className="mt-4 grid gap-6 lg:mt-8 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="hidden lg:block">
          <div data-lenis-prevent className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto overflow-x-hidden pr-1">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <p className="text-[16px] font-medium">Filteri</p>
              {chips.length > 0 && (
                <button type="button" onClick={clear} className="text-[13px] text-mist underline-offset-4 hover:text-ink hover:underline">
                  Obriši sve
                </button>
              )}
            </div>
            <Filters f={f} setF={setF} />
            <Link href="/kontakt" className="mt-4 block rounded-[4px] bg-canvas p-4 text-[13px] hover:bg-line">
              <span className="block text-mist">Niste sigurni koji model?</span>
              <span className="mt-0.5 block font-medium">Pomoći ćemo vam da izaberete</span>
            </Link>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[15px]">
              <span className="font-medium">{items.length}</span> <span className="text-mist">{items.length === 1 ? "model" : "modela"}</span>
            </p>
            <div className="hidden lg:block">{sortSelect}</div>
          </div>
          {chips.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {chips.map((c) => (
                <button key={c.k} type="button" onClick={c.off} className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-3 py-1.5 text-[13px] hover:bg-line">
                  {c.label} <span aria-hidden className="text-[15px] leading-none text-mist">×</span>
                </button>
              ))}
              <button type="button" onClick={clear} className="px-2 text-[13px] text-mist hover:text-ink">Obriši sve</button>
            </div>
          )}

          {items.length === 0 ? (
            <div className="mt-6 rounded-[4px] bg-canvas p-10 text-center">
              <p className="text-[17px] font-medium">Nema modela za izabrane filtere.</p>
              <button type="button" onClick={clear} className="mt-4 rounded-full bg-accent px-6 py-2.5 text-[14px] text-accent-contrast">Obriši filtere</button>
            </div>
          ) : (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
              {items.map((t) => (
                <li key={t.slug} className="h-full">
                  <TractorCard t={t} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* telefon: panel odozdo */}
      <div className={`fixed inset-0 z-[60] lg:hidden ${sheet ? "" : "pointer-events-none"}`} aria-hidden={!sheet}>
        <div onClick={() => setSheet(false)} className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${sheet ? "opacity-100" : "opacity-0"}`} />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filteri"
          data-lenis-prevent
          className={`absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-[16px] bg-paper transition-transform duration-300 ease-[var(--ease-expo)] ${sheet ? "translate-y-0" : "translate-y-full"}`}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <p className="text-[18px] font-medium">Filteri</p>
            <div className="flex items-center gap-3">
              {chips.length > 0 && <button type="button" onClick={clear} className="text-[13px] text-mist">Obriši sve</button>}
              <button type="button" onClick={() => setSheet(false)} aria-label="Zatvori" className="flex h-9 w-9 items-center justify-center rounded-full bg-canvas text-[18px]">×</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-5">
            <Filters f={f} setF={setF} />
          </div>
          <div className="border-t border-line p-4">
            <button type="button" onClick={() => setSheet(false)} className="w-full rounded-full bg-accent py-3.5 text-[15px] text-accent-contrast">
              Prikaži {items.length} {items.length === 1 ? "model" : "modela"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
