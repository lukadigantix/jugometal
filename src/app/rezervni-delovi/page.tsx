import type { Metadata } from "next";
import { withSeo } from "@/lib/seo";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ShopCatalog from "@/components/ShopCatalog";
import { getPartsData } from "@/lib/catalog";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/rezervni-delovi", {
    title: "Online prodavnica rezervnih delova za traktore | Jugometal",
    description: "Rezervni delovi za IMT, Massey Ferguson, Landini, Jinma, Solis i priključne mašine (SIP, Agromehanika, INO, Majevica) sa cenama. Poručite online.",
    alternates: { canonical: "/rezervni-delovi" },
  });
}

export default async function Page() {
  const data = await getPartsData();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ShopCatalog data={data} />
      </main>
      <Footer />
    </div>
  );
}
