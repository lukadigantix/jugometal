"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import MegaMenu from "./MegaMenu";
import { Bag, Chevron, Logo } from "./graphics";
import { t } from "./copy";
import { useCart } from "@/lib/cart";
import { cityName, tel, useSite } from "@/lib/site-context";

/* ikonica korpe sa brojem artikala */
function CartButton() {
  const { count } = useCart();
  return (
    <Link
      href="/korpa"
      aria-label={count ? `${t.nav.cart} (${count})` : t.nav.cart}
      className="relative grid size-10 place-items-center rounded-full bg-canvas text-ink ring-1 ring-line transition-colors duration-200 hover:bg-ink hover:text-white hover:ring-ink"
    >
      <Bag className="h-[18px] w-[18px]" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#e02a33] px-1 text-[10px] font-medium text-white ring-2 ring-paper">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
import { MACHINE_MENU, MENU_PROMO, PARTS_MENU, TRACTOR_MENU, type MenuEntry } from "./nav-data";
import { useTractorBrands } from "@/lib/brands-context";
import { useMediaMap } from "@/lib/media-context";

type MenuItem = {
  id: string;
  label: string;
  href: string;
  muted?: boolean;
  sale?: boolean;
  entries?: MenuEntry[];
  kind?: "models" | "photos" | "logos";
  exploreLabel?: string;
  exploreHref?: string;
};

const NAV: MenuItem[] = [
  {
    id: "traktori",
    label: t.nav.tractors,
    href: "/traktori",
    exploreLabel: t.nav.exploreAllTractors,
    exploreHref: "/traktori",
    entries: TRACTOR_MENU,
    kind: "models",
  },
  {
    id: "masine",
    label: t.nav.machines,
    href: "/prikljucne-masine",
    exploreLabel: t.nav.exploreAllMachines,
    exploreHref: "/prikljucne-masine",
    entries: MACHINE_MENU,
    kind: "photos",
  },
  {
    id: "delovi",
    label: t.nav.parts,
    href: "/rezervni-delovi",
    exploreLabel: t.nav.exploreAllParts,
    exploreHref: "/rezervni-delovi",
    entries: PARTS_MENU,
    kind: "logos",
  },
  { id: "akcije", label: t.nav.sale, href: "/akcije", sale: true },
];

/* linkovi desno u headeru (O nama, Servis, Subvencije, Kontakt) */
const SECONDARY: MenuItem[] = t.secondary.map((l) => ({ id: l.href, label: l.label, href: l.href }));

/** link je aktivan i na podstranama (/servis, /traktori/solis…) */
const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export default function Header() {
  // logotipi brendova traktora iz admina (meni i panel na telefonu)
  const brandLogos = new Map(useTractorBrands().map((b) => [b.slug, b.logo]));
  const media = useMediaMap(); // slike modela iz admina
  const entriesOf = (i: MenuItem) =>
    i.entries?.map((e) => ({
      ...e,
      logo: i.id === "traktori" ? brandLogos.get(e.key) || e.logo : e.logo,
      tiles: e.tiles.map((t) => ({ ...t, img: media[t.href]?.[0] ?? t.img })),
    }));
  const pathname = usePathname();
  const { contact: c, workingHours } = useSite();
  // posle malo skrola header dobija senku umesto linije
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    const raf = requestAnimationFrame(on);
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
    };
  }, []);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  // preživljava zatvaranje da panel zadrži sadržaj tokom animacije skupljanja
  const [displayId, setDisplayId] = useState<string | null>(null);

  // mobilni meni + otvorena harmonika u njemu
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpand, setMobileExpand] = useState<string | null>(null);

  // meniji se otvaraju na klik - klik na otvoreni ga zatvara
  const toggleMenu = useCallback((id: string) => {
    setOpenMenu((prev) => {
      if (prev === id) return null;
      setDisplayId(id);
      return id;
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const hasPanel = (i: MenuItem) => Boolean(i.entries);
  const open = Boolean(NAV.find((i) => i.id === openMenu && hasPanel(i)));
  const displayItem = NAV.find((i) => i.id === displayId && hasPanel(i)) ?? null;

  return (
    <>
      {/* gornja traka: kontakt levo, radno vreme i adresa desno - sve iz admina (Podešavanja → Sajt) */}
      <div className="bg-[#df2026] text-[12px] font-medium text-white">
        <div className="mx-auto flex max-w-[1900px] items-center justify-between gap-x-6 px-4 py-2 md:px-9">
          <div className="flex min-w-0 items-center gap-x-5">
            {c.phone && (
              <a href={tel(c.phone)} className="inline-flex items-center gap-1.5 whitespace-nowrap transition-opacity duration-150 hover:opacity-70">
                <Phone className="h-3 w-3" strokeWidth={2} />
                <span className="hidden sm:inline">{t.util.help}</span> {c.phone}
              </a>
            )}
            {c.email && (
              <a href={`mailto:${c.email}`} className="hidden items-center gap-1.5 transition-opacity duration-150 hover:opacity-70 sm:inline-flex">
                <Mail className="h-3 w-3" strokeWidth={2} />
                {c.email}
              </a>
            )}
          </div>
          <div className="hidden items-center gap-x-5 lg:flex">
            {workingHours.length > 0 && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3 w-3" strokeWidth={2} />
                {workingHours.filter((h) => h.isOpen).map((h) => `${h.days} ${h.hours}`).join(" · ")}
              </span>
            )}
            {(c.street || c.city) && (
              <Link href="/kontakt" className="inline-flex items-center gap-1.5 transition-opacity duration-150 hover:opacity-70">
                <MapPin className="h-3 w-3" strokeWidth={2} />
                {[c.street, cityName(c.city)].filter(Boolean).join(", ")}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* glavni header */}
      <header
        className={`sticky top-0 z-40 h-20 border-b bg-paper/90 backdrop-blur-xl transition-[box-shadow,border-color] duration-300 ${
          scrolled || open ? "border-transparent shadow-[0_12px_32px_-20px_rgba(24,25,27,0.35)]" : "border-line"
        }`}
      >
        <div className="relative mx-auto flex h-full max-w-[1900px] items-center justify-between px-4 md:px-9">
          {/* mobilno: hamburger umesto navigacije - linije se pretvaraju u X */}
          <button
            type="button"
            aria-label={mobileOpen ? "Zatvori meni" : "Otvori meni"}
            onClick={() => {
              setMobileOpen((v) => !v);
              setMobileExpand(null);
              setOpenMenu(null);
            }}
            className="relative h-5 w-5 text-ink xl:hidden"
          >
            <span
              className={`absolute left-0 top-[4px] block h-[1.5px] w-5 bg-current transition-transform duration-300 ease-[var(--ease-expo)] ${
                mobileOpen ? "translate-y-[5.25px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[9.25px] block h-[1.5px] w-5 bg-current transition-all duration-300 ease-[var(--ease-expo)] ${
                mobileOpen ? "scale-x-0 opacity-0" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[14.5px] block h-[1.5px] w-5 bg-current transition-transform duration-300 ease-[var(--ease-expo)] ${
                mobileOpen ? "-translate-y-[5.25px] -rotate-45" : ""
              }`}
            />
          </button>

          <nav className="hidden h-full items-center gap-1 text-[14px] xl:flex 2xl:text-[15px]">
            {NAV.map((item) =>
              item.entries ? (
                <div key={item.id} className="relative flex h-full flex-row items-center">
                  <button
                    type="button"
                    onClick={() => toggleMenu(item.id)}
                    aria-expanded={openMenu === item.id}
                    className={`group flex h-10 items-center gap-x-1.5 rounded-full px-3.5 transition-colors duration-200 ${
                      openMenu === item.id
                        ? "bg-ink text-white"
                        : isActive(pathname, item.href)
                          ? "bg-canvas text-ink"
                          : "text-ink/80 hover:bg-canvas hover:text-ink"
                    }`}
                  >
                    <span>{item.label}</span>
                    <Chevron
                      className={`h-2.5 w-2.5 opacity-60 transition-transform duration-200 ${
                        openMenu === item.id ? "-rotate-90" : "rotate-90"
                      }`}
                    />
                  </button>
                </div>
              ) : (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setOpenMenu(null)}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className={`ml-1 flex h-10 items-center gap-2 rounded-full px-3.5 transition-colors duration-200 ${
                    item.sale
                      ? `text-[#e02a33] hover:bg-[#e02a33]/10 ${isActive(pathname, item.href) ? "bg-[#e02a33]/10" : ""}`
                      : isActive(pathname, item.href)
                        ? "bg-canvas text-ink"
                        : "text-ink/80 hover:bg-canvas hover:text-ink"
                  }`}
                >
                  {item.label}
                  {item.sale && <span className="grid size-5 place-items-center rounded-full bg-[#e02a33] text-[10px] font-semibold text-white">%</span>}
                </Link>
              ),
            )}
          </nav>

          {/* logo: 32 px na telefonu, 36 na tabletu, 48 na desktopu (header 80 px) */}
          <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-label="Jugometal - početna">
            <Logo className="h-8 w-auto md:h-9 xl:h-12" />
          </Link>

          <div className="flex h-full items-center gap-3">
            <nav className="hidden h-full items-center gap-1 text-[14px] xl:flex 2xl:text-[15px]">
              {SECONDARY.map((l) => (
                <Link
                  key={l.id}
                  href={l.href}
                  onClick={() => setOpenMenu(null)}
                  aria-current={isActive(pathname, l.href) ? "page" : undefined}
                  className={`flex h-10 items-center rounded-full px-3.5 transition-colors duration-200 ${
                    l.href === "/kontakt"
                      ? "ml-2 bg-ink px-5 text-white hover:bg-[#e02a33]"
                      : isActive(pathname, l.href)
                        ? "bg-canvas text-ink"
                        : "text-ink/80 hover:bg-canvas hover:text-ink"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <CartButton />
          </div>
        </div>

        {/* ===== mega-meni pune širine (desktop) ===== */}
        {/* zatamnjenje stranice ispod - klik zatvara meni.
            w-full a ne w-screen: 100vw uključuje i vertikalni scrollbar, pa je stranica dobijala horizontalni scroll.
            Visina = ekran minus header (100% je visina headera), da ne viri ispod ekrana. */}
        <div
          className={`absolute left-0 top-full hidden h-[calc(100dvh-100%)] w-full bg-black/40 transition-opacity duration-500 ease-out xl:block ${
            open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={() => setOpenMenu(null)}
          aria-hidden
        />
        {/* panel se otvara do visine sadržaja (grid 0fr -> 1fr) */}
        <div
          className={`absolute left-0 top-full hidden w-full xl:grid transition-[grid-template-rows] duration-500 ease-[var(--ease-expo)] ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
          aria-hidden={!open}
          inert={!open}
        >
          <div className="overflow-hidden">
            <div
              data-lenis-prevent
              className={`relative max-h-[calc(100dvh-80px)] overflow-y-auto border-b border-line bg-paper transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
              onClick={(e) => {
                // svaki klik na link zatvara meni
                if ((e.target as HTMLElement).closest("a")) setOpenMenu(null);
              }}
            >
              {displayItem?.entries && (
                <MegaMenu
                  key={displayItem.id}
                  entries={entriesOf(displayItem)!}
                  promo={MENU_PROMO[displayItem.id]}
                  kind={displayItem.kind ?? "logos"}
                  allLabel={displayItem.exploreLabel ?? ""}
                  allHref={displayItem.exploreHref ?? "#"}
                />
              )}
            </div>
          </div>
        </div>

        {/* ===== mobilni meni - stavke se dižu jedna za drugom ===== */}
        <div
          className={`absolute left-0 top-full h-[calc(100dvh-80px)] w-full xl:hidden ${
            mobileOpen ? "" : "pointer-events-none"
          }`}
        >
          <div
            data-lenis-prevent
            className={`h-full overflow-y-auto bg-paper px-6 pb-12 transition-all duration-500 ease-[var(--ease-expo)] ${
              mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
            }`}
            onClick={(e) => {
              // navigacija bilo gde zatvara meni
              if ((e.target as HTMLElement).closest("a")) setMobileOpen(false);
            }}
          >
            <ul className="divide-y divide-line">
              {[...NAV, ...SECONDARY].map((item, idx) =>
                item.entries ? (
                  <li
                    key={item.id}
                    className={`transition-all duration-500 ease-[var(--ease-expo)] ${
                      mobileOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                    }`}
                    style={{ transitionDelay: mobileOpen ? `${80 + idx * 60}ms` : "0ms" }}
                  >
                    <button
                      type="button"
                      onClick={() => setMobileExpand((prev) => (prev === item.id ? null : item.id))}
                      className="flex w-full items-center justify-between py-4 text-[16px] text-ink"
                    >
                      {item.label}
                      <Chevron
                        className={`h-2.5 w-2.5 opacity-60 transition-transform duration-200 ${
                          mobileExpand === item.id ? "-rotate-90" : "rotate-90"
                        }`}
                      />
                    </button>
                    {mobileExpand === item.id && (
                      <div className="animate-[heroIn_.45s_ease-out_both]">
                        <ul className="flex flex-col gap-1 pb-5 pt-1">
                          {entriesOf(item)?.map((g) => (
                            <li key={g.key}>
                              <Link href={g.href} className="flex items-center justify-between py-2 text-[15px] text-ink">
                                {g.label}
                                <span className="text-[12px] text-mist">{g.meta}</span>
                              </Link>
                              {item.kind !== "models" && (
                                <ul className="mb-1 ml-1 space-y-1 border-l border-line pl-4">
                                  {g.tiles.filter((x) => !x.soon).map((x) => (
                                    <li key={x.href}>
                                      <Link href={x.href} className="block py-1 text-[13px] text-mist">
                                        {x.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                        <Link
                          href={item.exploreHref ?? "#"}
                          className="group mb-6 inline-flex w-full items-center justify-center gap-1 text-[14px] text-ink"
                        >
                          <span className="leading-none">{item.exploreLabel}</span>
                          <Chevron className="h-2.5 w-2.5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                      </div>
                    )}
                  </li>
                ) : (
                  <li
                    key={item.id}
                    className={`transition-all duration-500 ease-[var(--ease-expo)] ${
                      mobileOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                    }`}
                    style={{ transitionDelay: mobileOpen ? `${80 + idx * 60}ms` : "0ms" }}
                  >
                    <Link
                      href={item.href}
                      className={`block py-4 text-[16px] ${
                        item.sale ? "text-[#e02a33]" : item.muted ? "text-mist" : "text-ink"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>

            <div
              className={`transition-all duration-500 ease-[var(--ease-expo)] ${
                mobileOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{ transitionDelay: mobileOpen ? `${80 + (NAV.length + SECONDARY.length) * 60}ms` : "0ms" }}
            >
              {c.phone && (
                <a href={tel(c.phone)} className="mt-6 flex items-center gap-2 text-[15px] text-ink">
                  <Phone className="h-4 w-4" strokeWidth={1.8} />
                  {c.phone}
                </a>
              )}
              {c.email && (
                <a href={`mailto:${c.email}`} className="mt-3 flex items-center gap-2 text-[15px] text-ink">
                  <Mail className="h-4 w-4" strokeWidth={1.8} />
                  {c.email}
                </a>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
