import AtvSection from "@/components/AtvSection";
import BrandStory from "@/components/BrandStory";
import EditorialCards from "@/components/EditorialCards";
import ExploreCategories from "@/components/ExploreCategories";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Locations from "@/components/Locations";
import MachinesShowcase from "@/components/MachinesShowcase";
import ProductSpotlight from "@/components/ProductSpotlight";
import ShopFeatured from "@/components/ShopFeatured";
import SocialGrid from "@/components/SocialGrid";
import { getPartsData, getShopCatalog } from "@/lib/catalog";
import { atvModels } from "@/data/atv";
import { getHeroSlides } from "@/lib/slider";

export default async function Home() {
  const [parts, slides, catalog] = await Promise.all([getPartsData(), getHeroSlides(), getShopCatalog()]);
  // brojevi i prečice za „Šta nudimo" (katalog je keširan, isti poziv koristi i footer)
  const explore = {
    tractorBrands: catalog.tractorBrands,
    machineCategories: catalog.machineCategories,
    partsCount: catalog.parts.length,
    atvCount: atvModels.length,
  };
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero slides={slides} />
        <FeaturedProducts first />
        <ShopFeatured data={parts} />
        <ProductSpotlight />
        <ExploreCategories data={explore} />
        <AtvSection />
        <EditorialCards />
        <MachinesShowcase categoriesCount={catalog.machineCategories.length} />
        <BrandStory
          stats={{
            tractorModels: explore.tractorBrands.reduce((n, b) => n + b.count, 0),
            tractorBrands: explore.tractorBrands.length,
            parts: explore.partsCount,
          }}
        />
        <SocialGrid />
        <Locations />
      </main>
      <Footer />
    </div>
  );
}
