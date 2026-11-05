import type { Metadata } from "next";
import Checkout from "@/components/korpa/Checkout";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

/* 2. korak kupovine: podaci kupca, isporuka i plaćanje, pa potvrda (components/korpa/Checkout.tsx). */
export const metadata: Metadata = {
  title: "Porudžbina | Jugometal online prodavnica",
  robots: { index: false, follow: false },
  alternates: { canonical: "/porudzbina" },
};

export default function Porudzbina() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Checkout />
      </main>
      <Footer />
    </div>
  );
}
