/* Javni domen sajta - isti kao stari (jugometal.co.rs), da Google zadrži pozicije. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jugometal.co.rs";
/** puna adresa; adrese koje su već pune (npr. slike sa backenda) ostaju kakve jesu */
export const abs = (path: string) => (/^https?:\/\//i.test(path) ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`);
