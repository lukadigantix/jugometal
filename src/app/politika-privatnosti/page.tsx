import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LegalPage from "@/components/LegalPage";
import company from "@/data/company.json";

export const metadata: Metadata = { title: "Politika privatnosti | Jugometal", alternates: { canonical: "/politika-privatnosti" } };

export default function Page() {
  const hq = company.locations[0];
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <LegalPage title="Politika privatnosti" updated="nacrt, 2026.">
          <section>
            <h2>1. Rukovalac podacima</h2>
            <p>
              {company.legalName}, {hq.street}, {hq.postalCode} {hq.city}. E-mail: {company.email}, telefon: {hq.phone}. PIB i matični broj: [dopuniti].
            </p>
          </section>
          <section>
            <h2>2. Koje podatke prikupljamo</h2>
            <ul>
              <li>podatke koje sami unesete u formu za kontakt, upit za ponudu, zakazivanje servisa ili porudžbinu: ime i prezime, telefon, e-mail, adresu, mesto i poruku;</li>
              <li>sadržaj korpe, koji se čuva samo u vašem pregledaču (localStorage) i ne šalje nam se dok ne pošaljete porudžbinu;</li>
              <li>osnovne tehničke podatke o poseti, ako koristimo alate za analitiku [dopuniti koje].</li>
            </ul>
          </section>
          <section>
            <h2>3. Svrha i osnov obrade</h2>
            <p>Podatke koristimo isključivo da odgovorimo na upit, pripremimo ponudu, izvršimo i isporučimo porudžbinu i zakažemo servis. Osnov je vaš zahtev i izvršenje ugovora, u skladu sa Zakonom o zaštiti podataka o ličnosti.</p>
          </section>
          <section>
            <h2>4. Koliko čuvamo podatke</h2>
            <p>Onoliko koliko je potrebno za svrhu zbog koje su dati i koliko zahtevaju propisi o računovodstvu i poreskoj evidenciji [dopuniti rok].</p>
          </section>
          <section>
            <h2>5. Kome dostavljamo podatke</h2>
            <p>Podatke ne prodajemo. Dostavljamo ih samo kurirskoj službi radi isporuke i pružaocima usluga koji nam tehnički omogućavaju rad sajta [dopuniti], uz obavezu poverljivosti.</p>
          </section>
          <section>
            <h2>6. Vaša prava</h2>
            <p>Imate pravo na pristup, ispravku, brisanje i ograničenje obrade svojih podataka, kao i pravo na prigovor. Zahtev pošaljite na {company.email}. Pritužbu možete podneti Povereniku za informacije od javnog značaja i zaštitu podataka o ličnosti.</p>
          </section>
        </LegalPage>
      </main>
      <Footer />
    </div>
  );
}
