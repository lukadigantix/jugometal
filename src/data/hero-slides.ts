/* Hero slajder: 4 slajda = ponuda (ne pojedinačni modeli - za njih nema profesionalnih fotografija).
 * Fotografije: Pexels (besplatna licenca, bez obaveze potpisa), izvori u docs/reference/hero-izvori.txt */
export const heroSlides = [
  {
    key: "traktori",
    label: "Traktori",
    eyebrow: "Solis · IMT · John Deere · YTO · Mahindra",
    title: "Traktori za svaku njivu.",
    text: "Pet brendova, 23 modela od 20 do 130 KS. Prodaja, servis i rezervni delovi na jednom mestu.",
    image: "/hero/traktori.jpg",
    imagePosition: "85% 100%", // traktor je dole desno (slika je preslikana horizontalno), tekst levo
    cta: { label: "Pogledaj traktore", href: "/traktori" },
    secondary: { label: "Zatraži ponudu", href: "/kontakt" },
  },
  {
    key: "prikljucne-masine",
    label: "Priključne mašine",
    eyebrow: "Ratarstvo · stočarstvo · voćarstvo · transport",
    title: "Mašine koje rade koliko i vi.",
    text: "Plugovi, sejalice, prskalice, kosačice, balirke, prikolice - 15 kategorija od proverenih proizvođača.",
    image: "/hero/prikljucne-masine.jpg",
    imagePosition: "55% 60%",
    cta: { label: "Pogledaj mašine", href: "/prikljucne-masine" },
    secondary: { label: "Sve kategorije", href: "/prikljucne-masine" },
  },
  {
    key: "online-prodavnica",
    label: "Online prodavnica",
    eyebrow: "Rezervni delovi sa cenom",
    title: "Deo koji vam treba, na vašoj adresi.",
    text: "Originalni i zamenski delovi za IMT, Solis, YTO, Massey Ferguson, Landini, Jinma i priključne mašine. Poručite online.",
    image: "/hero/online-prodavnica.jpg",
    imagePosition: "50% 30%",
    cta: { label: "Otvori prodavnicu", href: "/rezervni-delovi" },
    secondary: { label: "Kako poručiti", href: "/rezervni-delovi" },
  },
  {
    key: "servis",
    label: "Servis",
    eyebrow: "Svilajnac · Temerin · Požarevac",
    title: "Servis koji ne čeka sezonu.",
    text: "Stručna servisna služba i originalni delovi na stanju - zastoj u radu sveden na minimum.",
    image: "/hero/servis.jpg",
    imagePosition: "50% 40%",
    cta: { label: "Više o servisu", href: "/servis" },
    secondary: { label: "Zakaži servis", href: "/kontakt" },
  },
];
