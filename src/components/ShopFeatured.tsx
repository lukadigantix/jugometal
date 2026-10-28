"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AddToCart from "./AddToCart";
import Reveal from "./Reveal";
import { ArrowLeft, ArrowRight, Chevron } from "./graphics";
import { t } from "./copy";
import { featuredParts, formatRsd, searchIndex, shopBrands, totalParts } from "@/data/featured-parts";

/**
 * Online prodavnica na početnoj: pretraga po nazivu/šifri (uživo, nad svim delovima),
 * "Kupujte po brendu", karusel najtraženijih delova i traka poverenja.
 */

function Search() {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const results = useMemo(() => {
    const terms = q.toLocaleLowerCase("sr").split(/\s+/).filter((w) => w.length > 1);
    if (!terms.length) return [];
    return searchIndex.filter((p) => terms.every((w) => p.hay.includes(w))).slice(0, 6);
  }, [q]);

  return (
    <div className="relative w-full lg:max-w-[520px]">
      <label htmlFor="shop-search" className="sr-only">Pretraga delova</label>
      <div className="flex items-center gap-3 rounded-full border border-line bg-paper px-5 py-3.5 focus-within:border-ink">
        <svg viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-mist" aria-hidden>
          <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <input
          id="shop-search"
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={`Naziv ili šifra dela (${totalParts} delova)`}
          className="w-full bg-transparent text-[15px] placeholder:text-mist focus:outline-none"
          autoComplete="off"
        />
      </div>
      {open && q.trim().length > 1 && (
        <div className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-[4px] border border-line bg-paper shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
          {results.length ? (
            <ul className="divide-y divide-line">
              {results.map((r) => (
                <li key={r.id}>
                  <Link href={r.href} className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-canvas">
                    <span className="relative h-12 w-12 shrink-0 bg-white">
                      {r.image && <img src={r.image} alt="" className="absolute inset-0 h-full w-full object-contain p-1" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px]">{r.name}</span>
                      <span className="block text-[12px] text-mist">
                        {r.brand}
                        {r.code && !/\s/.test(r.code) ? ` · ${r.code}` : ""}
                      </span>
                    </span>
                    <span className="shrink-0 text-[14px] font-medium">{formatRsd(r.priceRsd)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-4 text-[14px] text-mist">
              Nema rezultata za „{q}". Pozovite nas: <a href="tel:035311137" className="text-ink underline">035/311-137</a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const TRUST = [
  { title: "Isporuka na adresu", text: "Poručite online, deo stiže na vašu adresu." },
  { title: "Originalni i zamenski delovi", text: "IMT, Massey Ferguson, Landini, Jinma, Solis i priključne mašine." },
  { title: "Pomoć pri izboru dela", text: "Pozovite odeljenje delova: 035/311-137", href: "tel:035311137" },
];

export default function ShopFeatured() {
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
    <section id="prodavnica" className="mx-auto w-full max-w-[1600px] px-4 pt-12 md:px-9 md:pt-24">
      <div className="rounded-[4px] bg-canvas px-4 py-8 md:px-10 md:py-12">
        {/* zaglavlje + pretraga (z-20 da padajuća lista ide preko pločica brendova) */}
        <Reveal className="relative z-20">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[12px] uppercase tracking-[0.18em] text-mist">{t.shop.eyebrow}</p>
              <h2 className="mt-2 text-[30px] font-medium leading-[1.05] md:text-[40px]">{t.shop.heading}</h2>
              <p className="mt-3 max-w-md text-[14px] leading-relaxed text-mist">{t.shop.sub}</p>
            </div>
            <Search />
          </div>
        </Reveal>

        {/* kupujte po brendu */}
        <Reveal delay={80}>
          <div className="mt-8 flex items-center justify-between gap-4">
            <p className="text-[12px] uppercase tracking-[0.18em] text-mist">Kupujte po brendu</p>
            <Link href={t.shop.href} className="group hidden items-center gap-1 text-[13px] md:inline-flex">
              Svi brendovi <Chevron className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <ul data-lenis-prevent-horizontal className="no-scrollbar -mx-4 mt-3 flex gap-3 overflow-x-auto px-4 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 lg:grid-cols-6">
            {shopBrands.slice(0, 12).map((b) => (
              <li key={b.slug} className="shrink-0">
                <Link
                  href={b.href}
                  className="flex h-[68px] w-[150px] items-center justify-between gap-3 rounded-[4px] border border-transparent bg-paper px-4 transition-colors hover:border-ink md:w-auto"
                >
                  {b.logo ? (
                    <img src={b.logo} alt={b.name} className="h-8 w-auto max-w-[96px] object-contain object-left" />
                  ) : (
                    <span className="text-[13px] font-medium leading-tight">{b.name}</span>
                  )}
                  <span className="shrink-0 text-[12px] text-mist">{b.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* najtraženiji delovi */}
        <Reveal delay={140}>
          <div className="relative mt-10">
            <ul
              ref={trackRef}
              data-lenis-prevent-horizontal
              className="no-scrollbar flex snap-x snap-mandatory flex-row gap-4 overflow-x-auto overscroll-x-contain overscroll-y-auto! md:gap-6"
            >
              {featuredParts.map((p) => (
                <li
                  key={p.id}
                  className="w-[78%] shrink-0 snap-start sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)] xl:w-[calc((100%-72px)/4)]"
                >
                  <div className="group flex h-full flex-col overflow-hidden rounded-[4px] bg-paper transition-shadow duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                    <Link href={p.href} aria-label={p.name} className="relative block aspect-[4/3] bg-white">
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-500 ease-[var(--ease-brand)] group-hover:scale-[1.05]"
                      />
                      {p.code && !/\s/.test(p.code) && (
                        <span className="absolute left-3 top-3 rounded-full bg-canvas px-2.5 py-1 text-[11px] text-mist">
                          {t.shop.code} {p.code}
                        </span>
                      )}
                    </Link>
                    <div className="flex flex-1 flex-col border-t border-line p-5">
                      <div className="flex h-6 items-center">
                        {p.logo ? (
                          <img src={p.logo} alt={p.brand} className="h-6 w-auto max-w-[100px] object-contain object-left" />
                        ) : (
                          <p className="text-[12px] uppercase tracking-[0.14em] text-mist">{p.brand}</p>
                        )}
                      </div>
                      <h3 className="mt-3 line-clamp-2 min-h-[44px] text-[16px] font-medium leading-snug">
                        <Link href={p.href} className="transition-colors duration-150 hover:text-mist">
                          {p.name}
                        </Link>
                      </h3>
                      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
                        <p className="whitespace-nowrap text-[20px] font-medium leading-none">{formatRsd(p.priceRsd)}</p>
                        <AddToCart id={p.id} name={p.name} label={t.shop.addToCart} />
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
              className="absolute -left-2 top-[34%] z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-accent-contrast shadow-lg transition-opacity duration-150 hover:bg-accent-soft disabled:opacity-0 sm:flex md:-left-5"
            >
              <ArrowLeft />
            </button>
            <button
              onClick={() => step(1)}
              aria-label="Sledeći proizvodi"
              disabled={!canNext}
              className="absolute -right-2 top-[34%] z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-accent-contrast shadow-lg transition-opacity duration-150 hover:bg-accent-soft disabled:opacity-0 sm:flex md:-right-5"
            >
              <ArrowRight />
            </button>
          </div>
        </Reveal>

        {/* traka poverenja + poziv */}
        <Reveal delay={200}>
          <div className="mt-10 grid gap-px overflow-hidden rounded-[4px] bg-line md:grid-cols-[1fr_1fr_1fr_auto]">
            {TRUST.map((x) => {
              const body = (
                <>
                  <p className="text-[14px] font-medium">{x.title}</p>
                  <p className="mt-1 text-[13px] text-mist">{x.text}</p>
                </>
              );
              return x.href ? (
                <a key={x.title} href={x.href} className="bg-paper p-5 transition-colors hover:bg-white">{body}</a>
              ) : (
                <div key={x.title} className="bg-paper p-5">{body}</div>
              );
            })}
            <div className="flex items-center bg-paper p-5">
              <Link
                href={t.shop.href}
                className="w-full rounded-full bg-accent px-7 py-3 text-center text-[14px] text-accent-contrast transition-colors hover:bg-accent-soft md:w-auto"
              >
                {t.shop.viewAll}
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
