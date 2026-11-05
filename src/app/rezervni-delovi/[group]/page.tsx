import type { Metadata } from "next";
import { withSeo } from "@/lib/seo";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ShopCatalog from "@/components/ShopCatalog";
import { getPartsData } from "@/lib/catalog";

export async function generateStaticParams() {
  const { partGroups } = await getPartsData();
  return partGroups.map((g) => ({ group: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/rezervni-delovi/[group]">): Promise<Metadata> {
  const { group } = await params;
  const { partGroups } = await getPartsData();
  const g = partGroups.find((x) => x.slug === group);
  if (!g) return {};
  return withSeo(`/rezervni-delovi/${g.slug}`, {
    title: `${g.name} - rezervni delovi | Jugometal`,
    description: `${g.name}: ${g.brands.map((b) => b.name).join(", ")}. Cene u RSD, poručivanje online.`,
    alternates: { canonical: `/rezervni-delovi/${g.slug}` },
  });
}

export default async function Page({ params }: PageProps<"/rezervni-delovi/[group]">) {
  const { group } = await params;
  const data = await getPartsData();
  if (!data.partGroups.some((x) => x.slug === group)) notFound();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ShopCatalog data={data} group={group} />
      </main>
      <Footer />
    </div>
  );
}
