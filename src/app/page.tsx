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

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <FeaturedProducts />
        <ShopFeatured />
        <ProductSpotlight />
        <ExploreCategories />
        <AtvSection />
        <EditorialCards />
        <MachinesShowcase />
        <BrandStory />
        <SocialGrid />
        <Locations />
      </main>
      <Footer />
    </div>
  );
}
