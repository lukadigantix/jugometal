import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import MachinePage from "@/components/MachinePage";
import { breadcrumb, product as schemaProduct } from "@/lib/schema";
import list from "@/data/machine-list.json";

export function generateStaticParams() {
  return list.map((m) => ({ category: m.category, product: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/prikljucne-masine/[category]/[product]">): Promise<Metadata> {
  const { category, product } = await params;
  const m = list.find((x) => x.category === category && x.slug === product);
  if (!m) return {};
  return { title: `${m.name} - ${m.categoryName} | Jugometal`, description: `${m.name} (${m.brandName}): ${m.text.slice(0, 120)}`, alternates: { canonical: m.href }, openGraph: { images: [m.image] } };
}

export default async function Page({ params }: PageProps<"/prikljucne-masine/[category]/[product]">) {
  const { category, product } = await params;
  const m = list.find((x) => x.category === category && x.slug === product);
  if (!m) notFound();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <JsonLd data={schemaProduct({ name: m.name, image: m.image, description: m.text, brand: m.brandName, path: m.href })} />
        <JsonLd data={breadcrumb([["Početna", "/"], ["Priključne mašine", "/prikljucne-masine"], [m.categoryName, `/prikljucne-masine/${category}`], [m.name, m.href]])} />
        <MachinePage category={category} product={product} />
      </main>
      <Footer />
    </div>
  );
}
