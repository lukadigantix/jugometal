# Jugometal - novi sajt

Next.js 16 (App Router, TypeScript, Tailwind 4). Pokretanje:

```
npm install
npm run dev
```

- `docs/ISTRAZIVANJE.md` - sve što je izvučeno sa jugometal.co.rs (firma, kontakti, kategorije, proizvodi, greške na starom sajtu, pitanja za klijenta)
- `src/data/company.json` - firma, lokacije, telefoni, tekstovi O nama / Servis
- `src/data/catalog.json` - struktura: brendovi traktora, kategorije priključnih mašina, grupe rezervnih delova
- `src/data/tractors.json`, `implements.json`, `solis-filters.json` - proizvodi sa opisima i specifikacijama
- `src/data/parts.json` - 338 rezervnih delova sa šiframa i cenama (RSD)
- `public/` - sve slike sa starog sajta na originalnim putanjama (`/products`, `/banners`, `/sponsors`, `/images/masine`, `/brands`, `/logo.png`)
- `docs/reference/` - sitemap, liste strana i kartica sa starog sajta

## Početna strana (27.10.2026)

Početna je prenesena iz Lukinog projekta pitbike (github.com/lukadigantix/pitbike, pitbike.vercel.app): isti raspored sekcija, header sa mega-menijem, Lenis skrol, Reveal animacije, samo svetla tema (tamna i prekidač teme izbačeni na Lukin zahtev). Zamenjen je samo sadržaj (Jugometal).

- Tekstovi početne: `src/components/copy.ts` (samo srpski, bez prevoda)
- Struktura menija iz podataka: `src/components/nav-data.ts`
- Sekcije: Hero → ProductSpotlight → ExploreCategories → EditorialCards (servis) → MachinesShowcase (karusel priključnih mašina) → BrandStory (o nama) → SocialGrid → Locations → Footer
- Razlike u odnosu na pitbike: nema prebacivanja jezika i ikone naloga; header je 96 px na desktopu (80 ispod xl) jer klijent traži krupan logo (56 px visine, 224 px širine; 40/36 na tabletu/telefonu); desktop navigacija ide od 1280 px (xl) jer su srpski nazivi duži i preklapali su logo; slike proizvoda stoje na beloj pločici jer nemaju providnu pozadinu. Logo je vektorizovan iz logo.png (ImageMagick + potrace, dva sloja: crveni i crni) u `public/logo.svg` i `public/logo-white.svg` (za tamnu podlogu); Zeroblynk potpis u footeru koristi `public/zeroblynk/logo-light.svg` sa zeroblynk.com.
- Ostale strane još ne postoje (vode na 404 stranu).

## Hero slajder (27.10.2026)

Prenesen iz htzshop projekta (kod vraćen iz zapisa sesije od 26.10.): crossfade, imena slajdova + strelice dole desno, brojač ispod 1280 px, autoplay 7 s, pauza na hover, strelice na tastaturi. Slajdovi (od 27.10. popodne) = ponuda, ne modeli: Traktori, Priključne mašine, Online prodavnica, Servis, sa profesionalnim Pexels fotografijama (za konkretne modele profesionalnih slika nema). Podaci i tekstovi u `src/data/hero-slides.ts`, fotografije u `public/hero/`, izvori u `docs/reference/hero-izvori.txt`. Kandidati za izbor (144) su na `/izbor` (public/izbor) - obrisati pre lansiranja.

## Preporučeni proizvodi (27.10.2026)

Odmah ispod hero-a: `FeaturedProducts.tsx` - karusel sa karticama „Izdvajamo iz ponude" sa starog sajta (bez Belarusa): slika proizvođača na beloj pločici; u telu kartice red sa logoom proizvođača (public/brands/trim - logoi isečeni na sadržaj, 96 px visine) i kategorijom, naziv, kratak opis, primarno dugme „Pogledaj proizvod". Podaci u `src/data/featured-products.json` (8 kartica, iz docs/reference/kartice-po-stranama.json). Redosled sekcija: Hero → Preporučeni proizvodi → Najtraženiji rezervni delovi → ostalo.

## Istaknuti proizvodi iz prodavnice (27.10.2026)

Odmah ispod hero-a: `ShopFeatured.tsx` - karusel (4 kartice na xl, 3 na lg, 2 na sm, 1 na telefonu; strelice na ivicama, isti obrazac kao karusel mašina) sa slikom na beloj pločici, logoom brenda + imenom brenda u telu kartice (mapa BRAND_LOGO u featured-parts.ts → public/brands/trim; Landini, Jinma, SIP i poljska kosa nemaju logo pa stoji samo ime), brendom, nazivom, šifrom, cenom u RSD i dugmetom „U korpu" (još bez logike korpe), pa „Pogledaj sve proizvode" → /rezervni-delovi. Izbor proizvoda je ručni spisak id-ova u `src/data/featured-parts.ts` (zameniti podacima o prodaji kad ih klijent da).

## Studio slike rezervnih delova (27.10.2026)

Klijentove fotografije delova su isečci sa telefona (361 PNG sa providnom pozadinom). Skripta `scripts/studio-sve.sh` ih pretvara u ujednačen „studio" prikaz: iseče prazninu, uklopi deo u 64% kvadratnog platna 1000×1000, blago pojača boju i oštrinu, doda dve meke senke i položi na zajednički fon (`scripts/studio-pozadina.jpg` = radionica u sivom, zamućena i posvetljena, u stilu pitbike kartica). Izlaz: `public/products/studio/<ime>.webp` (oko 14 MB ukupno). Pokretanje: `scripts/studio-sve.sh` (preskače već obrađene; `--force` za ponovnu obradu; prvi argument je druga pozadina). Jedna slika: `scripts/studio-slika.sh ulaz.png izlaz.webp`. Kartice u prodavnici koriste studio verziju preko `studioImage()` u `src/data/featured-parts.ts`; originali ostaju u `public/products/`.

## Benda ATV (27.10.2026)

Jugometal prodaje Benda kvadove (njihovi oglasi na polovniautomobili.com/jugometal): Redstone 550 R2 (7.490 €, akcija) i Redstone 1000 R2 (10.990 €). Sekcija `AtvSection.tsx` stoji odmah ispod „Šta nudimo": terenska fotografija sa tekstom + dve kartice modela sa ključnim podacima, cenom i dugmetom. Podaci u `src/data/atv.ts` (prepisani iz oglasa), fotografije u `public/atv/` sa bendamoto.com (proizvođač). Cene proveriti sa klijentom pre lansiranja.
