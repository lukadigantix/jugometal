"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Module-level singleton so StrictMode double-effects or HMR can never
// leave two Lenis instances fighting over the scroll position.
let activeLenis: Lenis | null = null;
// true kada je navigacija došla od dugmeta nazad/napred u browseru
let fromHistory = false;

/**
 * Lenis smooth scrolling, configured like the reference site:
 * default lerp (0.1), smoothWheel on, wheel/touch multiplier 1.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (activeLenis) return;
    const lenis = new Lenis({
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      anchors: true,
      autoRaf: true,
    });
    activeLenis = lenis;
    const onPop = () => {
      fromHistory = true;
    };
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      lenis.destroy();
      activeLenis = null;
    };
  }, []);

  /* Nova strana uvek kreće od vrha. Bez ovoga Lenis dovrši klizanje sa prethodne strane
   * (klik dok strana još klizi) i vrati novu stranu na pola. Nazad/napred zadržava mesto. */
  useEffect(() => {
    const lenis = activeLenis;
    if (!lenis) return;
    if (fromHistory) {
      fromHistory = false;
      lenis.scrollTo(window.scrollY, { immediate: true, force: true });
      return;
    }
    if (window.location.hash) return;
    lenis.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
