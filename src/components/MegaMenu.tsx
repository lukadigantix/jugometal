"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "./graphics";
import type { MenuEntry, MenuPromo, MenuTile } from "./nav-data";

/*
  Mega-meni kao „izložbeni salon":
  - levo: numerisani indeks stavki (brend / namena / grupa); aktivna ima crvenu oznaku i strelicu
  - sredina (traktori, mašine): scena - izabrani model krupno na svetloj podlozi, iza njega ogromno ime stavke
    kao vodeni žig, dole naziv i podaci sa dugmetom; ispod filmska traka sa svim modelima (hover menja scenu)
  - sredina (delovi): mreža logoa brendova
  - desno: istaknuta kartica
  Scena i traka imaju stalnu visinu, pa meni nikad ne menja visinu pri prelasku mišem.
*/
/* širina i bočni razmak isti kao sadržaj headera (max-w-[1900px], px-4 / md:px-9), pa su meni i navigacija poravnati */
export default function MegaMenu({ entries, promo, allLabel, allHref, kind }: { entries: MenuEntry[]; promo: MenuPromo; allLabel: string; allHref: string; kind: "models" | "photos" | "logos" }) {
  const [active, setActive] = useState(entries[0]?.key);
  const [pick, setPick] = useState(0);
  const entry = entries.find((e) => e.key === active) ?? entries[0];
  const choose = (key: string) => {
    if (key === active) return;
    setActive(key);
    setPick(0);
  };

  return (
    <div className="mx-auto grid w-full max-w-[1900px] grid-cols-[250px_minmax(0,1fr)_300px] gap-8 px-4 py-8 md:px-9 2xl:grid-cols-[290px_minmax(0,1fr)_360px] 2xl:gap-10">
      {/* levo: indeks */}
      <div className="flex flex-col">
        <ol className="flex flex-col">
          {entries.map((e, i) => {
            const on = e.key === entry.key;
            return (
              <li key={e.key}>
                <Link
                  href={e.href}
                  onMouseEnter={() => choose(e.key)}
                  onFocus={() => choose(e.key)}
                  className={`group relative flex items-center gap-4 border-b border-line py-3 pl-4 pr-1 transition-colors duration-200 ${on ? "text-ink" : "text-ink/50 hover:text-ink"}`}
                >
                  <span aria-hidden className={`absolute left-0 top-1/2 h-7 w-[3px] -translate-y-1/2 rounded-full bg-[#e02a33] transition-all duration-300 ${on ? "opacity-100" : "scale-y-0 opacity-0"}`} />
                  <span className="w-5 shrink-0 text-[11px] tabular-nums text-mist">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[16px] leading-tight">{e.label}</span>
                    <span className="mt-0.5 block text-[12px] text-mist">{e.meta}</span>
                  </span>
                  <span
                    aria-hidden
                    className={`grid size-7 shrink-0 place-items-center rounded-full transition-all duration-300 ${on ? "bg-ink text-white opacity-100" : "-translate-x-1 opacity-0"}`}
                  >
                    <ArrowRight className="h-2.5 w-3" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
        <Link href={allHref} className="group mt-auto inline-flex items-center gap-2 pl-4 pt-6 text-[13px] font-medium text-ink">
          {allLabel}
          <ArrowRight className="h-2.5 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* sredina */}
      {kind === "logos" ? <LogoGrid entries={entries} entry={entry} /> : <Showroom entry={entry} pick={pick} setPick={setPick} />}

      {/* desno: istaknuta kartica */}
      <Link href={promo.href} className="group relative isolate flex min-h-[360px] flex-col justify-end overflow-hidden rounded-[16px] bg-[#18191b] p-6 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element -- fotografija iz public */}
        <img src={promo.img} alt="" loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-75 transition-transform duration-[1200ms] ease-[var(--ease-brand)] group-hover:scale-[1.05]" />
        <span className="absolute inset-0 -z-10 bg-linear-to-t from-black/90 via-black/35 to-black/5" />
        <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#e02a33]">{promo.eyebrow}</span>
        <span className="mt-2 block text-[21px] font-medium leading-tight tracking-[-0.01em]">{promo.title}</span>
        <span className="mt-2 block text-[13px] leading-relaxed text-white/70">{promo.text}</span>
        <span className="mt-5 inline-flex h-10 w-fit items-center gap-2.5 rounded-full bg-[#e02a33] pl-4 pr-1 text-[13px] font-medium text-white transition-colors group-hover:bg-[#c41f27]">
          {promo.cta}
          <span className="grid size-8 place-items-center rounded-full bg-white text-[#e02a33]">
            <ArrowRight className="h-2.5 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </span>
      </Link>
    </div>
  );
}

/** Scena: izabrani model krupno + vodeni žig sa imenom stavke + filmska traka sa svim modelima (stalna visina) */
function Showroom({ entry, pick, setPick }: { entry: MenuEntry; pick: number; setPick: (i: number) => void }) {
  const tiles = entry.tiles.filter((t) => !t.soon);
  const current: MenuTile | undefined = tiles[Math.min(pick, tiles.length - 1)];

  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-[16px] bg-canvas ring-1 ring-line">
      {/* zaglavlje */}
      <div className="flex items-center justify-between gap-4 px-6 pt-5">
        <div className="flex min-w-0 items-center gap-3">
          {entry.logo ? (
            // eslint-disable-next-line @next/next/no-img-element -- logo brenda
            <img src={entry.logo} alt={entry.label} className="h-6 w-auto object-contain" />
          ) : (
            <span className="truncate text-[18px] font-medium leading-none">{entry.label}</span>
          )}
          <span className="shrink-0 rounded-full bg-paper px-2.5 py-1 text-[11px] leading-none text-mist ring-1 ring-line">{entry.meta}</span>
        </div>
        <div className="flex shrink-0 items-center gap-5 text-[13px]">
          {entry.extra && (
            <Link href={entry.extra.href} className="text-mist transition-colors hover:text-ink">
              {entry.extra.label}
            </Link>
          )}
          <Link href={entry.href} className="group inline-flex items-center gap-1.5 font-medium text-ink">
            Otvori sve
            <ArrowRight className="h-2.5 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* scena */}
      <div className="relative mx-4 mt-4 h-[230px] overflow-hidden rounded-[12px] bg-white ring-1 ring-line 2xl:h-[250px]">
        {current?.img && (
          // eslint-disable-next-line @next/next/no-img-element -- slika modela
          <img
            key={current.href}
            src={current.img}
            alt={current.name}
            className="absolute inset-x-0 bottom-12 top-3 mx-auto h-[calc(100%-60px)] w-[70%] animate-[heroIn_.45s_ease-out_both] object-contain"
          />
        )}
        {current && (
          <div className="absolute inset-x-4 bottom-3 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[17px] font-medium leading-tight">{current.name}</p>
              {current.meta && <p className="mt-0.5 text-[12px] text-mist">{current.meta}</p>}
            </div>
            <Link
              href={current.href}
              className="group inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-[#e02a33] pl-4 pr-1 text-[12px] font-medium text-white transition-colors hover:bg-[#c41f27]"
            >
              Pogledaj
              <span className="grid size-7 place-items-center rounded-full bg-white text-[#e02a33]">
                <ArrowRight className="h-2.5 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
        )}
      </div>

      {/* filmska traka: samo onoliko sličica koliko celih staje u širinu (mreža auto-fill u jednom redu visine 72px,
          višak prelazi u nevidljive redove visine 0), a „Sve" je uvek na kraju. Hover menja scenu, klik vodi na model. */}
      <div className="flex gap-2 px-4 py-4">
        <ul className="grid h-[72px] min-w-0 flex-1 grid-cols-[repeat(auto-fill,minmax(96px,1fr))] grid-rows-[72px] auto-rows-[0px] gap-x-2 gap-y-0 overflow-hidden">
          {tiles.map((t, i) => {
            const on = current?.href === t.href;
            return (
              <li key={t.href} className="min-w-0">
                <Link
                  href={t.href}
                  onMouseEnter={() => setPick(i)}
                  onFocus={() => setPick(i)}
                  aria-label={t.name}
                  className={`relative block h-[72px] overflow-hidden rounded-[10px] bg-white transition-all duration-200 ${on ? "ring-2 ring-inset ring-ink" : "opacity-70 ring-1 ring-inset ring-line hover:opacity-100"}`}
                >
                  {t.img ? (
                    // eslint-disable-next-line @next/next/no-img-element -- slika modela
                    <img src={t.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-contain p-1.5" />
                  ) : (
                    <span className="grid h-full place-items-center px-2 text-center text-[11px] leading-tight">{t.name}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
        <Link
          href={entry.href}
          className="grid h-[72px] w-[84px] shrink-0 place-items-center rounded-[10px] border border-dashed border-mist/40 text-center text-[12px] text-ink transition-colors hover:border-ink"
        >
          <span>
            Sve
            <span className="block text-[11px] text-mist">{tiles.length}</span>
          </span>
        </Link>
      </div>
    </div>
  );
}

/** Delovi: mreža logoa brendova; sve stavke u istoj ćeliji (jedna preko druge), pa je visina uvek ista */
function LogoGrid({ entries, entry }: { entries: MenuEntry[]; entry: MenuEntry }) {
  return (
    <div className="grid min-w-0">
      {entries.map((e) => {
        const on = e.key === entry.key;
        const tiles = e.tiles.length > 9 ? e.tiles.slice(0, 8) : e.tiles;
        const rest = e.tiles.length - tiles.length;
        return (
          <div
            key={e.key}
            aria-hidden={!on}
            className={`col-start-1 row-start-1 flex min-w-0 flex-col rounded-[16px] bg-canvas p-5 ring-1 ring-line transition-opacity duration-300 ${on ? "opacity-100" : "pointer-events-none invisible opacity-0"}`}
          >
            <div className="mb-4 flex items-center justify-between gap-4 px-1">
              <div className="flex items-center gap-3">
                <span className="text-[18px] font-medium leading-none">{e.label}</span>
                <span className="rounded-full bg-paper px-2.5 py-1 text-[11px] leading-none text-mist ring-1 ring-line">{e.meta}</span>
              </div>
              <Link href={e.href} className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-ink">
                Otvori sve
                <ArrowRight className="h-2.5 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
            <ul className="grid grid-cols-3 gap-2.5">
              {tiles.map((t) =>
                t.soon ? (
                  <li key={t.href} className="flex h-[84px] flex-col justify-center rounded-[10px] border border-dashed border-line px-4">
                    <span className="text-[13px] text-mist">{t.name}</span>
                    <span className="mt-0.5 text-[11px] text-mist/70">uskoro</span>
                  </li>
                ) : (
                  <li key={t.href}>
                    <Link
                      href={t.href}
                      className="group relative grid h-[84px] place-items-center rounded-[10px] bg-paper px-4 ring-1 ring-line transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-18px_rgba(24,25,27,0.45)]"
                    >
                      {t.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element -- logo brenda
                        <img src={t.logo} alt={t.name} className="max-h-9 w-auto max-w-[120px] object-contain grayscale transition duration-300 group-hover:grayscale-0" />
                      ) : (
                        <span className="truncate text-[14px] font-medium">{t.name}</span>
                      )}
                      {t.meta && <span className="absolute bottom-1.5 right-2 text-[10px] tabular-nums text-mist">{t.meta}</span>}
                    </Link>
                  </li>
                ),
              )}
              {rest > 0 && (
                <li>
                  <Link href={e.href} className="grid h-[84px] place-items-center rounded-[10px] border border-dashed border-mist/40 text-center text-[13px] transition-colors hover:border-ink">
                    <span>
                      +{rest}
                      <span className="block text-[11px] text-mist">pogledaj sve</span>
                    </span>
                  </Link>
                </li>
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
