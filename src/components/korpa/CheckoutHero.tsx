import Koraci from "./Koraci";

/* Tamna traka na vrhu korpe, porudžbine i potvrde (isti jezik kao hero na Akcijama, O nama, Servisu):
 * koraci kupovine, naslov sa crvenom tačkom, brojač i kratak opis. */
export default function CheckoutHero({ step, title, meta, sub }: { step: 0 | 1 | 2; title: string; meta?: string; sub?: string }) {
  return (
    <section className="relative overflow-hidden bg-[#18191b] text-white">
      {/* blag crveni sjaj u uglu, da površina ne bude ravna */}
      <span aria-hidden className="pointer-events-none absolute -right-40 -top-40 size-[420px] rounded-full bg-[#e02a33]/15 blur-3xl" />
      <div className="relative mx-auto max-w-[1600px] px-4 pb-10 pt-8 md:px-9 md:pb-14 md:pt-10">
        <Koraci aktivan={step} dark />
        <h1 className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-2 text-[40px] font-medium leading-none tracking-[-0.03em] md:mt-10 md:text-[56px]">
          <span>
            {title}
            <span className="text-[#e02a33]">.</span>
          </span>
          {meta && <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[13px] font-normal tracking-normal text-white/75 backdrop-blur-md">{meta}</span>}
        </h1>
        {sub && <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-white/65 md:text-[15px]">{sub}</p>}
      </div>
    </section>
  );
}
