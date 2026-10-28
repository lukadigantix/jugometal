import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import PartPage from "@/components/PartPage";
import { breadcrumb, product } from "@/lib/schema";
import { formatRsd, searchIndex } from "@/data/featured-parts";

export function generateStaticParams() {
  return searchIndex.map((p) => ({ group: p.group, brand: p.sub, part: p.slug }));
}

const find = (group: string, brand: string, part: string) => searchIndex.find((x) => x.group === group && x.sub === brand && x.slug === part);

export async function generateMetadata({ params }: PageProps<"/rezervni-delovi/[group]/[brand]/[part]">): Promise<Metadata> {
  const { group, brand, part } = await params;
  const p = find(group, brand, part);
  if (!p) return {};
  const code = p.code && !/\s/.test(p.code) ? ` (${p.code})` : "";
  return {
    title: `${p.name}${code} - ${formatRsd(p.priceRsd)} | Jugometal`,
    description: `${p.name}${code}, ${p.brand}. Cena ${formatRsd(p.priceRsd)}. Poručite online ili pozovite 035/311-137.`,
    alternates: { canonical: p.href },
    openGraph: p.image ? { images: [p.image] } : undefined,
  };
}

export default async function Page({ params }: PageProps<"/rezervni-delovi/[group]/[brand]/[part]">) {
  const { group, brand, part } = await params;
  const p = find(group, brand, part);
  if (!p) notFound();
  const code = p.code && !/\s/.test(p.code) ? p.code : undefined;
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <JsonLd data={product({ name: p.name, image: p.image, brand: p.brand, sku: code, path: p.href, price: p.priceRsd })} />
        <JsonLd data={breadcrumb([["Početna", "/"], ["Online prodavnica", "/rezervni-delovi"], [p.brand, `/rezervni-delovi/${group}/${brand}`], [p.name, p.href]])} />
        <PartPage group={group} brand={brand} part={part} />
      </main>
      <Footer />
    </div>
  );
}
