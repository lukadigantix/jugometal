"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { heroSlides } from "@/data/hero-slides";
import { ArrowLeft, ArrowRight, Chevron } from "./graphics";

const DURATION = 7000;

/*
  Hero slajder (prenesen iz htzshop v4, obrazac pitbike.vercel.app): puna širina, 702 px,
  fotografija preko celog ekrana, tekst dole levo (nadnaslov 16, naslov 48/52, pasus 16).
  Smena: crossfade 700 ms, tekst se blago podigne; imena slajdova i dve tanke strelice dole desno
  (ispod xl: brojač "01 / 05"). Autoplay 7 s, pauza na hover, strelice na tastaturi.
*/
export default function Hero() {
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
    if (paused) return;
    timer.current = setTimeout(() => go(active + 1), DURATION);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [active, paused, cycle, go]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(active + 1);
      if (e.key === "ArrowLeft") go(active - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, go]);

  return (
    <section
      className="relative h-[620px] overflow-hidden bg-[#15181d] text-white md:h-[680px] xl:h-[702px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Najprodavaniji traktori"
    >
      {heroSlides.map((s, i) => {
        const isActive = i === active;
        return (
          <div
            key={s.key}
            className={`absolute inset-0 transition-opacity duration-700 ${isActive ? "opacity-100" : "pointer-events-none opacity-0"}`}
            aria-hidden={!isActive}
          >
            <img
              src={s.image}
              alt={s.title}
              fetchPriority={i === 0 ? "high" : "low"}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: s.imagePosition ?? "center" }}
            />
            {/* zatamnjenje samo ispod teksta: odozdo (ceo red sa kontrolama) + sleva (blok teksta); sredina i vrh slike ostaju svetli */}
            <div className="absolute inset-x-0 bottom-0 h-[85%] bg-linear-to-t from-black/85 via-black/50 to-transparent md:h-[65%] md:from-black/65 md:via-black/30" />
            <div className="absolute inset-y-0 left-0 hidden w-[70%] bg-linear-to-r from-black/65 via-black/30 to-transparent md:block" />
            {/* dole desno: iza imena slajdova i strelica */}
            <div className="absolute bottom-0 right-0 hidden h-[55%] w-[65%] bg-[radial-gradient(ellipse_at_bottom_right,rgba(0,0,0,0.7)_0%,rgba(0,0,0,0.35)_40%,transparent_72%)] md:block" />
            <div
              key={isActive ? `t-${cycle}` : "t"}
              className={`absolute bottom-[96px] left-4 right-4 [text-shadow:0_1px_12px_rgba(0,0,0,0.35)] md:bottom-14 md:left-14 md:right-auto md:w-[480px] lg:w-[560px] xl:w-[640px] ${isActive ? "animate-[heroIn_.6s_ease-out_both]" : ""}`}
            >
              <p className="text-[14px] text-white/90 md:text-[16px]">{s.eyebrow}</p>
              <h1 className="mt-3 text-[34px] font-medium leading-[36px] md:text-[48px] md:leading-[52px]">{s.title}</h1>
              <p className="mt-3 max-w-[540px] text-[14px] leading-[21px] text-white/85 md:mt-4 md:text-[16px] md:leading-[24px]">{s.text}</p>
              <div className="mt-6 flex flex-wrap items-center gap-3 md:gap-4">
                <Link
                  href={s.cta.href}
                  className="rounded-full bg-paper/85 px-8 py-2.5 text-[14px] text-ink backdrop-blur transition-colors duration-150 ease-[var(--ease-brand)] hover:bg-paper"
                >
                  {s.cta.label}
                </Link>
                <Link href={s.secondary.href} className="group inline-flex items-center gap-1 text-[14px] text-white/90 transition-colors hover:text-white">
                  {s.secondary.label}
                  <Chevron className="h-2.5 w-2.5 transition-transform duration-150 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      <div className="absolute bottom-6 right-4 z-10 flex h-10 items-center gap-5 md:bottom-14 md:right-14 md:gap-8">
        <nav aria-label="Slajdovi" className="hidden items-center gap-5 xl:flex">
          {heroSlides.map((s, i) => (
            <button
              key={s.key}
              type="button"
              onClick={() => go(i)}
              aria-current={i === active}
              className={`relative flex h-10 items-center text-[13px] uppercase tracking-[0.14em] transition-colors [text-shadow:0_1px_8px_rgba(0,0,0,0.5)] ${i === active ? "text-white" : "text-white/70 hover:text-white"}`}
            >
              {s.label}
              <span className={`absolute inset-x-0 bottom-1.5 h-px bg-white transition-opacity ${i === active ? "opacity-100" : "opacity-0"}`} />
            </button>
          ))}
        </nav>
        <span className="text-[12px] tracking-[0.14em] text-white/70 xl:hidden">
          <span className="text-white">{String(active + 1).padStart(2, "0")}</span> / {String(n).padStart(2, "0")}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label="Prethodni slajd"
            className="grid size-10 place-items-center rounded-full border border-white/40 text-white transition hover:border-white hover:bg-white/10"
          >
            <ArrowLeft className="h-3 w-4" />
          </button>
          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label="Sledeći slajd"
            className="grid size-10 place-items-center rounded-full border border-white/40 text-white transition hover:border-white hover:bg-white/10"
          >
            <ArrowRight className="h-3 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
