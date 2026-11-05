/* Uvod pri prvom ulasku u sesiji: logo, crvena linija koja se puni i „Od 1990. · Svilajnac"; sadržaj nestane na mestu
 * (uvek tačno u centru), pa se tamni ekran obriše odozdo nagore (clip-path - ekran se ne pomera, samo se otkriva stranica).
 * Bez JavaScripta. Stilovi su ugrađeni u HTML (<style> ispod), pa stižu sa prvim bajtom stranice - preloader je
 * ispravan i pre nego što se učita CSS fajl. Pri ponovnim posetama ga sakriva skripta INTRO_SCRIPT u <head>. */

/** Pokreće se pre prvog iscrtavanja: ako je uvod već prikazan u ovoj sesiji, <html> dobija .no-intro */
export const INTRO_SCRIPT = `try{if(sessionStorage.getItem("jm-intro"))document.documentElement.classList.add("no-intro");else sessionStorage.setItem("jm-intro","1")}catch(e){}`;

const CSS = `
.preloader{position:fixed;inset:0;z-index:100;display:flex;align-items:center;justify-content:center;background:#18191b;color:#fff;clip-path:inset(0 0 0 0);animation:plWipe .8s cubic-bezier(.76,0,.24,1) 1.5s forwards}
.preloader__inner{display:flex;flex-direction:column;align-items:center;text-align:center;animation:plIn .6s cubic-bezier(.16,1,.3,1) both,plFade .35s ease 1.3s forwards}
.preloader__logo{height:44px;width:auto}
@media (min-width:768px){.preloader__logo{height:56px}}
.preloader__bar{position:relative;display:block;width:180px;height:2px;margin-top:28px;overflow:hidden;border-radius:999px;background:rgb(255 255 255/.15)}
.preloader__bar:after{content:"";position:absolute;inset:0;border-radius:inherit;background:#e02a33;transform-origin:left;animation:plBar 1s cubic-bezier(.65,0,.35,1) .25s both}
.preloader__meta{display:block;margin-top:14px;font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:rgb(255 255 255/.5);animation:plIn .6s cubic-bezier(.16,1,.3,1) .2s both}
@keyframes plIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes plBar{from{transform:scaleX(0)}to{transform:scaleX(1)}}
@keyframes plFade{to{opacity:0}}
@keyframes plWipe{to{clip-path:inset(0 0 100% 0);visibility:hidden}}
.no-intro .preloader{display:none}
@media (prefers-reduced-motion:reduce){.preloader{display:none}}
`;

export default function Preloader() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="preloader" aria-hidden>
        <div className="preloader__inner">
          {/* eslint-disable-next-line @next/next/no-img-element -- logo mora odmah, bez čekanja na Next sliku */}
          <img src="/logo-white.svg" alt="" width={512} height={128} className="preloader__logo" />
          <span className="preloader__bar" />
          <span className="preloader__meta">Od 1990. · Svilajnac</span>
        </div>
      </div>
    </>
  );
}
