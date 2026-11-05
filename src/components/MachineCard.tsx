"use client";

import OfferCard from "./OfferCard";
import { useProductImage } from "@/lib/media-context";
import list from "@/data/machine-list.json";

type M = (typeof list)[number];

/* Kartica priključne mašine (lista, kategorije i „Slične mašine"): ista kartica kao na strani Akcije.
 * Gore vrsta i proizvođač, naziv i kratak opis, do dve ključne vrednosti, tamna traka sa cenom („Na upit"). */
export default function MachineCard({ m }: { m: M }) {
  const image = useProductImage(m.href, m.image);
  return (
    <OfferCard
      d={{
        href: m.href,
        image,
        name: m.name,
        kind: `${m.categoryName} · ${m.brandName}`,
        note: m.text,
        rows: m.key.slice(0, 2),
        priceText: "Na upit",
      }}
    />
  );
}
