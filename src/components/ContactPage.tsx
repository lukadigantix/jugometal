"use client";

import Link from "next/link";
import { useState } from "react";
import Reveal from "./Reveal";
import { ArrowRight } from "./graphics";
import company from "@/data/company.json";

/* Strana Kontakt: sve tri lokacije sa brojevima sa stare kontakt strane (company.json),
 * mapa po lokaciji (Google Maps embed bez API ključa) i forma koja otvara e-mail sa
 * popunjenom porukom - sajt još nema backend. Radno vreme nije poznato (pitati klijenta). */

const tel = (p: string) => `tel:${p.replace(/\D/g, "")}`;
/* upit po lokaciji: Svilajnac po nazivu firme (Google ima pin firme), ostale po adresi sa gradom na početku
 * - "Beogradski put 17/A" bez grada na početku Google smešta u Lajkovac */
const MAP_Q: Record<string, string> = {
  svilajnac: "JUGOMETAL d.o.o. Svilajnac, Kneza Miloša 81, Svilajnac",
  temerin: "Temerin, Novosadska 634",
  // Požarevac: Google ne poznaje "Beogradski put 17/A" (pada u Lajkovac ili na reku) - bez mape dok klijent ne da tačnu lokaciju
};
const mapSrc = (l: (typeof company.locations)[number]) =>
  `https://www.google.com/maps?q=${encodeURIComponent(MAP_Q[l.slug])}&z=16&output=embed`;

export function ContactHero() {
  const hq = company.locations[0];
  const QUICK = [
    { label: "Prodaja i informacije", value: hq.phone, href: tel(hq.phone), note: "Svilajnac, sedište" },
    { label: "Rezervni delovi", value: hq.phoneParts!, href: tel(hq.phoneParts!), note: "Odeljenje delova" },
    { label: "Pišite nam", value: company.email, href: `mailto:${company.email}`, note: "Za sva tri centra" },
  ];
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <img src="/banners/jugo2.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-45" fetchPriority="high" />
      <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/70 to-ink/30" />
      <div className="relative mx-auto max-w-[1600px] px-4 pb-10 pt-10 md:px-9 md:pb-14 md:pt-16">
        <nav aria-label="Putanja" className="text-[13px] text-white/60">
          <Link href="/" className="hover:text-white">Početna</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Kontakt</span>
        </nav>
        <h1 className="mt-6 max-w-3xl text-[40px] font-medium leading-[1.02] md:text-[72px]">Tu smo za vas.</h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/75 md:text-[17px]">
          Prodaja, servis i rezervni delovi u Svilajncu, Temerinu i Požarevcu. Pozovite, pišite ili svratite.
        </p>
        <div className="mt-10 grid gap-px overflow-hidden rounded-[4px] bg-white/15 md:mt-14 md:grid-cols-3">
          {QUICK.map((q) => (
            <a key={q.label} href={q.href} className="group flex items-center justify-between gap-4 bg-ink/80 p-5 backdrop-blur transition-colors hover:bg-ink md:p-7">
              <span>
                <span className="block text-[12px] uppercase tracking-[0.16em] text-white/55">{q.label}</span>
                <span className="mt-2 block text-[20px] font-medium md:text-[24px]">{q.value}</span>
                <span className="mt-1 block text-[13px] text-white/55">{q.note}</span>
              </span>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/40 transition-colors group-hover:border-white group-hover:bg-white group-hover:text-ink">
                <ArrowRight className="h-3 w-4" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactLocations() {
  const [active, setActive] = useState(company.locations[0].slug);
  const l = company.locations.find((x) => x.slug === active)!;
  const rows = [
    { label: "Telefon", value: l.phone, href: tel(l.phone) },
    l.phoneParts && { label: "Rezervni delovi", value: l.phoneParts, href: tel(l.phoneParts) },
    l.mobile && { label: "Mobilni", value: l.mobile, href: tel(l.mobile) },
    l.fax && { label: "Faks", value: l.fax },
    { label: "E-mail", value: company.email, href: `mailto:${company.email}` },
  ].filter(Boolean) as { label: string; value: string; href?: string }[];

  return (
    <section id="lokacije" className="mx-auto w-full max-w-[1600px] px-4 py-14 md:px-9 md:py-24">
      <Reveal>
        <p className="text-[12px] uppercase tracking-[0.18em] text-mist">Lokacije</p>
        <h2 className="mt-2 text-[34px] font-medium leading-[1.05] md:text-[44px]">Tri prodajno-servisna centra.</h2>
      </Reveal>
      <div className="mt-8 grid overflow-hidden rounded-[4px] border border-line lg:mt-10 lg:grid-cols-[400px_1fr]">
        {/* izbor lokacije */}
        <div className="flex flex-col border-b border-line lg:border-b-0 lg:border-r">
          <div role="tablist" aria-label="Lokacije" className="grid grid-cols-3 lg:grid-cols-1">
            {company.locations.map((x) => {
              const on = x.slug === active;
              return (
                <button
                  key={x.slug}
                  role="tab"
                  aria-selected={on}
                  onClick={() => setActive(x.slug)}
                  className={`relative border-line px-3 py-4 text-left transition-colors lg:border-b lg:px-7 lg:py-6 ${on ? "bg-paper" : "bg-canvas hover:bg-paper"} ${x.slug !== company.locations[0].slug ? "border-l lg:border-l-0" : ""}`}
                >
                  <span className={`absolute inset-x-0 bottom-0 h-[2px] bg-accent transition-opacity lg:inset-y-0 lg:left-0 lg:right-auto lg:h-auto lg:w-[3px] ${on ? "opacity-100" : "opacity-0"}`} />
                  <span className="block text-[15px] font-medium lg:text-[20px]">{x.city}</span>
                  <span className="mt-0.5 hidden text-[13px] text-mist lg:block">{x.street}</span>
                  <span className="mt-2 hidden text-[13px] lg:block">{x.phone}</span>
                </button>
              );
            })}
          </div>
          {/* detalji izabrane lokacije */}
          <div key={l.slug} className="animate-[heroIn_.4s_ease-out_both] p-5 lg:mt-auto lg:p-7">
            <div className="flex items-center gap-2">
              <h3 className="text-[18px] font-medium">{l.name}</h3>
              <span className="rounded-full border border-line px-2.5 py-0.5 text-[11px]">{l.isHq ? "Sedište" : "Prodaja i servis"}</span>
            </div>
            <p className="mt-1 text-[14px] text-mist">
              {l.street}, {l.postalCode} {l.city}
            </p>
            <dl className="mt-4 text-[14px]">
              {rows.map((r) => (
                <div key={r.label} className="flex justify-between gap-4 border-b border-line py-2.5">
                  <dt className="text-mist">{r.label}</dt>
                  <dd className="text-right">{r.href ? <a href={r.href} className="hover:text-mist">{r.value}</a> : r.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={tel(l.phone)} className="rounded-full bg-accent px-6 py-2.5 text-[14px] text-accent-contrast transition-colors hover:bg-accent-soft">
                Pozovi {l.city}
              </a>
              <a href={l.googleMaps} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line px-6 py-2.5 text-[14px] transition-colors hover:border-ink">
                Uputstva za put
              </a>
            </div>
          </div>
        </div>
        {/* mapa */}
        <div className="relative min-h-[300px] bg-canvas md:min-h-[420px] lg:min-h-[560px]">
          {MAP_Q[l.slug] ? (
            <iframe
              key={l.slug}
              title={`Mapa - ${l.name}`}
              src={mapSrc(l)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 grayscale-[25%]"
            />
          ) : (
            <div className="absolute inset-0">
              <img src="/banners/masine.jpg" alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-white">
                <svg viewBox="0 0 24 24" className="h-10 w-10" aria-hidden>
                  <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="12" cy="10" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                </svg>
                <p className="text-[24px] font-medium">{l.street}</p>
                <p className="text-[15px] text-white/80">{l.postalCode} {l.city}</p>
                <a href={l.googleMaps} target="_blank" rel="noopener noreferrer" className="mt-2 rounded-full bg-paper px-6 py-2.5 text-[14px] text-ink">
                  Otvori u Google mapama
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

const TOPICS = ["Traktori", "Priključne mašine", "Rezervni delovi", "Servis", "Subvencije i finansiranje", "Benda ATV", "Ostalo"];

export function ContactForm() {
  const [f, setF] = useState({ name: "", phone: "", email: "", place: company.locations[0].city, topic: TOPICS[0], msg: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `${f.topic} - upit sa sajta (${f.place})`;
    const body = `${f.msg}\n\n---\nIme i prezime: ${f.name}\nTelefon: ${f.phone}\nE-mail: ${f.email}\nLokacija: ${f.place}`;
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  const input = "w-full rounded-[4px] border border-line bg-paper px-4 py-3 text-[15px] placeholder:text-mist focus:border-ink focus:outline-none";
  return (
    <section id="poruka" className="scroll-mt-28 bg-canvas">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-4 py-14 md:px-9 md:py-24 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <Reveal>
          <p className="text-[12px] uppercase tracking-[0.18em] text-mist">Pišite nam</p>
          <h2 className="mt-2 text-[34px] font-medium leading-[1.05] md:text-[44px]">Pošaljite upit.</h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-mist">
            Napišite model traktora, šifru dela ili opis kvara - prosledićemo upit pravoj osobi na najbližoj lokaciji.
          </p>
          <ul className="mt-8 space-y-4 text-[14px]">
            {company.locations.map((l) => (
              <li key={l.slug} className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
                <span className="text-mist">{l.city}</span>
                <a href={tel(l.phone)} className="font-medium hover:text-mist">{l.phone}</a>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={100}>
          <form onSubmit={submit} className="grid gap-4 rounded-[4px] bg-paper p-6 shadow-[0_10px_40px_rgba(0,0,0,0.05)] md:grid-cols-2 md:p-10">
            <label className="grid gap-1.5 text-[13px] text-mist">
              Ime i prezime
              <input required value={f.name} onChange={set("name")} className={input} autoComplete="name" />
            </label>
            <label className="grid gap-1.5 text-[13px] text-mist">
              Telefon
              <input required value={f.phone} onChange={set("phone")} className={input} placeholder="06x xxx xxxx" type="tel" autoComplete="tel" />
            </label>
            <label className="grid gap-1.5 text-[13px] text-mist">
              E-mail (nije obavezno)
              <input value={f.email} onChange={set("email")} className={input} type="email" autoComplete="email" />
            </label>
            <label className="grid gap-1.5 text-[13px] text-mist">
              Najbliža lokacija
              <select value={f.place} onChange={set("place")} className={input}>
                {company.locations.map((l) => (
                  <option key={l.slug}>{l.city}</option>
                ))}
              </select>
            </label>
            <fieldset className="md:col-span-2">
              <legend className="text-[13px] text-mist">Tema</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {TOPICS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setF({ ...f, topic: t })}
                    aria-pressed={f.topic === t}
                    className={`rounded-full border px-4 py-2 text-[13px] transition-colors ${f.topic === t ? "border-accent bg-accent text-accent-contrast" : "border-line bg-paper hover:border-ink"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>
            <label className="grid gap-1.5 text-[13px] text-mist md:col-span-2">
              Poruka
              <textarea required value={f.msg} onChange={set("msg")} rows={5} className={input} placeholder="Model traktora, šifra dela, opis kvara..." />
            </label>
            <div className="flex flex-wrap items-center gap-4 md:col-span-2">
              <button type="submit" className="rounded-full bg-accent px-8 py-3 text-[14px] text-accent-contrast transition-colors hover:bg-accent-soft">
                Pošalji upit
              </button>
              <p className="text-[12px] text-mist">Otvoriće se vaš e-mail program sa popunjenom porukom.</p>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

export function ContactCompany() {
  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 py-10 md:px-9 md:py-14">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[16px] font-medium">{company.legalName}</p>
          <p className="mt-1 text-[14px] text-mist">
            {company.locations[0].street}, {company.locations[0].postalCode} {company.locations[0].city} · {company.email}
          </p>
        </div>
        <div className="flex gap-3">
          <a href={company.social.facebook} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line px-5 py-2.5 text-[14px] hover:border-ink">Facebook</a>
          <a href={company.social.instagram} target="_blank" rel="noopener noreferrer" className="rounded-full border border-line px-5 py-2.5 text-[14px] hover:border-ink">Instagram</a>
        </div>
      </div>
    </section>
  );
}
