import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import LegalToc from "./LegalToc";
import { ArrowRight } from "./graphics";
import type { SiteInfo } from "@/lib/site-info";

/* Okvir za pravne strane (Politika privatnosti, Uslovi korišćenja), u jeziku strane Akcije:
 * tamni hero sa prekidačem između dokumenata, lepljiv sadržaj levo, poglavlja kao kartice, tamna kartica za pitanja.
 * Tekst je NACRT: pre puštanja proveriti sa klijentom/pravnikom (PIB, matični broj, uslovi isporuke i plaćanja). */

export type LegalSection = { title: string; body: React.ReactNode };

const DOCS = [
  { key: "privatnost", label: "Politika privatnosti", href: "/politika-privatnosti" },
  { key: "uslovi", label: "Uslovi korišćenja", href: "/uslovi-koriscenja" },
] as const;

const telHref = (p: string) => `tel:${p.replace(/[^\d+]/g, "")}`;

export default function LegalPage({
  doc,
  title,
  intro,
  updated,
  sections,
  contact,
}: {
  doc: (typeof DOCS)[number]["key"];
  title: string;
  intro: React.ReactNode;
  updated: string;
  sections: LegalSection[];
  contact: SiteInfo["contact"];
}) {
  const items = sections.map((s, i) => ({ id: `deo-${i + 1}`, title: s.title }));
  const stats = [
    { value: String(sections.length), label: "poglavlja" },
    { value: updated, label: "poslednja izmena" },
  ];

  return (
    <>
      {/* ── hero ── */}
      <section className="relative overflow-hidden bg-[#18191b] text-white">
        <span aria-hidden className="pointer-events-none absolute -right-40 -top-40 size-[460px] rounded-full bg-[#e02a33]/15 blur-3xl" />
        <div className="relative mx-auto max-w-[1600px] px-4 pb-12 pt-8 md:px-9 md:pb-16 md:pt-12">
          <nav aria-label="Putanja" className="text-[12px] text-white/55">
            <Link href="/" className="transition-colors hover:text-white">Početna</Link>
            <span className="mx-2">/</span>
            <span className="text-white">{title}</span>
          </nav>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-8 md:mt-10">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33]">Pravne informacije</p>
              <h1 className="mt-3 text-[38px] font-medium leading-[0.95] tracking-[-0.03em] md:text-[60px]">
                {title}
                <span className="text-[#e02a33]">.</span>
              </h1>
              <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-white/70 md:text-[15px]">{intro}</p>
            </div>

            {/* prekidač između dokumenata */}
            <nav aria-label="Pravni dokumenti" className="flex rounded-full border border-white/15 bg-white/5 p-1 backdrop-blur-md">
              {DOCS.map((d) => (
                <Link
                  key={d.key}
                  href={d.href}
                  aria-current={d.key === doc ? "page" : undefined}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${d.key === doc ? "bg-white text-ink" : "text-white/65 hover:text-white"}`}
                >
                  {d.label}
                </Link>
              ))}
            </nav>
          </div>

          <dl className="mt-10 grid max-w-md grid-cols-2 border-y border-white/15 md:mt-12">
            {stats.map((s, i) => (
              <div key={s.label} className={`py-3.5 md:py-4 ${i > 0 ? "border-l border-white/15 pl-5 md:pl-8" : ""}`}>
                <dd className="whitespace-nowrap text-[18px] font-medium leading-none tracking-[-0.02em] md:text-[22px]">{s.value}</dd>
                <dt className="mt-1.5 text-[10px] uppercase tracking-[0.16em] text-white/50 md:text-[11px]">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── sadržaj ── */}
      <section className="bg-canvas">
        <div className="mx-auto grid max-w-[1600px] gap-8 px-4 pb-16 pt-10 md:px-9 md:pb-24 md:pt-14 lg:grid-cols-[280px_minmax(0,1fr)] xl:gap-14">
          <aside className="hidden lg:block">
            <div className="sticky top-32 space-y-4">
              <div className="rounded-[12px] bg-paper p-4 ring-1 ring-line">
                <p className="px-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33]">Sadržaj</p>
                <LegalToc items={items} />
              </div>
              {contact.email && (
                <a href={`mailto:${contact.email}`} className="group flex items-center gap-3 rounded-[12px] bg-paper p-4 ring-1 ring-line transition-colors hover:ring-ink/30">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-canvas text-ink">
                    <Mail className="size-4" strokeWidth={1.8} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] uppercase tracking-[0.16em] text-mist">Pitanja</span>
                    <span className="block truncate text-[13px] font-medium">{contact.email}</span>
                  </span>
                </a>
              )}
            </div>
          </aside>

          <div className="max-w-[880px] space-y-4">
            {sections.map((s, i) => (
              <article key={items[i].id} id={items[i].id} className="scroll-mt-36 rounded-[12px] bg-paper p-6 ring-1 ring-line md:p-8">
                <header className="flex items-center gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e02a33] text-[12px] font-medium tabular-nums text-white">{i + 1}</span>
                  <h2 className="text-[18px] font-medium tracking-[-0.01em] md:text-[20px]">{s.title}</h2>
                </header>
                <div className="mt-4 space-y-3 text-[14px] leading-[1.7] text-ink/80 md:pl-11 md:text-[15px] [&_a]:font-medium [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-[#e02a33] [&_li]:relative [&_li]:pl-5 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.7em] [&_li]:before:size-1.5 [&_li]:before:rounded-full [&_li]:before:bg-[#e02a33] [&_ul]:space-y-2">
                  {s.body}
                </div>
              </article>
            ))}

            {/* ── pitanja ── */}
            <div className="relative overflow-hidden rounded-[12px] bg-[#18191b] p-6 text-white md:p-8">
              <span aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 size-64 rounded-full bg-[#e02a33]/20 blur-3xl" />
              <div className="relative flex flex-wrap items-center justify-between gap-6">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33]">Imate pitanje</p>
                  <h2 className="mt-2 text-[22px] font-medium tracking-[-0.02em] md:text-[26px]">
                    Tu smo da objasnimo<span className="text-[#e02a33]">.</span>
                  </h2>
                  <p className="mt-2 max-w-md text-[14px] leading-relaxed text-white/65">Pišite nam ili pozovite, odgovaramo radnim danima.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {contact.email && (
                    <a href={`mailto:${contact.email}`} className="group inline-flex h-12 items-center gap-3 rounded-full bg-[#e02a33] pl-5 pr-1.5 text-[14px] font-medium transition-colors hover:bg-[#c41f27]">
                      Pošaljite e-mail
                      <span className="grid size-9 place-items-center rounded-full bg-white text-[#e02a33]">
                        <ArrowRight className="h-3 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </a>
                  )}
                  {contact.phone && (
                    <a href={telHref(contact.phone)} className="inline-flex h-12 items-center gap-2 rounded-full border border-white/30 px-5 text-[14px] transition-colors hover:border-white hover:bg-white hover:text-ink">
                      <Phone className="size-4" strokeWidth={1.8} aria-hidden />
                      {contact.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
