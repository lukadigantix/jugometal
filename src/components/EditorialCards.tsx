"use client";

import Link from "next/link";
import Reveal from "./Reveal";
import { Chevron } from "./graphics";
import company from "@/data/company.json";

/* Servis: fotografija radionice + tamni blok sa uslugama, telefonima po lokaciji i pozivom na akciju. */
const POINTS = [
  { n: "01", title: "IMT i IMR", text: "Godinama servisiramo IMT i IMR traktore i snabdevamo tržište delovima za njih." },
  { n: "02", title: "Massey Ferguson, Solis, YTO", text: "Redovno održavanje i popravke traktora iz naše ponude i ostalih brendova." },
  { n: "03", title: "Originalni rezervni delovi", text: "Delovi na stanju u Svilajncu, Temerinu i Požarevcu - zastoj u radu sveden na minimum." },
];

export default function EditorialCards() {
  return (
    <section id="servis" className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-9 md:pb-24">
      <Reveal>
        <div className="grid overflow-hidden rounded-[4px] lg:grid-cols-[1.1fr_1fr]">
          <div className="relative min-h-[200px] md:min-h-[320px] lg:min-h-[560px]">
            <img
              src="/images/servis-radionica.jpg"
              alt="Servisna radionica sa traktorima"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col bg-ink p-6 text-paper md:p-12">
            <p className="text-[12px] uppercase tracking-[0.18em] text-paper/60">Servis</p>
            <h2 className="mt-2 text-[34px] font-medium leading-[1.05] md:text-[40px]">Servis koji ne čeka sezonu.</h2>
            <p className="mt-4 max-w-md text-[14px] leading-relaxed text-paper/70">
              Stručna servisna služba na tri lokacije i originalni delovi na stanju.
            </p>

            <ul className="mt-6 divide-y md:mt-8 divide-paper/15 border-y border-paper/15">
              {POINTS.map((p) => (
                <li key={p.n} className="flex gap-5 py-3 md:py-4">
                  <span className="pt-0.5 text-[12px] tracking-[0.14em] text-paper/40">{p.n}</span>
                  <div>
                    <p className="text-[16px] font-medium">{p.title}</p>
                    <p className="mt-1 hidden text-[13px] leading-relaxed text-paper/60 md:block">{p.text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 grid grid-cols-3 gap-4 text-[13px]">
              {company.locations.map((l) => (
                <a key={l.slug} href={`tel:${l.phone.replace(/\D/g, "")}`} className="group">
                  <span className="block text-paper/50">{l.city}</span>
                  <span className="mt-0.5 block transition-opacity group-hover:opacity-70">{l.phone}</span>
                </a>
              ))}
            </div>

            <div className="mt-auto flex flex-wrap items-center gap-5 pt-8">
              <Link
                href="/kontakt"
                className="rounded-full bg-paper px-8 py-3 text-[14px] text-ink transition-colors duration-150 ease-[var(--ease-brand)] hover:bg-canvas"
              >
                Zakaži servis
              </Link>
              <Link href="/servis" className="group inline-flex items-center gap-1 text-[14px] text-paper/80 hover:text-paper">
                Više o servisu
                <Chevron className="h-2.5 w-2.5 transition-transform duration-150 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
