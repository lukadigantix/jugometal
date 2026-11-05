"use client";

import Link from "next/link";
import { CircleAlert, Minus, Phone, Plus, ShieldCheck, ShoppingBag, Store, Trash2, Truck } from "lucide-react";
import { ArrowRight } from "./graphics";
import CheckoutHero from "./korpa/CheckoutHero";
import { formatRsd, prettyName } from "@/data/featured-parts";
import { clearCart, removeFromCart, setQty, useCart } from "@/lib/cart";
import { amount, useQuote, type QuoteItem } from "@/lib/checkout";
import { cityName, tel, useSite } from "@/lib/site-context";

/*
  Korpa, 1. korak (po uzoru na HTZ SHOP /korpa): levo stavke (slika, brend, naziv, cena po komadu, količina, ukloni),
  desno pregled sa iznosom i „Nastavite na plaćanje". Dostava i plaćanje se biraju u 2. koraku (/porudzbina),
  pa se ovde obračunava bez cene dostave. Stavke su u localStorage, cene i dostupnost uvek sa servera (POST /shop/cart/quote).
*/

const KARTICA = "rounded-[12px] bg-paper ring-1 ring-line";
const MAX_QTY = 99;

function Stavka({ s }: { s: QuoteItem }) {
  const p = s.product;
  const name = p ? prettyName(p.name) : "Artikal više ne postoji";
  const href = p?.path ?? "/rezervni-delovi";
  const code = p?.code && !/\s/.test(p.code) ? p.code : "";
  const q = s.quantity;
  return (
    <li className="grid grid-cols-[84px_1fr] gap-4 py-5 first:pt-0 last:pb-0 sm:grid-cols-[112px_1fr] sm:gap-6">
      <Link href={href} className="relative grid aspect-square place-items-center overflow-hidden rounded-[10px] bg-white ring-1 ring-line">
        {p?.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- slika sa backenda
          <img src={p.image} alt="" className="size-full object-contain p-2" />
        ) : (
          <ShoppingBag className="size-6 text-mist/50" strokeWidth={1.5} aria-hidden />
        )}
      </Link>

      <div className="min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            {p?.brand && <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-mist">{p.brand}</p>}
            <h3 className="mt-0.5 text-[16px] font-medium leading-snug sm:text-[18px]">
              <Link href={href} className="hover:underline hover:underline-offset-2">
                {name}
              </Link>
            </h3>
            <p className="mt-1 text-[13px] text-mist">
              {code && <>Šifra: {code} · </>}
              <span className="tabular-nums">{formatRsd(s.unitPrice)}</span> / kom
            </p>
          </div>
          <p className="hidden shrink-0 text-right text-[18px] font-medium tabular-nums sm:block">{s.available ? formatRsd(s.totalPrice) : "-"}</p>
        </div>

        {!s.available && (
          <p className="mt-2.5 flex items-start gap-2 rounded-[4px] bg-[#fff4e5] px-3 py-2 text-[13px] leading-[19px]">
            <CircleAlert className="mt-px size-4 shrink-0 text-[#b45309]" strokeWidth={2} aria-hidden />
            <span>{s.reason ?? "Artikal trenutno nije dostupan."} Uklonite ga da biste nastavili.</span>
          </p>
        )}

        <div className="mt-3.5 flex items-center justify-between gap-3">
          {s.available ? (
            <div className="flex h-10 items-center rounded-full border border-line bg-paper">
              <button type="button" onClick={() => setQty(s.productId, q - 1)} disabled={q <= 1} aria-label={`Smanji količinu: ${name}`} className="grid h-full w-10 place-items-center text-ink transition disabled:text-line">
                <Minus className="size-4" strokeWidth={2} aria-hidden />
              </button>
              <span aria-live="polite" className="w-8 text-center text-[15px] font-medium tabular-nums">
                {q}
              </span>
              <button type="button" onClick={() => setQty(s.productId, q + 1)} disabled={q >= MAX_QTY} aria-label={`Povećaj količinu: ${name}`} className="grid h-full w-10 place-items-center text-ink transition disabled:text-line">
                <Plus className="size-4" strokeWidth={2} aria-hidden />
              </button>
            </div>
          ) : (
            <span />
          )}
          <p className="text-[16px] font-medium tabular-nums sm:hidden">{s.available ? formatRsd(s.totalPrice) : "-"}</p>
          <button type="button" onClick={() => removeFromCart(s.productId)} className="hidden items-center gap-1.5 text-[13px] font-medium text-mist transition hover:text-[#e02a33] sm:flex">
            <Trash2 className="size-4" strokeWidth={1.8} aria-hidden />
            Ukloni
          </button>
        </div>
        <button type="button" onClick={() => removeFromCart(s.productId)} className="mt-3 flex items-center gap-1.5 text-[13px] font-medium text-mist transition hover:text-[#e02a33] sm:hidden">
          <Trash2 className="size-4" strokeWidth={1.8} aria-hidden />
          Ukloni
        </button>
      </div>
    </li>
  );
}

export default function CartPage() {
  const { lines, count } = useCart();
  const { quote, items, error } = useQuote(lines, "preuzimanje");
  const { contact } = useSite();
  const help = contact.phoneParts || contact.phone;

  const unavailable = items.filter((i) => !i.available);
  const rules = quote?.rules;
  const belowMin = !!rules && rules.minOrderAmount > 0 && (quote?.subtotal ?? 0) < rules.minOrderAmount;
  const canOrder = !!quote && unavailable.length === 0 && !belowMin;

  return (
    <>
    <CheckoutHero
      step={0}
      title={lines.length ? "Korpa" : "Korpa je prazna"}
      meta={count ? `${count} kom` : undefined}
      sub={lines.length ? "Proverite artikle i količine. Dostavu i plaćanje birate u sledećem koraku." : undefined}
    />
    <div className="bg-canvas">
      <div className="mx-auto w-full max-w-[1600px] px-4 pb-14 pt-8 md:px-9 md:pb-24 md:pt-12">

        {lines.length === 0 ? (
          <Prazna />
        ) : error && !quote ? (
          <div className={`${KARTICA} p-8 text-center`}>
            <p className="text-[16px]">{error}</p>
            <a href={tel(help)} className="mt-6 inline-flex h-12 items-center rounded-full bg-ink px-7 text-[15px] text-white">
              Pozovite {help}
            </a>
          </div>
        ) : !quote ? (
          <Kostur />
        ) : (
          <>
            <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-8">
              <div className="space-y-5">
                <section aria-label="Stavke u korpi" className={`${KARTICA} p-5 md:p-8`}>
                  {unavailable.length > 0 && (
                    <p className="mb-6 flex items-start gap-2 rounded-[4px] bg-[#fff4e5] px-4 py-3 text-[14px]">
                      <CircleAlert className="mt-0.5 size-4 shrink-0 text-[#b45309]" strokeWidth={2} aria-hidden />
                      Neki artikli trenutno nisu dostupni. Uklonite ih iz korpe da biste nastavili.
                    </p>
                  )}
                  <ul className="divide-y divide-line">
                    {items.map((s) => (
                      <Stavka key={s.productId} s={s} />
                    ))}
                  </ul>
                </section>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <Link href="/rezervni-delovi" className="group inline-flex items-center gap-2 text-[15px] font-medium">
                    Nastavite kupovinu <ArrowRight className="h-3 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <button type="button" onClick={clearCart} className="text-[13px] text-mist transition hover:text-ink">
                    Isprazni korpu
                  </button>
                </div>

                {/* zašto kupovati ovde - samo ono što važi za svaku porudžbinu */}
                <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-[12px] bg-line ring-1 ring-line sm:grid-cols-3">
                  {[
                    { Icon: Truck, naslov: "Dostava širom Srbije", opis: "Kurirskom službom na vašu adresu" },
                    { Icon: Store, naslov: "Lično preuzimanje", opis: [contact.street, cityName(contact.city)].filter(Boolean).join(", ") },
                    { Icon: ShieldCheck, naslov: "Plaćanje pouzećem", opis: "Ili uplatom na račun" },
                  ].map(({ Icon, naslov, opis }) => (
                    <li key={naslov} className="flex items-center gap-3.5 bg-paper p-4 md:p-5">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#e02a33]/10 text-[#e02a33]">
                        <Icon className="size-[18px]" strokeWidth={1.7} aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[14px] font-medium">{naslov}</span>
                        <span className="block text-[13px] text-mist">{opis}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <aside aria-label="Pregled porudžbine" className="overflow-hidden rounded-[12px] bg-[#18191b] text-white lg:sticky lg:top-28">
                <div className="p-5 md:p-7">
                  <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33]">Pregled</p>
                  <h2 className="mt-2 text-[22px] font-medium tracking-[-0.01em]">Vaša korpa</h2>

                  <dl className="mt-5 space-y-2.5 text-[15px]">
                    <div className="flex justify-between gap-4">
                      <dt className="text-white/55">Artikli ({count} kom)</dt>
                      <dd className="font-medium tabular-nums">{formatRsd(quote.subtotal)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-white/55">Dostava</dt>
                      <dd className="text-right text-[14px] text-white/55">bira se u sledećem koraku</dd>
                    </div>
                  </dl>

                  <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/10 pt-5">
                    <span className="text-[15px] font-medium">Ukupno</span>
                    <span className="text-[36px] font-medium leading-none tracking-[-0.03em] tabular-nums">
                      {amount(quote.subtotal)}
                      <span className="ml-1 text-[15px] tracking-normal text-white/55">RSD</span>
                    </span>
                  </div>
                  <p className="mt-1.5 text-right text-[12px] text-white/45">Cene sa PDV-om</p>

                  {belowMin && (
                    <p className="mt-5 rounded-[10px] bg-[#fff4e5] px-4 py-3 text-[14px] text-ink">
                      Najmanji iznos porudžbine je {formatRsd(rules!.minOrderAmount)}.
                    </p>
                  )}

                  {canOrder ? (
                    <Link
                      href="/porudzbina"
                      className="group mt-6 flex h-14 w-full items-center justify-between rounded-full bg-[#e02a33] pl-6 pr-2 text-[15px] font-medium text-white transition hover:bg-[#c41f27]"
                    >
                      Nastavite na plaćanje
                      <span className="grid size-10 place-items-center rounded-full bg-white text-[#e02a33]">
                        <ArrowRight className="h-3 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                      </span>
                    </Link>
                  ) : (
                    !belowMin && <p className="mt-6 rounded-[10px] bg-white/[0.06] px-4 py-3 text-[14px] text-white/65">Uklonite artikle koji nisu dostupni, pa nastavite na plaćanje.</p>
                  )}

                  {help && (
                    <a href={tel(help)} className="group mt-5 flex items-center gap-3 rounded-[10px] border border-white/10 p-3.5 transition hover:border-white/30">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white/[0.06] text-white/80 transition-colors group-hover:bg-[#e02a33] group-hover:text-white">
                        <Phone className="size-[17px]" strokeWidth={1.6} aria-hidden />
                      </span>
                      <span>
                        <span className="block text-[11px] uppercase tracking-[0.14em] text-white/45">Pomoć pri porudžbini</span>
                        <span className="block text-[16px] font-medium">{help}</span>
                      </span>
                    </a>
                  )}
                  {rules?.confirmationNote && <p className="mt-4 text-center text-[12px] leading-relaxed text-white/45">{rules.confirmationNote}</p>}
                </div>
              </aside>
            </div>

            {/* telefon i tablet: ukupno i „Nastavite" uvek pri dnu ekrana (pregled je ispod stavki) */}
            {canOrder && (
              <>
                <div aria-hidden className="h-20 lg:hidden" />
                {/* -bottom-px + 1px više dole: bez procepa ispod trake kada visina ekrana nije ceo piksel; neprovidna, sa mestom za iPhone ivicu */}
                <div className="fixed inset-x-0 -bottom-px z-30 border-t border-line bg-paper px-4 pb-[calc(0.75rem+1px+env(safe-area-inset-bottom))] pt-3 shadow-[0_-12px_30px_-18px_rgba(42,41,38,0.35)] lg:hidden">
                  <div className="mx-auto flex max-w-[720px] items-center gap-4">
                    <div className="min-w-0">
                      <p className="text-[12px] text-mist">Ukupno, {count} kom</p>
                      <p className="text-[20px] font-medium leading-tight tabular-nums">{formatRsd(quote.subtotal)}</p>
                    </div>
                    <Link href="/porudzbina" className="ml-auto flex h-12 items-center gap-2 rounded-full bg-[#e02a33] px-6 text-[15px] font-medium text-white">
                      Nastavite <ArrowRight className="h-3 w-3.5" />
                    </Link>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
    </>
  );
}

const GRUPE = [
  { name: "Rezervni delovi", href: "/rezervni-delovi" },
  { name: "Traktori", href: "/traktori" },
  { name: "Priključne mašine", href: "/prikljucne-masine" },
  { name: "Akcije", href: "/akcije" },
];

function Prazna() {
  const { contact } = useSite();
  const help = contact.phoneParts || contact.phone;
  return (
    <section className={`${KARTICA} overflow-hidden`}>
      <div className="flex flex-col items-center px-6 py-14 text-center md:py-20">
        <span className="grid size-24 place-items-center rounded-full bg-canvas">
          <ShoppingBag className="size-10 text-[#e02a33]" strokeWidth={1.4} aria-hidden />
        </span>
        <h2 className="mt-6 text-[28px] font-medium leading-tight tracking-[-0.02em] md:text-[34px]">Još niste dodali artikle</h2>
        <p className="mt-3 max-w-[460px] text-balance text-[15px] leading-[24px] text-mist">
          Pronađite deo po nazivu, šifri ili brendu traktora u online prodavnici, ili nas pozovite za pomoć pri izboru.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/rezervni-delovi" className="inline-flex h-[50px] items-center gap-2 rounded-full bg-[#e02a33] px-7 text-[15px] font-medium text-white transition hover:bg-[#c41f27]">
            Idite u prodavnicu <ArrowRight className="h-3 w-3.5" />
          </Link>
          {help && (
            <a href={tel(help)} className="inline-flex h-[50px] items-center rounded-full border border-line bg-paper px-7 text-[15px] transition hover:border-ink">
              Pozovite {help}
            </a>
          )}
        </div>
      </div>
      <nav aria-label="Ponuda" className="border-t border-line bg-canvas/60 px-6 py-6">
        <ul className="flex flex-wrap justify-center gap-2">
          {GRUPE.map((g) => (
            <li key={g.href}>
              <Link href={g.href} className="inline-flex h-10 items-center rounded-full border border-line bg-paper px-4 text-[14px] transition hover:border-ink">
                {g.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}

function Kostur() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="h-[360px] rounded-[12px] bg-paper" />
        <div className="h-[420px] rounded-[12px] bg-[#18191b]/90" />
      </div>
    </div>
  );
}
