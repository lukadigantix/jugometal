import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LegalPage from "@/components/LegalPage";
import company from "@/data/company.json";

export const metadata: Metadata = { title: "Uslovi korišćenja i kupovine | Jugometal", alternates: { canonical: "/uslovi-koriscenja" } };

export default function Page() {
  const hq = company.locations[0];
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <LegalPage title="Uslovi korišćenja i kupovine" updated="nacrt, 2026.">
          <section>
            <h2>1. Prodavac</h2>
            <p>
              {company.legalName}, {hq.street}, {hq.postalCode} {hq.city}. E-mail: {company.email}, telefon: {hq.phone}, rezervni delovi: {hq.phoneParts}. PIB i matični broj: [dopuniti].
            </p>
          </section>
          <section>
            <h2>2. Proizvodi i cene</h2>
            <p>Cene rezervnih delova su izražene u dinarima [dopuniti: sa ili bez PDV-a]. Cene traktora, priključnih mašina i ATV vozila daju se na upit, osim gde je drugačije navedeno. Slike i podaci su informativni; tačnu specifikaciju potvrđujemo uz ponudu.</p>
          </section>
          <section>
            <h2>3. Porudžbina</h2>
            <p>Porudžbinu šaljete iz <Link href="/korpa" className="underline">korpe</Link>. Ugovor je zaključen kada vam potvrdimo dostupnost, cenu dostave i način plaćanja, telefonom ili e-mailom.</p>
          </section>
          <section>
            <h2>4. Isporuka i plaćanje</h2>
            <p>[Dopuniti: kurirska služba, cena i rok isporuke, plaćanje pouzećem / uplatom na račun / karticom.]</p>
          </section>
          <section>
            <h2>5. Odustanak od ugovora</h2>
            <p>Kod kupovine na daljinu imate pravo da odustanete u roku od 14 dana od prijema robe, bez navođenja razloga, u skladu sa Zakonom o zaštiti potrošača. Izjavu o odustanku pošaljite na {company.email}. [Dopuniti: ko snosi trošak povraćaja i izuzeci.]</p>
          </section>
          <section>
            <h2>6. Reklamacije</h2>
            <p>Reklamaciju možete izjaviti usmeno u prodajnom objektu, telefonom, pisanim putem ili e-mailom na {company.email}. Odgovaramo u zakonskom roku.</p>
          </section>
        </LegalPage>
      </main>
      <Footer />
    </div>
  );
}
