"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import { ArrowLeft, ArrowRight } from "./graphics";
import { t } from "./copy";
import products from "@/data/featured-products.json";

/**
 * Preporučeni proizvodi (traktori i priključne mašine) odmah ispod hero-a:
 * isti karusel kao za rezervne delove, kartica bez cene i korpe.
 */
export default function FeaturedProducts() {
  const trackRef = useRef<HTMLUListElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const step = (dir: 1 | -1) => {
    const el = trackRef.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + gap), behavior: "smooth" });
  };

  return (
    <section id="preporuceno" className="mx-auto w-full max-w-[1600px] px-4 pt-12 md:px-9 md:pt-24">
      <Reveal>
        <p className="text-[12px] uppercase tracking-[0.18em] text-mist">{t.featured.eyebrow}</p>
        <h2 className="mt-2 text-[34px] font-medium md:text-[40px]">{t.featured.heading}</h2>
      </Reveal>

      <Reveal delay={120}>
        <div className="relative mt-10">
          <ul
            ref={trackRef}
            data-lenis-prevent-horizontal
            className="no-scrollbar flex snap-x snap-mandatory flex-row gap-6 overflow-x-auto overscroll-x-contain overscroll-y-auto!"
          >
            {products.map((p) => (
              <li
                key={p.href + p.name}
                className="w-[84%] shrink-0 snap-start sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] xl:w-[calc((100%-72px)/4)]"
              >
                <div className="flex h-full flex-col overflow-hidden rounded-[4px] border border-line bg-paper">
                  {/* fotografije proizvođača su na beloj pozadini - bela pločica, bez isecanja */}
                  <Link href={p.href} aria-label={p.name} className="group relative block aspect-[4/3] bg-white">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-500 ease-[var(--ease-brand)] group-hover:scale-[1.04]"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    {/* red sa brendom: logo proizvođača (ako postoji) levo, kategorija desno */}
                    <div className="flex h-7 items-center justify-between gap-3">
                      {p.logo ? (
                        <img src={p.logo} alt="" aria-hidden className="h-7 w-auto max-w-[130px] object-contain object-left" />
                      ) : (
                        <span />
                      )}
                      <p className="text-[11px] uppercase tracking-[0.14em] text-mist">{p.category}</p>
                    </div>
                    <h3 className="mt-3 text-[18px] font-medium leading-snug">
                      <Link href={p.href} className="transition-colors duration-150 hover:text-mist">
                        {p.name}
                      </Link>
                    </h3>
                    <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-mist sm:line-clamp-3">{p.text}</p>
                    <div className="mt-auto pt-5">
                      <Link
                        href={p.href}
                        className="inline-block rounded-full bg-accent px-6 py-2.5 text-[14px] text-accent-contrast transition-colors duration-150 ease-[var(--ease-brand)] hover:bg-accent-soft"
                      >
                        {t.featured.view}
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <button
            onClick={() => step(-1)}
            aria-label="Prethodni proizvodi"
            disabled={!canPrev}
            className="absolute left-0 top-1/2 z-10 hidden h-12 w-12 sm:flex -translate-y-1/2 items-center justify-center bg-accent text-accent-contrast transition-opacity duration-150 hover:bg-accent-soft disabled:opacity-30"
          >
            <ArrowLeft />
          </button>
          <button
            onClick={() => step(1)}
            aria-label="Sledeći proizvodi"
            disabled={!canNext}
            className="absolute right-0 top-1/2 z-10 hidden h-12 w-12 sm:flex -translate-y-1/2 items-center justify-center bg-accent text-accent-contrast transition-opacity duration-150 hover:bg-accent-soft disabled:opacity-30"
          >
            <ArrowRight />
          </button>
        </div>
      </Reveal>
    </section>
  );
}
