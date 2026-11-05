"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Phone, SearchX, SlidersHorizontal, X } from "lucide-react";
import { ArrowRight } from "../graphics";
import Select, { type SelectOption } from "../ui/Select";
import { tel, useSite } from "@/lib/site-context";

/*
  Zajednički delovi kataloga (Traktori, Priključne mašine), u jeziku strane Akcije:
  tamni hero sa brojkama, crvena traka koja se pomera, filteri u kartici, alatna traka sa sortiranjem,
  aktivni filteri kao pilule, prazno stanje, panel filtera odozdo na telefonu i tamni poziv na kraju.
*/

/* ── hero ── */

export function CatalogHero({
  crumbs,
  title,
  text,
  image,
  stats,
  listHref = "#ponuda",
  listLabel = "Pogledaj ponudu",
  phone,
}: {
  crumbs: { label: string; href?: string }[];
  title: string;
  text: React.ReactNode;
  image: string;
  /** brojke ispod dugmadi (opciono) */
  stats?: { value: string; label: string }[];
  listHref?: string;
  listLabel?: string;
  /** broj u heroju; podrazumevano glavni broj firme */
  phone?: string;
}) {
  const { contact } = useSite();
  const ph = phone || contact.phone;
  return (
    <section className="relative overflow-hidden bg-[#18191b] text-white">
      {/* eslint-disable-next-line @next/next/no-img-element -- pozadinska fotografija iz public */}
      <img
        src={image}
        alt=""
        aria-hidden
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[65%_center] opacity-40 [mask-image:linear-gradient(to_right,transparent_12%,black_62%)]"
      />
      <div className="absolute inset-0 bg-linear-to-r from-[#18191b] from-10% via-[#18191b]/55 via-50% to-[#18191b]/0" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#18191b] to-transparent" />

      <div className="relative mx-auto max-w-[1600px] px-4 pb-14 pt-8 md:px-9 md:pb-20 md:pt-12">
        <nav aria-label="Putanja" className="text-[12px] text-white/55">
          {crumbs.map((c, i) => (
            <span key={c.label}>
              {i > 0 && <span className="mx-2">/</span>}
              {c.href ? (
                <Link href={c.href} className="transition-colors hover:text-white">
                  {c.label}
                </Link>
              ) : (
                <span className="text-white">{c.label}</span>
              )}
            </span>
          ))}
        </nav>

        <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33] md:mt-10">Jugometal · Svilajnac</p>
        <h1 className="mt-3 text-[44px] font-medium leading-[0.95] tracking-[-0.03em] md:text-[68px]">
          {title}
          <span className="text-[#e02a33]">.</span>
        </h1>
        <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-white/70 md:text-[15px]">{text}</p>

        <div className="mt-7 flex flex-wrap gap-3">
          <a href={listHref} className="group inline-flex h-11 items-center gap-2 rounded-full bg-[#e02a33] pl-5 pr-4 text-[14px] font-medium text-white transition-colors hover:bg-[#c41f27]">
            {listLabel}
            <ArrowRight className="h-3 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
          {ph && (
            <a href={tel(ph)} className="inline-flex h-11 items-center gap-2 rounded-full border border-white/30 px-5 text-[14px] text-white transition-colors hover:border-white hover:bg-white hover:text-ink">
              <Phone className="size-4" strokeWidth={1.8} aria-hidden />
              {ph}
            </a>
          )}
        </div>

        {stats && stats.length > 0 && (
        <dl className="mt-10 grid max-w-2xl grid-cols-3 border-y border-white/15 md:mt-12">
          {stats.map((s, i) => (
            <div key={s.label} className={`py-3.5 md:py-4 ${i > 0 ? "border-l border-white/15 pl-5 md:pl-8" : ""}`}>
              <dd className="whitespace-nowrap text-[18px] font-medium leading-none tracking-[-0.02em] md:text-[24px]">{s.value}</dd>
              <dt className="mt-1.5 whitespace-nowrap text-[10px] uppercase tracking-[0.16em] text-white/50 md:text-[11px]">{s.label}</dt>
            </div>
          ))}
        </dl>
        )}
      </div>
    </section>
  );
}

/* ── crvena traka ── */

export function Marquee({ phrases }: { phrases: string[] }) {
  // jedna polovina trake mora biti šira od najšireg ekrana, inače posle pomeranja za -50% ostane prazan deo;
  // zato se fraze ponavljaju (procena: ~10 px po slovu + 48 px razmak i tačka), a brzina ostaje ista (~55 px/s)
  const unit = phrases.reduce((w, p) => w + p.length * 10 + 48, 0) || 1;
  const reps = Math.max(1, Math.ceil(3000 / unit));
  const half = Array.from({ length: reps }, () => phrases).flat();
  const seconds = Math.round((unit * reps) / 55);
  return (
    <div className="overflow-hidden bg-[#e02a33] py-3 text-white" aria-hidden>
      <div className="flex w-max animate-[marquee_40s_linear_infinite] whitespace-nowrap" style={{ animationDuration: `${seconds}s` }}>
        {[0, 1].map((n) => (
          <ul key={n} className="flex shrink-0 items-center">
            {half.map((p, i) => (
              <li key={`${p}-${i}`} className="flex items-center gap-6 pr-6 text-[12px] font-medium uppercase tracking-[0.2em]">
                {p}
                <span className="size-1.5 rounded-full bg-white/70" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/* ── filteri ── */

/** sekcija filtera koja se sklapa; broj uključenih opcija pored naslova */
export function FilterSection({ title, active = 0, children, defaultOpen = true }: { title: string; active?: number; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-line px-4 py-3.5 last:border-b-0">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center gap-2 text-left text-[13px] font-medium">
        <span className="flex-1">{title}</span>
        {active > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#e02a33] px-1.5 text-[10px] font-medium tabular-nums text-white">{active}</span>}
        <svg viewBox="0 0 12 12" aria-hidden className={`size-3 shrink-0 text-mist transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <path d="m2.5 4.5 3.5 3.5 3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && <div className="mt-2.5 animate-[heroIn_.3s_ease-out_both] space-y-0.5">{children}</div>}
    </div>
  );
}

/** opcija sa kvačicom; broj desno (koliko bi ostalo uz ostale filtere) */
export function Check({ on, disabled, onChange, children, count }: { on: boolean; disabled?: boolean; onChange: () => void; children: React.ReactNode; count: number }) {
  const off = disabled && !on;
  return (
    <label className={`flex items-center gap-3 rounded-[8px] px-2 py-2 text-[13px] transition-colors ${off ? "cursor-default opacity-40" : "cursor-pointer hover:bg-canvas"}`}>
      <input type="checkbox" checked={on} disabled={off} onChange={onChange} className="peer sr-only" />
      <span
        className={`grid size-[18px] shrink-0 place-items-center rounded-[5px] border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#e02a33]/40 ${on ? "border-[#e02a33] bg-[#e02a33] text-white" : "border-line bg-paper"}`}
      >
        {on && (
          <svg viewBox="0 0 16 16" className="size-3" aria-hidden>
            <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="flex min-w-0 flex-1 items-center truncate">{children}</span>
      <span className={`grid h-5 min-w-6 place-items-center rounded-full px-1.5 text-[11px] tabular-nums ${on ? "bg-[#18191b] text-white" : "bg-canvas text-mist"}`}>{count}</span>
    </label>
  );
}

/** opseg od-do sa dva klizača i brzim izborima */
export function RangeFilter({
  min,
  max,
  step = 5,
  unit,
  value,
  onChange,
  presets,
}: {
  min: number;
  max: number;
  step?: number;
  unit: string;
  value: [number, number];
  onChange: (v: [number, number]) => void;
  presets: { from: number; to: number; label: string }[];
}) {
  const [lo, hi] = value;
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  const thumb =
    "pointer-events-none absolute inset-x-0 top-1/2 h-1 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-[18px] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-[#e02a33] [&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-[18px] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-[#e02a33] [&::-moz-range-thumb]:bg-white";
  return (
    <div className="px-2 pb-1">
      <div className="grid grid-cols-2 gap-2">
        {[
          ["Od", lo],
          ["Do", hi],
        ].map(([l, v]) => (
          <div key={l} className="rounded-[8px] bg-canvas px-3 py-2">
            <p className="text-[10px] uppercase tracking-[0.14em] text-mist">{l}</p>
            <p className="mt-0.5 text-[14px] font-medium tabular-nums">
              {v} <span className="text-[11px] font-normal text-mist">{unit}</span>
            </p>
          </div>
        ))}
      </div>
      <div className="relative mt-3 h-5">
        <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-line" />
        <div className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-[#e02a33]" style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
        <input aria-label={`Najmanje ${unit}`} type="range" min={min} max={max} step={step} value={lo} onChange={(e) => onChange([Math.min(+e.target.value, hi - step), hi])} className={thumb} />
        <input aria-label={`Najviše ${unit}`} type="range" min={min} max={max} step={step} value={hi} onChange={(e) => onChange([lo, Math.max(+e.target.value, lo + step)])} className={thumb} />
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {presets.map((p) => {
          const on = lo === p.from && hi === p.to;
          return (
            <button
              key={p.label}
              type="button"
              onClick={() => onChange(on ? [min, max] : [p.from, p.to])}
              aria-pressed={on}
              className={`rounded-full px-3 py-1 text-[12px] transition-colors ${on ? "bg-[#18191b] text-white" : "bg-canvas text-ink/80 hover:bg-line"}`}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** kartica sa filterima (bočna kolona na desktopu) */
export function FilterCard({ active, onClear, children }: { active: number; onClear: () => void; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[12px] bg-paper ring-1 ring-line">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3.5">
        <p className="flex items-center gap-2 text-[14px] font-medium">
          <SlidersHorizontal className="size-4 text-[#e02a33]" strokeWidth={1.8} aria-hidden />
          Filteri
        </p>
        {active > 0 && (
          <button type="button" onClick={onClear} className="text-[12px] text-mist underline-offset-4 transition-colors hover:text-ink hover:underline">
            Obriši sve
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

/** tamna kartica ispod filtera: pomoć oko izbora */
export function HelpCard({ title, eyebrow = "Niste sigurni?", phone }: { title: string; eyebrow?: string; phone?: string }) {
  const { contact } = useSite();
  const ph = phone || contact.phone;
  return (
    <div className="mt-4 rounded-[12px] bg-[#18191b] p-5 text-white">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#e02a33]">{eyebrow}</p>
      <p className="mt-2 text-[16px] font-medium leading-snug">{title}</p>
      <Link href="/kontakt#poruka" className="group mt-4 flex h-10 items-center justify-between rounded-full bg-[#e02a33] pl-4 pr-1 text-[13px] font-medium transition-colors hover:bg-[#c41f27]">
        Pišite nam
        <span className="grid size-8 place-items-center rounded-full bg-white text-[#e02a33]">
          <ArrowRight className="h-2.5 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
        </span>
      </Link>
      {ph && (
        <a href={tel(ph)} className="mt-2 flex h-10 items-center justify-center gap-2 rounded-full border border-white/15 text-[13px] transition-colors hover:border-white/40">
          <Phone className="size-3.5" strokeWidth={1.8} aria-hidden />
          {ph}
        </a>
      )}
    </div>
  );
}

/* ── zaglavlje liste: naslov levo; desno broj, pretraga i sortiranje (desktop). Telefon: lepljiva traka
      sa „Filteri" i sortiranjem, pretraga ispod. Uključeni filteri kao pilule u svom redu, iznad obe kolone,
      pa kartice uvek počinju u visini kartice sa filterima. ── */

export type Chip = { k: string; label: string; off: () => void };

function SortControl({ sort, sorts, onSort, className = "" }: { sort: string; sorts: SelectOption[]; onSort: (v: string) => void; className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="hidden whitespace-nowrap text-[13px] text-mist sm:inline">Sortiraj</span>
      <Select label="Sortiraj" value={sort} onChange={onSort} options={sorts} className="w-[190px] [&>button]:h-11 [&>button]:bg-paper [&>button]:text-[14px]" />
    </div>
  );
}

export function ListBar({
  eyebrow,
  title,
  count,
  noun,
  note,
  sort,
  sorts,
  onSort,
  chips,
  onClear,
  onOpenFilters,
  search,
}: {
  eyebrow: string;
  title: string;
  count: number;
  noun: string;
  /** dopuna uz broj („cena na upit", „cene u RSD") */
  note: string;
  sort: string;
  sorts: SelectOption[];
  onSort: (v: string) => void;
  chips: Chip[];
  onClear: () => void;
  onOpenFilters: () => void;
  /** polje za pretragu (prodavnica) */
  search?: React.ReactNode;
}) {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div>
          <p className="text-[12px] uppercase tracking-[0.18em] text-mist">{eyebrow}</p>
          <h2 className="mt-2 text-[30px] font-medium leading-[1.05] md:text-[38px]">
            {title}
            <span className="text-[#e02a33]">.</span>
          </h2>
          <p className="mt-2 text-[13px] text-mist lg:hidden">
            <span className="font-medium tabular-nums text-ink">{count}</span> {noun} · {note}
          </p>
        </div>
        <div className="hidden min-w-0 items-center gap-5 lg:flex">
          <p className="whitespace-nowrap text-[14px] text-mist">
            <span className="font-medium tabular-nums text-ink">{count}</span> {noun} · {note}
          </p>
          {search && <div className="w-[300px] xl:w-[380px]">{search}</div>}
          <SortControl sort={sort} sorts={sorts} onSort={onSort} />
        </div>
      </div>

      {/* telefon: lepljiva traka */}
      <div className="sticky top-20 z-20 -mx-4 mt-5 bg-canvas/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={onOpenFilters} className="inline-flex h-11 items-center gap-2 rounded-full bg-[#18191b] px-5 text-[13px] font-medium text-white">
            <SlidersHorizontal className="size-4" strokeWidth={1.8} aria-hidden />
            Filteri
            {chips.length > 0 && <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#e02a33] px-1.5 text-[10px] tabular-nums">{chips.length}</span>}
          </button>
          <SortControl sort={sort} sorts={sorts} onSort={onSort} />
        </div>
        {search && <div className="mt-3">{search}</div>}
      </div>

      {chips.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 lg:mt-6">
          {chips.map((c) => (
            <button
              key={c.k}
              type="button"
              onClick={c.off}
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-paper py-1.5 pl-3.5 pr-2 text-[13px] ring-1 ring-line transition-colors hover:ring-ink/30"
            >
              {c.label}
              <span className="grid size-5 place-items-center rounded-full bg-canvas text-mist">
                <X className="size-3" strokeWidth={2} aria-hidden />
              </span>
            </button>
          ))}
          <button type="button" onClick={onClear} className="px-2 text-[13px] text-mist transition-colors hover:text-[#e02a33]">
            Obriši sve
          </button>
        </div>
      )}
    </>
  );
}

/* ── prazno stanje ── */

export function Empty({ text, onClear, hint = "Uklonite neki od filtera ili nas pozovite, pomoći ćemo da nađete pravo rešenje.", clearLabel = "Obriši filtere" }: { text: string; onClear: () => void; hint?: string; clearLabel?: string }) {
  return (
    <div className="flex flex-col items-center rounded-[12px] bg-paper px-6 py-14 text-center ring-1 ring-line md:py-20">
      <span className="grid size-16 place-items-center rounded-full bg-[#e02a33]/10 text-[#e02a33]">
        <SearchX className="size-7" strokeWidth={1.5} aria-hidden />
      </span>
      <p className="mt-5 text-[20px] font-medium tracking-[-0.01em]">{text}</p>
      <p className="mt-2 max-w-sm text-[14px] text-mist">{hint}</p>
      <button type="button" onClick={onClear} className="mt-6 inline-flex h-11 items-center rounded-full bg-[#e02a33] px-6 text-[14px] font-medium text-white transition-colors hover:bg-[#c41f27]">
        {clearLabel}
      </button>
    </div>
  );
}

/* ── panel filtera na telefonu ── */

export function FilterSheet({ open, onClose, active, onClear, resultLabel, children }: { open: boolean; onClose: () => void; active: number; onClear: () => void; resultLabel: string; children: React.ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div className={`fixed inset-0 z-[60] lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div onClick={onClose} className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Filteri"
        data-lenis-prevent
        className={`absolute inset-x-0 bottom-0 flex max-h-[88dvh] flex-col rounded-t-[16px] bg-paper transition-transform duration-300 ease-[var(--ease-expo)] ${open ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <p className="flex items-center gap-2 text-[17px] font-medium">
            <SlidersHorizontal className="size-4 text-[#e02a33]" strokeWidth={1.8} aria-hidden />
            Filteri
          </p>
          <div className="flex items-center gap-3">
            {active > 0 && (
              <button type="button" onClick={onClear} className="text-[13px] text-mist">
                Obriši sve
              </button>
            )}
            <button type="button" onClick={onClose} aria-label="Zatvori" className="grid size-9 place-items-center rounded-full bg-canvas">
              <X className="size-4" strokeWidth={1.8} aria-hidden />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
        <div className="border-t border-line p-4">
          <button type="button" onClick={onClose} className="group flex h-12 w-full items-center justify-between rounded-full bg-[#e02a33] pl-6 pr-1.5 text-[14px] font-medium text-white">
            {resultLabel}
            <span className="grid size-9 place-items-center rounded-full bg-white text-[#e02a33]">
              <ArrowRight className="h-3 w-3.5" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── poziv na kraju (kao na strani Akcije) ── */

export function CatalogCta({ eyebrow, title }: { eyebrow: string; title: string }) {
  const { contact } = useSite();
  const boxes = [
    contact.phone && { label: "Traktori i mašine", phone: contact.phone },
    contact.phoneParts && contact.phoneParts !== contact.phone && { label: "Rezervni delovi", phone: contact.phoneParts },
  ].filter(Boolean) as { label: string; phone: string }[];
  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-9 md:pb-24">
      <div className="grid overflow-hidden rounded-[12px] bg-[#18191b] text-white md:grid-cols-[1.3fr_1fr]">
        <div className="p-6 md:p-10">
          <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#e02a33]">{eyebrow}</p>
          <h2 className="mt-3 max-w-lg text-[24px] font-medium leading-[1.1] md:text-[32px]">{title}</h2>
        </div>
        <div className="flex flex-col justify-center gap-3 border-t border-white/10 p-6 md:border-l md:border-t-0 md:p-8">
          {boxes.map((b) => (
            <a key={b.label} href={tel(b.phone)} className="flex items-center justify-between gap-4 rounded-[8px] bg-white/[0.06] p-4 transition-colors hover:bg-white/10 md:p-5">
              <span>
                <span className="block text-[11px] uppercase tracking-[0.16em] text-white/50">{b.label}</span>
                <span className="mt-1 block text-[20px] font-medium md:text-[22px]">{b.phone}</span>
              </span>
              <Phone className="size-5 shrink-0 text-white/70" strokeWidth={1.6} aria-hidden />
            </a>
          ))}
          <Link href="/kontakt#poruka" className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 text-[15px] transition-colors hover:border-white hover:bg-white hover:text-ink">
            Pošaljite upit <ArrowRight className="h-3 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

