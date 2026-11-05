"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, Copy, Layers, Package, Phone, Truck } from "lucide-react";
import { ArrowRight, Bag } from "./graphics";
import { Crumbs, EYEBROW, PerkList, ProductGallery, Similar, type Perk } from "./ProductDetail";
import { PartCard, STOCK } from "./ShopCatalog";
import { formatRsd, prettyName, type PartsData } from "@/data/featured-parts";
import { addToCart } from "@/lib/cart";
import { trackAddToCart, trackViewItem } from "@/lib/track";
import { tel, useSite } from "@/lib/site-context";

/*
  Strana rezervnog dela, u jeziku strana traktora i prodavnice:
  - levo galerija (sve slike dela), desno logo proizvođača, naziv, šifra sa kopiranjem i stanje
  - tamna kartica sa cenom (i redovnom kad je deo na akciji), količinom i crvenim „Dodaj u korpu"
  - traka sa prečicama (odeljenje delova, svi delovi brenda, grupa), pa podaci o delu i opis
  - na kraju ostali delovi istog brenda (iste kartice kao u prodavnici)
*/

export default function PartPage({ data, group, brand, part }: { data: Pick<PartsData, "searchIndex" | "partGroups">; group: string; brand: string; part: string }) {
  const { contact } = useSite();
  const partsPhone = contact.phoneParts || contact.phone;
  const { searchIndex, partGroups } = data;
  const p = searchIndex.find((x) => x.group === group && x.sub === brand && x.slug === part)!;
  const g = partGroups.find((x) => x.slug === group)!;
  const b = g.brands.find((x) => x.slug === brand)!;
  const code = p.code && !/\s/.test(p.code) ? p.code : "";
  const extra = p.code && /\s/.test(p.code) ? p.code : "";
  const desc = [p.description, extra]
    .map((x) => (x && x === x.toUpperCase() ? prettyName(x) : x))
    .filter((x) => x && x.toLowerCase() !== p.name.toLowerCase())
    .join(" · ");
  const cut = p.onSale && p.regularPrice > p.priceRsd;
  const pct = cut ? Math.round(((p.regularPrice - p.priceRsd) / p.regularPrice) * 100) : 0;
  const st = STOCK[p.stockStatus];
  const related = searchIndex
    .filter((x) => x.sub === brand && x.id !== p.id)
    .sort((a, c) => Math.abs(a.priceRsd - p.priceRsd) - Math.abs(c.priceRsd - p.priceRsd))
    .slice(0, 4);

  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  // pregled artikla (GA4, Meta, Tag Manager - samo uz pristanak na kolačiće)
  useEffect(() => {
    trackViewItem({ id: p.id, name: p.name, price: p.priceRsd, brand: p.brand, category: g.name });
  }, [p.id, p.name, p.priceRsd, p.brand, g.name]);

  const add = () => {
    addToCart(p.id, qty, p.name);
    trackAddToCart({ id: p.id, name: p.name, price: p.priceRsd, quantity: qty, brand: p.brand, category: g.name });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* pregledač ne dozvoljava kopiranje - šifra je i dalje vidljiva */
    }
  };

  const perks: Perk[] = [
    ...(partsPhone ? [{ icon: Phone, title: partsPhone, short: "Pozovite", href: tel(partsPhone) }] : []),
    { icon: Package, title: `Delovi ${b.name}`, short: "Brend", href: b.href },
    { icon: Layers, title: g.name, short: "Grupa", href: `/rezervni-delovi/${g.slug}` },
  ];

  // tehnički podaci iz admina; „Odgovara za" se prikazuje posebno, kao oznake modela
  const fit = p.specs.find((x) => /^odgovara za/i.test(x.label));
  const fitList = fit ? fit.value.split(/\s*[,;]\s*/).filter(Boolean) : [];
  const techRows = p.specs.filter((x) => x !== fit);
  const rows: [string, React.ReactNode][] = [
    ["Proizvođač", <Link key="b" href={b.href} className="transition-colors hover:text-[#e02a33]">{b.name}</Link>],
    ["Grupa", <Link key="g" href={`/rezervni-delovi/${g.slug}`} className="transition-colors hover:text-[#e02a33]">{g.name}</Link>],
    ...(code ? ([["Kataloški broj", <span key="c" className="tabular-nums">{code}</span>]] as [string, React.ReactNode][]) : []),
    ...techRows.map((x) => [x.label, x.value] as [string, React.ReactNode]),
    ...(st ? ([["Stanje", st.label]] as [string, React.ReactNode][]) : []),
    ["Cena", `${formatRsd(p.priceRsd)} po komadu`],
  ];

  return (
    <>
      {/* ── vrh: galerija i kupovina ── */}
      <section className="bg-paper">
        <div className="mx-auto w-full max-w-[1600px] px-4 pb-14 pt-8 md:px-9 md:pb-24 md:pt-10">
          <Crumbs
            items={[
              { label: "Početna", href: "/" },
              { label: "Online prodavnica", href: "/rezervni-delovi" },
              { label: g.name, href: `/rezervni-delovi/${g.slug}` },
              { label: b.name, href: b.href },
              { label: p.name },
            ]}
          />

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12 xl:gap-16">
            <div className="min-w-0">
              <ProductGallery images={p.images.length ? p.images : [p.image]} alt={p.name} badge={cut ? `−${pct}%` : undefined} tag={b.name} className="lg:aspect-[5/4]" />
            </div>

            <div className="flex min-w-0 flex-col">
              {/* proizvođač: natpis levo, logo desno */}
              <div className="flex min-h-7 items-center justify-between gap-4">
                <p className={`truncate ${EYEBROW}`}>Rezervni deo · {b.name}</p>
                {p.logo && (
                  // eslint-disable-next-line @next/next/no-img-element -- logo proizvođača
                  <img src={p.logo} alt={p.brand} className="h-6 w-auto max-w-[120px] shrink-0 object-contain object-right md:h-7" />
                )}
              </div>
              <h1 className="mt-2 text-[30px] font-medium leading-[1.05] tracking-[-0.03em] md:text-[42px]">{p.name}</h1>

              {/* šifra i stanje */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {code && (
                  <button
                    type="button"
                    onClick={copy}
                    title="Kopiraj šifru"
                    className="group inline-flex h-9 items-center gap-2 rounded-full bg-canvas pl-3.5 pr-2 text-[13px] transition-colors hover:bg-line"
                  >
                    <span className="text-mist">Šifra</span>
                    <span className="font-medium tabular-nums">{code}</span>
                    <span className="grid size-6 place-items-center rounded-full bg-paper text-mist transition-colors group-hover:text-ink">
                      {copied ? <Check className="size-3 text-emerald-600" strokeWidth={2.4} /> : <Copy className="size-3" strokeWidth={2} />}
                    </span>
                    <span className="sr-only" aria-live="polite">{copied ? "Šifra je kopirana" : ""}</span>
                  </button>
                )}
                {st && (
                  <span className="inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-full px-3.5 text-[13px] ring-1 ring-line">
                    <span className={`size-2 rounded-full ${st.dot}`} />
                    {st.label}
                  </span>
                )}
              </div>

              {/* cena i kupovina */}
              <div className="relative mt-6 overflow-hidden rounded-[12px] bg-[#18191b] p-5 text-white md:p-6">
                <span aria-hidden className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-[#e02a33]/20 blur-3xl" />
                <div className="relative flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/50">{cut ? "Akcijska cena" : "Cena"}</p>
                    <p className="mt-2 flex flex-wrap items-baseline gap-x-3">
                      <span className={`text-[36px] font-medium leading-none tracking-[-0.03em] tabular-nums md:text-[42px] ${cut ? "text-[#ff5a61]" : ""}`}>{formatRsd(p.priceRsd)}</span>
                      {cut && <span className="text-[15px] text-white/45 line-through">{formatRsd(p.regularPrice)}</span>}
                    </p>
                  </div>
                  <p className="text-[12px] text-white/55">po komadu, sa PDV-om</p>
                </div>

                <div className="relative mt-5 flex flex-wrap gap-2.5">
                  <div className="inline-flex h-12 items-center rounded-full bg-white/[0.08] ring-1 ring-white/15">
                    <button type="button" aria-label="Manje" onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-12 w-11 place-items-center text-[20px] text-white/70 transition-colors hover:text-white">
                      −
                    </button>
                    <span className="w-8 text-center text-[16px] font-medium tabular-nums" aria-live="polite">
                      {qty}
                    </span>
                    <button type="button" aria-label="Više" onClick={() => setQty(Math.min(99, qty + 1))} className="grid h-12 w-11 place-items-center text-[20px] text-white/70 transition-colors hover:text-white">
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={add}
                    className="group inline-flex h-12 flex-1 items-center justify-between gap-6 rounded-full bg-[#e02a33] pl-6 pr-1.5 text-[15px] font-medium transition-colors hover:bg-[#c41f27] sm:flex-none"
                  >
                    <span className="inline-flex items-center gap-2">
                      {added ? <Check className="size-4" strokeWidth={2.4} /> : <Bag className="h-4 w-4" />}
                      {added ? "Dodato u korpu" : "Dodaj u korpu"}
                    </span>
                    <span className="grid size-9 place-items-center rounded-full bg-white text-[#e02a33]">
                      <ArrowRight className="h-3 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </button>
                </div>

                <div className="relative mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-[12px] text-white/55">
                  <span className="inline-flex items-center gap-2">
                    <Truck className="size-4 text-white/70" strokeWidth={1.6} aria-hidden />
                    Dostupnost i dostavu potvrđujemo telefonom.
                  </span>
                  <Link href="/korpa" className="inline-flex items-center gap-1.5 font-medium text-white transition-colors hover:text-[#ff5a61]">
                    Idi u korpu <ArrowRight className="h-2.5 w-3" />
                  </Link>
                </div>
              </div>

              <div className="mt-4">
                <PerkList perks={perks} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── podaci i opis ── */}
      <section className="bg-canvas">
        <div className="mx-auto grid w-full max-w-[1600px] gap-6 px-4 py-14 md:px-9 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-8">
          <div className="overflow-hidden rounded-[12px] bg-paper ring-1 ring-line">
            <div className="border-b border-line px-5 py-5 md:px-7">
              <p className={EYEBROW}>Podaci</p>
              <h2 className="mt-2 text-[22px] font-medium leading-[1.1] tracking-[-0.02em] md:text-[26px]">
                O delu<span className="text-[#e02a33]">.</span>
              </h2>
            </div>
            <dl className="px-5 text-[14px] md:px-7">
              {rows.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-6 border-b border-line py-3.5 last:border-b-0">
                  <dt className="shrink-0 text-mist">{k}</dt>
                  <dd className="min-w-0 text-right font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex-1 rounded-[12px] bg-paper p-5 ring-1 ring-line md:p-7">
              <p className={EYEBROW}>Opis</p>
              {fitList.length > 0 && (
                <div className="mt-1 mb-4">
                  <p className="text-[12px] text-mist">Odgovara za</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {fitList.map((m) => (
                      <li key={m} className="whitespace-nowrap rounded-full bg-canvas px-3 py-1.5 text-[13px] font-medium">{m}</li>
                    ))}
                  </ul>
                </div>
              )}
              {p.descriptionHtml ? (
                <>
                  {/* opis iz admina (editor): pasusi, podebljano, podnaslov, liste */}
                  <div
                    className="mt-3 text-[15px] leading-relaxed text-ink/75 [&_p+*]:mt-3 [&_*+p]:mt-3 [&_h3]:mt-5 [&_h3]:text-[17px] [&_h3]:font-medium [&_h3]:text-ink [&_strong]:font-medium [&_strong]:text-ink [&_b]:font-medium [&_b]:text-ink [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5"
                    dangerouslySetInnerHTML={{ __html: p.descriptionHtml }}
                  />
                  {extra && <p className="mt-3 text-[15px] leading-relaxed text-ink/75">{prettyName(extra)}</p>}
                </>
              ) : (
                <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-ink/75">
                  {desc || `${p.name}${code ? `, kataloški broj ${code}` : ""}. Deo za ${b.name}, iz grupe ${g.name.toLowerCase()}.`}
                </p>
              )}
            </div>

            {/* pomoć oko izbora */}
            {partsPhone && (
              <a href={tel(partsPhone)} className="group flex items-center justify-between gap-4 rounded-[12px] bg-[#18191b] p-5 text-white md:p-6">
                <span>
                  <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-[#e02a33]">Niste sigurni da li odgovara?</span>
                  <span className="mt-1.5 block text-[15px] text-white/80">Pozovite odeljenje delova sa šifrom ili modelom traktora.</span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-2.5 rounded-full bg-white/[0.08] py-2 pl-4 pr-2 text-[16px] font-medium ring-1 ring-white/15 transition-colors group-hover:bg-white group-hover:text-ink">
                  {partsPhone}
                  <span className="grid size-8 place-items-center rounded-full bg-[#e02a33] text-white">
                    <Phone className="size-3.5" strokeWidth={2} aria-hidden />
                  </span>
                </span>
              </a>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <Similar eyebrow="Isti proizvođač" title={`Još delova za ${b.name}`} link={{ href: b.href, label: `Svi delovi (${b.count})` }}>
          {related.map((r) => (
            <li key={r.id} className="w-[72%] shrink-0 snap-start sm:w-auto">
              <PartCard p={r} />
            </li>
          ))}
        </Similar>
      )}
    </>
  );
}
