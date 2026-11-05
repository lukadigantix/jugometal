# Jugometal - prodavnica

Javni sajt i online prodavnica za **jugometal.co.rs**: traktori, priključne mašine, Benda ATV, rezervni delovi
sa korpom i porudžbinom, akcije, servis, subvencije.

Next.js 16 (App Router, Cache Components, Turbopack), React 19, TypeScript, Tailwind 4.

| Projekat | Uloga | Lokalno |
|---|---|---|
| `jugometal` (ovaj) | prodavnica | http://localhost:3000 |
| `jugometal-admin` | admin panel | http://localhost:3002 |
| `jugometal-backend` | REST API, baza, mejlovi, slike (`/uploads`) | http://localhost:3005 |

## Pokretanje

```bash
npm install
npm run dev        # http://localhost:3000
```

Backend treba da radi (`jugometal-backend`, `npm run dev`). Ako ne radi, sajt se ipak otvara, sa
poslednjim izvozom podataka iz `src/data` (vidi „Podaci").

`.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3005/api/v1   # backend
REVALIDATE_SECRET=<isto kao SHOP_REVALIDATE_SECRET u backend .env>
```

## Skripte

| Komanda | Šta radi |
|---|---|
| `npm run dev` | razvojni server na 3000 |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | provera tipova |
| `npm run build:cpanel` | build za cPanel → `deploy/jugometal-cpanel.zip` (vidi `DEPLOY.md`) |
| `npm run clean` | briše `.next-cpanel` i `deploy` |

`build:cpanel` ide u poseban folder (`.next-cpanel`), pa `npm run dev` može da radi u isto vreme.

## Podaci

Sajt čita sve iz backenda (`GET /api/v1/shop/...`), uz keš pod oznakom `katalog`. Posle svake izmene u
adminu backend zove `POST /api/osvezi` (zaglavlje `x-revalidate-secret`), keš se briše i izmena se odmah
vidi na sajtu. Bez poziva keš ističe za 1 h.

| Šta | Izvor | Kod |
|---|---|---|
| Rezervni delovi (cene, stanje, slike, opis, tehnički podaci), grupe | `GET /shop/catalog` | `lib/catalog.ts`, `data/featured-parts.ts` |
| Slike traktora i mašina, logotipi i baneri brendova | `GET /shop/catalog` | `lib/media-context.tsx`, `lib/brands-context.tsx` |
| Akcije (strana Akcije, oznake na karticama) | `GET /shop/catalog`, `GET /shop/promotions` | `lib/promotions.ts` |
| Kontakt, radno vreme, mreže (header, footer, kontakt, schema.org) | `GET /shop/site` | `lib/site-info.ts`, `lib/site-context.tsx` |
| Hero slajder na početnoj | `GET /shop/slider` | `lib/slider.ts` |
| Ručni SEO naslovi i opisi | `GET /shop/seo` | `lib/seo.ts` |
| GA4, Google Ads, Meta Pixel, Tag Manager (tek posle pristanka na kolačiće) | `GET /shop/marketing` | `lib/marketing.ts`, `lib/track.ts` |
| Korpa (obračun) i porudžbina | `POST /shop/cart/quote`, `POST /shop/orders` | `lib/cart.ts`, `lib/checkout.ts` |
| Upiti sa formi (kontakt, servis, subvencije, ponuda) | `POST /shop/inquiries` | `lib/useInquiry.ts` |

**Još iz fajlova u `src/data`** (sledeći korak je prebacivanje na API, kao delovi):

- tekstovi i tehnički podaci traktora: `tractors.json`, `tractor-list.json`
- priključne mašine: `machine-list.json`, `implements.json`, `machines-catalog.json`
- Benda ATV (boje, cene, 360° kadrovi): `atv.ts`
- struktura menija i brendova: `catalog.json`; firma i lokacije: `company.json`

**Rezerva bez backenda:** ako API ne odgovara, katalog se uzima iz `src/data/parts.json`, kontakt iz
`company.json`, slajder iz `hero-slides.ts`, a keš traje samo par minuta. Zato build prolazi i bez interneta.

Korpa u `localStorage` pamti samo id i količinu; naziv, cena i dostupnost uvek dolaze sa servera.

## Struktura

```
src/
├── app/                 strane (App Router)
│   ├── traktori/        lista sa filterima, /[brand], /[brand]/[model]
│   ├── prikljucne-masine/  lista, /[category], /[category]/[product]
│   ├── rezervni-delovi/ prodavnica: lista, /[group], /[group]/[brand], /[group]/[brand]/[part]
│   ├── atv/             Benda ATV: /atv i /atv/[model] (360° prikaz 1000 R2)
│   ├── korpa/, porudzbina/   korpa i porudžbina
│   ├── akcije/, servis/, subvencije/, kontakt/, o-nama/, politika-privatnosti/, uslovi-koriscenja/
│   ├── api/osvezi/      brisanje keša kataloga (poziva backend)
│   └── sitemap.ts, robots.ts
├── components/
│   ├── catalog/CatalogKit.tsx   hero, filteri, traka, poziv - zajedničko za Traktore, Mašine, Prodavnicu
│   ├── ProductDetail.tsx        strana traktora i mašine (galerija, cena na upit, specifikacija, upit)
│   ├── PartPage.tsx             strana rezervnog dela
│   ├── OfferCard.tsx            kartica proizvoda (Akcije, traktori, mašine)
│   ├── Spin360.tsx              360° prikaz od niza fotografija
│   ├── ui/Select.tsx            padajući meni sajta
│   └── ...                      početna, header, mega meni, footer
├── data/                podaci (vidi gore) i redirects.json (301 sa starog sajta)
└── lib/                 API, keš, korpa, SEO, schema.org, marketing
public/                  slike (proizvodi, baneri, brendovi, ATV boje i 360° kadrovi), logo, opengraph
docs/                    BACKEND.md, SEO-MIGRACIJA.md, ISTRAZIVANJE.md, reference/
```

## Napomene

- **Stare adrese** sa prethodnog sajta preusmerava Next prema `src/data/redirects.json`
  (`docs/SEO-MIGRACIJA.md`). Adrese strana (slug) se ne menjaju, jer ih Google već zna.
- **Slike** se prikazuju kao `<img>`, bez Next optimizatora (shared hosting nema memorije za sharp).
  Slike proizvoda su WebP; slike koje se menjaju u adminu stižu sa backenda (`/uploads/...`).
- **Slika za deljenje** linkova: `public/opengraph.jpg` i `opengraph.webp` (1200 × 630), u `lib/seo.ts`.
- **Kolačići**: marketing oznake se učitavaju tek posle pristanka (`components/Marketing.tsx`).
- **Dizajn**: crvena `#e02a33`, tamna `#18191b`, kartice `rounded-[12px]` sa tankim okvirom, naslovi sa
  crvenim natpisom iznad i crvenom tačkom na kraju, bez senki na dugmadima i slikama.

## Deploy

cPanel (Setup Node.js App), isto kao admin panel: lokalno `npm run build:cpanel`, upload arhive, Restart.
Ceo postupak, promenljive okruženja i rešavanje problema: [`DEPLOY.md`](DEPLOY.md).
