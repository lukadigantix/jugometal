"use client";

import { useSyncExternalStore } from "react";
import { searchIndex } from "@/data/featured-parts";

/* Korpa: { id dela -> količina } u localStorage, deljena između svih komponenti
 * (useSyncExternalStore). Podaci o delu (naziv, cena, slika) se uvek čitaju iz parts.json,
 * pa stara cena ne može da ostane zapamćena u korpi. */

export type CartLine = { id: string; qty: number };
const KEY = "jugometal-korpa";
const MAX_QTY = 99;
const EMPTY: CartLine[] = [];

let state: CartLine[] | null = null;
const listeners = new Set<() => void>();
const toastListeners = new Set<(name: string) => void>();

function read(): CartLine[] {
  if (state) return state;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    state = Array.isArray(raw) ? raw.filter((l) => l && typeof l.id === "string" && l.qty > 0) : [];
  } catch {
    state = [];
  }
  return state!;
}

function write(next: CartLine[]) {
  state = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* privatni režim - korpa važi do zatvaranja strane */
  }
  listeners.forEach((fn) => fn());
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) {
      state = null;
      listeners.forEach((fn) => fn());
    }
  });
}

const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const byId = new Map(searchIndex.map((p) => [p.id, p]));

export function useCart() {
  const lines = useSyncExternalStore(subscribe, read, () => EMPTY);
  const items = lines.flatMap((l) => {
    const p = byId.get(l.id);
    return p ? [{ ...p, qty: l.qty, total: p.priceRsd * l.qty }] : [];
  });
  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = items.reduce((n, i) => n + i.total, 0);
  return { items, count, subtotal };
}

export function addToCart(id: string, qty = 1) {
  const lines = read();
  const hit = lines.find((l) => l.id === id);
  write(hit ? lines.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l)) : [...lines, { id, qty }]);
  const name = byId.get(id)?.name;
  if (name) toastListeners.forEach((fn) => fn(name));
}

export function setQty(id: string, qty: number) {
  if (qty <= 0) return removeFromCart(id);
  write(read().map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, Math.round(qty)) } : l)));
}

export function removeFromCart(id: string) {
  write(read().filter((l) => l.id !== id));
}

export function clearCart() {
  write([]);
}

export function onAdded(fn: (name: string) => void) {
  toastListeners.add(fn);
  return () => {
    toastListeners.delete(fn);
  };
}
