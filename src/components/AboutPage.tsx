"use client";

import Link from "next/link";
import Reveal from "./Reveal";
import { Chevron } from "./graphics";
import { STATS } from "./Partners";
import company from "@/data/company.json";

/* Strana O nama: tekstovi sa starog sajta (company.json), bez dodatih činjenica. */

/* Tekstovi sa starog sajta, usklađeni sa današnjom ponudom (bez Belarusa, Carrara i Zetora; ispravljena slovna greška). */
const OFFER =
  "U ponudi su traktori Solis, IMT, John Deere, YTO i Mahindra. Podržavamo domaće proizvođače priključnih mašina kao što su FPM Agromehanika, Morava i Majevica, kao i renomirane firme iz regiona poput SIP Šempeter, INO Brežice, Gorenc i Agromehanika Kranj.";
const VALUES = [
  { n: "01", title: "Višegodišnji rad", text: "Višegodišnji rad, saradnja sa poljoprivrednicima, poslovnost i posvećenost potrebama kupaca doprineli su da Jugometal postane jedan od vodećih prodavaca poljoprivredne mehanizacije." },
  { n: "02", title: "Široka ponuda traktora", text: company.about.sections[1].text },
  { n: "03", title: "Servis i originalni delovi", text: "Stručna servisna služba na tri lokacije i delovi na stanju - za IMT, IMR, Massey Ferguson i brendove iz naše ponude. Delove možete poručiti i online." },
];

export function AboutHero() {
  return (
    <section className="relative h-[460px] w-full overflow-hidden bg-ink text-white md:h-[560px]">
      <img src="/banners/jugo.jpg" alt="Traktor na njivi u zalasku" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/35 to-black/10" />
      <div className="absolute inset-y-0 left-0 hidden w-[65%] bg-linear-to-r from-black/55 to-transparent md:block" />
      <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-4 pb-12 md:px-9 md:pb-16">
        <nav aria-label="Putanja" className="text-[13px] text-white/70">
          <Link href="/" className="hover:text-white">Početna</Link>
          <span className="mx-2">/</span>
          <span className="text-white">O nama</span>
        </nav>
        <h1 className="mt-4 max-w-3xl text-[40px] font-medium leading-[1.02] md:text-[64px]">{company.about.title}</h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/80 md:text-[17px]">
          Prodaja, servis i rezervni delovi za poljoprivrednu mehanizaciju - od 1990. godine, iz Svilajnca, Temerina i Požarevca.
        </p>
      </div>
    </section>
  );
}

export function AboutIntro() {
  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 py-14 md:px-9 md:py-24">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <Reveal>
          <p className="text-[12px] uppercase tracking-[0.18em] text-mist">Od 1990.</p>
          <h2 className="mt-3 text-[34px] font-medium leading-[1.05] md:text-[48px]">35 godina uz poljoprivrednike.</h2>
          <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-mist">{company.about.intro}</p>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-mist">{OFFER}</p>
        </Reveal>
        <Reveal delay={120}>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[4px] border border-line bg-line">
            {STATS.map((s) => (
              <div key={s.label} className="bg-paper p-5 md:p-8">
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="block text-[32px] font-medium leading-none md:text-[52px]">{s.value}</span>
                  <span className="mt-2 block text-[13px] text-mist">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}

export function AboutValues() {
  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-9 md:pb-24">
      <div className="grid overflow-hidden rounded-[4px] lg:grid-cols-[1fr_1.2fr]">
        <div className="relative min-h-[260px] md:min-h-[360px] lg:min-h-[560px]">
          <img src="/banners/firma.jpg" alt="Jugometal prodajno-servisni centar" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-[30%_50%]" />
        </div>
        <div className="bg-ink p-6 text-paper md:p-12">
          <p className="text-[12px] uppercase tracking-[0.18em] text-paper/60">Zašto Jugometal</p>
          <h2 className="mt-2 text-[30px] font-medium leading-[1.05] md:text-[40px]">Siguran partner na njivi i u radionici.</h2>
          <ul className="mt-8 divide-y divide-paper/15 border-y border-paper/15">
            {VALUES.map((v) => (
              <li key={v.n} className="flex gap-5 py-5">
                <span className="pt-1 text-[12px] tracking-[0.14em] text-paper/40">{v.n}</span>
                <div>
                  <p className="text-[18px] font-medium">{v.title}</p>
                  <p className="mt-2 text-[14px] leading-relaxed text-paper/65">{v.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function AboutCta() {
  const hq = company.locations[0];
  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 pb-16 md:px-9 md:pb-24">
      <Reveal>
        <div className="flex flex-col gap-6 rounded-[4px] bg-canvas p-6 md:flex-row md:items-center md:justify-between md:p-12">
          <div>
            <h2 className="text-[28px] font-medium leading-[1.1] md:text-[36px]">Svratite ili nas pozovite.</h2>
            <p className="mt-2 text-[15px] text-mist">
              {hq.street}, {hq.postalCode} {hq.city} · {company.email}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a href={`tel:${hq.phone.replace(/\D/g, "")}`} className="rounded-full bg-accent px-8 py-3 text-[14px] text-accent-contrast transition-colors hover:bg-accent-soft">
              Pozovite {hq.phone}
            </a>
            <Link href="/kontakt" className="group inline-flex items-center gap-1 text-[14px]">
              Sve lokacije i kontakt
              <Chevron className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
