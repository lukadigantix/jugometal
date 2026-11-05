"use client";

import Link from "next/link";
import { useState } from "react";
import { CircleCheck, Clock, Package, Phone, Tractor, Wrench, Cog } from "lucide-react";
import Reveal from "./Reveal";
import { ArrowRight } from "./graphics";
import company from "@/data/company.json";
import { useInquiry } from "@/lib/useInquiry";
import { tel, useSite } from "@/lib/site-context";

/* Strana Servis, u jeziku početne i strana Akcije i O nama. Tekstovi sa stare strane servisa (company.json),
 * kontakt i radno vreme iz Podešavanja → Sajt (useSite). Forma za zakazivanje šalje upit u admin (Upiti sa sajta, vrsta „servis"). */

/* ── 1. hero ── */
export function ServiceHero() {
  const { contact: hq, workingHours } = useSite();
  const open = workingHours.filter((h) => h.isOpen);
  const strip = [
    open.length > 0 && { icon: Clock, label: "Radno vreme", value: open.map((h) => `${h.days} ${h.hours}`).join(" · ") },
    hq.phone && { icon: Phone, label: "Servis i prodaja", value: hq.phone, href: tel(hq.phone) },
    hq.phoneParts && { icon: Package, label: "Rezervni delovi", value: hq.phoneParts, href: tel(hq.phoneParts) },
  ].filter(Boolean) as { icon: typeof Clock; label: string; value: string; href?: string }[];

  return (
    <section className="relative overflow-hidden bg-[#18191b] text-white">
      {/* eslint-disable-next-line @next/next/no-img-element -- fotografija iz public */}
      <img
        src="/images/servis-hero.jpg"
        alt=""
        aria-hidden
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[60%_40%] opacity-55 [mask-image:linear-gradient(to_right,transparent_8%,black_60%)]"
      />
      <div className="absolute inset-0 bg-linear-to-r from-[#18191b] from-10% via-[#18191b]/50 via-50% to-[#18191b]/0" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#18191b] to-transparent" />

      <div className="relative mx-auto max-w-[1600px] px-4 pb-14 pt-8 md:px-9 md:pb-20 md:pt-12">
        <nav aria-label="Putanja" className="text-[12px] text-white/55">
          <Link href="/" className="transition-colors hover:text-white">Početna</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Servis</span>
        </nav>

        <p className="mt-10 text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33] md:mt-16">Servis · Svilajnac</p>
        <h1 className="mt-3 max-w-3xl text-[44px] font-medium leading-[0.98] tracking-[-0.03em] md:text-[64px]">
          Servis koji ne čeka sezonu<span className="text-[#e02a33]">.</span>
        </h1>
        <p className="mt-5 max-w-lg text-[14px] leading-relaxed text-white/70 md:text-[15px]">{company.service.intro}</p>

        <div className="mt-7 flex flex-wrap gap-3">
          <a href="#zakazivanje" className="group inline-flex h-11 items-center gap-2.5 rounded-full bg-[#e02a33] pl-5 pr-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[#c41f27]">
            Zakažite servis
            <span className="grid size-8 place-items-center rounded-full bg-white text-[#e02a33]">
              <ArrowRight className="h-2.5 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </a>
          {hq.phone && (
            <a href={tel(hq.phone)} className="inline-flex h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 text-[13px] text-white backdrop-blur-md transition-colors hover:border-white hover:bg-white hover:text-ink">
              <Phone className="size-4" strokeWidth={1.8} aria-hidden />
              Pozovite {hq.phone}
            </a>
          )}
        </div>

        {/* radno vreme i telefoni na staklenoj traci */}
        {strip.length > 0 && (
          <dl className={`mt-12 grid max-w-4xl overflow-hidden rounded-[12px] border border-white/15 bg-white/[0.06] backdrop-blur-md md:mt-16 ${strip.length === 3 ? "md:grid-cols-[1.6fr_1fr_1fr]" : "md:grid-cols-2"}`}>
            {strip.map(({ icon: Icon, label, value, href }) => {
              const body = (
                <>
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-white/80">
                    <Icon className="size-4" strokeWidth={1.7} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <dt className="text-[10px] uppercase tracking-[0.16em] text-white/50 md:text-[11px]">{label}</dt>
                    <dd className="mt-1 truncate text-[14px] font-medium tabular-nums md:text-[15px]">{value}</dd>
                  </span>
                </>
              );
              const cls = "flex items-center gap-3 border-b border-white/10 px-5 py-4 md:border-b-0 md:border-r";
              return href ? (
                <a key={label} href={href} className={`${cls} transition-colors hover:bg-white/[0.06]`}>
                  {body}
                </a>
              ) : (
                <div key={label} className={cls}>
                  {body}
                </div>
              );
            })}
          </dl>
        )}
      </div>
    </section>
  );
}

/* ── 2. šta servisiramo ── */
const AREAS = [
  { icon: Tractor, title: "IMT i IMR traktori", text: company.service.sections[0].text },
  { icon: Wrench, title: "Massey Ferguson", text: "Redovno održavanje i popravke Massey Ferguson traktora. Pravilnim održavanjem čuvate vrednost i vek traktora." },
  { icon: Cog, title: "Traktori iz naše ponude", text: "Servis za Solis, YTO, John Deere i Mahindra traktore koje prodajemo, uz delove dostupne na stanju." },
  { icon: Package, title: "Originalni rezervni delovi", text: company.service.sections[2].text + " Delove možete poručiti i online." },
];

export function ServiceAreas() {
  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 py-14 md:px-9 md:py-24">
      <Reveal>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33]">Šta servisiramo</p>
            <h2 className="mt-3 text-[30px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[38px]">
              Stručna servisna služba u Svilajncu<span className="text-[#e02a33]">.</span>
            </h2>
            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-mist">
              Servisiramo traktore i poljoprivrednu mehanizaciju, sa delovima na stanju, da vaš zastoj u radu bude što kraći.
            </p>
          </div>
          <Link href="/rezervni-delovi" className="group inline-flex shrink-0 items-center gap-2 text-[14px] text-ink/75 transition-colors hover:text-ink">
            Rezervni delovi u online prodavnici
            <ArrowRight className="h-2.5 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </Reveal>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-10 xl:grid-cols-4 xl:gap-5">
        {AREAS.map(({ icon: Icon, title, text }, i) => (
          <li key={title}>
            <Reveal delay={i * 80} className="h-full">
              <div className="flex h-full flex-col rounded-[12px] bg-paper p-6 ring-1 ring-line transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_40px_-24px_rgba(24,25,27,0.35)]">
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-[10px] bg-[#e02a33]/10 text-[#e02a33]">
                    <Icon className="size-5" strokeWidth={1.7} aria-hidden />
                  </span>
                  <span className="text-[11px] tabular-nums text-mist">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="mt-6 text-[18px] font-medium leading-snug tracking-[-0.01em]">{title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-mist">{text}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── 3. zakazivanje: koraci + forma ── */
const STEPS = [
  { title: "Pošaljite upit ili pozovite", text: "Opišite kvar ili koje održavanje vam treba." },
  { title: "Dogovorimo termin", text: "Javljamo vam kada da dovezete traktor ili mašinu." },
  { title: "Servis i delovi", text: "Radimo sa delovima na stanju, bez nepotrebnog čekanja." },
];
const WHEN = ["Što pre", "Ove nedelje", "Sledeće nedelje", "Svejedno"];

const FIELD =
  "h-12 w-full rounded-[10px] border border-line bg-canvas px-4 text-[15px] text-ink outline-none transition placeholder:text-mist/70 focus:border-ink focus:bg-paper";

export function ServiceBooking() {
  const { contact: c } = useSite();
  const inq = useInquiry();
  const [f, setF] = useState({ name: "", phone: "", machine: "", msg: "" });
  const [when, setWhen] = useState(WHEN[0]);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((x) => ({ ...x, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = [f.machine && `Traktor / mašina: ${f.machine}`, f.msg].filter(Boolean).join("\n\n");
    void inq.send(
      { type: "servis", name: f.name, phone: f.phone, message, location: "svilajnac", extra: { "Traktor / mašina": f.machine, Termin: when } },
      { subject: "Zakazivanje servisa", body: `${message}\n\nŽeljeni termin: ${when}\n---\n${f.name}, ${f.phone}` },
    );
  };

  return (
    <section id="zakazivanje" className="mx-auto w-full max-w-[1600px] scroll-mt-28 px-4 pb-14 md:px-9 md:pb-24">
      <Reveal>
        <div className="grid overflow-hidden rounded-[12px] ring-1 ring-line lg:grid-cols-[1fr_1.15fr]">
          {/* koraci */}
          <div className="flex flex-col bg-[#18191b] p-6 text-white md:p-10 xl:p-12">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33]">Zakazivanje</p>
            <h2 className="mt-3 text-[30px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[38px]">Zakažite servis za par minuta.</h2>
            <ol className="relative mt-8 space-y-6">
              <span aria-hidden className="absolute bottom-4 left-[19px] top-4 w-px bg-white/15" />
              {STEPS.map((s, i) => (
                <li key={s.title} className="relative flex gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e02a33] text-[14px] font-medium tabular-nums text-white ring-4 ring-[#18191b]">{i + 1}</span>
                  <span className="pt-1.5">
                    <span className="block text-[16px] font-medium">{s.title}</span>
                    <span className="mt-1 block text-[13px] leading-relaxed text-white/60">{s.text}</span>
                  </span>
                </li>
              ))}
            </ol>
            {(c.phone || c.phoneParts) && (
              <div className="mt-auto grid gap-2.5 pt-10 sm:grid-cols-2">
                {[
                  { label: "Servis i prodaja", phone: c.phone },
                  { label: "Rezervni delovi", phone: c.phoneParts },
                ]
                  .filter((x) => x.phone)
                  .map((x) => (
                    <a key={x.label} href={tel(x.phone)} className="group flex items-center justify-between gap-3 rounded-[10px] border border-white/10 px-4 py-3 transition-colors hover:border-white/30">
                      <span>
                        <span className="block text-[11px] uppercase tracking-[0.14em] text-white/45">{x.label}</span>
                        <span className="mt-1 block text-[16px] font-medium tabular-nums">{x.phone}</span>
                      </span>
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/[0.06] text-white/75 transition-colors group-hover:bg-white group-hover:text-ink">
                        <Phone className="size-4" strokeWidth={1.7} aria-hidden />
                      </span>
                    </a>
                  ))}
              </div>
            )}
          </div>

          {/* forma */}
          <div className="bg-paper p-6 md:p-10 xl:p-12">
            {inq.status === "sent" ? (
              <div className="flex h-full flex-col items-start justify-center py-10">
                <span className="grid size-14 place-items-center rounded-full bg-[#e02a33] text-white">
                  <CircleCheck className="size-7" strokeWidth={1.8} aria-hidden />
                </span>
                <h3 className="mt-6 text-[26px] font-medium leading-tight tracking-[-0.02em]">Upit je poslat.</h3>
                <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-mist">Javljamo vam se telefonom da dogovorimo termin. Za hitne slučajeve pozovite servis.</p>
                {c.phone && (
                  <a href={tel(c.phone)} className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[13px] font-medium text-white transition-colors hover:bg-[#e02a33]">
                    <Phone className="size-4" strokeWidth={1.8} aria-hidden />
                    {c.phone}
                  </a>
                )}
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-4">
                <div>
                  <h3 className="text-[22px] font-medium tracking-[-0.01em]">Upit za servis</h3>
                  <p className="mt-1 text-[13px] text-mist">Upit stiže direktno servisu.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-[12px] font-medium">Ime i prezime</span>
                    <input required value={f.name} onChange={set("name")} autoComplete="name" className={FIELD} />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[12px] font-medium">Telefon</span>
                    <input required type="tel" inputMode="tel" value={f.phone} onChange={set("phone")} autoComplete="tel" placeholder="06x xxx xxxx" className={FIELD} />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-medium">Traktor ili mašina</span>
                  <input value={f.machine} onChange={set("machine")} placeholder="npr. IMT 539, Solis 50" className={FIELD} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-medium">Šta treba uraditi</span>
                  <textarea required rows={4} value={f.msg} onChange={set("msg")} placeholder="Opišite kvar ili koje održavanje vam treba…" className={`${FIELD} h-auto resize-y py-3 leading-relaxed`} />
                </label>
                <fieldset>
                  <legend className="mb-2 text-[12px] font-medium">Željeni termin</legend>
                  <div className="flex flex-wrap gap-2">
                    {WHEN.map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setWhen(w)}
                        aria-pressed={when === w}
                        className={`h-9 rounded-full px-4 text-[13px] transition-colors ${when === w ? "bg-ink text-white" : "bg-canvas text-ink ring-1 ring-line hover:ring-ink"}`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {inq.status === "error" && (
                  <p role="alert" className="rounded-[10px] bg-[#fdecea] px-4 py-3 text-[13px] text-[#b91c1c]">
                    {inq.error}{" "}
                    <a href={inq.mailto} className="font-medium underline">
                      Pošaljite e-mailom
                    </a>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={inq.status === "sending"}
                  className="group mt-2 inline-flex h-12 w-full items-center justify-between rounded-full bg-[#e02a33] pl-6 pr-1.5 text-[14px] font-medium text-white transition-colors hover:bg-[#c41f27] disabled:opacity-70 sm:w-auto sm:justify-start sm:gap-3 sm:justify-self-start"
                >
                  {inq.status === "sending" ? "Šaljemo upit…" : "Pošaljite upit"}
                  <span className="grid size-9 place-items-center rounded-full bg-white text-[#e02a33]">
                    <ArrowRight className="h-3 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
