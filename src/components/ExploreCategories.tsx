"use client";

import Link from "next/link";
import Reveal from "./Reveal";
import { ArrowRight } from "./graphics";
import { t } from "./copy";
import type { NavItem } from "@/lib/catalog";

type Cat = (typeof t.explore.cats)[number];

/** Brojevi i prečice iz kataloga (GET /shop/catalog); bez njih važe tekstovi iz copy.ts */
export type ExploreData = {
  tractorBrands: NavItem[];
  machineCategories: NavItem[];
  partsCount: number;
  atvCount: number;
};

/* Bento mreža ponude: Traktori veliki blok levo (2 reda), desno Priključne mašine preko cele širine,
 * ispod Online prodavnica i Benda ATV. Svi blokovi imaju isti raspored:
 *   gore - staklena pilula sa brojem (iz kataloga) i okrugla strelica koja na hover postaje crvena
 *   dole - naslov, opis i (traktori, mašine) prečice: brendovi / najtraženije kategorije
 * Ceo blok je link (link naslova se širi preko bloka); prečice su posebni linkovi iznad njega. */
const LAYOUT: Record<string, string> = {
  traktori: "col-span-2 md:row-span-2 min-h-[380px] md:min-h-0",
  masine: "col-span-2 min-h-[240px] md:min-h-[280px]",
  prodavnica: "min-h-[220px] md:min-h-[280px]",
  atv: "min-h-[220px] md:min-h-[280px]",
};

const plural = (n: number, one: string, few: string, many: string) => {
  const last = n % 10;
  const teen = n % 100 >= 11 && n % 100 <= 14;
  return `${n} ${last === 1 && !teen ? one : last >= 2 && last <= 4 && !teen ? few : many}`;
};

type Chip = { label: string; href: string };

function Tile({ cat, delay, count, chips }: { cat: Cat; delay: number; count: string; chips: Chip[] }) {
  const big = cat.key === "traktori";
  return (
    <Reveal delay={delay} className={`${LAYOUT[cat.key]} h-full`}>
      <article className="group relative isolate flex h-full min-h-[inherit] flex-col justify-between overflow-hidden rounded-[12px] bg-[#18191b] p-4 text-white md:p-6">
        {/* eslint-disable-next-line @next/next/no-img-element -- fotografija iz public */}
        <img
          src={cat.img}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-brand)] group-hover:scale-[1.05]"
        />
        {/* jači prelaz samo pri dnu, gde je tekst; blag pri vrhu za pilule - slika ostaje svetla */}
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/85 via-black/15 via-55% to-black/25" />

        {/* gore */}
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full border border-white/20 bg-black/25 px-3 py-1 text-[11px] font-medium backdrop-blur-md md:text-[12px]">{count}</span>
          <span
            aria-hidden
            className="grid size-10 shrink-0 place-items-center rounded-full border border-white/25 bg-black/20 backdrop-blur-md transition-colors duration-300 group-hover:border-[#e02a33] group-hover:bg-[#e02a33] md:size-11"
          >
            <ArrowRight className="h-3 w-3.5 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
          </span>
        </div>

        {/* dole */}
        <div className="max-w-lg">
          <h3 className={`font-medium leading-[1.02] tracking-[-0.02em] ${big ? "text-[32px] md:text-[44px]" : "text-[20px] md:text-[26px]"}`}>
            <Link href={cat.href} className="after:absolute after:inset-0 after:z-0 focus-visible:outline-none">
              {cat.title}
            </Link>
          </h3>
          <p className={`mt-2 leading-snug text-white/75 ${big ? "text-[14px] md:text-[15px]" : "line-clamp-2 text-[13px]"}`}>{cat.sub}</p>

          {chips.length > 0 && (
            <ul className="relative z-10 mt-4 flex flex-wrap gap-1.5 md:mt-5">
              {chips.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="inline-flex h-8 items-center rounded-full border border-white/20 bg-white/10 px-3 text-[12px] backdrop-blur-md transition-colors duration-200 hover:border-white hover:bg-white hover:text-ink md:h-9 md:px-3.5 md:text-[13px]"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>
    </Reveal>
  );
}

export default function ExploreCategories({ data }: { data?: ExploreData }) {
  const tractorTotal = data?.tractorBrands.reduce((n, b) => n + b.count, 0) ?? 0;
  const counts: Record<string, string> = {
    traktori: tractorTotal ? plural(tractorTotal, "model", "modela", "modela") : "",
    masine: data?.machineCategories.length ? plural(data.machineCategories.length, "kategorija", "kategorije", "kategorija") : "",
    prodavnica: data?.partsCount ? `${data.partsCount} ${data.partsCount % 10 === 1 && data.partsCount % 100 !== 11 ? "deo" : "delova"}` : "",
    atv: data?.atvCount ? plural(data.atvCount, "model", "modela", "modela") : "",
  };
  const chips: Record<string, Chip[]> = {
    traktori: (data?.tractorBrands ?? []).map((b) => ({ label: b.name, href: `/traktori/${b.slug}` })),
    // najtraženije: kategorije sa najviše artikala
    masine: [...(data?.machineCategories ?? [])]
      .sort((a, b) => b.count - a.count)
      .slice(0, 4)
      .map((c) => ({ label: c.name, href: `/prikljucne-masine/${c.slug}` })),
  };

  return (
    <section id="ponuda" className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-9 md:pb-24">
      <Reveal>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33]">{t.explore.eyebrow}</p>
            <h2 className="mt-3 text-[30px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[38px]">{t.explore.heading}</h2>
          </div>
          <p className="max-w-sm text-[14px] leading-relaxed text-mist md:text-right">{t.explore.sub}</p>
        </div>
      </Reveal>
      <div className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:h-[660px] md:grid-cols-4 md:grid-rows-2 md:gap-5">
        {t.explore.cats.map((cat, i) => (
          <Tile key={cat.key} cat={cat} delay={i * 100} count={counts[cat.key] || cat.count} chips={chips[cat.key] ?? []} />
        ))}
      </div>
    </section>
  );
}
