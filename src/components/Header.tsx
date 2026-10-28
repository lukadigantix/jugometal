"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import MegaMenu from "./MegaMenu";
import { Bag, Chevron, Logo } from "./graphics";
import { t } from "./copy";
import { useCart } from "@/lib/cart";

/* ikonica korpe sa brojem artikala */
function CartButton() {
  const { count } = useCart();
  return (
    <Link href="/korpa" aria-label={count ? `${t.nav.cart} (${count})` : t.nav.cart} className="relative transition-colors duration-150 hover:text-mist">
      <Bag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-2 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#e02a33] px-1 text-[10px] font-medium text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}
import { MACHINE_MENU, MENU_PROMO, PARTS_MENU, TRACTOR_MENU, type MenuEntry } from "./nav-data";

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

export default function Header() {
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
      {/* gornja traka: telefon i e-mail */}
      <div className="bg-canvas text-[12px] text-ink">
        <div className="mx-auto flex max-w-[1900px] flex-wrap items-center gap-x-4 gap-y-1 px-4 py-1.5 md:px-9">
          <span className="opacity-80">
            {t.util.help}{" "}
            <a href={t.util.phone.href} className="transition-opacity duration-150 hover:opacity-100">
              {t.util.phone.label}
            </a>
          </span>
          <a href={t.util.email.href} className="opacity-80 transition-opacity duration-150 hover:opacity-100">
            {t.util.email.label}
          </a>
        </div>
      </div>

      {/* glavni header */}
      <header className="sticky top-0 z-40 h-20 border-b border-line bg-paper xl:h-24">
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

          <nav className="hidden h-full items-center gap-4 text-[14px] xl:flex 2xl:gap-7 2xl:text-[16px]">
            {NAV.map((item) =>
              item.entries ? (
                <div key={item.id} className="relative flex h-full flex-row items-center">
                  <span
                    className={`absolute -bottom-px left-0 block h-[2px] w-full bg-accent transition-opacity duration-200 ${
                      openMenu === item.id ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => toggleMenu(item.id)}
                    className="group flex items-center gap-x-1 py-2.5 text-ink"
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
                  className={`py-2.5 transition-colors duration-150 ${
                    item.sale
                      ? "text-[#e02a33] hover:opacity-80"
                      : item.muted
                        ? "text-mist hover:text-ink"
                        : "text-ink hover:text-mist"
                  }`}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          {/* logo: klijent traži da bude krupan - 36 px na telefonu, 40 na tabletu, 56 na desktopu (header 96 px) */}
          <Link href="/" className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-label="Jugometal - početna">
            <Logo className="h-9 w-auto md:h-10 xl:h-14" />
          </Link>

          <div className="flex items-center gap-5">
            <nav className="hidden items-center gap-4 text-[14px] xl:flex 2xl:gap-6 2xl:text-[15px]">
              {SECONDARY.map((l) => (
                <Link key={l.id} href={l.href} onClick={() => setOpenMenu(null)} className="py-2.5 text-ink transition-colors duration-150 hover:text-mist">
                  {l.label}
                </Link>
              ))}
            </nav>
            <CartButton />
          </div>
        </div>

        {/* ===== mega-meni pune širine (desktop) ===== */}
        {/* zatamnjenje stranice ispod - klik zatvara meni */}
        <div
          className={`absolute left-0 top-full hidden h-screen w-screen bg-black/40 transition-opacity duration-500 ease-out xl:block ${
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
              className={`relative max-h-[calc(100dvh-120px)] overflow-y-auto border-b border-line bg-paper transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
              onClick={(e) => {
                // svaki klik na link zatvara meni
                if ((e.target as HTMLElement).closest("a")) setOpenMenu(null);
              }}
            >
              {displayItem?.entries && (
                <MegaMenu
                  key={displayItem.id}
                  entries={displayItem.entries}
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
                          {item.entries?.map((g) => (
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
              <a href="tel:035312391" className="mt-6 flex items-center gap-1.5 text-[15px] text-ink">
                {t.nav.phone}
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
