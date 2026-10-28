"use client";

import Reveal from "./Reveal";
import { Chevron } from "./graphics";
import { t } from "./copy";

export default function SocialGrid() {
  const [a, b, c] = t.social.imgs;
  return (
    <section className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-9 md:pb-24">
      <div className="grid items-center gap-12 md:grid-cols-2">
        <Reveal>
          <h2 className="text-[34px] font-medium md:text-[40px]">{t.social.title}</h2>
          <p className="mt-6 max-w-md text-[14px] leading-relaxed text-mist">{t.social.body}</p>
          <a
            href={t.social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-4 inline-flex items-center gap-1 text-[14px]"
          >
            {t.social.link}
            <Chevron className="h-2.5 w-2.5 transition-transform duration-150 group-hover:translate-x-0.5" />
          </a>
        </Reveal>

        <div className="flex justify-end gap-4">
          <Reveal delay={100} className="w-[58%]">
            <div className="relative aspect-[3/4] overflow-hidden rounded-[4px] bg-canvas">
              <img
                src={a}
                alt="Njiva posle žetve"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-brand)] hover:scale-[1.02]"
              />
            </div>
          </Reveal>
          <div className="flex w-[38%] flex-col gap-4">
            <Reveal delay={220}>
              <div className="relative aspect-square overflow-hidden rounded-[4px] bg-canvas">
                <img
                  src={b}
                  alt="Traktor sa prikolicom bala"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-brand)] hover:scale-[1.02]"
                />
              </div>
            </Reveal>
            <Reveal delay={320}>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[4px] bg-canvas">
                <img
                  src={c}
                  alt="Traktor u oranju"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-[var(--ease-brand)] hover:scale-[1.02]"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
