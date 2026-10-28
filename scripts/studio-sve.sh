#!/bin/zsh
# Batch: sve isečene PNG slike delova iz public/products -> public/products/studio/<ime>.webp
# Upotreba: scripts/studio-sve.sh [putanja-do-pozadine.jpg] [--force]
#   bez pozadine: svetli radijalni fon; podrazumevano se koristi scripts/studio-pozadina.jpg ako postoji
#   --force: ponovo obradi i fajlove koji već postoje
# Zahteva ImageMagick (magick).
set -e
cd "$(dirname "$0")/.."
SRC=public/products; OUT=public/products/studio; mkdir -p "$OUT"
S=1000; B=640          # platno i najveća stranica dela (64% platna -> vazduh oko proizvoda)
BG="$1"; FORCE="$2"
[ "$BG" = "--force" ] && { FORCE=--force; BG=""; }
if [ -z "$BG" ]; then
  if [ -f scripts/studio-pozadina.jpg ]; then BG=scripts/studio-pozadina.jpg
  else BG=/tmp/jugometal-bg-radial.jpg; magick -size ${S}x${S} radial-gradient:#ffffff-#e6e5e1 "$BG"; fi
fi
n=0; skip=0
for f in "$SRC"/*.png; do
  name=$(basename "$f" .png); out="$OUT/$name.webp"
  if [ -f "$out" ] && [ "$FORCE" != "--force" ]; then skip=$((skip+1)); continue; fi
  if [ "$(magick "$f" -format '%[opaque]' info:)" != "False" ]; then echo "preskačem (nema providnu pozadinu): $name"; continue; fi
  # deo: iseci prazninu, uklopi u B x B, blago pojačaj boju i oštrinu; senke se računaju iz dela
  # i polažu ispod njega sa pomakom nadole (deo stoji malo iznad centra, senka ga "spušta" na podlogu)
  part=$(mktemp /tmp/studio-part-XXXXXX).png
  magick "$f" -trim +repage -filter Lanczos -resize ${B}x${B} \
    -modulate 100,108 -brightness-contrast 1x6 -unsharp 0x1+0.5+0.02 "$part"
  magick "$BG" -colorspace sRGB -type TrueColor \
    \( "$part" -background black -shadow 50x28+0+0 \) -gravity center -geometry +0+34 -composite \
    \( "$part" -background black -shadow 35x10+0+0 \) -gravity center -geometry +0+14 -composite \
    "$part" -gravity center -geometry +0-14 -composite \
    -quality 86 "$out"
  rm -f "$part"
  n=$((n+1))
done
echo "obrađeno: $n, preskočeno (već postoji): $skip"
