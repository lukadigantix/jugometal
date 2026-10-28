import type { Metadata } from "next";
import CartPage from "@/components/CartPage";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Korpa | Jugometal online prodavnica",
  robots: { index: false, follow: true },
};

export default function Korpa() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <CartPage />
      </main>
      <Footer />
    </div>
  );
}
