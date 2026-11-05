"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { Banknote, CircleCheck, Landmark, MapPinned, Phone, Tractor } from "lucide-react";
import Reveal from "./Reveal";
import { ArrowRight } from "./graphics";
import { useInquiry } from "@/lib/useInquiry";
import { tel, useSite } from "@/lib/site-context";

/*
  Strana Subvencije i finansiranje, u jeziku početne i strana Akcije, O nama i Servis.
  Programi i njihov status: provereno 4. 11. 2026. iz javnih izvora (UAP, Ministarstvo, gradovi), vidi PROGRAMS.
  Rokovi se menjaju - status „otvoreno do" se posle roka sam pretvara u „poziv je zatvoren" (proverava se u browseru).
  Forma šalje upit u admin (Upiti sa sajta, vrsta „subvencija").
*/

const CHECKED = "4. novembra 2026.";

type Program = {
  icon: typeof Banknote;
  tag: string;
  title: string;
  text: string;
  facts: string[];
  /** otvoren poziv: rok (ISO) - posle roka kartica sama kaže da je poziv zatvoren */
  openUntil?: string;
  /** stanje kad nema otvorenog poziva */
  status?: string;
  source: { label: string; href: string };
};

const PROGRAMS: Program[] = [
  {
    icon: Banknote,
    tag: "Ministarstvo poljoprivrede · banke",
    title: "Subvencionisani krediti",
    text: "Kredit sa subvencionisanom kamatom za ulaganja u gazdinstvo, uključujući poljoprivrednu mehanizaciju i opremu. Zahtev se podnosi preko banaka koje imaju ugovor sa Ministarstvom.",
    facts: ["Kamata 3% godišnje", "1% za mlade do 40 godina, žene i područja sa otežanim uslovima", "Do 6 miliona dinara (pravna lica do 18 miliona)", "Otplata do 3 godine, za pojedine namene do 5"],
    openUntil: "2026-12-02T23:59:59+01:00",
    source: { label: "Uprava za agrarna plaćanja", href: "https://uap.gov.rs/" },
  },
  {
    icon: Tractor,
    tag: "Republika Srbija · UAP",
    title: "Podsticaji za nove traktore",
    text: "Povraćaj dela troška za kupovinu novog traktora, posle kupovine, preko portala eAgrar. Poslednji poziv bio je od 25. aprila do 25. maja 2025.",
    facts: ["Traktori do 60 kW", "Do 1.000.000 dinara po korisniku godišnje", "Traktor ostaje u vlasništvu najmanje 5 godina"],
    status: "Čeka se poziv za 2026.",
    source: { label: "uap.gov.rs", href: "https://uap.gov.rs/" },
  },
  {
    icon: Landmark,
    tag: "Evropska unija",
    title: "IPARD III",
    text: "Bespovratna sredstva za registrovana gazdinstva. Poslednji poziv za nove traktore (Mera 1) bio je 2024. godine, sa podsticajem od 60 do 75% prihvatljivih troškova.",
    facts: ["60–75% bespovratno", "Traktori i mehanizacija kroz Meru 1", "Stroža dokumentacija i bodovanje projekata"],
    status: "Nema otvorenog poziva",
    source: { label: "IPARD III pozivi", href: "https://uap.gov.rs/javni-pozivi-ipard-iii/" },
  },
  {
    icon: MapPinned,
    tag: "Gradovi i opštine",
    title: "Lokalni konkursi",
    text: "Mnogi gradovi i opštine imaju svoje konkurse za traktore i priključne mašine. Na primer, Beograd je 2026. davao do 80% prihvatljivih troškova bez PDV-a, do milion dinara po korisniku.",
    facts: ["Uslovi i iznosi razlikuju se od mesta do mesta", "Rokovi su najčešće tokom proleća i leta", "Proverite sekretarijat za poljoprivredu svoje opštine"],
    status: "Zavisi od opštine",
    source: { label: "Primer: Grad Beograd", href: "https://www.beograd.rs/lat/gradski-oglasi-i-konkursi/" },
  },
];

// da li je rok prošao - računa se u browseru (na serveru se pretpostavlja da nije, pa se stranica ne kešira pogrešno)
const noop = () => () => {};
function usePast(iso?: string) {
  return useSyncExternalStore(
    noop,
    () => (iso ? Date.now() > new Date(iso).getTime() : false),
    () => false,
  );
}

// „2. decembra 2026." (genitiv meseca; toLocaleDateString daje „2. decembar")
const MONTHS = ["januara", "februara", "marta", "aprila", "maja", "juna", "jula", "avgusta", "septembra", "oktobra", "novembra", "decembra"];
const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()}.`;
};

/* ── 1. hero ── */
export function SubsidyHero() {
  const credit = PROGRAMS[0];
  const past = usePast(credit.openUntil);
  const strip = past
    ? [
        { label: "Republički podsticaji", value: "do 1.000.000 din" },
        { label: "IPARD III", value: "60–75% bespovratno" },
        { label: "Lokalni konkursi", value: "do 80%" },
      ]
    : [
        { label: "Otvoreno sada", value: "Subvencionisani krediti" },
        { label: "Kamata", value: "od 1% do 3%" },
        { label: "Prijave do", value: credit.openUntil ? fmtDate(credit.openUntil) : "" },
      ];

  return (
    <section className="relative overflow-hidden bg-[#18191b] text-white">
      {/* eslint-disable-next-line @next/next/no-img-element -- fotografija iz public */}
      <img
        src="/banners/traktori/solis.jpg"
        alt=""
        aria-hidden
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[60%_center] opacity-55 [mask-image:linear-gradient(to_right,transparent_8%,black_60%)]"
      />
      <div className="absolute inset-0 bg-linear-to-r from-[#18191b] from-10% via-[#18191b]/50 via-50% to-[#18191b]/0" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-[#18191b] to-transparent" />

      <div className="relative mx-auto max-w-[1600px] px-4 pb-14 pt-8 md:px-9 md:pb-20 md:pt-12">
        <nav aria-label="Putanja" className="text-[12px] text-white/55">
          <Link href="/" className="transition-colors hover:text-white">Početna</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Subvencije i finansiranje</span>
        </nav>

        <p className="mt-10 text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33] md:mt-16">Subvencije i finansiranje</p>
        <h1 className="mt-3 max-w-3xl text-[44px] font-medium leading-[0.98] tracking-[-0.03em] md:text-[64px]">
          Nova mehanizacija uz podršku države<span className="text-[#e02a33]">.</span>
        </h1>
        <p className="mt-5 max-w-lg text-[14px] leading-relaxed text-white/70 md:text-[15px]">
          Deo troška za traktor ili priključnu mašinu možete da vratite kroz subvencije ili da kupite uz povoljan kredit. Pomažemo vam da izaberete mašinu i pripremite ponudu za prijavu.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          <a href="#savet" className="group inline-flex h-11 items-center gap-2.5 rounded-full bg-[#e02a33] pl-5 pr-1.5 text-[13px] font-medium text-white transition-colors hover:bg-[#c41f27]">
            Zatražite savet
            <span className="grid size-8 place-items-center rounded-full bg-white text-[#e02a33]">
              <ArrowRight className="h-2.5 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </span>
          </a>
          <a href="#programi" className="inline-flex h-11 items-center rounded-full border border-white/20 bg-white/10 px-5 text-[13px] text-white backdrop-blur-md transition-colors hover:border-white hover:bg-white hover:text-ink">
            Šta je trenutno dostupno
          </a>
        </div>

        <dl className="mt-12 grid max-w-3xl grid-cols-1 overflow-hidden rounded-[12px] border border-white/15 bg-white/[0.06] backdrop-blur-md sm:grid-cols-3 md:mt-16">
          {strip.map((s, i) => (
            <div key={s.label} className={`flex flex-col-reverse justify-end border-b border-white/10 px-5 py-4 sm:border-b-0 ${i < strip.length - 1 ? "sm:border-r" : ""}`}>
              <dt className="mt-1.5 text-[10px] uppercase tracking-[0.16em] text-white/50 md:text-[11px]">{s.label}</dt>
              <dd className="flex items-center gap-2 text-[16px] font-medium leading-tight md:text-[18px]">
                {i === 0 && !past && <span aria-hidden className="size-2 shrink-0 animate-pulse rounded-full bg-[#4ade80]" />}
                {s.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ── 2. šta je trenutno dostupno ── */
function ProgramCard({ p, i }: { p: Program; i: number }) {
  const past = usePast(p.openUntil);
  const open = !!p.openUntil && !past;
  const Icon = p.icon;
  return (
    <Reveal delay={i * 80} className="h-full">
      <article className={`flex h-full flex-col rounded-[12px] p-6 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 md:p-7 ${open ? "bg-[#18191b] text-white" : "bg-paper ring-1 ring-line hover:shadow-[0_24px_40px_-24px_rgba(24,25,27,0.35)]"}`}>
        <div className="flex items-start justify-between gap-3">
          <span className={`grid size-11 shrink-0 place-items-center rounded-[10px] ${open ? "bg-[#e02a33] text-white" : "bg-[#e02a33]/10 text-[#e02a33]"}`}>
            <Icon className="size-5" strokeWidth={1.7} aria-hidden />
          </span>
          {open ? (
            <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#4ade80]/15 px-3 py-1 text-[11px] font-medium text-[#86efac]">
              <span aria-hidden className="size-1.5 animate-pulse rounded-full bg-[#4ade80]" />
              Otvoreno do {fmtDate(p.openUntil!)}
            </span>
          ) : (
            <span className="shrink-0 whitespace-nowrap rounded-full bg-canvas px-3 py-1 text-[11px] text-mist ring-1 ring-line">{past ? "Poziv je zatvoren" : p.status}</span>
          )}
        </div>
        <p className={`mt-6 text-[11px] uppercase tracking-[0.14em] ${open ? "text-white/50" : "text-mist"}`}>{p.tag}</p>
        <h3 className="mt-1.5 text-[21px] font-medium leading-tight tracking-[-0.01em]">{p.title}</h3>
        <p className={`mt-3 text-[14px] leading-relaxed ${open ? "text-white/65" : "text-mist"}`}>{p.text}</p>
        <ul className={`mt-5 space-y-2 border-t pt-5 text-[13px] ${open ? "border-white/10" : "border-line"}`}>
          {p.facts.map((f) => (
            <li key={f} className="flex gap-2.5">
              <span aria-hidden className={`mt-[7px] h-px w-3 shrink-0 ${open ? "bg-[#e02a33]" : "bg-[#e02a33]"}`} />
              <span className={open ? "text-white/85" : ""}>{f}</span>
            </li>
          ))}
        </ul>
        <a
          href={p.source.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`group mt-auto inline-flex items-center gap-2 pt-6 text-[13px] transition-colors ${open ? "text-white/70 hover:text-white" : "text-ink/70 hover:text-ink"}`}
        >
          Izvor: {p.source.label}
          <ArrowRight className="h-2.5 w-3 -rotate-45 transition-transform duration-200 group-hover:rotate-0" />
        </a>
      </article>
    </Reveal>
  );
}

export function SubsidyPrograms() {
  return (
    <section id="programi" className="mx-auto w-full max-w-[1600px] scroll-mt-28 px-4 py-14 md:px-9 md:py-24">
      <Reveal>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33]">Šta je trenutno dostupno</p>
            <h2 className="mt-3 text-[30px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[38px]">
              Odakle može da stigne podrška<span className="text-[#e02a33]">.</span>
            </h2>
          </div>
          <p className="max-w-md text-[13px] leading-relaxed text-mist md:text-right">
            Stanje proverili {CHECKED} Iznosi i rokovi menjaju se svake godine, pa pre kupovine proverite aktuelni javni poziv ili nas pozovite.
          </p>
        </div>
      </Reveal>
      <div className="mt-8 grid gap-4 md:mt-10 md:grid-cols-2 xl:grid-cols-4 xl:gap-5">
        {PROGRAMS.map((p, i) => (
          <ProgramCard key={p.title} p={p} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ── 3. kako funkcioniše ── */
const STEPS = [
  { title: "Izbor mašine i ponuda", text: "Zajedno biramo traktor ili mašinu i izdajemo ponudu, odnosno predračun koji vam treba za prijavu ili kredit." },
  { title: "Prijava ili zahtev za kredit", text: "Ponudu prilažete uz prijavu na konkurs ili zahtev banci. Gazdinstvo mora biti registrovano i u aktivnom statusu." },
  { title: "Kupovina", text: "Posle odobrenja kupujete mašinu i dobijate račun i dokumentaciju potrebnu za isplatu." },
  { title: "Povraćaj sredstava", text: "Kod podsticaja podnosite zahtev za isplatu i deo troška vam se vraća na račun." },
];

export function SubsidySteps() {
  return (
    <section id="kako" className="mx-auto w-full max-w-[1600px] scroll-mt-28 px-4 pb-14 md:px-9 md:pb-24">
      <Reveal>
        <div className="overflow-hidden rounded-[12px] bg-[#18191b] p-6 text-white md:p-10 xl:p-12">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33]">Kako funkcioniše</p>
          <h2 className="mt-3 max-w-2xl text-[30px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[38px]">Četiri koraka do mašine uz podršku.</h2>
          <ol className="relative mt-10 grid gap-6 md:grid-cols-4 md:gap-5">
            <span aria-hidden className="absolute left-5 right-5 top-5 hidden h-px bg-white/15 md:block" />
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative">
                <span className="relative grid size-10 place-items-center rounded-full bg-[#e02a33] text-[14px] font-medium tabular-nums ring-4 ring-[#18191b]">{i + 1}</span>
                <p className="mt-5 text-[17px] font-medium leading-snug">{s.title}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-white/60">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </section>
  );
}

/* ── 5. česta pitanja ── */
const FAQ = [
  { q: "Ko može da dobije subvenciju?", a: "Najčešće registrovana poljoprivredna gazdinstva u aktivnom statusu. Tačne uslove (veličina gazdinstva, starost nosioca, područje) propisuje svaki javni poziv." },
  { q: "Da li se subvencija dobija pre ili posle kupovine?", a: "Kod većine programa posle: prvo kupujete, pa vam se deo troška vraća. Zato je važno da ponuda i račun budu u skladu sa uslovima poziva." },
  { q: "Može li traktor da se kupi na subvencionisani kredit?", a: "Da, ulaganja u poljoprivrednu mehanizaciju i opremu su među namenama subvencionisanih kredita. Zahtev se podnosi preko banke, a mi pripremamo ponudu koja vam treba." },
  { q: "Za koje mašine iz vaše ponude može da se konkuriše?", a: "Za nove traktore i priključne mašine. Pozovite nas i proverićemo da li izabrani model ispunjava uslove aktuelnog poziva, npr. snagu do 60 kW kod republičkih podsticaja." },
  { q: "Da li nudite plaćanje na rate ili lizing?", a: "Uslove finansiranja dogovaramo pojedinačno. Pozovite nas i reći ćemo vam šta je trenutno moguće." },
];

export function SubsidyFaq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-9 md:pb-24">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <Reveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33]">Česta pitanja</p>
          <h2 className="mt-3 text-[30px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[38px]">
            Pitanja koja čujemo najčešće<span className="text-[#e02a33]">.</span>
          </h2>
        </Reveal>
        <ul className="space-y-2.5">
          {FAQ.map((f, i) => {
            const on = open === i;
            return (
              <li key={f.q} className={`overflow-hidden rounded-[12px] transition-colors ${on ? "bg-canvas ring-1 ring-line" : "bg-paper ring-1 ring-line hover:ring-ink/20"}`}>
                <button type="button" onClick={() => setOpen(on ? null : i)} aria-expanded={on} className="flex w-full items-center justify-between gap-6 px-5 py-4 text-left md:px-6 md:py-5">
                  <span className="text-[15px] font-medium md:text-[17px]">{f.q}</span>
                  <span className={`grid size-8 shrink-0 place-items-center rounded-full text-[18px] leading-none transition-all duration-300 ${on ? "rotate-45 bg-ink text-white" : "bg-canvas text-ink"}`}>+</span>
                </button>
                {on && <p className="-mt-1 px-5 pb-5 text-[14px] leading-relaxed text-mist md:px-6">{f.a}</p>}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ── 6. savet: crvena kartica sa zupčanicima + forma ── */
const FIELD =
  "h-12 w-full rounded-[10px] border border-line bg-canvas px-4 text-[15px] text-ink outline-none transition placeholder:text-mist/70 focus:border-ink focus:bg-paper";

export function SubsidyCta() {
  const { contact: c } = useSite();
  const inq = useInquiry();
  const [f, setF] = useState({ name: "", phone: "", machine: "", msg: "" });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setF((x) => ({ ...x, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = [f.machine && `Mašina: ${f.machine}`, f.msg].filter(Boolean).join("\n\n") || "Zanima me kupovina uz subvenciju ili kredit.";
    void inq.send(
      { type: "subvencija", name: f.name, phone: f.phone, message, location: "svilajnac", extra: { Mašina: f.machine } },
      { subject: "Subvencija - upit", body: `${message}\n---\n${f.name}, ${f.phone}` },
    );
  };

  return (
    <section id="savet" className="mx-auto w-full max-w-[1600px] scroll-mt-28 px-4 pb-14 md:px-9 md:pb-24">
      <Reveal>
        <div className="grid overflow-hidden rounded-[12px] ring-1 ring-line lg:grid-cols-[1fr_1.15fr]">
          <div className="relative isolate flex flex-col bg-[#e02a33] p-6 text-white md:p-10 xl:p-12">
            {/* eslint-disable-next-line @next/next/no-img-element -- dekorativna fotografija iz public */}
            <img src="/images/akcenti/zupcanici.jpg" alt="" aria-hidden loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60 mix-blend-multiply grayscale" />
            <span aria-hidden className="absolute inset-0 -z-10 bg-linear-to-br from-[#e02a33] via-[#e02a33]/70 to-[#e02a33]/30" />
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/75">Besplatan savet</p>
            <h2 className="mt-3 text-[30px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[38px]">Planirate kupovinu uz subvenciju?</h2>
            <p className="mt-3 max-w-md text-[14px] leading-relaxed text-white/85">
              Javite nam koju mašinu razmatrate. Pripremićemo ponudu i reći vam šta je potrebno za prijavu ili kredit.
            </p>
            {c.phone && (
              <a href={tel(c.phone)} className="group mt-auto flex items-center justify-between gap-4 rounded-[10px] border border-white/25 bg-white/10 p-4 backdrop-blur-md transition-colors hover:bg-white hover:text-ink sm:max-w-sm">
                <span className="pt-0">
                  <span className="block text-[11px] uppercase tracking-[0.16em] text-white/70 transition-colors group-hover:text-mist">Pozovite</span>
                  <span className="mt-1 block text-[20px] font-medium tabular-nums">{c.phone}</span>
                </span>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-[#e02a33] transition-colors group-hover:bg-[#e02a33] group-hover:text-white">
                  <Phone className="size-[17px]" strokeWidth={1.7} aria-hidden />
                </span>
              </a>
            )}
          </div>

          <div className="bg-paper p-6 md:p-10 xl:p-12">
            {inq.status === "sent" ? (
              <div className="flex h-full flex-col items-start justify-center py-10">
                <span className="grid size-14 place-items-center rounded-full bg-[#e02a33] text-white">
                  <CircleCheck className="size-7" strokeWidth={1.8} aria-hidden />
                </span>
                <h3 className="mt-6 text-[26px] font-medium leading-tight tracking-[-0.02em]">Upit je poslat.</h3>
                <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-mist">Javljamo vam se telefonom sa ponudom i uputstvom za prijavu.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-4">
                <div>
                  <h3 className="text-[22px] font-medium tracking-[-0.01em]">Upit za subvenciju</h3>
                  <p className="mt-1 text-[13px] text-mist">Odgovaramo istog radnog dana.</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-[12px] font-medium">Ime i prezime</span>
                    <input required value={f.name} onChange={set("name")} autoComplete="name" className={FIELD} />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-[12px] font-medium">Telefon</span>
                    <input required type="tel" inputMode="tel" value={f.phone} onChange={set("phone")} autoComplete="tel" placeholder="06x xxx xxxx" className={FIELD} />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-medium">Koju mašinu razmatrate</span>
                  <input value={f.machine} onChange={set("machine")} placeholder="npr. Solis 50, IMT 539, prskalica" className={FIELD} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-[12px] font-medium">Poruka (nije obavezno)</span>
                  <textarea rows={3} value={f.msg} onChange={set("msg")} placeholder="npr. konkurišem preko opštine, treba mi predračun do petka" className={`${FIELD} h-auto resize-y py-3 leading-relaxed`} />
                </label>
                {inq.status === "error" && (
                  <p role="alert" className="rounded-[10px] bg-[#fdecea] px-4 py-3 text-[13px] text-[#b91c1c]">
                    {inq.error}{" "}
                    <a href={inq.mailto} className="font-medium underline">
                      Pošaljite e-mailom
                    </a>
                  </p>
                )}
                <button
                  type="submit"
                  disabled={inq.status === "sending"}
                  className="group mt-2 inline-flex h-12 w-full items-center justify-between rounded-full bg-ink pl-6 pr-1.5 text-[14px] font-medium text-white transition-colors hover:bg-[#e02a33] disabled:opacity-70 sm:w-auto sm:justify-start sm:gap-3 sm:justify-self-start"
                >
                  {inq.status === "sending" ? "Šaljemo upit…" : "Pošaljite upit"}
                  <span className="grid size-9 place-items-center rounded-full bg-white text-ink transition-colors group-hover:text-[#e02a33]">
                    <ArrowRight className="h-3 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
