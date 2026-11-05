"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Building2, Check, CircleAlert, Copy, Landmark, LoaderCircle, Store, Truck, User, Wallet } from "lucide-react";
import { ArrowRight } from "../graphics";
import CheckoutHero from "./CheckoutHero";
import { formatRsd, prettyName } from "@/data/featured-parts";
import { API_URL, postJson } from "@/lib/api";
import { clearCart, useCart } from "@/lib/cart";
import { amount, PAYMENT_LABEL, shippingText, useQuote, type Delivery, type Payment, type QuoteItem } from "@/lib/checkout";
import { cityName, tel, useSite } from "@/lib/site-context";
import { trackBeginCheckout, trackPurchase, type TrackItem } from "@/lib/track";

/*
  Porudžbina, 2. korak (po uzoru na HTZ SHOP /porudzbina): 01 kupac (fizičko lice ili firma), 02 isporuka
  (dostava na adresu ili lično preuzimanje u Svilajncu), 03 plaćanje (pouzećem / pri preuzimanju, uplata na račun),
  napomena i saglasnost. Desno pregled sa stavkama i iznosom. Promena isporuke ponovo obračunava korpu (cena dostave).
  Posle uspešnog POST /shop/orders korpa se prazni, a ista komponenta crta potvrdu (3. korak).
*/

const KARTICA = "rounded-[12px] bg-paper ring-1 ring-line";
const POLJE =
  "h-12 w-full rounded-[10px] border bg-canvas px-4 text-[15px] text-ink outline-none transition placeholder:text-mist/70 hover:border-mist/40 focus:border-ink focus:bg-paper focus:shadow-[0_0_0_4px_rgba(224,42,51,0.15)]";
const LABELA = "mb-1.5 block text-[13px] font-medium";
const GRESKA = "border-[#e02a33] bg-[#fdecea]";
// lično preuzimanje: prodavnica u Svilajncu (backend: LOCATIONS)
const PICKUP = "svilajnac";

type Kupac = "fizicko" | "pravno";
type Polja = { name: string; phone: string; email: string; company: string; pib: string; mb: string; address: string; zip: string; city: string; notes: string; website: string };
type Porudzbina = {
  orderNumber: string;
  totalAmount: number;
  shippingCost: number;
  delivery: Delivery;
  payment: Payment;
  email: string;
  address: string;
  items: { id: string; name: string; quantity: number; unitPrice: number; totalPrice: number }[];
  subtotal: number;
};

function Polje({ label, greska, className = "", ...rest }: { label: string; greska?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`block ${className}`}>
      <span className={LABELA}>{label}</span>
      <input aria-invalid={greska || undefined} className={`${POLJE} ${greska ? GRESKA : "border-line"}`} {...rest} />
    </label>
  );
}

function Sekcija({ broj, naslov, opis, children }: { broj: string; naslov: string; opis?: string; children: React.ReactNode }) {
  return (
    <section className={`${KARTICA} p-5 md:p-8`}>
      <div className="flex items-baseline gap-3">
        <span className="grid size-8 shrink-0 place-items-center self-center rounded-full bg-[#e02a33] text-[12px] font-medium tabular-nums text-white">{broj}</span>
        <h2 className="text-[20px] font-medium leading-tight md:text-[22px]">{naslov}</h2>
      </div>
      {opis && <p className="mt-1 pl-11 text-[14px] text-mist">{opis}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

/** Kartica-izbor (radio): ceo okvir je klikabilan, izabrana je tamna sa crvenom ikonom */
function Izbor<T extends string>({ name, value, izabrano, onIzbor, Icon, naslov, opis, desno }: { name: string; value: T; izabrano: T; onIzbor: (v: T) => void; Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; naslov: string; opis: string; desno?: React.ReactNode }) {
  const on = izabrano === value;
  return (
    <label className={`group flex cursor-pointer items-center gap-4 rounded-[12px] border p-4 transition has-[:focus-visible]:shadow-[0_0_0_4px_rgba(224,42,51,0.25)] ${on ? "border-[#18191b] bg-[#18191b] text-white" : "border-line bg-paper hover:border-mist/50"}`}>
      <input type="radio" name={name} value={value} checked={on} onChange={() => onIzbor(value)} className="sr-only" />
      <span className={`grid size-11 shrink-0 place-items-center rounded-full transition ${on ? "bg-[#e02a33] text-white" : "bg-canvas text-ink group-hover:bg-[#e02a33]/10"}`}>
        <Icon className="size-5" strokeWidth={1.7} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[15px] font-medium leading-tight">{naslov}</span>
        <span className={`mt-1 block text-[13px] leading-[18px] ${on ? "text-white/65" : "text-mist"}`}>{opis}</span>
      </span>
      {desno && <span className={`shrink-0 text-right text-[14px] font-medium tabular-nums ${on ? "text-white" : ""}`}>{desno}</span>}
    </label>
  );
}

export default function Checkout() {
  const { lines, count } = useCart();
  const { contact, workingHours } = useSite();
  const help = contact.phoneParts || contact.phone;
  const [delivery, setDelivery] = useState<Delivery>("adresa");
  const [payment, setPayment] = useState<Payment>("pouzece");
  const { quote, items, error: quoteError, loading } = useQuote(lines, delivery);
  const [kupac, setKupac] = useState<Kupac>("fizicko");
  const [f, setF] = useState<Polja>({ name: "", phone: "", email: "", company: "", pib: "", mb: "", address: "", zip: "", city: "", notes: "", website: "" });
  const [uslovi, setUslovi] = useState(false);
  const [greske, setGreske] = useState<Set<string>>(new Set());
  const [greska, setGreska] = useState("");
  const [salje, setSalje] = useState(false);
  const [gotovo, setGotovo] = useState<Porudzbina | null>(null);
  const forma = useRef<HTMLFormElement>(null);
  const set = (k: keyof Polja) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((x) => ({ ...x, [k]: e.target.value }));

  const rules = quote?.rules;
  const adresa = delivery === "adresa";
  const unavailable = items.filter((i) => !i.available);
  const belowMin = !!rules && rules.minOrderAmount > 0 && (quote?.subtotal ?? 0) < rules.minOrderAmount;
  const dostava = shippingText(quote, delivery);
  const trackItems: TrackItem[] = items.filter((i) => i.available && i.product).map((i) => ({ id: i.productId, name: i.product!.name, price: i.unitPrice, quantity: i.quantity, brand: i.product!.brand }));

  // plaćanje mora da odgovara isporuci: pouzeće samo uz dostavu, „pri preuzimanju" samo uz preuzimanje,
  // uplata na račun samo kad je uključena u adminu (izvodi se pri crtanju, izbor kupca ostaje zapamćen)
  const gotovinom: Payment = adresa ? "pouzece" : "pri_preuzimanju";
  const pay: Payment = payment === "uplata_na_racun" ? (rules && !rules.allowBankTransfer ? gotovinom : payment) : gotovinom;

  // početak naplate: jednom, kad stignu cene
  const tracked = useRef(false);
  useEffect(() => {
    if (tracked.current || !quote || !trackItems.length) return;
    tracked.current = true;
    trackBeginCheckout(trackItems, quote.total);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quote]);

  // posle neuspeha prvo označeno polje u fokus
  useEffect(() => {
    if (greske.size) forma.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [greske]);

  function proveri(): Set<string> {
    const g = new Set<string>();
    if (f.name.trim().length < 2) g.add("name");
    if (f.phone.replace(/\D/g, "").length < 6) g.add("phone");
    if (f.email.trim() && !/^\S+@\S+\.\S+$/.test(f.email.trim())) g.add("email");
    if (kupac === "pravno") {
      if (!f.company.trim()) g.add("company");
      if (!/^\d{9}$/.test(f.pib.trim())) g.add("pib");
    }
    if (adresa) {
      if (f.address.trim().length < 3) g.add("address");
      if (!f.city.trim()) g.add("city");
      if (!/^\d{5}$/.test(f.zip.trim())) g.add("zip");
    }
    if (!uslovi) g.add("uslovi");
    return g;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (salje || !quote) return;
    const g = proveri();
    setGreske(g);
    if (g.size) {
      setGreska(g.has("uslovi") && g.size === 1 ? "Potvrdite da prihvatate uslove kupovine." : "Proverite označena polja.");
      return;
    }
    setGreska("");
    setSalje(true);
    try {
      const res = await postJson<{ orderNumber: string; totalAmount: number; shippingCost: number }>("/shop/orders", {
        items: lines.map((l) => ({ productId: l.id, quantity: l.qty })),
        customerType: kupac,
        customerName: f.name.trim(),
        customerPhone: f.phone.trim(),
        customerEmail: f.email.trim() || undefined,
        companyName: kupac === "pravno" ? f.company.trim() : undefined,
        pib: kupac === "pravno" ? f.pib.trim() : undefined,
        mb: kupac === "pravno" && f.mb.trim() ? f.mb.trim() : undefined,
        deliveryType: delivery,
        pickupLocation: adresa ? undefined : PICKUP,
        shippingAddress: adresa ? f.address.trim() : undefined,
        shippingCity: adresa ? f.city.trim() : undefined,
        shippingZipCode: adresa ? f.zip.trim() : undefined,
        paymentMethod: pay,
        notes: f.notes.trim() || undefined,
        website: f.website || undefined,
      });
      trackPurchase(res.orderNumber, trackItems, Number(res.totalAmount), Number(res.shippingCost));
      setGotovo({
        orderNumber: res.orderNumber,
        totalAmount: Number(res.totalAmount),
        shippingCost: Number(res.shippingCost),
        delivery,
        payment: pay,
        email: f.email.trim(),
        address: adresa ? `${f.address.trim()}, ${f.zip.trim()} ${f.city.trim()}` : [contact.street, contact.city].filter(Boolean).join(", "),
        items: items.map((i) => ({ id: i.productId, name: i.product ? prettyName(i.product.name) : "Artikal", quantity: i.quantity, unitPrice: i.unitPrice, totalPrice: i.totalPrice })),
        subtotal: quote.subtotal,
      });
      clearCart();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setGreska(err instanceof Error ? err.message : "Porudžbina nije poslata. Pokušajte ponovo.");
    } finally {
      setSalje(false);
    }
  }

  return (
    <>
    <CheckoutHero
      step={gotovo ? 2 : 1}
      title={gotovo ? (gotovo.payment === "uplata_na_racun" ? "Još samo uplata" : "Hvala na porudžbini") : "Podaci i isporuka"}
      meta={gotovo ? `Porudžbina ${gotovo.orderNumber}` : count ? `${count} kom` : undefined}
      sub={gotovo ? undefined : "Poručujete bez naloga. Potvrdu šaljemo na e-mail, a pre slanja vas zovemo telefonom."}
    />
    <div className="bg-canvas">
      <div className="mx-auto w-full max-w-[1600px] px-4 pb-14 pt-8 md:px-9 md:pb-24 md:pt-12">
        {gotovo ? (
          <Potvrda p={gotovo} />
        ) : lines.length === 0 ? (
          <>
            <div className={`${KARTICA} px-6 py-14 text-center`}>
              <h2 className="text-[28px] font-medium tracking-[-0.02em]">Korpa je prazna</h2>
              <p className="mt-2 text-[15px] text-mist">Dodajte artikle u korpu, pa se vratite na porudžbinu.</p>
              <Link href="/rezervni-delovi" className="mt-7 inline-flex h-[50px] items-center gap-2 rounded-full bg-[#e02a33] px-7 text-[15px] font-medium text-white">
                Idite u prodavnicu <ArrowRight className="h-3 w-3.5" />
              </Link>
            </div>
          </>
        ) : quoteError && !quote ? (
          <>
            <div className={`${KARTICA} p-8 text-center`}>
              <p className="text-[16px]">{quoteError}</p>
              <a href={tel(help)} className="mt-6 inline-flex h-12 items-center rounded-full bg-ink px-7 text-[15px] text-white">
                Pozovite {help}
              </a>
            </div>
          </>
        ) : !quote ? (
          <>
            <div aria-hidden className="h-[560px] animate-pulse rounded-[12px] bg-paper" />
          </>
        ) : (
          <>
            <form ref={forma} onSubmit={onSubmit} noValidate className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-8">
              <div className="space-y-5">
                <Sekcija broj="01" naslov="Vaši podaci" opis="Na e-mail šaljemo potvrdu, a telefonom vas zovemo ako nešto treba proveriti.">
                  <div role="radiogroup" aria-label="Kupujete kao" className="inline-flex rounded-full bg-canvas p-1 ring-1 ring-line">
                    {(
                      [
                        ["fizicko", "Fizičko lice", User],
                        ["pravno", "Firma", Building2],
                      ] as const
                    ).map(([v, naziv, Icon]) => (
                      <button key={v} type="button" role="radio" aria-checked={kupac === v} onClick={() => setKupac(v)} className={`flex h-10 items-center gap-2 rounded-full px-5 text-[14px] font-medium transition ${kupac === v ? "bg-ink text-white" : "text-mist hover:text-ink"}`}>
                        <Icon className="size-4" strokeWidth={1.8} aria-hidden />
                        {naziv}
                      </button>
                    ))}
                  </div>

                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Polje label="Ime i prezime" value={f.name} onChange={set("name")} autoComplete="name" greska={greske.has("name")} className="sm:col-span-2" />
                    <Polje label="Telefon" type="tel" inputMode="tel" autoComplete="tel" placeholder="06x xxx xxxx" value={f.phone} onChange={set("phone")} greska={greske.has("phone")} />
                    <Polje label="E-mail (za potvrdu)" type="email" inputMode="email" autoComplete="email" value={f.email} onChange={set("email")} greska={greske.has("email")} />
                    {kupac === "pravno" && (
                      <>
                        <Polje label="Naziv firme" autoComplete="organization" value={f.company} onChange={set("company")} greska={greske.has("company")} className="sm:col-span-2" />
                        <Polje label="PIB" inputMode="numeric" maxLength={9} placeholder="9 cifara" value={f.pib} onChange={set("pib")} greska={greske.has("pib")} />
                        <Polje label="Matični broj (nije obavezno)" inputMode="numeric" maxLength={8} value={f.mb} onChange={set("mb")} />
                      </>
                    )}
                  </div>
                </Sekcija>

                <Sekcija broj="02" naslov="Isporuka">
                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <Izbor<Delivery> name="delivery" value="adresa" izabrano={delivery} onIzbor={setDelivery} Icon={Truck} naslov="Dostava na adresu" opis="Kurirskom službom, širom Srbije" />
                    {(rules?.allowPickup ?? true) && (
                      <Izbor<Delivery> name="delivery" value="preuzimanje" izabrano={delivery} onIzbor={setDelivery} Icon={Store} naslov="Lično preuzimanje" opis={[contact.street, cityName(contact.city)].filter(Boolean).join(", ")} desno="Besplatno" />
                    )}
                  </div>

                  {adresa ? (
                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-[140px_1fr]">
                      <Polje label="Ulica i broj" autoComplete="street-address" placeholder="npr. Kneza Miloša 81" value={f.address} onChange={set("address")} greska={greske.has("address")} className="sm:col-span-2" />
                      <Polje label="Poštanski broj" inputMode="numeric" maxLength={5} autoComplete="postal-code" value={f.zip} onChange={set("zip")} greska={greske.has("zip")} />
                      <Polje label="Mesto" autoComplete="address-level2" value={f.city} onChange={set("city")} greska={greske.has("city")} />
                    </div>
                  ) : (
                    <div className="mt-5 grid grid-cols-1 gap-5 rounded-[6px] bg-canvas p-5 sm:grid-cols-2">
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-mist">Preuzimanje u prodavnici</p>
                        <p className="mt-2 text-[17px] font-medium">{contact.name || `Jugometal ${cityName(contact.city)}`}</p>
                        <p className="text-[15px] text-mist">{[contact.street, contact.city].filter(Boolean).join(", ")}</p>
                        <p className="mt-3 text-[14px] leading-[21px] text-mist">Javljamo vam telefonom kad je porudžbina spremna. Ponesite broj porudžbine.</p>
                      </div>
                      {workingHours.length > 0 && (
                        <dl className="space-y-2 text-[14px]">
                          {workingHours.map((h) => (
                            <div key={h.days} className="flex justify-between gap-4 border-b border-line pb-2 last:border-0">
                              <dt className="text-mist">{h.days}</dt>
                              <dd className={`tabular-nums ${h.isOpen ? "font-medium" : "text-mist"}`}>{h.hours}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                    </div>
                  )}
                </Sekcija>

                <Sekcija broj="03" naslov="Plaćanje">
                  <div className="grid grid-cols-1 gap-2.5">
                    {adresa ? (
                      <Izbor<Payment> name="payment" value="pouzece" izabrano={pay} onIzbor={setPayment} Icon={Wallet} naslov="Pouzećem" opis="Plaćate kuriru gotovinom kad paket stigne." />
                    ) : (
                      <Izbor<Payment> name="payment" value="pri_preuzimanju" izabrano={pay} onIzbor={setPayment} Icon={Wallet} naslov="Pri preuzimanju" opis="Plaćate u prodavnici kad preuzimate porudžbinu." />
                    )}
                    {(rules?.allowBankTransfer ?? true) && (
                      <Izbor<Payment> name="payment" value="uplata_na_racun" izabrano={pay} onIzbor={setPayment} Icon={Landmark} naslov="Uplata na račun" opis="Podatke za uplatu dobijate posle porudžbine. Pogodno za firme." />
                    )}
                  </div>

                  <label className="mt-6 block">
                    <span className={LABELA}>
                      Napomena <span className="font-normal text-mist">(nije obavezno)</span>
                    </span>
                    <textarea value={f.notes} onChange={set("notes")} rows={3} maxLength={2000} placeholder="Npr. model traktora, vreme kad ste dostupni za poziv…" className={`${POLJE} h-auto resize-y border-line py-3 leading-[22px]`} />
                  </label>
                  {/* zamka za botove - pravi kupac ovo polje ne vidi */}
                  <input tabIndex={-1} autoComplete="off" aria-hidden value={f.website} onChange={set("website")} className="absolute -left-[9999px] h-0 w-0 opacity-0" />
                </Sekcija>
              </div>

              {/* pregled */}
              <aside aria-label="Pregled porudžbine" className="overflow-hidden rounded-[12px] bg-[#18191b] text-white lg:sticky lg:top-28">
                <div className="p-5 md:p-7">
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="text-[22px] font-medium tracking-[-0.01em]">Vaša porudžbina</h2>
                    <Link href="/korpa" className="text-[13px] font-medium text-white/55 underline-offset-2 hover:text-white hover:underline">
                      Izmeni korpu
                    </Link>
                  </div>

                  {/* skrol samo za dužu porudžbinu (više od 4 stavke); pt-2 i pr-2: bedž količine viri iznad i desno od slike */}
                  <ul className={`mt-3 space-y-3 pt-2 ${items.length > 4 ? "max-h-[300px] overflow-y-auto pr-2" : ""}`}>
                    {items.map((s) => (
                      <MiniStavka key={s.productId} s={s} />
                    ))}
                  </ul>

                  <dl aria-busy={loading} className={`mt-5 space-y-2.5 border-t border-white/10 pt-5 text-[15px] transition-opacity ${loading ? "opacity-50" : ""}`}>
                    <div className="flex justify-between gap-4">
                      <dt className="text-white/55">Artikli ({count} kom)</dt>
                      <dd className="font-medium tabular-nums">{formatRsd(quote.subtotal)}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-white/55">{adresa ? "Dostava" : "Lično preuzimanje"}</dt>
                      <dd className={`font-medium tabular-nums ${dostava.free ? "text-[#86efac]" : dostava.text === "po dogovoru" ? "text-white/55" : ""}`}>{dostava.text}</dd>
                    </div>
                  </dl>

                  <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/10 pt-5">
                    <span className="text-[15px] font-medium">Ukupno</span>
                    <span className="flex items-center gap-2 text-[36px] font-medium leading-none tracking-[-0.03em] tabular-nums">
                      {loading && <LoaderCircle className="size-5 animate-spin text-white/55" aria-hidden />}
                      {amount(quote.total)}
                      <span className="text-[15px] tracking-normal text-white/55">RSD</span>
                    </span>
                  </div>
                  <p className="mt-1.5 text-right text-[12px] text-white/45">Cene sa PDV-om{adresa && dostava.text === "po dogovoru" ? ", dostava se potvrđuje telefonom" : ""}</p>

                  <label className={`mt-6 flex cursor-pointer items-start gap-3 rounded-[10px] p-2 text-[13px] leading-[19px] ${greske.has("uslovi") ? "bg-[#e02a33]/15 ring-1 ring-[#e02a33]" : ""}`}>
                    <input type="checkbox" checked={uslovi} onChange={(e) => setUslovi(e.target.checked)} aria-invalid={greske.has("uslovi") || undefined} className="mt-0.5 size-[18px] shrink-0 accent-[#e02a33]" />
                    <span className="text-white/60">
                      Pročitao/la sam i prihvatam{" "}
                      <Link href="/uslovi-koriscenja" target="_blank" className="text-white underline underline-offset-2">
                        uslove korišćenja
                      </Link>{" "}
                      i{" "}
                      <Link href="/politika-privatnosti" target="_blank" className="text-white underline underline-offset-2">
                        politiku privatnosti
                      </Link>
                      .
                    </span>
                  </label>

                  {(greska || belowMin || unavailable.length > 0) && (
                    <p role="alert" className="mt-4 flex items-start gap-2 rounded-[10px] bg-[#fdecea] px-3.5 py-3 text-[14px] leading-[20px] text-[#b91c1c]">
                      <CircleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={2} aria-hidden />
                      {greska || (belowMin ? `Najmanji iznos porudžbine je ${formatRsd(rules!.minOrderAmount)}.` : "Neki artikli nisu dostupni. Uklonite ih u korpi.")}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={salje || loading || belowMin || unavailable.length > 0}
                    className="group mt-5 flex h-14 w-full items-center justify-between rounded-full bg-[#e02a33] pl-6 pr-2 text-[15px] font-medium text-white transition hover:bg-[#c41f27] disabled:bg-white/10 disabled:text-white/45"
                  >
                    {salje ? (
                      <>
                        Šaljemo porudžbinu…
                        <LoaderCircle className="mr-2 size-5 animate-spin" aria-hidden />
                      </>
                    ) : (
                      <>
                        Potvrdite porudžbinu
                        <span className="grid size-10 place-items-center rounded-full bg-white text-[#e02a33]">
                          <ArrowRight className="h-3 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </span>
                      </>
                    )}
                  </button>
                  <p className="mt-4 text-center text-[12px] leading-relaxed text-white/45">{rules?.confirmationNote || "Pre slanja vas zovemo da potvrdimo dostupnost, cenu dostave i način plaćanja."}</p>
                </div>
              </aside>
            </form>
          </>
        )}
      </div>
    </div>
    </>
  );
}

function MiniStavka({ s }: { s: QuoteItem }) {
  const p = s.product;
  return (
    <li className="flex items-center gap-3">
      <span className="relative grid size-14 shrink-0 place-items-center rounded-[10px] bg-white">
        {p?.image && (
          // eslint-disable-next-line @next/next/no-img-element -- slika sa backenda
          <img src={p.image} alt="" className="size-full object-contain p-1" />
        )}
        <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-[#e02a33] px-1 text-[11px] font-medium leading-none text-white ring-2 ring-[#18191b]">{s.quantity}</span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 text-[14px] font-medium leading-snug">{p ? prettyName(p.name) : "Artikal"}</span>
        {!s.available && <span className="block text-[12px] text-[#ff8a8f]">{s.reason ?? "Nije dostupno"}</span>}
      </span>
      <span className="shrink-0 text-[14px] font-medium tabular-nums">{s.available ? formatRsd(s.totalPrice) : "-"}</span>
    </li>
  );
}

/** Dugme „Kopiraj" za podatke uplatnice */
function Kopiraj({ tekst, label }: { tekst: string; label: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      aria-label={`Kopiraj: ${label}`}
      onClick={() => {
        navigator.clipboard?.writeText(tekst).then(() => {
          setOk(true);
          setTimeout(() => setOk(false), 1500);
        });
      }}
      className="grid size-9 shrink-0 place-items-center rounded-full border border-white/20 text-white/70 transition hover:border-white hover:text-white"
    >
      {ok ? <Check className="size-4" strokeWidth={2} aria-hidden /> : <Copy className="size-4" strokeWidth={1.8} aria-hidden />}
    </button>
  );
}

/** 3. korak: potvrda iz odgovora servera i stavki iz korpe (gost kasnije ne može da je otvori - zato je sve bitno ovde i u mejlu) */
function Potvrda({ p }: { p: Porudzbina }) {
  const { contact } = useSite();
  const help = contact.phoneParts || contact.phone;
  const unapred = p.payment === "uplata_na_racun";
  // broj računa iz Podešavanja → Opšte (GET /shop/settings); bez njega podaci za uplatu stižu mejlom
  const [racun, setRacun] = useState<{ name: string; account: string } | null>(null);
  useEffect(() => {
    if (!unapred) return;
    fetch(`${API_URL}/shop/settings`)
      .then((r) => r.json())
      .then((j: { data?: { company?: { name?: string; bankAccount?: string } } }) => {
        const c = j.data?.company;
        if (c?.bankAccount) setRacun({ name: c.name ?? contact.name, account: c.bankAccount });
      })
      .catch(() => undefined);
  }, [unapred, contact.name]);

  const uplata = racun
    ? [
        { label: "Primalac", vrednost: racun.name },
        { label: "Račun primaoca", vrednost: racun.account },
        { label: "Iznos", vrednost: formatRsd(p.totalAmount), kopija: String(p.totalAmount) },
        { label: "Poziv na broj", vrednost: p.orderNumber },
        { label: "Svrha uplate", vrednost: `Porudžbina ${p.orderNumber}` },
      ]
    : [];

  return (
    <>
      <div className="mx-auto max-w-[880px]">
        <section className="overflow-hidden rounded-[12px] bg-paper ring-1 ring-line">
          <div className="p-6 md:p-10">
            <span className="grid size-16 place-items-center rounded-full bg-[#e02a33] text-white">
              <svg viewBox="0 0 24 24" className="size-8" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="m5 12.5 4.5 4.5L19 7.5" />
              </svg>
            </span>
            <p className="mt-6 text-[13px] font-medium uppercase tracking-[0.16em] text-mist">Porudžbina {p.orderNumber}</p>
            <h2 className="mt-2 text-[30px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[38px]">
              {unapred ? "Porudžbina je primljena. Još samo uplata." : "Hvala, porudžbina je primljena."}
            </h2>
            <p className="mt-4 max-w-[600px] text-[16px] leading-[26px] text-mist">
              {p.email && (
                <>
                  Potvrdu smo poslali na <b className="font-medium text-ink">{p.email}</b>.{" "}
                </>
              )}
              {unapred
                ? "Artikle šaljemo čim uplata stigne. Pre slanja vas zovemo da potvrdimo dostupnost."
                : p.delivery === "preuzimanje"
                  ? "Javljamo vam telefonom kad porudžbina bude spremna za preuzimanje u prodavnici."
                  : "Pre slanja vas zovemo da potvrdimo dostupnost i cenu dostave. Kuriru plaćate gotovinom kad paket stigne."}
            </p>

            {/* uplata na račun: podaci uplatnice sa „Kopiraj" */}
            {unapred && racun && (
              <div className="mt-8 overflow-hidden rounded-[6px] bg-ink text-white">
                <div className="p-5 md:p-7">
                  <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-[#ff6b72]">Podaci za uplatu</p>
                  <p className="mt-1 text-[34px] font-medium leading-tight tracking-[-0.02em] tabular-nums">{formatRsd(p.totalAmount)}</p>
                </div>
                <dl className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2">
                  {uplata.map((u) => (
                    <div key={u.label} className="flex items-center justify-between gap-3 bg-ink px-5 py-3.5 md:px-7">
                      <div className="min-w-0">
                        <dt className="text-[11px] uppercase tracking-[0.14em] text-white/50">{u.label}</dt>
                        <dd className="mt-0.5 break-words text-[15px] font-medium tabular-nums">{u.vrednost}</dd>
                      </div>
                      <Kopiraj tekst={u.kopija ?? u.vrednost} label={u.label} />
                    </div>
                  ))}
                </dl>
              </div>
            )}
            {unapred && !racun && (
              <p className="mt-8 rounded-[6px] bg-canvas p-5 text-[15px] leading-[24px]">
                Podatke za uplatu šaljemo na e-mail ili vam ih javljamo telefonom. Poziv na broj je <b className="font-medium">{p.orderNumber}</b>, iznos <b className="font-medium">{formatRsd(p.totalAmount)}</b>.
                {help && (
                  <>
                    {" "}Za pomoć pozovite{" "}
                    <a href={tel(help)} className="font-medium underline underline-offset-2">
                      {help}
                    </a>
                    .
                  </>
                )}
              </p>
            )}

            {/* ukratko */}
            <dl className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-[6px] bg-line sm:grid-cols-3">
              <div className="bg-canvas p-4">
                <dt className="text-[12px] text-mist">Iznos</dt>
                <dd className="mt-1 text-[22px] font-medium tabular-nums">{formatRsd(p.totalAmount)}</dd>
              </div>
              <div className="bg-canvas p-4">
                <dt className="text-[12px] text-mist">Plaćanje</dt>
                <dd className="mt-1 flex items-center gap-2 text-[15px] font-medium">
                  {unapred ? <Landmark className="size-4" strokeWidth={1.8} aria-hidden /> : <Wallet className="size-4" strokeWidth={1.8} aria-hidden />}
                  {PAYMENT_LABEL[p.payment]}
                </dd>
              </div>
              <div className="bg-canvas p-4">
                <dt className="text-[12px] text-mist">{p.delivery === "preuzimanje" ? "Preuzimanje" : "Dostava"}</dt>
                <dd className="mt-1 flex items-start gap-2 text-[15px] font-medium">
                  {p.delivery === "preuzimanje" ? <Store className="mt-0.5 size-4 shrink-0" strokeWidth={1.8} aria-hidden /> : <Truck className="mt-0.5 size-4 shrink-0" strokeWidth={1.8} aria-hidden />}
                  <span>{p.address}</span>
                </dd>
              </div>
            </dl>

            <ul className="mt-6 divide-y divide-line border-y border-line">
              {p.items.map((s) => (
                <li key={s.id} className="flex items-baseline justify-between gap-4 py-3 text-[14px]">
                  <span className="min-w-0">
                    <span className="block font-medium">{s.name}</span>
                    <span className="text-mist">
                      {s.quantity} × {formatRsd(s.unitPrice)}
                    </span>
                  </span>
                  <span className="shrink-0 font-medium tabular-nums">{formatRsd(s.totalPrice)}</span>
                </li>
              ))}
            </ul>
            <dl className="ml-auto mt-4 max-w-[320px] space-y-1.5 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-mist">{p.delivery === "preuzimanje" ? "Preuzimanje" : "Dostava"}</dt>
                <dd className="font-medium">{p.shippingCost > 0 ? formatRsd(p.shippingCost) : p.delivery === "preuzimanje" ? "Besplatno" : "po dogovoru"}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2 text-[16px]">
                <dt className="font-medium">Ukupno</dt>
                <dd className="font-medium tabular-nums">{formatRsd(p.totalAmount)}</dd>
              </div>
            </dl>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/rezervni-delovi" className="inline-flex h-[50px] items-center gap-2 rounded-full bg-[#e02a33] px-7 text-[15px] font-medium text-white transition hover:bg-[#c41f27]">
                Nastavite kupovinu <ArrowRight className="h-3 w-3.5" />
              </Link>
              {help && (
                <a href={tel(help)} className="inline-flex h-[50px] items-center rounded-full border border-line bg-paper px-7 text-[15px] transition hover:border-ink">
                  Pitanje o porudžbini? {help}
                </a>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
