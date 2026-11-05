"use client";

import { useEffect, useState } from "react";
import { postJson } from "./api";
import type { CartLine } from "./cart";

/* Zajedničko za korpu (/korpa) i porudžbinu (/porudzbina): obračun sa backenda (POST /shop/cart/quote)
 * i tipovi. Stavke korpe su u localStorage (lib/cart.ts); naziv, cena i dostupnost uvek dolaze sa servera. */

export type Delivery = "adresa" | "preuzimanje";
export type Payment = "pouzece" | "uplata_na_racun" | "pri_preuzimanju";

export type QuoteItem = {
  productId: string;
  quantity: number;
  available: boolean;
  reason: string | null;
  unitPrice: number;
  regularPrice?: number;
  totalPrice: number;
  product: { id: string; name: string; code: string | null; brand: string | null; image: string | null; path: string | null } | null;
};

export type OrderRules = {
  shippingCost: number;
  freeShippingFrom: number;
  minOrderAmount: number;
  allowPickup: boolean;
  allowBankTransfer: boolean;
  confirmationNote: string;
};

export type Quote = { items: QuoteItem[]; subtotal: number; shipping: number; total: number; rules: OrderRules };

/** Crvena iz logoa - glavna dugmad i naglasci u korpi */
export const BRAND = "#e02a33";

export const PAYMENT_LABEL: Record<Payment, string> = {
  pouzece: "Pouzećem",
  uplata_na_racun: "Uplata na račun",
  pri_preuzimanju: "Pri preuzimanju",
};

/** Obračun korpe sa servera; ponovo se traži kad se promene stavke ili način isporuke. */
export function useQuote(lines: CartLine[], delivery: Delivery = "adresa") {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const key = lines.map((l) => `${l.id}:${l.qty}`).join(",");

  useEffect(() => {
    if (!lines.length) return;
    let live = true;
    const t = setTimeout(() => {
      setLoading(true);
      postJson<Quote>("/shop/cart/quote", { items: lines.map((l) => ({ productId: l.id, quantity: l.qty })), deliveryType: delivery })
        .then((q) => {
          if (!live) return;
          setQuote(q);
          setError("");
        })
        .catch((e: Error) => live && setError(e.message))
        .finally(() => live && setLoading(false));
    }, 150);
    return () => {
      live = false;
      clearTimeout(t);
    };
    // key opisuje stavke; lines se menja po referenci
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, delivery]);

  // prazna korpa nema obračun; samo stavke koje su još u korpi (obračun može da kasni za brisanjem)
  const current = lines.length ? quote : null;
  const items = (current?.items ?? []).filter((i) => lines.some((l) => l.id === i.productId));
  return { quote: current, items, error: lines.length ? error : "", loading: lines.length > 0 && loading };
}

/** Iznos kao „1.250" (bez valute) - za veliki zbir gde je „RSD" posebno */
export const amount = (n: number) => n.toLocaleString("sr-RS", { maximumFractionDigits: 0 });

/** Tekst za dostavu na adresu: cena iz pravila, besplatno iznad praga, ili dogovor telefonom */
export function shippingText(q: Quote | null, delivery: Delivery): { text: string; free: boolean } {
  if (delivery === "preuzimanje") return { text: "Besplatno", free: true };
  if (!q) return { text: "…", free: false };
  if (q.shipping > 0) return { text: `${amount(q.shipping)} RSD`, free: false };
  if (q.rules.freeShippingFrom > 0 && q.subtotal >= q.rules.freeShippingFrom) return { text: "Besplatno", free: true };
  return { text: "po dogovoru", free: false };
}
