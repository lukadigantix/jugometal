#!/bin/zsh
# Studio prikaz jednog dela (isti postupak kao studio-sve.sh): ulaz.png izlaz.webp [pozadina.jpg]
set -e
cd "$(dirname "$0")/.."
in="$1"; out="$2"; BG="${3:-scripts/studio-pozadina.jpg}"; S=1000; B=640
part=$(mktemp /tmp/studio-part-XXXXXX).png
magick "$in" -trim +repage -filter Lanczos -resize ${B}x${B} \
  -modulate 100,108 -brightness-contrast 1x6 -unsharp 0x1+0.5+0.02 "$part"
magick "$BG" -colorspace sRGB -type TrueColor \
  \( "$part" -background black -shadow 50x28+0+0 \) -gravity center -geometry +0+34 -composite \
  \( "$part" -background black -shadow 35x10+0+0 \) -gravity center -geometry +0+14 -composite \
  "$part" -gravity center -geometry +0-14 -composite \
  -quality 86 "$out"
rm -f "$part"
