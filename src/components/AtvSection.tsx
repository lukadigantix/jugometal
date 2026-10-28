"use client";

import Link from "next/link";
import Reveal from "./Reveal";
import { atv } from "@/data/atv";

/* Benda ATV: terenska fotografija sa tekstom (levo) + dve kartice modela (desno). */
export default function AtvSection() {
  return (
    <section id="atv" className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-9 md:pb-24">
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal className="h-full">
          <Link href={atv.cta.href} className="group relative block h-full min-h-[360px] overflow-hidden rounded-[4px] bg-canvas md:min-h-[440px]">
            <img
              src={atv.image}
              alt={atv.heading}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-brand)] group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 max-w-md p-8 text-white md:p-10">
              <p className="text-[12px] uppercase tracking-[0.18em] text-white/80">{atv.eyebrow}</p>
              <h2 className="mt-2 text-[34px] font-medium leading-[1.05] md:text-[40px]">{atv.heading}</h2>
              <p className="mt-3 line-clamp-3 text-[14px] leading-relaxed text-white/85 md:line-clamp-none">{atv.text}</p>
              <span className="mt-6 inline-block rounded-full bg-paper/90 px-8 py-2.5 text-[14px] text-ink backdrop-blur transition-colors duration-150 group-hover:bg-paper">
                {atv.cta.label}
              </span>
            </div>
          </Link>
        </Reveal>

        <div data-lenis-prevent-horizontal className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-pl-4 gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0">
          {atv.models.map((m, i) => (
            <Reveal key={m.key} delay={120 + i * 100} className="h-full w-[82%] shrink-0 snap-start sm:w-auto">
              <div className="flex h-full flex-col overflow-hidden rounded-[4px] border border-line bg-paper">
                <Link href={m.href} aria-label={m.name} className="group relative block aspect-[4/3] bg-white">
                  <img
                    src={m.image}
                    alt={m.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-contain p-5 transition-transform duration-500 ease-[var(--ease-brand)] group-hover:scale-[1.04]"
                  />
                </Link>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[12px] uppercase tracking-[0.14em] text-mist">ATV · Benda</p>
                  <h3 className="mt-2 text-[18px] font-medium leading-snug">
                    <Link href={m.href} className="transition-colors duration-150 hover:text-mist">{m.name}</Link>
                  </h3>
                  <dl className="mt-3 space-y-1 text-[13px]">
                    {m.specs.map((s) => (
                      <div key={s.label} className="flex justify-between gap-3 border-b border-line pb-1">
                        <dt className="text-mist">{s.label}</dt>
                        <dd>{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                    <div>
                      <p className="text-[18px] font-medium">{m.price}</p>
                      <p className="text-[12px] text-mist">{m.priceNote}</p>
                    </div>
                    <Link
                      href={m.href}
                      className="rounded-full bg-accent px-5 py-2.5 text-[13px] text-accent-contrast transition-colors duration-150 ease-[var(--ease-brand)] hover:bg-accent-soft"
                    >
                      Pogledaj model
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
