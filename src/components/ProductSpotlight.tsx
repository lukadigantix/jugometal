"use client";

import Link from "next/link";
import { useState } from "react";
import Reveal from "./Reveal";
import { Chevron } from "./graphics";
import { imt } from "@/data/imt-spotlight";

/* Izdvojeni traktor (IMT 565.2 DI): banner sa nazivom, ključni brojevi, kompletna specifikacija,
 * primena i ostali IMT modeli. Isti jezik kartica kao Benda ATV. */
export default function ProductSpotlight() {
  // telefon: specifikacija je sklopljena (otvara se na dodir); od md naviše uvek otvorena
  const [specOpen, setSpecOpen] = useState(false);
  return (
    <section id="imt" className="mx-auto w-full max-w-[1600px] px-4 py-12 md:px-9 md:py-24">
      <Reveal>
        <div className="overflow-hidden rounded-[4px] border border-line bg-paper">
          {/* banner: fotografija levo, tamni panel sa tekstom desno (na telefonu jedno ispod drugog) */}
          <div className="grid md:min-h-[480px] md:grid-cols-[1.45fr_1fr]">
            <div className="relative h-[200px] md:h-auto">
              <img
                src={imt.banner}
                alt={imt.name}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover object-[30%_50%]"
              />
            </div>
            <div className="flex flex-col justify-center bg-ink p-6 text-white md:p-12">
              <p className="text-[12px] uppercase tracking-[0.18em] text-white/60">{imt.eyebrow}</p>
              <h2 className="mt-3 whitespace-nowrap text-[38px] font-medium leading-[0.95] md:text-[44px] lg:text-[52px] xl:text-[64px]">{imt.name}</h2>
              <p className="mt-4 text-[18px] font-medium md:text-[20px]">{imt.tagline}</p>
              <p className="mt-2 hidden max-w-md text-[14px] leading-relaxed text-white/70 md:block">{imt.text}</p>
              <div className="mt-7 flex flex-wrap items-center gap-3 md:gap-4">
                <Link href={imt.href} className="rounded-full bg-paper px-8 py-3 text-[14px] text-ink transition-colors duration-150 hover:bg-canvas">
                  Pogledaj model
                </Link>
                <Link href="/kontakt" className="rounded-full border border-white/50 px-8 py-3 text-[14px] text-white transition-colors duration-150 hover:bg-white/10">
                  Zatraži ponudu
                </Link>
              </div>
            </div>
          </div>

          {/* ključni brojevi */}
          <dl className="grid grid-cols-2 border-b border-line md:grid-cols-4">
            {imt.stats.map((s, i) => (
              <div key={s.label} className={`p-4 md:p-8 ${i % 2 ? "border-l" : ""} ${i > 1 ? "border-t md:border-t-0" : ""} ${i === 2 ? "md:border-l" : ""} border-line`}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="text-[30px] font-medium leading-none md:text-[48px]">{s.value}</span>
                  {s.unit && <span className="ml-1 text-[16px] text-mist">{s.unit}</span>}
                  <span className="mt-2 block text-[13px] text-mist">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="grid lg:grid-cols-[1fr_1.4fr]">
            {/* slika + primena + ostali modeli */}
            <div className="flex min-w-0 flex-col border-b border-line p-5 md:p-10 lg:border-b-0 lg:border-r">
              <div className="relative hidden aspect-[5/4] bg-white md:block">
                <img src={imt.image} alt={imt.name} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-contain" />
              </div>
              <p className="text-[12px] uppercase tracking-[0.18em] text-mist md:mt-8">Primena</p>
              <ul className="no-scrollbar -mx-6 mt-3 flex gap-2 overflow-x-auto px-6 md:mx-0 md:flex-wrap md:overflow-visible md:px-0">
                {imt.uses.map((u) => (
                  <li key={u} className="shrink-0 rounded-full border border-line px-3.5 py-1.5 text-[13px]">{u}</li>
                ))}
              </ul>
              <p className="mt-6 text-[12px] uppercase tracking-[0.18em] text-mist md:mt-8">Ostali IMT modeli</p>
              <ul className="mt-3 divide-y divide-line border-y border-line">
                {imt.siblings.map((m) => (
                  <li key={m.href}>
                    <Link href={m.href} className="group flex items-center justify-between py-3 text-[14px]">
                      <span className="font-medium">{m.name}</span>
                      <span className="flex items-center gap-2 text-mist">
                        {m.note}
                        <Chevron className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* specifikacija */}
            <div className="min-w-0 p-5 md:p-10">
              <button
                type="button"
                onClick={() => setSpecOpen((v) => !v)}
                aria-expanded={specOpen}
                className="flex w-full items-center justify-between gap-4 text-left md:pointer-events-none"
              >
                <h3 className="text-[20px] font-medium md:text-[22px]">Tehnička specifikacija</h3>
                <span className="hidden text-[12px] text-mist md:inline">Fabrički podaci IMT / TAFE</span>
                <span className="flex items-center gap-2 text-[13px] text-mist md:hidden">
                  {specOpen ? "Zatvori" : "16 stavki"}
                  <Chevron className={`h-2.5 w-2.5 transition-transform ${specOpen ? "-rotate-90" : "rotate-90"}`} />
                </span>
              </button>
              <div className={`mt-6 gap-8 md:grid md:grid-cols-2 ${specOpen ? "grid" : "hidden"}`}>
                {imt.specs.map((g, gi) => (
                  <div key={g.group} className={gi === 2 ? "md:col-span-2" : ""}>
                    <p className="text-[12px] uppercase tracking-[0.18em] text-mist">{g.group}</p>
                    <dl className={`mt-2 text-[14px] ${gi === 2 ? "md:grid md:grid-cols-2 md:gap-x-8" : ""}`}>
                      {g.rows.map(([k, v]) => (
                        <div key={k} className="flex justify-between gap-4 border-b border-line py-2.5">
                          <dt className="text-mist">{k}</dt>
                          <dd className="text-right">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[4px] bg-canvas p-5 md:mt-8">
                <div>
                  <p className="text-[15px] font-medium">Rezervni delovi za IMT uvek na stanju</p>
                  <p className="mt-0.5 hidden text-[13px] text-mist md:block">Hladnjaci, alternatori, kočnice, ležajevi i više - poručite online.</p>
                </div>
                <Link href={imt.partsHref} className="rounded-full bg-accent px-6 py-2.5 text-[14px] text-accent-contrast transition-colors hover:bg-accent-soft">
                  IMT delovi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
