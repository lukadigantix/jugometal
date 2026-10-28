import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ShopCatalog from "@/components/ShopCatalog";
import { partGroups } from "@/data/featured-parts";

export function generateStaticParams() {
  return partGroups.flatMap((g) => g.brands.map((b) => ({ group: g.slug, brand: b.slug })));
}

const find = (group: string, brand: string) => partGroups.find((x) => x.slug === group)?.brands.find((b) => b.slug === brand);

export async function generateMetadata({ params }: PageProps<"/rezervni-delovi/[group]/[brand]">): Promise<Metadata> {
  const { group, brand } = await params;
  const b = find(group, brand);
  if (!b) return {};
  return {
    title: `${b.name} rezervni delovi - ${b.count} artikala | Jugometal`,
    description: `Rezervni delovi ${b.name} sa cenama i šiframa. Poručite online ili pozovite 035/311-137.`,
    alternates: { canonical: `/rezervni-delovi/${group}/${brand}` },
  };
}

export default async function Page({ params }: PageProps<"/rezervni-delovi/[group]/[brand]">) {
  const { group, brand } = await params;
  if (!find(group, brand)) notFound();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ShopCatalog group={group} brand={brand} />
      </main>
      <Footer />
    </div>
  );
}
