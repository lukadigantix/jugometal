"use client";

import Link from "next/link";
import { useState } from "react";
import { Chevron } from "./graphics";
import MachineCard from "./MachineCard";
import list from "@/data/machine-list.json";
import company from "@/data/company.json";

/* Strana priključne mašine (izvedeno iz TractorPage): slika, ključni brojevi, upit za ponudu (e-mail sa modelom), kompletna
 * specifikacija sa starog sajta (za IMT 565.2 DI fabrička TAFE), opis, subvencije, delovi, slični modeli.
 * Cena se ne prikazuje (nema je) - "cena na upit". */

const tel = (p: string) => `tel:${p.replace(/\D/g, "")}`;
const USE_LABEL: Record<string, string> = { ratarstvo: "Ratarstvo", stocarstvo: "Stočarstvo", vocarstvo: "Voćarstvo", transport: "Transport" };

export default function MachinePage({ category, product }: { category: string; product: string }) {
  const t = list.find((x) => x.category === category && x.slug === product)!;
  const groups = [
    { group: "Osnovni podaci", rows: [["Vrsta", t.categoryName], ["Proizvođač", t.brandName], ["Namena", USE_LABEL[t.use]]] as [string, string][] },
    ...(t.specs.length ? [{ group: "Tehnički podaci", rows: t.specs.map((x) => [x.label, x.value] as [string, string]) }] : []),
  ];
  const stats = t.key.map((x) => ({ v: x.value, u: "", l: x.label.toLowerCase() }));
  const similar = list
    .filter((x) => x.slug !== product && (x.category === category || x.use === t.use))
    .sort((a, b) => Number(b.category === category) - Number(a.category === category))
    .slice(0, 4);
  const full = { texts: t.texts };
  const isImt565 = false;
  const parts = null as null | { href: string; count: number };
  const logo = t.logo;
  const [f, setF] = useState({ name: "", phone: "", place: company.locations[0].city, msg: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Zainteresovan/a sam za priključnu mašinu ${t.name}.\n\n${f.msg}\n\n---\nIme i prezime: ${f.name}\nTelefon: ${f.phone}\nNajbliža lokacija: ${f.place}`;
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(`Upit za ponudu - ${t.name}`)}&body=${encodeURIComponent(body)}`;
  };
  const input = "w-full rounded-[4px] border border-line bg-paper px-4 py-3 text-[15px] placeholder:text-mist focus:border-ink focus:outline-none";

  return (
    <>
      <section className="mx-auto w-full max-w-[1600px] px-4 pb-12 pt-8 md:px-9 md:pb-16 md:pt-12">
        <nav aria-label="Putanja" className="text-[13px] text-mist">
          <Link href="/" className="hover:text-ink">Početna</Link>
          <span className="mx-2">/</span>
          <Link href="/prikljucne-masine" className="hover:text-ink">Priključne mašine</Link>
          <span className="mx-2">/</span>
          <Link href={`/prikljucne-masine/${category}`} className="hover:text-ink">{t.categoryName}</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{t.name}</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
          {/* slika */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] border border-line bg-white">
            <img src={t.image} alt={t.name} fetchPriority="high" className="absolute inset-0 h-full w-full object-contain p-6 md:p-12" />
            <span className="absolute left-4 top-4 rounded-full bg-ink px-3.5 py-1.5 text-[13px] font-medium text-paper">{t.categoryName}</span>
          </div>

          {/* info + upit */}
          <div className="flex flex-col">
            {logo ? <img src={logo} alt={t.brandName} className="h-8 w-auto max-w-[180px] self-start object-contain" /> : <p className="text-[13px] uppercase tracking-[0.16em] text-mist">{t.brandName}</p>}
            <h1 className="mt-4 text-[38px] font-medium leading-[1.02] md:text-[56px]">{t.name}</h1>
            <p className="mt-4 text-[16px] leading-relaxed text-mist">{t.text}</p>

            <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[4px] border border-line bg-line">
              {stats.map((s, i) => (
                <div key={s.l} className={`bg-paper p-4 ${stats.length % 2 && i === stats.length - 1 ? "col-span-2" : ""}`}>
                  <dt className="sr-only">{s.l}</dt>
                  <dd>
                    <span className="block truncate text-[24px] font-medium leading-tight md:text-[28px]">
                      {s.v}
                      {s.u && <span className="ml-1 text-[14px] text-mist">{s.u}</span>}
                    </span>
                    <span className="mt-1 block text-[12px] text-mist">{s.l}</span>
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 rounded-[4px] bg-canvas p-5">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-[20px] font-medium">Cena na upit</p>
                <p className="text-[13px] text-mist">Moguća kupovina uz subvencije</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href="#ponuda" className="flex-1 rounded-full bg-accent px-6 py-3 text-center text-[14px] text-accent-contrast hover:bg-accent-soft">Zatražite ponudu</a>
                <a href={tel(company.locations[0].phone)} className="flex-1 rounded-full border border-line bg-paper px-6 py-3 text-center text-[14px] hover:border-ink">
                  Pozovite {company.locations[0].phone}
                </a>
              </div>
            </div>

            <ul className="mt-5 grid gap-2 text-[14px]">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" />Savet oko izbora mašine za vaš traktor</li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <Link href="/rezervni-delovi/delovi-za-prikljucne-masine" className="underline-offset-4 hover:underline">Rezervni delovi za priključne mašine</Link>
              </li>
              {parts && (
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <Link href={parts.href} className="underline-offset-4 hover:underline">{parts.count} delova</Link>
                </li>
              )}
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <Link href="/subvencije" className="underline-offset-4 hover:underline">Pomoć oko ponude za subvencije</Link>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* specifikacija + opis */}
      <section className="border-y border-line bg-canvas">
        <div className="mx-auto grid max-w-[1600px] gap-10 px-4 py-14 md:px-9 md:py-20 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
          <div>
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-[28px] font-medium md:text-[36px]">Tehnička specifikacija</h2>
            </div>
            <div className="mt-6 grid gap-8 md:grid-cols-2">
              {groups.map((g) => (
                <div key={g.group}>
                  <p className="text-[12px] uppercase tracking-[0.18em] text-mist">{g.group}</p>
                  <dl className="mt-2 rounded-[4px] bg-paper px-4 text-[14px]">
                    {g.rows.map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4 border-b border-line py-3 last:border-0">
                        <dt className="text-mist">{k}</dt>
                        <dd className="text-right">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[12px] text-mist">Podaci su informativni. Tačnu opremu i specifikaciju potvrđujemo uz ponudu.</p>
          </div>
          <div>
            <h2 className="text-[28px] font-medium md:text-[36px]">O mašini</h2>
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-mist">
              {full.texts.map((x, i) => (
                <p key={i}>{x}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* upit za ponudu */}
      <section id="ponuda" className="mx-auto w-full max-w-[1600px] scroll-mt-28 px-4 py-14 md:px-9 md:py-20">
        <div className="grid overflow-hidden rounded-[4px] border border-line lg:grid-cols-[1fr_1.3fr]">
          <div className="bg-ink p-6 text-paper md:p-10">
            <p className="text-[12px] uppercase tracking-[0.18em] text-paper/60">Ponuda</p>
            <h2 className="mt-2 text-[28px] font-medium leading-[1.05] md:text-[36px]">Zatražite ponudu za {t.name}.</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-paper/70">Pošaljite upit ili pozovite najbližu lokaciju - javljamo vam cenu, rok isporuke i mogućnosti finansiranja.</p>
            <ul className="mt-8 divide-y divide-paper/15 border-y border-paper/15 text-[14px]">
              {company.locations.map((l) => (
                <li key={l.slug} className="flex justify-between gap-4 py-3">
                  <span className="text-paper/60">{l.city}</span>
                  <a href={tel(l.phone)} className="font-medium hover:opacity-80">{l.phone}</a>
                </li>
              ))}
            </ul>
          </div>
          <form onSubmit={submit} className="grid gap-4 bg-paper p-6 md:grid-cols-2 md:p-10">
            <label className="grid gap-1.5 text-[13px] text-mist">
              Ime i prezime
              <input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={input} autoComplete="name" />
            </label>
            <label className="grid gap-1.5 text-[13px] text-mist">
              Telefon
              <input required type="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className={input} placeholder="06x xxx xxxx" autoComplete="tel" />
            </label>
            <label className="grid gap-1.5 text-[13px] text-mist md:col-span-2">
              Najbliža lokacija
              <select value={f.place} onChange={(e) => setF({ ...f, place: e.target.value })} className={input}>
                {company.locations.map((l) => (
                  <option key={l.slug}>{l.city}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 text-[13px] text-mist md:col-span-2">
              Poruka (nije obavezno)
              <textarea value={f.msg} onChange={(e) => setF({ ...f, msg: e.target.value })} rows={4} className={input} placeholder="Model i snaga vašeg traktora, radni zahvat, kupovina uz subvenciju..." />
            </label>
            <div className="flex flex-wrap items-center gap-4 md:col-span-2">
              <button type="submit" className="rounded-full bg-accent px-8 py-3 text-[14px] text-accent-contrast hover:bg-accent-soft">Pošalji upit</button>
              <p className="text-[12px] text-mist">Otvoriće se vaš e-mail sa popunjenim upitom.</p>
            </div>
          </form>
        </div>
      </section>

      {/* slični modeli */}
      {similar.length > 0 && (
        <section className="mx-auto w-full max-w-[1600px] px-4 pb-16 md:px-9 md:pb-24">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-[28px] font-medium md:text-[36px]">Slične mašine</h2>
            <Link href="/prikljucne-masine" className="group inline-flex items-center gap-1 text-[14px]">
              Sve mašine <Chevron className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <ul data-lenis-prevent-horizontal className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory scroll-pl-4 gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:gap-6 lg:grid-cols-4">
            {similar.map((x) => (
              <li key={x.slug} className="w-[82%] shrink-0 snap-start sm:w-auto">
                <MachineCard m={x} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
