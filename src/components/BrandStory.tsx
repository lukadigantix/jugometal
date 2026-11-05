"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import Reveal from "./Reveal";
import { ArrowRight } from "./graphics";
import { t } from "./copy";
import { PartnersMarquee, STATS } from "./Partners";
import { cityName, mapQuery, useSite } from "@/lib/site-context";

/* O nama na početnoj: tekst, brojke i dugmad levo, zgrada firme desno (oznaka „Od 1990." gore, staklena kartica
 * sa adresom dole); ispod traka sa logoima partnera. Brojke modela, brendova i delova dolaze iz kataloga. */

const FOUNDED = 1990;
// godina iz teksta u copy.ts (new Date() pri renderovanju ne prolazi Next proveru za cacheComponents)
const YEAR = Number(/\d{4}/.exec(t.footer.copyright)?.[0] ?? FOUNDED + 35);
const mapLink = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

export type BrandStats = { tractorModels: number; tractorBrands: number; parts: number };

export default function BrandStory({ stats }: { stats?: BrandStats }) {
  const { contact } = useSite();
  const years = YEAR - FOUNDED;
  const numbers = stats
    ? [
        { value: `${FOUNDED}.`, label: "godina osnivanja" },
        { value: String(stats.tractorModels), label: "modela traktora" },
        { value: String(stats.tractorBrands), label: "brendova traktora" },
        { value: String(stats.parts), label: "delova u online prodavnici" },
      ]
    : STATS;

  return (
    <section id="o-nama" className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-9 md:pb-24">
      <div className="grid items-stretch gap-8 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <Reveal className="flex flex-col justify-center">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33]">Jugometal d.o.o. Svilajnac</p>
          <h2 className="mt-3 text-[32px] font-medium leading-[1.02] tracking-[-0.02em] md:text-[44px]">
            {years} godina u poslu<span className="text-[#e02a33]">.</span>
          </h2>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-mist">
            Osnovani smo {FOUNDED}. godine u Svilajncu. Višegodišnji rad, saradnja sa poljoprivrednicima i posvećenost potrebama kupaca
            doveli su nas do mesta jednog od vodećih prodavaca poljoprivredne mehanizacije u Srbiji.
          </p>

          {/* brojke u jednom redu, razdvojene linijama */}
          <dl className="mt-8 grid grid-cols-2 border-t border-line sm:grid-cols-4 md:mt-10">
            {numbers.map((s, i) => (
              <div
                key={s.label}
                className={`flex flex-col-reverse justify-end border-b border-line py-5 sm:border-b-0 sm:pt-6 ${i % 2 === 1 ? "pl-5" : "pr-5"} sm:px-0 ${i > 0 ? "sm:border-l sm:pl-5" : ""} ${i % 2 === 1 ? "border-l border-line" : ""}`}
              >
                <dt className="mt-2 text-[12px] leading-snug text-mist">{s.label}</dt>
                <dd className="text-[28px] font-medium leading-none tracking-[-0.02em] tabular-nums md:text-[34px]">{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 md:mt-10">
            <Link
              href="/o-nama"
              className="group inline-flex h-12 items-center gap-3 rounded-full bg-ink pl-6 pr-1.5 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-[#e02a33]"
            >
              Više o nama
              <span className="grid size-9 place-items-center rounded-full bg-white text-ink transition-colors duration-200 group-hover:text-[#e02a33]">
                <ArrowRight className="h-3 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </Link>
            <Link href="/kontakt" className="group inline-flex items-center gap-2 text-[14px] text-ink/75 transition-colors hover:text-ink">
              Posetite nas
              <ArrowRight className="h-2.5 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>

        <Reveal delay={150} className="h-full">
          <div className="group relative isolate h-full min-h-[320px] overflow-hidden rounded-[12px] bg-[#18191b] md:min-h-[440px] lg:min-h-[600px]">
            {/* eslint-disable-next-line @next/next/no-img-element -- fotografija iz public */}
            <img
              src="/banners/firma.jpg"
              alt="Jugometal prodajno-servisni centar u Svilajncu"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 -z-10 h-full w-full object-cover object-[30%_50%] transition-transform duration-[1200ms] ease-[var(--ease-brand)] group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/70 via-transparent via-45% to-black/15" />

            <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/30 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-md md:left-6 md:top-6">
              Od {FOUNDED}.
            </span>

            {/* adresa i put do nas */}
            <div className="absolute inset-x-4 bottom-4 flex flex-col gap-4 rounded-[8px] border border-white/15 bg-black/40 p-4 text-white backdrop-blur-md sm:flex-row sm:items-center sm:justify-between md:inset-x-6 md:bottom-6 md:p-5">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.16em] text-white/60">Prodajno-servisni centar</p>
                <p className="mt-1.5 text-[16px] font-medium leading-snug">Prodaja, servis i rezervni delovi na jednom mestu</p>
                {(contact.street || contact.city) && (
                  <p className="mt-1 flex items-center gap-1.5 text-[13px] text-white/65">
                    <MapPin className="size-3.5 shrink-0" strokeWidth={1.8} aria-hidden />
                    {[contact.street, cityName(contact.city)].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
              <a
                href={mapLink(mapQuery(contact))}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn inline-flex h-10 shrink-0 items-center gap-2 self-start rounded-full bg-white px-4 text-[13px] font-medium text-ink transition-colors duration-200 hover:bg-[#e02a33] hover:text-white sm:self-auto"
              >
                Uputstva za put
                <ArrowRight className="h-2.5 w-3 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      <PartnersMarquee />
    </section>
  );
}
