"use client";

import { useState } from "react";
import { Bag } from "./graphics";
import { addToCart } from "@/lib/cart";
import { trackAddToCart } from "@/lib/track";

/* Dugme "U korpu": dodaje deo i kratko pokaže kvačicu. */
/** tone: „accent" (podrazumevano), „dark" (tamno, na hover crveno) ili „light" (belo, za tamnu podlogu) */
export default function AddToCart({ id, label = "U korpu", name, price, className = "", tone = "accent" }: { id: string; label?: string; name: string; price?: number | null; className?: string; tone?: "accent" | "dark" | "light" }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label={`${label}: ${name}`}
      onClick={() => {
        addToCart(id, 1, name);
        trackAddToCart({ id, name, price, quantity: 1 });
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full px-5 py-2.5 text-[13px] transition-colors duration-150 ease-[var(--ease-brand)] ${
        tone === "dark" ? "bg-[#18191b] text-white hover:bg-[#e02a33]" : tone === "light" ? "bg-white text-[#18191b] hover:text-[#e02a33]" : "bg-accent text-accent-contrast hover:bg-accent-soft"
      } ${className}`}
    >
      {done ? (
        <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden>
          <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ) : (
        <Bag className="h-4 w-4" />
      )}
      {done ? "Dodato" : label}
    </button>
  );
}
