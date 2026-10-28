import company from "@/data/company.json";
import { abs } from "./site";

/* schema.org objekti. Radno vreme i PIB nisu poznati - ne upisujemo ih dok ih klijent ne potvrdi. */
const address = (l: (typeof company.locations)[number]) => ({
  "@type": "PostalAddress",
  streetAddress: l.street,
  postalCode: l.postalCode,
  addressLocality: l.city,
  addressCountry: "RS",
});

export const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": abs("/#organizacija"),
  name: company.legalName,
  alternateName: "Jugometal",
  url: abs("/"),
  logo: abs("/logo.png"),
  email: company.email,
  telephone: company.locations[0].phone,
  foundingDate: String(company.founded),
  sameAs: [company.social.facebook, company.social.instagram],
  address: address(company.locations[0]),
  department: company.locations.map((l) => ({
    "@type": "AutomotiveBusiness",
    name: l.name,
    telephone: l.phone,
    address: address(l),
    url: abs("/kontakt"),
  })),
};

export const breadcrumb = (items: [string, string][]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(path) })),
});

export const product = (p: { name: string; image?: string; description?: string; brand?: string; sku?: string; path: string; price?: number; currency?: string }) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: p.name,
  ...(p.image ? { image: abs(p.image) } : {}),
  ...(p.description ? { description: p.description } : {}),
  ...(p.brand ? { brand: { "@type": "Brand", name: p.brand } } : {}),
  ...(p.sku ? { sku: p.sku, mpn: p.sku } : {}),
  url: abs(p.path),
  ...(p.price
    ? { offers: { "@type": "Offer", price: p.price, priceCurrency: p.currency ?? "RSD", url: abs(p.path), seller: { "@id": abs("/#organizacija") } } }
    : {}),
});
