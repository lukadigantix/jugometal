import type { Metadata } from "next";
import AkcijePage from "@/components/AkcijePage";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getShopCatalog } from "@/lib/catalog";
import { getPromotions } from "@/lib/promotions";
import { getSiteInfo } from "@/lib/site-info";

export const metadata: Metadata = {
  title: "Akcije | Jugometal Svilajnac",
  description: "Akcijske cene, pokloni uz kupovinu i ograničene količine: traktori, priključne mašine, rezervni delovi i Benda ATV u Jugometalu Svilajnac.",
  alternates: { canonical: "/akcije" },
};

/* Akcije: artikli na akciji iz admina (sve vrste) + Benda ATV ponude; period važenja iz aktivnih akcija. */
export default async function Akcije() {
  const [catalog, promotions, site] = await Promise.all([getShopCatalog(), getPromotions(), getSiteInfo()]);
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <AkcijePage saleItems={catalog.saleItems} promotions={promotions} contact={site.contact} />
      </main>
      <Footer />
    </div>
  );
}
