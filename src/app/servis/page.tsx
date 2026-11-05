import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { PartnersMarquee } from "@/components/Partners";
import { ServiceAreas, ServiceBooking, ServiceHero } from "@/components/ServicePage";
import ShopFeatured from "@/components/ShopFeatured";
import { getPartsData } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Servis traktora i mehanizacije | Jugometal Svilajnac",
  description:
    "Servis IMT, IMR, Massey Ferguson, Solis, YTO, John Deere i Mahindra traktora i originalni rezervni delovi - Jugometal Svilajnac.",
  alternates: { canonical: "/servis" },
};

export default async function Servis() {
  const parts = await getPartsData();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ServiceHero />
        <ServiceAreas />
        <ServiceBooking />
        <ShopFeatured data={parts} />
        <section className="mx-auto w-full max-w-[1600px] px-4 pb-14 md:px-9 md:pb-24">
          <PartnersMarquee bare title="Brendovi koje servisiramo i za koje imamo delove" />
        </section>
      </main>
      <Footer />
    </div>
  );
}
