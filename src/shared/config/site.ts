import { assertLaunchable, cardFact, defineSite, SERVICE_AREA_GATE, type OwnerTodo } from "@/shared/lib/sites-tools";
import { i18n } from "./i18n";
import { LEAD } from "./lead";
import { PLACES } from "./places";
import { PRICING } from "./pricing";

/**
 * The brand as the machinery sees it — routing, the lead funnel, schema.org,
 * analytics and mail read their facts from this one object. The contact facts
 * come from `assets/card.toml` (inlined at build), which has none yet: no
 * phone, no mailbox, no domain — noindex everywhere, and the booking card as
 * the only channel until the panel gives the place a number.
 */
export const site = defineSite({
  brand: {
    id: "debouchage",
    name: "Débouchage Rapide Clermont-Ferrand",
    // The brand name stands in until the owner gives the raison sociale.
    legalName: "Débouchage Rapide Clermont-Ferrand",
    email: cardFact("SITE_CARD_EMAIL", process.env.SITE_CARD_EMAIL),
    phone: cardFact("SITE_CARD_PHONE", process.env.SITE_CARD_PHONE),
    domain: cardFact("SITE_CARD_SITE", process.env.SITE_CARD_SITE),
    businessType: "Plumber",
  },
  i18n,
  ogLocale: { fr: "fr_FR", en: "en_GB" },
  topology: { kind: "single", place: "clermont-ferrand" },
  // The Figma file's sub-pages (Tarifs 14:774, Garantie 14:1081, Qui sommes-nous 14:1247).
  pages: { home: "", prices: "/prices", guarantee: "/guarantee", about: "/about" },
  places: PLACES,
  publication: SERVICE_AREA_GATE,
  lead: LEAD,
  // The baked price list; the panel's, when it serves one, overrides it whole (env.ts).
  pricing: PRICING,
  publicFiles: ["/icon.svg"],
});

export type PageKey = (typeof site.pageKeys)[number];
export type Subpage = Exclude<PageKey, "home">;

/**
 * Facts the owner has not given, listed once rather than found on the page.
 * The page is the Figma frame, its sample content included: every item of it
 * is a line here, and each blocks a launch.
 */
const sample = (field: string, why: string): OwnerTodo => ({ field: `design sample content: ${field}`, why, blocksLaunch: true });

export const OWNER_TODO: readonly OwnerTodo[] = [
  { field: "assets/card.toml site", why: "no domain yet — the site is noindex and robots Disallow until there is", blocksLaunch: true },
  { field: "assets/card.toml phone", why: "no public number: no tel: or WhatsApp anywhere until the panel gives the place one", blocksLaunch: false },
  { field: "assets/card.toml email", why: "no public mailbox; lead mail needs LEAD_NOTIFY_TO", blocksLaunch: false },
  { field: "site.brand.legalName", why: "raison sociale as registered; the brand name stands in", blocksLaunch: true },
  { field: "places[clermont-ferrand].hours", why: "working hours — the publication gate needs them; the page's « 7 j/7 · 6 h – 23 h » is copy", blocksLaunch: true },
  { field: "places[clermont-ferrand].serviceArea", why: "the communes served beyond Clermont-Ferrand; the « 20 km autour » chips are copy", blocksLaunch: true },
  { field: "legal pages", why: "« Mentions légales » and « Confidentialité » (LCEN, RGPD) have no page: the footer names them without a link", blocksLaunch: true },
  sample("prices", "shared/config/pricing.ts: 89 / 99 / 109 / 149 / 249 / 90 €, TTC, travel included — the owner sets the real ones in the panel"),
  sample("night and holiday term", "« Nuit et jours fériés : + 40 € » (prices, FAQ); the server does not add it"),
  sample("guarantee", "« Garantie 3 mois », « pas débouché = pas facturé », « créneau tenu ou déplacement offert (30 €) »"),
  sample("stats and rating", "45 min average arrival, 4,9 / 212 Google reviews, « 7 j/7 », the hero's « technicien disponible · arrivée env. 45 min »"),
  sample("photographs", "assets/photos/*: generated stand-ins for the owner's own job, crew and street photographs, and the review photographs, none of them a real customer's; the hero video arm is generated too"),
  sample("reviews", "Sophie M., Thierry B., Nadia K. and their quotes, shown as Google reviews"),
  sample("technicians", "Karim and Julien, their years and specialities, the « Photo » placeholders; the done state's « appelle dans les 5 minutes »"),
  sample("company identifiers", "SIRET 000 000 000 00000, RC Pro n° 0000000, the mediator « [à compléter] », the VAT line"),
  sample("phone", "« 04 73 00 00 00 » is never rendered: the number is the panel's"),
];

assertLaunchable(site, OWNER_TODO);
