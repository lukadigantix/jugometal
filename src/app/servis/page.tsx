import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Locations from "@/components/Locations";
import { PartnersMarquee } from "@/components/Partners";
import { ServiceAreas, ServiceBooking, ServiceHero } from "@/components/ServicePage";
import ShopFeatured from "@/components/ShopFeatured";

export const metadata: Metadata = {
  title: "Servis traktora i mehanizacije | Jugometal Svilajnac",
  description:
    "Servis IMT, IMR, Massey Ferguson, Solis, YTO, John Deere i Mahindra traktora i originalni rezervni delovi - Svilajnac, Temerin, Požarevac.",
  alternates: { canonical: "/servis" },
};

export default function Servis() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ServiceHero />
        <ServiceAreas />
        <ServiceBooking />
        <ShopFeatured />
        <section className="mx-auto w-full max-w-[1600px] px-4 py-14 md:px-9 md:py-24">
          <PartnersMarquee bare title="Brendovi koje servisiramo i za koje imamo delove" />
        </section>
        <Locations />
      </main>
      <Footer />
    </div>
  );
}
