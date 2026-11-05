"use client";

/* Događaji za GA4, Google Ads, Meta Pixel i Tag Manager. Šalju se samo ako je oznaka učitana,
 * a učitava se tek posle pristanka na kolačiće (components/Marketing.tsx) - bez pristanka ništa ne ide. */

export type TrackItem = { id: string; name: string; price?: number | null; quantity?: number; brand?: string | null; category?: string | null };

type Win = Window & {
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
  __jmMarketing?: { ga4: boolean; ads: boolean; gtm: boolean; meta: boolean; adsId: string; adsPurchaseLabel: string };
};

const CURRENCY = "RSD";

function ga4Items(items: TrackItem[]) {
  return items.map((i) => ({ item_id: i.id, item_name: i.name, price: i.price ?? undefined, quantity: i.quantity ?? 1, item_brand: i.brand ?? undefined, item_category: i.category ?? undefined }));
}

function send(event: string, params: Record<string, unknown>, meta?: { name: string; params: Record<string, unknown> }) {
  if (typeof window === "undefined") return;
  const w = window as Win;
  const m = w.__jmMarketing;
  if (!m) return;
  if ((m.ga4 || m.ads) && w.gtag) w.gtag("event", event, params);
  if (m.gtm && w.dataLayer) {
    w.dataLayer.push({ ecommerce: null });
    w.dataLayer.push({ event, ecommerce: params });
  }
  if (m.meta && w.fbq && meta) w.fbq("track", meta.name, meta.params);
}

const sum = (items: TrackItem[]) => items.reduce((s, i) => s + (i.price ?? 0) * (i.quantity ?? 1), 0);

export function trackViewItem(item: TrackItem) {
  send("view_item", { currency: CURRENCY, value: item.price ?? 0, items: ga4Items([item]) }, { name: "ViewContent", params: { content_ids: [item.id], content_name: item.name, content_type: "product", value: item.price ?? 0, currency: CURRENCY } });
}

export function trackAddToCart(item: TrackItem) {
  const value = sum([item]);
  send("add_to_cart", { currency: CURRENCY, value, items: ga4Items([item]) }, { name: "AddToCart", params: { content_ids: [item.id], content_name: item.name, content_type: "product", value, currency: CURRENCY } });
}

export function trackBeginCheckout(items: TrackItem[], value: number) {
  send("begin_checkout", { currency: CURRENCY, value, items: ga4Items(items) }, { name: "InitiateCheckout", params: { content_ids: items.map((i) => i.id), num_items: items.reduce((s, i) => s + (i.quantity ?? 1), 0), value, currency: CURRENCY } });
}

export function trackPurchase(orderNumber: string, items: TrackItem[], value: number, shipping = 0) {
  send("purchase", { transaction_id: orderNumber, currency: CURRENCY, value, shipping, items: ga4Items(items) }, { name: "Purchase", params: { content_ids: items.map((i) => i.id), content_type: "product", value, currency: CURRENCY } });
  // Google Ads konverzija kupovine
  const w = window as Win;
  const m = w.__jmMarketing;
  if (m?.ads && m.adsPurchaseLabel && w.gtag) {
    w.gtag("event", "conversion", { send_to: `${m.adsId}/${m.adsPurchaseLabel}`, value, currency: CURRENCY, transaction_id: orderNumber });
  }
}

/** Poslat upit (ponuda, servis, kontakt, subvencije) */
export function trackLead(type: string, productName?: string | null) {
  send("generate_lead", { lead_type: type, item_name: productName ?? undefined }, { name: "Lead", params: { content_category: type, content_name: productName ?? undefined } });
}
