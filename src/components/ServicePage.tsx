"use client";

import Link from "next/link";
import Reveal from "./Reveal";
import { Chevron } from "./graphics";
import company from "@/data/company.json";

/* Strana Servis: tekstovi sa stare strane servisa (company.json), usklađeni sa ponudom. */

export function ServiceHero() {
  const hq = company.locations[0];
  return (
    <section className="relative h-[480px] w-full overflow-hidden bg-ink text-white md:h-[580px]">
      <img src="/images/servis-hero.jpg" alt="Mehaničar servisira motor traktora" className="absolute inset-0 h-full w-full object-cover object-[50%_40%]" fetchPriority="high" />
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-black/10" />
      <div className="absolute inset-y-0 left-0 hidden w-[65%] bg-linear-to-r from-black/60 to-transparent md:block" />
      <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-4 pb-12 md:px-9 md:pb-16">
        <nav aria-label="Putanja" className="text-[13px] text-white/70">
          <Link href="/" className="hover:text-white">Početna</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Servis</span>
        </nav>
        <h1 className="mt-4 max-w-3xl text-[40px] font-medium leading-[1.02] md:text-[64px]">Servis koji ne čeka sezonu.</h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/80 md:text-[17px]">{company.service.intro}</p>
        <div className="mt-7 flex flex-wrap items-center gap-3 md:gap-4">
          <a href="#zakazivanje" className="rounded-full bg-paper px-8 py-3 text-[14px] text-ink transition-colors hover:bg-canvas">Zakaži servis</a>
          <a href={`tel:${hq.phone.replace(/\D/g, "")}`} className="rounded-full border border-white/50 px-8 py-3 text-[14px] text-white transition-colors hover:bg-white/10">
            Pozovi {hq.phone}
          </a>
        </div>
      </div>
    </section>
  );
}

const AREAS = [
  { n: "01", title: "IMT i IMR traktori", text: company.service.sections[0].text },
  { n: "02", title: "Massey Ferguson", text: "Redovno održavanje i popravke Massey Ferguson traktora - pravilnim održavanjem čuvate vrednost i vek traktora." },
  { n: "03", title: "Traktori iz naše ponude", text: "Servis za Solis, YTO, John Deere i Mahindra traktore koje prodajemo, uz delove dostupne na stanju." },
  { n: "04", title: "Originalni rezervni delovi", text: company.service.sections[2].text + " Delove možete poručiti i online." },
];

export function ServiceAreas() {
  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 py-14 md:px-9 md:py-24">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <Reveal>
          <p className="text-[12px] uppercase tracking-[0.18em] text-mist">Šta servisiramo</p>
          <h2 className="mt-3 text-[34px] font-medium leading-[1.05] md:text-[48px]">Stručna servisna služba na tri lokacije.</h2>
          <p className="mt-6 max-w-md text-[16px] leading-relaxed text-mist">
            Servisiramo traktore i poljoprivrednu mehanizaciju u Svilajncu, Temerinu i Požarevcu - sa delovima na stanju, da vaš zastoj u radu bude što kraći.
          </p>
          <Link href="/rezervni-delovi" className="group mt-6 inline-flex items-center gap-1 text-[14px]">
            Rezervni delovi u online prodavnici
            <Chevron className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
        <div className="grid gap-px overflow-hidden rounded-[4px] border border-line bg-line sm:grid-cols-2">
          {AREAS.map((a, i) => (
            <Reveal key={a.n} delay={i * 80} className="h-full">
              <div className="h-full bg-paper p-5 md:p-8">
                <span className="text-[12px] tracking-[0.14em] text-mist">{a.n}</span>
                <h3 className="mt-2 text-[18px] font-medium md:mt-4 md:text-[20px]">{a.title}</h3>
                <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-mist md:line-clamp-none">{a.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { n: "1", title: "Pozovite najbližu lokaciju", text: "Opišite kvar ili koje održavanje vam treba." },
  { n: "2", title: "Dogovorimo termin", text: "Kažemo vam kada da dovezete traktor ili mašinu." },
  { n: "3", title: "Servis i delovi", text: "Radimo sa delovima na stanju, bez nepotrebnog čekanja." },
];

export function ServiceBooking() {
  return (
    <section id="zakazivanje" className="mx-auto w-full max-w-[1600px] scroll-mt-28 px-4 md:px-9">
      <div className="grid overflow-hidden rounded-[4px] lg:grid-cols-[1fr_1.1fr]">
        <div className="bg-ink p-6 text-paper md:p-12">
          <p className="text-[12px] uppercase tracking-[0.18em] text-paper/60">Zakazivanje</p>
          <h2 className="mt-2 text-[30px] font-medium leading-[1.05] md:text-[40px]">Kako zakazati servis.</h2>
          <ol className="mt-8 divide-y divide-paper/15 border-y border-paper/15">
            {STEPS.map((s) => (
              <li key={s.n} className="flex gap-5 py-5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-paper/30 text-[13px]">{s.n}</span>
                <div>
                  <p className="text-[17px] font-medium">{s.title}</p>
                  <p className="mt-1 text-[14px] text-paper/65">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <div className="bg-canvas p-6 md:p-12">
          <p className="text-[12px] uppercase tracking-[0.18em] text-mist">Pozovite servis</p>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {company.locations.map((l) => (
              <li key={l.slug} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[17px] font-medium">{l.name}</p>
                  <p className="mt-1 text-[13px] text-mist">
                    {l.street}, {l.postalCode} {l.city}
                  </p>
                </div>
                <a
                  href={`tel:${l.phone.replace(/\D/g, "")}`}
                  className="shrink-0 rounded-full bg-accent px-6 py-2.5 text-center text-[14px] text-accent-contrast transition-colors hover:bg-accent-soft"
                >
                  {l.phone}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[14px] text-mist">
            Delovi: <a href="tel:035311137" className="text-ink underline-offset-4 hover:underline">035/311-137</a> · E-mail:{" "}
            <a href={`mailto:${company.email}?subject=Zakazivanje%20servisa`} className="text-ink underline-offset-4 hover:underline">
              {company.email}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
