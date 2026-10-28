"use client";

import Link from "next/link";
import { useState } from "react";
import { Logo } from "./graphics";
import { t } from "./copy";

export default function Footer() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-[1600px] px-4 pb-10 pt-10 md:px-9 md:pt-16">
        <div className="grid gap-0 md:grid-cols-4 md:gap-12">
          {t.footer.cols.map((col) => (
            <div key={col.title} className="border-b border-paper/15 md:border-0">
              <button
                type="button"
                onClick={() => setOpen((v) => (v === col.title ? null : col.title))}
                aria-expanded={open === col.title}
                className="flex w-full items-center justify-between py-4 text-left md:pointer-events-none md:py-0"
              >
                <h3 className="text-[17px] font-medium md:text-[20px]">{col.title}</h3>
                <span className={`text-[20px] leading-none opacity-60 transition-transform md:hidden ${open === col.title ? "rotate-45" : ""}`}>+</span>
              </button>
              <ul className={`space-y-3 pb-5 text-[14px] md:mt-6 md:block md:pb-0 ${open === col.title ? "block" : "hidden"}`}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="opacity-60 transition-opacity duration-150 hover:opacity-100">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="pt-8 md:pt-0">
            <h3 className="text-[20px] font-medium">{t.footer.ride}</h3>
            <p className="mt-6 text-[13px] opacity-70">{t.footer.subscribe}</p>
            <form className="mt-3" action="#">
              <input
                type="email"
                placeholder={t.footer.email}
                className="w-full rounded-[4px] bg-paper/10 px-4 py-3 text-[14px] placeholder:text-paper/50 focus:outline-none focus:ring-1 focus:ring-paper/40"
              />
              <button
                type="button"
                className="mt-3 w-full rounded-full bg-paper py-3 text-[14px] text-ink transition-colors duration-150 ease-[var(--ease-brand)] hover:bg-canvas"
              >
                {t.footer.submit}
              </button>
            </form>
            <label className="mt-4 flex items-start gap-2 text-[11px] opacity-60">
              <input type="checkbox" className="mt-0.5 accent-white" />
              {t.footer.consent}
            </label>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-6 border-t border-paper/15 pt-8 md:mt-16 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-6 text-[13px]">
            <span className="opacity-70">{t.footer.copyright}</span>
            {t.footer.legal.map((l) => (
              <Link key={l.href} href={l.href} className="opacity-60 transition-opacity duration-150 hover:opacity-100">
                {l.label}
              </Link>
            ))}
          </div>

          {/* tri grada umesto platnih kartica */}
          <div className="flex items-center gap-2">
            {t.footer.cities.map((c) => (
              <span key={c} className="rounded-[3px] bg-paper/90 px-2 py-1 text-[9px] font-semibold tracking-wider text-ink">
                {c}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {t.footer.social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-paper/25 text-[10px] font-medium opacity-70 transition-all duration-150 hover:border-paper hover:opacity-100"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center text-center">
          <Logo onDark className="h-8 w-auto" />
          <p className="mt-3 text-[11px] opacity-30">{t.footer.tagline}</p>
          <a
            href="https://zeroblynk.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-paper/40 transition-opacity duration-150 hover:opacity-80"
          >
            design &amp; developed by
            <img src="/zeroblynk/logo-light.svg" alt="Zeroblynk" width={150} height={30} className="h-[15px] w-auto" />
          </a>
        </div>
      </div>
    </footer>
  );
}
