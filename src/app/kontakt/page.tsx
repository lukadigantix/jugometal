import type { Metadata } from "next";
import { ContactCompany, ContactForm, ContactHero, ContactLocations } from "@/components/ContactPage";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Kontakt | Jugometal Svilajnac, Temerin, Požarevac",
  description:
    "Kontakt Jugometal d.o.o. - Svilajnac 035/312-391, Temerin 021/840-038, Požarevac 012/665-544, rezervni delovi 035/311-137, info@jugometal.co.rs.",
  alternates: { canonical: "/kontakt" },
};

export default function Kontakt() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ContactHero />
        <ContactLocations />
        <ContactForm />
        <ContactCompany />
      </main>
      <Footer />
    </div>
  );
}
