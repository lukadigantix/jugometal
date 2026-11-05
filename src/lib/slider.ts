import { cacheLife, cacheTag } from "next/cache";
import { heroSlides } from "@/data/hero-slides";
import { API_URL } from "./api";
import { CATALOG_TAG } from "./catalog";

/* Hero slajder naslovne iz admina (Podešavanja → Slider), GET /shop/slider.
 * Keš pod istom oznakom kao katalog: backend posle svake izmene u adminu zove /api/osvezi, pa se novi slajd vidi odmah.
 * Ako backend ne odgovara ili nema nijednog aktivnog slajda, ostaju statični slajdovi iz src/data/hero-slides.ts. */

export type HeroSlide = {
  key: string;
  label: string;
  eyebrow: string | null;
  title: string;
  text: string | null;
  image: string;
  imageAlt: string;
  imagePosition: string | null;
  // Prelaz iza teksta: boja kao "r g b" (za rgb(var(--fade)/a)) i jačina 0–1; podrazumevano crna, puna jačina
  fade: { rgb: string; opacity: number };
  cta: { label: string; href: string } | null;
  secondary: { label: string; href: string } | null;
};

type ApiSlide = {
  id: string;
  image: string | null;
  imageAlt: string | null;
  imagePosition: string | null;
  label: string | null;
  kicker: string | null;
  title: string | null;
  subtitle: string | null;
  buttonText: string | null;
  buttonUrl: string | null;
  secondaryButtonText: string | null;
  secondaryButtonUrl: string | null;
  fadeColor: string | null;
  fadeOpacity: number | null;
};

const DEFAULT_FADE = { rgb: "0 0 0", opacity: 1 };

function fadeOf(color: string | null, opacity: number | null): HeroSlide["fade"] {
  const hex = /^#?([0-9a-f]{6})$/i.exec(color ?? "")?.[1];
  const rgb = hex ? [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(" ") : DEFAULT_FADE.rgb;
  const k = opacity === null || opacity === undefined ? 1 : Math.min(100, Math.max(0, opacity)) / 100;
  return { rgb, opacity: k };
}

const link = (label: string | null, href: string | null) => (label && href ? { label, href } : null);

function fallback(): HeroSlide[] {
  return heroSlides.map((s) => ({
    key: s.key,
    label: s.label,
    eyebrow: s.eyebrow,
    title: s.title,
    text: s.text,
    image: s.image,
    imageAlt: s.title,
    imagePosition: s.imagePosition,
    fade: DEFAULT_FADE,
    cta: s.cta,
    secondary: s.secondary,
  }));
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  "use cache";
  cacheTag(CATALOG_TAG);
  try {
    const res = await fetch(`${API_URL}/shop/slider`, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { data } = (await res.json()) as { data: ApiSlide[] };
    const slides = data
      .filter((s) => s.image)
      .map<HeroSlide>((s) => ({
        key: s.id,
        label: s.label || s.title || "",
        eyebrow: s.kicker,
        title: s.title ?? "",
        text: s.subtitle,
        image: s.image!,
        imageAlt: s.imageAlt || s.title || "",
        imagePosition: s.imagePosition,
        fade: fadeOf(s.fadeColor, s.fadeOpacity),
        cta: link(s.buttonText, s.buttonUrl),
        secondary: link(s.secondaryButtonText, s.secondaryButtonUrl),
      }));
    cacheLife("hours");
    return slides.length ? slides : fallback();
  } catch (err) {
    console.warn(`[slider] API ${API_URL} ne odgovara (${err instanceof Error ? err.message : err}) - koristim src/data/hero-slides.ts`);
    cacheLife("minutes");
    return fallback();
  }
}
