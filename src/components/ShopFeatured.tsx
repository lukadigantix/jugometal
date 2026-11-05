"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Phone, Search as SearchIcon, ShieldCheck, Truck } from "lucide-react";
import AddToCart from "./AddToCart";
import Reveal from "./Reveal";
import { ArrowLeft, ArrowRight } from "./graphics";
import { t } from "./copy";
import { formatRsd, normalize, type PartsData } from "@/data/featured-parts";
import { tel, useSite } from "@/lib/site-context";

type Data = Pick<PartsData, "featuredParts" | "searchIndex" | "shopBrands" | "totalParts">;

/**
 * Online prodavnica na početnoj, u četiri sloja:
 * 1. tamna traka - naslov, velika pretraga uživo (naziv/šifra, nad svim delovima) sa brzim pojmovima, brojke
 * 2. „Kupujte po brendu" - ujednačene pločice sa logom i brojem delova
 * 3. karusel najtraženijih delova - kartice u istom jeziku kao mašine (šifra, logo, naziv, cena, U korpu)
 * 4. traka prednosti sa ikonama i dugme ka svim proizvodima
 */

// brzi pojmovi ispod pretrage: popunjavaju polje i otvaraju rezultate
const QUICK = ["Filter", "Alternator", "Anlaser", "Pumpa", "Ležaj", "Hladnjak"];

function Search({ searchIndex, totalParts, partsPhone }: Pick<Data, "searchIndex" | "totalParts"> & { partsPhone: string }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const results = useMemo(() => {
    const terms = normalize(q).split(/\s+/).filter((w) => w.length > 1);
    if (!terms.length) return [];
    return searchIndex.filter((p) => terms.every((w) => p.hay.includes(w))).slice(0, 6);
  }, [q, searchIndex]);
  const available = QUICK.filter((w) => searchIndex.some((p) => p.hay.includes(normalize(w))));

  return (
    <div className="relative w-full">
      <label htmlFor="shop-search" className="sr-only">Pretraga delova</label>
      <div className="flex h-14 items-center gap-3 rounded-full bg-white pl-5 pr-2 text-ink shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)] ring-1 ring-black/5 transition-shadow focus-within:ring-2 focus-within:ring-[#e02a33]">
        <SearchIcon className="size-[18px] shrink-0 text-mist" strokeWidth={1.8} aria-hidden />
        <input
          ref={inputRef}
          id="shop-search"
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Naziv ili šifra dela"
          className="w-full bg-transparent text-[15px] placeholder:text-mist focus:outline-none"
          autoComplete="off"
        />
        <span className="hidden shrink-0 rounded-full bg-canvas px-3 py-1.5 text-[12px] text-mist sm:inline">{totalParts} delova</span>
      </div>

      {available.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-[12px] text-white/45">Često tražite:</span>
          {available.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => {
                setQ(w);
                setOpen(true);
                inputRef.current?.focus();
              }}
              className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[12px] text-white/80 transition-colors hover:border-white hover:bg-white hover:text-ink"
            >
              {w}
            </button>
          ))}
        </div>
      )}

      {open && q.trim().length > 1 && (
        <div className="absolute inset-x-0 top-[60px] z-30 overflow-hidden rounded-[12px] bg-paper text-ink shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)] ring-1 ring-line">
          {results.length ? (
            <ul className="divide-y divide-line">
              {results.map((r) => (
                <li key={r.id}>
                  <Link href={r.href} className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-canvas">
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-[8px] bg-white ring-1 ring-line">
                      {/* eslint-disable-next-line @next/next/no-img-element -- slika sa backenda */}
                      {r.image && <img src={r.image} alt="" className="absolute inset-0 h-full w-full object-contain p-1" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-medium">{r.name}</span>
                      <span className="block text-[12px] text-mist">
                        {r.brand}
                        {r.code && !/\s/.test(r.code) ? ` · ${r.code}` : ""}
                      </span>
                    </span>
                    <span className="shrink-0 text-[14px] font-medium tabular-nums">{formatRsd(r.priceRsd)}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link href={t.shop.href} className="flex items-center justify-between px-4 py-3 text-[13px] font-medium transition-colors hover:bg-canvas">
                  Otvori online prodavnicu
                  <ArrowRight className="h-2.5 w-3" />
                </Link>
              </li>
            </ul>
          ) : (
            <p className="px-4 py-4 text-[14px] text-mist">
              Nema rezultata za „{q}“. Pozovite odeljenje delova:{" "}
              <a href={tel(partsPhone)} className="font-medium text-ink underline underline-offset-2">
                {partsPhone}
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default function ShopFeatured({ data }: { data: Data }) {
  const { featuredParts, searchIndex, shopBrands, totalParts } = data;
  const { contact } = useSite();
  const partsPhone = contact.phoneParts || contact.phone;
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

  const arrow =
    "grid size-11 place-items-center rounded-full border border-line bg-paper text-ink transition-colors duration-200 hover:border-ink hover:bg-ink hover:text-white disabled:pointer-events-none disabled:opacity-35";

  const trust = [
    { icon: Truck, title: "Isporuka na adresu", text: "Poručite online, stiže na vašu adresu." },
    { icon: ShieldCheck, title: "Originalni i zamenski delovi", text: "Za IMT, Landini, Solis i druge brendove." },
    { icon: Phone, title: "Pomoć pri izboru dela", text: partsPhone ? `Odeljenje delova: ${partsPhone}` : "Pozovite odeljenje delova", href: partsPhone ? tel(partsPhone) : undefined },
  ];

  return (
    <section id="prodavnica" className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-9 md:pb-24">
      {/* ── 1. tamna traka: naslov + pretraga (z-20 da rezultati idu preko pločica ispod) ── */}
      <Reveal className="relative z-20">
        <div className="grid gap-8 rounded-[16px] bg-[#18191b] p-6 text-white md:p-10 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-14 xl:p-12">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33]">{t.shop.eyebrow}</p>
            <h2 className="mt-3 text-[30px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[40px]">
              {t.shop.heading}
              <span className="text-[#e02a33]">.</span>
            </h2>
            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-white/60">{t.shop.sub}</p>
            <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-4">
              {[
                { value: String(totalParts), label: "delova sa cenom" },
                { value: String(shopBrands.length), label: "brendova" },
                { value: "Srbija", label: "isporuka na adresu" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="mt-1 text-[12px] text-white/50">{s.label}</dt>
                  <dd className="text-[26px] font-medium leading-none tracking-[-0.02em] tabular-nums">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Search searchIndex={searchIndex} totalParts={totalParts} partsPhone={partsPhone} />
        </div>
      </Reveal>

      {/* ── 2. kupujte po brendu ── */}
      <Reveal delay={80}>
        <div className="mt-10 flex items-end justify-between gap-4">
          <h3 className="text-[20px] font-medium tracking-[-0.01em] md:text-[22px]">Kupujte po brendu</h3>
          <Link href={t.shop.href} className="group hidden items-center gap-2 text-[13px] text-ink/75 transition-colors hover:text-ink md:inline-flex">
            Svi brendovi <ArrowRight className="h-2.5 w-3 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <ul data-lenis-prevent-horizontal className="no-scrollbar -mx-4 mt-4 flex gap-3 overflow-x-auto px-4 pb-2 pt-1 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0 lg:grid-cols-6">
          {shopBrands.slice(0, 12).map((b) => (
            <li key={b.slug} className="shrink-0">
              <Link
                href={b.href}
                className="group relative grid h-[84px] w-[156px] place-items-center rounded-[10px] bg-paper px-5 ring-1 ring-line transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-18px_rgba(24,25,27,0.4)] hover:ring-ink/20 md:w-auto"
              >
                {b.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- logo brenda
                  <img src={b.logo} alt={b.name} className="max-h-8 w-auto max-w-[110px] object-contain grayscale transition duration-300 group-hover:grayscale-0" />
                ) : (
                  <span className="text-center text-[14px] font-medium leading-tight">{b.name}</span>
                )}
                <span className="absolute right-2 top-2 rounded-full bg-canvas px-1.5 py-0.5 text-[10px] tabular-nums text-mist transition-colors group-hover:bg-ink group-hover:text-white">{b.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* ── 3. najtraženiji delovi ── */}
      <Reveal delay={140}>
        <div className="mt-10 flex items-end justify-between gap-4">
          <h3 className="text-[20px] font-medium tracking-[-0.01em] md:text-[22px]">Izdvojeni delovi</h3>
          <div className="hidden shrink-0 items-center gap-2 sm:flex">
            <button type="button" onClick={() => step(-1)} aria-label="Prethodni proizvodi" disabled={!canPrev} className={arrow}>
              <ArrowLeft className="h-3 w-3.5" />
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Sledeći proizvodi" disabled={!canNext} className={arrow}>
              <ArrowRight className="h-3 w-3.5" />
            </button>
          </div>
        </div>

        {/* traka ima prostor oko kartica za okvir i senku (overflow seče i po visini); razmak između kartica je veći od bočnog prostora */}
        <ul
          ref={trackRef}
          data-lenis-prevent-horizontal
          className="no-scrollbar -mx-4 -mb-14 mt-3 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto overscroll-x-contain overscroll-y-auto! px-4 pb-14 pt-3 md:-mx-6 md:scroll-px-6 md:gap-8 md:px-6"
        >
          {featuredParts.map((p) => (
            <li
              key={p.id}
              className="w-[78%] shrink-0 snap-start sm:w-[calc((100%-20px)/2)] md:w-[calc((100%-32px)/2)] lg:w-[calc((100%-64px)/3)] xl:w-[calc((100%-96px)/4)]"
            >
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[12px] bg-paper ring-1 ring-black/[0.07] transition-shadow duration-500 ease-[var(--ease-brand)] hover:shadow-[0_24px_40px_-24px_rgba(24,25,27,0.4)]">
                <div className="relative aspect-[4/3] border-b border-line bg-white">
                  {/* eslint-disable-next-line @next/next/no-img-element -- slika sa backenda */}
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-contain p-7 transition-transform duration-700 ease-[var(--ease-brand)] group-hover:scale-[1.06]"
                  />
                  {p.code && !/\s/.test(p.code) && (
                    <span className="absolute left-3 top-3 rounded-full bg-[#18191b] px-2.5 py-1 text-[10px] font-medium tracking-[0.04em] text-white">
                      {t.shop.code} {p.code}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex h-6 items-center">
                    {p.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element -- logo brenda
                      <img src={p.logo} alt={p.brand} className="h-6 w-auto max-w-[100px] object-contain object-left" />
                    ) : (
                      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-mist">{p.brand}</p>
                    )}
                  </div>
                  <h4 className="mt-3 line-clamp-2 min-h-[44px] text-[16px] font-medium leading-snug">
                    <Link href={p.href} className="after:absolute after:inset-0 focus-visible:outline-none">
                      {p.name}
                    </Link>
                  </h4>
                  <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4">
                    <div>
                      <p className="text-[11px] text-mist">Cena sa PDV-om</p>
                      <p className="mt-1 whitespace-nowrap text-[20px] font-medium leading-none tracking-[-0.01em] tabular-nums">{formatRsd(p.priceRsd)}</p>
                    </div>
                    {/* iznad linka kartice, da klik dodaje u korpu */}
                    <AddToCart id={p.id} name={p.name} price={p.priceRsd} label={t.shop.addToCart} className="relative z-10 h-10 px-4" tone="dark" />
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

      {/* ── 4. prednosti + sve proizvode: tekst u jednom redu (od md; pun tekst u title ako mora da se skrati);
          tablet - tri kolone, dugme u redu ispod; desktop - četiri kolone, dugme desno ── */}
      <Reveal delay={200}>
        <div className="mt-8 grid overflow-hidden rounded-[12px] bg-paper ring-1 ring-line md:grid-cols-3 xl:grid-cols-[1fr_1fr_1fr_auto]">
          {trust.map(({ icon: Icon, title, text, href }, i) => {
            const body = (
              <>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e02a33]/10 text-[#e02a33]">
                  <Icon className="size-[18px]" strokeWidth={1.7} aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-medium md:truncate">{title}</span>
                  <span className="mt-0.5 block text-[12px] leading-snug text-mist md:truncate" title={text}>
                    {text}
                  </span>
                </span>
              </>
            );
            const cls = `flex min-w-0 items-center gap-3.5 border-b border-line p-5 xl:border-b-0 ${i < trust.length - 1 ? "md:border-r" : "xl:border-r"}`;
            return href ? (
              <a key={title} href={href} className={`${cls} transition-colors hover:bg-canvas`}>
                {body}
              </a>
            ) : (
              <div key={title} className={cls}>
                {body}
              </div>
            );
          })}
          <div className="flex items-center p-5 md:col-span-3 md:justify-center xl:col-span-1">
            <Link
              href={t.shop.href}
              className="group inline-flex h-12 w-full items-center justify-between gap-3 rounded-full bg-ink pl-6 pr-1.5 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-[#e02a33] md:w-auto"
            >
              <span className="whitespace-nowrap">{t.shop.viewAll}</span>
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-ink transition-colors duration-200 group-hover:text-[#e02a33]">
                <ArrowRight className="h-3 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
