#!/usr/bin/env bash
#
# Pravi deploy arhivu prodavnice za cPanel. Build ide iskljucivo lokalno - shared hosting
# nema dovoljno memorije za `next build`.
#
#   npm run build:cpanel  ->  deploy/jugometal-cpanel.zip
#
# Build ide u .next-cpanel (NEXT_DIST_DIR), pa lokalni `npm run dev` (.next) moze da radi i dalje.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

DIST=".next-cpanel"
DEPLOY="deploy"
STAGE="$DEPLOY/stage"
ZIP="$DEPLOY/jugometal-cpanel.zip"

if [ ! -f .env.production ]; then
  echo "Nema .env.production - prekidam." >&2
  exit 1
fi

echo "==> Cistim prethodni cPanel build"
rm -rf "$DIST" "$DEPLOY"

# .env.local ima prioritet nad .env.production pri buildu i drzi lokalni API (localhost:3005),
# pa bi se u produkcijski bundle zapekao pogresan API. Vrednosti ucitane u shell pobedjuju
# sve .env fajlove, tako da je ovo osigurac protiv tog tihog problema.
echo "==> Ucitavam .env.production"
set -a
# shellcheck disable=SC1091
. ./.env.production
set +a
echo "    NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL"
echo "    NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL:-}"

echo "==> next build"
NEXT_DIST_DIR="$DIST" npx next build

OUT="$DIST/standalone"
if [ ! -f "$OUT/server.js" ]; then
  echo "Nema $OUT/server.js - standalone build nije napravljen." >&2
  exit 1
fi

# Standalone output namerno ne sadrzi staticke fajlove - Next ih ocekuje pored
# sopstvenog server.js. Bez ovog koraka CSS/JS/slike vracaju 404.
echo "==> Kopiram static i public u standalone"
mkdir -p "$OUT/$DIST/static"
cp -R "$DIST/static/." "$OUT/$DIST/static/"
if [ -d public ]; then
  mkdir -p "$OUT/public"
  cp -R public/. "$OUT/public/"
fi

# Na serveru je struktura ista kao kod admin panela: server.js + .next/standalone/
echo "==> Slazem arhivu"
mkdir -p "$STAGE/.next"
cp -R "$OUT" "$STAGE/.next/standalone"
cp server.js "$STAGE/"
# Mali package.json za server: bez zavisnosti i bez postinstall skripte. Zavisnosti su vec u
# .next/standalone/node_modules, pa "Run NPM Install" u cPanel-u nema sta da instalira (i ne moze da pukne
# na scripts/copy-maplibre-worker.mjs, koji nije u arhivi).
cat > "$STAGE/package.json" <<'JSON'
{
  "name": "jugometal",
  "version": "1.0.0",
  "private": true,
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": ">=20.15.0"
  }
}
JSON
(cd "$STAGE" && zip -qr "../$(basename "$ZIP")" .next/standalone server.js package.json -x '*.DS_Store' -x '*/.DS_Store')
rm -rf "$STAGE"

echo
echo "Gotovo: $ZIP ($(du -h "$ZIP" | cut -f1))"
echo "Raspakuj sadrzaj u root cPanel aplikacije (vidi DEPLOY.md)."
