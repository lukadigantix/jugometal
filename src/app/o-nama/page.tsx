import type { Metadata } from "next";
import { AboutCta, AboutHero, AboutIntro, AboutValues } from "@/components/AboutPage";
import EditorialCards from "@/components/EditorialCards";
import ExploreCategories from "@/components/ExploreCategories";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { PartnersMarquee } from "@/components/Partners";
import { getShopCatalog } from "@/lib/catalog";
import { atvModels } from "@/data/atv";

export const metadata: Metadata = {
  title: "O nama | Jugometal Svilajnac",
  description:
    "Jugometal d.o.o. Svilajnac, osnovan 1990. godine - prodaja i servis traktora, priključnih mašina i rezervnih delova u Svilajncu.",
  alternates: { canonical: "/o-nama" },
};

export default async function ONama() {
  const catalog = await getShopCatalog();
  const stats = { tractorBrands: catalog.tractorBrands, parts: catalog.parts.length };
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <AboutHero stats={stats} />
        <AboutIntro stats={stats} />
        <AboutValues />
        <ExploreCategories
          data={{ tractorBrands: catalog.tractorBrands, machineCategories: catalog.machineCategories, partsCount: catalog.parts.length, atvCount: atvModels.length }}
        />
        <EditorialCards />
        <section className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-9 md:pb-24">
          <PartnersMarquee bare title="Brendovi koje prodajemo i servisiramo" />
        </section>
        <AboutCta />
      </main>
      <Footer />
    </div>
  );
}
