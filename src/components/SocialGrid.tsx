"use client";

import Reveal from "./Reveal";
import { ArrowRight } from "./graphics";
import { t } from "./copy";
import { SocialIcon } from "./FooterView";
import { useSite } from "@/lib/site-context";

/* Njive. Mašine. Ljudi. - zid društvenih mreža na početnoj:
 * tamna ploča; levo naslov u tri reda, tekst i kartice profila (Instagram, Facebook iz admina - Podešavanja → Sajt),
 * desno mozaik od 5 fotografija (jedna velika, četiri manje); klik vodi na Instagram. Natpis je alt tekst. */

const NETWORKS = [
  { key: "instagram", name: "Instagram" },
  { key: "facebook", name: "Facebook" },
] as const;

/** „https://www.instagram.com/jugometal_doo/" → „@jugometal_doo"; facebook → „/jugometal" */
function handle(url: string, key: string) {
  const path = url.replace(/^https?:\/\/(www\.)?[^/]+\/?/, "").replace(/\/+$/, "").split(/[/?#]/)[0];
  if (!path) return url.replace(/^https?:\/\/(www\.)?/, "");
  return key === "instagram" ? `@${path}` : `/${path}`;
}

// mozaik na desktopu: mreža 6×6 - velika levo gore, dve male desno, dve srednje dole
const SPANS = [
  "col-span-2 aspect-[4/3] lg:col-span-4 lg:row-span-4 lg:aspect-auto",
  "aspect-square lg:col-span-2 lg:row-span-2 lg:aspect-auto",
  "aspect-square lg:col-span-2 lg:row-span-2 lg:aspect-auto",
  "aspect-square lg:col-span-3 lg:row-span-2 lg:aspect-auto",
  "aspect-square lg:col-span-3 lg:row-span-2 lg:aspect-auto",
];

function Tile({ src, caption, span, profile }: { src: string; caption: string; span: string; profile: string | null }) {
  const inner = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- fotografija iz public */}
      <img src={src} alt={caption} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-brand)] group-hover/tile:scale-[1.06]" />
      <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover/tile:bg-black/20" />
      {profile && (
        <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full border border-white/25 bg-white/15 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover/tile:opacity-100">
          <SocialIcon name="instagram" />
        </span>
      )}
    </>
  );
  const cls = `group/tile relative block overflow-hidden rounded-[10px] bg-white/5 ${span}`;
  return profile ? (
    <a href={profile} target="_blank" rel="noopener noreferrer" aria-label={`${caption}, pogledajte na Instagramu`} className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

export default function SocialGrid() {
  const { social } = useSite();
  const profiles = NETWORKS.filter((n) => social[n.key]);
  const words = t.social.title.split(/\.\s*/).filter(Boolean);

  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-9 md:pb-24">
      <Reveal>
        <div className="grid overflow-hidden rounded-[12px] bg-[#18191b] text-white lg:grid-cols-[1fr_1.1fr]">
          {/* tekst i profili */}
          <div className="flex flex-col justify-center p-6 md:p-10 xl:p-14">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#e02a33]">Pratite nas</p>
            <h2 className="mt-4 space-y-1 text-[34px] font-medium leading-[1.12] tracking-[-0.025em] md:space-y-2 md:text-[46px]">
              {words.map((w) => (
                <span key={w} className="block">
                  {w}
                  <span className="text-[#e02a33]">.</span>
                </span>
              ))}
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-white/60">{t.social.body}</p>

            {profiles.length > 0 && (
              <div className={`mt-8 grid gap-3 ${profiles.length > 1 ? "sm:grid-cols-2" : ""} md:mt-10`}>
                {profiles.map((n) => (
                  <a
                    key={n.key}
                    href={social[n.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-[10px] border border-white/10 bg-white/[0.04] p-4 transition-colors duration-300 hover:border-white/25 hover:bg-white/[0.08]"
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white text-ink transition-colors duration-300 group-hover:bg-[#e02a33] group-hover:text-white">
                      <SocialIcon name={n.key} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[11px] uppercase tracking-[0.16em] text-white/45">{n.name}</span>
                      <span className="mt-0.5 block truncate text-[15px] font-medium">{handle(social[n.key], n.key)}</span>
                    </span>
                    <ArrowRight className="h-3 w-3.5 shrink-0 -rotate-45 text-white/50 transition-all duration-300 group-hover:rotate-0 group-hover:text-white" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* mozaik fotografija */}
          <div className="grid grid-cols-2 gap-3 p-3 pt-0 md:gap-4 md:p-4 md:pt-0 lg:min-h-[620px] lg:grid-cols-6 lg:grid-rows-6 lg:p-4 lg:pl-0 lg:pt-4">
            {t.social.gallery.map((g, i) => (
              <Tile key={g.src} src={g.src} caption={g.caption} span={SPANS[i] ?? "aspect-square"} profile={social.instagram || null} />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
