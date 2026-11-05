import Link from "next/link";

/* Koraci kupovine iznad korpe i porudžbine: 1 Korpa, 2 Podaci i isporuka, 3 Potvrda. Prođeni korak je link nazad. */
const KORACI = [
  { naziv: "Korpa", href: "/korpa" },
  { naziv: "Podaci i isporuka", href: "/porudzbina" },
  { naziv: "Potvrda", href: null },
];

/** dark: koraci na tamnoj traci (CheckoutHero) */
export default function Koraci({ aktivan, dark = false }: { aktivan: 0 | 1 | 2; dark?: boolean }) {
  return (
    <ol aria-label="Koraci kupovine" className="flex items-center gap-2 text-[13px] sm:gap-3 sm:text-[14px]">
      {KORACI.map((k, i) => {
        const prodjen = i < aktivan;
        const sadrzaj = (
          <>
            <span
              className={`grid size-7 shrink-0 place-items-center rounded-full text-[13px] font-medium leading-none tabular-nums ${
                i === aktivan ? "bg-[#e02a33] text-white" : prodjen ? (dark ? "bg-white text-ink" : "bg-ink text-white") : dark ? "bg-white/5 text-white/50 ring-1 ring-white/20" : "bg-paper text-mist ring-1 ring-line"
              }`}
            >
              {prodjen ? (
                <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="m2.5 6.2 2.3 2.3 4.7-5" />
                </svg>
              ) : (
                i + 1
              )}
            </span>
            <span className={`${i === aktivan ? `font-medium ${dark ? "text-white" : "text-ink"}` : `hidden sm:inline ${dark ? "text-white/55" : "text-mist"}`}`}>{k.naziv}</span>
          </>
        );
        return (
          <li key={k.naziv} aria-current={i === aktivan ? "step" : undefined} className="flex items-center gap-2 sm:gap-3">
            {prodjen && k.href ? (
              <Link href={k.href} className="flex items-center gap-2 transition hover:opacity-75">
                {sadrzaj}
              </Link>
            ) : (
              <span className="flex items-center gap-2">{sadrzaj}</span>
            )}
            {i < KORACI.length - 1 && <span aria-hidden className={`h-px w-6 sm:w-10 ${prodjen ? (dark ? "bg-white" : "bg-ink") : dark ? "bg-white/20" : "bg-line"}`} />}
          </li>
        );
      })}
    </ol>
  );
}
