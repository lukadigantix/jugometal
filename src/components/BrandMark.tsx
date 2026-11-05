"use client";

import { useState } from "react";

/* Logo brenda koji se sam prilagođava obliku: širok znak (Solis, Mahindra) ide u nižu visinu, a skoro kvadratan
 * amblem (npr. IMT) u višu, da svi logotipi izgledaju podjednako krupno. Oblik se čita iz same slike. */
export default function BrandMark({ src, alt, wide = "h-6 max-w-[120px]", emblem = "h-9 max-w-[44px]" }: { src: string; alt: string; wide?: string; emblem?: string }) {
  const [isEmblem, setEmblem] = useState(false);
  const check = (el: HTMLImageElement | null) => {
    if (el?.complete && el.naturalWidth) setEmblem(el.naturalWidth / Math.max(1, el.naturalHeight) < 1.8);
  };
  return (
    // eslint-disable-next-line @next/next/no-img-element -- logo brenda sa backenda
    <img src={src} alt={alt} ref={check} onLoad={(e) => check(e.currentTarget)} className={`w-auto object-contain object-left ${isEmblem ? emblem : wide}`} />
  );
}
