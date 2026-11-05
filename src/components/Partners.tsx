"use client";

import Reveal from "./Reveal";

/* Zajednički elementi za početnu i O nama: brojevi o firmi i traka logoa partnera. */
export const STATS = [
  { value: "1990.", label: "godina osnivanja" },
  { value: "23", label: "modela traktora" },
  { value: "5", label: "brendova traktora" },
  { value: "360+", label: "rezervnih delova online" },
];

export const PARTNERS = [
  "solis", "imt", "deere", "yto", "mahindra", "massey", "landini", "fpm", "majevica", "ino", "kranj",
  "sip", "celmak", "minos", "ursus", "metalfach", "morava", "gorenc", "impex", "gumaplast", "ferocoop", "termometal",
];


// optičko izjednačavanje: logoi sa puno praznog prostora ili samo znakom deluju sitno pri istoj visini
const SCALE: Record<string, number> = { imt: 1.45, massey: 1.2, yto: 1.1, deere: 0.95, gorenc: 1.1, impex: 1.1 };

function Row({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  return (
    <div className="flex w-max items-center gap-3 animate-[marquee_60s_linear_infinite] group-hover:[animation-play-state:paused] md:gap-4" style={reverse ? { animationDirection: "reverse" } : undefined}>
      {[...items, ...items].map((n, i) => (
        <span
          key={n + i}
          aria-hidden={i >= items.length}
          className="grid h-[72px] w-[140px] shrink-0 place-items-center rounded-[10px] bg-canvas ring-1 ring-line/70 transition-colors duration-300 hover:bg-paper hover:ring-line md:h-[88px] md:w-[184px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- logo iz public */}
          <img
            src={`/brands/trim/${n}.svg`}
            alt={i < items.length ? n : ""}
            loading="lazy"
            className="max-h-8 w-auto max-w-[96px] object-contain opacity-55 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 md:max-h-9 md:max-w-[120px]"
            style={SCALE[n] ? { transform: `scale(${SCALE[n]})` } : undefined}
          />
        </span>
      ))}
    </div>
  );
}

/* Brendovi sa kojima radimo: zaglavlje kao u ostalim sekcijama i dva reda pločica sa logoima koji se kreću
 * u suprotnim smerovima (sivi, u boji na hover, traka staje kad je miš preko). bare = bez linije i razmaka iznad. */
export function PartnersMarquee({ title = "Brendovi sa kojima radimo", bare = false }: { title?: string; bare?: boolean }) {
  const half = Math.ceil(PARTNERS.length / 2);
  return (
    <Reveal delay={200}>
      <div className={bare ? "" : "mt-14 md:mt-24"}>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33]">Partneri</p>
            <h2 className="mt-3 text-[26px] font-medium leading-[1.05] tracking-[-0.02em] md:text-[32px]">
              {title}
              <span className="text-[#e02a33]">.</span>
            </h2>
          </div>
          <p className="max-w-sm text-[14px] leading-relaxed text-mist md:text-right">
            {PARTNERS.length} proizvođača traktora, priključnih mašina i rezervnih delova.
          </p>
        </div>

        <div className="group relative mt-8 space-y-3 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] md:mt-10 md:space-y-4">
          <Row items={PARTNERS.slice(0, half)} />
          <Row items={PARTNERS.slice(half)} reverse />
        </div>
      </div>
    </Reveal>
  );
}
