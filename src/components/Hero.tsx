"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { HeroSlide } from "@/lib/slider";
import { ArrowLeft, ArrowRight } from "./graphics";

const DURATION = 7000;

/*
  Hero slajder na vrhu početne. Slajdovi dolaze iz admina (Podešavanja → Slider), vidi lib/slider.ts:
  nadnaslov, naslov, tekst, dva dugmeta, fotografija sa pozicijom i prelaz (boja i jačina).
  - fotografija preko cele širine; aktivna se tokom 7 s polako približava (Ken Burns), smena je crossfade 700 ms
  - tekst dole levo: nadnaslov sa crvenom crtom, naslov, tekst, crveno dugme sa strelicom i stakleno drugo dugme
  - dole staklena traka: segment po slajdu (broj i naziv od md), aktivni se puni tokom 7 s; strelice desno
  Autoplay 7 s, pauza na hover (staje i punjenje), strelice na tastaturi.
*/
export default function Hero({ slides: heroSlides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [cycle, setCycle] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const n = heroSlides.length;

  const go = useCallback(
    (i: number) => {
      setActive(((i % n) + n) % n);
      setCycle((c) => c + 1);
    },
    [n],
  );

  useEffect(() => {
    if (paused || n < 2) return;
    timer.current = setTimeout(() => go(active + 1), DURATION);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [active, paused, cycle, go, n]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(active + 1);
      if (e.key === "ArrowLeft") go(active - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, go]);

  const glass = "border border-white/20 bg-white/10 backdrop-blur-md";

  return (
    <section
      className="relative h-[640px] overflow-hidden bg-[#15181d] text-white md:h-[700px] xl:h-[740px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Jugometal ponuda"
    >
      {heroSlides.map((s, i) => {
        const isActive = i === active;
        return (
          <div
            key={s.key}
            className={`absolute inset-0 transition-opacity duration-700 ${isActive ? "opacity-100" : "pointer-events-none opacity-0"}`}
            aria-hidden={!isActive}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- fotografija iz admina */}
            <img
              src={s.image}
              alt={s.imageAlt}
              fetchPriority={i === 0 ? "high" : "low"}
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover ${isActive ? "animate-[heroZoom_9s_ease-out_both]" : ""}`}
              style={{ objectPosition: s.imagePosition ?? "center", animationPlayState: paused ? "paused" : "running" }}
            />
            {/* prelaz odozdo nagore iza teksta - boja i jačina iz admina (podrazumevano crna, puna jačina) */}
            <div
              className="absolute inset-0 bg-[linear-gradient(to_top,rgb(var(--fade)/0.95)_0%,rgb(var(--fade)/0.85)_35%,rgb(var(--fade)/0.55)_55%,rgb(var(--fade)/0)_75%)] md:bg-[linear-gradient(to_top,rgb(var(--fade)/0.95)_0%,rgb(var(--fade)/0.8)_30%,rgb(var(--fade)/0.45)_48%,rgb(var(--fade)/0)_65%)]"
              style={{ "--fade": s.fade.rgb, opacity: s.fade.opacity } as React.CSSProperties}
            />
            {/* blago zatamnjenje sleva, da tekst ostane čitljiv i na svetlim fotografijama */}
            <div className="absolute inset-0 hidden bg-linear-to-r from-black/35 via-black/5 to-transparent md:block" />

            <div
              key={isActive ? `t-${cycle}` : "t"}
              className={`absolute bottom-[124px] left-4 right-4 [text-shadow:0_1px_14px_rgba(0,0,0,0.35)] md:bottom-[140px] md:left-14 md:right-auto md:w-[520px] lg:w-[580px] xl:w-[620px] ${isActive ? "animate-[heroIn_.7s_ease-out_both]" : ""}`}
            >
              {s.eyebrow && (
                <p className="mb-3 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.18em] text-white/85 md:text-[12px]">
                  <span aria-hidden className="h-[2px] w-6 rounded-full bg-[#e02a33]" />
                  {s.eyebrow}
                </p>
              )}
              {/* samo prvi slajd je naslov strane (h1), ostali su h2 */}
              {s.title &&
                (i === 0 ? (
                  <h1 className="text-[32px] font-medium leading-[1.05] tracking-[-0.025em] md:text-[44px] xl:text-[48px]">{s.title}</h1>
                ) : (
                  <h2 className="text-[32px] font-medium leading-[1.05] tracking-[-0.025em] md:text-[44px] xl:text-[48px]">{s.title}</h2>
                ))}
              {s.text && <p className="mt-3 max-w-[520px] text-[14px] leading-relaxed text-white/80 md:mt-4 md:text-[15px]">{s.text}</p>}
              {(s.cta || s.secondary) && (
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {s.cta && (
                    <Link
                      href={s.cta.href}
                      className="group inline-flex h-11 items-center gap-2.5 rounded-full bg-[#e02a33] pl-5 pr-1.5 text-[13px] font-medium text-white [text-shadow:none] transition-colors duration-200 hover:bg-[#c41f27]"
                    >
                      {s.cta.label}
                      <span className="grid size-8 place-items-center rounded-full bg-white text-[#e02a33]">
                        <ArrowRight className="h-3 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  )}
                  {s.secondary && (
                    <Link
                      href={s.secondary.href}
                      className={`inline-flex h-11 items-center rounded-full px-5 text-[13px] text-white [text-shadow:none] transition-colors duration-200 hover:border-white hover:bg-white hover:text-ink ${glass}`}
                    >
                      {s.secondary.label}
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* donja traka: segmenti sa napretkom + strelice */}
      <div className="absolute inset-x-4 bottom-5 z-10 flex items-center gap-3 md:inset-x-14 md:bottom-10 md:gap-6">
        <nav aria-label="Slajdovi" className="flex min-w-0 flex-1 gap-2 md:gap-4">
          {heroSlides.map((s, i) => {
            const on = i === active;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => go(i)}
                aria-label={`Slajd ${i + 1}: ${s.label}`}
                aria-current={on}
                className="group flex min-w-0 flex-1 flex-col gap-2.5 py-2 text-left"
              >
                <span className="relative block h-[2px] w-full overflow-hidden rounded-full bg-white/25">
                  {on && n > 1 ? (
                    <span
                      key={`p-${cycle}`}
                      className="absolute inset-0 origin-left rounded-full bg-white"
                      style={{ animation: `heroProgress ${DURATION}ms linear both`, animationPlayState: paused ? "paused" : "running" }}
                    />
                  ) : (
                    <span className={`absolute inset-0 rounded-full bg-white transition-opacity ${on ? "opacity-100" : "opacity-0 group-hover:opacity-50"}`} />
                  )}
                </span>
                <span
                  className={`hidden items-baseline gap-2.5 truncate text-[11px] uppercase tracking-[0.14em] transition-colors md:flex ${on ? "text-white" : "text-white/55 group-hover:text-white/85"}`}
                >
                  <span className="tabular-nums text-white/45">{String(i + 1).padStart(2, "0")}</span>
                  <span className="truncate">{s.label}</span>
                </span>
              </button>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label="Prethodni slajd"
            className={`grid size-11 place-items-center rounded-full text-white transition-colors duration-200 hover:border-white hover:bg-white hover:text-ink ${glass}`}
          >
            <ArrowLeft className="h-3 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label="Sledeći slajd"
            className={`grid size-11 place-items-center rounded-full text-white transition-colors duration-200 hover:border-white hover:bg-white hover:text-ink ${glass}`}
          >
            <ArrowRight className="h-3 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
