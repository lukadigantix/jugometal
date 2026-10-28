"use client";

import Link from "next/link";
import { useState } from "react";
import Reveal from "./Reveal";
import { Chevron } from "./graphics";
import company from "@/data/company.json";

/* Strana Subvencije i finansiranje. Stara strana je bila prazna - ovde su samo opšte činjenice
 * o subvencijama u Srbiji (bez procenata i rokova, oni se menjaju svake godine) i način na koji
 * Jugometal pomaže. Uslove finansiranja treba da potvrdi klijent (docs/ISTRAZIVANJE.md). */

export function SubsidyHero() {
  return (
    <section className="relative h-[460px] w-full overflow-hidden bg-ink text-white md:h-[540px]">
      <img src="/banners/traktori/solis.jpg" alt="Traktor na njivi" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-black/10" />
      <div className="absolute inset-y-0 left-0 hidden w-[65%] bg-linear-to-r from-black/60 to-transparent md:block" />
      <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-4 pb-12 md:px-9 md:pb-16">
        <nav aria-label="Putanja" className="text-[13px] text-white/70">
          <Link href="/" className="hover:text-white">Početna</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Subvencije i finansiranje</span>
        </nav>
        <h1 className="mt-4 max-w-3xl text-[38px] font-medium leading-[1.02] md:text-[60px]">Nova mehanizacija uz podršku države.</h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/80 md:text-[17px]">
          Deo troška za traktor ili priključnu mašinu možete da vratite kroz subvencije. Pomažemo vam da izaberete mašinu i pripremite ponudu za prijavu.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3 md:gap-4">
          <a href="#savet" className="rounded-full bg-paper px-8 py-3 text-[14px] text-ink transition-colors hover:bg-canvas">Zatražite savet</a>
          <a href="#kako" className="rounded-full border border-white/50 px-8 py-3 text-[14px] text-white transition-colors hover:bg-white/10">Kako funkcioniše</a>
        </div>
      </div>
    </section>
  );
}

const PROGRAMS = [
  {
    tag: "Republika Srbija",
    title: "Podsticaji za mehanizaciju",
    text: "Ministarstvo poljoprivrede preko Uprave za agrarna plaćanja raspisuje javne pozive za nabavku nove mehanizacije i opreme. Podsticaj se isplaćuje kao povraćaj dela troška posle kupovine.",
  },
  {
    tag: "Evropska unija",
    title: "IPARD program",
    text: "Bespovratna sredstva za investicije u poljoprivredna gazdinstva, uključujući traktore i priključne mašine. Namenjen je registrovanim gazdinstvima i ima strožu dokumentaciju.",
  },
  {
    tag: "Pokrajina i opštine",
    title: "Lokalni konkursi",
    text: "AP Vojvodina i mnoge opštine imaju svoje konkurse za opremanje gazdinstava. Uslovi i iznosi se razlikuju od mesta do mesta i od godine do godine.",
  },
];

export function SubsidyPrograms() {
  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 py-14 md:px-9 md:py-24">
      <Reveal>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[12px] uppercase tracking-[0.18em] text-mist">Subvencije</p>
            <h2 className="mt-2 text-[34px] font-medium leading-[1.05] md:text-[44px]">Odakle može da stigne podrška.</h2>
          </div>
          <p className="max-w-sm text-[14px] leading-relaxed text-mist md:text-right">
            Iznosi i rokovi menjaju se svake godine - pre kupovine proverite aktuelni javni poziv ili pozovite nas.
          </p>
        </div>
      </Reveal>
      <div data-lenis-prevent-horizontal className="no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory scroll-pl-4 gap-4 overflow-x-auto px-4 md:mx-0 md:mt-10 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0">
        {PROGRAMS.map((p, i) => (
          <Reveal key={p.title} delay={i * 100} className="h-full w-[84%] shrink-0 snap-start md:w-auto">
            <div className="flex h-full flex-col rounded-[4px] border border-line bg-paper p-6 md:p-8">
              <span className="self-start rounded-full bg-canvas px-3 py-1 text-[12px] text-mist">{p.tag}</span>
              <h3 className="mt-5 text-[22px] font-medium">{p.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-mist">{p.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const STEPS = [
  { n: "1", title: "Izbor mašine i ponuda", text: "Zajedno biramo traktor ili mašinu i izdajemo ponudu, odnosno predračun koji vam treba za prijavu." },
  { n: "2", title: "Prijava na javni poziv", text: "Ponudu prilažete uz prijavu na konkurs. Proverite da gazdinstvo bude registrovano i u aktivnom statusu." },
  { n: "3", title: "Kupovina", text: "Posle odobrenja kupujete mašinu i dobijate račun i dokumentaciju za isplatu." },
  { n: "4", title: "Povraćaj sredstava", text: "Podnosite zahtev za isplatu i deo troška vam se vraća na račun." },
];

export function SubsidySteps() {
  return (
    <section id="kako" className="mx-auto w-full max-w-[1600px] scroll-mt-28 px-4 pb-14 md:px-9 md:pb-24">
      <div className="overflow-hidden rounded-[4px] bg-ink p-6 text-paper md:p-12">
        <p className="text-[12px] uppercase tracking-[0.18em] text-paper/60">Kako funkcioniše</p>
        <h2 className="mt-2 max-w-2xl text-[30px] font-medium leading-[1.05] md:text-[40px]">Četiri koraka do mašine sa subvencijom.</h2>
        <ol className="mt-10 grid gap-px overflow-hidden rounded-[4px] bg-paper/15 md:grid-cols-4">
          {STEPS.map((s) => (
            <li key={s.n} className="bg-ink p-5 md:p-7">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-paper/30 text-[14px]">{s.n}</span>
              <p className="mt-5 text-[17px] font-medium">{s.title}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-paper/65">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const FAQ = [
  { q: "Ko može da dobije subvenciju?", a: "Najčešće registrovana poljoprivredna gazdinstva u aktivnom statusu. Tačne uslove (veličina gazdinstva, starost nosioca, područje) propisuje svaki javni poziv." },
  { q: "Da li se subvencija dobija pre ili posle kupovine?", a: "Kod većine programa posle - prvo kupujete, pa vam se deo troška vraća. Zato je važno da ponuda i račun budu u skladu sa uslovima poziva." },
  { q: "Za koje mašine iz vaše ponude može da se konkuriše?", a: "Za nove traktore i priključne mašine. Pozovite nas i proverićemo da li izabrani model ispunjava uslove aktuelnog poziva." },
  { q: "Da li nudite plaćanje na rate ili lizing?", a: "Uslove finansiranja dogovaramo pojedinačno - pozovite najbližu lokaciju i reći ćemo vam šta je trenutno moguće." },
];

export function SubsidyFaq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-9 md:pb-24">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <Reveal>
          <p className="text-[12px] uppercase tracking-[0.18em] text-mist">Česta pitanja</p>
          <h2 className="mt-2 text-[30px] font-medium leading-[1.05] md:text-[40px]">Pitanja koja čujemo najčešće.</h2>
        </Reveal>
        <ul className="divide-y divide-line border-y border-line">
          {FAQ.map((f, i) => (
            <li key={f.q}>
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="flex w-full items-center justify-between gap-6 py-5 text-left"
              >
                <span className="text-[16px] font-medium md:text-[18px]">{f.q}</span>
                <span className={`text-[22px] leading-none text-mist transition-transform ${open === i ? "rotate-45" : ""}`}>+</span>
              </button>
              {open === i && <p className="-mt-1 pb-5 text-[15px] leading-relaxed text-mist">{f.a}</p>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function SubsidyCta() {
  return (
    <section id="savet" className="mx-auto w-full max-w-[1600px] scroll-mt-28 px-4 pb-16 md:px-9 md:pb-24">
      <Reveal>
        <div className="grid gap-6 rounded-[4px] bg-canvas p-6 md:grid-cols-[1fr_auto] md:items-center md:p-12">
          <div>
            <h2 className="text-[28px] font-medium leading-[1.1] md:text-[36px]">Planirate kupovinu uz subvenciju?</h2>
            <p className="mt-2 max-w-xl text-[15px] text-mist">Javite nam koju mašinu razmatrate - pripremićemo ponudu i reći vam šta je potrebno za prijavu.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {company.locations.map((l) => (
              <a key={l.slug} href={`tel:${l.phone.replace(/\D/g, "")}`} className="rounded-full bg-accent px-6 py-3 text-[14px] text-accent-contrast transition-colors hover:bg-accent-soft">
                {l.city} {l.phone}
              </a>
            ))}
            <a href={`mailto:${company.email}?subject=Subvencija%20-%20upit`} className="group inline-flex items-center gap-1 px-2 py-3 text-[14px]">
              {company.email}
              <Chevron className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
