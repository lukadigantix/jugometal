import type { Metadata } from "next";
import { Instrument_Sans } from "next/font/google";
import CartToast from "@/components/CartToast";
import JsonLd from "@/components/JsonLd";
import SmoothScroll from "@/components/SmoothScroll";
import { organization } from "@/lib/schema";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const brandFont = Instrument_Sans({
  variable: "--font-brand",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "sr_RS", siteName: "Jugometal", images: ["/opengraph-original.png"] },
  title: "Jugometal Svilajnac | Traktori, priključne mašine i rezervni delovi",
  description:
    "Jugometal d.o.o. Svilajnac - prodaja i servis traktora Solis, IMT, John Deere, YTO i Mahindra, priključnih mašina i rezervnih delova. Svilajnac, Temerin, Požarevac.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sr" className={`${brandFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <JsonLd data={organization} />
        <SmoothScroll />
        {children}
        <CartToast />
      </body>
    </html>
  );
}
