import Link from "next/link";
import { ArrowRight } from "./graphics";
import BrandMark from "./BrandMark";

/* Kartica proizvoda u tri sloja (strana Akcije, Benda ATV na početnoj):
 * 1. proizvod na beloj podlozi, vrsta gore levo, bedž gore desno
 * 2. naziv, napomena i do tri ključne vrednosti razdvojene linijama
 * 3. tamna traka sa cenom (precrtana redovna kad je snižena) i „Pogledaj"; na hover postaje crvena
 * Cela kartica je link (link naslova se širi preko kartice). */

export type Offer = {
  href: string;
  image: string | null;
  name: string;
  /** vrsta i brend gore levo („ATV · Benda", „Mulčari · Agromehanika") */
  kind: string;
  /** logo brenda gore levo umesto natpisa vrste (kartice traktora) */
  logo?: string | null;
  /** crvena etiketa gore desno („−15%", „Poklon"); bez nje kartica nije akcijska */
  badge?: string | null;
  note?: string | null;
  rows: { label: string; value: string }[];
  priceText: string;
  /** redovna cena, precrtana pored akcijske */
  regularText?: string | null;
  /** natpis iznad cene; podrazumevano „Akcijska cena" uz bedž, inače „Cena" */
  priceLabel?: string;
};

export default function OfferCard({ d }: { d: Offer }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[12px] bg-paper shadow-[0_1px_2px_rgba(24,25,27,0.05)] ring-1 ring-black/[0.06] transition-shadow duration-500 ease-[var(--ease-brand)] hover:shadow-[0_32px_64px_-32px_rgba(24,25,27,0.45)]">
      {/* 1. proizvod na beloj podlozi */}
      <div className="relative aspect-[5/4] overflow-hidden border-b border-line bg-white">
        {d.image && (
          // eslint-disable-next-line @next/next/no-img-element -- slika sa backenda ili iz public
          <img
            src={d.image}
            alt={d.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-contain px-7 pb-9 pt-12 transition-transform duration-700 ease-[var(--ease-brand)] group-hover:-translate-y-1.5 group-hover:scale-[1.03]"
          />
        )}
        <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
          {d.logo ? (
            <BrandMark src={d.logo} alt={d.kind} />
          ) : (
            <span className="truncate pt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-ink/50">{d.kind}</span>
          )}
          {d.badge && (
            <span className="shrink-0 rounded-[4px] bg-[#e02a33] px-2.5 py-1.5 text-[12px] font-medium leading-none tracking-[0.02em] text-white">
              {d.badge}
            </span>
          )}
        </div>
      </div>

      {/* 2. naziv i podaci */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[19px] font-medium leading-tight tracking-[-0.01em]">
          <Link href={d.href} className="after:absolute after:inset-0 after:z-10 focus-visible:outline-none">
            {d.name}
          </Link>
        </h3>
        {d.note && <p className="mt-1.5 line-clamp-2 text-[13px] leading-snug text-mist">{d.note}</p>}

        {d.rows.length > 0 && (
          <dl className={`mt-4 grid divide-x divide-line border-y border-line py-3 ${d.rows.length >= 3 ? "grid-cols-3" : d.rows.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
            {d.rows.map((r) => (
              <div key={r.label} className="flex min-w-0 flex-col-reverse px-3 first:pl-0 last:pr-0">
                <dt className="mt-1 truncate text-[11px] text-mist">{r.label}</dt>
                <dd className="break-words text-[14px] font-medium leading-tight tabular-nums">{r.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {/* 3. cena */}
        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between gap-3 rounded-[8px] bg-[#18191b] py-3 pl-4 pr-3 text-white transition-colors duration-300 group-hover:bg-[#e02a33]">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/50 transition-colors group-hover:text-white/75">{d.priceLabel ?? (d.badge ? "Akcijska cena" : "Cena")}</p>
              <p className="mt-1.5 flex flex-wrap items-baseline gap-x-2">
                <span className="text-[20px] font-medium leading-none tracking-[-0.01em] tabular-nums">{d.priceText}</span>
                {d.regularText && <span className="text-[12px] text-white/45 line-through transition-colors group-hover:text-white/70">{d.regularText}</span>}
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-2.5 text-[13px] font-medium">
              <span className="hidden sm:inline">Pogledaj</span>
              <span className="grid size-9 place-items-center rounded-full bg-white/10 transition-colors duration-300 group-hover:bg-white group-hover:text-[#e02a33]">
                <ArrowRight className="h-3 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
