"use client";

import { useSyncExternalStore } from "react";

/* Korpa: { id dela -> količina } u localStorage, deljena između svih komponenti (useSyncExternalStore).
 * Naziv, cena i dostupnost se ne pamte - korpa ih uvek traži od servera (POST /shop/cart/quote),
 * pa stara cena ne može da ostane zapamćena. */

export type CartLine = { id: string; qty: number };
const KEY = "jugometal-korpa";
const MAX_QTY = 99;
const EMPTY: CartLine[] = [];
// id iz baze (uuid); stari id-jevi iz parts.json ("imt-180") se odbacuju
const VALID_ID = /^[0-9a-f-]{36}$/i;

let state: CartLine[] | null = null;
const listeners = new Set<() => void>();
const toastListeners = new Set<(name: string) => void>();

function read(): CartLine[] {
  if (state) return state;
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    state = Array.isArray(raw) ? raw.filter((l) => l && typeof l.id === "string" && VALID_ID.test(l.id) && l.qty > 0) : [];
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

export function useCart() {
  const lines = useSyncExternalStore(subscribe, read, () => EMPTY);
  const count = lines.reduce((n, l) => n + l.qty, 0);
  return { lines, count };
}

export function addToCart(id: string, qty = 1, name?: string) {
  const lines = read();
  const hit = lines.find((l) => l.id === id);
  write(hit ? lines.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l)) : [...lines, { id, qty: Math.min(MAX_QTY, qty) }]);
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
