# Backend - predaja kolegi

Sajt je trenutno statičan: svi podaci su JSON/TS fajlovi u `src/data`, a porudžbine i upiti idu preko `mailto:`. Backend ide na naš server (unlimited server + storage). Ovaj dokument opisuje šta postoji i gde se šta menja. Ništa od backenda nije urađeno.

## Podaci danas

| Fajl | Šta je | Ko ga koristi |
|---|---|---|
| parts.json | 362 rezervna dela: id, name, code, group, subcategory, priceRsd, description, image, slug, href, originalUrl | featured-parts.ts (sve strane prodavnice, korpa, pretraga) |
| featured-parts.ts | izvedeni podaci iz parts.json: searchIndex, partGroups, filterTree, istaknuti delovi, formatRsd | prodavnica, korpa, početna |
| tractors.json, tractor-list.json | 23 modela traktora, specifikacije | /traktori |
| implements.json, machine-list.json, machines-catalog.json | 46 priključnih mašina | /prikljucne-masine, početna |
| atv.ts | Benda ATV modeli, boje, cene u EUR, akcije (onSale) | /atv, /akcije |
| catalog.json | brendovi traktora, kategorije mašina, grupe delova | navigacija, filteri |
| company.json | firma, tri lokacije, telefoni, tekstovi | header, footer, kontakt, schema.org |
| redirects.json | 301 sa starog sajta | next.config.ts |
| hero-slides.ts, imt-spotlight.ts, featured-products.json | sadržaj početne | početna |

Slike su u `public/` (products, banners, hero, atv, brands). Na serveru treba da pređu u storage, a putanja u podacima postaje pun URL.

## Gde se menja izvor podataka

Najmanje posla: zadržati iste oblike objekata i zameniti uvoz JSON-a funkcijom koja čita iz baze.

- Delovi: zameniti `parts.json` u `src/data/featured-parts.ts`. Sve ostale komponente čitaju iz tog modula.
- Traktori, mašine, ATV: strane uvoze direktno `tractor-list.json`, `machine-list.json`, `atv.ts`. Najlakše je napraviti `src/lib/data.ts` sa funkcijama (getParts, getTractors, getMachines, getAtv) i prebaciti uvoze na njega.
- Strane imaju `generateStaticParams`, pa se sve pravi pri buildu. Uz bazu: ili rebuild posle izmene, ili `revalidateTag`/`cacheTag` (sajt već ima `cacheComponents: true`).
- Cene se u korpi uvek čitaju iz kataloga po id-u (src/lib/cart.ts), ne pamte se. Tako treba da ostane i na serveru: cena se računa na serveru pri porudžbini, nikad iz browsera.

## Šta treba napraviti

1. **Porudžbine iz korpe.** Danas: CartPage.tsx sastavlja mejl. Treba: POST /api/porudzbine { stavke [{id, qty}], ime, telefon, email, adresa, napomena, način preuzimanja }. Server proverava cene i dostupnost, upisuje porudžbinu, šalje mejl prodaji i potvrdu kupcu. Korpa je u localStorage pod ključem `jugometal-korpa`; posle uspešne porudžbine se prazni.
2. **Upiti sa formi.** Danas mailto u: ContactPage, ServicePage (zakazivanje servisa), SubsidyPage, TractorPage, MachinePage, AtvPage. Treba jedan POST /api/upiti { tip: kontakt | servis | subvencija | ponuda, proizvod?, lokacija?, ime, telefon, email?, poruka }. Zaštita od spama (honeypot ili Turnstile) i rate limit.
3. **Pretraga delova na serveru.** Danas se ceo searchIndex šalje u browser i filtrira lokalno. To radi za 362 dela, ali ne za hiljade. Treba: GET /api/delovi?q=&grupa=&brend=&strana=, sa normalizacijom ćirilice/latinice i bez kvačica (š=s, č=c...).
4. **Admin.** Unos i izmena delova (cena, slika, opis, stanje), traktora, mašina, ATV akcija; pregled porudžbina i upita. /admin je već zabranjen u robots.txt.
5. **Stanje i cene.** Deo bez cene danas prikazuje "cena na upit". Polje za stanje (ima/nema/po porudžbini) ne postoji, treba ga dodati.
6. **Sitemap.** src/app/sitemap.ts čita iste podatke; kad pređu u bazu, treba da čita iz baze.

## Važno da se ne pokvari

- Adrese strana (slug, href) se ne menjaju. Ako se deo preimenuje, stari href mora da ostane ili da dobije 301 (redirects.json ili tabela u bazi).
- Polja koja koristi Google (naziv, cena, slika, šifra) moraju da ostanu u istom obliku (src/lib/schema.ts).
- Plaćanje, PDV i dostava još nisu dogovoreni sa klijentom (docs/ISTRAZIVANJE.md, §8-13). Do tada je porudžbina samo zahtev, plaćanje pouzećem ili po dogovoru.
