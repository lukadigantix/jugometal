"use client";

import Reveal from "./Reveal";

/* Zajednički elementi za početnu i O nama: brojevi o firmi i traka logoa partnera. */
export const STATS = [
  { value: "1990.", label: "godina osnivanja" },
  { value: "3", label: "prodajno-servisna centra" },
  { value: "5", label: "brendova traktora" },
  { value: "360+", label: "rezervnih delova online" },
];

export const PARTNERS = [
  "solis", "imt", "deere", "yto", "mahindra", "massey", "landini", "fpm", "majevica", "ino", "kranj",
  "sip", "celmak", "minos", "ursus", "metalfach", "morava", "gorenc", "impex", "gumaplast", "ferocoop", "termometal",
];


/* Beskonačna traka logoa partnera (siva, u boji na hover, staje kad je miš preko). */
export function PartnersMarquee({ title = "Brendovi sa kojima radimo", bare = false }: { title?: string; bare?: boolean }) {
  return (
      <Reveal delay={200}>
        <div className={bare ? "" : "mt-12 border-t border-line pt-8 md:mt-20 md:pt-10"}>
          <p className="text-center text-[12px] uppercase tracking-[0.18em] text-mist">{title}</p>
          <div className="group relative mt-8 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
            <div className="flex w-max animate-[marquee_45s_linear_infinite] items-center gap-14 group-hover:[animation-play-state:paused]">
              {[...PARTNERS, ...PARTNERS].map((n, i) => (
                <img
                  key={n + i}
                  src={`/brands/trim/${n}.png`}
                  alt={i < PARTNERS.length ? n : ""}
                  aria-hidden={i >= PARTNERS.length}
                  className="h-9 w-auto max-w-[140px] object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
                />
              ))}
            </div>
          </div>
        </div>
      </Reveal>
  );
}
