"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import { ArrowLeft, ArrowRight } from "./graphics";
import { t } from "./copy";
import catalog from "@/data/machines-catalog.json";

/**
 * Katalog priključnih mašina po nameni: tabovi (Ratarstvo, Stočarstvo, Voćarstvo, Transport)
 * i karusel kartica - slika na belom, kategorija, logo, naziv, tri ključne vrednosti, „Pogledaj mašinu".
 * Isti vizuelni jezik kao kartice ponuda (OfferCard): zaobljenje 12px, cela kartica je link, crvena strelica na hover.
 */
export default function MachinesShowcase({ categoriesCount }: { categoriesCount?: number }) {
  const [active, setActive] = useState(catalog[0].key);
  const group = catalog.find((g) => g.key === active) ?? catalog[0];
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  // traka napretka: koliko je liste vidljivo i dokle je pomerena (0-1)
  const [bar, setBar] = useState({ size: 1, pos: 0 });

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
    setBar({ size: el.scrollWidth ? el.clientWidth / el.scrollWidth : 1, pos: max > 0 ? el.scrollLeft / max : 0 });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: 0 }); // svaki tab kreće od prve mašine
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [active, update]);

  const step = (dir: 1 | -1) => {
    const el = trackRef.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + gap), behavior: "smooth" });
  };

  const arrow =
    "grid size-11 place-items-center rounded-full border border-line bg-paper text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-35";

  return (
    <section id="masine" className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-9 md:pb-24">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33]">Katalog</p>
          <h2 className="mt-3 text-[30px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[38px]">{t.machines.heading}</h2>
        </Reveal>
        <Reveal delay={80}>
          <div className="flex items-center gap-4">
            {/* segmentirana kontrola za namenu */}
            <div role="tablist" aria-label="Namena" className="no-scrollbar -mx-4 flex min-w-0 overflow-x-auto px-4 lg:mx-0 lg:px-0">
              <div className="flex shrink-0 gap-1 rounded-full bg-canvas p-1 ring-1 ring-line">
                {catalog.map((g) => (
                  <button
                    key={g.key}
                    role="tab"
                    type="button"
                    aria-selected={g.key === active}
                    onClick={() => setActive(g.key)}
                    className={`flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-[14px] transition-colors duration-200 ${
                      g.key === active ? "bg-ink text-white shadow-[0_6px_16px_-8px_rgba(24,25,27,0.6)]" : "text-ink/70 hover:text-ink"
                    }`}
                  >
                    {g.label}
                    <span className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] tabular-nums ${g.key === active ? "bg-white/15" : "bg-paper text-mist"}`}>
                      {g.items.length}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            {group.items.length > 1 && (
              <div className="hidden shrink-0 gap-2 sm:flex">
                <button type="button" onClick={() => step(-1)} aria-label="Prethodne mašine" disabled={!canPrev} className={arrow}>
                  <ArrowLeft className="h-3 w-3.5" />
                </button>
                <button type="button" onClick={() => step(1)} aria-label="Sledeće mašine" disabled={!canNext} className={arrow}>
                  <ArrowRight className="h-3 w-3.5" />
                </button>
              </div>
            )}
          </div>
        </Reveal>
      </div>

      {/* karusel: 4 kartice na xl, 3 na lg, 2 na sm, 1 na telefonu.
          overflow-x-auto seče i po visini, pa traka ima prostor oko kartica (okvir, uglovi, senka na hover):
          sa strane 16px (telefon, koliko je i razmak strane) / 24px, dole 56px; senka se širi najviše 16px bočno i 40px nadole.
          Negativna margina poništava prostor da raspored strane ostane isti. Razmak između kartica (md: 32px) je veći
          od bočnog prostora (24px), pa sledeća kartica sa okvirom počinje 8px iza vidljivog dela i ne viri */}
      <div
        ref={trackRef}
        key={group.key}
        data-lenis-prevent-horizontal
        className="no-scrollbar -mx-4 -mb-14 mt-7 flex animate-[heroIn_.45s_ease-out_both] snap-x snap-mandatory scroll-px-4 gap-5 md:gap-8 overflow-x-auto overscroll-x-contain overscroll-y-auto! px-4 pb-14 pt-3 md:-mx-6 md:scroll-px-6 md:px-6"
      >
        {group.items.map((m) => (
          <article
            key={m.slug}
            className="group relative flex w-[84%] shrink-0 snap-start flex-col overflow-hidden rounded-[12px] bg-paper ring-1 ring-black/[0.07] transition-shadow duration-500 ease-[var(--ease-brand)] hover:shadow-[0_24px_40px_-24px_rgba(24,25,27,0.4)] sm:w-[calc((100%-20px)/2)] md:w-[calc((100%-32px)/2)] lg:w-[calc((100%-64px)/3)] xl:w-[calc((100%-96px)/4)]"
          >
            {/* slika na belom */}
            <div className="relative aspect-[4/3] overflow-hidden border-b border-line bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element -- slika iz public */}
              <img
                src={m.image}
                alt={m.name}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-contain p-7 transition-transform duration-700 ease-[var(--ease-brand)] group-hover:-translate-y-1 group-hover:scale-[1.04]"
              />
              <span className="absolute left-3 top-3 rounded-full bg-[#18191b] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white">
                {m.category}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <div className="flex h-6 items-center">
                {m.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- logo proizvođača iz public
                  <img src={m.logo} alt={m.brand} className="h-6 w-auto max-w-[110px] object-contain object-left" />
                ) : (
                  <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-mist">{m.brand}</span>
                )}
              </div>
              <h3 className="mt-3 text-[18px] font-medium leading-snug tracking-[-0.01em]">
                <Link href={m.href} className="after:absolute after:inset-0 focus-visible:outline-none">
                  {m.name}
                </Link>
              </h3>

              {m.specs.length > 0 && (
                <dl className={`mt-4 grid divide-x divide-line border-y border-line py-3 ${m.specs.length >= 3 ? "grid-cols-3" : m.specs.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
                  {m.specs.slice(0, 3).map((sp) => (
                    <div key={sp.label} className="flex min-w-0 flex-col-reverse justify-end px-3 first:pl-0 last:pr-0">
                      <dt className="mt-1 line-clamp-2 text-[11px] leading-tight text-mist">{sp.label}</dt>
                      <dd className="break-words text-[14px] font-medium leading-tight tabular-nums">{sp.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="mt-auto flex items-center justify-between pt-5">
                <span className="text-[14px] font-medium">Pogledaj mašinu</span>
                <span className="grid size-10 place-items-center rounded-full bg-ink text-white transition-colors duration-300 group-hover:bg-[#e02a33]">
                  <ArrowRight className="h-3 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* traka napretka karusela */}
      {bar.size < 1 && (
        <div className="relative mt-6 h-[2px] overflow-hidden rounded-full bg-line" aria-hidden>
          <span
            className="absolute inset-y-0 rounded-full bg-ink transition-[left] duration-200"
            style={{ width: `${bar.size * 100}%`, left: `${bar.pos * (1 - bar.size) * 100}%` }}
          />
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <Link
          href="/prikljucne-masine"
          className="group inline-flex h-12 items-center gap-3 rounded-full bg-ink pl-6 pr-1.5 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-[#e02a33]"
        >
          Sve priključne mašine
          {categoriesCount ? <span className="text-white/55 transition-colors group-hover:text-white/80">{categoriesCount} kategorija</span> : null}
          <span className="grid size-9 place-items-center rounded-full bg-white text-ink transition-colors duration-200 group-hover:text-[#e02a33]">
            <ArrowRight className="h-3 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>
    </section>
  );
}
