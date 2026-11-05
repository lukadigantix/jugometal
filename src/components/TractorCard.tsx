"use client";

import OfferCard from "./OfferCard";
import { useTractorBrand } from "@/lib/brands-context";
import { useProductImage } from "@/lib/media-context";
import list from "@/data/tractor-list.json";

type T = (typeof list)[number];
const USE: Record<string, string> = { kompaktni: "Kompaktni", ratarski: "Ratarski", vocarski: "Voćarski" };

/* Kartica traktora (lista /traktori i „Slični modeli"): ista kartica kao na strani Akcije.
 * Gore logo brenda (iz admina), naziv i kratak opis, tri ključne vrednosti, tamna traka sa cenom („Na upit"). */
export default function TractorCard({ t }: { t: T }) {
  const logo = useTractorBrand(t.brand)?.logo;
  const image = useProductImage(t.href, t.image);
  return (
    <OfferCard
      d={{
        href: t.href,
        image,
        name: t.name,
        kind: `Traktor · ${t.brandName}`,
        logo,
        note: t.text,
        rows: [
          { label: "Snaga", value: `${t.ks} KS` },
          ...(t.drive ? [{ label: "Pogon", value: t.drive }] : []),
          ...(USE[t.use] ? [{ label: "Namena", value: USE[t.use] }] : []),
        ],
        priceText: "Na upit",
      }}
    />
  );
}
