"use client";

import Link from "next/link";
import { Clock, Package, Phone, Tractor, Wrench } from "lucide-react";
import Reveal from "./Reveal";
import { ArrowRight } from "./graphics";
import { cityName, tel, useSite } from "@/lib/site-context";

/* Servis na početnoj: fotografija radionice (oznaka mesta gore, radno vreme dole, iz admina) + tamni blok
 * sa tri usluge, telefonima servisa i delova i pozivom na zakazivanje (/servis#zakazivanje).
 * Isti vizuelni jezik kao Benda baner i kartice: zaobljenje 12px, staklene oznake, crveno dugme sa strelicom. */
const POINTS = [
  { icon: Tractor, title: "IMT i IMR", text: "Godinama servisiramo IMT i IMR traktore i snabdevamo tržište delovima za njih." },
  { icon: Wrench, title: "Massey Ferguson, Solis, YTO", text: "Redovno održavanje i popravke traktora iz naše ponude i ostalih brendova." },
  { icon: Package, title: "Originalni rezervni delovi", text: "Delovi na stanju u Svilajncu, pa je zastoj u radu sveden na minimum." },
];

export default function EditorialCards() {
  const { contact, workingHours } = useSite();
  const phones = [
    { label: "Servis i prodaja", phone: contact.phone },
    { label: "Rezervni delovi", phone: contact.phoneParts },
  ].filter((x) => x.phone);

  return (
    <section id="servis" className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-9 md:pb-24">
      <Reveal>
        <div className="grid overflow-hidden rounded-[12px] bg-[#18191b] lg:grid-cols-[1.1fr_1fr]">
          {/* fotografija radionice */}
          <div className="group relative isolate min-h-[280px] overflow-hidden md:min-h-[380px] lg:min-h-[600px]">
            {/* eslint-disable-next-line @next/next/no-img-element -- fotografija iz public */}
            <img
              src="/images/servis-radionica.jpg"
              alt="Servisna radionica sa traktorima"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-brand)] group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/60 via-transparent to-black/20" />

            <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/30 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-md md:left-6 md:top-6">
              Radionica · {cityName(contact.city) || "Svilajnac"}
            </span>

            {workingHours.length > 0 && (
              <div className="absolute inset-x-4 bottom-4 rounded-[8px] border border-white/15 bg-black/40 p-4 text-white backdrop-blur-md md:inset-x-auto md:bottom-6 md:left-6 md:min-w-[280px]">
                <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-white/60">
                  <Clock className="size-3.5" strokeWidth={1.8} aria-hidden />
                  Radno vreme servisa
                </p>
                <dl className="mt-3 space-y-1.5 text-[13px]">
                  {workingHours.map((h) => (
                    <div key={h.days} className="flex justify-between gap-6">
                      <dt className="text-white/70">{h.days}</dt>
                      <dd className={`tabular-nums ${h.isOpen ? "font-medium" : "text-white/45"}`}>{h.hours}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>

          {/* sadržaj */}
          <div className="flex flex-col p-6 text-white md:p-10 xl:p-12">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33]">Servis</p>
            <h2 className="mt-3 text-[30px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[38px]">Servis koji ne čeka sezonu.</h2>
            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-white/65">
              Stručna servisna služba i originalni delovi na stanju, na jednom mestu.
            </p>

            <ul className="mt-7 space-y-2.5">
              {POINTS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4 rounded-[8px] border border-white/10 bg-white/[0.03] p-4 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.06]">
                  <span className="grid size-10 shrink-0 place-items-center rounded-[8px] bg-[#e02a33]/15 text-[#e02a33]">
                    <Icon className="size-[18px]" strokeWidth={1.7} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[15px] font-medium leading-snug">{title}</span>
                    <span className="mt-1 block text-[13px] leading-relaxed text-white/55">{text}</span>
                  </span>
                </li>
              ))}
            </ul>

            {phones.length > 0 && (
              <div className={`mt-6 grid gap-2.5 ${phones.length > 1 ? "sm:grid-cols-2" : ""}`}>
                {phones.map((x) => (
                  <a
                    key={x.label}
                    href={tel(x.phone)}
                    className="group flex items-center justify-between gap-3 rounded-[8px] border border-white/10 px-4 py-3 transition-colors duration-200 hover:border-white/30"
                  >
                    <span className="min-w-0">
                      <span className="block text-[11px] uppercase tracking-[0.14em] text-white/45">{x.label}</span>
                      <span className="mt-1 block text-[16px] font-medium tabular-nums">{x.phone}</span>
                    </span>
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/[0.06] text-white/75 transition-colors duration-200 group-hover:bg-white group-hover:text-ink">
                      <Phone className="size-4" strokeWidth={1.7} aria-hidden />
                    </span>
                  </a>
                ))}
              </div>
            )}

            <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-8">
              <Link
                href="/servis#zakazivanje"
                className="group inline-flex h-12 items-center gap-3 rounded-full bg-[#e02a33] pl-6 pr-1.5 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-[#c41f27]"
              >
                Zakaži servis
                <span className="grid size-9 place-items-center rounded-full bg-white text-[#e02a33]">
                  <ArrowRight className="h-3 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </Link>
              <Link href="/servis" className="group inline-flex items-center gap-2 text-[14px] text-white/75 transition-colors hover:text-white">
                Više o servisu
                <ArrowRight className="h-2.5 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
