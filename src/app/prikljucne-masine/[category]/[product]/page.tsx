import type { Metadata } from "next";
import { withSeo } from "@/lib/seo";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import MachinePage from "@/components/MachinePage";
import { breadcrumb } from "@/lib/schema";
import list from "@/data/machine-list.json";

export function generateStaticParams() {
  return list.map((m) => ({ category: m.category, product: m.slug }));
}

/** opis do ~155 znakova, prekinut na celoj reči */
const short = (t: string) => (t.length <= 155 ? t : `${t.slice(0, 152).replace(/\s+\S*$/, "")}…`);

export async function generateMetadata({ params }: PageProps<"/prikljucne-masine/[category]/[product]">): Promise<Metadata> {
  const { category, product } = await params;
  const m = list.find((x) => x.category === category && x.slug === product);
  if (!m) return {};
  return withSeo(m.href, { title: `${m.name} - ${m.categoryName} | Jugometal`, description: short(`${m.name} (${m.brandName}): ${m.text}`), alternates: { canonical: m.href }, openGraph: { images: [m.image] } });
}

export default async function Page({ params }: PageProps<"/prikljucne-masine/[category]/[product]">) {
  const { category, product } = await params;
  const m = list.find((x) => x.category === category && x.slug === product);
  if (!m) notFound();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <JsonLd data={breadcrumb([["Početna", "/"], ["Priključne mašine", "/prikljucne-masine"], [m.categoryName, `/prikljucne-masine/${category}`], [m.name, m.href]])} />
        <MachinePage category={category} product={product} />
      </main>
      <Footer />
    </div>
  );
}
