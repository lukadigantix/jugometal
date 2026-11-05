"use client";

import Link from "next/link";
import { Handshake, Phone, Tractor, Wrench } from "lucide-react";
import Reveal from "./Reveal";
import { ArrowRight } from "./graphics";
import { t } from "./copy";
import company from "@/data/company.json";
import type { NavItem } from "@/lib/catalog";
import { cityName, tel, useSite } from "@/lib/site-context";

/* Strana O nama, u jeziku početne i strane Akcije. Tekstovi sa starog sajta (company.json), bez dodatih činjenica;
 * brojke (modeli, brendovi, delovi) iz kataloga, godine u poslu iz godine u copyright tekstu. */

const FOUNDED = 1990;
// godina iz teksta u copy.ts (new Date() pri renderovanju ne prolazi Next proveru za cacheComponents)
const YEAR = Number(/\d{4}/.exec(t.footer.copyright)?.[0] ?? FOUNDED + 35);
const YEARS = YEAR - FOUNDED;

export type AboutStats = { tractorBrands: NavItem[]; parts: number };

/* Tekstovi sa starog sajta, usklađeni sa današnjom ponudom (bez Belarusa, Carrara i Zetora; ispravljena slovna greška). */
const OFFER =
  "U ponudi su traktori Solis, IMT, John Deere, YTO i Mahindra. Podržavamo domaće proizvođače priključnih mašina kao što su FPM Agromehanika, Morava i Majevica, kao i renomirane firme iz regiona poput SIP Šempeter, INO Brežice, Gorenc i Agromehanika Kranj.";
const VALUES = [
  { icon: Handshake, title: "Višegodišnji rad", text: "Višegodišnji rad, saradnja sa poljoprivrednicima, poslovnost i posvećenost potrebama kupaca doprineli su da Jugometal postane jedan od vodećih prodavaca poljoprivredne mehanizacije." },
  { icon: Tractor, title: "Široka ponuda traktora", text: company.about.sections[1].text },
  { icon: Wrench, title: "Servis i originalni delovi", text: "Stručna servisna služba i delovi na stanju, za IMT, IMR, Massey Ferguson i brendove iz naše ponude. Delove možete poručiti i online." },
];

const BRAND_LOGO: Record<string, string> = {
  solis: "/brands/trim/solis.svg",
  imt: "/brands/trim/imt.svg",
  "john-deere": "/brands/trim/deere.svg",
  yto: "/brands/trim/yto.svg",
  mahindra: "/brands/trim/mahindra.svg",
};

const plural = (n: number, one: string, few: string, many: string) => {
  const last = n % 10;
  const teen = n % 100 >= 11 && n % 100 <= 14;
  return last === 1 && !teen ? one : last >= 2 && last <= 4 && !teen ? few : many;
};

/* ── 1. hero ── */
export function AboutHero({ stats }: { stats?: AboutStats }) {
  const models = stats?.tractorBrands.reduce((n, b) => n + b.count, 0) ?? 0;
  const numbers = [
    { value: `${FOUNDED}.`, label: "godina osnivanja" },
    { value: String(YEARS), label: `${plural(YEARS, "godina", "godine", "godina")} u poslu` },
    ...(models ? [{ value: String(models), label: "modela traktora" }] : []),
    ...(stats?.tractorBrands.length ? [{ value: String(stats.tractorBrands.length), label: "brendova" }] : []),
    ...(stats?.parts ? [{ value: String(stats.parts), label: "delova online" }] : []),
  ];

  return (
    <section className="relative overflow-hidden bg-[#18191b] text-white">
      {/* eslint-disable-next-line @next/next/no-img-element -- fotografija iz public */}
      <img
        src="/banners/jugo.jpg"
        alt=""
        aria-hidden
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[65%_center] opacity-50 [mask-image:linear-gradient(to_right,transparent_8%,black_60%)]"
      />
      <div className="absolute inset-0 bg-linear-to-r from-[#18191b] from-10% via-[#18191b]/50 via-50% to-[#18191b]/0" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#18191b] to-transparent" />

      <div className="relative mx-auto max-w-[1600px] px-4 pb-14 pt-8 md:px-9 md:pb-20 md:pt-12">
        <nav aria-label="Putanja" className="text-[12px] text-white/55">
          <Link href="/" className="transition-colors hover:text-white">Početna</Link>
          <span className="mx-2">/</span>
          <span className="text-white">O nama</span>
        </nav>

        <p className="mt-10 text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33] md:mt-16">Jugometal d.o.o. Svilajnac</p>
        <h1 className="mt-3 text-[44px] font-medium leading-[0.95] tracking-[-0.03em] md:text-[68px]">
          Siguran partner<span className="text-[#e02a33]">.</span>
        </h1>
        <p className="mt-5 max-w-lg text-[14px] leading-relaxed text-white/70 md:text-[15px]">
          Prodaja, servis i rezervni delovi za poljoprivrednu mehanizaciju.
          <br />
          Od {FOUNDED}. godine, iz Svilajnca.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/traktori" className="group inline-flex h-11 items-center gap-2.5 rounded-full bg-[#e02a33] pl-5 pr-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[#c41f27]">
            Pogledajte ponudu
            <span className="grid size-8 place-items-center rounded-full bg-white text-[#e02a33]">
              <ArrowRight className="h-2.5 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </Link>
          <Link href="/kontakt" className="inline-flex h-11 items-center rounded-full border border-white/20 bg-white/10 px-5 text-[13px] text-white backdrop-blur-md transition-colors hover:border-white hover:bg-white hover:text-ink">
            Posetite nas
          </Link>
        </div>

        {/* brojke na staklenoj traci */}
        <dl className={`mt-12 grid max-w-4xl grid-cols-2 overflow-hidden rounded-[12px] border border-white/15 bg-white/[0.06] backdrop-blur-md sm:grid-cols-3 md:mt-16 ${numbers.length >= 5 ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}>
          {numbers.map((s) => (
            <div key={s.label} className="flex flex-col-reverse justify-end border-b border-r border-white/10 px-5 py-4 md:py-5">
              <dt className="mt-1.5 text-[10px] uppercase tracking-[0.16em] text-white/50 md:text-[11px]">{s.label}</dt>
              <dd className="text-[22px] font-medium leading-none tracking-[-0.02em] tabular-nums md:text-[28px]">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ── 2. priča + brendovi u ponudi ── */
export function AboutIntro({ stats }: { stats?: AboutStats }) {
  const brands = stats?.tractorBrands ?? [];
  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 py-14 md:px-9 md:py-24">
      <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33]">Od {FOUNDED}.</p>
          <h2 className="mt-3 text-[30px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[38px]">
            {YEARS} {plural(YEARS, "godina", "godine", "godina")} uz poljoprivrednike<span className="text-[#e02a33]">.</span>
          </h2>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-mist">{company.about.intro}</p>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-mist">{OFFER}</p>
        </Reveal>

        {brands.length > 0 && (
          <Reveal delay={120}>
            <div className="rounded-[12px] bg-canvas p-5 ring-1 ring-line md:p-7">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.16em] text-mist">U ponudi</p>
                  <h3 className="mt-1.5 text-[20px] font-medium tracking-[-0.01em]">Traktori koje prodajemo i servisiramo</h3>
                </div>
              </div>
              <ul className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {brands.map((b) => (
                  <li key={b.slug}>
                    <Link
                      href={`/traktori/${b.slug}`}
                      className="group relative grid h-[92px] place-items-center rounded-[10px] bg-paper px-5 ring-1 ring-line transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-18px_rgba(24,25,27,0.4)]"
                    >
                      {BRAND_LOGO[b.slug] ? (
                        // eslint-disable-next-line @next/next/no-img-element -- logo brenda
                        <img src={BRAND_LOGO[b.slug]} alt={b.name} className="max-h-9 w-auto max-w-[120px] object-contain" />
                      ) : (
                        <span className="text-[15px] font-medium">{b.name}</span>
                      )}
                      <span className="absolute bottom-2 right-2.5 text-[10px] tabular-nums text-mist">
                        {b.count} {plural(b.count, "model", "modela", "modela")}
                      </span>
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/traktori"
                    className="group grid h-[92px] place-items-center rounded-[10px] border border-dashed border-mist/40 text-center text-[13px] transition-colors hover:border-ink"
                  >
                    <span className="inline-flex items-center gap-2">
                      Svi traktori
                      <ArrowRight className="h-2.5 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

/* ── 3. zašto Jugometal ── */
export function AboutValues() {
  const { contact } = useSite();
  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-9 md:pb-24">
      <Reveal>
        <div className="grid overflow-hidden rounded-[12px] bg-[#18191b] lg:grid-cols-[1fr_1.15fr]">
          <div className="group relative isolate min-h-[280px] overflow-hidden md:min-h-[380px] lg:min-h-[600px]">
            {/* eslint-disable-next-line @next/next/no-img-element -- fotografija iz public */}
            <img
              src="/banners/firma.jpg"
              alt="Jugometal prodajno-servisni centar"
              loading="lazy"
              className="absolute inset-0 -z-10 h-full w-full object-cover object-[30%_50%] transition-transform duration-[1200ms] ease-[var(--ease-brand)] group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/60 via-transparent to-black/20" />
            <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/30 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] text-white backdrop-blur-md md:left-6 md:top-6">
              Od {FOUNDED}.
            </span>
            <span className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-black/30 px-3.5 py-1.5 text-[12px] text-white backdrop-blur-md md:bottom-6 md:left-6">
              Prodajno-servisni centar · {[contact.street, cityName(contact.city)].filter(Boolean).join(", ")}
            </span>
          </div>

          <div className="flex flex-col justify-center p-6 text-white md:p-10 xl:p-12">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33]">Zašto Jugometal</p>
            <h2 className="mt-3 text-[30px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[38px]">Siguran partner na njivi i u radionici.</h2>
            <ul className="mt-7 space-y-2.5">
              {VALUES.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4 rounded-[10px] border border-white/10 bg-white/[0.03] p-4 transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.06] md:p-5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-[8px] bg-[#e02a33]/15 text-[#e02a33]">
                    <Icon className="size-[18px]" strokeWidth={1.7} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[16px] font-medium leading-snug">{title}</span>
                    <span className="mt-1.5 block text-[13px] leading-relaxed text-white/60">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ── 4. završni poziv: crvena kartica sa zupčanicima u pozadini ── */
export function AboutCta() {
  const { contact: hq } = useSite();
  const phones = [
    { label: "Prodaja i servis", phone: hq.phone },
    { label: "Rezervni delovi", phone: hq.phoneParts },
  ].filter((p) => p.phone);

  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-9 md:pb-24">
      <Reveal>
        <div className="relative isolate grid gap-8 overflow-hidden rounded-[12px] bg-[#e02a33] p-6 text-white md:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center xl:p-14">
          {/* zupčanici u pozadini: multiply ih utapa u crvenu, pa se samo naziru */}
          {/* eslint-disable-next-line @next/next/no-img-element -- dekorativna fotografija iz public */}
          <img src="/images/akcenti/zupcanici.jpg" alt="" aria-hidden loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60 mix-blend-multiply grayscale" />
          <span aria-hidden className="absolute inset-0 -z-10 bg-linear-to-r from-[#e02a33] via-[#e02a33]/70 to-[#e02a33]/20" />

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/75">Posetite nas</p>
            <h2 className="mt-3 text-[30px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[40px]">Svratite ili nas pozovite.</h2>
            <p className="mt-3 text-[14px] text-white/80">{[hq.street, hq.city, hq.email].filter(Boolean).join(" · ")}</p>
          </div>

          <div className="flex flex-col gap-2.5">
            {phones.map((p) => (
              <a
                key={p.label}
                href={tel(p.phone)}
                className="group flex items-center justify-between gap-4 rounded-[10px] border border-white/25 bg-white/10 p-4 backdrop-blur-md transition-colors duration-200 hover:bg-white hover:text-ink"
              >
                <span>
                  <span className="block text-[11px] uppercase tracking-[0.16em] text-white/70 transition-colors group-hover:text-mist">{p.label}</span>
                  <span className="mt-1 block text-[20px] font-medium tabular-nums">{p.phone}</span>
                </span>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-[#e02a33] transition-colors group-hover:bg-[#e02a33] group-hover:text-white">
                  <Phone className="size-[17px]" strokeWidth={1.7} aria-hidden />
                </span>
              </a>
            ))}
            <Link href="/kontakt" className="group mt-1 inline-flex items-center gap-2 self-start text-[14px] font-medium text-white">
              Kontakt i mapa
              <ArrowRight className="h-2.5 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
