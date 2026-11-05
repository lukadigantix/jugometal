"use client";

import Link from "next/link";
import { useState } from "react";
import { Cable, Mountain, ShieldCheck, Zap } from "lucide-react";
import { ArrowRight } from "./graphics";
import { CatalogCta, CatalogHero, Marquee } from "./catalog/CatalogKit";
import { atv, atvModels, type AtvModel } from "@/data/atv";

/*
  Strana /atv (Benda Redstone), u jeziku strana Akcije i kataloga:
  tamni hero sa cenom „od" i garancijom, crvena traka, velike kartice modela sa izborom boje (slika se menja po boji),
  tabela za poređenje dva modela, traka sa opremom na fotografiji sa terena i tamni poziv na kraju.
  Svi podaci su iz src/data/atv.ts (fabrički podaci Benda i ponuda Jugometala).
*/

const short = (m: AtvModel) => m.name.replace("Benda ", "");
const spec = (m: AtvModel, label: string) => m.specs.flatMap((g) => g.rows).find((r) => r[0] === label)?.[1] ?? "";

/* ── kartica modela: bina sa slikom u izabranoj boji, boje, brojke, cena ── */
function ModelCard({ m }: { m: AtvModel }) {
  const [ci, setCi] = useState(0);
  const c = m.colors[ci];
  // „Akcija" je snižena cena; „Poklon" je redovna cena uz poklon
  const cut = m.onSale && /akcij/i.test(m.saleBadge ?? "");
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[12px] bg-paper ring-1 ring-black/[0.06]">
      <Link href={m.href} aria-label={short(m)} className="relative block aspect-[16/11] overflow-hidden bg-[radial-gradient(ellipse_at_50%_55%,#ffffff_0%,#ffffff_42%,#eeede9_100%)]">
        {/* eslint-disable-next-line @next/next/no-img-element -- slika iz public */}
        <img
          key={c.image}
          src={c.image}
          alt={`${m.name}, ${c.name}`}
          className="absolute inset-0 h-full w-full animate-[heroIn_.45s_ease-out_both] object-contain px-6 pb-10 pt-14 transition-transform duration-700 ease-[var(--ease-brand)] group-hover:scale-[1.03] md:px-10"
        />
        {/* senka na podlozi */}
        <span aria-hidden className="pointer-events-none absolute inset-x-[18%] bottom-[9%] h-6 rounded-[50%] bg-black/15 blur-xl" />
        <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3 md:inset-x-5 md:top-5">
          {m.onSale && m.saleBadge ? (
            <span className="rounded-[4px] bg-[#e02a33] px-2.5 py-1.5 text-[12px] font-medium leading-none text-white">{m.saleBadge}</span>
          ) : (
            <span />
          )}
          <span className="whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-ink ring-1 ring-line">{c.name}</span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5 md:p-7">
        {/* boje */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Boja">
            {m.colors.map((x, i) => (
              <button
                key={x.name}
                type="button"
                role="radio"
                aria-checked={i === ci}
                aria-label={`${x.name} (${x.sr})`}
                title={`${x.name} (${x.sr})`}
                onClick={() => setCi(i)}
                className={`size-8 rounded-full p-0.5 transition ${i === ci ? "ring-2 ring-[#18191b]" : "ring-1 ring-transparent hover:ring-line"}`}
              >
                <span className="block size-full rounded-full ring-1 ring-black/15" style={{ background: x.hex }} />
              </button>
            ))}
          </div>
          <p className="whitespace-nowrap text-[12px] text-mist">
            {m.colors.length} boja · <span className="text-ink">{c.sr}</span>
          </p>
        </div>

        <h2 className="mt-6 text-[30px] font-medium leading-none tracking-[-0.03em] md:text-[38px]">
          <Link href={m.href} className="transition-colors hover:text-[#e02a33]">
            {short(m)}
          </Link>
          <span className="text-[#e02a33]">.</span>
        </h2>
        <p className="mt-2 text-[14px] text-mist md:text-[15px]">{m.tagline}</p>

        <dl className="mt-6 grid grid-cols-2 gap-2">
          {m.stats.map((s) => (
            <div key={s.label} className="rounded-[10px] bg-canvas px-3.5 py-3">
              <dd className="whitespace-nowrap text-[20px] font-medium leading-none tracking-[-0.02em] tabular-nums md:text-[22px]">
                {s.value}
                <span className="ml-1 text-[11px] font-normal tracking-normal text-mist">{s.unit}</span>
              </dd>
              <dt className="mt-1.5 truncate text-[10px] uppercase tracking-[0.14em] text-mist">{s.label}</dt>
            </div>
          ))}
        </dl>

        {/* cena i dugme */}
        <div className="mt-auto pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-[12px] bg-[#18191b] p-4 pl-5 text-white md:p-5 md:pl-6">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/50">{cut ? "Akcijska cena" : "Cena"}</p>
              <p className={`mt-1.5 text-[28px] font-medium leading-none tracking-[-0.02em] tabular-nums md:text-[32px] ${cut ? "text-[#ff5a61]" : ""}`}>{m.price}</p>
              {m.priceNote && <p className="mt-1.5 text-[12px] text-white/55">{m.priceNote}</p>}
            </div>
            <Link href={m.href} className="group/b inline-flex h-12 shrink-0 items-center gap-3 rounded-full bg-[#e02a33] pl-6 pr-1.5 text-[14px] font-medium transition-colors hover:bg-[#c41f27]">
              Pogledaj model
              <span className="grid size-9 place-items-center rounded-full bg-white text-[#e02a33]">
                <ArrowRight className="h-3 w-3.5 transition-transform duration-200 group-hover/b:translate-x-0.5" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── poređenje dva modela ── */
const COMPARE: { label: string; get: (m: AtvModel) => string }[] = [
  { label: "Snaga", get: (m) => spec(m, "Snaga") },
  { label: "Zapremina motora", get: (m) => spec(m, "Zapremina") },
  { label: "Obrtni moment", get: (m) => spec(m, "Obrtni moment") },
  { label: "Menjač", get: (m) => spec(m, "Menjač") },
  { label: "Pogon", get: (m) => spec(m, "Pogon") },
  { label: "Zadnje vešanje", get: (m) => spec(m, "Zadnje vešanje") },
  { label: "Kočnice", get: (m) => spec(m, "Kočnice") },
  { label: "Gume napred / nazad", get: (m) => `${spec(m, "Prednje gume")} / ${spec(m, "Zadnje gume")}` },
  { label: "D × Š × V", get: (m) => spec(m, "D × Š × V") },
  { label: "Klirens", get: (m) => spec(m, "Klirens") },
  { label: "Suva masa", get: (m) => spec(m, "Suva masa") },
  { label: "Vuča sa kočnicom", get: (m) => spec(m, "Vuča sa kočnicom") },
  { label: "Rezervoar", get: (m) => spec(m, "Rezervoar") },
  { label: "Boje", get: (m) => `${m.colors.length}` },
  { label: "Cena", get: (m) => m.price },
];

function Compare() {
  const [a, b] = atvModels;
  return (
    <div className="overflow-hidden rounded-[12px] bg-paper ring-1 ring-line">
      {/* zaglavlje: modeli sa slikom */}
      <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1fr)] border-b border-line md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="hidden items-end p-5 md:flex md:p-7">
          <p className="text-[12px] text-mist">Fabrički podaci Benda</p>
        </div>
        <div className="md:hidden" />
        {[a, b].map((m, i) => (
          <Link key={m.slug} href={m.href} className={`group flex flex-col items-center gap-2 border-l border-line px-3 py-4 text-center md:px-6 md:py-5 ${i === 1 ? "bg-[#18191b] text-white" : ""}`}>
            {/* eslint-disable-next-line @next/next/no-img-element -- slika iz public */}
            <img src={m.image} alt="" loading="lazy" className="h-14 w-auto object-contain transition-transform duration-500 group-hover:scale-105 md:h-24" />
            <span className="text-[14px] font-medium leading-tight tracking-[-0.01em] md:text-[18px]">{short(m)}</span>
          </Link>
        ))}
      </div>
      <dl>
        {COMPARE.map((row) => (
          <div key={row.label} className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1fr)] border-b border-line text-[12px] last:border-b-0 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)] md:text-[14px]">
            <dt className="px-3 py-3 text-mist md:px-7 md:py-3.5">{row.label}</dt>
            {[a, b].map((m, i) => (
              <dd key={m.slug} className={`border-l border-line px-3 py-3 font-medium md:px-6 md:py-3.5 ${i === 1 ? "bg-[#18191b]/[0.03]" : ""} ${row.label === "Cena" && m.onSale && /akcij/i.test(m.saleBadge ?? "") ? "text-[#e02a33]" : ""}`}>
                {row.get(m) || "–"}
              </dd>
            ))}
          </div>
        ))}
      </dl>
    </div>
  );
}

const FEATURES = [
  { icon: Zap, title: "2WD / 4WD", text: "pogon na izbor, sa blokadom diferencijala" },
  { icon: Cable, title: "Kuka i vitlo", text: "u standardnoj opremi" },
  { icon: Mountain, title: "Beadlock felne 14\"", text: "aluminijumske, za teži teren" },
  { icon: ShieldCheck, title: "3 godine", text: "ili 8.000 km garancije" },
];

export default function AtvLanding() {
  const n = atvModels.length;
  return (
    <>
      <CatalogHero
        crumbs={[{ label: "Početna", href: "/" }, { label: "Benda ATV" }]}
        title="Benda ATV"
        text={
          <>
            Redstone kvadovi sa V2 motorom i pogonom 2WD / 4WD.
            <br />
            Za njivu, šumu i teren, uz garanciju 3 godine ili 8.000 km.
          </>
        }
        image="/atv/benda-teren-2.jpg"
        stats={[
          ...(atv.fromPrice ? [{ value: `od ${atv.fromPrice}`, label: "akcijska cena" }] : []),
          { value: "V2", label: "motor, EFI" },
          { value: "3 godine", label: "ili 8.000 km garancije" },
        ]}
        listLabel="Pogledaj modele"
      />
      <Marquee phrases={["Benda Redstone", "V2 motor", "2WD / 4WD", "Kuka i vitlo", "Garancija 3 godine", "Jugometal Svilajnac"]} />

      <div className="bg-canvas">
        {/* ── modeli ── */}
        <section id="ponuda" className="mx-auto w-full max-w-[1600px] scroll-mt-24 px-4 pb-14 pt-10 md:px-9 md:pb-24 md:pt-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[12px] uppercase tracking-[0.18em] text-mist">Modeli</p>
              <h2 className="mt-2 text-[30px] font-medium leading-[1.05] md:text-[38px]">
                Izaberite svoj Redstone<span className="text-[#e02a33]">.</span>
              </h2>
            </div>
            <p className="text-[14px] text-mist">
              {n} modela · {atvModels.reduce((s, m) => s + m.colors.length, 0)} boja
            </p>
          </div>
          <ul className="mt-8 grid gap-4 md:gap-6 lg:grid-cols-2">
            {atvModels.map((m) => (
              <li key={m.slug}>
                <ModelCard m={m} />
              </li>
            ))}
          </ul>
        </section>

        {/* ── poređenje ── */}
        <section className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-9 md:pb-24">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] lg:gap-12">
            <div className="lg:pt-4">
              <p className="text-[12px] uppercase tracking-[0.18em] text-mist">Poređenje</p>
              <h2 className="mt-2 text-[30px] font-medium leading-[1.05] md:text-[38px]">
                Uporedite modele<span className="text-[#e02a33]">.</span>
              </h2>
              <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-mist">
                Oba imaju V2 motor sa ubrizgavanjem, CVT menjač i ABS kočnice. Razlikuju se po snazi, obrtnom momentu, vuči i zadnjem vešanju.
              </p>
            </div>
            <Compare />
          </div>
        </section>

        {/* ── oprema na terenu ── */}
        <section className="relative overflow-hidden bg-[#18191b] text-white">
          {/* eslint-disable-next-line @next/next/no-img-element -- fotografija iz public */}
          <img src="/atv/benda-teren.jpg" alt="" aria-hidden loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-linear-to-r from-[#18191b] via-[#18191b]/70 to-[#18191b]/10" />
          <div className="relative mx-auto grid w-full max-w-[1600px] gap-10 px-4 py-16 md:px-9 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-end">
            <div>
              <p className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-white/80">
                <span className="h-px w-8 bg-[#e02a33]" />
                U standardnoj opremi
              </p>
              <h2 className="mt-4 text-[32px] font-medium leading-[1.02] tracking-[-0.03em] md:text-[48px]">
                Spreman za svaki teren<span className="text-[#e02a33]">.</span>
              </h2>
              <p className="mt-4 max-w-md text-[14px] leading-relaxed text-white/70 md:text-[15px]">
                Oba modela stižu sa pogonom 2WD / 4WD, blokadom diferencijala, kukom i vitlom, podesivim gasnim amortizerima i LED farovima.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <li key={f.title} className="rounded-[12px] border border-white/15 bg-white/[0.07] p-5 backdrop-blur-md">
                  <f.icon className="size-5 text-[#e02a33]" strokeWidth={1.8} aria-hidden />
                  <p className="mt-4 text-[17px] font-medium tracking-[-0.01em]">{f.title}</p>
                  <p className="mt-1 text-[13px] text-white/60">{f.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="pt-14 md:pt-24">
          <CatalogCta eyebrow="Imate pitanje o modelu?" title="Pozovite. Pomažemo oko izbora modela, boje i rezervacije." />
        </div>
      </div>
    </>
  );
}
