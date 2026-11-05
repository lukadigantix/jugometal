/* Ekran dok se stranica sprema (Next prikazuje ovo dok server ne pošalje sadržaj):
 * Jugometal znak u krugu sa crvenim prstenom koji kruži i traka koja klizi - isti jezik kao pin na mapi. */
// animacija ugrađena ovde (kao kod preloadera), da ekran ne zavisi od CSS fajla
const CSS = "@keyframes routeIndeterminate{from{transform:translateX(-100%)}to{transform:translateX(260%)}}";

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-1 items-center justify-center bg-paper" role="status" aria-live="polite">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="flex flex-col items-center">
        <span className="relative grid size-16 place-items-center">
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-line border-t-[#e02a33] [animation-duration:900ms]" />
          <span className="grid size-12 place-items-center rounded-full bg-white shadow-[0_8px_24px_-12px_rgba(24,25,27,0.4)]">
            {/* eslint-disable-next-line @next/next/no-img-element -- znak sajta */}
            <img src="/favicon.ico" alt="" aria-hidden className="size-7 object-contain" />
          </span>
        </span>
        <span className="relative mt-6 block h-[2px] w-32 overflow-hidden rounded-full bg-line">
          <span className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-[#e02a33] animate-[routeIndeterminate_1.1s_cubic-bezier(0.65,0,0.35,1)_infinite]" />
        </span>
        <span className="mt-3 text-[11px] uppercase tracking-[0.2em] text-mist">Učitavanje</span>
      </div>
    </div>
  );
}
