"use client";

import Link from "next/link";
import list from "@/data/machine-list.json";

type M = (typeof list)[number];

/* Kartica priključne mašine - lista, kategorije i "Slične mašine". */
export default function MachineCard({ m }: { m: M }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[4px] border border-line bg-paper transition-shadow duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
      <Link href={m.href} aria-label={m.name} className="relative block aspect-[4/3] bg-white">
        <img src={m.image} alt={m.name} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.04]" />
        <span className="absolute left-3 top-3 rounded-full bg-ink px-3 py-1 text-[12px] font-medium text-paper">{m.categoryName}</span>
      </Link>
      <div className="flex flex-1 flex-col border-t border-line p-5">
        <div className="flex h-6 items-center">
          {m.logo ? <img src={m.logo} alt={m.brandName} className="h-6 w-auto max-w-[110px] object-contain" /> : <span className="text-[12px] uppercase tracking-[0.14em] text-mist">{m.brandName}</span>}
        </div>
        <h2 className="mt-3 text-[19px] font-medium leading-tight">
          <Link href={m.href} className="hover:text-mist">{m.name}</Link>
        </h2>
        <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-mist">{m.text}</p>
        {m.key.length > 0 && (
          <dl className="mt-3 space-y-1 text-[13px]">
            {m.key.map((s) => (
              <div key={s.label} className="flex justify-between gap-3 border-b border-line pb-1">
                <dt className="truncate text-mist">{s.label}</dt>
                <dd className="shrink-0 text-right">{s.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="mt-auto flex items-center gap-3 pt-5">
          <Link href={m.href} className="rounded-full bg-accent px-6 py-2.5 text-[14px] text-accent-contrast hover:bg-accent-soft">Pogledaj mašinu</Link>
          <Link href="/kontakt" className="text-[13px] text-mist underline-offset-4 hover:text-ink hover:underline">Cena na upit</Link>
        </div>
      </div>
    </article>
  );
}
