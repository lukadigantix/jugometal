"use client";

import Link from "next/link";
import Reveal from "./Reveal";
import { ArrowRight } from "./graphics";
import { t } from "./copy";

type Cat = (typeof t.explore.cats)[number];

/* Bento mreža ponude: Traktori veliki blok levo (2 reda), desno Priključne mašine preko cele širine,
 * ispod Online prodavnica i Benda ATV. Svaki blok: fotografija, zatamnjenje, broj, naslov, opis, strelica. */
const LAYOUT: Record<string, string> = {
  traktori: "col-span-2 md:row-span-2 min-h-[280px] md:min-h-0",
  masine: "col-span-2 min-h-[180px] md:min-h-[280px]",
  prodavnica: "min-h-[200px] md:min-h-[280px]",
  atv: "min-h-[200px] md:min-h-[280px]",
};

function Tile({ cat, delay }: { cat: Cat; delay: number }) {
  const big = cat.key === "traktori";
  return (
    <Reveal delay={delay} className={`${LAYOUT[cat.key]} h-full`}>
      <Link href={cat.href} className="group relative flex h-full min-h-[inherit] overflow-hidden rounded-[4px] bg-ink text-white">
        <img
          src={cat.img}
          alt={cat.title}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-brand)] group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-black/10" />
        <span className="absolute left-3 top-3 rounded-full bg-white/15 px-2.5 py-1 text-[11px] backdrop-blur md:left-6 md:top-6 md:px-3 md:text-[12px]">{cat.count}</span>
        <div className="relative mt-auto flex w-full items-end justify-between gap-3 p-4 md:gap-6 md:p-7">
          <div className="max-w-md">
            <h3 className={`font-medium leading-[1.05] ${big ? "text-[30px] md:text-[48px]" : "text-[18px] md:text-[28px]"}`}>{cat.title}</h3>
            <p className={`mt-2 text-white/80 ${big ? "text-[14px] md:text-[15px]" : "hidden text-[13px] md:block"}`}>{cat.sub}</p>
            {big && (
              <span className="mt-4 inline-block rounded-full bg-paper px-6 py-2 text-[13px] text-ink md:mt-5 md:px-7 md:py-2.5 md:text-[14px] transition-colors group-hover:bg-canvas">
                {cat.cta}
              </span>
            )}
          </div>
          {!big && (
            <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/50 md:flex transition-colors duration-200 group-hover:border-white group-hover:bg-white group-hover:text-ink">
              <ArrowRight className="h-3 w-4" />
            </span>
          )}
        </div>
      </Link>
    </Reveal>
  );
}

export default function ExploreCategories() {
  return (
    <section id="ponuda" className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-9 md:pb-24">
      <Reveal>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[12px] uppercase tracking-[0.18em] text-mist">{t.explore.eyebrow}</p>
            <h2 className="mt-2 text-[34px] font-medium md:text-[40px]">{t.explore.heading}</h2>
          </div>
          <p className="max-w-sm text-[14px] leading-relaxed text-mist md:text-right">{t.explore.sub}</p>
        </div>
      </Reveal>
      <div className="mt-8 grid grid-cols-2 gap-3 md:mt-10 md:h-[640px] md:grid-cols-4 md:grid-rows-2 md:gap-6">
        {t.explore.cats.map((cat, i) => (
          <Tile key={cat.key} cat={cat} delay={i * 100} />
        ))}
      </div>
    </section>
  );
}
