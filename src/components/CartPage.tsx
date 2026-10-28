"use client";

import Link from "next/link";
import { useState } from "react";
import Reveal from "./Reveal";
import { Chevron } from "./graphics";
import { formatRsd } from "@/data/featured-parts";
import { clearCart, removeFromCart, setQty, useCart } from "@/lib/cart";
import company from "@/data/company.json";

/* Korpa. Porudžbina za sada ide e-mailom (nema backend-a): otvara se e-mail program sa listom
 * artikala i podacima za dostavu. Cenu dostave i način plaćanja NE izmišljamo - potvrđuje ih
 * prodavac telefonom (pitanje za klijenta u docs/ISTRAZIVANJE.md). */

const tel = (p: string) => `tel:${p.replace(/\D/g, "")}`;

function Qty({ id, qty }: { id: string; qty: number }) {
  return (
    <div className="inline-flex h-10 items-center rounded-full border border-line">
      <button type="button" aria-label="Manje" onClick={() => setQty(id, qty - 1)} className="h-10 w-10 text-[18px] text-mist hover:text-ink">−</button>
      <input
        aria-label="Količina"
        inputMode="numeric"
        value={qty}
        onChange={(e) => {
          const n = parseInt(e.target.value.replace(/\D/g, ""), 10);
          if (!Number.isNaN(n)) setQty(id, n);
        }}
        className="w-9 bg-transparent text-center text-[15px] focus:outline-none"
      />
      <button type="button" aria-label="Više" onClick={() => setQty(id, qty + 1)} className="h-10 w-10 text-[18px] text-mist hover:text-ink">+</button>
    </div>
  );
}

export default function CartPage() {
  const { items, count, subtotal } = useCart();
  const [f, setF] = useState({ name: "", email: "", phone: "", city: "", zip: "", address: "", note: "" });
  const [sent, setSent] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });
  const input = "w-full rounded-[4px] border border-line bg-paper px-4 py-3 text-[15px] placeholder:text-mist focus:border-ink focus:outline-none";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = items.map((i) => `- ${i.name}${i.code && !/\s/.test(i.code) ? ` (šifra ${i.code})` : ""} x ${i.qty} = ${formatRsd(i.total)}`).join("\n");
    const body = `Porudžbina sa sajta\n\n${lines}\n\nUkupno artikala: ${formatRsd(subtotal)}\n\n---\nIme i prezime: ${f.name}\nTelefon: ${f.phone}\nE-mail: ${f.email}\nAdresa: ${f.address}\nMesto: ${f.zip} ${f.city}\nNapomena: ${f.note}`;
    window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(`Porudžbina delova - ${f.name}`)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 pb-16 pt-8 md:px-9 md:pb-24 md:pt-12">
      <nav aria-label="Putanja" className="text-[13px] text-mist">
        <Link href="/" className="hover:text-ink">Početna</Link>
        <span className="mx-2">/</span>
        <Link href="/rezervni-delovi" className="hover:text-ink">Online prodavnica</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">Korpa</span>
      </nav>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-[36px] font-medium leading-none md:text-[52px]">Korpa</h1>
        {count > 0 && <p className="text-[14px] text-mist">{count} {count === 1 ? "artikal" : "artikala"}</p>}
      </div>

      {items.length === 0 ? (
        <Reveal>
          <div className="mt-10 flex flex-col items-center rounded-[4px] bg-canvas px-6 py-16 text-center md:py-24">
            <svg viewBox="0 0 16 16" className="h-10 w-10 text-mist" aria-hidden>
              <g fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinejoin="round">
                <path d="M3 5.2h10l-.7 8.3H3.7L3 5.2Z" />
                <path d="M5.6 5V4a2.4 2.4 0 0 1 4.8 0v1" />
              </g>
            </svg>
            <h2 className="mt-5 text-[24px] font-medium md:text-[30px]">{sent ? "Hvala na porudžbini." : "Korpa je prazna."}</h2>
            <p className="mt-2 max-w-md text-[15px] text-mist">
              {sent
                ? "Ako se e-mail nije otvorio, pozovite odeljenje delova i izdiktirajte porudžbinu."
                : "Pronađite deo po nazivu, šifri ili brendu traktora u online prodavnici."}
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link href="/rezervni-delovi" className="rounded-full bg-accent px-8 py-3 text-[14px] text-accent-contrast hover:bg-accent-soft">
                Online prodavnica
              </Link>
              <a href={tel(company.locations[0].phoneParts!)} className="rounded-full border border-line bg-paper px-8 py-3 text-[14px] hover:border-ink">
                Delovi {company.locations[0].phoneParts}
              </a>
            </div>
          </div>
        </Reveal>
      ) : (
        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
          {/* artikli */}
          <div>
            <ul className="divide-y divide-line border-y border-line">
              {items.map((i) => (
                <li key={i.id} className="grid grid-cols-[80px_1fr] gap-4 py-5 md:grid-cols-[110px_1fr_auto] md:items-center md:gap-6">
                  <Link href={i.href} className="relative block aspect-square overflow-hidden rounded-[4px] bg-white">
                    {i.image && <img src={i.image} alt={i.name} className="absolute inset-0 h-full w-full object-contain p-2" />}
                  </Link>
                  <div className="min-w-0">
                    <p className="text-[12px] uppercase tracking-[0.14em] text-mist">{i.brand}</p>
                    <Link href={i.href} className="mt-1 block text-[16px] font-medium leading-snug hover:text-mist">{i.name}</Link>
                    {i.code && !/\s/.test(i.code) && <p className="mt-1 text-[13px] text-mist">Šifra: {i.code}</p>}
                    <p className="mt-1 text-[13px] text-mist">{formatRsd(i.priceRsd)} / kom</p>
                  </div>
                  <div className="col-span-2 flex items-center justify-between gap-4 md:col-span-1 md:flex-col md:items-end">
                    <p className="order-2 text-[18px] font-medium md:order-1">{formatRsd(i.total)}</p>
                    <div className="order-1 flex items-center gap-3 md:order-2">
                      <Qty id={i.id} qty={i.qty} />
                      <button type="button" onClick={() => removeFromCart(i.id)} className="text-[13px] text-mist underline-offset-4 hover:text-ink hover:underline">
                        Ukloni
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <Link href="/rezervni-delovi" className="group inline-flex items-center gap-1 text-[14px]">
                <Chevron className="h-2.5 w-2.5 rotate-180" /> Nastavi kupovinu
              </Link>
              <button type="button" onClick={clearCart} className="text-[13px] text-mist hover:text-ink">Isprazni korpu</button>
            </div>
          </div>

          {/* rezime + dostava */}
          <form onSubmit={submit} className="self-start rounded-[4px] bg-canvas p-5 md:p-8 lg:sticky lg:top-28">
            <h2 className="text-[22px] font-medium">Pregled porudžbine</h2>
            <dl className="mt-4 text-[15px]">
              <div className="flex justify-between border-b border-line py-3">
                <dt className="text-mist">Artikli ({count})</dt>
                <dd>{formatRsd(subtotal)}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-line py-3">
                <dt className="text-mist">Dostava</dt>
                <dd className="text-right text-[14px] text-mist">Potvrđujemo telefonom</dd>
              </div>
              <div className="flex items-baseline justify-between py-4">
                <dt className="text-[16px] font-medium">Ukupno</dt>
                <dd className="text-[26px] font-medium">{formatRsd(subtotal)}</dd>
              </div>
            </dl>

            <h3 className="mt-2 text-[16px] font-medium">Podaci za dostavu</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <input required placeholder="Ime i prezime" value={f.name} onChange={set("name")} className={`${input} sm:col-span-2`} autoComplete="name" />
              <input required type="tel" placeholder="Broj telefona" value={f.phone} onChange={set("phone")} className={input} autoComplete="tel" />
              <input type="email" placeholder="E-mail" value={f.email} onChange={set("email")} className={input} autoComplete="email" />
              <input required placeholder="Adresa" value={f.address} onChange={set("address")} className={`${input} sm:col-span-2`} autoComplete="street-address" />
              <input required placeholder="Grad" value={f.city} onChange={set("city")} className={input} autoComplete="address-level2" />
              <input required inputMode="numeric" placeholder="Poštanski broj" value={f.zip} onChange={set("zip")} className={input} autoComplete="postal-code" />
              <textarea placeholder="Napomena (model traktora, vreme za poziv...)" value={f.note} onChange={set("note")} rows={3} className={`${input} sm:col-span-2`} />
            </div>
            <button type="submit" className="mt-5 w-full rounded-full bg-accent py-3.5 text-[15px] text-accent-contrast transition-colors hover:bg-accent-soft">
              Pošalji porudžbinu
            </button>
            <p className="mt-3 text-[12px] leading-relaxed text-mist">
              Otvoriće se vaš e-mail program sa popunjenom porudžbinom. Pre slanja dela pozvaćemo vas da potvrdimo dostupnost, cenu dostave i način plaćanja.
            </p>
            <a href={tel(company.locations[0].phoneParts!)} className="mt-4 flex items-center justify-between rounded-[4px] bg-paper p-4 text-[14px] hover:bg-white">
              <span className="text-mist">Radije telefonom?</span>
              <span className="font-medium">Delovi {company.locations[0].phoneParts}</span>
            </a>
          </form>
        </div>
      )}
    </section>
  );
}
