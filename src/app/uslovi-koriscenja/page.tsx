import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import LegalPage from "@/components/LegalPage";
import { getSiteInfo } from "@/lib/site-info";

export const metadata: Metadata = {
  title: "Uslovi korišćenja i kupovine | Jugometal",
  description: "Uslovi kupovine u Jugometal online prodavnici: porudžbina, cene, plaćanje, isporuka, odustanak od ugovora i reklamacije.",
  alternates: { canonical: "/uslovi-koriscenja" },
};

export default async function Page() {
  const { contact: hq } = await getSiteInfo();
  const ids = [hq.pib && `PIB ${hq.pib}`, hq.mb && `matični broj ${hq.mb}`].filter(Boolean).join(", ");
  const mail = <a href={`mailto:${hq.email}`}>{hq.email}</a>;
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <LegalPage
          doc="uslovi"
          title="Uslovi korišćenja"
          intro={
            <>
              Pravila kupovine na sajtu: cene, porudžbina, isporuka i plaćanje,
              <br />
              odustanak od ugovora i reklamacije.
            </>
          }
          updated="Nacrt 2026"
          contact={hq}
          sections={[
            {
              title: "Prodavac",
              body: (
                <p>
                  {[hq.name, hq.street, hq.city].filter(Boolean).join(", ")}. E-mail: {hq.email}, telefon: {hq.phone}
                  {hq.phoneParts && `, rezervni delovi: ${hq.phoneParts}`}. {ids ? `${ids}.` : "PIB i matični broj: [dopuniti]."}
                </p>
              ),
            },
            {
              title: "Proizvodi i cene",
              body: <p>Cene rezervnih delova su izražene u dinarima [dopuniti: sa ili bez PDV-a]. Cene traktora, priključnih mašina i ATV vozila daju se na upit, osim gde je drugačije navedeno. Slike i podaci su informativni; tačnu specifikaciju potvrđujemo uz ponudu.</p>,
            },
            {
              title: "Porudžbina",
              body: (
                <p>
                  Porudžbinu šaljete iz <Link href="/korpa">korpe</Link>. Ugovor je zaključen kada vam potvrdimo dostupnost, cenu dostave i način plaćanja, telefonom ili e-mailom.
                </p>
              ),
            },
            {
              title: "Isporuka i plaćanje",
              body: <p>[Dopuniti: kurirska služba, cena i rok isporuke, plaćanje pouzećem / uplatom na račun / karticom.]</p>,
            },
            {
              title: "Odustanak od ugovora",
              body: (
                <p>
                  Kod kupovine na daljinu imate pravo da odustanete u roku od 14 dana od prijema robe, bez navođenja razloga, u skladu sa Zakonom o zaštiti potrošača. Izjavu o odustanku pošaljite na {mail}. [Dopuniti: ko snosi trošak povraćaja i izuzeci.]
                </p>
              ),
            },
            {
              title: "Reklamacije",
              body: <p>Reklamaciju možete izjaviti usmeno u prodajnom objektu, telefonom, pisanim putem ili e-mailom na {mail}. Odgovaramo u zakonskom roku.</p>,
            },
          ]}
        />
      </main>
      <Footer />
    </div>
  );
}
