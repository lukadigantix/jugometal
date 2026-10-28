import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import MachineCatalog from "@/components/MachineCatalog";
import catalog from "@/data/catalog.json";
import list from "@/data/machine-list.json";

const cats = catalog.implementCategories.filter((c) => list.some((m) => m.category === c.slug));

export function generateStaticParams() {
  return cats.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/prikljucne-masine/[category]">): Promise<Metadata> {
  const { category } = await params;
  const c = cats.find((x) => x.slug === category);
  if (!c) return {};
  return { title: `${c.name} - priključne mašine | Jugometal`, description: `${c.name} u ponudi Jugometala. Cena na upit, savet i servis - Svilajnac, Temerin, Požarevac.`, alternates: { canonical: `/prikljucne-masine/${c.slug}` } };
}

export default async function Page({ params }: PageProps<"/prikljucne-masine/[category]">) {
  const { category } = await params;
  if (!cats.some((x) => x.slug === category)) notFound();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <MachineCatalog key={category} category={category} />
      </main>
      <Footer />
    </div>
  );
}
