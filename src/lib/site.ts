/* Javni domen sajta - isti kao stari (jugometal.co.rs), da Google zadrži pozicije. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jugometal.co.rs";
export const abs = (path: string) => `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
