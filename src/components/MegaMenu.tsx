"use client";

import Link from "next/link";
import { useState } from "react";
import { Chevron } from "./graphics";
import type { MenuEntry, MenuPromo } from "./nav-data";

/* Mega-meni: levo spisak (brend / namena / grupa), u sredini sadržaj stavke na kojoj je miš, desno istaknuta kartica. */
export default function MegaMenu({ entries, promo, allLabel, allHref, kind }: { entries: MenuEntry[]; promo: MenuPromo; allLabel: string; allHref: string; kind: "models" | "photos" | "logos" }) {
  const [active, setActive] = useState(entries[0]?.key);
  const entry = entries.find((e) => e.key === active) ?? entries[0];
  const limit = kind === "models" ? 6 : 8;
  const tiles = entry.tiles.length > limit ? entry.tiles.slice(0, limit - 1) : entry.tiles;
  const rest = entry.tiles.length - tiles.length;

  return (
    <div className="mx-auto grid w-full max-w-[1500px] grid-cols-[250px_minmax(0,1fr)_300px] gap-8 px-9 py-8 2xl:grid-cols-[280px_minmax(0,1fr)_340px] 2xl:gap-10">
      {/* levo: spisak */}
      <div className="flex flex-col">
        <ul className="flex flex-col gap-1">
          {entries.map((e) => {
            const on = e.key === entry.key;
            return (
              <li key={e.key}>
                <Link
                  href={e.href}
                  onMouseEnter={() => setActive(e.key)}
                  onFocus={() => setActive(e.key)}
                  className={`group flex items-center gap-3 rounded-xl px-4 py-3 transition-colors duration-150 ${on ? "bg-ink text-white" : "text-ink hover:bg-canvas"}`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-[17px] leading-tight">{e.label}</span>
                    <span className={`mt-0.5 block text-[12px] ${on ? "text-white/60" : "text-mist"}`}>{e.meta}</span>
                  </span>
                  <Chevron className={`h-2.5 w-2.5 shrink-0 transition-all duration-200 ${on ? "translate-x-0 opacity-100" : "-translate-x-1 opacity-0 group-hover:opacity-60"}`} />
                </Link>
              </li>
            );
          })}
        </ul>
        <Link href={allHref} className="group mt-auto inline-flex items-center gap-1.5 px-4 pt-6 text-[14px] text-ink">
          <span className="underline decoration-line underline-offset-4 transition-colors group-hover:decoration-ink">{allLabel}</span>
          <Chevron className="h-2.5 w-2.5 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>
      </div>

      {/* sredina: sadržaj izabrane stavke */}
      <div key={entry.key} className="flex min-w-0 animate-[heroIn_.35s_ease-out_both] flex-col rounded-2xl bg-canvas p-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            {entry.logo ? <img src={entry.logo} alt={entry.label} className="h-7 w-auto object-contain" /> : <span className="text-[22px] leading-none text-ink">{entry.label}</span>}
            <span className="rounded-full border border-line bg-paper px-2.5 py-1 text-[11px] leading-none text-mist">{entry.meta}</span>
          </div>
          <div className="flex items-center gap-5 text-[13px]">
            {entry.extra && (
              <Link href={entry.extra.href} className="text-mist transition-colors hover:text-ink">
                {entry.extra.label}
              </Link>
            )}
            <Link href={entry.href} className="group inline-flex items-center gap-1 text-ink">
              Otvori sve
              <Chevron className="h-2.5 w-2.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {kind === "models" && (
          <ul className="grid grid-cols-3 gap-3">
            {tiles.map((t) => (
              <li key={t.href}>
                <Link href={t.href} className="group flex h-full flex-col overflow-hidden rounded-xl bg-paper transition-shadow duration-200 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,.25)]">
                  <span className="relative block aspect-[16/10] bg-white">
                    <img src={t.img} alt={t.name} loading="lazy" className="absolute inset-0 h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04]" />
                  </span>
                  <span className="flex items-center justify-between gap-2 border-t border-line px-3.5 py-2.5">
                    <span className="truncate text-[14px] text-ink">{t.name}</span>
                    <span className="shrink-0 text-[12px] text-mist">{t.meta}</span>
                  </span>
                </Link>
              </li>
            ))}
            {rest > 0 && <MoreTile href={entry.href} rest={rest} />}
          </ul>
        )}

        {kind === "photos" && (
          <ul className="grid grid-cols-3 gap-3">
            {tiles.map((t) => (
              <li key={t.href}>
                <Link href={t.href} className="group flex h-full flex-col overflow-hidden rounded-xl bg-paper transition-shadow duration-200 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,.25)]">
                  <span className="relative block aspect-[16/10] overflow-hidden bg-white">
                    <img src={t.img} alt={t.name} loading="lazy" className="absolute inset-0 h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.05]" />
                  </span>
                  <span className="flex items-center justify-between gap-2 border-t border-line px-3.5 py-2.5">
                    <span className="truncate text-[14px] text-ink">{t.name}</span>
                    <span className="shrink-0 text-[12px] text-mist">{t.meta}</span>
                  </span>
                </Link>
              </li>
            ))}
            {rest > 0 && <MoreTile href={entry.href} rest={rest} />}
          </ul>
        )}

        {kind === "logos" && (
          <ul className="grid grid-cols-3 gap-3">
            {tiles.map((t) =>
              t.soon ? (
                <li key={t.href} className="flex h-[92px] flex-col justify-center rounded-xl border border-dashed border-line px-4">
                  <span className="text-[14px] text-mist">{t.name}</span>
                  <span className="mt-1 text-[11px] text-mist/70">uskoro</span>
                </li>
              ) : (
                <li key={t.href}>
                  <Link href={t.href} className="group flex h-[92px] items-center gap-3 rounded-xl bg-paper px-4 transition-shadow duration-200 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,.25)]">
                    <span className="min-w-0 flex-1">
                      {t.logo ? <img src={t.logo} alt={t.name} className="h-10 w-auto max-w-[130px] object-contain object-left" /> : <span className="block truncate text-[15px] text-ink">{t.name}</span>}
                      <span className="mt-2 block text-[12px] text-mist">{t.meta}</span>
                    </span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-colors duration-200 group-hover:border-ink group-hover:bg-ink group-hover:text-white">
                      <Chevron className="h-2.5 w-2.5" />
                    </span>
                  </Link>
                </li>
              ),
            )}
          </ul>
        )}
      </div>

      {/* desno: istaknuta kartica */}
      <Link href={promo.href} className="group relative flex min-h-[340px] flex-col overflow-hidden rounded-2xl bg-ink text-white">
        <img src={promo.img} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-[1.04]" />
        <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
        <span className="relative mt-auto p-6">
          <span className="text-[11px] uppercase tracking-[0.14em] text-white/70">{promo.eyebrow}</span>
          <span className="mt-2 block text-[22px] leading-tight">{promo.title}</span>
          <span className="mt-2 block text-[13px] leading-relaxed text-white/75">{promo.text}</span>
          <span className="mt-5 inline-flex rounded-full bg-white px-5 py-2.5 text-[13px] text-ink transition-colors group-hover:bg-canvas">{promo.cta}</span>
        </span>
      </Link>
    </div>
  );
}

function MoreTile({ href, rest }: { href: string; rest: number }) {
  return (
    <li>
      <Link href={href} className="flex h-full min-h-[120px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-mist/40 text-ink transition-colors hover:border-ink">
        <span className="text-[24px] leading-none">+{rest}</span>
        <span className="text-[12px] text-mist">pogledaj sve</span>
      </Link>
    </li>
  );
}
