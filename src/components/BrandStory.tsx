"use client";

import Link from "next/link";
import Reveal from "./Reveal";
import { Chevron } from "./graphics";

/* O nama: naslov, tekst i brojevi levo, zgrada firme desno; ispod traka sa logoima partnera. */
import { PartnersMarquee, STATS } from "./Partners";

export default function BrandStory() {
  return (
    <section id="o-nama" className="mx-auto w-full max-w-[1600px] px-4 py-14 md:px-9 md:py-32">
      <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-16">
        <Reveal className="flex flex-col justify-center">
          <p className="text-[12px] uppercase tracking-[0.18em] text-mist">Jugometal d.o.o. Svilajnac</p>
          <h2 className="mt-3 text-[40px] font-medium leading-[1.02] md:text-[56px]">35 godina u poslu.</h2>
          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-mist">
            Osnovani smo 1990. godine u Svilajncu. Višegodišnji rad, saradnja sa poljoprivrednicima i posvećenost
            potrebama kupaca doveli su do sedišta u Temerinu i Požarevcu i do mesta jednog od vodećih prodavaca
            poljoprivredne mehanizacije u Srbiji.
          </p>

          <dl className="mt-8 grid grid-cols-2 md:mt-10 gap-px overflow-hidden rounded-[4px] border border-line bg-line">
            {STATS.map((s) => (
              <div key={s.label} className="bg-paper p-4 md:p-6">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block text-[30px] font-medium leading-none md:text-[44px]">{s.value}</span>
                  <span className="mt-2 block text-[13px] text-mist">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-5">
            <Link
              href="/o-nama"
              className="rounded-full bg-accent px-8 py-3 text-[14px] text-accent-contrast transition-colors duration-150 ease-[var(--ease-brand)] hover:bg-accent-soft"
            >
              Više o nama
            </Link>
            <Link href="/kontakt" className="group inline-flex items-center gap-1 text-[14px]">
              Posetite nas
              <Chevron className="h-2.5 w-2.5 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={150} className="h-full">
          <div className="relative h-full min-h-[240px] overflow-hidden rounded-[4px] bg-canvas md:min-h-[360px] lg:min-h-[620px]">
            <img
              src="/banners/firma.jpg"
              alt="Jugometal prodajno-servisni centar"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-[30%_50%]"
            />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-6 text-white md:p-8">
              <p className="text-[12px] uppercase tracking-[0.18em] text-white/75">Svilajnac · Temerin · Požarevac</p>
              <p className="mt-1 text-[18px] font-medium">Prodaja, servis i rezervni delovi na jednom mestu</p>
            </div>
          </div>
        </Reveal>
      </div>

      <PartnersMarquee />
    </section>
  );
}
