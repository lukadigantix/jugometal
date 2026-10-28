import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ShopCatalog from "@/components/ShopCatalog";

export const metadata: Metadata = {
  title: "Online prodavnica rezervnih delova za traktore | Jugometal",
  description: "Rezervni delovi za IMT, Massey Ferguson, Landini, Jinma, Solis i priključne mašine (SIP, Agromehanika, INO, Majevica) sa cenama. Poručite online.",
  alternates: { canonical: "/rezervni-delovi" },
};

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ShopCatalog />
      </main>
      <Footer />
    </div>
  );
}
