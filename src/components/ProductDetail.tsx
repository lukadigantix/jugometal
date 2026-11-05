"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "./graphics";
import { useInquiry } from "@/lib/useInquiry";
import { tel, useSite } from "@/lib/site-context";

/*
  Delovi strane proizvoda (traktor, priključna mašina, ATV), u jeziku početne i strane Akcije:
  kartice rounded-12 sa tankim okvirom, crveni natpisi iznad naslova, crvena tačka posle naslova sekcije,
  tamna kartica sa cenom i crvenim dugmetom sa strelicom u belom krugu.
  ProductDetail slaže ceo raspored (traktor i mašina); ATV koristi pojedinačne delove.
*/

export type Stat = { v: string; u?: string; l: string };
export type Perk = { icon: LucideIcon; title: string; /** kraći naziv za telefon (uska polja) */ short?: string; href?: string };
export type SpecGroup = { group: string; rows: [string, string][] };

const WRAP = "mx-auto w-full max-w-[1600px] px-4 md:px-9";
export const EYEBROW = "text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33]";
const FIELD =
  "w-full rounded-[10px] border border-line bg-canvas px-4 text-[15px] text-ink outline-none transition placeholder:text-mist/70 focus:border-ink focus:bg-paper";

/* ── sitni delovi ── */

export function Crumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Putanja" className="flex flex-wrap items-center gap-y-1 text-[12px] text-mist">
      {items.map((c, i) => (
        <span key={c.label} className="flex items-center">
          {i > 0 && <span className="mx-2 text-line">/</span>}
          {c.href ? (
            <Link href={c.href} className="transition-colors hover:text-ink">{c.label}</Link>
          ) : (
            <span className="text-ink">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function SectionHead({ eyebrow, title, sub, aside }: { eyebrow: string; title: string; sub?: string; aside?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className={EYEBROW}>{eyebrow}</p>
        <h2 className="mt-3 text-[28px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[34px]">
          {title}
          <span className="text-[#e02a33]">.</span>
        </h2>
        {sub && <p className="mt-2 text-[13px] text-mist">{sub}</p>}
      </div>
      {aside}
    </div>
  );
}

/** slika proizvoda na beloj kartici; oznaka levo crna, dodatna desno bela (bez senki) */
export function ProductImage({ src, alt, badge, tag, className = "", children }: { src: string; alt: string; badge?: string; tag?: string; className?: string; children?: React.ReactNode }) {
  // fotografija sa terena (u nazivu fajla „-scena") ide preko celog okvira; slika na beloj ostaje sa razmakom
  const scene = /-scena\./.test(src);
  return (
    <div className={`relative aspect-[4/3] overflow-hidden rounded-[12px] bg-white ring-1 ring-line ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- slika iz public */}
      <img key={src} src={src} alt={alt} fetchPriority="high" className={`absolute inset-0 h-full w-full animate-[heroIn_.4s_ease-out_both] ${scene ? "object-cover" : "object-contain p-8 md:p-14"}`} />
      {badge && <span className="absolute left-4 top-4 rounded-full bg-[#18191b] px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white">{badge}</span>}
      {tag && <span className="absolute right-4 top-4 rounded-full bg-white px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink ring-1 ring-line">{tag}</span>}
      {children}
    </div>
  );
}

/** galerija: velika slika i sličice ispod (sve sličice uvek staju u širinu); strelice levo/desno menjaju sliku */
export function ProductGallery({ images, alt, badge, tag, className = "" }: { images: string[]; alt: string; badge?: string; tag?: string; className?: string }) {
  const [i, setI] = useState(0);
  const n = images.length;
  const go = (d: number) => setI((x) => (x + d + n) % n);
  if (n < 2) return <ProductImage src={images[0]} alt={alt} badge={badge} tag={tag} className={className} />;
  return (
    <div className="flex h-full flex-col">
      <div
        className="relative min-h-0 flex-1"
        tabIndex={0}
        role="group"
        aria-roledescription="galerija"
        aria-label={`${alt}, slika ${i + 1} od ${n}`}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
      >
        <ProductImage src={images[i]} alt={i === 0 ? alt : `${alt}, slika ${i + 1}`} badge={badge} tag={tag} className={className}>
          {[
            { d: -1, cls: "left-3", label: "Prethodna slika", path: "M7.5 2.5 4 6l3.5 3.5" },
            { d: 1, cls: "right-3", label: "Sledeća slika", path: "M4.5 2.5 8 6 4.5 9.5" },
          ].map((b) => (
            <button
              key={b.d}
              type="button"
              onClick={() => go(b.d)}
              aria-label={b.label}
              className={`absolute top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-ink ring-1 ring-line backdrop-blur transition-colors hover:bg-[#18191b] hover:text-white ${b.cls}`}
            >
              <svg viewBox="0 0 12 12" aria-hidden className="size-3">
                <path d={b.path} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
          <span className="absolute bottom-4 right-4 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium tabular-nums text-ink ring-1 ring-line">
            {i + 1} / {n}
          </span>
        </ProductImage>
      </div>
      <div className="mt-3 grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.max(n, 4)}, minmax(0, 1fr))` }}>
        {images.map((src, k) => (
          <button
            key={src}
            type="button"
            onClick={() => setI(k)}
            aria-label={`Slika ${k + 1}`}
            aria-pressed={k === i}
            className={`relative aspect-[4/3] overflow-hidden rounded-[10px] bg-white outline-none transition focus-visible:ring-2 focus-visible:ring-[#e02a33] ${k === i ? "ring-2 ring-[#18191b]" : "ring-1 ring-line hover:ring-mist"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- sličica */}
            <img src={src} alt="" loading="lazy" className={`absolute inset-0 h-full w-full ${/-scena\./.test(src) ? "object-cover" : "object-contain p-1.5"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

export function StatTiles({ stats }: { stats: Stat[] }) {
  return (
    <dl className="grid grid-cols-2 gap-2">
      {stats.map((s, i) => (
        <div key={s.l} className={`min-w-0 rounded-[12px] bg-canvas px-4 py-3.5 ${stats.length % 2 && i === stats.length - 1 ? "col-span-2" : ""}`}>
          <dd className="truncate text-[20px] font-medium leading-tight tracking-[-0.02em] md:text-[22px]">
            {s.v}
            {s.u && <span className="ml-1 text-[12px] font-normal tracking-normal text-mist">{s.u}</span>}
          </dd>
          <dt className="mt-1 truncate text-[10px] uppercase tracking-[0.14em] text-mist md:text-[11px]">{s.l}</dt>
        </div>
      ))}
    </dl>
  );
}

/** tamna kartica: cena ili „na upit", napomena, crveno dugme ka formi i poziv */
export function PriceCard({ label = "Cena", price, sale = false, note, cta, href }: { label?: string; price: string; sale?: boolean; note?: string; cta: string; href: string }) {
  const { contact } = useSite();
  return (
    <div className="relative overflow-hidden rounded-[12px] bg-[#18191b] p-5 text-white md:p-6">
      <span aria-hidden className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-[#e02a33]/20 blur-3xl" />
      <div className="relative flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/50 md:text-[11px]">{label}</p>
          <p className={`mt-1.5 text-[26px] font-medium leading-none tracking-[-0.02em] md:text-[30px] ${sale ? "text-[#ff5a61]" : ""}`}>{price}</p>
        </div>
        {note && (
          <span className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[12px] text-white/80">
            <span className="size-1.5 rounded-full bg-[#e02a33]" />
            {note}
          </span>
        )}
      </div>
      <div className="relative mt-5 grid gap-2.5 sm:grid-cols-2">
        <a href={href} className="group flex h-12 items-center justify-between rounded-full bg-[#e02a33] pl-5 pr-1.5 text-[14px] font-medium transition-colors hover:bg-[#c41f27]">
          {cta}
          <span className="grid size-9 place-items-center rounded-full bg-white text-[#e02a33]">
            <ArrowRight className="h-3 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </a>
        {contact.phone && (
          <a href={tel(contact.phone)} className="flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/20 bg-white/5 px-5 text-[14px] transition-colors hover:border-white hover:bg-white hover:text-ink">
            <Phone className="size-4" strokeWidth={1.8} aria-hidden />
            {contact.phone}
          </a>
        )}
      </div>
    </div>
  );
}

/** prednosti ispod cene: ikonica, tekst, strelica ako vodi negde */
/** prednosti ispod cene: jedna niska traka sa poljima jedno pored drugog (ikonica, kratak tekst, strelica ako vodi negde) */
export function PerkList({ perks }: { perks: Perk[] }) {
  return (
    <ul className="grid divide-x divide-line overflow-hidden rounded-[12px] ring-1 ring-line" style={{ gridTemplateColumns: `repeat(${perks.length}, minmax(0, 1fr))` }}>
      {perks.map(({ icon: Icon, title, short, href }) => {
        const body = (
          <>
            <span className="flex items-center justify-between">
              <Icon className="size-4 text-[#e02a33]" strokeWidth={1.8} aria-hidden />
              {href && <ArrowRight className="h-2.5 w-3 shrink-0 text-mist transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#e02a33]" />}
            </span>
            {/* tekst uvek u jednom redu */}
            <span className="mt-2 block truncate whitespace-nowrap text-[12px] leading-snug md:text-[13px]">
              {short ? (
                <>
                  <span className="md:hidden">{short}</span>
                  <span className="hidden md:inline">{title}</span>
                </>
              ) : (
                title
              )}
            </span>
          </>
        );
        const cls = "block h-full px-3.5 py-3";
        return (
          <li key={title} className="min-w-0">
            {href ? (
              <Link href={href} title={title} className={`group ${cls} transition-colors hover:bg-canvas`}>
                {body}
              </Link>
            ) : (
              <div title={title} className={cls}>
                {body}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** 1 podatak, 3 podatka, 6 podataka */
const podataka = (n: number) => {
  const l = n % 10, teen = n % 100 >= 11 && n % 100 <= 14;
  return `${n} ${l === 1 && !teen ? "podatak" : l >= 2 && l <= 4 && !teen ? "podatka" : "podataka"}`;
};

/** specifikacija kao jedna tabela: grupa levo (naziv i broj podataka), podaci desno u dve kolone
 *  (naziv levo, vrednost desno). Jedna kartica, pa nema praznih rupa bez obzira na broj grupa i redova. */
export function SpecGroups({ groups, head }: { groups: SpecGroup[]; head?: { title: string; note?: string; source?: string } }) {
  const total = groups.reduce((n, g) => n + g.rows.length, 0);
  return (
    <div className="overflow-hidden rounded-[12px] bg-paper ring-1 ring-line">
      {head && (
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-line px-5 py-5 md:px-7 md:py-6">
          <div>
            <p className={EYEBROW}>Specifikacija</p>
            <h2 className="mt-2 text-[22px] font-medium leading-[1.1] tracking-[-0.02em] md:text-[26px]">
              {head.title}
              <span className="text-[#e02a33]">.</span>
            </h2>
            {head.note && <p className="mt-1.5 text-[12px] text-mist md:text-[13px]">{head.note}</p>}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {head.source && <span className="whitespace-nowrap rounded-full bg-canvas px-3 py-1.5 text-[12px] text-ink/70">{head.source}</span>}
            <span className="whitespace-nowrap rounded-full bg-[#18191b] px-3 py-1.5 text-[12px] font-medium tabular-nums text-white">{podataka(total)}</span>
          </div>
        </div>
      )}
      {groups.map((g) => (
        <div key={g.group} className="grid border-b border-line last:border-b-0 md:grid-cols-[220px_minmax(0,1fr)]">
          <div className="flex items-center justify-between gap-3 px-5 pb-1 pt-5 md:block md:border-r md:border-line md:px-7 md:py-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink">{g.group}</p>
            <p className="whitespace-nowrap text-[11px] tabular-nums text-mist md:mt-1.5">{podataka(g.rows.length)}</p>
          </div>
          <dl className="grid px-5 pb-3 text-[13px] sm:grid-cols-2 sm:gap-x-10 md:px-7 md:py-3 md:text-[14px] [&>div:last-child]:border-b-0 sm:[&>div:nth-last-child(2):nth-child(odd)]:border-b-0">
            {g.rows.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-6 border-b border-line py-3">
                {/* naziv levo (do 45% širine), vrednost desno; dugačka vrednost prelazi u novi red umesto da preklapa */}
                <dt className="max-w-[45%] shrink-0 text-mist">{k}</dt>
                <dd className="min-w-0 text-right font-medium [overflow-wrap:anywhere]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

/* ── upit za ponudu: tamni panel levo, forma desno ── */

const STEPS = ["Pošaljete upit ili pozovete", "Javljamo cenu i rok isporuke", "Dogovaramo sve detalje kupovine"];

export function InquirySection({
  id = "ponuda",
  eyebrow = "Ponuda",
  title,
  text = "Pošaljite upit ili nas pozovite. Javljamo vam cenu, rok isporuke i mogućnosti finansiranja.",
  productName,
  about,
  extra,
  subject,
  placeholder,
  note = "Upit stiže direktno prodaji, javljamo se istog radnog dana.",
  fields,
  visual,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  text?: string;
  productName: string;
  /** za rezervni e-mail: „traktor Solis 20" */
  about: string;
  extra?: Record<string, string>;
  subject?: string;
  placeholder: string;
  note?: string;
  /** dodatna polja u formi (npr. izbor boje) */
  fields?: React.ReactNode;
  /** zamena za korake u tamnom panelu (npr. slika u izabranoj boji) */
  visual?: React.ReactNode;
}) {
  const { contact } = useSite();
  const inq = useInquiry();
  const [f, setF] = useState({ name: "", phone: "", email: "", msg: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((x) => ({ ...x, [k]: e.target.value }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = `Zainteresovan/a sam za ${about}.\n\n${f.msg}\n\n---\nIme i prezime: ${f.name}\nTelefon: ${f.phone}\nE-mail: ${f.email}`;
    void inq.send(
      { type: "ponuda", name: f.name, phone: f.phone, email: f.email.trim(), message: f.msg || `Zanima me ponuda za ${productName}.`, productName, location: "svilajnac", ...(extra ? { extra } : {}) },
      { subject: subject ?? `Upit za ponudu: ${productName}`, body },
    );
  };
  const done = inq.status === "sent";

  return (
    <section id={id} className="scroll-mt-28 bg-paper">
      <div className={`${WRAP} py-14 md:py-24`}>
        <div className="grid overflow-hidden rounded-[12px] ring-1 ring-line lg:grid-cols-[1fr_1.25fr]">
          <div className="relative overflow-hidden bg-[#18191b] p-6 text-white md:p-10">
            <span aria-hidden className="pointer-events-none absolute -bottom-32 -left-24 size-80 rounded-full bg-[#e02a33]/15 blur-3xl" />
            <div className="relative">
              <p className={EYEBROW}>{eyebrow}</p>
              <h2 className="mt-3 text-[26px] font-medium leading-[1.08] tracking-[-0.02em] md:text-[32px]">
                {title}
                <span className="text-[#e02a33]">.</span>
              </h2>
              <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/65">{text}</p>

              {visual ?? (
                <ol className="mt-8 space-y-3">
                  {STEPS.map((s, i) => (
                    <li key={s} className="flex items-center gap-3 text-[14px]">
                      <span className="grid size-7 shrink-0 place-items-center rounded-full border border-white/20 text-[12px] tabular-nums text-white/80">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              )}

              <ul className="mt-8 divide-y divide-white/10 border-y border-white/10 text-[14px]">
                {contact.phone && (
                  <li>
                    <a href={tel(contact.phone)} className="flex items-center gap-3 py-3.5 transition-opacity hover:opacity-80">
                      <Phone className="size-4 text-white/50" strokeWidth={1.8} aria-hidden />
                      <span className="text-white/55">Prodaja</span>
                      <span className="ml-auto font-medium tabular-nums">{contact.phone}</span>
                    </a>
                  </li>
                )}
                {contact.email && (
                  <li>
                    <a href={`mailto:${contact.email}`} className="flex items-center gap-3 py-3.5 transition-opacity hover:opacity-80">
                      <Mail className="size-4 text-white/50" strokeWidth={1.8} aria-hidden />
                      <span className="text-white/55">E-mail</span>
                      <span className="ml-auto truncate font-medium">{contact.email}</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <form onSubmit={submit} className="grid content-start gap-4 bg-paper p-6 md:grid-cols-2 md:p-10">
            <div className="md:col-span-2">
              <p className="text-[18px] font-medium tracking-[-0.01em]">Vaši podaci</p>
              <p className="mt-1 text-[13px] text-mist">Ponudu šaljemo na e-mail, a za detalje vas zovemo telefonom.</p>
            </div>
            <label className="grid gap-1.5 text-[13px] text-mist">
              Ime i prezime
              <input required value={f.name} onChange={set("name")} className={`${FIELD} h-12`} autoComplete="name" />
            </label>
            <label className="grid gap-1.5 text-[13px] text-mist">
              Telefon
              <input required type="tel" value={f.phone} onChange={set("phone")} className={`${FIELD} h-12`} placeholder="06x xxx xxxx" autoComplete="tel" />
            </label>
            <label className={`grid gap-1.5 text-[13px] text-mist ${fields ? "" : "md:col-span-2"}`}>
              E-mail
              <input required type="email" value={f.email} onChange={set("email")} className={`${FIELD} h-12`} placeholder="ime@primer.rs" autoComplete="email" inputMode="email" />
            </label>
            {fields}
            <label className="grid gap-1.5 text-[13px] text-mist md:col-span-2">
              Poruka (nije obavezno)
              <textarea value={f.msg} onChange={set("msg")} rows={4} className={`${FIELD} resize-none py-3`} placeholder={placeholder} />
            </label>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-3 md:col-span-2">
              <button
                type="submit"
                disabled={inq.status === "sending" || done}
                className="group inline-flex h-12 items-center gap-3 rounded-full bg-[#e02a33] pl-6 pr-1.5 text-[14px] font-medium text-white transition-colors hover:bg-[#c41f27] disabled:bg-ink/80"
              >
                {inq.status === "sending" ? "Šaljemo…" : done ? "Upit je poslat" : "Pošaljite upit"}
                <span className="grid size-9 place-items-center rounded-full bg-white text-[#e02a33]">
                  <ArrowRight className="h-3 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </button>
              {done ? (
                <p className="text-[13px] text-ink">Hvala! Javićemo vam se u najkraćem roku.</p>
              ) : inq.status === "error" ? (
                <p role="alert" className="text-[13px] text-[#e02a33]">
                  {inq.error} <a href={inq.mailto} className="underline">Pošaljite e-mailom</a>
                </p>
              ) : (
                <p className="text-[12px] text-mist">{note}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ── slični proizvodi ── */

export function Similar({ eyebrow = "Još iz ponude", title, link, children }: { eyebrow?: string; title: string; link: { href: string; label: string }; children: React.ReactNode }) {
  return (
    <section className="bg-canvas">
      <div className={`${WRAP} py-14 md:py-24`}>
        <SectionHead
          eyebrow={eyebrow}
          title={title}
          aside={
            <Link href={link.href} className="group inline-flex h-11 items-center gap-2.5 rounded-full bg-paper pl-5 pr-1.5 text-[13px] font-medium ring-1 ring-line transition-colors hover:ring-ink/40">
              {link.label}
              <span className="grid size-8 place-items-center rounded-full bg-[#18191b] text-white transition-colors group-hover:bg-[#e02a33]">
                <ArrowRight className="h-2.5 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </Link>
          }
        />
        <ul data-lenis-prevent-horizontal className="no-scrollbar -mx-4 mt-8 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:gap-6 lg:grid-cols-4 xl:gap-8">
          {children}
        </ul>
      </div>
    </section>
  );
}

/* ── ceo raspored: traktor i priključna mašina ── */

export default function ProductDetail({
  crumbs,
  image,
  images,
  name,
  badge,
  tag,
  logo,
  brandName,
  eyebrow,
  text,
  stats,
  perks,
  priceNote,
  specTitle = "Tehnička specifikacija",
  specSource,
  specs,
  aboutTitle,
  about,
  uses,
  inquiry,
  similar,
}: {
  crumbs: { label: string; href?: string }[];
  image: string;
  /** više slika (galerija); prva je glavna */
  images?: string[];
  name: string;
  badge?: string;
  tag?: string;
  logo?: string | null;
  brandName: string;
  eyebrow: string;
  text: string;
  stats: Stat[];
  perks: Perk[];
  priceNote?: string;
  specTitle?: string;
  specSource?: string;
  specs: SpecGroup[];
  aboutTitle: string;
  about: string[];
  uses?: string[];
  inquiry: { about: string; placeholder: string };
  similar?: { title: string; link: { href: string; label: string }; items: React.ReactNode };
}) {
  // opis bez ponavljanja i bez rečenice koja je već u vrhu strane
  const paragraphs = [...new Set(about.map((p) => p.trim()).filter(Boolean))].filter((p) => p !== text.trim());

  return (
    <>
      {/* ── vrh: slika i podaci ── */}
      <section className="bg-paper">
        <div className={`${WRAP} pb-14 pt-8 md:pb-24 md:pt-10`}>
          <Crumbs items={crumbs} />

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12 xl:gap-16">
            {/* na desktopu slika prati visinu kolone sa podacima (bez lepljenja, ne pomera se pri skrolu) */}
            <div className="min-w-0">
              <ProductGallery images={images?.length ? images : [image]} alt={name} badge={badge} tag={tag} className="lg:aspect-auto lg:h-full lg:min-h-[480px]" />
            </div>

            <div className="flex min-w-0 flex-col">
              {/* natpis levo, logo proizvođača sitno u gornjem desnom uglu */}
              <div className="flex min-h-6 items-center justify-between gap-4">
                <p className={`truncate ${EYEBROW}`}>{eyebrow}</p>
                {logo ? (
                  // eslint-disable-next-line @next/next/no-img-element -- logo proizvođača
                  <img src={logo} alt={brandName} className="h-5 w-auto max-w-[110px] shrink-0 object-contain object-right md:h-6" />
                ) : (
                  <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.16em] text-ink/70">{brandName}</span>
                )}
              </div>
              <h1 className="mt-2 text-[36px] font-medium leading-[1.02] tracking-[-0.03em] md:text-[48px]">{name}</h1>
              <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-mist md:text-[15px]">{text}</p>

              {stats.length > 0 && (
                <div className="mt-6">
                  <StatTiles stats={stats} />
                </div>
              )}

              <div className="mt-5">
                <PriceCard price="Na upit" note={priceNote} cta="Zatražite ponudu" href="#ponuda" />
              </div>

              <div className="mt-4">
                <PerkList perks={perks} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── opis (naslov levo, tekst desno) i specifikacija kao jedna tabela ── */}
      <section className="bg-canvas">
        <div className={`${WRAP} py-14 md:py-24`}>
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-16">
            <div>
              <p className={EYEBROW}>{aboutTitle}</p>
              <h2 className="mt-3 text-[28px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[34px]">
                {name}
                <span className="text-[#e02a33]">.</span>
              </h2>
            </div>
            <div className="lg:pt-7">
              <div className="max-w-3xl space-y-4 text-[14px] leading-[1.75] text-ink/75 md:text-[16px]">
                {(paragraphs.length ? paragraphs : [text]).map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              {uses && uses.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <span className="mr-1 text-[11px] font-medium uppercase tracking-[0.18em] text-mist">Primena</span>
                  {uses.map((u) => (
                    <span key={u} className="whitespace-nowrap rounded-full bg-paper px-3.5 py-1.5 text-[13px] ring-1 ring-line">{u}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-10 md:mt-14">
            <SpecGroups groups={specs} head={{ title: specTitle, note: "Podaci su informativni. Tačnu opremu i specifikaciju potvrđujemo uz ponudu.", source: specSource }} />
          </div>
        </div>
      </section>

      <InquirySection title={`Zatražite ponudu za ${name}`} productName={name} about={inquiry.about} placeholder={inquiry.placeholder} />

      {similar && (
        <Similar title={similar.title} link={similar.link}>
          {similar.items}
        </Similar>
      )}
    </>
  );
}
