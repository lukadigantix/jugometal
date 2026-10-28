/* IMT 565.2 DI - izdvojeni model na početnoj. Karakteristike: zvanična TAFE/IMT specifikacija
 * (tafe.com/tractors/imt/TAFE-IMT-tractor-565.2.php, imttractors.com), prevedeno. Slike: tafe.com, imttractors.com. */
export const imt = {
  eyebrow: "Izdvajamo iz ponude · IMT",
  name: "IMT 565.2 DI",
  tagline: "Legenda domaćih njiva u novoj generaciji.",
  text: "Najjači IMT u ponudi: 63 KS, pogon na sva četiri točka i 2050 kg podizne moći. Jednostavan za održavanje, delovi uvek na stanju.",
  banner: "/imt/imt-565-banner.jpg",
  image: "/imt/imt-565.jpg",
  href: "/traktori/imt/imt-5652-di",
  partsHref: "/rezervni-delovi/traktorski-delovi/imt",
  stats: [
    { value: "63", unit: "KS", label: "snaga motora" },
    { value: "4WD", unit: "", label: "pogon na sva 4 točka" },
    { value: "2050", unit: "kg", label: "podizna moć" },
    { value: "8+2", unit: "", label: "brzina napred / nazad" },
  ],
  specs: [
    {
      group: "Motor i prenos",
      rows: [
        ["Snaga", "63 KS, EU II"],
        ["Pogon", "4WD"],
        ["Spojnica", "Dvostruka"],
        ["Menjač", "8 + 2, središnja ručica"],
        ["Priključno vratilo", "540 o/min"],
        ["Krajnji prenos", "Planetarni"],
      ],
    },
    {
      group: "Hidraulika i upravljanje",
      rows: [
        ["Hidraulika", "Uronjena u ulje"],
        ["Podizna moć", "2050 kg"],
        ["Razvodnik", "Dvostruki"],
        ["Upravljanje", "Hidrostatičko"],
      ],
    },
    {
      group: "Točkovi, kočnice, oprema",
      rows: [
        ["Prednje gume", "9.5 x 24"],
        ["Zadnje gume", "16.9 x 28"],
        ["Kočnice", "U uljnom kupatilu"],
        ["Zadnji tegovi", "2 x 45 kg"],
        ["Klateća poteznica i kompresor", "Da"],
        ["Opciono", "ROPS zaštitni ram"],
      ],
    },
  ],
  uses: ["Košenje", "Setva", "Freza", "Rasturanje đubriva", "Transport", "Prednji utovarivač", "Ralica za sneg"],
  siblings: [
    { name: "IMT 539.2 DI", note: "47 KS · 2WD", href: "/traktori/imt/imt-5393-di" },
    { name: "IMT 549.3 DI", note: "47 KS · 4WD", href: "/traktori/imt/imt-5493-di" },
  ],
};
