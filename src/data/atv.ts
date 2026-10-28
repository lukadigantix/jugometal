/* Benda ATV - Jugometal je prodavac. Cene i oprema: oglasi Jugometala (polovniautomobili.com, 10.2026).
 * Boje i tehnički podaci: bendamoto.com (proizvođač), prevedeno. */

export type AtvColor = { name: string; sr: string; hex: string; image: string };
export type AtvModel = {
  slug: string;
  name: string;
  tagline: string;
  price: string;
  priceNote: string;
  onSale: boolean;
  saleBadge?: string;
  image: string;
  colors: AtvColor[];
  stats: { value: string; unit: string; label: string }[];
  equipment: string[];
  specs: { group: string; rows: [string, string][] }[];
  href: string;
};

const ENGINE = "V2, četvorotaktni SOHC, tečno hlađenje";
const EQUIPMENT = [
  "EPS servo upravljač sa 3 režima (Standard, Work, Sport)",
  "Režimi vožnje Standard, Work i Sport",
  "Zaključavanje prednjeg i zadnjeg diferencijala",
  "Elektronska kontrola gasa (Ride by Wire)",
  "Alu felne 14\" sa beadlock obručem",
  "TFT displej",
  "Kuka i vitlo",
  "Podesivi gasni amortizeri",
  "Štitnici ruku za vozača i nasloni za suvozača",
  "Full matrix LED farovi",
];

export const atvModels: AtvModel[] = [
  {
    slug: "redstone-550-r2",
    name: "Benda Redstone 550 R2",
    tagline: "Futuristički dizajn, snaga za njivu, šumu i teren.",
    price: "7.490 €",
    priceNote: "akcijska cena, količine ograničene",
    onSale: true,
    saleBadge: "Akcija",
    image: "/atv/boje/550-rime-silver.webp",
    colors: [
      { name: "Rime Silver", sr: "srebrna", hex: "#b9bdc1", image: "/atv/boje/550-rime-silver.webp" },
      { name: "Shadow White", sr: "bela", hex: "#ecebe7", image: "/atv/boje/550-shadow-white.webp" },
      { name: "Furious Orange", sr: "narandžasta", hex: "#e8621c", image: "/atv/boje/550-furious-orange.webp" },
      { name: "Desert Yellow", sr: "pustinjsko žuta", hex: "#c8a35b", image: "/atv/boje/550-desert-yellow.webp" },
      { name: "Polar Night Black", sr: "crna", hex: "#1d1f22", image: "/atv/boje/550-polar-night-black.webp" },
    ],
    stats: [
      { value: "48", unit: "KS", label: "snaga motora" },
      { value: "498", unit: "cm³", label: "zapremina, V2" },
      { value: "900", unit: "kg", label: "vuča sa kočnicom" },
      { value: "425", unit: "kg", label: "suva masa" },
    ],
    equipment: EQUIPMENT,
    specs: [
      { group: "Motor i prenos", rows: [["Motor", ENGINE], ["Zapremina", "498,4 cm³"], ["Snaga", "48 KS"], ["Obrtni moment", "46 Nm / 5500 o/min"], ["Napajanje / hlađenje", "EFI / tečno"], ["Menjač", "CVT, L/H/N/R/P"], ["Pogon", "2WD / 4WD na izbor, blokada diferencijala"]] },
      { group: "Vešanje", rows: [["Prednje vešanje", "Dvostruka A-ruka sa stabilizatorom, hod 230 mm"], ["Prednji amortizeri", "Podesivi gasni"], ["Zadnje vešanje", "Dvostruka A-ruka"], ["Zadnji amortizeri", "Podesivi gasni"]] },
      { group: "Točkovi i kočnice", rows: [["Prednje gume", "26×9-14\""], ["Zadnje gume", "26×11-14\""], ["Felne", "14\" aluminijumske, beadlock"], ["Kočnice", "Hidraulične disk, napred i nazad, ABS"]] },
      { group: "Dimenzije i kapaciteti", rows: [["D × Š × V", "2365 × 1245 × 1450 mm"], ["Međuosovinsko rastojanje", "1500 mm"], ["Klirens", "305 mm"], ["Suva masa", "425 kg"], ["Vuča sa kočnicom", "900 kg"], ["Rezervoar", "30 l"], ["Visina sedišta", "950 mm"]] },
    ],
    href: "/atv/redstone-550-r2",
  },
  {
    slug: "redstone-1000-r2",
    name: "Benda Redstone 1000 R2",
    tagline: "Najsnažniji kvad u klasi - 102 KS.",
    price: "10.990 €",
    priceNote: "kofer na poklon, metalik boje bez doplate",
    onSale: true,
    saleBadge: "Poklon",
    image: "/atv/boje/1000-flash-silver.webp",
    colors: [
      { name: "Flash Silver", sr: "srebrna", hex: "#c3c6c9", image: "/atv/boje/1000-flash-silver.webp" },
      { name: "Obsidian Black", sr: "crna", hex: "#16181b", image: "/atv/boje/1000-obsidian-black.webp" },
      { name: "Furious Orange", sr: "narandžasta", hex: "#e8621c", image: "/atv/boje/1000-furious-orange.webp" },
      { name: "Sunflare Gold", sr: "zlatna", hex: "#c99a2e", image: "/atv/boje/1000-sunflare-gold.webp" },
      { name: "Slate Grey", sr: "tamnosiva", hex: "#5b6066", image: "/atv/boje/1000-slate-grey.webp" },
      { name: "Crimson Red", sr: "crvena", hex: "#a8182a", image: "/atv/boje/1000-crimson-red.webp" },
      { name: "Blade White", sr: "bela", hex: "#f1f1ee", image: "/atv/boje/1000-blade-white.webp" },
    ],
    stats: [
      { value: "102", unit: "KS", label: "snaga motora" },
      { value: "997", unit: "cm³", label: "zapremina, V2" },
      { value: "980", unit: "kg", label: "vuča sa kočnicom" },
      { value: "440", unit: "kg", label: "suva masa" },
    ],
    equipment: [...EQUIPMENT, "Grejači ručica i sedišta", "Prednji i zadnji roll bar"],
    specs: [
      { group: "Motor i prenos", rows: [["Motor", ENGINE], ["Zapremina", "997,1 cm³"], ["Snaga", "102 KS"], ["Obrtni moment", "92 Nm / 6500 o/min"], ["Napajanje / hlađenje", "EFI / tečno"], ["Menjač", "CVT, L/H/N/R/P"], ["Pogon", "2WD / 4WD na izbor, blokada diferencijala"]] },
      { group: "Vešanje", rows: [["Prednje vešanje", "Dvostruka A-ruka sa stabilizatorom, hod 230 mm"], ["Prednji amortizeri", "Podesivi gasni"], ["Zadnje vešanje", "Nezavisno, torziona vučena ruka, hod 230 mm"], ["Zadnji amortizeri", "Podesivi gasni"]] },
      { group: "Točkovi i kočnice", rows: [["Prednje gume", "27×9-14\""], ["Zadnje gume", "27×11-14\""], ["Felne", "14\" aluminijumske, beadlock"], ["Kočnice", "Hidraulične disk, napred i nazad, ABS"]] },
      { group: "Dimenzije i kapaciteti", rows: [["D × Š × V", "2370 × 1280 × 1520 mm"], ["Međuosovinsko rastojanje", "1500 mm"], ["Klirens", "320 mm"], ["Suva masa", "440 kg"], ["Vuča sa kočnicom", "980 kg"], ["Rezervoar", "30 l"], ["Visina sedišta", "950 mm"]] },
    ],
    href: "/atv/redstone-1000-r2",
  },
];

/* za sekciju na početnoj (AtvSection) */
export const atv = {
  eyebrow: "Novo u ponudi",
  heading: "Benda ATV vozila",
  text: "Kvadovi za njivu, šumu i teren. Pogon na sva četiri točka, zaključavanje diferencijala, vitlo i kuka u standardnoj opremi. Produžena garancija 3 godine ili 8.000 km.",
  image: "/atv/benda-teren.jpg",
  cta: { label: "Pogledaj ATV vozila", href: "/atv" },
  models: atvModels.map((m) => ({
    key: m.slug,
    name: m.name,
    price: m.price,
    priceNote: m.priceNote,
    image: m.image,
    href: m.href,
    specs: [
      { label: "Motor", value: m.specs[0].rows[1][1] + ", V2" },
      { label: "Snaga", value: m.stats[0].value + " KS" },
      { label: "Vuča", value: m.stats[2].value + " kg" },
    ],
  })),
};
