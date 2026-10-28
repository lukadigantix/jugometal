import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import TractorCatalog from "@/components/TractorCatalog";
import catalog from "@/data/catalog.json";

export function generateStaticParams() {
  return catalog.tractorBrands.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/traktori/[brand]">): Promise<Metadata> {
  const { brand } = await params;
  const b = catalog.tractorBrands.find((x) => x.slug === brand);
  if (!b) return {};
  return {
    title: `${b.name} traktori - ${b.models.length} modela | Jugometal`,
    description: `${b.name} traktori u ponudi Jugometala: prodaja, servis i rezervni delovi. Svilajnac, Temerin, Požarevac.`,
    alternates: { canonical: `/traktori/${b.slug}` },
  };
}

export default async function Page({ params }: PageProps<"/traktori/[brand]">) {
  const { brand } = await params;
  if (!catalog.tractorBrands.some((x) => x.slug === brand)) notFound();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <TractorCatalog key={brand} brand={brand} />
      </main>
      <Footer />
    </div>
  );
}
