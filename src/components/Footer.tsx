import { getSiteInfo } from "@/lib/site-info";
import { getMarketing, hasTracking } from "@/lib/marketing";
import { getShopCatalog } from "@/lib/catalog";
import FooterView from "./FooterView";

/* Podnožje: kontakt, opis, mreže i radno vreme iz admina (Podešavanja → Sajt); brendovi traktora i kategorije
 * priključnih mašina iz kataloga (GET /shop/catalog), pa novi brend ili kategorija u adminu odmah ulazi u podnožje. */
export default async function Footer() {
  const [info, marketing, catalog] = await Promise.all([getSiteInfo(), getMarketing(), getShopCatalog()]);
  return (
    <FooterView
      info={info}
      cookieSettings={hasTracking(marketing)}
      tractorBrands={catalog.tractorBrands}
      machineCategories={catalog.machineCategories}
    />
  );
}
