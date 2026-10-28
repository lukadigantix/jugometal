"use client";

import Link from "next/link";
import list from "@/data/tractor-list.json";

type T = (typeof list)[number];
const logoOf = (brand: string) => `/brands/trim/${brand === "john-deere" ? "deere" : brand}.png`;

/* Kartica traktora - ista u listi /traktori i u "Slični modeli". */
export default function TractorCard({ t }: { t: T }) {
  return (
                  <article className="group flex h-full flex-col overflow-hidden rounded-[4px] border border-line bg-paper transition-shadow duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                    <Link href={t.href} aria-label={t.name} className="relative block aspect-[4/3] bg-white">
                      <img src={t.image} alt={t.name} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.04]" />
                      <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-[12px] font-medium text-paper">{t.ks} KS</span>
                      {t.drive && <span className="absolute right-3 top-3 rounded-full border border-line bg-paper px-2.5 py-1 text-[11px]">{t.drive}</span>}
                    </Link>
                    <div className="flex flex-1 flex-col border-t border-line p-5">
                      <img src={logoOf(t.brand)} alt={t.brandName} className="h-6 w-auto max-w-[100px] self-start object-contain" />
                      <h2 className="mt-3 text-[20px] font-medium leading-tight">
                        <Link href={t.href} className="hover:text-mist">{t.name}</Link>
                      </h2>
                      <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-mist">{t.text}</p>
                      {t.specs.length > 0 && (
                        <dl className="mt-3 space-y-1 text-[13px]">
                          {t.specs.map((s) => (
                            <div key={s.label} className="flex justify-between gap-3 border-b border-line pb-1">
                              <dt className="text-mist">{s.label}</dt>
                              <dd className="text-right">{s.value}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                      <div className="mt-auto flex items-center gap-3 pt-5">
                        <Link href={t.href} className="rounded-full bg-accent px-6 py-2.5 text-[14px] text-accent-contrast hover:bg-accent-soft">Pogledaj model</Link>
                        <Link href="/kontakt" className="text-[13px] text-mist underline-offset-4 hover:text-ink hover:underline">Cena na upit</Link>
                      </div>
                    </div>
                  </article>
  );
}
