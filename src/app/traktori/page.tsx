import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import TractorCatalog from "@/components/TractorCatalog";

export const metadata: Metadata = {
  title: "Traktori Solis, IMT, John Deere, YTO, Mahindra | Jugometal",
  description: "Prodaja novih traktora Solis, IMT, John Deere, YTO i Mahindra od 20 do 130 KS - Svilajnac, Temerin, Požarevac. Servis i rezervni delovi.",
  alternates: { canonical: "/traktori" },
};

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <TractorCatalog />
      </main>
      <Footer />
    </div>
  );
}
