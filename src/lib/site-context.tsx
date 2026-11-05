"use client";

import { createContext, useContext } from "react";
import company from "@/data/company.json";
import type { SiteInfo } from "./site-info";

/* Kontakt podaci firme za klijentske komponente (korpa, kontakt, delovi…). Layout ih jednom učita iz
 * Podešavanja → Sajt (lib/site-info.ts) i prosledi ovde - nigde na sajtu nema ručno upisanih adresa i telefona. */

const SiteContext = createContext<SiteInfo | null>(null);

export function SiteProvider({ info, children }: { info: SiteInfo; children: React.ReactNode }) {
  return <SiteContext.Provider value={info}>{children}</SiteContext.Provider>;
}

// Rezerva kad provajder nije tu (npr. Next u razvoju proverava segment strane bez layout-a): poslednji poznati podaci iz src/data
const hq = company.locations[0];
const FALLBACK: SiteInfo = {
  description: "",
  social: { facebook: company.social.facebook, instagram: company.social.instagram, twitter: "", tiktok: "" },
  contact: { name: company.legalName, street: hq.street, city: `${hq.postalCode} ${hq.city}`, phone: hq.phone, phoneParts: hq.phoneParts ?? "", email: company.email, pib: "", mb: "" },
  workingHours: [],
};

export function useSite(): SiteInfo {
  return useContext(SiteContext) ?? FALLBACK;
}

/** "035/312-391" → "tel:035312391" */
export const tel = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

/** Grad bez poštanskog broja: "35210 Svilajnac" → "Svilajnac" */
export const cityName = (city: string) => city.replace(/^\s*\d{4,6}\s*/, "").trim() || city;

/** Upit za Google mape: naziv firme + adresa (Google ima pin firme) */
export const mapQuery = (c: SiteInfo["contact"]) => [c.name, c.street, cityName(c.city)].filter(Boolean).join(", ");

/** Prodajno-servisni centar, Kneza Miloša 81, Svilajnac (OpenStreetMap) - pin na mapama. Ako se adresa promeni, promeniti i ovu tačku. */
export const MAP_POINT = { longitude: 21.17495, latitude: 44.22831 };

/** Link za „Uputstva za put" u Google mapama */
export const mapLink = (q: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
