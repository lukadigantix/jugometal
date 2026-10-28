"use client";

import Link from "next/link";
import { useState } from "react";
import { Chevron } from "./graphics";
import TractorCard from "./TractorCard";
import list from "@/data/tractor-list.json";
import tractors from "@/data/tractors.json";
import company from "@/data/company.json";
import { imt } from "@/data/imt-spotlight";
import { partGroups } from "@/data/featured-parts";

/* Strana modela traktora: slika, ključni brojevi, upit za ponudu (e-mail sa modelom), kompletna
 * specifikacija sa starog sajta (za IMT 565.2 DI fabrička TAFE), opis, subvencije, delovi, slični modeli.
 * Cena se ne prikazuje (nema je) - "cena na upit". */

const tel = (p: string) => `tel:${p.replace(/\D/g, "")}`;
const USE_LABEL: Record<string, string> = { kompaktni: "Kompaktni", ratarski: "Ratarski", vocarski: "Voćarski / vinogradarski" };

export default function TractorPage({ brand, model }: { brand: string; model: string }) {
  const t = list.find((x) => x.brand === brand && x.slug === model)!;
  const full = tractors.find((x) => x.slug === `traktori/${brand}/${model}`)!;
  const logo = `/brands/trim/${brand === "john-deere" ? "deere" : brand}.png`;
  const isImt565 = model === "imt-5652-di";

  // specifikacija: sa starog sajta (bez duplikata) ili fabrička za IMT 565.2 DI
  const seen = new Set<string>();
  const oldSpecs = full.specs.filter((s) => !seen.has(s.label) && seen.add(s.label));
  const groups: { group: string; rows: [string, string][] }[] = isImt565
    ? imt.specs.map((g) => ({ group: g.group, rows: g.rows as [string, string][] }))
    : [
        {
          group: "Osnovni podaci",
          rows: [
            ["Snaga motora", `${t.ks} KS`],
            ...(t.drive ? ([["Pogon", t.drive]] as [string, string][]) : []),
            ["Namena", USE_LABEL[t.use]],
          ],
        },
        ...(oldSpecs.length ? [{ group: "Tehnički podaci", rows: oldSpecs.map((s) => [s.label, s.value] as [string, string]) }] : []),
      ];

  const baseStats = [
    { v: String(t.ks), u: "KS", l: "snaga motora" },
    ...(t.drive ? [{ v: t.drive, u: "", l: t.drive === "4WD" ? "pogon na sva 4 točka" : "zadnji pogon" }] : []),
    ...oldSpecs
      .filter((s) => /menjač|podizna|pto|težina/i.test(s.label))
      .slice(0, 4 - (t.drive ? 2 : 1))
      .map((s) => ({ v: s.value, u: "", l: s.label.toLowerCase() })),
  ];
  const stats = isImt565 ? imt.stats.map((x) => ({ v: x.value, u: x.unit, l: x.label })) : baseStats;

  const parts = partGroups.flatMap((g) => g.brands).find((b) => b.slug === brand);
  const similar = list.filter((x) => x.slug !== model && (x.brand === brand || Math.abs(x.ks - t.ks) <= 15)).sort((a, b) => Math.abs(a.ks - t.ks) - Math.abs(b.ks - t.ks)).slice(0, 4);

  const [f, setF] = useState({ name: "", phone: "", place: company.locations[0].city, msg: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Zainteresovan/a sam za traktor ${t.name}.\n\n${f.msg}\n\n---\nIme i prezime: ${f.name}\nTelefon: ${f.phone}\nNajbliža lokacija: ${f.place}`;
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(`Upit za ponudu - ${t.name}`)}&body=${encodeURIComponent(body)}`;
  };
  const input = "w-full rounded-[4px] border border-line bg-paper px-4 py-3 text-[15px] placeholder:text-mist focus:border-ink focus:outline-none";

  return (
    <>
      <section className="mx-auto w-full max-w-[1600px] px-4 pb-12 pt-8 md:px-9 md:pb-16 md:pt-12">
        <nav aria-label="Putanja" className="text-[13px] text-mist">
          <Link href="/" className="hover:text-ink">Početna</Link>
          <span className="mx-2">/</span>
          <Link href="/traktori" className="hover:text-ink">Traktori</Link>
          <span className="mx-2">/</span>
          <Link href={`/traktori/${brand}`} className="hover:text-ink">{t.brandName}</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{t.name}</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
          {/* slika */}
          <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] border border-line bg-white">
            <img src={t.image} alt={t.name} fetchPriority="high" className="absolute inset-0 h-full w-full object-contain p-6 md:p-12" />
            <span className="absolute left-4 top-4 rounded-full bg-ink px-3.5 py-1.5 text-[13px] font-medium text-paper">{t.ks} KS</span>
            {t.drive && <span className="absolute right-4 top-4 rounded-full border border-line bg-paper px-3 py-1.5 text-[12px]">{t.drive}</span>}
          </div>

          {/* info + upit */}
          <div className="flex flex-col">
            <img src={logo} alt={t.brandName} className="h-8 w-auto self-start object-contain" />
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
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" />Servis i originalni delovi na tri lokacije</li>
              {parts && (
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <Link href={parts.href} className="underline-offset-4 hover:underline">{parts.count} rezervnih delova za {t.brandName} u online prodavnici</Link>
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
              {isImt565 && <span className="text-[12px] text-mist">Fabrički podaci IMT / TAFE</span>}
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
            <h2 className="text-[28px] font-medium md:text-[36px]">O modelu</h2>
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-mist">
              {full.texts.map((x, i) => (
                <p key={i}>{x}</p>
              ))}
            </div>
            {isImt565 && (
              <div className="mt-8">
                <p className="text-[12px] uppercase tracking-[0.18em] text-mist">Primena</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {imt.uses.map((u) => (
                    <li key={u} className="rounded-full border border-line bg-paper px-3.5 py-1.5 text-[13px]">{u}</li>
                  ))}
                </ul>
              </div>
            )}
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
              <textarea value={f.msg} onChange={(e) => setF({ ...f, msg: e.target.value })} rows={4} className={input} placeholder="Kabina, utovarivač, priključne mašine, kupovina uz subvenciju..." />
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
            <h2 className="text-[28px] font-medium md:text-[36px]">Slični modeli</h2>
            <Link href="/traktori" className="group inline-flex items-center gap-1 text-[14px]">
              Svi traktori <Chevron className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <ul data-lenis-prevent-horizontal className="no-scrollbar -mx-4 mt-6 flex snap-x snap-mandatory scroll-pl-4 gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:gap-6 lg:grid-cols-4">
            {similar.map((x) => (
              <li key={x.slug} className="w-[82%] shrink-0 snap-start sm:w-auto">
                <TractorCard t={x} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
