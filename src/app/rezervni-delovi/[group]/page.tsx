import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ShopCatalog from "@/components/ShopCatalog";
import { partGroups } from "@/data/featured-parts";

export function generateStaticParams() {
  return partGroups.map((g) => ({ group: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/rezervni-delovi/[group]">): Promise<Metadata> {
  const { group } = await params;
  const g = partGroups.find((x) => x.slug === group);
  if (!g) return {};
  return {
    title: `${g.name} - rezervni delovi | Jugometal`,
    description: `${g.name}: ${g.brands.map((b) => b.name).join(", ")}. Cene u RSD, poručivanje online.`,
    alternates: { canonical: `/rezervni-delovi/${g.slug}` },
  };
}

export default async function Page({ params }: PageProps<"/rezervni-delovi/[group]">) {
  const { group } = await params;
  if (!partGroups.some((x) => x.slug === group)) notFound();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ShopCatalog group={group} />
      </main>
      <Footer />
    </div>
  );
}
