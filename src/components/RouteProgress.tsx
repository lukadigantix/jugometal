"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/*
  Tanka crvena traka na vrhu ekrana pri prelazu na drugu stranicu.
  Kreće na klik na unutrašnji link (druga putanja, isti sajt, bez nove kartice), puni se do ~85% dok se stranica sprema,
  a kad se putanja promeni - dopuni se do kraja i nestane. Ako prelaz traje predugo (10 s), sama se gasi.
*/
export default function RouteProgress() {
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [width, setWidth] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const prev = useRef(pathname);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  // klik na unutrašnji link → start
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement | null)?.closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      let url: URL;
      try {
        url = new URL(a.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;

      clear();
      setState("loading");
      setWidth(12);
      timers.current.push(setTimeout(() => setWidth(45), 120));
      timers.current.push(setTimeout(() => setWidth(70), 600));
      timers.current.push(setTimeout(() => setWidth(85), 1600));
      timers.current.push(setTimeout(() => setState("done"), 10_000));
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  // promena putanje → kraj
  useEffect(() => {
    if (prev.current === pathname) return;
    prev.current = pathname;
    clear();
    setState((s) => (s === "loading" ? "done" : s));
  }, [pathname]);

  useEffect(() => {
    if (state !== "done") return;
    const t1 = setTimeout(() => setState("idle"), 450);
    const t2 = setTimeout(() => setWidth(0), 700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [state]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-[3px]">
      <div
        className="h-full bg-[#e02a33] shadow-[0_0_10px_rgba(224,42,51,0.6)]"
        style={{
          width: `${state === "done" ? 100 : width}%`,
          opacity: state === "idle" ? 0 : 1,
          transition: `width ${state === "done" ? 250 : 500}ms cubic-bezier(0.4,0,0.2,1), opacity 300ms ease ${state === "idle" ? "0ms" : "0ms"}`,
        }}
      />
    </div>
  );
}
