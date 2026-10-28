"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import MachineCard from "./MachineCard";
import list from "@/data/machine-list.json";
import catalog from "@/data/catalog.json";

/* Priključne mašine: filteri kategorija, namena, proizvođač (više odjednom, brojevi uživo).
 * /prikljucne-masine/<kategorija> otvara sa tom kategorijom uključenom (adrese kao na starom sajtu). */

type T = (typeof list)[number];
const CATS = catalog.implementCategories.map((c) => ({ k: c.slug, label: c.name })).filter((c) => list.some((m) => m.category === c.k));
const USES = catalog.implementUsageGroups.map((g) => ({ k: g.slug, label: g.name }));
const MAKERS = [...new Map(list.map((m) => [m.brand, { k: m.brand, label: m.brandName, logo: m.logo }])).values()].sort((a, b) => a.label.localeCompare(b.label, "sr"));
type Sort = "kategorija" | "naziv" | "proizvodjac";

type F = { cats: string[]; uses: string[]; makers: string[] };
const match = (t: T, f: F, skip?: keyof F) =>
  (skip === "cats" || !f.cats.length || f.cats.includes(t.category)) &&
  (skip === "uses" || !f.uses.length || f.uses.includes(t.use)) &&
  (skip === "makers" || !f.makers.length || f.makers.includes(t.brand));

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

function Filters({ f, setF }: { f: F; setF: (f: F) => void }) {
  const opt = (key: keyof F, k: string) => list.filter((t) => (key === "cats" ? t.category : key === "uses" ? t.use : t.brand) === k && match(t, f, key)).length;
  return (
    <div>
      <Section title="Namena">
        {USES.map((u) => {
          const n = opt("uses", u.k);
          return (
            <Check key={u.k} on={f.uses.includes(u.k)} disabled={n === 0} count={n} onChange={() => setF({ ...f, uses: toggle(f.uses, u.k) })}>
              {u.label}
            </Check>
          );
        })}
      </Section>
      <Section title="Vrsta mašine">
        {CATS.map((c) => {
          const n = opt("cats", c.k);
          return (
            <Check key={c.k} on={f.cats.includes(c.k)} disabled={n === 0} count={n} onChange={() => setF({ ...f, cats: toggle(f.cats, c.k) })}>
              {c.label}
            </Check>
          );
        })}
      </Section>
      <Section title="Proizvođač" defaultOpen={false}>
        {MAKERS.map((m) => {
          const n = opt("makers", m.k);
          return (
            <Check key={m.k} on={f.makers.includes(m.k)} disabled={n === 0} count={n} onChange={() => setF({ ...f, makers: toggle(f.makers, m.k) })}>
              {m.label}
            </Check>
          );
        })}
      </Section>
    </div>
  );
}

export default function MachineCatalog({ category }: { category?: string }) {
  const [f, setF] = useState<F>({ cats: category ? [category] : [], uses: [], makers: [] });
  const [sort, setSort] = useState<Sort>("kategorija");
  const [sheet, setSheet] = useState(false);
  const b = CATS.find((x) => x.k === category);

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
    return [...r].sort((a, c) => (sort === "naziv" ? a.name.localeCompare(c.name, "sr") : sort === "proizvodjac" ? a.brandName.localeCompare(c.brandName, "sr") : a.categoryName.localeCompare(c.categoryName, "sr") || a.name.localeCompare(c.name, "sr")));
  }, [f, sort]);

  const chips = [
    ...f.uses.map((x) => ({ k: `u${x}`, label: USES.find((y) => y.k === x)!.label, off: () => setF({ ...f, uses: f.uses.filter((y) => y !== x) }) })),
    ...f.cats.map((x) => ({ k: `c${x}`, label: CATS.find((y) => y.k === x)!.label, off: () => setF({ ...f, cats: f.cats.filter((y) => y !== x) }) })),
    ...f.makers.map((x) => ({ k: `m${x}`, label: MAKERS.find((y) => y.k === x)!.label, off: () => setF({ ...f, makers: f.makers.filter((y) => y !== x) }) })),
  ];
  const clear = () => setF({ cats: [], uses: [], makers: [] });
  const sortSelect = (
    <label className="flex items-center gap-2 text-[14px]">
      <span className="text-mist">Sortiraj:</span>
      <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="bg-transparent focus:outline-none">
        <option value="kategorija">Vrsta mašine</option>
        <option value="naziv">Naziv A-Š</option>
        <option value="proizvodjac">Proizvođač</option>
      </select>
    </label>
  );

  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 pb-16 pt-8 md:px-9 md:pb-24 md:pt-12">
      <nav aria-label="Putanja" className="text-[13px] text-mist">
        <Link href="/" className="hover:text-ink">Početna</Link>
        <span className="mx-2">/</span>
        {b ? <Link href="/prikljucne-masine" className="hover:text-ink">Priključne mašine</Link> : <span className="text-ink">Priključne mašine</span>}
        {b && (
          <>
            <span className="mx-2">/</span>
            <span className="text-ink">{b.label}</span>
          </>
        )}
      </nav>
      <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-[34px] font-medium leading-[1.05] md:text-[52px]">{b ? b.label : "Priključne mašine"}</h1>
          <p className="mt-2 text-[14px] text-mist">{CATS.length} vrsta mašina za ratarstvo, stočarstvo, voćarstvo i transport · domaći i regionalni proizvođači</p>
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
              <span className="block text-mist">Niste sigurni koja mašina?</span>
              <span className="mt-0.5 block font-medium">Pomoći ćemo vam da izaberete</span>
            </Link>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[15px]">
              <span className="font-medium">{items.length}</span> <span className="text-mist">{items.length === 1 ? "mašina" : "mašina"}</span>
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
              <p className="text-[17px] font-medium">Nema mašina za izabrane filtere.</p>
              <button type="button" onClick={clear} className="mt-4 rounded-full bg-accent px-6 py-2.5 text-[14px] text-accent-contrast">Obriši filtere</button>
            </div>
          ) : (
            <ul className="mt-6 grid gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-3">
              {items.map((t) => (
                <li key={t.slug} className="h-full">
                  <MachineCard m={t} />
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
              Prikaži {items.length} {items.length === 1 ? "mašina" : "mašina"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
