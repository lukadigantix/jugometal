"use client";

import Link from "next/link";
import Reveal from "./Reveal";
import { Chevron } from "./graphics";
import { t } from "./copy";
import company from "@/data/company.json";

/** Tri lokacije firme - isti raspored kao lista narednih trka u predlošku. */
export default function Locations() {
  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-9 md:pb-24">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <Reveal>
          <h2 className="text-[34px] font-medium md:text-[40px]">{t.locations.heading}</h2>
          <p className="mt-6 max-w-md text-[14px] leading-relaxed text-mist">{t.locations.body}</p>
          <Link href={t.locations.href} className="group mt-4 inline-flex items-center gap-1 text-[14px]">
            {t.locations.link}
            <Chevron className="h-2.5 w-2.5 transition-transform duration-150 group-hover:translate-x-0.5" />
          </Link>
        </Reveal>

        <Reveal delay={150}>
          <p className="text-[12px] uppercase tracking-[0.18em] text-mist">{t.locations.nextUp}</p>
          <ul className="mt-2 divide-y divide-line border-b border-line">
            {company.locations.map((l) => (
              <li key={l.slug} className="flex items-center justify-between gap-4 py-5">
                <div>
                  <p className="text-[16px] font-medium">{l.name}</p>
                  <p className="mt-1 text-[13px] text-mist">
                    {l.street}, {l.postalCode} {l.city} ·{" "}
                    <a href={`tel:${l.phone.replace(/\D/g, "")}`} className="transition-colors duration-150 hover:text-ink">
                      {l.phone}
                    </a>
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-line bg-paper px-2.5 py-1.5 text-[11px] leading-none">
                  {l.isHq ? t.locations.hq : t.locations.branch}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
