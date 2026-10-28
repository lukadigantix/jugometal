"use client";

import Link from "next/link";
import { useState } from "react";
import { atvModels } from "@/data/atv";
import company from "@/data/company.json";

const tel = (p: string) => `tel:${p.replace(/\D/g, "")}`;

/* Strana Benda modela: izbor boje (menja sliku), cena, ključni brojevi, oprema, specifikacija, upit, drugi model. */
export default function AtvPage({ slug }: { slug: string }) {
  const m = atvModels.find((x) => x.slug === slug)!;
  const other = atvModels.find((x) => x.slug !== slug)!;
  const [ci, setCi] = useState(0);
  const color = m.colors[ci];
  const [f, setF] = useState({ name: "", phone: "", place: company.locations[0].city, msg: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Zainteresovan/a sam za ${m.name}, boja: ${color.name} (${color.sr}).\n\n${f.msg}\n\n---\nIme i prezime: ${f.name}\nTelefon: ${f.phone}\nNajbliža lokacija: ${f.place}`;
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(`Upit - ${m.name} (${color.name})`)}&body=${encodeURIComponent(body)}`;
  };
  const input = "w-full rounded-[4px] border border-line bg-paper px-4 py-3 text-[15px] placeholder:text-mist focus:border-ink focus:outline-none";

  return (
    <>
      <section className="mx-auto w-full max-w-[1600px] px-4 pb-12 pt-8 md:px-9 md:pb-16 md:pt-12">
        <nav aria-label="Putanja" className="text-[13px] text-mist">
          <Link href="/" className="hover:text-ink">Početna</Link>
          <span className="mx-2">/</span>
          <Link href="/atv" className="hover:text-ink">Benda ATV</Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{m.name.replace("Benda ", "")}</span>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
          {/* slika u izabranoj boji */}
          <div className="min-w-0">
            <div className="relative aspect-[16/11] overflow-hidden rounded-[4px] bg-[radial-gradient(ellipse_at_center,#ffffff_0%,#efeeea_100%)]">
              <img key={color.image} src={color.image} alt={`${m.name} - ${color.name}`} fetchPriority="high" className="absolute inset-0 h-full w-full animate-[heroIn_.4s_ease-out_both] object-contain p-6 md:p-10" />
              {m.onSale && <span className="absolute left-4 top-4 rounded-full bg-[#e02a33] px-3.5 py-1.5 text-[13px] font-medium text-white">{m.saleBadge}</span>}
            </div>
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
              {m.colors.map((c, i) => (
                <button key={c.name} type="button" onClick={() => setCi(i)} aria-label={c.name} className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-[4px] border bg-canvas transition-colors ${i === ci ? "border-ink" : "border-line hover:border-mist"}`}>
                  <img src={c.image} alt="" className="absolute inset-0 h-full w-full object-contain p-1.5" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          {/* info */}
          <div className="flex min-w-0 flex-col">
            <p className="text-[12px] uppercase tracking-[0.18em] text-mist">Benda · ATV / kvad</p>
            <h1 className="mt-2 text-[38px] font-medium leading-[1.02] md:text-[54px]">{m.name.replace("Benda ", "")}</h1>
            <p className="mt-3 text-[16px] text-mist">{m.tagline}</p>

            <div className="mt-6">
              <p className="text-[14px]">
                Boja: <span className="font-medium">{color.name}</span> <span className="text-mist">({color.sr})</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {m.colors.map((c, i) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setCi(i)}
                    aria-label={`${c.name} (${c.sr})`}
                    title={`${c.name} (${c.sr})`}
                    className={`h-9 w-9 rounded-full border-2 p-0.5 transition-colors ${i === ci ? "border-ink" : "border-transparent hover:border-line"}`}
                  >
                    <span className="block h-full w-full rounded-full border border-black/10" style={{ background: c.hex }} />
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[12px] text-mist">{m.colors.length} boje · metalik boje bez doplate</p>
            </div>

            <div className="mt-6 rounded-[4px] bg-canvas p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className={`text-[34px] font-medium leading-none ${m.onSale ? "text-[#e02a33]" : ""}`}>{m.price}</span>
                <span className="text-[13px] text-mist">{m.priceNote}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <a href="#upit" className="flex-1 rounded-full bg-accent px-6 py-3 text-center text-[14px] text-accent-contrast hover:bg-accent-soft">Rezervišite ovaj model</a>
                <a href={tel(company.locations[0].phone)} className="flex-1 rounded-full border border-line bg-paper px-6 py-3 text-center text-[14px] hover:border-ink">
                  Pozovite {company.locations[0].phone}
                </a>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[4px] border border-line bg-line">
              {m.stats.map((s) => (
                <div key={s.label} className="bg-paper p-4">
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block text-[26px] font-medium leading-tight">
                      {s.value}
                      <span className="ml-1 text-[14px] text-mist">{s.unit}</span>
                    </span>
                    <span className="mt-1 block text-[12px] text-mist">{s.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 flex items-center gap-2 text-[14px]">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Produžena garancija 3 godine ili 8.000 km
            </p>
          </div>
        </div>
      </section>

      {/* teren */}
      <section className="relative h-[360px] overflow-hidden bg-ink md:h-[520px]">
        <img src="/atv/benda-teren.jpg" alt="Benda ATV na terenu" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/25 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-[1600px] items-end px-4 pb-10 md:px-9 md:pb-14">
          <div className="max-w-xl text-white">
            <p className="text-[12px] uppercase tracking-[0.18em] text-white/70">Za njivu, šumu i teren</p>
            <p className="mt-2 text-[30px] font-medium leading-[1.05] md:text-[44px]">2WD/4WD na pritisak dugmeta, blokada diferencijala i vitlo u standardu.</p>
          </div>
        </div>
      </section>

      {/* oprema + specifikacija */}
      <section className="mx-auto grid w-full max-w-[1600px] gap-12 px-4 py-14 md:px-9 md:py-20 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        <div>
          <h2 className="text-[28px] font-medium md:text-[36px]">Standardna oprema</h2>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {m.equipment.map((e) => (
              <li key={e} className="flex gap-3 py-3 text-[15px]">
                <svg viewBox="0 0 16 16" className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden>
                  <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {e}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-[28px] font-medium md:text-[36px]">Tehnička specifikacija</h2>
            <span className="text-[12px] text-mist">Fabrički podaci Benda</span>
          </div>
          <div className="mt-6 grid gap-8 md:grid-cols-2">
            {m.specs.map((g) => (
              <div key={g.group}>
                <p className="text-[12px] uppercase tracking-[0.18em] text-mist">{g.group}</p>
                <dl className="mt-2 rounded-[4px] bg-canvas px-4 text-[14px]">
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
        </div>
      </section>

      {/* upit */}
      <section id="upit" className="mx-auto w-full max-w-[1600px] scroll-mt-28 px-4 pb-14 md:px-9 md:pb-20">
        <div className="grid overflow-hidden rounded-[4px] border border-line lg:grid-cols-[1fr_1.3fr]">
          <div className="relative bg-ink p-6 text-paper md:p-10">
            <p className="text-[12px] uppercase tracking-[0.18em] text-paper/60">Rezervacija</p>
            <h2 className="mt-2 text-[28px] font-medium leading-[1.05] md:text-[36px]">{m.name.replace("Benda ", "")} u boji {color.name}.</h2>
            <img src={color.image} alt="" className="mt-6 w-full max-w-[420px] object-contain" />
            <p className="mt-4 text-[15px] text-paper/70">Pošaljite upit ili pozovite - javljamo dostupnost boje i rok isporuke.</p>
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
            <label className="grid gap-1.5 text-[13px] text-mist">
              Boja
              <select value={ci} onChange={(e) => setCi(+e.target.value)} className={input}>
                {m.colors.map((c, i) => (
                  <option key={c.name} value={i}>{c.name} ({c.sr})</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 text-[13px] text-mist">
              Najbliža lokacija
              <select value={f.place} onChange={(e) => setF({ ...f, place: e.target.value })} className={input}>
                {company.locations.map((l) => (
                  <option key={l.slug}>{l.city}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 text-[13px] text-mist md:col-span-2">
              Poruka (nije obavezno)
              <textarea value={f.msg} onChange={(e) => setF({ ...f, msg: e.target.value })} rows={4} className={input} placeholder="Registracija, dodatna oprema, plaćanje..." />
            </label>
            <div className="flex flex-wrap items-center gap-4 md:col-span-2">
              <button type="submit" className="rounded-full bg-accent px-8 py-3 text-[14px] text-accent-contrast hover:bg-accent-soft">Pošalji upit</button>
              <p className="text-[12px] text-mist">Otvoriće se vaš e-mail sa modelom i bojom.</p>
            </div>
          </form>
        </div>
      </section>

      {/* drugi model */}
      <section className="mx-auto w-full max-w-[1600px] px-4 pb-16 md:px-9 md:pb-24">
        <Link href={other.href} className="group grid items-center gap-6 overflow-hidden rounded-[4px] bg-canvas p-6 md:grid-cols-[1fr_1.2fr] md:p-10">
          <div>
            <p className="text-[12px] uppercase tracking-[0.18em] text-mist">Pogledajte i</p>
            <p className="mt-2 text-[28px] font-medium md:text-[36px]">{other.name.replace("Benda ", "")}</p>
            <p className="mt-2 text-[15px] text-mist">{other.tagline}</p>
            <p className="mt-4 text-[22px] font-medium">{other.price}</p>
            <span className="mt-5 inline-block rounded-full bg-accent px-6 py-2.5 text-[14px] text-accent-contrast">Pogledaj model</span>
          </div>
          <img src={other.image} alt={other.name} loading="lazy" className="w-full object-contain transition-transform duration-500 group-hover:scale-[1.03]" />
        </Link>
      </section>
    </>
  );
}
