# Seoba jugometal.co.rs na novi sajt

Domen ostaje isti (https://jugometal.co.rs). Cilj je da Google zadrži pozicije: svaka stara adresa mora da vrati stranu ili da trajno (301/308) preusmeri na najbližu novu.

## Stanje (27.10.2026)

- Starih adresa: 478 (sitemap starog sajta + strane van sitemapa + adrese svih delova).
- Proverom na produkcijskom buildu sve vraćaju 200. Od toga 89 ide preko preusmerenja, ostale imaju istu putanju kao ranije.
- Preusmerenja: `src/data/redirects.json`, učitava ih `next.config.ts` (`redirects()`, `permanent: true`).

Pravila u redirects.json:

| Stara adresa | Nova |
|---|---|
| deo čija se adresa promenila | nova adresa dela |
| adresa koju je delilo više delova | lista brenda |
| /traktori/belarus*, /traktori/carraro* (više se ne prodaju) | /traktori |
| /traktori/imt-tafe | /traktori/imt |
| /traktori/belarus-mahindra | /traktori/mahindra |
| /traktori/solis/solis-filter-* | /rezervni-delovi/traktorski-delovi/solis |
| /rezervni-delovi/ostalo* | /rezervni-delovi |
| /rezervni-delovi/traktorski-delovi/yto | /rezervni-delovi/traktorski-delovi |
| /cart | /korpa |
| /prikljucne-masine/rasipaci-dubriva | /prikljucne-masine/rasipaci |
| /prikljucne-masine/ratarstvo/setvospremaci | /prikljucne-masine/setvospremaci |

Ako se kasnije doda novi stari link (npr. iz Search Console 404 izveštaja), samo se dopiše u redirects.json.

## Šta sajt daje Google-u

- `/sitemap.xml` (src/app/sitemap.ts): 478 strana, uključujući sve delove. Stari sajt delove nije imao u sitemap-u.
- `/robots.txt` (src/app/robots.ts): sve dozvoljeno osim /korpa i /admin.
- Svaka strana ima svoj naslov, opis i canonical. Domen za apsolutne adrese je u src/lib/site.ts (`NEXT_PUBLIC_SITE_URL`, podrazumevano https://jugometal.co.rs).
- Strukturisani podaci (schema.org, src/lib/schema.ts):
  - Organization sa tri lokacije, na svakoj strani;
  - Product + cena u RSD na delovima, Product na traktorima i mašinama, Product + cena u EUR na Benda ATV;
  - BreadcrumbList na stranama proizvoda.

## Na dan prebacivanja (na serveru)

1. Jedna verzija domena: `www.jugometal.co.rs` 301 na `https://jugometal.co.rs` (ili obrnuto, ali isto kao na starom sajtu). Ovo se radi na serveru/DNS-u, ne u Next-u.
2. http 301 na https.
3. Posle puštanja proveriti nekoliko starih adresa iz `docs/reference/sitemap-original.txt` u browseru.

## Search Console (posle puštanja)

1. Prijaviti `https://jugometal.co.rs/sitemap.xml` (Indexing > Sitemaps).
2. Stari sitemap ukloniti ako je bio prijavljen pod drugim imenom.
3. Prve dve nedelje pratiti Pages > Not found (404). Svaki stari link koji se pojavi dopisati u redirects.json.
4. Proveriti Rich results test za jednu stranu dela (cena) i jednu stranu traktora.

## Otvoreno, čeka klijenta

- Radno vreme i PIB/matični broj nisu upisani u strukturisane podatke dok ih klijent ne potvrdi (docs/ISTRAZIVANJE.md, §8-13).
- Traktori i mašine nemaju cenu na sajtu, pa nemaju ni Offer. Ako klijent želi cene, dodaju se u tractor-list.json / machine-list.json.
