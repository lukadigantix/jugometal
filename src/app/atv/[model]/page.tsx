import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AtvPage from "@/components/AtvPage";
import JsonLd from "@/components/JsonLd";
import { breadcrumb, product } from "@/lib/schema";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { atvModels } from "@/data/atv";

export function generateStaticParams() {
  return atvModels.map((m) => ({ model: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/atv/[model]">): Promise<Metadata> {
  const { model } = await params;
  const m = atvModels.find((x) => x.slug === model);
  if (!m) return {};
  return { title: `${m.name} - ${m.stats[0].value} KS, ${m.price} | Jugometal`, description: `${m.name}: ${m.tagline} ${m.colors.length} boja, garancija 3 godine. Prodaja Jugometal Svilajnac.`, alternates: { canonical: m.href }, openGraph: { images: [m.image] } };
}

export default async function Page({ params }: PageProps<"/atv/[model]">) {
  const { model } = await params;
  const m = atvModels.find((x) => x.slug === model);
  if (!m) notFound();
  const eur = Number(m.price.replace(/[^\d]/g, ""));
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <JsonLd data={product({ name: m.name, image: m.image, description: m.tagline, brand: "Benda", path: m.href, price: eur, currency: "EUR" })} />
        <JsonLd data={breadcrumb([["Početna", "/"], ["Benda ATV", "/atv"], [m.name, m.href]])} />
        <AtvPage slug={model} />
      </main>
      <Footer />
    </div>
  );
}
