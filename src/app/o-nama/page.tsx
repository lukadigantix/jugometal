import type { Metadata } from "next";
import { AboutCta, AboutHero, AboutIntro, AboutValues } from "@/components/AboutPage";
import EditorialCards from "@/components/EditorialCards";
import ExploreCategories from "@/components/ExploreCategories";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Locations from "@/components/Locations";
import { PartnersMarquee } from "@/components/Partners";

export const metadata: Metadata = {
  title: "O nama | Jugometal Svilajnac",
  description:
    "Jugometal d.o.o. Svilajnac, osnovan 1990. godine - prodaja i servis traktora, priključnih mašina i rezervnih delova u Svilajncu, Temerinu i Požarevcu.",
  alternates: { canonical: "/o-nama" },
};

export default function ONama() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <AboutHero />
        <AboutIntro />
        <AboutValues />
        <ExploreCategories />
        <EditorialCards />
        <section className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-9 md:pb-24">
          <PartnersMarquee bare title="Brendovi koje prodajemo i servisiramo" />
        </section>
        <Locations />
        <AboutCta />
      </main>
      <Footer />
    </div>
  );
}
