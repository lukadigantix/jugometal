"use client";

import { useState } from "react";
import { Bag } from "./graphics";
import { addToCart } from "@/lib/cart";

/* Dugme "U korpu": dodaje deo i kratko pokaže kvačicu. */
export default function AddToCart({ id, label = "U korpu", name, className = "" }: { id: string; label?: string; name: string; className?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label={`${label}: ${name}`}
      onClick={() => {
        addToCart(id);
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-accent px-5 py-2.5 text-[13px] text-accent-contrast transition-colors duration-150 ease-[var(--ease-brand)] hover:bg-accent-soft ${className}`}
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
