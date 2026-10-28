# Jugometal - istraživanje postojećeg sajta (jugometal.co.rs)

Datum: 27.10.2026. Izvor: svih 112 strana iz sitemap-a + 24 strane van sitemap-a + 343 strane rezervnih delova + /cart. Čitano iz HTML-a i Next.js RSC payload-a (skriveni sadržaj akordeona i tabova). Ovde je samo sadržaj, ne izgled.

## 1. Firma

- Pravno ime: Jugometal d.o.o. Svilajnac. Osnovana 1990. (sajt: "Since 1990.", "35 godina u poslu"). Imenik poljoberza.net kaže 1989 - proveriti.
- Delatnost: prodaja i servis traktora, priključnih mašina i rezervnih delova. Slogan sa sajta: "Jugometal - siguran partner."
- Tri lokacije: Svilajnac (sedište), Temerin, Požarevac.
- Email: info@jugometal.co.rs (jedini mejl na sajtu).
- Facebook: facebook.com/jugometal. Instagram: instagram.com/jugometal_doo.
- Stari sajt radio "Scope." (Design & Development, footer), © 2025. Sajt je Next.js, deo sadržaja je u Radix akordeonima.

### Lokacije i telefoni

| Lokacija | Adresa | Telefon | Ostalo |
|---|---|---|---|
| Svilajnac | Kneza Miloša 81 (kontakt strana) ili 51 (header i footer) - NEUSKLAĐENO, 35210 | 035/312-391 | delovi 035/311-137, fax 035/312-331 |
| Temerin | Novosadska 634, 21235 | 021/840-038 | fax 021/840-505, mob 063/10-58-705 |
| Požarevac | Beogradski put 17/A, 12000 | 012/665-544 | mob 063/10-58-762 |

Svaka lokacija na sajtu ima isti opis: "Servis i prodaja poljoprivredne mehanizacije u <gradu>". Požarevac je u akordeonu na kontakt strani, ali ga nema u footeru (footer ima samo Svilajnac i Temerin). Radno vreme nigde ne piše.

Sve je u `src/data/company.json`.

## 2. Struktura sajta (navigacija)

Traktori · Priključne mašine · Rezervni delovi · O nama · Kontakt · Servis · Subvencije i finansiranje · Akcije

- **Početna**: tri bannera (Traktori, Priključne mašine, Rezervni delovi), "Izdvajamo iz ponude" (9 kartica: Solis 75, Belarus 1021.3, rotaciona kosačica, pomerljive freze, rotaciona kosačica Minos, YTO 504, presa Ursus 543A, Solis 90, Metal-Fach Z562), 6 kartica brendova, tabovi Traktori (7 brendova), tabovi Priključne mašine (Ratarstvo, Stočarstvo, Voćarstvo, Transport), karusel "Partneri" (22 logoa).
- **O nama**: uvod + 3 akordeona (tekstovi u company.json). Partneri: 12 logoa.
- **Servis**: uvod + 3 akordeona: IMT i IMR, Massey Ferguson, Originalni rezervni delovi.
- **Subvencije**: samo naslov "Subvencioni programi." i "Kontaktirajte nas za više informacija." Nema sadržaja.
- **Akcije**: "Trenutno nemamo proizvoda na akciji."
- **Kontakt**: 3 akordeona sa lokacijama. Nema kontakt forme, nema mape (samo Google Maps linkovi).
- **/cart**: korpa sa formom za dostavu (ime i prezime, email, telefon, grad, poštanski broj, adresa). "Dodajte u korpu" postoji samo na stranama rezervnih delova. Gde porudžbina odlazi (mejl?) ne vidi se spolja.

## 3. Traktori (7 brendova, 32 modela)

| Brend | Modeli | Opis sa početne |
|---|---|---|
| Solis | 20, 26, 50, 60, 60NT, 75, 75NT, 90, 90NT (9) | "Solis je najbrže rastuće brend kompaktnih traktora u Evropi." |
| IMT (IMT/Tafe) | 5393 DI, 5493 DI, 5652 DI (3) | "IMT je pionir u mehanizaciji poljoprivrede i tehnologiji traktora." |
| John Deere | 5045 D, 5075M (2) | "Svestrani, snažni i efikasni – John Deere." |
| YTO | 354, 504, X804, X904, X1204, X1304 (6) | "YTO, vodeći dobavljač poljoprivredne mehanizacije u Kini." |
| Mahindra | 475 DI MKM, 595 DI Turbo MKM, 7030 DI (3) | nema opisa (deli karticu sa Belarusom) |
| Carraro | Agricube Frutteto, Agricube Vigneto, Basso 80FB/90FB (3) | "Široka ponuda specijalizovanih traktora snage od 65 do 120 KS." |
| Belarus | 820 RM, 821, 892 RM, 952, 1021.3, 1221.3 (6) | "Belarus je serija četvorotočkaških traktora koji se proizvode od 1950. godine u fabrici Minsk Tractor Works (MTZ)..." |

Svaki model ima: naziv (npr. "TRAKTOR Solis 75 JUGOMETAL"), kratak opis, 1-3 pasusa teksta, specifikacije kao parovi (Kočnice, Prenos, PTO, Međuosovinsko rastojanje, Izduvne norme, Menjač, Upravljač, Težina, dimenzije...), jednu sliku. Cena nigde ne piše. Na Solis strani su i 4 filtera (šifre 10009106ACFG, 10004836AC, 803007059AFG, 703008219BFG) - oni su u `solis-filters.json`.

Meta opisi pominju i Zetor ("...Belarus i Zetor"), a O nama pominje Zetor i Massey Ferguson - tih traktora nema u ponudi na sajtu. Pitati klijenta.

## 4. Priključne mašine (15 kategorija, 46 strana proizvoda)

Balirke (2), Kosačice (4), Sakupljači (1), Utovarivači (1), Freze (2), Plugovi (1), Sejalice (2), Prskalice (10), Rasipači (2), Setvospremači (4), Atomizeri (5), Mulčari (11), Prikolice (2), Cisterne (1), Rasturači (1).

Svaka kategorija ima sliku (`/images/masine/<slug>.webp`). Proizvodi imaju naziv, opis, specifikacije i sliku; cena nigde. Proizvođači koji se vide po logou na karticama: Celmak, FPM Agromehanika, Minos Agri, Metal-Fach, Ursus, INO Brežice, Agromehanika Kranj, Majevica, Comer, Morava, Gorenc...

Tabovi na početnoj grupišu kategorije po nameni (svaki tab ima isti, pogrešno kopiran uvodni tekst o Solis traktorima):
- Ratarstvo: plugovi, freze, sejalice, prskalice, rasipači đubriva (link 404), setvospremači (link 404)
- Stočarstvo: balirke, kosačice
- Voćarstvo: atomizeri, mulčari
- Transport: cisterne, prikolice, rasturači
- Sakupljači i utovarivači nisu ni u jednom tabu.

Na kartama prskalica i setvospremača se vidi i Agromehanika Kranj (AGP serija).

## 5. Rezervni delovi (jedini deo sajta sa cenama)

Tri grupe, 18 podkategorija, 362 artikla sa cenom (10 - 63.000 RSD):

| Grupa | Podkategorije (broj artikala) |
|---|---|
| Traktorski delovi | IMT (34), Solis (4), YTO (0), Massey Ferguson (49), Landini (59), Jinma (52) |
| Delovi za priključne mašine | FPM Agromehanika (3), Agromehanika Kranj (48), INO Brežice (12), SIP Šempeter (72), Majevica (12), Rotaciona kosa Poljska (17) |
| Ostalo | Kardani, Ulja i maziva, Hladnjaci, Trimeri, Spoljne gume, Razno - SVIH ŠEST STRANA VRAĆA 404 |

Artikal ima: naziv (verzal, npr. "IMT KOČNICA KPL"), šifru/kataloški broj (304 od 362), cenu u RSD, sliku (uglavnom PNG bez pozadine), ponekad opis. Sve je u `src/data/parts.json` (polje `originalUrl` čuva link sa starog sajta).

Delovi se očigledno vode u nekoj bazi/tabeli (šifre, cene). Pitati klijenta odakle dolaze (Excel? program za magacin?) - to određuje da li novi sajt treba admin/import.

## 6. Greške na postojećem sajtu (vredi pomenuti klijentu)

1. Adresa u Svilajncu: 51 u headeru i footeru, 81 na kontakt strani i u imenicima.
2. Kartice brendova na početnoj "IMT / Tafe" i "Belarus / Mahindra" vode na /traktori/imt-tafe i /traktori/belarus-mahindra - te strane su PRAZNE (pravi sadržaj je na /traktori/imt, /traktori/belarus, /traktori/mahindra).
3. Tab "Ratarstvo" na početnoj: linkovi "Rasipači đubriva" i "Setvospremači" vode na nepostojeće strane (404).
4. Grupa "Ostalo" u rezervnim delovima: svih 6 podkategorija 404.
5. Isti URL za više proizvoda: 3 priključne mašine (rotaciona kosačica Celmak i Minos, dve nošene prskalice, dva setvospremača) i 36 rezervnih delova dele adresu sa drugim artiklom, pa je samo jedan od njih dostupan. Novi sajt mora da ima jedinstvene slugove (šifra u slugu).
6. Jedan artikal (Landini, slika LA.png) ima sliku koja je zapravo HTML 404.
7. Meta title/description su isti na skoro svim stranama; canonical svuda pokazuje na početnu.
8. Sitemap ne sadrži rezervne delove (362 artikla nevidljiva za Google), ni strane podkategorija delova.
9. Subvencije - prazna strana. Akcije - prazna.
10. Slovne greške u tekstovima: "mehenizacije", "najbrže rastuće brend", "dodatcima", "podšavanje".

## 7. Šta imamo u projektu

- `public/` - 443 slike proizvoda (`/products`), 15 bannera (`/banners`, `/banners/traktori`), 12 logoa partnera (`/sponsors`), 22 logoa iz karusela (`/brands`), 35 slika kategorija i podkategorija (`/images/masine`), `logo.png` (512×128), originalni favicon i OG slika.
- `src/data/` - company.json, catalog.json, tractors.json (32), implements.json (46), solis-filters.json (4), parts.json (362).
- `docs/reference/` - sitemap, strane van sitemap-a, sve kartice po stranama (JSON).

## 8. Pitanja za klijenta

1. Tačna adresa u Svilajncu (51 ili 81) i godina osnivanja (1989 ili 1990).
2. Radno vreme po lokaciji. Ima li Požarevac mejl ili faks.
3. Da li se traktori i mašine prodaju sa cenom na sajtu ili samo "na upit".
4. Odakle dolaze cene delova i koliko često se menjaju (ručno, Excel, program). Da li porudžbina iz korpe sada stiže na mejl i kome.
5. Zetor i Massey Ferguson - prodaju li se i dalje.
6. Šta ide na Subvencije (lizing, IPARD, pokrajinske subvencije, partner banke).
7. Čiji su tekstovi i slike proizvoda (deo slika je očigledno sa sajtova proizvođača).

## 9. Plan (Luka, 27.10.2026): online prodavnica, SEO, preusmerenja

- Nova ideja klijenta: guraju **online prodavnicu** (to su rezervni delovi). Na sajtu se zove **„Online prodavnica"** (razumljivije kupcima od „Shop"); u meniju je zamenila „Rezervni delovi". Cilj: najbolja moguća prodavnica + SEO, da prodaju kroz te kanale.
- Putanja za sada ostaje `/rezervni-delovi/...` (ista kao na starom sajtu, dobra ključna reč) - odluka o konačnim URL-ovima pre lansiranja.
- **Na kraju obavezno:** 301 preusmerenja svih starih URL-ova na nove, da se ne gubi Google pozicija. Izvor za mapu: `docs/reference/sitemap-original.txt` (112 strana), `strane-van-sitemapa.txt` (24) i `kartice-po-stranama.json` (svi linkovi proizvoda, uključujući 362 dela sa `originalUrl` u `src/data/parts.json`). Stari slugovi delova nisu jedinstveni (36 deli URL) - preusmeriti na novi jedinstveni slug (šifra u slugu).
- Header (27.10.): gornja traka = telefon + e-mail; desno u headeru O nama / Servis / Subvencije / Kontakt umesto dugmeta „Zatraži ponudu" (ponuda ide na stranu proizvoda).

## 10. Promena ponude (Luka, 27.10.2026)

- **Belarus i Carraro su izbačeni** - Jugometal više ne radi sa tim brendovima. Njihovi modeli su premešteni iz `src/data/tractors.json` u `docs/reference/traktori-ukinuti-belarus-carraro.json` (za 301 preusmerenja starih URL-ova /traktori/belarus/* i /traktori/carraro/*). Ponuda: 5 brendova, 23 modela.

## 11. Strana Subvencije i finansiranje (27.10.2026)

Stara strana je bila prazna. Nova (`/subvencije`) koristi samo opšte činjenice: podsticaji Ministarstva poljoprivrede preko Uprave za agrarna plaćanja (povraćaj dela troška posle kupovine), IPARD, pokrajinski i opštinski konkursi - BEZ procenata, iznosa i rokova. Klijent treba da potvrdi ili dopuni:
1. Da li i kako pomažu oko prijave (ponuda/predračun za konkurs - napisano da pripremaju ponudu).
2. Da li nude plaćanje na rate, lizing ili kredit i sa kojim partnerima (u FAQ stoji „uslove dogovaramo pojedinačno").
3. Konkretne aktuelne javne pozive koje žele da istaknu.

## 12. Strana Kontakt (27.10.2026)

`/kontakt`: tri lokacije sa svim brojevima sa stare kontakt strane, mape (Google embed bez ključa), forma koja otvara e-mail program sa popunjenom porukom (nema backend-a). Za klijenta:
1. Tačna lokacija Požarevca (Google ne poznaje „Beogradski put 17/A" - pada u Lajkovac); najbolje link na njihov Google Business profil ili koordinate.
2. Radno vreme po lokacijama (nigde ne piše).
3. Da li Temerin i Požarevac imaju svoj e-mail.
4. Kuda treba da stižu poruke sa forme kad bude backend-a.

## 13. Korpa (27.10.2026)

`/korpa` (stari `/cart` se trajno preusmerava). Korpa je u browseru (localStorage `jugometal-korpa`), cene se uvek čitaju iz parts.json. Porudžbina se za sada šalje e-mailom (otvara se e-mail program sa spiskom artikala i podacima za dostavu - ista polja kao stara korpa). Za klijenta pre pravog plaćanja:
1. Cena dostave (fiksna, po težini, besplatno iznad iznosa?) i kurirska služba.
2. Načini plaćanja: pouzećem, uplatnica, kartica online?
3. Da li su cene sa PDV-om.
4. Kome stižu porudžbine i da li treba potvrda kupcu na e-mail.
