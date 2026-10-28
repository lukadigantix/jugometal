import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MachineCatalog from "@/components/MachineCatalog";

export const metadata: Metadata = {
  title: "Priključne mašine - plugovi, sejalice, prskalice, balirke | Jugometal",
  description: "Priključne mašine za ratarstvo, stočarstvo, voćarstvo i transport: plugovi, freze, sejalice, prskalice, atomizeri, mulčari, kosačice, balirke, prikolice.",
  alternates: { canonical: "/prikljucne-masine" },
};

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <MachineCatalog />
      </main>
      <Footer />
    </div>
  );
}
