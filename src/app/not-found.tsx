import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import company from "@/data/company.json";

export const metadata: Metadata = { title: "Strana nije pronađena | Jugometal", robots: { index: false } };

const LINKS = [
  { label: "Online prodavnica", sub: "362 rezervna dela sa cenom", href: "/rezervni-delovi" },
  { label: "Traktori", sub: "Solis, IMT, John Deere, YTO, Mahindra", href: "/traktori" },
  { label: "Priključne mašine", sub: "15 vrsta mašina", href: "/prikljucne-masine" },
  { label: "Benda ATV", sub: "Redstone 550 i 1000", href: "/atv" },
];

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-[1600px] px-4 py-16 md:px-9 md:py-24">
          <p className="text-[12px] uppercase tracking-[0.18em] text-mist">Greška 404</p>
          <h1 className="mt-3 max-w-2xl text-[36px] font-medium leading-[1.05] md:text-[56px]">Ova strana ne postoji ili je premeštena.</h1>
          <p className="mt-4 max-w-xl text-[16px] text-mist">Ako ste tražili deo ili model sa starog sajta, pogledajte ponudu ispod ili nas pozovite - pomoći ćemo.</p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="block h-full rounded-[4px] border border-line p-6 transition-colors hover:border-ink">
                  <span className="block text-[20px] font-medium">{l.label}</span>
                  <span className="mt-1 block text-[14px] text-mist">{l.sub}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/" className="rounded-full bg-accent px-8 py-3 text-[14px] text-accent-contrast hover:bg-accent-soft">Početna strana</Link>
            <a href="tel:035311137" className="rounded-full border border-line px-8 py-3 text-[14px] hover:border-ink">Delovi {company.locations[0].phoneParts}</a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
