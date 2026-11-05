import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LegalPage from "@/components/LegalPage";
import { getSiteInfo } from "@/lib/site-info";

export const metadata: Metadata = {
  title: "Politika privatnosti | Jugometal",
  description: "Kako Jugometal d.o.o. Svilajnac prikuplja, koristi i čuva lične podatke kupaca i posetilaca sajta, i koja su vaša prava.",
  alternates: { canonical: "/politika-privatnosti" },
};

export default async function Page() {
  const { contact: hq } = await getSiteInfo();
  const ids = [hq.pib && `PIB ${hq.pib}`, hq.mb && `matični broj ${hq.mb}`].filter(Boolean).join(", ");
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <LegalPage
          doc="privatnost"
          title="Politika privatnosti"
          intro="Koje podatke prikupljamo kada nam pišete, tražite ponudu ili poručujete, zašto ih koristimo i kako možete da ih proverite ili obrišete."
          updated="Nacrt 2026"
          contact={hq}
          sections={[
            {
              title: "Rukovalac podacima",
              body: (
                <p>
                  {[hq.name, hq.street, hq.city].filter(Boolean).join(", ")}. E-mail: {hq.email}, telefon: {hq.phone}. {ids ? `${ids}.` : "PIB i matični broj: [dopuniti]."}
                </p>
              ),
            },
            {
              title: "Koje podatke prikupljamo",
              body: (
                <ul>
                  <li>podatke koje sami unesete u formu za kontakt, upit za ponudu, zakazivanje servisa ili porudžbinu: ime i prezime, telefon, e-mail, adresu, mesto i poruku;</li>
                  <li>sadržaj korpe, koji se čuva samo u vašem pregledaču (localStorage) i ne šalje nam se dok ne pošaljete porudžbinu;</li>
                  <li>osnovne tehničke podatke o poseti, ako koristimo alate za analitiku [dopuniti koje].</li>
                </ul>
              ),
            },
            {
              title: "Svrha i osnov obrade",
              body: <p>Podatke koristimo isključivo da odgovorimo na upit, pripremimo ponudu, izvršimo i isporučimo porudžbinu i zakažemo servis. Osnov je vaš zahtev i izvršenje ugovora, u skladu sa Zakonom o zaštiti podataka o ličnosti.</p>,
            },
            {
              title: "Koliko čuvamo podatke",
              body: <p>Onoliko koliko je potrebno za svrhu zbog koje su dati i koliko zahtevaju propisi o računovodstvu i poreskoj evidenciji [dopuniti rok].</p>,
            },
            {
              title: "Kome dostavljamo podatke",
              body: <p>Podatke ne prodajemo. Dostavljamo ih samo kurirskoj službi radi isporuke i pružaocima usluga koji nam tehnički omogućavaju rad sajta [dopuniti], uz obavezu poverljivosti.</p>,
            },
            {
              title: "Vaša prava",
              body: (
                <p>
                  Imate pravo na pristup, ispravku, brisanje i ograničenje obrade svojih podataka, kao i pravo na prigovor. Zahtev pošaljite na <a href={`mailto:${hq.email}`}>{hq.email}</a>. Pritužbu možete podneti Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti.
                </p>
              ),
            },
          ]}
        />
      </main>
      <Footer />
    </div>
  );
}
