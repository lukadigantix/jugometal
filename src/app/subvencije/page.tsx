import type { Metadata } from "next";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { SubsidyCta, SubsidyFaq, SubsidyHero, SubsidyPrograms, SubsidySteps } from "@/components/SubsidyPage";

export const metadata: Metadata = {
  title: "Subvencije i finansiranje | Jugometal Svilajnac",
  description:
    "Kupovina traktora i priključnih mašina uz subvencije Ministarstva poljoprivrede, IPARD i lokalne konkurse. Jugometal priprema ponudu za prijavu.",
  alternates: { canonical: "/subvencije" },
};

export default function Subvencije() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <SubsidyHero />
        <SubsidyPrograms />
        <SubsidySteps />
        <FeaturedProducts />
        <div className="h-14 md:h-24" />
        <SubsidyFaq />
        <SubsidyCta />
      </main>
      <Footer />
    </div>
  );
}
