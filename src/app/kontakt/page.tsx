import type { Metadata } from "next";
import { ContactCompany, ContactForm, ContactHero, ContactLocations } from "@/components/ContactPage";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getSiteInfo } from "@/lib/site-info";
import { withSeo } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { contact: c } = await getSiteInfo();
  const parts = [c.phone && `prodaja ${c.phone}`, c.phoneParts && `rezervni delovi ${c.phoneParts}`, c.email].filter(Boolean).join(", ");
  return withSeo("/kontakt", {
    title: "Kontakt | Jugometal Svilajnac",
    description: `Kontakt ${c.name || "Jugometal d.o.o. Svilajnac"}${c.street ? `, ${c.street}` : ""}${c.city ? `, ${c.city}` : ""}${parts ? ` - ${parts}` : ""}.`,
    alternates: { canonical: "/kontakt" },
  });
}

export default async function Kontakt() {
  const site = await getSiteInfo();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ContactHero />
        <ContactForm />
        <ContactLocations hours={site.workingHours} />
        <ContactCompany />
      </main>
      <Footer />
    </div>
  );
}
