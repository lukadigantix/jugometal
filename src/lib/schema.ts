import company from "@/data/company.json";
import { abs } from "./site";
import type { SiteInfo } from "./site-info";

/* schema.org objekti. Naziv, adresa, telefon, e-mail i mreže firme dolaze iz admina (Podešavanja → Sajt). */
export const organization = (site: SiteInfo) => {
  const c = site.contact;
  const m = /^\s*(\d{4,6})\s+(.+)$/.exec(c.city);
  const address = {
    "@type": "PostalAddress",
    streetAddress: c.street,
    ...(m ? { postalCode: m[1], addressLocality: m[2] } : { addressLocality: c.city }),
    addressCountry: "RS",
  };
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": abs("/#organizacija"),
    name: c.name || company.legalName,
    alternateName: "Jugometal",
    url: abs("/"),
    logo: abs("/logo.png"),
    ...(c.email ? { email: c.email } : {}),
    ...(c.phone ? { telephone: c.phone } : {}),
    foundingDate: String(company.founded),
    sameAs: Object.values(site.social).filter(Boolean),
    address,
    ...(c.pib ? { taxID: c.pib } : {}),
    department: [{ "@type": "AutomotiveBusiness", name: c.name || company.legalName, ...(c.phone ? { telephone: c.phone } : {}), address, url: abs("/kontakt") }],
  };
};

export const breadcrumb = (items: [string, string][]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })),
});

const AVAILABILITY: Record<string, string> = {
  na_stanju: "https://schema.org/InStock",
  po_porudzbini: "https://schema.org/BackOrder",
  nema: "https://schema.org/OutOfStock",
};

/** Proizvod sa cenom (deo, ATV). Traktori i mašine su „cena na upit": bez ponude (offers) Google takav
 *  Product prijavljuje kao neispravan, pa za njih ide samo BreadcrumbList. */
export const product = (p: { name: string; image?: string; description?: string; brand?: string; sku?: string; path: string; price?: number; currency?: string; stock?: string }) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: p.name,
  ...(p.image ? { image: abs(p.image) } : {}),
  ...(p.description ? { description: p.description } : {}),
  ...(p.brand ? { brand: { "@type": "Brand", name: p.brand } } : {}),
  ...(p.sku ? { sku: p.sku, mpn: p.sku } : {}),
  url: abs(p.path),
  ...(p.price
    ? {
        offers: {
          "@type": "Offer",
          price: p.price,
          priceCurrency: p.currency ?? "RSD",
          itemCondition: "https://schema.org/NewCondition",
          ...(p.stock && AVAILABILITY[p.stock] ? { availability: AVAILABILITY[p.stock] } : {}),
          url: abs(p.path),
          seller: { "@id": abs("/#organizacija") },
        },
      }
    : {}),
});
