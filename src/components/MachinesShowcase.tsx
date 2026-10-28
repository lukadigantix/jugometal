"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import { ArrowLeft, ArrowRight, Chevron } from "./graphics";
import { t } from "./copy";
import catalog from "@/data/machines-catalog.json";

/**
 * Katalog priključnih mašina po nameni: tabovi (Ratarstvo, Stočarstvo, Voćarstvo, Transport)
 * i mreža kartica - slika, logo proizvođača, kategorija, naziv, tri ključne karakteristike, dugme.
 * Isti stil kartica kao Benda ATV.
 */
export default function MachinesShowcase() {
  const [active, setActive] = useState(catalog[0].key);
  const group = catalog.find((g) => g.key === active) ?? catalog[0];
  const trackRef = useRef<HTMLDivElement | null>(null);
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

  return (
    <section id="masine" className="mx-auto w-full max-w-[1600px] px-4 py-12 md:px-9 md:py-24">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <Reveal>
          <p className="text-[12px] uppercase tracking-[0.18em] text-mist">Katalog</p>
          <h2 className="mt-2 text-[34px] font-medium md:text-[40px]">{t.machines.heading}</h2>
        </Reveal>
        <Reveal delay={80}>
          <div role="tablist" aria-label="Namena" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:px-0">
            {catalog.map((g) => (
              <button
                key={g.key}
                role="tab"
                type="button"
                aria-selected={g.key === active}
                onClick={() => setActive(g.key)}
                className={`shrink-0 rounded-full border px-5 py-2 text-[14px] transition-colors duration-150 ${
                  g.key === active ? "border-accent bg-accent text-accent-contrast" : "border-line text-ink hover:border-ink"
                }`}
              >
                {g.label}
                <span className={`ml-2 text-[12px] ${g.key === active ? "opacity-60" : "text-mist"}`}>{g.items.length}</span>
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      {/* karusel: 4 kartice na xl, 3 na lg, 2 na sm, 1 na telefonu; strelice na ivicama */}
      <div className="relative mt-10">
      <div
        ref={trackRef}
        key={group.key}
        data-lenis-prevent-horizontal
        className="no-scrollbar flex animate-[heroIn_.45s_ease-out_both] snap-x snap-mandatory gap-6 overflow-x-auto overscroll-x-contain overscroll-y-auto!"
      >
        {group.items.map((m) => (
          <div key={m.slug} className="flex w-[84%] shrink-0 snap-start flex-col overflow-hidden rounded-[4px] border border-line bg-paper sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] xl:w-[calc((100%-72px)/4)]">
            <Link href={m.href} aria-label={m.name} className="group relative block aspect-[4/3] bg-white">
              <img
                src={m.image}
                alt={m.name}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-500 ease-[var(--ease-brand)] group-hover:scale-[1.04]"
              />
            </Link>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex h-7 items-center justify-between gap-3">
                {m.logo ? (
                  <img src={m.logo} alt={m.brand} className="h-7 w-auto max-w-[120px] object-contain object-left" />
                ) : (
                  <span className="text-[12px] uppercase tracking-[0.14em] text-mist">{m.brand}</span>
                )}
                <span className="text-[11px] uppercase tracking-[0.14em] text-mist">{m.category}</span>
              </div>
              <h3 className="mt-3 text-[18px] font-medium leading-snug">
                <Link href={m.href} className="transition-colors duration-150 hover:text-mist">{m.name}</Link>
              </h3>
              <dl className="mt-3 space-y-1 text-[13px]">
                {m.specs.map((s) => (
                  <div key={s.label} className="flex justify-between gap-3 border-b border-line pb-1">
                    <dt className="text-mist">{s.label}</dt>
                    <dd className="text-right">{s.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-auto pt-5">
                <Link
                  href={m.href}
                  className="inline-block rounded-full bg-accent px-6 py-2.5 text-[14px] text-accent-contrast transition-colors duration-150 ease-[var(--ease-brand)] hover:bg-accent-soft"
                >
                  Pogledaj mašinu
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

        {group.items.length > 1 && (
          <>
            <button
              onClick={() => step(-1)}
              aria-label="Prethodne mašine"
              disabled={!canPrev}
              className="absolute left-0 top-[30%] z-10 hidden h-12 w-12 sm:flex -translate-y-1/2 items-center justify-center bg-accent text-accent-contrast transition-opacity duration-150 hover:bg-accent-soft disabled:opacity-30"
            >
              <ArrowLeft />
            </button>
            <button
              onClick={() => step(1)}
              aria-label="Sledeće mašine"
              disabled={!canNext}
              className="absolute right-0 top-[30%] z-10 hidden h-12 w-12 sm:flex -translate-y-1/2 items-center justify-center bg-accent text-accent-contrast transition-opacity duration-150 hover:bg-accent-soft disabled:opacity-30"
            >
              <ArrowRight />
            </button>
          </>
        )}
      </div>

      <div className="mt-10 flex justify-center">
        <Link
          href="/prikljucne-masine"
          className="group inline-flex items-center gap-1 border border-accent px-12 py-3 text-[14px] font-medium transition-colors duration-150 ease-[var(--ease-brand)] hover:bg-accent hover:text-accent-contrast"
        >
          Sve priključne mašine (15 kategorija)
          <Chevron className="h-2.5 w-2.5" />
        </Link>
      </div>
    </section>
  );
}
