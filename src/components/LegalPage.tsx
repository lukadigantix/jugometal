import Link from "next/link";

/* Okvir za pravne strane. Tekst je NACRT - pre puštanja proveriti sa klijentom/pravnikom
 * (PIB, matični broj, uslovi isporuke i plaćanja nisu poznati). */
export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-[860px] px-4 pb-20 pt-8 md:px-9 md:pt-12">
      <nav aria-label="Putanja" className="text-[13px] text-mist">
        <Link href="/" className="hover:text-ink">Početna</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{title}</span>
      </nav>
      <h1 className="mt-4 text-[34px] font-medium leading-[1.05] md:text-[48px]">{title}</h1>
      <p className="mt-2 text-[13px] text-mist">Poslednja izmena: {updated}</p>
      <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-ink/85 [&_h2]:mb-3 [&_h2]:text-[20px] [&_h2]:font-medium [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-1.5">
        {children}
      </div>
    </section>
  );
}
