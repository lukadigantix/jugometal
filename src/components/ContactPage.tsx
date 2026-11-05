"use client";

import Link from "next/link";
import { useState } from "react";
import { CircleCheck, Clock, Mail, MapPin, Package, Phone } from "lucide-react";
import Reveal from "./Reveal";
import { ArrowRight } from "./graphics";
import { SocialIcon } from "./FooterView";
import { useInquiry } from "@/lib/useInquiry";
import type { SiteInfo } from "@/lib/site-info";
import { cityName, MAP_POINT, mapLink, mapQuery, tel, useSite } from "@/lib/site-context";
import { Map, MapControls, MapMarker, MarkerContent, MarkerLabel } from "./ui/map";

/* Strana Kontakt, u jeziku početne i strana Akcije, O nama, Servis i Subvencije:
 * 1. hero sa tri staklene kontakt kartice i radnim vremenom  2. upit (forma + tamna kartica sa telefonima i mrežama)
 * 3. lokacija - mapa preko cele širine sa staklenom karticom  4. podaci firme.
 * Adresa, telefoni, e-mail, mreže i radno vreme dolaze iz admina (Podešavanja → Sajt) preko useSite();
 * mapa je mapcn (MapLibre, CARTO pločice). Forma šalje upit u admin (Upiti sa sajta); ako backend ne odgovara, nudi e-mail. */

/* ── 1. hero ── */
export function ContactHero() {
  const { contact: c, workingHours } = useSite();
  const city = cityName(c.city);
  const cards = [
    c.phone && { icon: Phone, label: "Prodaja i informacije", value: c.phone, href: tel(c.phone), note: `${city}, sedište` },
    c.phoneParts && { icon: Package, label: "Rezervni delovi", value: c.phoneParts, href: tel(c.phoneParts), note: "Odeljenje delova" },
    c.email && { icon: Mail, label: "Pišite nam", value: c.email, href: `mailto:${c.email}`, note: "Odgovaramo istog radnog dana" },
  ].filter(Boolean) as { icon: typeof Phone; label: string; value: string; href: string; note: string }[];

  return (
    <section className="relative overflow-hidden bg-[#18191b] text-white">
      {/* eslint-disable-next-line @next/next/no-img-element -- fotografija iz public */}
      <img
        src="/banners/jugo2.jpg"
        alt=""
        aria-hidden
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[60%_center] opacity-50 [mask-image:linear-gradient(to_right,transparent_8%,black_60%)]"
      />
      <div className="absolute inset-0 bg-linear-to-r from-[#18191b] from-10% via-[#18191b]/50 via-50% to-[#18191b]/0" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-linear-to-t from-[#18191b] to-transparent" />

      <div className="relative mx-auto max-w-[1600px] px-4 pb-14 pt-8 md:px-9 md:pb-20 md:pt-12">
        <nav aria-label="Putanja" className="text-[12px] text-white/55">
          <Link href="/" className="transition-colors hover:text-white">Početna</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Kontakt</span>
        </nav>

        <p className="mt-10 text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33] md:mt-16">Kontakt</p>
        <h1 className="mt-3 text-[44px] font-medium leading-[0.98] tracking-[-0.03em] md:text-[64px]">
          Tu smo za vas<span className="text-[#e02a33]">.</span>
        </h1>
        <p className="mt-5 max-w-lg text-[14px] leading-relaxed text-white/70 md:text-[15px]">
          Prodaja, servis i rezervni delovi na jednom mestu.
          <br />
          Pozovite, pišite ili svratite.
        </p>

        {/* kontakt kartice */}
        {cards.length > 0 && (
          <div className={`mt-10 grid gap-3 md:mt-14 ${cards.length === 3 ? "md:grid-cols-3" : cards.length === 2 ? "md:grid-cols-2" : ""}`}>
            {cards.map(({ icon: Icon, label, value, href, note }) => (
              <a
                key={label}
                href={href}
                className="group flex items-center justify-between gap-4 rounded-[12px] border border-white/15 bg-white/[0.06] p-5 backdrop-blur-md transition-colors duration-300 hover:border-white/30 hover:bg-white/[0.1] md:p-6"
              >
                <span className="flex min-w-0 items-start gap-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-colors duration-300 group-hover:bg-[#e02a33]">
                    <Icon className="size-[18px]" strokeWidth={1.7} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] uppercase tracking-[0.16em] text-white/50">{label}</span>
                    <span className="mt-1.5 block truncate text-[19px] font-medium tabular-nums md:text-[21px]">{value}</span>
                    <span className="mt-0.5 block text-[12px] text-white/50">{note}</span>
                  </span>
                </span>
                <span className="grid size-10 shrink-0 place-items-center rounded-full border border-white/25 transition-colors duration-300 group-hover:border-white group-hover:bg-white group-hover:text-ink">
                  <ArrowRight className="h-2.5 w-3 -rotate-45 transition-transform duration-300 group-hover:rotate-0" />
                </span>
              </a>
            ))}
          </div>
        )}

        {workingHours.length > 0 && (
          <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-white/60">
            <span className="inline-flex items-center gap-2">
              <Clock className="size-4" strokeWidth={1.7} aria-hidden />
              Radno vreme
            </span>
            {workingHours.map((h) => (
              <span key={h.days} className={h.isOpen ? "text-white/85" : "text-white/45"}>
                {h.days} <span className="font-medium tabular-nums">{h.hours}</span>
              </span>
            ))}
          </p>
        )}
      </div>
    </section>
  );
}

/* ── 2. upit ── */
const TOPICS = ["Traktori", "Priključne mašine", "Rezervni delovi", "Servis", "Subvencije i finansiranje", "Benda ATV", "Ostalo"];
const FIELD =
  "h-12 w-full rounded-[10px] border border-line bg-canvas px-4 text-[15px] text-ink outline-none transition placeholder:text-mist/70 focus:border-ink focus:bg-paper";

export function ContactForm() {
  const { contact: c, social } = useSite();
  const [f, setF] = useState({ name: "", phone: "", email: "", topic: TOPICS[0], msg: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  const inq = useInquiry();
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `${f.topic} - upit sa sajta`;
    const body = `${f.msg}\n\n---\nIme i prezime: ${f.name}\nTelefon: ${f.phone}\nE-mail: ${f.email}`;
    const type = f.topic === "Servis" ? "servis" : f.topic.startsWith("Subvencije") ? "subvencija" : "kontakt";
    void inq.send({ type, name: f.name, phone: f.phone, email: f.email, message: f.msg, location: "svilajnac", extra: { Tema: f.topic } }, { subject, body });
  };
  const networks = (["instagram", "facebook", "twitter", "tiktok"] as const).filter((k) => social[k]);

  return (
    <section id="poruka" className="mx-auto w-full max-w-[1600px] scroll-mt-28 px-4 py-14 md:px-9 md:py-24">
      <Reveal>
        <div className="grid overflow-hidden rounded-[12px] ring-1 ring-line lg:grid-cols-[1.2fr_1fr]">
          {/* forma */}
          <div className="bg-paper p-6 md:p-10 xl:p-12">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33]">Pišite nam</p>
            <h2 className="mt-3 text-[30px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[38px]">
              Pošaljite upit<span className="text-[#e02a33]">.</span>
            </h2>
            <p className="mt-3 max-w-lg text-[14px] leading-relaxed text-mist">Napišite model traktora, šifru dela ili opis kvara. Prosledićemo upit pravoj osobi.</p>

            {inq.status === "sent" ? (
              <div className="mt-10 flex flex-col items-start">
                <span className="grid size-14 place-items-center rounded-full bg-[#e02a33] text-white">
                  <CircleCheck className="size-7" strokeWidth={1.8} aria-hidden />
                </span>
                <h3 className="mt-6 text-[24px] font-medium leading-tight tracking-[-0.02em]">Upit je poslat.</h3>
                <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-mist">Hvala! Javićemo vam se u najkraćem roku.</p>
                <button type="button" onClick={inq.reset} className="mt-6 text-[13px] font-medium text-ink underline underline-offset-4">
                  Pošaljite još jedan upit
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-8 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-medium">Ime i prezime</span>
                  <input required value={f.name} onChange={set("name")} className={FIELD} autoComplete="name" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-medium">Telefon</span>
                  <input required value={f.phone} onChange={set("phone")} className={FIELD} placeholder="06x xxx xxxx" type="tel" inputMode="tel" autoComplete="tel" />
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-1.5 block text-[12px] font-medium">
                    E-mail <span className="font-normal text-mist">(nije obavezno)</span>
                  </span>
                  <input value={f.email} onChange={set("email")} className={FIELD} type="email" inputMode="email" autoComplete="email" />
                </label>
                <fieldset className="md:col-span-2">
                  <legend className="mb-2 text-[12px] font-medium">Tema</legend>
                  <div className="flex flex-wrap gap-2">
                    {TOPICS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setF({ ...f, topic: t })}
                        aria-pressed={f.topic === t}
                        className={`h-9 rounded-full px-4 text-[13px] transition-colors ${f.topic === t ? "bg-ink text-white" : "bg-canvas text-ink ring-1 ring-line hover:ring-ink"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </fieldset>
                <label className="block md:col-span-2">
                  <span className="mb-1.5 block text-[12px] font-medium">Poruka</span>
                  <textarea required value={f.msg} onChange={set("msg")} rows={5} className={`${FIELD} h-auto resize-y py-3 leading-relaxed`} placeholder="Model traktora, šifra dela, opis kvara…" />
                </label>

                {inq.status === "error" && (
                  <p role="alert" className="rounded-[10px] bg-[#fdecea] px-4 py-3 text-[13px] text-[#b91c1c] md:col-span-2">
                    {inq.error}{" "}
                    <a href={inq.mailto} className="font-medium underline">
                      Pošaljite e-mailom
                    </a>
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 md:col-span-2">
                  <button
                    type="submit"
                    disabled={inq.status === "sending"}
                    className="group inline-flex h-12 items-center gap-3 rounded-full bg-[#e02a33] pl-6 pr-1.5 text-[14px] font-medium text-white transition-colors hover:bg-[#c41f27] disabled:opacity-70"
                  >
                    {inq.status === "sending" ? "Šaljemo upit…" : "Pošaljite upit"}
                    <span className="grid size-9 place-items-center rounded-full bg-white text-[#e02a33]">
                      <ArrowRight className="h-3 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </button>
                  <span className="text-[12px] text-mist">Poruka stiže direktno prodaji i servisu.</span>
                </div>
              </form>
            )}
          </div>

          {/* tamna kartica: telefoni i mreže */}
          <div className="flex flex-col bg-[#18191b] p-6 text-white md:p-10 xl:p-12">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">Radije telefonom?</p>
            <h3 className="mt-3 text-[24px] font-medium leading-tight tracking-[-0.01em] md:text-[28px]">Odgovaramo istog radnog dana.</h3>
            <div className="mt-7 grid gap-2.5">
              {[
                { label: "Prodaja i informacije", phone: c.phone },
                { label: "Rezervni delovi", phone: c.phoneParts },
              ]
                .filter((x) => x.phone)
                .map((x) => (
                  <a key={x.label} href={tel(x.phone)} className="group flex items-center justify-between gap-3 rounded-[10px] border border-white/10 px-4 py-3.5 transition-colors hover:border-white/30">
                    <span>
                      <span className="block text-[11px] uppercase tracking-[0.14em] text-white/45">{x.label}</span>
                      <span className="mt-1 block text-[18px] font-medium tabular-nums">{x.phone}</span>
                    </span>
                    <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/[0.06] text-white/75 transition-colors group-hover:bg-[#e02a33] group-hover:text-white">
                      <Phone className="size-4" strokeWidth={1.7} aria-hidden />
                    </span>
                  </a>
                ))}
              {c.email && (
                <a href={`mailto:${c.email}`} className="group flex items-center justify-between gap-3 rounded-[10px] border border-white/10 px-4 py-3.5 transition-colors hover:border-white/30">
                  <span className="min-w-0">
                    <span className="block text-[11px] uppercase tracking-[0.14em] text-white/45">E-mail</span>
                    <span className="mt-1 block truncate text-[16px] font-medium">{c.email}</span>
                  </span>
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/[0.06] text-white/75 transition-colors group-hover:bg-[#e02a33] group-hover:text-white">
                    <Mail className="size-4" strokeWidth={1.7} aria-hidden />
                  </span>
                </a>
              )}
            </div>
            {networks.length > 0 && (
              <div className="mt-auto pt-8">
                <p className="text-[11px] uppercase tracking-[0.16em] text-white/45">Pratite nas</p>
                <div className="mt-3 flex gap-2">
                  {networks.map((k) => (
                    <a
                      key={k}
                      href={social[k]}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={k}
                      className="grid size-11 place-items-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-white hover:bg-white hover:text-ink"
                    >
                      <SocialIcon name={k} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ── 3. lokacija: mapa preko cele širine sa staklenom karticom ── */
export function ContactLocations({ hours = [] }: { hours?: SiteInfo["workingHours"] }) {
  const { contact: c } = useSite();
  const name = c.name || `Jugometal ${cityName(c.city)}`;
  return (
    <section id="lokacije" className="mx-auto w-full max-w-[1600px] scroll-mt-28 px-4 pb-14 md:px-9 md:pb-24">
      <Reveal>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33]">Lokacija</p>
            <h2 className="mt-3 text-[30px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[38px]">
              Prodajno-servisni centar<span className="text-[#e02a33]">.</span>
            </h2>
          </div>
          <p className="max-w-sm text-[14px] leading-relaxed text-mist md:text-right">Prodaja, servis i rezervni delovi na jednom mestu. Svratite ili nas pozovite pre dolaska.</p>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="relative mt-8 h-[560px] overflow-hidden rounded-[12px] bg-canvas ring-1 ring-line md:mt-10 md:h-[600px]">
          <div className="absolute inset-0">
            <Map
              center={[MAP_POINT.longitude + 0.004, MAP_POINT.latitude]}
              zoom={15}
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
              <MapControls position="bottom-right" showZoom showFullscreen />
            </Map>
          </div>

          {/* staklena kartica preko mape */}
          <div className="absolute inset-x-3 top-3 rounded-[12px] border border-white/60 bg-white/85 p-5 shadow-[0_24px_48px_-24px_rgba(24,25,27,0.45)] backdrop-blur-xl md:inset-x-auto md:left-6 md:top-6 md:w-[360px] md:p-6">
            <div className="flex items-center gap-2">
              <span className="text-[16px] font-medium">{name}</span>
              <span className="rounded-full bg-[#18191b] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-white">Sedište</span>
            </div>
            {(c.street || c.city) && (
              <p className="mt-2 flex items-start gap-2 text-[14px] text-mist">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#e02a33]" strokeWidth={1.8} aria-hidden />
                {[c.street, c.city].filter(Boolean).join(", ")}
              </p>
            )}
            {hours.length > 0 && (
              <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-[13px]">
                {hours.map((h) => (
                  <div key={h.days} className="flex justify-between gap-4">
                    <dt className="text-mist">{h.days}</dt>
                    <dd className={`tabular-nums ${h.isOpen ? "font-medium" : "text-mist"}`}>{h.hours}</dd>
                  </div>
                ))}
              </dl>
            )}
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={mapLink(mapQuery(c))}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex h-10 items-center gap-2 rounded-full bg-[#e02a33] pl-4 pr-1 text-[13px] font-medium text-white transition-colors hover:bg-[#c41f27]"
              >
                Uputstva za put
                <span className="grid size-8 place-items-center rounded-full bg-white text-[#e02a33]">
                  <ArrowRight className="h-2.5 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </a>
              {c.phone && (
                <a href={tel(c.phone)} className="inline-flex h-10 items-center gap-2 rounded-full bg-canvas px-4 text-[13px] ring-1 ring-line transition-colors hover:bg-ink hover:text-white">
                  <Phone className="size-3.5" strokeWidth={1.8} aria-hidden />
                  Pozovite
                </a>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ── 4. podaci firme ── */
export function ContactCompany() {
  const { contact: c, social } = useSite();
  const networks = (["instagram", "facebook", "twitter", "tiktok"] as const).filter((k) => social[k]);
  const ids = [c.pib && `PIB ${c.pib}`, c.mb && `MB ${c.mb}`].filter(Boolean);
  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-9 md:pb-24">
      <div className="flex flex-col gap-5 rounded-[12px] bg-canvas p-6 ring-1 ring-line md:flex-row md:items-center md:justify-between md:px-8">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.16em] text-mist">Podaci firme</p>
          <p className="mt-1.5 text-[17px] font-medium">{c.name}</p>
          <p className="mt-1 text-[13px] text-mist">{[c.street, c.city, c.email, ...ids].filter(Boolean).join(" · ")}</p>
        </div>
        {networks.length > 0 && (
          <div className="flex gap-2">
            {networks.map((k) => (
              <a
                key={k}
                href={social[k]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={k}
                className="grid size-11 place-items-center rounded-full bg-paper text-ink ring-1 ring-line transition-colors hover:bg-ink hover:text-white hover:ring-ink"
              >
                <SocialIcon name={k} />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
