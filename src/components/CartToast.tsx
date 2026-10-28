"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAdded } from "@/lib/cart";

/* Obaveštenje "Dodato u korpu" dole desno (na telefonu preko cele širine), nestaje posle 3,5 s. */
export default function CartToast() {
  const [name, setName] = useState<string | null>(null);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const off = onAdded((n) => {
      setName(n);
      clearTimeout(t);
      t = setTimeout(() => setName(null), 3500);
    });
    return () => {
      off();
      clearTimeout(t);
    };
  }, []);
  if (!name) return null;
  return (
    <div role="status" className="fixed inset-x-4 bottom-4 z-50 animate-[heroIn_.3s_ease-out_both] md:inset-x-auto md:right-6 md:w-[380px]">
      <div className="flex items-center gap-4 rounded-[4px] bg-ink p-4 text-paper shadow-[0_12px_40px_rgba(0,0,0,0.25)]">
        <div className="min-w-0 flex-1">
          <p className="text-[12px] uppercase tracking-[0.14em] text-paper/60">Dodato u korpu</p>
          <p className="mt-1 truncate text-[14px]">{name}</p>
        </div>
        <Link href="/korpa" className="shrink-0 rounded-full bg-paper px-4 py-2 text-[13px] text-ink">
          Korpa
        </Link>
      </div>
    </div>
  );
}
