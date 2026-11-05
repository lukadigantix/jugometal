"use client";

import Link from "next/link";
import { useState } from "react";
import { Phone, ShieldCheck } from "lucide-react";
import { ArrowRight } from "./graphics";
import Select from "./ui/Select";
import Spin360 from "./Spin360";
import { Crumbs, EYEBROW, InquirySection, PerkList, PriceCard, ProductImage, SectionHead, SpecGroups, StatTiles } from "./ProductDetail";
import { atvModels } from "@/data/atv";

/* Strana Benda modela: izbor boje (menja sliku), cena, ključni brojevi, oprema, specifikacija, upit, drugi model.
 * Delovi su zajednički sa stranama traktora i mašina (ProductDetail). */
/** 1 stavka, 3 stavke, 10 stavki */
const stavki = (n: number) => {
  const l = n % 10, teen = n % 100 >= 11 && n % 100 <= 14;
  return `${n} ${l === 1 && !teen ? "stavka" : l >= 2 && l <= 4 && !teen ? "stavke" : "stavki"}`;
};

export default function AtvPage({ slug }: { slug: string }) {
  const m = atvModels.find((x) => x.slug === slug)!;
  const other = atvModels.find((x) => x.slug !== slug)!;
  const [ci, setCi] = useState(0);
  const color = m.colors[ci];
  const short = m.name.replace("Benda ", "");

  return (
    <>
      {/* ── vrh: slika u izabranoj boji i podaci ── */}
      <section className="bg-paper">
        <div className="mx-auto w-full max-w-[1600px] px-4 pb-14 pt-8 md:px-9 md:pb-24 md:pt-10">
          <Crumbs items={[{ label: "Početna", href: "/" }, { label: "Benda ATV", href: "/atv" }, { label: short }]} />

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12 xl:gap-16">
            <div className="flex min-w-0 flex-col">
              {color.spin?.length ? (
                // boja sa 360° snimkom: vozilo se okreće na beloj kartici (prevlačenjem ili samo)
                <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-white ring-1 ring-line lg:aspect-auto lg:min-h-[420px] lg:flex-1">
                  <Spin360
                    frames={color.spin}
                    poster={color.image}
                    alt={`${m.name}, ${color.name}`}
                    tone="light"
                    turntable
                    className="absolute inset-0"
                    frameClassName="inset-x-[5%] top-[12%] bottom-[7%]"
                    hud={({ deg, ready }) => (
                      <>
                        <div className="pointer-events-none absolute inset-x-4 top-4 flex items-start justify-between gap-3">
                          <span className="rounded-full bg-[#18191b] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white">{m.onSale ? m.saleBadge : "ATV / kvad"}</span>
                          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink ring-1 ring-line">
                            <span className="size-1.5 animate-pulse rounded-full bg-[#e02a33]" />
                            360° · {color.name}
                          </span>
                        </div>
                        {ready && (
                          <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.16em] text-mist">
                            <span>Prevucite da okrenete</span>
                            <span className="inline-flex items-center gap-2 tabular-nums tracking-[0.12em]">
                              <svg viewBox="0 0 20 20" className="size-4" aria-hidden>
                                <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeOpacity="0.35" />
                                <circle cx="10" cy="2" r="2" fill="#e02a33" style={{ transform: `rotate(${deg}deg)`, transformOrigin: "10px 10px" }} />
                              </svg>
                              {String(deg).padStart(3, "0")}°
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  />
                </div>
              ) : (
                <ProductImage src={color.image} alt={`${m.name}, ${color.name}`} badge={m.onSale ? m.saleBadge : "ATV / kvad"} tag={color.name} className="lg:aspect-auto lg:min-h-[420px] lg:flex-1" />
              )}
              {/* sve sličice uvek stanu u širinu slike: telefon 4 u redu, veći ekrani sve u jednom redu */}
              <div className="mt-3 grid grid-cols-4 gap-2 sm:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]" style={{ "--n": m.colors.length } as React.CSSProperties}>
                {m.colors.map((c, i) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={() => setCi(i)}
                    aria-label={c.name}
                    aria-pressed={i === ci}
                    className={`relative aspect-[7/5] overflow-hidden rounded-[10px] bg-white outline-none transition focus-visible:ring-2 focus-visible:ring-[#e02a33] ${i === ci ? "ring-2 ring-[#18191b]" : "ring-1 ring-line hover:ring-mist"}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- slika iz public */}
                    <img src={c.image} alt="" className="absolute inset-0 h-full w-full object-contain p-1.5" loading="lazy" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex min-w-0 flex-col">
              <p className={EYEBROW}>Benda · ATV / kvad</p>
              <h1 className="mt-2 text-[36px] font-medium leading-[1.02] tracking-[-0.03em] md:text-[48px]">{short}</h1>
              <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-mist md:text-[15px]">{m.tagline}</p>

              <div className="mt-6 rounded-[12px] bg-canvas p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-[13px]">
                    Boja: <span className="font-medium">{color.name}</span> <span className="text-mist">({color.sr})</span>
                  </p>
                  <p className="text-[12px] text-mist">{m.colors.length} boje · metalik bez doplate</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {m.colors.map((c, i) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setCi(i)}
                      aria-label={`${c.name} (${c.sr})`}
                      title={`${c.name} (${c.sr})`}
                      className={`size-9 rounded-full p-0.5 transition ${i === ci ? "ring-2 ring-[#18191b]" : "ring-1 ring-transparent hover:ring-line"}`}
                    >
                      <span className="block size-full rounded-full ring-1 ring-black/10" style={{ background: c.hex }} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <StatTiles stats={m.stats.map((s) => ({ v: s.value, u: s.unit, l: s.label }))} />
              </div>

              <div className="mt-5">
                <PriceCard price={m.price} sale={m.onSale} note={m.priceNote} cta="Rezervišite model" href="#upit" />
              </div>

              <div className="mt-4">
                <PerkList
                  perks={[
                    { icon: ShieldCheck, title: "Garancija 3 godine ili 8.000 km", short: "Garancija 3 godine" },
                    { icon: Phone, title: "Pitanja o modelu? Pišite nam", short: "Pišite nam", href: "/kontakt" },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── teren: fotografija preko cele širine, tekst levo na tamnom prelazu, tri staklene kartice sa opremom ── */}
      <section className="relative overflow-hidden bg-[#18191b] text-white">
        {/* eslint-disable-next-line @next/next/no-img-element -- fotografija iz public */}
        <img src="/atv/benda-teren.jpg" alt="Benda ATV na terenu" loading="lazy" className="absolute inset-0 h-full w-full object-cover object-[70%_center]" />
        <div className="absolute inset-0 bg-linear-to-r from-[#18191b] from-5% via-[#18191b]/75 via-45% to-[#18191b]/10" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-[#18191b] to-transparent" />

        <div className="relative mx-auto flex min-h-[520px] max-w-[1600px] flex-col justify-between gap-12 px-4 py-14 md:min-h-[600px] md:px-9 md:py-24">
          <div className="max-w-xl">
            <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white/80">
              <span className="h-px w-8 bg-[#e02a33]" />
              Za njivu, šumu i teren
            </p>
            <h2 className="mt-4 text-[32px] font-medium leading-[1.02] tracking-[-0.03em] md:text-[48px]">
              Spreman za svaki teren<span className="text-[#e02a33]">.</span>
            </h2>
            <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/70 md:text-[15px]">
              Pogon se menja na pritisak dugmeta, a blokada diferencijala i vitlo su deo standardne opreme modela {short}.
            </p>
          </div>

          <ul className="grid max-w-3xl gap-3 sm:grid-cols-3">
            {[
              { title: "2WD / 4WD", text: "na pritisak dugmeta" },
              { title: "Blokada diferencijala", text: "u standardu" },
              { title: "Vitlo", text: "u standardu" },
            ].map((f, i) => (
              <li key={f.title} className="rounded-[12px] border border-white/15 bg-white/[0.07] p-4 backdrop-blur-md md:p-5">
                <span className="text-[11px] font-medium tabular-nums text-[#e02a33]">0{i + 1}</span>
                <p className="mt-3 truncate text-[16px] font-medium tracking-[-0.01em] md:text-[17px]">{f.title}</p>
                <p className="mt-1 text-[12px] text-white/60 md:text-[13px]">{f.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── oprema (tamna kartica) i specifikacija (sve grupe) ── */}
      <section className="bg-canvas">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-14 md:px-9 md:py-24">
          <SectionHead eyebrow="Specifikacija" title="Oprema i tehnički podaci" sub="Fabrički podaci Benda. Tačnu opremu potvrđujemo uz ponudu." />

          {/* oprema preko cele širine: naslov levo, stavke u kolonama desno */}
          <div className="relative mt-8 overflow-hidden rounded-[12px] bg-[#18191b] p-6 text-white md:mt-10 md:p-8 lg:grid lg:grid-cols-[240px_1fr] lg:gap-10 xl:grid-cols-[280px_1fr]">
            <span aria-hidden className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-[#e02a33]/15 blur-3xl" />
            <div className="relative">
              <p className={EYEBROW}>U standardu</p>
              <h3 className="mt-2 text-[22px] font-medium tracking-[-0.02em] md:text-[26px]">
                Standardna oprema<span className="text-[#e02a33]">.</span>
              </h3>
              <span className="mt-4 inline-block whitespace-nowrap rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[12px] text-white/75">{stavki(m.equipment.length)}</span>
            </div>
            <ul className="relative mt-6 grid gap-x-8 sm:grid-cols-2 lg:mt-0 xl:grid-cols-3">
              {m.equipment.map((e) => (
                <li key={e} className="flex items-start gap-3 border-t border-white/10 py-3 text-[13px] leading-snug text-white/85">
                  <span className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-[#e02a33] text-white">
                    <svg viewBox="0 0 12 12" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="m2.5 6.2 2.3 2.3 4.7-5" />
                    </svg>
                  </span>
                  {e}
                </li>
              ))}
            </ul>
          </div>

          {/* sve grupe odjednom, složene po veličini */}
          <div className="mt-4 xl:mt-6">
            <SpecGroups groups={m.specs.map((g) => ({ group: g.group, rows: g.rows as [string, string][] }))} />
          </div>
        </div>
      </section>

      {/* ── upit sa izabranom bojom ── */}
      <InquirySection
        id="upit"
        eyebrow="Rezervacija"
        title={`${short} u boji ${color.name}`}
        text="Pošaljite upit ili pozovite. Javljamo dostupnost boje i rok isporuke."
        productName={m.name}
        about={`${m.name}, boja: ${color.name} (${color.sr})`}
        extra={{ Boja: `${color.name} (${color.sr})` }}
        subject={`Upit: ${m.name} (${color.name})`}
        placeholder="Registracija, dodatna oprema, plaćanje..."
        note="Upit stiže sa izabranim modelom i bojom."
        visual={
          // eslint-disable-next-line @next/next/no-img-element -- slika iz public
          <img key={color.image} src={color.image} alt="" className="mt-6 w-full max-w-[420px] animate-[heroIn_.4s_ease-out_both] object-contain" />
        }
        fields={
          <div className="grid gap-1.5 text-[13px] text-mist">
            <span aria-hidden>Boja</span>
            <Select
              label="Boja"
              value={String(ci)}
              onChange={(v) => setCi(+v)}
              options={m.colors.map((c, i) => ({ value: String(i), label: c.name, hint: `(${c.sr})`, swatch: c.hex }))}
            />
          </div>
        }
      />

      {/* ── drugi model na tamnoj bini, sa 360° prikazom kada postoje kadrovi ── */}
      <ModelShowcase model={other} />
    </>
  );
}

/* ── drugi model: tamna bina sa crvenim podijumom; boje menjaju sliku, a sa kadrovima (spin) vozilo se okreće za 360° ── */
function ModelShowcase({ model }: { model: (typeof atvModels)[number] }) {
  const [pi, setPi] = useState(0);
  const paint = model.colors[pi];
  const short = model.name.replace("Benda ", "");
  return (
    <section id="pogledajte-i" className="relative scroll-mt-24 overflow-hidden bg-[#18191b] text-white">
      {/* mreža u pozadini koja se gasi ka ivicama + crveni sjaj iza vozila */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_70%_50%,black_10%,transparent_70%)]" />
      <span aria-hidden className="pointer-events-none absolute right-[18%] top-1/2 size-[520px] -translate-y-1/2 rounded-full bg-[#e02a33]/20 blur-[120px]" />

      <div className="relative mx-auto grid w-full max-w-[1600px] items-center gap-10 px-4 py-14 md:px-9 md:py-24 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] xl:gap-14">
        <div>
          <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white/80">
            <span className="h-px w-8 bg-[#e02a33]" />
            Pogledajte i
          </p>
          <h2 className="mt-4 text-[34px] font-medium leading-[1.02] tracking-[-0.03em] md:text-[48px]">
            {short}
            <span className="text-[#e02a33]">.</span>
          </h2>
          <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/65 md:text-[15px]">{model.tagline}</p>

          <dl className="mt-8 grid max-w-md grid-cols-2 gap-2">
            {model.stats.map((st) => (
              <div key={st.label} className="rounded-[12px] border border-white/10 bg-white/[0.05] px-4 py-3.5 backdrop-blur-md">
                <dd className="whitespace-nowrap text-[20px] font-medium leading-none tracking-[-0.02em]">
                  {st.value}
                  <span className="ml-1 text-[11px] font-normal tracking-normal text-white/50">{st.unit}</span>
                </dd>
                <dt className="mt-1.5 whitespace-nowrap text-[10px] uppercase tracking-[0.14em] text-white/45">{st.label}</dt>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <p className="text-[13px] text-white/60">
              Boja: <span className="font-medium text-white">{paint.name}</span> <span className="text-white/45">({paint.sr})</span>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {model.colors.map((c, i) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setPi(i)}
                  aria-label={`${c.name} (${c.sr})`}
                  aria-pressed={i === pi}
                  title={`${c.name} (${c.sr})`}
                  className={`size-9 rounded-full p-0.5 transition ${i === pi ? "ring-2 ring-white" : "ring-1 ring-white/15 hover:ring-white/40"}`}
                >
                  <span className="block size-full rounded-full ring-1 ring-black/30" style={{ background: c.hex }} />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href={model.href} className="group inline-flex h-12 items-center gap-3 rounded-full bg-[#e02a33] pl-6 pr-1.5 text-[14px] font-medium transition-colors hover:bg-[#c41f27]">
              Pogledaj model
              <span className="grid size-9 place-items-center rounded-full bg-white text-[#e02a33]">
                <ArrowRight className="h-3 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </Link>
            <div>
              <p className="text-[24px] font-medium leading-none tracking-[-0.02em]">{model.price}</p>
              {model.priceNote && <p className="mt-1.5 text-[12px] text-white/50">{model.priceNote}</p>}
            </div>
          </div>
        </div>

        {/* bina: podijum, vozilo, HUD oznake */}
        <div className="relative aspect-[4/3] w-full md:aspect-[16/11]">
          {/* podijum: kad nema 360° snimka, vozilo stoji na statičnom podijumu; sa snimkom platformu crta Spin360 */}
          {!paint.spin?.length && (
            <div aria-hidden className="pointer-events-none absolute inset-x-[6%] bottom-[9%] h-[26%]">
              <span className="absolute inset-0 rounded-[50%] bg-[radial-gradient(closest-side,rgba(224,42,51,0.32),rgba(224,42,51,0))]" />
              <span className="absolute inset-0 rounded-[50%] border border-[#e02a33]/70" />
              <span className="absolute inset-[18%] rounded-[50%] border border-[#e02a33]/25" />
              <span className="absolute inset-[36%] rounded-[50%] border border-dashed border-white/10" />
              <span className="absolute inset-x-[18%] top-[28%] bottom-[22%] rounded-[50%] bg-black/70 blur-xl" />
            </div>
          )}

          <Spin360
            frames={paint.spin ?? []}
            poster={paint.image}
            alt={`${model.name}, ${paint.name}`}
            turntable
            className="absolute inset-0"
            frameClassName="inset-x-[6%] top-[8%] bottom-[9%]"
            hud={({ deg, ready, spin }) => (
              <>
                {spin && (
                  <span className="pointer-events-none absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-white/75 backdrop-blur-md">
                    <span className="size-1.5 animate-pulse rounded-full bg-[#e02a33]" />
                    360°
                  </span>
                )}
                {ready && (
                  <>
                    <span aria-hidden className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-2 text-[11px] font-medium tabular-nums tracking-[0.12em] text-white/60">
                      <svg viewBox="0 0 20 20" className="size-4">
                        <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeOpacity="0.35" />
                        <circle cx="10" cy="2" r="2" fill="#e02a33" style={{ transform: `rotate(${deg}deg)`, transformOrigin: "10px 10px" }} />
                      </svg>
                      {String(deg).padStart(3, "0")}°
                    </span>
                    <span className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] uppercase tracking-[0.18em] text-white/45">
                      Prevucite da okrenete
                    </span>
                  </>
                )}
              </>
            )}
          />

          {/* uglovi „nišana" */}
          {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map((c) => (
            <span key={c} aria-hidden className={`pointer-events-none absolute size-6 border-white/30 ${c}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
