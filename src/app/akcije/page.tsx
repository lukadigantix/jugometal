import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { atvModels } from "@/data/atv";

export const metadata: Metadata = {
  title: "Akcije | Jugometal Svilajnac",
  description: "Proizvodi na akciji u Jugometalu.",
  alternates: { canonical: "/akcije" },
};

/* Akcije = samo proizvodi na akciji (onSale). Kad ih nema - poruka. */
const onSale = atvModels.filter((m) => m.onSale);

export default function Akcije() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-[1600px] px-4 pb-16 pt-8 md:px-9 md:pb-24 md:pt-12">
          <nav aria-label="Putanja" className="text-[13px] text-mist">
            <Link href="/" className="hover:text-ink">Početna</Link>
            <span className="mx-2">/</span>
            <span className="text-ink">Akcije</span>
          </nav>
          <h1 className="mt-4 text-[34px] font-medium leading-[1.05] md:text-[52px]">Akcije</h1>
          <p className="mt-2 text-[14px] text-mist">{onSale.length ? `${onSale.length} proizvoda na akciji` : "Trenutno nemamo proizvoda na akciji."}</p>
          {onSale.length > 0 && (
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4">
              {onSale.map((m) => (
                <li key={m.slug}>
                  <Link href={m.href} className="group flex h-full flex-col overflow-hidden rounded-[4px] border border-line bg-paper transition-shadow hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                    <span className="relative block aspect-[4/3] bg-white">
                      <img src={m.image} alt={m.name} className="absolute inset-0 h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.04]" />
                      <span className="absolute left-3 top-3 rounded-full bg-[#e02a33] px-3 py-1 text-[12px] font-medium text-white">{m.saleBadge}</span>
                    </span>
                    <span className="flex flex-1 flex-col border-t border-line p-5">
                      <span className="text-[12px] uppercase tracking-[0.14em] text-mist">Benda ATV</span>
                      <span className="mt-2 text-[19px] font-medium leading-tight">{m.name.replace("Benda ", "")}</span>
                      <span className="mt-1 text-[13px] text-mist">{m.priceNote}</span>
                      <span className="mt-auto flex items-center justify-between gap-3 pt-5">
                        <span className="text-[22px] font-medium text-[#e02a33]">{m.price}</span>
                        <span className="rounded-full bg-accent px-5 py-2.5 text-[13px] text-accent-contrast">Pogledaj</span>
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
