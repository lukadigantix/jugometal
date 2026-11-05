# Deploy prodavnice na cPanel

Prodavnica ide na `jugometal.co.rs`, admin panel na `panel.jugometal.co.rs`, backend API na `api.jugometal.co.rs`.
Postupak je isti kao za admin panel (`../jugometal-admin/DEPLOY.md`).

Build se radi **isključivo lokalno**. Shared cPanel hosting nema dovoljno memorije
za `next build`, pa se na server šalje gotov standalone build koji nosi svoj
minimalni `node_modules` - na serveru se ne pokreće `npm install`.

---

## 1. Lokalno: napravi arhivu

```bash
npm run build:cpanel
```

Rezultat: `deploy/jugometal-cpanel.zip` (~80 MB, od toga ~45 MB slike iz `public/`).

Lokalni `npm run dev` **ne mora** da se gasi: build za cPanel ide u poseban folder
(`.next-cpanel`), a dev server koristi `.next`.

Skripta redom: učita `.env.production`, odradi `next build` (standalone) u `.next-cpanel`,
kopira statičke fajlove i `public/` u standalone i sve spakuje.

Arhiva sadrži samo ono što treba u runtime-u, u istoj strukturi kao admin panel:

```
server.js              <- startup file za Passenger
package.json
.next/standalone/      <- Next server + minimalni node_modules + static + public
```

Izvorni kod (`src/`) se ne šalje - nije potreban.

## 2. cPanel: napravi Node.js aplikaciju

**Setup Node.js App → Create Application**

| Polje | Vrednost |
|---|---|
| Node.js version | 20.x ili 22.x (najmanje **20.15.0**) |
| Application mode | Production |
| Application root | `jugometal.co.rs` (ili folder po izboru, npr. `jugometal-shop`) |
| Application URL | `jugometal.co.rs` |
| Application startup file | `server.js` |

Pod **Environment variables** dodaj:

```
NODE_ENV=production
NODE_OPTIONS=--disable-wasm-trap-handler --max-old-space-size=512
REVALIDATE_SECRET=<ista vrednost kao SHOP_REVALIDATE_SECRET u backend .env>
```

- `NODE_OPTIONS` je **obavezan**. Passenger pokreće `server.js` direktno, a bez
  `--disable-wasm-trap-handler` server ne može ni da se digne na CloudLinux hostingu
  (vidi "Ako server ne startuje").
- `REVALIDATE_SECRET` je tajna, zato **nije** u `.env.production` i ne ide u arhivu.
  Bez nje izmene iz admina (cene, slike, opisi) ne stižu odmah na sajt, nego tek kad keš istekne (do 1 h).

`PORT` i `HOSTNAME` **ne diraj** - Passenger dodeljuje port, a `server.js` sam forsira bind na `0.0.0.0`.

## 3. Upload

1. File Manager → uđi u Application root
2. Upload `jugometal-cpanel.zip`
3. Extract u taj isti folder
4. Obriši zip

Struktura posle raspakivanja:

```
<application root>/
├── server.js
├── package.json
└── .next/standalone/...
```

## 4. Backend

U `.env` backend aplikacije (`api.jugometal.co.rs`) proveri:

```
CORS_ORIGIN=https://jugometal.co.rs,https://www.jugometal.co.rs,https://panel.jugometal.co.rs
SHOP_REVALIDATE_URL=https://jugometal.co.rs/api/osvezi
SHOP_REVALIDATE_SECRET=<ista vrednost kao REVALIDATE_SECRET prodavnice>
```

Bez `CORS_ORIGIN` korpa, porudžbine i upiti sa sajta padaju u browseru.

Slike proizvoda koje se menjaju u adminu stižu sa backenda (`/uploads/...`). Slike u `public/`
ostaju kao rezerva kad backend ne odgovara.

## 5. Restart

Setup Node.js App → **Restart**. Otvori `https://jugometal.co.rs`.

---

## Sledeći deploy

```bash
npm run build:cpanel
```

Na serveru obriši stari `.next/` folder pre raspakivanja nove arhive - stari
build ima druge heširane fajlove i ostaje da visi. Zatim Restart.

---

## Na šta paziti

**`.env.production` se peče u build.** `NEXT_PUBLIC_API_URL` i `NEXT_PUBLIC_SITE_URL` završavaju u
klijentskom JS-u u trenutku build-a. Menjanje env varijabli u cPanel UI-u nema efekta na njih -
posle izmene adrese API-ja mora nov `npm run build:cpanel`.

**`.env.local` ima prioritet nad `.env.production`.** Lokalno drži `localhost:3005`.
`build-cpanel.sh` zato učitava `.env.production` u shell pre build-a (shell env pobeđuje sve
`.env` fajlove), pa se lokalni API ne može slučajno zapeći u produkciju. Ako ikad budeš build-ovao
ručno, proveri šta je završilo unutra.

**Katalog pri build-u.** Build pokušava da učita katalog sa `NEXT_PUBLIC_API_URL`. Ako backend još
nije podignut, strane se naprave iz poslednjeg izvoza u `src/data` (rezerva), a posle se same
osvežavaju sa API-ja čim proradi (keš kataloga je 1 h, izmene iz admina ga brišu odmah).
Najbolje je zato prvo podići backend, pa onda prodavnicu.

**`outputFileTracingRoot` i `distDir` u `next.config.ts`.** Prvi drži `server.js` u korenu
standalone foldera (bez njega Next, ako nađe `package-lock.json` u roditeljskom folderu, napravi
podfolder i cPanel ne nađe server). Drugi omogućava da build za cPanel ide u `.next-cpanel`.

**Statički fajlovi se ne kopiraju sami.** Next namerno ne stavlja `static` i `public/` u
standalone output. `build-cpanel.sh` to radi. Ako ikad pakuješ ručno i preskočiš taj korak,
sajt se digne ali bez CSS-a, JS-a i slika.

**Slike bez optimizatora** (`images.unoptimized`). Next image optimizer traži `sharp` i drži slike
u memoriji, što obara proces na shared hostingu. `sharp` zato i ne ide u arhivu.

**Linux razlikuje velika i mala slova u imenima fajlova**, macOS ne. Provera pre deploy-a:

```bash
npx tsc --noEmit
```

**Memorija.** Izmereno na lokalnom testu raspakovane arhive: ~250 MB RSS posle 60 zahteva
(početna i prodavnica). `--max-old-space-size=512` je dovoljno.

**Ne pokreći "Run NPM Install" u cPanel-u.** Zavisnosti su već u `.next/standalone/node_modules`.
Arhiva zato nosi mali `package.json` bez zavisnosti i bez `postinstall` skripte: ako se instalacija ipak
pokrene, završi se odmah („up to date") i ništa ne menja. (Ranije je u arhivi bio pun `package.json`, pa je
instalacija pucala na `scripts/copy-maplibre-worker.mjs`.)

**Stare adrese** sa prethodnog sajta (`src/data/redirects.json`) preusmerava sam Next (308).

---

## Ako server ne startuje

### `Cannot allocate Wasm memory for new instance`

Nedostaje `--disable-wasm-trap-handler` u `NODE_OPTIONS`. CloudLinux ograničava adresni prostor
procesa na 4 GB, a Node za WebAssembly rezerviše ~10 GB virtuelnog prostora. Ne rešava se
podizanjem `--max-old-space-size`. Detaljno objašnjenje je u `../jugometal-admin/DEPLOY.md`.

### Bind na ime mašine umesto na `0.0.0.0`

`server.js` nije pokrenut (Application startup file mora biti `server.js`, ne
`.next/standalone/server.js`), ili je postavljen `BIND_HOST`.

### `Nedostaje .next/standalone/server.js`

Arhiva nije raspakovana u Application root, ili je raspakovana u podfolder.
