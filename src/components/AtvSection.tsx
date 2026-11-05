"use client";

import Link from "next/link";
import { ArrowRight } from "./graphics";
import OfferCard from "./OfferCard";
import Reveal from "./Reveal";
import { atv } from "@/data/atv";

/* Benda ATV: baner sa terenskom fotografijom (levo) + kartice modela (desno, OfferCard).
 * Baner: pilule gore, naslov, kratak opis, tri prednosti na staklenoj traci, dugme i najniža cena. */
export default function AtvSection() {
  return (
    <section id="atv" className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-9 md:pb-24">
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal className="h-full">
          <Link
            href={atv.cta.href}
            className="group relative isolate flex h-full min-h-[460px] flex-col justify-between overflow-hidden rounded-[12px] bg-[#18191b] p-5 text-white md:min-h-[540px] md:p-8"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- fotografija iz public */}
            <img
              src={atv.image}
              alt={atv.heading}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 -z-10 h-full w-full object-cover object-[60%_center] transition-transform duration-[1200ms] ease-[var(--ease-brand)] group-hover:scale-[1.04]"
            />
            {/* odozdo za tekst, sleva za kontrast, blago odozgo za pilule */}
            <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/85 via-black/35 via-45% to-black/10" />
            <div className="absolute inset-0 -z-10 bg-linear-to-r from-black/40 via-transparent to-transparent" />

            {/* gore */}
            <div className="flex items-start justify-between gap-3">
              <span className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] backdrop-blur-md">
                {atv.eyebrow}
              </span>
              <span className="rounded-full border border-white/20 bg-black/25 px-3.5 py-1.5 text-[12px] backdrop-blur-md">
                {atv.models.length} {atv.models.length === 1 ? "model" : "modela"}
              </span>
            </div>

            {/* dole */}
            <div>
              <h2 className="text-[30px] font-medium leading-[1.02] tracking-[-0.02em] md:text-[40px]">{atv.heading}</h2>
              <p className="mt-3 max-w-md text-[14px] leading-relaxed text-white/75">{atv.lead}</p>

              <ul className="mt-6 grid grid-cols-3 divide-x divide-white/15 overflow-hidden rounded-[8px] border border-white/15 bg-white/[0.06] backdrop-blur-md">
                {atv.highlights.map(({ icon: Icon, value, label }) => (
                  <li key={label} className="flex min-w-0 flex-col gap-2 px-3 py-3 md:flex-row md:items-center md:gap-3 md:px-4">
                    <Icon className="size-[18px] shrink-0 text-white/80" strokeWidth={1.6} aria-hidden />
                    <span className="min-w-0">
                      <span className="block text-[14px] font-medium leading-tight">{value}</span>
                      <span className="block truncate text-[11px] text-white/55">{label}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
                <span className="inline-flex h-12 items-center gap-3 rounded-full bg-white pl-6 pr-1.5 text-[14px] font-medium text-ink transition-colors duration-300 group-hover:bg-[#e02a33] group-hover:text-white">
                  {atv.cta.label}
                  <span className="grid size-9 place-items-center rounded-full bg-ink text-white transition-colors duration-300 group-hover:bg-white group-hover:text-[#e02a33]">
                    <ArrowRight className="h-3 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </span>
                {atv.fromPrice && (
                  <span className="text-[13px] text-white/60">
                    već od <span className="text-[15px] font-medium text-white">{atv.fromPrice}</span>
                  </span>
                )}
              </div>
            </div>
          </Link>
        </Reveal>

        <div data-lenis-prevent-horizontal className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-pl-4 gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0">
          {atv.models.map((m, i) => (
            <Reveal key={m.key} delay={120 + i * 100} className="h-full w-[82%] shrink-0 snap-start sm:w-auto">
              <OfferCard
                d={{
                  href: m.href,
                  image: m.image,
                  name: m.name,
                  kind: "ATV · Benda",
                  badge: m.badge,
                  note: m.priceNote,
                  rows: m.specs,
                  priceText: m.price,
                }}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
