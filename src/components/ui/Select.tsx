"use client";

import { useEffect, useId, useRef, useState } from "react";

/*
  Padajući meni sajta (umesto sistemskog <select>): polje u stilu forme, panel sa opcijama,
  izabrana opcija sa crvenom kvačicom, opciono uzorak boje i sitan opis.
  Tastatura: strelice/Home/End biraju, Enter/razmak potvrđuje, Esc zatvara, Tab izlazi. Klik van zatvara.
*/

function Swatch({ color }: { color?: string }) {
  return color ? <span aria-hidden className="size-4 shrink-0 rounded-full ring-1 ring-black/15" style={{ background: color }} /> : null;
}

export type SelectOption = { value: string; label: string; hint?: string; swatch?: string };

export default function Select({
  value,
  onChange,
  options,
  placeholder = "Izaberite",
  label,
  name,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  /** vidljiv naslov polja (povezan preko aria-labelledby) */
  label?: string;
  /** za slanje forme bez JS-a (skriveno polje) */
  name?: string;
  className?: string;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const selected = options.find((o) => o.value === value);

  const show = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === value)));
    setOpen(true);
  };
  const close = (focus = true) => {
    setOpen(false);
    if (focus) btn.current?.focus();
  };
  const pick = (i: number) => {
    onChange(options[i].value);
    close();
  };

  // klik van menija zatvara; fokus prelazi na listu kad se otvori
  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => list.current?.focus());
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  // aktivna opcija uvek u vidnom polju liste
  useEffect(() => {
    if (open) list.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const onButtonKey = (e: React.KeyboardEvent) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      show();
    }
  };
  const onListKey = (e: React.KeyboardEvent) => {
    const last = options.length - 1;
    const moves: Record<string, () => void> = {
      ArrowDown: () => setActive((a) => Math.min(last, a + 1)),
      ArrowUp: () => setActive((a) => Math.max(0, a - 1)),
      Home: () => setActive(0),
      End: () => setActive(last),
      Enter: () => pick(active),
      " ": () => pick(active),
      Escape: () => close(),
    };
    if (e.key === "Tab") return close(false);
    const fn = moves[e.key];
    if (fn) {
      e.preventDefault();
      fn();
    }
  };

  return (
    <div ref={root} className={`relative ${className}`}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        ref={btn}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={label ? `${id}-label ${id}-value` : undefined}
        onClick={() => (open ? close() : show())}
        onKeyDown={onButtonKey}
        className={`flex h-12 w-full items-center gap-3 rounded-[10px] border bg-canvas px-4 text-left text-[15px] text-ink outline-none transition ${
          open ? "border-ink bg-paper" : "border-line hover:border-mist/60 focus-visible:border-ink focus-visible:bg-paper"
        }`}
      >
        {label && (
          <span id={`${id}-label`} className="sr-only">
            {label}
          </span>
        )}
        <Swatch color={selected?.swatch} />
        <span id={`${id}-value`} className={`min-w-0 flex-1 truncate ${selected ? "" : "text-mist/70"}`}>
          {selected ? selected.label : placeholder}
          {selected?.hint && <span className="ml-1.5 text-mist">{selected.hint}</span>}
        </span>
        <svg viewBox="0 0 12 12" aria-hidden className={`size-3 shrink-0 text-mist transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
          <path d="m2.5 4.5 3.5 3.5 3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <ul
        ref={list}
        id={`${id}-list`}
        role="listbox"
        tabIndex={-1}
        aria-activedescendant={open ? `${id}-o${active}` : undefined}
        onKeyDown={onListKey}
        className={`absolute inset-x-0 top-full z-30 mt-2 max-h-72 origin-top overflow-y-auto rounded-[12px] bg-paper p-1.5 shadow-[0_20px_40px_-20px_rgba(24,25,27,0.35)] ring-1 ring-line outline-none transition duration-150 ${
          open ? "visible scale-100 opacity-100" : "invisible scale-[0.98] opacity-0"
        }`}
      >
        {options.map((o, i) => {
          const isSel = o.value === value;
          return (
            <li
              key={o.value}
              id={`${id}-o${i}`}
              data-i={i}
              role="option"
              aria-selected={isSel}
              onPointerEnter={() => setActive(i)}
              onClick={() => pick(i)}
              className={`flex cursor-pointer items-center gap-3 rounded-[8px] px-3 py-2.5 text-[14px] transition-colors ${i === active ? "bg-canvas" : ""}`}
            >
              <Swatch color={o.swatch} />
              <span className="min-w-0 flex-1 truncate">
                <span className={isSel ? "font-medium" : ""}>{o.label}</span>
                {o.hint && <span className="ml-1.5 text-mist">{o.hint}</span>}
              </span>
              {isSel && (
                <svg viewBox="0 0 12 12" aria-hidden className="size-3.5 shrink-0 text-[#e02a33]">
                  <path d="m2.5 6.2 2.3 2.3 4.7-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
