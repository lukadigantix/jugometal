"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { ArrowRight, Logo } from "./graphics";
import { t } from "./copy";
import { sanitizeHtml, looksLikeHtml } from "@/lib/html";
import type { SiteInfo } from "@/lib/site-info";
import type { NavItem } from "@/lib/catalog";
import { cityName, mapQuery, tel } from "@/lib/site-context";
import { OPEN_CONSENT_EVENT } from "./Marketing";

/* Podnožje u tri dela:
 * 1. brend (logo, opis, mreže) i kontakt kartice - sve iz admina (Podešavanja → Sajt)
 * 2. kolone: brendovi traktora i kategorije mašina iz kataloga, strane sajta, radno vreme iz admina
 * 3. donja traka: firma, PIB/MB, pravne strane, kolačići, potpis */

// godina iz teksta u copy.ts (new Date() pri renderovanju ne prolazi Next proveru za cacheComponents)
const COPYRIGHT_YEAR = /\d{4}/.exec(t.footer.copyright)?.[0] ?? "";
const MACHINES_SHOWN = 10; // dve kolone po pet

const mapLink = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

const SOCIAL = [
  { key: "facebook", name: "Facebook" },
  { key: "instagram", name: "Instagram" },
  { key: "twitter", name: "X" },
  { key: "tiktok", name: "TikTok" },
] as const;

export function SocialIcon({ name }: { name: (typeof SOCIAL)[number]["key"] }) {
  const p = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;
  if (name === "facebook") return <svg {...p}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>;
  if (name === "instagram")
    return (
      <svg {...p}>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <path d="M17.5 6.5h.01" />
      </svg>
    );
  if (name === "twitter") return <svg {...p}><path d="M4 4l11.7 16H20L8.3 4z" /><path d="M4 20l6.8-6.8M13.2 10.8L20 4" /></svg>;
  return <svg {...p}><path d="M21 7.9v4a10 10 0 0 1-5-1.9v4.5a6.5 6.5 0 1 1-8-6.3v4.3a2.5 2.5 0 1 0 4 2V3h4.1A6 6 0 0 0 21 7.9z" /></svg>;
}

/** Kolona sa linkovima; na telefonu se otvara klikom na naslov */
function Column({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="border-b border-paper/10 lg:border-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left lg:pointer-events-none lg:py-0"
      >
        <h3 className="text-[12px] font-medium uppercase tracking-[0.16em] text-paper/45">{title}</h3>
        <span className={`text-[20px] leading-none text-paper/60 transition-transform lg:hidden ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      <div className={`pb-5 lg:mt-5 lg:block lg:pb-0 ${open ? "block" : "hidden"}`}>{children}</div>
    </div>
  );
}

const LINK = "text-paper/75 transition-colors duration-150 hover:text-paper";

export default function FooterView({
  info,
  cookieSettings = false,
  tractorBrands,
  machineCategories,
}: {
  info: SiteInfo;
  cookieSettings?: boolean;
  tractorBrands: NavItem[];
  machineCategories: NavItem[];
}) {
  const [open, setOpen] = useState<string | null>(null);
  const toggle = (k: string) => () => setOpen((v) => (v === k ? null : k));
  const social = SOCIAL.filter((s) => info.social[s.key]);
  const c = info.contact;
  const address = [c.street, c.city].filter(Boolean).join(", ");
  const ids = [c.pib && `PIB ${c.pib}`, c.mb && `MB ${c.mb}`].filter(Boolean);
  const pages = t.footer.cols.find((col) => col.title === "Jugometal")?.links ?? [];
  const machines = machineCategories.slice(0, MACHINES_SHOWN);

  const cards = [
    c.phone && {
      label: "Pozovite",
      icon: Phone,
      value: c.phone,
      href: tel(c.phone),
      note: c.phoneParts ? <>Rezervni delovi: <a href={tel(c.phoneParts)} className="text-paper/80 hover:text-paper">{c.phoneParts}</a></> : "Prodaja i informacije",
    },
    c.email && { label: "Pišite nam", icon: Mail, value: c.email, href: `mailto:${c.email}`, note: "Odgovaramo istog radnog dana" },
    address && {
      label: "Posetite nas",
      icon: MapPin,
      value: c.street || cityName(c.city),
      href: mapLink(mapQuery(c)),
      external: true,
      note: <span className="inline-flex items-center gap-1.5">{c.city} · Uputstva za put <ArrowRight className="h-2.5 w-3" /></span>,
    },
  ].filter(Boolean) as { label: string; icon: typeof Phone; value: string; href: string; external?: boolean; note: React.ReactNode }[];

  return (
    <footer className="bg-[#18191b] text-paper">
      <div className="mx-auto max-w-[1600px] px-4 md:px-9">
        {/* ── 1. brend i kontakt ── */}
        <div className="grid gap-10 border-b border-paper/10 pb-6 pt-12 md:pt-14 lg:pb-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:items-center lg:gap-16">
          <div>
            <Link href="/" aria-label="Jugometal - početna" className="inline-block">
              <Logo onDark className="h-11 w-auto md:h-14" />
            </Link>
            {info.description &&
              (looksLikeHtml(info.description) ? (
                <div
                  className="mt-5 max-w-md text-pretty text-[14px] leading-relaxed text-paper/55 [&_a]:underline [&_p+p]:mt-2"
                  dangerouslySetInnerHTML={{ __html: sanitizeHtml(info.description) }}
                />
              ) : (
                <p className="mt-5 max-w-md text-pretty text-[14px] leading-relaxed text-paper/55">{info.description}</p>
              ))}
            {social.length > 0 && (
              <div className="mt-6 flex items-center gap-2">
                {social.map((s) => (
                  <a
                    key={s.key}
                    href={info.social[s.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.name}
                    title={s.name}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 text-paper/75 transition-colors duration-150 hover:border-paper hover:bg-paper hover:text-ink"
                  >
                    <SocialIcon name={s.key} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {cards.length > 0 && (
            <div className={`grid gap-3 ${cards.length === 3 ? "md:grid-cols-3" : cards.length === 2 ? "md:grid-cols-2" : ""}`}>
              {cards.map((k) => (
                <div key={k.label} className="group relative flex flex-col rounded-[4px] border border-paper/10 bg-paper/[0.03] p-5 transition-colors duration-150 hover:border-paper/30 hover:bg-paper/[0.06]">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2.5 text-[11px] uppercase tracking-[0.16em] text-paper/45">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-paper/[0.06] text-paper/80 transition-colors duration-150 group-hover:bg-[#e02a33] group-hover:text-white">
                        <k.icon className="h-3.5 w-3.5" strokeWidth={1.8} />
                      </span>
                      {k.label}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-paper/30 transition-all duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-paper" />
                  </div>
                  <a
                    href={k.href}
                    {...(k.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="mt-5 break-words text-[17px] font-medium leading-snug after:absolute after:inset-0 md:text-[18px]"
                  >
                    {k.value}
                  </a>
                  {/* napomena iznad linka preko cele kartice, da broj za delove ostane posebno klikabilan */}
                  <span className="pointer-events-none relative mt-auto pt-1.5 text-[13px] text-paper/50 [&_a]:pointer-events-auto">{k.note}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── 2. kolone ── */}
        <div className="grid py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-12 lg:py-12">
          {tractorBrands.length > 0 && (
            <Column title="Traktori" open={open === "traktori"} onToggle={toggle("traktori")}>
              <ul className="space-y-3 text-[15px]">
                {tractorBrands.map((b) => (
                  <li key={b.slug}>
                    <Link href={`/traktori/${b.slug}`} className={LINK}>
                      {b.name}
                    </Link>
                  </li>
                ))}
                <li className="pt-1">
                  <Link href="/traktori" className="inline-flex items-center gap-2 text-[13px] text-paper/50 transition-colors hover:text-paper">
                    Svi traktori <ArrowRight className="h-2.5 w-3" />
                  </Link>
                </li>
              </ul>
            </Column>
          )}

          {machines.length > 0 && (
            <Column title="Priključne mašine" open={open === "masine"} onToggle={toggle("masine")}>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-3 text-[15px]">
                {machines.map((m) => (
                  <li key={m.slug}>
                    <Link href={`/prikljucne-masine/${m.slug}`} className={LINK}>
                      {m.name}
                    </Link>
                  </li>
                ))}
                <li className="col-span-2 pt-1">
                  <Link href="/prikljucne-masine" className="inline-flex items-center gap-2 text-[13px] text-paper/50 transition-colors hover:text-paper">
                    {machineCategories.length > MACHINES_SHOWN ? `Sve mašine (${machineCategories.length} vrsta)` : "Sve mašine"} <ArrowRight className="h-2.5 w-3" />
                  </Link>
                </li>
              </ul>
            </Column>
          )}

          <Column title="Jugometal" open={open === "jugometal"} onToggle={toggle("jugometal")}>
            <ul className="space-y-3 text-[15px]">
              {pages.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={LINK}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Column>

          {/* radno vreme iz admina; dok nije uneto, samo poziv na upit */}
          <div className="pt-8 lg:pt-0">
            <h3 className="text-[12px] font-medium uppercase tracking-[0.16em] text-paper/45">
              {info.workingHours.length > 0 ? "Radno vreme" : "Imate pitanje?"}
            </h3>
            {info.workingHours.length > 0 ? (
              <dl className="mt-5 space-y-2.5 text-[15px]">
                {info.workingHours.map((h) => (
                  <div key={h.days} className="flex items-baseline justify-between gap-4 border-b border-paper/10 pb-2.5">
                    <dt className="text-paper/75">{h.days}</dt>
                    <dd className={`text-right tabular-nums ${h.isOpen ? "text-paper" : "text-paper/40"}`}>
                      {h.hours}
                      {h.note && <span className="block text-[12px] text-paper/40">{h.note}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-paper/75 text-pretty">
                Model traktora, šifra dela ili termin servisa - pošaljite upit i javljamo se istog radnog dana.
              </p>
            )}
            <Link
              href="/kontakt#poruka"
              className="group mt-6 inline-flex items-center gap-2.5 rounded-full bg-paper py-3 pl-6 pr-5 text-[14px] text-ink transition-colors duration-150 hover:bg-canvas"
            >
              Pošaljite upit
              <ArrowRight className="h-2.5 w-3 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* ── 3. donja traka ── */}
        <div className="flex flex-col gap-4 border-t border-paper/10 py-6 text-[12px] text-paper/45 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span>{c.name ? `© ${COPYRIGHT_YEAR} ${c.name}` : t.footer.copyright}</span>
            {ids.length > 0 && <span>{ids.join(" · ")}</span>}
            {t.footer.legal.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors duration-150 hover:text-paper">
                {l.label}
              </Link>
            ))}
            {/* samo kad je u adminu uključena bar jedna marketing oznaka (Podešavanja → Marketing) */}
            {cookieSettings && (
              <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))} className="transition-colors duration-150 hover:text-paper">
                Podešavanja kolačića
              </button>
            )}
          </div>
          <a
            href="https://zeroblynk.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-paper"
          >
            design &amp; developed by
            {/* crno-beli logo, na hover u boji */}
            <img
              src="/zeroblynk/logo-light.svg"
              alt="Zeroblynk"
              width={150}
              height={30}
              className="h-[15px] w-auto opacity-70 grayscale transition-[filter,opacity] duration-200 group-hover:opacity-100 group-hover:grayscale-0"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
