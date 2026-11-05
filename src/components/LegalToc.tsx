"use client";

import { useEffect, useState } from "react";

/* Sadržaj pravne strane: prati skrol i ističe poglavlje koje se trenutno čita. */
export default function LegalToc({ items }: { items: { id: string; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);

  return (
    <ol className="mt-4 space-y-1">
      {items.map((it, i) => {
        const on = it.id === active;
        return (
          <li key={it.id}>
            <a
              href={`#${it.id}`}
              aria-current={on ? "true" : undefined}
              className={`flex items-center gap-3 rounded-[10px] px-2.5 py-2 text-[13px] transition-colors ${on ? "bg-canvas font-medium text-ink" : "text-mist hover:text-ink"}`}
            >
              <span
                className={`grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-medium tabular-nums transition-colors ${on ? "bg-[#e02a33] text-white" : "bg-canvas text-mist"}`}
              >
                {i + 1}
              </span>
              <span className="truncate">{it.title}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}
