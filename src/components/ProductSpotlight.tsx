"use client";

import Link from "next/link";
import { useState } from "react";
import { Package } from "lucide-react";
import Reveal from "./Reveal";
import { ArrowRight } from "./graphics";
import { imt } from "@/data/imt-spotlight";

/* Izdvojeni traktor (IMT 565.2 DI) u dva sloja:
 * 1. velika kartica - fotografija sa ključnim brojevima na staklenoj traci pri dnu, tamni panel sa nazivom i dugmadima
 * 2. šira kartica - fotografija sa primenom i specifikacija sa tabovima po grupama (levo);
 *    ostali IMT modeli i crvena kartica za IMT delove koja se rasteže do iste visine (desno)
 * Isti vizuelni jezik kao ostale sekcije: zaobljenje 12px, crveni natpisi, dugmad sa strelicom u krugu. */

const SHORT: Record<string, string> = {
  "Motor i prenos": "Motor i prenos",
  "Hidraulika i upravljanje": "Hidraulika",
  "Točkovi, kočnice, oprema": "Točkovi i oprema",
};

export default function ProductSpotlight() {
  const [tab, setTab] = useState(0);
  const [brand, ...rest] = imt.name.split(" ");

  return (
    <section id="imt" className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-9 md:pb-24">
      {/* ── 1. velika kartica ── */}
      <Reveal>
        <div className="grid overflow-hidden rounded-[12px] bg-[#18191b] lg:grid-cols-[1.45fr_1fr]">
          <div className="group relative isolate min-h-[340px] overflow-hidden md:min-h-[460px] lg:min-h-[560px]">
            {/* eslint-disable-next-line @next/next/no-img-element -- fotografija iz public */}
            <img
              src={imt.banner}
              alt={imt.name}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 -z-10 h-full w-full object-cover object-[30%_50%] transition-transform duration-[1400ms] ease-[var(--ease-brand)] group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/70 via-transparent via-50% to-transparent" />

            <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/30 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-md md:left-6 md:top-6">
              Najjači IMT u ponudi
            </span>

            {/* ključni brojevi na staklenoj traci */}
            <dl className="absolute inset-x-3 bottom-3 grid grid-cols-2 overflow-hidden rounded-[10px] border border-white/15 bg-black/35 text-white backdrop-blur-md sm:grid-cols-4 md:inset-x-6 md:bottom-6">
              {imt.stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`flex flex-col-reverse justify-end px-4 py-3 md:px-5 md:py-4 ${i % 2 === 1 ? "border-l border-white/10" : ""} ${i > 1 ? "border-t border-white/10 sm:border-t-0" : ""} ${i === 2 ? "sm:border-l" : ""}`}
                >
                  <dt className="mt-1.5 text-[11px] leading-tight text-white/60">{s.label}</dt>
                  <dd className="whitespace-nowrap text-[24px] font-medium leading-none tracking-[-0.02em] tabular-nums md:text-[30px]">
                    {s.value}
                    {s.unit && <span className="ml-1 text-[13px] font-normal text-white/60">{s.unit}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col justify-center p-6 text-white md:p-10 xl:p-14">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33]">{imt.eyebrow}</p>
            <h2 className="mt-4 text-[44px] font-medium leading-[0.95] tracking-[-0.03em] md:text-[56px] xl:text-[64px]">
              {brand}
              <span className="block text-white/55">{rest.join(" ")}</span>
            </h2>
            <p className="mt-6 text-[17px] font-medium leading-snug md:text-[19px]">{imt.tagline}</p>
            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-white/60">{imt.text}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={imt.href}
                className="group/btn inline-flex h-12 items-center gap-3 rounded-full bg-[#e02a33] pl-6 pr-1.5 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-[#c41f27]"
              >
                Pogledaj model
                <span className="grid size-9 place-items-center rounded-full bg-white text-[#e02a33]">
                  <ArrowRight className="h-3 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
                </span>
              </Link>
              <Link
                href="/kontakt#poruka"
                className="inline-flex h-12 items-center rounded-full border border-white/25 px-6 text-[14px] text-white transition-colors duration-200 hover:border-white hover:bg-white hover:text-ink"
              >
                Zatraži ponudu
              </Link>
            </div>
          </div>
        </div>
      </Reveal>

      {/* ── 2. traktor sa specifikacijom (levo) + ostali modeli i delovi (desno) ── */}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.75fr_1fr]">
        <Reveal delay={100} className="h-full">
          <div className="grid h-full overflow-hidden rounded-[12px] bg-paper ring-1 ring-line md:grid-cols-[1fr_1.1fr]">
            {/* fotografija + primena */}
            <div className="flex flex-col border-b border-line md:border-b-0 md:border-r">
              <div className="relative aspect-[4/3] flex-1 bg-white md:aspect-auto md:min-h-[300px]">
                {/* eslint-disable-next-line @next/next/no-img-element -- fotografija iz public */}
                <img src={imt.image} alt={imt.name} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-contain p-6 md:p-8" />
              </div>
              <div className="border-t border-line p-5 md:p-6">
                <p className="text-[11px] uppercase tracking-[0.16em] text-mist">Primena</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {imt.uses.map((u) => (
                    <li key={u} className="rounded-full bg-canvas px-3 py-1.5 text-[12px] ring-1 ring-line">
                      {u}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* specifikacija sa tabovima */}
            <div className="flex flex-col p-5 md:p-7">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33]">Tehnički podaci</p>
                  <h3 className="mt-2 text-[22px] font-medium tracking-[-0.01em]">Specifikacija</h3>
                </div>
                <p className="text-[11px] text-mist">Fabrički podaci IMT / TAFE</p>
              </div>

              <div role="tablist" aria-label="Grupe podataka" className="no-scrollbar -mx-5 mt-5 overflow-x-auto px-5 md:mx-0 md:px-0">
                <div className="flex w-max gap-1 rounded-full bg-canvas p-1 ring-1 ring-line">
                  {imt.specs.map((g, i) => (
                    <button
                      key={g.group}
                      type="button"
                      role="tab"
                      aria-selected={tab === i}
                      onClick={() => setTab(i)}
                      className={`h-8 shrink-0 rounded-full px-3.5 text-[12px] transition-colors duration-200 ${tab === i ? "bg-ink text-white" : "text-ink/65 hover:text-ink"}`}
                    >
                      {SHORT[g.group] ?? g.group}
                    </button>
                  ))}
                </div>
              </div>

              {/* sve grupe u istoj ćeliji mreže, jedna preko druge; vidi se samo izabrana. Visina je uvek visina
                  najviše grupe, pa se kartica (i slika levo) ne menja pri promeni taba */}
              <div className="mt-3 grid">
                {imt.specs.map((g, gi) => (
                  <dl
                    key={g.group}
                    role="tabpanel"
                    aria-hidden={gi !== tab}
                    className={`col-start-1 row-start-1 transition-opacity duration-300 ${gi === tab ? "opacity-100" : "pointer-events-none invisible opacity-0"}`}
                  >
                    {g.rows.map(([k, v]) => (
                      <div key={k} className="flex items-baseline justify-between gap-4 border-b border-line py-3 last:border-0">
                        <dt className="text-[13px] text-mist">{k}</dt>
                        <dd className="text-right text-[14px] font-medium">{v}</dd>
                      </div>
                    ))}
                  </dl>
                ))}
              </div>

              <Link href={imt.href} className="group mt-auto inline-flex items-center gap-2 pt-5 text-[13px] text-ink/75 transition-colors hover:text-ink">
                Kompletna specifikacija i oprema
                <ArrowRight className="h-2.5 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* ostali modeli + delovi; crvena kartica se rasteže do visine leve */}
        <Reveal delay={180} className="h-full">
          <div className="flex h-full flex-col gap-5">
            <div className="rounded-[12px] bg-paper p-5 ring-1 ring-line md:p-6">
              <p className="text-[11px] uppercase tracking-[0.16em] text-mist">Ostali IMT modeli</p>
              <ul className="mt-2">
                {imt.siblings.map((m) => (
                  <li key={m.href}>
                    <Link href={m.href} className="group flex items-center justify-between gap-3 border-b border-line py-3 last:border-0">
                      <span className="min-w-0">
                        <span className="block text-[15px] font-medium">{m.name}</span>
                        <span className="block text-[12px] text-mist">{m.note}</span>
                      </span>
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-canvas text-ink transition-colors duration-200 group-hover:bg-ink group-hover:text-white">
                        <ArrowRight className="h-2.5 w-3" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href={imt.partsHref}
              className="group relative isolate flex flex-1 flex-col justify-between gap-8 overflow-hidden rounded-[12px] bg-[#e02a33] p-6 text-white transition-colors duration-300 hover:bg-[#c41f27]"
            >
              {/* zupčanici u pozadini: multiply ih utapa u crvenu, pa se samo naziru (Unsplash, Unsplash License) */}
              {/* eslint-disable-next-line @next/next/no-img-element -- dekorativna fotografija iz public */}
              <img
                src="/images/akcenti/zupcanici.jpg"
                alt=""
                aria-hidden
                loading="lazy"
                decoding="async"
                className="absolute inset-0 -z-10 h-full w-full object-cover object-[35%_center] opacity-70 mix-blend-multiply grayscale transition-transform duration-[1400ms] ease-[var(--ease-brand)] group-hover:scale-[1.06]"
              />
              <span aria-hidden className="absolute inset-0 -z-10 bg-linear-to-t from-[#e02a33] via-[#e02a33]/40 to-transparent transition-colors duration-300 group-hover:from-[#c41f27] group-hover:via-[#c41f27]/40" />
              <span className="flex items-start justify-between gap-4">
                <span className="grid size-11 place-items-center rounded-full bg-white/15">
                  <Package className="size-5" strokeWidth={1.6} aria-hidden />
                </span>
                <span className="grid size-10 place-items-center rounded-full bg-white text-[#e02a33]">
                  <ArrowRight className="h-3 w-3.5 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
                </span>
              </span>
              <span>
                <span className="block text-[11px] uppercase tracking-[0.16em] text-white/70">Online prodavnica</span>
                <span className="mt-2 block text-[22px] font-medium leading-tight tracking-[-0.01em]">Rezervni delovi za IMT uvek na stanju</span>
                <span className="mt-2 block text-[13px] leading-snug text-white/80">Hladnjaci, alternatori, kočnice, ležajevi i više. Poručite online, isporuka na adresu.</span>
              </span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
