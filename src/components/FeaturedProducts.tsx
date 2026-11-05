"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import { ArrowLeft, ArrowRight } from "./graphics";
import { t } from "./copy";
import products from "@/data/featured-products.json";
import { useMediaMap } from "@/lib/media-context";

/**
 * Preporučeni proizvodi (traktori i priključne mašine) odmah ispod hero-a.
 * Zaglavlje: naslov levo, filter po vrsti (Sve / Traktori / Priključne mašine) i strelice desno.
 * Kartice u istom jeziku kao karusel mašina: vrsta na slici, logo, naziv, opis, „Pogledaj proizvod" sa strelicom;
 * cela kartica je link. Ispod traka napretka.
 */

type Product = (typeof products)[number];

const FILTERS = [
  { key: "", label: "Sve" },
  { key: "Traktor", label: "Traktori" },
  { key: "Priključna mašina", label: "Priključne mašine" },
];

/** first: sekcija odmah ispod hera dobija i gornji razmak (ostale sekcije imaju samo donji) */
export default function FeaturedProducts({ first = false }: { first?: boolean }) {
  const media = useMediaMap(); // slike iz admina
  const [filter, setFilter] = useState("");
  const list: Product[] = filter ? products.filter((p) => p.category === filter) : products;
  const trackRef = useRef<HTMLUListElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
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
    el.scrollTo({ left: 0 }); // svaki filter kreće od prvog proizvoda
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [filter, update]);

  const step = (dir: 1 | -1) => {
    const el = trackRef.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + gap), behavior: "smooth" });
  };

  const arrow =
    "grid size-11 place-items-center rounded-full border border-line bg-paper text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-35";

  return (
    <section id="preporuceno" className={`mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-9 md:pb-24 ${first ? "pt-14 md:pt-24" : ""}`}>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33]">{t.featured.eyebrow}</p>
          <h2 className="mt-3 text-[30px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[38px]">
            {t.featured.heading}
            <span className="text-[#e02a33]">.</span>
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <div className="flex items-center gap-4">
            <div role="tablist" aria-label="Vrsta proizvoda" className="no-scrollbar -mx-4 flex min-w-0 overflow-x-auto px-4 lg:mx-0 lg:px-0">
              <div className="flex shrink-0 gap-1 rounded-full bg-canvas p-1 ring-1 ring-line">
                {FILTERS.map((f) => {
                  const count = f.key ? products.filter((p) => p.category === f.key).length : products.length;
                  const on = filter === f.key;
                  return (
                    <button
                      key={f.label}
                      role="tab"
                      type="button"
                      aria-selected={on}
                      onClick={() => setFilter(f.key)}
                      className={`flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-[14px] transition-colors duration-200 ${
                        on ? "bg-ink text-white shadow-[0_6px_16px_-8px_rgba(24,25,27,0.6)]" : "text-ink/70 hover:text-ink"
                      }`}
                    >
                      {f.label}
                      <span className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] tabular-nums ${on ? "bg-white/15" : "bg-paper text-mist"}`}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="hidden shrink-0 gap-2 sm:flex">
              <button type="button" onClick={() => step(-1)} aria-label="Prethodni proizvodi" disabled={!canPrev} className={arrow}>
                <ArrowLeft className="h-3 w-3.5" />
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Sledeći proizvodi" disabled={!canNext} className={arrow}>
                <ArrowRight className="h-3 w-3.5" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={120}>
        {/* traka ima prostor oko kartica za okvir i senku (overflow seče i po visini); razmak između kartica (md: 32px)
            veći je od bočnog prostora (24px), pa sledeća kartica ne viri */}
        <ul
          ref={trackRef}
          key={filter}
          data-lenis-prevent-horizontal
          className="no-scrollbar -mx-4 -mb-14 mt-7 flex animate-[heroIn_.45s_ease-out_both] snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto overscroll-x-contain overscroll-y-auto! px-4 pb-14 pt-3 md:-mx-6 md:scroll-px-6 md:gap-8 md:px-6"
        >
          {list.map((p) => (
            <li
              key={p.href + p.name}
              className="w-[84%] shrink-0 snap-start sm:w-[calc((100%-20px)/2)] md:w-[calc((100%-32px)/2)] lg:w-[calc((100%-64px)/3)] xl:w-[calc((100%-96px)/4)]"
            >
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[12px] bg-paper ring-1 ring-black/[0.07] transition-shadow duration-500 ease-[var(--ease-brand)] hover:shadow-[0_24px_40px_-24px_rgba(24,25,27,0.4)]">
                <div className="relative aspect-[4/3] overflow-hidden border-b border-line bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element -- slika iz public */}
                  <img
                    src={media[p.href]?.[0] ?? p.image}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-contain p-7 transition-transform duration-700 ease-[var(--ease-brand)] group-hover:-translate-y-1 group-hover:scale-[1.04]"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-[#18191b] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-white">
                    {p.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex h-7 items-center">
                    {p.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element -- logo proizvođača
                      <img src={p.logo} alt="" aria-hidden className="h-7 w-auto max-w-[130px] object-contain object-left" />
                    ) : null}
                  </div>
                  <h3 className="mt-3 text-[18px] font-medium leading-snug tracking-[-0.01em]">
                    <Link href={p.href} className="after:absolute after:inset-0 focus-visible:outline-none">
                      {p.name}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-mist">{p.text}</p>

                  <div className="mt-auto pt-5">
                    <div className="flex items-center justify-between border-t border-line pt-4">
                      <span className="text-[14px] font-medium">{t.featured.view}</span>
                      <span className="grid size-10 place-items-center rounded-full bg-ink text-white transition-colors duration-300 group-hover:bg-[#e02a33]">
                        <ArrowRight className="h-3 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>

        {bar.size < 1 && (
          <div className="relative mt-6 h-[2px] overflow-hidden rounded-full bg-line" aria-hidden>
            <span className="absolute inset-y-0 rounded-full bg-ink transition-[left] duration-200" style={{ width: `${bar.size * 100}%`, left: `${bar.pos * (1 - bar.size) * 100}%` }} />
          </div>
        )}
      </Reveal>
    </section>
  );
}
