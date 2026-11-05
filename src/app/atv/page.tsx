import type { Metadata } from "next";
import { withSeo } from "@/lib/seo";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import AtvLanding from "@/components/AtvLanding";

export async function generateMetadata(): Promise<Metadata> {
  return withSeo("/atv", {
    title: "Benda ATV - Redstone 550 R2 i 1000 R2 | Jugometal",
    description: "Benda Redstone kvadovi u prodaji: 550 R2 (48 KS) i 1000 R2 (102 KS). Garancija 3 godine ili 8.000 km.",
    alternates: { canonical: "/atv" },
  });
}

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <AtvLanding />
      </main>
      <Footer />
    </div>
  );
}
