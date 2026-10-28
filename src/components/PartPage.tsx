"use client";

import Link from "next/link";
import { useState } from "react";
import { Bag, Chevron } from "./graphics";
import { formatRsd, partGroups, prettyName, searchIndex } from "@/data/featured-parts";
import { addToCart } from "@/lib/cart";
import company from "@/data/company.json";

const tel = (p: string) => `tel:${p.replace(/\D/g, "")}`;

/* Strana rezervnog dela: slika, brend, šifra, cena, količina + U korpu, opis, poziv delovima,
 * ostali delovi istog brenda. */
export default function PartPage({ group, brand, part }: { group: string; brand: string; part: string }) {
  const p = searchIndex.find((x) => x.group === group && x.sub === brand && x.slug === part)!;
  const g = partGroups.find((x) => x.slug === group)!;
  const b = g.brands.find((x) => x.slug === brand)!;
  const code = p.code && !/\s/.test(p.code) ? p.code : "";
  const extra = p.code && /\s/.test(p.code) ? p.code : "";
  const desc = [p.description, extra]
    .map((x) => (x && x === x.toUpperCase() ? prettyName(x) : x))
    .filter((x) => x && x.toLowerCase() !== p.name.toLowerCase())
    .join(" · ");
  const related = searchIndex.filter((x) => x.sub === brand && x.id !== p.id).sort((a, c) => Math.abs(a.priceRsd - p.priceRsd) - Math.abs(c.priceRsd - p.priceRsd)).slice(0, 4);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <>
      <section className="mx-auto w-full max-w-[1600px] px-4 pb-12 pt-8 md:px-9 md:pb-16 md:pt-12">
        <nav aria-label="Putanja" className="text-[13px] text-mist">
          <Link href="/" className="hover:text-ink">Početna</Link>
          <span className="mx-2">/</span>
          <Link href="/rezervni-delovi" className="hover:text-ink">Online prodavnica</Link>
          <span className="mx-2">/</span>
          <Link href={`/rezervni-delovi/${g.slug}`} className="hover:text-ink">{g.name}</Link>
          <span className="mx-2">/</span>
          <Link href={b.href} className="hover:text-ink">{b.name}</Link>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
          <div className="relative aspect-square overflow-hidden rounded-[4px] border border-line bg-white lg:aspect-[5/4]">
            {p.image && <img src={p.image} alt={p.name} fetchPriority="high" className="absolute inset-0 h-full w-full object-contain p-10 md:p-16" />}
          </div>

          <div className="flex min-w-0 flex-col">
            {p.logo ? <img src={p.logo} alt={p.brand} className="h-9 w-auto max-w-[160px] self-start object-contain" /> : <p className="text-[13px] uppercase tracking-[0.16em] text-mist">{p.brand}</p>}
            <h1 className="mt-4 text-[30px] font-medium leading-[1.08] md:text-[42px]">{p.name}</h1>
            {code && (
              <p className="mt-3 inline-flex items-center gap-2 self-start rounded-full bg-canvas px-3 py-1.5 text-[13px]">
                Šifra: <span className="font-medium">{code}</span>
              </p>
            )}
            {desc && <p className="mt-4 text-[15px] leading-relaxed text-mist">{desc}</p>}

            <div className="mt-6 rounded-[4px] bg-canvas p-5 md:p-6">
              <p className="text-[34px] font-medium leading-none">{formatRsd(p.priceRsd)}</p>
              <p className="mt-2 text-[13px] text-mist">Cena po komadu. Dostupnost i dostavu potvrđujemo telefonom.</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="inline-flex h-12 items-center rounded-full border border-line bg-paper">
                  <button type="button" aria-label="Manje" onClick={() => setQty(Math.max(1, qty - 1))} className="h-12 w-12 text-[20px] text-mist hover:text-ink">−</button>
                  <span className="w-8 text-center text-[16px]" aria-live="polite">{qty}</span>
                  <button type="button" aria-label="Više" onClick={() => setQty(Math.min(99, qty + 1))} className="h-12 w-12 text-[20px] text-mist hover:text-ink">+</button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    addToCart(p.id, qty);
                    setAdded(true);
                    setTimeout(() => setAdded(false), 1600);
                  }}
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-accent px-8 text-[15px] text-accent-contrast hover:bg-accent-soft"
                >
                  <Bag className="h-4 w-4" />
                  {added ? "Dodato u korpu" : "Dodaj u korpu"}
                </button>
              </div>
              <Link href="/korpa" className="mt-3 inline-flex items-center gap-1 text-[13px] text-mist hover:text-ink">
                Idi u korpu <Chevron className="h-2.5 w-2.5" />
              </Link>
            </div>

            <ul className="mt-6 divide-y divide-line border-y border-line text-[14px]">
              <li className="flex justify-between gap-4 py-3">
                <span className="text-mist">Brend / namena</span>
                <Link href={b.href} className="text-right hover:text-mist">{b.name}</Link>
              </li>
              <li className="flex justify-between gap-4 py-3">
                <span className="text-mist">Grupa</span>
                <Link href={`/rezervni-delovi/${g.slug}`} className="text-right hover:text-mist">{g.name}</Link>
              </li>
              {code && (
                <li className="flex justify-between gap-4 py-3">
                  <span className="text-mist">Kataloški broj</span>
                  <span className="text-right">{code}</span>
                </li>
              )}
            </ul>

            <a href={tel(company.locations[0].phoneParts!)} className="mt-6 flex items-center justify-between gap-4 rounded-[4px] bg-ink p-5 text-paper">
              <span>
                <span className="block text-[12px] uppercase tracking-[0.16em] text-paper/60">Niste sigurni da li odgovara?</span>
                <span className="mt-1 block text-[15px]">Pozovite odeljenje delova sa šifrom ili modelom traktora</span>
              </span>
              <span className="shrink-0 text-[18px] font-medium">{company.locations[0].phoneParts}</span>
            </a>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line bg-canvas">
          <div className="mx-auto max-w-[1600px] px-4 py-14 md:px-9 md:py-20">
            <div className="flex items-end justify-between gap-4">
              <h2 className="text-[26px] font-medium md:text-[34px]">Još delova za {b.name}</h2>
              <Link href={b.href} className="group inline-flex shrink-0 items-center gap-1 text-[14px]">
                Svi ({b.count}) <Chevron className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <ul className="mt-6 grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
              {related.map((r) => (
                <li key={r.id}>
                  <Link href={r.href} className="group flex h-full flex-col overflow-hidden rounded-[4px] border border-line bg-paper">
                    <span className="relative block aspect-square bg-white">
                      {r.image && <img src={r.image} alt={r.name} loading="lazy" className="absolute inset-0 h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.05]" />}
                    </span>
                    <span className="flex flex-1 flex-col border-t border-line p-4">
                      <span className="line-clamp-2 text-[14px] font-medium leading-snug">{r.name}</span>
                      <span className="mt-auto pt-3 text-[17px] font-medium">{formatRsd(r.priceRsd)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
