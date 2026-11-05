import type { Metadata } from "next";
import { withSeo } from "@/lib/seo";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JsonLd from "@/components/JsonLd";
import PartPage from "@/components/PartPage";
import { breadcrumb, product } from "@/lib/schema";
import { formatRsd, type PartItem } from "@/data/featured-parts";
import { getPartsData } from "@/lib/catalog";

export async function generateStaticParams() {
  const { searchIndex } = await getPartsData();
  return searchIndex.map((p) => ({ group: p.group, brand: p.sub, part: p.slug }));
}

const find = (searchIndex: PartItem[], group: string, brand: string, part: string) => searchIndex.find((x) => x.group === group && x.sub === brand && x.slug === part);

export async function generateMetadata({ params }: PageProps<"/rezervni-delovi/[group]/[brand]/[part]">): Promise<Metadata> {
  const { group, brand, part } = await params;
  const p = find((await getPartsData()).searchIndex, group, brand, part);
  if (!p) return {};
  const code = p.code && !/\s/.test(p.code) ? ` (${p.code})` : "";
  return withSeo(p.href, {
    title: `${p.name}${code} - ${formatRsd(p.priceRsd)} | Jugometal`,
    description: `${p.name}${code}${p.name.toLowerCase().startsWith(p.brand.toLowerCase()) ? "" : `, ${p.brand}`}. Cena ${formatRsd(p.priceRsd)}. Poručite online ili pozovite 035/311-137.`,
    alternates: { canonical: p.href },
    openGraph: p.image ? { images: [p.image] } : undefined,
  });
}

export default async function Page({ params }: PageProps<"/rezervni-delovi/[group]/[brand]/[part]">) {
  const { group, brand, part } = await params;
  const data = await getPartsData();
  const p = find(data.searchIndex, group, brand, part);
  if (!p) notFound();
  const code = p.code && !/\s/.test(p.code) ? p.code : undefined;
  // pregledaču ide samo ovaj deo, 4 slična istog brenda i njegova grupa, ne ceo katalog (~600 KB po strani)
  const related = data.searchIndex
    .filter((x) => x.sub === brand && x.id !== p.id)
    .sort((a, c) => Math.abs(a.priceRsd - p.priceRsd) - Math.abs(c.priceRsd - p.priceRsd))
    .slice(0, 4)
    .map((x) => ({ ...x, description: "", descriptionHtml: "", hay: "" }));
  const slim = { searchIndex: [p, ...related], partGroups: data.partGroups.filter((x) => x.slug === group) };
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <JsonLd data={product({ name: p.name, image: p.image, brand: p.brand, sku: code, path: p.href, price: p.priceRsd, stock: p.stockStatus })} />
        <JsonLd data={breadcrumb([["Početna", "/"], ["Online prodavnica", "/rezervni-delovi"], [p.brand, `/rezervni-delovi/${group}/${brand}`], [p.name, p.href]])} />
        <PartPage data={slim} group={group} brand={brand} part={part} />
      </main>
      <Footer />
    </div>
  );
}
