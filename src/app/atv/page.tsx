import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { atvModels } from "@/data/atv";

export const metadata: Metadata = {
  title: "Benda ATV - Redstone 550 R2 i 1000 R2 | Jugometal",
  description: "Benda Redstone kvadovi u prodaji: 550 R2 (48 KS) i 1000 R2 (102 KS). Garancija 3 godine ili 8.000 km.",
  alternates: { canonical: "/atv" },
};

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative h-[420px] overflow-hidden bg-ink text-white md:h-[520px]">
          <img src="/atv/benda-teren-2.jpg" alt="Benda ATV na terenu" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-4 pb-12 md:px-9 md:pb-16">
            <nav aria-label="Putanja" className="text-[13px] text-white/70">
              <Link href="/" className="hover:text-white">Početna</Link>
              <span className="mx-2">/</span>
              <span className="text-white">Benda ATV</span>
            </nav>
            <h1 className="mt-4 text-[40px] font-medium leading-[1.02] md:text-[64px]">Benda ATV vozila.</h1>
            <p className="mt-3 max-w-xl text-[15px] text-white/80 md:text-[17px]">Redstone kvadovi sa V2 motorom, pogonom 2WD/4WD i garancijom 3 godine ili 8.000 km.</p>
          </div>
        </section>
        <section className="mx-auto grid w-full max-w-[1600px] gap-6 px-4 py-12 md:px-9 md:py-20 lg:grid-cols-2">
          {atvModels.map((m) => (
            <Link key={m.slug} href={m.href} className="group flex flex-col overflow-hidden rounded-[4px] border border-line bg-paper transition-shadow hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
              <div className="relative aspect-[16/10] bg-[radial-gradient(ellipse_at_center,#ffffff_0%,#efeeea_100%)]">
                <img src={m.image} alt={m.name} className="absolute inset-0 h-full w-full object-contain p-8 transition-transform duration-500 group-hover:scale-[1.03]" />
                {m.onSale && <span className="absolute left-4 top-4 rounded-full bg-[#e02a33] px-3 py-1.5 text-[12px] font-medium text-white">{m.saleBadge}</span>}
              </div>
              <div className="flex flex-1 flex-col p-6 md:p-8">
                <h2 className="text-[28px] font-medium leading-tight">{m.name.replace("Benda ", "")}</h2>
                <p className="mt-1 text-[15px] text-mist">{m.tagline}</p>
                <dl className="mt-5 grid grid-cols-4 gap-3 border-y border-line py-4">
                  {m.stats.map((s) => (
                    <div key={s.label}>
                      <dt className="sr-only">{s.label}</dt>
                      <dd className="text-[20px] font-medium leading-tight">{s.value}<span className="ml-0.5 text-[12px] text-mist">{s.unit}</span></dd>
                      <dd className="text-[11px] text-mist">{s.label}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-5 flex items-center gap-2">
                  {m.colors.map((c) => (
                    <span key={c.name} title={c.name} className="h-5 w-5 rounded-full border border-black/10" style={{ background: c.hex }} />
                  ))}
                  <span className="ml-1 text-[13px] text-mist">{m.colors.length} boja</span>
                </div>
                <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-6">
                  <div>
                    <p className={`text-[28px] font-medium leading-none ${m.onSale ? "text-[#e02a33]" : ""}`}>{m.price}</p>
                    <p className="mt-1 text-[13px] text-mist">{m.priceNote}</p>
                  </div>
                  <span className="rounded-full bg-accent px-6 py-3 text-[14px] text-accent-contrast">Pogledaj model</span>
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
