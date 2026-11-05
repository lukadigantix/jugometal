"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { MarketingConfig } from "@/lib/marketing";

/* Marketing oznake (Podešavanja → Marketing) i traka za kolačiće.
 * Ništa se ne učitava dok posetilac ne izabere: GA4 tek uz pristanak na statistiku, Meta Pixel i Google Ads uz pristanak na marketing,
 * Tag Manager uz bilo koji pristanak (Google Consent Mode mu javlja šta sme). Izbor se pamti u pregledaču; menja se iz podnožja
 * („Podešavanja kolačića“). Bez upisane oznake u adminu traka se ne prikazuje. */

type Consent = { statistics: boolean; marketing: boolean; at: string };
const KEY = "jugometal-kolacici";
export const OPEN_CONSENT_EVENT = "jm-kolacici";

type Win = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[]; loaded?: boolean; version?: string; push?: unknown };
  _fbq?: unknown;
  __jmMarketing?: { ga4: boolean; ads: boolean; gtm: boolean; meta: boolean; adsId: string; adsPurchaseLabel: string };
};

function readConsent(): Consent | null {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    return raw && typeof raw.statistics === "boolean" && typeof raw.marketing === "boolean" ? raw : null;
  } catch {
    return null;
  }
}

function loadScript(id: string, src: string) {
  if (document.getElementById(id)) return;
  const s = document.createElement("script");
  s.id = id;
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

function consentState(c: Consent) {
  return {
    analytics_storage: c.statistics ? "granted" : "denied",
    ad_storage: c.marketing ? "granted" : "denied",
    ad_user_data: c.marketing ? "granted" : "denied",
    ad_personalization: c.marketing ? "granted" : "denied",
  };
}

/** Učitava oznake za dati pristanak; može se zvati više puta (već učitano se preskače) */
function apply(cfg: MarketingConfig, c: Consent) {
  const w = window as Win;
  w.dataLayer = w.dataLayer || [];
  if (!w.gtag) {
    w.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      w.dataLayer!.push(arguments);
    };
    w.gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
  }
  w.gtag("consent", "update", consentState(c));

  const state = w.__jmMarketing ?? { ga4: false, ads: false, gtm: false, meta: false, adsId: cfg.googleAdsId, adsPurchaseLabel: cfg.googleAdsPurchaseLabel };
  const ga4 = !!cfg.ga4Id && c.statistics;
  const ads = !!cfg.googleAdsId && c.marketing;

  if ((ga4 && !state.ga4) || (ads && !state.ads)) {
    loadScript("jm-gtag", `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4 ? cfg.ga4Id : cfg.googleAdsId)}`);
    if (!state.ga4 && !state.ads) w.gtag("js", new Date());
    if (ga4 && !state.ga4) w.gtag("config", cfg.ga4Id);
    if (ads && !state.ads) w.gtag("config", cfg.googleAdsId);
  }
  if (cfg.gtmId && (c.statistics || c.marketing) && !state.gtm) {
    w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    loadScript("jm-gtm", `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(cfg.gtmId)}`);
    state.gtm = true;
  }
  if (cfg.metaPixelId && c.marketing && !state.meta) {
    // standardni Meta Pixel kod
    if (!w.fbq) {
      const n = function (...args: unknown[]) {
        const self = n as unknown as { callMethod?: (...a: unknown[]) => void; queue: unknown[] };
        if (self.callMethod) self.callMethod(...args);
        else self.queue.push(args);
      } as unknown as NonNullable<Win["fbq"]>;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      w.fbq = n;
      if (!w._fbq) w._fbq = n;
    }
    loadScript("jm-fbq", "https://connect.facebook.net/en_US/fbevents.js");
    w.fbq!("init", cfg.metaPixelId);
    w.fbq!("track", "PageView");
    state.meta = true;
  }
  if (state.meta && !c.marketing) w.fbq?.("consent", "revoke");
  if (state.meta && c.marketing) w.fbq?.("consent", "grant");

  state.ga4 = state.ga4 || ga4;
  state.ads = state.ads || ads;
  // posle povlačenja pristanka događaji se više ne šalju (skripte ostaju do osvežavanja strane)
  w.__jmMarketing = { ...state, ga4: state.ga4 && c.statistics, ads: state.ads && c.marketing, meta: state.meta && c.marketing, gtm: state.gtm && (c.statistics || c.marketing) };
}

export default function Marketing({ config }: { config: MarketingConfig }) {
  const enabled = !!(config.ga4Id || config.googleAdsId || config.gtmId || config.metaPixelId);
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [statistics, setStatistics] = useState(true);
  const [marketing, setMarketing] = useState(true);
  const pathname = usePathname();
  const firstPath = useRef(true);

  useEffect(() => {
    if (!enabled) return;
    const c = readConsent();
    if (c) {
      apply(config, c);
      setStatistics(c.statistics);
      setMarketing(c.marketing);
    } else setOpen(true);
    const reopen = () => {
      const cur = readConsent();
      if (cur) {
        setStatistics(cur.statistics);
        setMarketing(cur.marketing);
      }
      setDetails(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, [enabled, config]);

  // prelazak na drugu stranu bez osvežavanja: pregled strane za GA4 i Meta
  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
      return;
    }
    const w = window as Win;
    const m = w.__jmMarketing;
    if (!m) return;
    if (m.ga4 && w.gtag) w.gtag("event", "page_view", { page_path: pathname, page_location: window.location.href, page_title: document.title });
    if (m.meta && w.fbq) w.fbq("track", "PageView");
  }, [pathname]);

  const save = useCallback(
    (c: Omit<Consent, "at">) => {
      const full = { ...c, at: new Date().toISOString() };
      try {
        localStorage.setItem(KEY, JSON.stringify(full));
      } catch {
        /* privatni režim - izbor važi do zatvaranja strane */
      }
      apply(config, full);
      setOpen(false);
      setDetails(false);
    },
    [config],
  );

  if (!enabled || !open) return null;

  const toggle = "h-5 w-5 shrink-0 accent-white";

  return (
    <div role="dialog" aria-label="Kolačići" className="fixed inset-x-3 bottom-3 z-[60] md:inset-x-auto md:bottom-6 md:right-6 md:w-[440px]">
      <div className="rounded-[4px] bg-ink p-5 text-paper shadow-2xl md:p-6">
        <p className="text-[16px] font-medium">Kolačići na sajtu</p>
        <p className="mt-2 text-[13px] leading-relaxed text-paper/75">
          Koristimo neophodne kolačiće za rad sajta i korpe, a uz vaš pristanak i kolačiće za statistiku poseta i prikaz oglasa.{" "}
          <Link href="/politika-privatnosti" className="underline underline-offset-2 hover:text-paper">
            Politika privatnosti
          </Link>
        </p>

        {details && (
          <div className="mt-4 space-y-3 border-t border-paper/15 pt-4 text-[13px]">
            <label className="flex items-start gap-3 opacity-70">
              <input type="checkbox" checked disabled className={toggle} />
              <span>
                <span className="block font-medium text-paper">Neophodni</span>
                Korpa i osnovni rad sajta. Uvek uključeni.
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3">
              <input type="checkbox" checked={statistics} onChange={(e) => setStatistics(e.target.checked)} className={toggle} />
              <span>
                <span className="block font-medium text-paper">Statistika</span>
                <span className="text-paper/70">Google Analytics - koliko poseta ima i koje strane se gledaju.</span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3">
              <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className={toggle} />
              <span>
                <span className="block font-medium text-paper">Marketing</span>
                <span className="text-paper/70">Meta (Facebook, Instagram) i Google oglasi - merenje i prikaz oglasa.</span>
              </span>
            </label>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          {details ? (
            <button type="button" onClick={() => save({ statistics, marketing })} className="rounded-full bg-paper px-5 py-2.5 text-[13px] text-ink transition-colors hover:bg-canvas">
              Sačuvaj izbor
            </button>
          ) : (
            <button type="button" onClick={() => save({ statistics: true, marketing: true })} className="rounded-full bg-paper px-5 py-2.5 text-[13px] text-ink transition-colors hover:bg-canvas">
              Prihvati sve
            </button>
          )}
          <button type="button" onClick={() => save({ statistics: false, marketing: false })} className="rounded-full border border-paper/40 px-5 py-2.5 text-[13px] transition-colors hover:border-paper">
            Samo neophodni
          </button>
          {!details && (
            <button type="button" onClick={() => setDetails(true)} className="px-2 py-2.5 text-[13px] text-paper/75 underline-offset-2 hover:text-paper hover:underline">
              Podešavanja
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
