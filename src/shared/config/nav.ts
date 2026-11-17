import { perLocale, type PlaceView } from "@/shared/lib/sites-tools";
import type { Locale } from "./i18n";
import { site } from "./site";

/** The header's links (Figma NavBar 7:180): bands of the home page, in its order. */
export const NAV_IDS = ["prices", "steps", "reviews", "area", "faq"] as const;
export type NavId = (typeof NAV_IDS)[number];

/**
 * The home page's anchors: the bands the header links to, and the booking
 * card every action lands on, from every page.
 */
export const ANCHORS = { prices: "tarifs", steps: "etapes", reviews: "avis", area: "zone", faq: "faq", book: "reserver" } as const satisfies Record<NavId | "book", string>;

/** The footer's page links (Footer 10:602), before the legal names. */
export const FOOTER_PAGES = ["prices", "guarantee", "about"] as const;
export type FooterPage = (typeof FOOTER_PAGES)[number];

export interface NavLink {
  href: string;
  label: string;
}

/** The chrome every page of a place shares: the header's and the footer's links, the card, and this page in the other language. */
export interface PlaceNav {
  header: readonly NavLink[];
  footer: readonly NavLink[];
  /** The booking card, on the home page: every action lands there. */
  bookHref: string;
  other: { locale: Locale; href: string; label: string };
}

/** `suffix` is this page's (`site.pages`), so the language link keeps the reader on it. */
export function placeNav(view: PlaceView<Locale>, labels: { nav: Readonly<Record<NavId, string>>; pages: Readonly<Record<FooterPage, string>> }, suffix: string): PlaceNav {
  const hrefs = perLocale(site, l => view.href(suffix, l));
  const otherLocale = site.i18n.locales.find(l => l !== view.locale);
  if (otherLocale === undefined) throw new Error("the site has two languages");
  return {
    header: NAV_IDS.map(id => ({ href: view.href(`#${ANCHORS[id]}`), label: labels.nav[id] })),
    footer: FOOTER_PAGES.map(page => ({ href: view.href(site.pages[page]), label: labels.pages[page] })),
    bookHref: view.href(`#${ANCHORS.book}`),
    other: { locale: otherLocale, href: hrefs[otherLocale], label: site.i18n.labels[otherLocale] },
  };
}
