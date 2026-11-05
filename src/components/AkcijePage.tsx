import Link from "next/link";
import { Phone, Tag, Timer } from "lucide-react";
import OfferCard, { type Offer } from "./OfferCard";
import Reveal from "./Reveal";
import { Marquee } from "./catalog/CatalogKit";
import { ArrowRight } from "./graphics";
import { formatRsd, prettyName } from "@/data/featured-parts";
import type { SaleItem } from "@/lib/catalog";
import type { Promotion } from "@/lib/promotions";
import type { SiteInfo } from "@/lib/site-info";

/*
  Strana Akcije: tamni hero sa krupnim naslovom i brojkama, crvena traka koja se pomera, pa ponude.
  Ponude: artikli koje backend označi kao akciju (GET /shop/catalog): snižena cena (akcijska cena, akcija iz admina)
  ili „Oznaka na kartici" (ATV: „Akcija", „Poklon"). Cene u RSD ili EUR, kako je artikal unet.
  Kartice su iste kao ATV kartice na početnoj (AtvSection): slika na belom, vrsta, naziv, tri reda podataka, cena i dugme.
  Period važenja dolazi iz aktivnih akcija u adminu (GET /shop/promotions). Bez ponuda - poziv da se pogleda ponuda ili pozove.
*/

const PHRASES = ["Akcijske cene", "Ograničene količine", "Rezervni delovi", "Traktori", "Priključne mašine", "Jugometal Svilajnac"];

type Deal = Offer & { key: string };

const telHref = (p: string) => `tel:${p.replace(/[^\d+]/g, "")}`;
const plural = (n: number, one: string, few: string, many: string) => {
  const last = n % 10;
  const teen = n % 100 >= 11 && n % 100 <= 14;
  return `${n} ${last === 1 && !teen ? one : last >= 2 && last <= 4 && !teen ? few : many}`;
};
const shortDate = (iso: string) => new Date(iso).toLocaleDateString("sr-Latn-RS", { day: "2-digit", month: "2-digit" });
const discountText = (p: Promotion) => (p.discountType === "procenat" ? `−${p.discountValue}%` : `−${formatRsd(p.discountValue)}`);

/** „7.490 €" ili „12.500 RSD", prema valuti artikla */
const formatPrice = (n: number, currency: SaleItem["currency"]) => (currency === "EUR" ? `${n.toLocaleString("sr-RS", { maximumFractionDigits: 0 })} €` : formatRsd(n));

function toDeals(saleItems: SaleItem[]): Deal[] {
  return saleItems.map((i) => {
    const fmt = (n: number) => formatPrice(n, i.currency);
    const cut = i.percent >= 1;
    return {
      key: i.id,
      href: i.href,
      image: i.image,
      badge: cut ? `−${i.percent}%` : (i.badge ?? i.promotion?.label ?? "Akcija"),
      kind: i.kind === "atv" ? i.kindLabel : [i.kindLabel, i.brand].filter(Boolean).join(" · "),
      name: i.kind === "deo" ? prettyName(i.name) : i.name,
      rows: i.specs.length
        ? i.specs
        : [
            ...(i.code ? [{ label: "Šifra", value: i.code }] : []),
            ...(cut ? [{ label: "Uštedite", value: fmt(i.regularPrice - i.price) }, { label: "Popust", value: `${i.percent}%` }] : []),
          ],
      priceText: fmt(i.price),
      regularText: cut ? fmt(i.regularPrice) : null,
      note: i.priceNote ?? (cut ? null : (i.promotion?.name ?? null)),
    };
  });
}

export default function AkcijePage({ saleItems, promotions, contact }: { saleItems: SaleItem[]; promotions: Promotion[]; contact: SiteInfo["contact"] }) {
  const deals = toDeals(saleItems);
  const parts = contact.phoneParts || contact.phone;
  const maxPercent = Math.max(0, ...saleItems.map((i) => i.percent));
  const ends = promotions.map((p) => p.activeTo).filter((d): d is string => !!d).sort()[0] ?? null;

  const stats = [
    { value: String(deals.length), label: plural(deals.length, "ponuda", "ponude", "ponuda").replace(/^\d+ /, "") },
    maxPercent > 0
      ? { value: `−${maxPercent}%`, label: "najveći popust" }
      : saleItems.some((i) => /poklon/i.test(i.badge ?? ""))
        ? { value: "Poklon", label: "uz kupovinu" }
        : { value: "Akcija", label: "akcijske cene" },
    ends ? { value: shortDate(ends), label: "važi do" } : { value: "Ograničeno", label: "količine" },
  ];

  return (
    <>
      {/* ── hero ── */}
      <section className="relative overflow-hidden bg-[#18191b] text-white">
        {/* eslint-disable-next-line @next/next/no-img-element -- pozadinska fotografija iz public */}
        <img
          src="/banners/delovi.jpg"
          alt=""
          aria-hidden
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[65%_center] opacity-40 [mask-image:linear-gradient(to_right,transparent_12%,black_62%)]"
        />
        {/* slika preko cele širine, maskom se gasi ka levo (nema tvrde ivice); prelaz samo pojačava kontrast za tekst */}
        <div className="absolute inset-0 bg-linear-to-r from-[#18191b] from-10% via-[#18191b]/55 via-50% to-[#18191b]/0" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#18191b] to-transparent" />

        <div className="relative mx-auto max-w-[1600px] px-4 pb-14 pt-8 md:px-9 md:pb-20 md:pt-12">
          <nav aria-label="Putanja" className="text-[12px] text-white/55">
            <Link href="/" className="transition-colors hover:text-white">Početna</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Akcije</span>
          </nav>

          <p className="mt-8 text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33] md:mt-10">Jugometal · Svilajnac</p>
          <h1 className="mt-3 text-[44px] font-medium leading-[0.95] tracking-[-0.03em] md:text-[68px]">
            Akcije<span className="text-[#e02a33]">.</span>
          </h1>
          <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-white/70 md:text-[15px]">
            Akcijske cene, pokloni uz kupovinu i ograničene količine.
            <br />
            Sve što trenutno važi, na jednom mestu.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a href={deals.length ? "#ponude" : "/rezervni-delovi"} className="group inline-flex h-11 items-center gap-2 rounded-full bg-[#e02a33] pl-5 pr-4 text-[14px] font-medium text-white transition-colors hover:bg-[#c41f27]">
              {deals.length ? "Pogledaj ponude" : "Online prodavnica"}
              <ArrowRight className="h-3 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </a>
            {parts && (
              <a href={telHref(parts)} className="inline-flex h-11 items-center gap-2 rounded-full border border-white/30 px-5 text-[14px] text-white transition-colors hover:border-white hover:bg-white hover:text-ink">
                <Phone className="size-4" strokeWidth={1.8} aria-hidden />
                {parts}
              </a>
            )}
          </div>

          <dl className="mt-10 grid max-w-2xl grid-cols-3 border-y border-white/15 md:mt-12">
            {stats.map((s, i) => (
              <div key={s.label} className={`py-3.5 md:py-4 ${i > 0 ? "border-l border-white/15 pl-5 md:pl-8" : ""}`}>
                <dd className="text-[18px] font-medium leading-none tracking-[-0.02em] md:text-[24px]">{s.value}</dd>
                <dt className="mt-1.5 text-[10px] uppercase tracking-[0.16em] text-white/50 md:text-[11px]">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── crvena traka ── */}
      <Marquee phrases={PHRASES} />

      <div className="bg-canvas">
        {deals.length === 0 ? (
          <Prazno contact={contact} />
        ) : (
          <section id="ponude" className="mx-auto w-full max-w-[1600px] scroll-mt-24 px-4 py-14 md:px-9 md:py-24">
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-[12px] uppercase tracking-[0.18em] text-mist">Trenutno važi</p>
                  <h2 className="mt-2 text-[30px] font-medium leading-[1.05] md:text-[38px]">
                    Sve ponude<span className="text-[#e02a33]">.</span>
                  </h2>
                </div>
                <p className="text-[14px] text-mist">{plural(deals.length, "ponuda", "ponude", "ponuda")} · cene sa PDV-om</p>
              </div>
              {promotions.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {promotions.map((p) => (
                    <li key={p.id} className="inline-flex items-center gap-2 rounded-full border border-line bg-paper px-4 py-2 text-[13px]">
                      <Tag className="size-3.5 text-[#e02a33]" strokeWidth={2} aria-hidden />
                      <span className="font-medium">{p.label ?? p.name}</span>
                      <span className="text-mist">
                        {discountText(p)}
                        {p.activeTo ? ` · do ${shortDate(p.activeTo)}` : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 2xl:grid-cols-4">
              {deals.map((d, i) => (
                <li key={d.key} className="h-full">
                  <Reveal delay={Math.min(i, 5) * 80} className="h-full">
                    <OfferCard d={d} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── poziv na kraju ── */}
        <section className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-9 md:pb-24">
          <Reveal>
            <div className="grid overflow-hidden rounded-[6px] bg-[#18191b] text-white md:grid-cols-[1.3fr_1fr]">
              <div className="p-6 md:p-10">
                <p className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#e02a33]">Niste našli šta tražite?</p>
                <h2 className="mt-3 max-w-lg text-[24px] font-medium leading-[1.1] md:text-[32px]">Pozovite. Za veće količine i starije modele uvek ima dogovora.</h2>
              </div>
              <div className="flex flex-col justify-center gap-3 border-t border-white/10 p-6 md:border-l md:border-t-0 md:p-8">
                {parts && (
                  <a href={telHref(parts)} className="flex items-center justify-between gap-4 rounded-[4px] bg-white/[0.06] p-4 transition-colors hover:bg-white/10 md:p-5">
                    <span>
                      <span className="block text-[11px] uppercase tracking-[0.16em] text-white/50">Rezervni delovi</span>
                      <span className="mt-1 block text-[20px] font-medium md:text-[22px]">{parts}</span>
                    </span>
                    <Phone className="size-5 shrink-0 text-white/70" strokeWidth={1.6} aria-hidden />
                  </a>
                )}
                {contact.phone && contact.phone !== parts && (
                  <a href={telHref(contact.phone)} className="flex items-center justify-between gap-4 rounded-[4px] bg-white/[0.06] p-4 transition-colors hover:bg-white/10 md:p-5">
                    <span>
                      <span className="block text-[11px] uppercase tracking-[0.16em] text-white/50">Traktori i mašine</span>
                      <span className="mt-1 block text-[20px] font-medium md:text-[22px]">{contact.phone}</span>
                    </span>
                    <Phone className="size-5 shrink-0 text-white/70" strokeWidth={1.6} aria-hidden />
                  </a>
                )}
                <Link href="/kontakt#poruka" className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white/30 text-[15px] transition-colors hover:border-white hover:bg-white hover:text-ink">
                  Pošaljite upit <ArrowRight className="h-3 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </Reveal>
        </section>
      </div>
    </>
  );
}

/** Nema aktivnih ponuda: poziv da se pogleda ponuda ili pozove */
function Prazno({ contact }: { contact: SiteInfo["contact"] }) {
  const parts = contact.phoneParts || contact.phone;
  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 py-14 md:px-9 md:py-24">
      <Reveal>
        <div className="flex flex-col items-center rounded-[6px] bg-paper px-6 py-14 text-center ring-1 ring-line md:py-20">
          <span className="grid size-20 place-items-center rounded-full bg-[#e02a33]/10 text-[#e02a33]">
            <Timer className="size-9" strokeWidth={1.4} aria-hidden />
          </span>
          <h2 className="mt-6 text-[28px] font-medium leading-tight tracking-[-0.02em] md:text-[34px]">Trenutno nema aktivnih akcija.</h2>
          <p className="mt-3 max-w-md text-balance text-[15px] leading-relaxed text-mist">
            Nove akcije objavljujemo ovde i na našim mrežama. U međuvremenu pogledajte ponudu - za veće količine delova uvek može dogovor.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/rezervni-delovi" className="inline-flex h-12 items-center gap-2 rounded-full bg-[#e02a33] px-7 text-[15px] font-medium text-white transition-colors hover:bg-[#c41f27]">
              Online prodavnica <ArrowRight className="h-3 w-3.5" />
            </Link>
            <Link href="/traktori" className="inline-flex h-12 items-center rounded-full border border-line bg-paper px-7 text-[15px] transition-colors hover:border-ink">
              Traktori
            </Link>
            {parts && (
              <a href={telHref(parts)} className="inline-flex h-12 items-center rounded-full border border-line bg-paper px-7 text-[15px] transition-colors hover:border-ink">
                Pozovite {parts}
              </a>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
