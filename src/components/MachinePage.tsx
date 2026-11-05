"use client";

import { Landmark, Package, Tractor } from "lucide-react";
import ProductDetail, { type Perk } from "./ProductDetail";
import MachineCard from "./MachineCard";
import { useProductImages } from "@/lib/media-context";
import list from "@/data/machine-list.json";

/* Strana priključne mašine (izvedeno iz TractorPage): slika, ključni brojevi, upit za ponudu (e-mail sa modelom), kompletna
 * specifikacija sa starog sajta, opis, subvencije, delovi, slični modeli. Raspored je zajednički (ProductDetail).
 * Cena se ne prikazuje (nema je) - "cena na upit". */

const USE_LABEL: Record<string, string> = { ratarstvo: "Ratarstvo", stocarstvo: "Stočarstvo", vocarstvo: "Voćarstvo", transport: "Transport" };

export default function MachinePage({ category, product }: { category: string; product: string }) {
  const t = list.find((x) => x.category === category && x.slug === product)!;
  const images = useProductImages(t.href, [t.image]);
  const groups = [
    { group: "Osnovni podaci", rows: [["Vrsta", t.categoryName], ["Proizvođač", t.brandName], ["Namena", USE_LABEL[t.use]]] as [string, string][] },
    ...(t.specs.length ? [{ group: "Tehnički podaci", rows: t.specs.map((x) => [x.label, x.value] as [string, string]) }] : []),
  ];
  const stats = t.key.map((x) => ({ v: x.value, u: "", l: x.label.toLowerCase() }));
  const similar = list
    .filter((x) => x.slug !== product && (x.category === category || x.use === t.use))
    .sort((a, b) => Number(b.category === category) - Number(a.category === category))
    .slice(0, 4);
  const perks: Perk[] = [
    { icon: Tractor, title: "Savet oko izbora mašine", short: "Savet" },
    { icon: Package, title: "Rezervni delovi za mašine", short: "Delovi", href: "/rezervni-delovi/delovi-za-prikljucne-masine" },
    { icon: Landmark, title: "Pomoć oko subvencija", short: "Subvencije", href: "/subvencije" },
  ];

  return (
    <ProductDetail
      crumbs={[{ label: "Početna", href: "/" }, { label: "Priključne mašine", href: "/prikljucne-masine" }, { label: t.categoryName, href: `/prikljucne-masine/${category}` }, { label: t.name }]}
      image={images[0]}
      images={images}
      name={t.name}
      badge={t.categoryName}
      logo={t.logo}
      brandName={t.brandName}
      eyebrow={`Priključna mašina · ${USE_LABEL[t.use]}`}
      text={t.text}
      stats={stats}
      perks={perks}
      priceNote="Moguće uz subvencije"
      specs={groups}
      aboutTitle="O mašini"
      about={t.texts}
      inquiry={{ about: `priključnu mašinu ${t.name}`, placeholder: "Model i snaga vašeg traktora, radni zahvat, kupovina uz subvenciju..." }}
      similar={
        similar.length > 0
          ? {
              title: "Slične mašine",
              link: { href: "/prikljucne-masine", label: "Sve mašine" },
              items: similar.map((x) => (
                <li key={x.slug} className="w-[82%] shrink-0 snap-start sm:w-auto">
                  <MachineCard m={x} />
                </li>
              )),
            }
          : undefined
      }
    />
  );
}
