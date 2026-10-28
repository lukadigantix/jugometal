import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import TractorPage from "@/components/TractorPage";
import { breadcrumb, product } from "@/lib/schema";
import list from "@/data/tractor-list.json";

export function generateStaticParams() {
  return list.map((t) => ({ brand: t.brand, model: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/traktori/[brand]/[model]">): Promise<Metadata> {
  const { brand, model } = await params;
  const t = list.find((x) => x.brand === brand && x.slug === model);
  if (!t) return {};
  return {
    title: `${t.name} - ${t.ks} KS${t.drive ? ` ${t.drive}` : ""} | Jugometal`,
    description: `${t.name}: ${t.text.slice(0, 120)} Cena na upit, servis i delovi - Svilajnac, Temerin, Požarevac.`,
    alternates: { canonical: t.href },
    openGraph: { images: [t.image] },
  };
}

export default async function Page({ params }: PageProps<"/traktori/[brand]/[model]">) {
  const { brand, model } = await params;
  const t = list.find((x) => x.brand === brand && x.slug === model);
  if (!t) notFound();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <JsonLd data={product({ name: t.name, image: t.image, description: t.text, brand: t.brandName, path: t.href })} />
        <JsonLd data={breadcrumb([["Početna", "/"], ["Traktori", "/traktori"], [t.brandName, `/traktori/${brand}`], [t.name, t.href]])} />
        <TractorPage brand={brand} model={model} />
      </main>
      <Footer />
    </div>
  );
}
