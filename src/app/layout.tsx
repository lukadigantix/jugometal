import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import CartToast from "@/components/CartToast";
import JsonLd from "@/components/JsonLd";
import Marketing from "@/components/Marketing";
import Preloader, { INTRO_SCRIPT } from "@/components/Preloader";
import RouteProgress from "@/components/RouteProgress";
import SmoothScroll from "@/components/SmoothScroll";
import { organization } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";
import { getMarketing } from "@/lib/marketing";
import { getSiteInfo } from "@/lib/site-info";
import { SiteProvider } from "@/lib/site-context";
import { BrandsProvider } from "@/lib/brands-context";
import { MediaProvider } from "@/lib/media-context";
import { getShopCatalog } from "@/lib/catalog";
import { OG_IMAGES } from "@/lib/seo";
import "./globals.css";

const brandFont = Instrument_Sans({
  variable: "--font-brand",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "sr_RS", siteName: "Jugometal", images: OG_IMAGES },
  twitter: { card: "summary_large_image", images: ["/opengraph.jpg"] },
  title: "Jugometal Svilajnac | Traktori, priključne mašine i rezervni delovi",
  description:
    "Jugometal d.o.o. Svilajnac - prodaja i servis traktora Solis, IMT, John Deere, YTO i Mahindra, priključnih mašina i rezervnih delova. Svilajnac.",
};

/* Kod za potvrdu domena za Meta iz admina (Podešavanja → Marketing); Google Search Console se potvrđuje DNS zapisom na serveru */
export async function generateMetadata(): Promise<Metadata> {
  const m = await getMarketing();
  return m.metaDomainVerification ? { ...baseMetadata, verification: { other: { "facebook-domain-verification": m.metaDomainVerification } } } : baseMetadata;
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const [marketing, site, catalog] = await Promise.all([getMarketing(), getSiteInfo(), getShopCatalog()]);
  return (
    // suppressHydrationWarning: INTRO_SCRIPT dodaje .no-intro na <html> pre hidratacije
    <html lang="sr" className={`${brandFont.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* uvod samo pri prvom ulasku u sesiji - odluka pre prvog iscrtavanja, da ne bljesne */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        <Preloader />
        <RouteProgress />
        <JsonLd data={organization(site)} />
        <SmoothScroll />
        <SiteProvider info={site}>
          <BrandsProvider brands={catalog.tractorBrands}>
            <MediaProvider media={catalog.media}>
              {children}
              <CartToast />
            </MediaProvider>
          </BrandsProvider>
        </SiteProvider>
        <Marketing config={marketing} />
      </body>
    </html>
  );
}
