"use client";

import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Reveal from "./Reveal";
import { ArrowRight } from "./graphics";
import { t } from "./copy";
import { Map, MapControls, MapMarker, MarkerContent, MarkerLabel } from "./ui/map";
import { cityName, MAP_POINT, mapLink, mapQuery, tel, useSite } from "@/lib/site-context";

/* Gde smo (početna, O nama, Servis): jedna kartica - levo naslov, četiri kontakt pločice (adresa sa uputstvima,
 * telefon prodaje i servisa, telefon za delove, e-mail), radno vreme i dugme; desno mapa sa Jugometal pinom.
 * Svi podaci iz admina (Podešavanja → Sajt). */
export default function Locations() {
  const { contact: c, workingHours } = useSite();
  const name = c.name || `Jugometal ${cityName(c.city)}`;
  const heading = t.locations.heading.replace(/\.$/, "");

  const tiles = [
    (c.street || c.city) && {
      icon: MapPin,
      label: "Adresa",
      value: c.street || cityName(c.city),
      sub: c.street ? `${c.city} · Uputstva za put` : "Uputstva za put",
      href: mapLink(mapQuery(c)),
      external: true,
    },
    c.phone && { icon: Phone, label: "Prodaja i servis", value: c.phone, sub: "Traktori, mašine, servis", href: tel(c.phone) },
    c.phoneParts && { icon: Phone, label: "Rezervni delovi", value: c.phoneParts, sub: "Odeljenje delova", href: tel(c.phoneParts) },
    c.email && { icon: Mail, label: "E-mail", value: c.email, sub: "Odgovaramo istog radnog dana", href: `mailto:${c.email}` },
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; sub: string; href: string; external?: boolean }[];

  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-9 md:pb-24">
      <Reveal>
        <div className="grid overflow-hidden rounded-[12px] bg-paper ring-1 ring-line lg:grid-cols-[1fr_1.1fr]">
          {/* kontakt */}
          <div className="flex flex-col p-6 md:p-10 xl:p-12">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33]">Posetite nas</p>
            <h2 className="mt-3 text-[30px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[38px]">
              {heading}
              <span className="text-[#e02a33]">.</span>
            </h2>
            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-mist">{t.locations.body}</p>

            {tiles.length > 0 && (
              <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
                {tiles.map(({ icon: Icon, label, value, sub, href, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex h-full items-start gap-3.5 rounded-[10px] bg-canvas p-4 ring-1 ring-transparent transition-[background-color,box-shadow] duration-200 hover:bg-paper hover:ring-line"
                    >
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-paper text-ink ring-1 ring-line transition-colors duration-200 group-hover:bg-[#e02a33] group-hover:text-white group-hover:ring-[#e02a33]">
                        <Icon className="size-[17px]" strokeWidth={1.7} aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[11px] uppercase tracking-[0.14em] text-mist">{label}</span>
                        <span className="mt-1 block break-words text-[15px] font-medium leading-snug">{value}</span>
                        <span className="mt-0.5 block text-[12px] text-mist">{sub}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {workingHours.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line pt-5 text-[13px]">
                <span className="inline-flex items-center gap-2 text-mist">
                  <Clock className="size-4" strokeWidth={1.7} aria-hidden />
                  Radno vreme
                </span>
                {workingHours.map((h) => (
                  <span key={h.days} className={h.isOpen ? "" : "text-mist"}>
                    {h.days} <span className="font-medium tabular-nums">{h.hours}</span>
                  </span>
                ))}
              </div>
            )}

            <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-8">
              <Link
                href={t.locations.href}
                className="group inline-flex h-12 items-center gap-3 rounded-full bg-ink pl-6 pr-1.5 text-[14px] font-medium text-white transition-colors duration-200 hover:bg-[#e02a33]"
              >
                {t.locations.link}
                <span className="grid size-9 place-items-center rounded-full bg-white text-ink transition-colors duration-200 group-hover:text-[#e02a33]">
                  <ArrowRight className="h-3 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </Link>
              <a
                href={mapLink(mapQuery(c))}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 text-[14px] text-ink/75 transition-colors hover:text-ink"
              >
                Uputstva za put
                <ArrowRight className="h-2.5 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>

          {/* mapa */}
          <div className="relative min-h-[320px] border-t border-line bg-canvas md:min-h-[420px] lg:min-h-[560px] lg:border-l lg:border-t-0">
            <div className="absolute inset-0">
              <Map
                center={[MAP_POINT.longitude, MAP_POINT.latitude]}
                zoom={14.5}
                theme="light"
                cooperativeGestures
                locale={{
                  "CooperativeGesturesHandler.WindowsHelpText": "Držite Ctrl i skrolujte da zumirate mapu",
                  "CooperativeGesturesHandler.MacHelpText": "Držite ⌘ i skrolujte da zumirate mapu",
                  "CooperativeGesturesHandler.MobileHelpText": "Pomerajte mapu sa dva prsta",
                }}
              >
                <MapMarker longitude={MAP_POINT.longitude} latitude={MAP_POINT.latitude}>
                  <MarkerContent>
                    <span className="relative flex h-10 w-10 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e02a33]/30" />
                      <span className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#e02a33] bg-white shadow-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element -- favicon sajta */}
                        <img src="/favicon.ico" alt="" aria-hidden className="h-6 w-6 object-contain" />
                      </span>
                    </span>
                  </MarkerContent>
                  <MarkerLabel position="bottom" className="mt-1.5 rounded-full bg-[#18191b] px-3 py-1 text-[11px] font-medium text-white shadow">
                    {name}
                  </MarkerLabel>
                </MapMarker>
                <MapControls position="bottom-right" showZoom />
              </Map>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
