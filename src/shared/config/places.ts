import type { Place } from "@/shared/lib/sites-tools";
import type { Locale } from "./i18n";

/**
 * The one place. A service-area business: the technician goes to the
 * customer, so there is no address, coordinate or map. It serves
 * Clermont-Ferrand, which its name says; the communes around it are the
 * copy's until the owner lists them. Every `null` is a fact the owner has not
 * given (`OWNER_TODO`): the publication gate keeps the page `noindex` until
 * they are in.
 */
export const PLACES: readonly Place<Locale>[] = [
  {
    slug: "clermont-ferrand",
    gbpName: "Débouchage Rapide Clermont-Ferrand",
    name: { fr: "Clermont-Ferrand", en: "Clermont-Ferrand" },
    presence: { kind: "service-area" },
    serviceArea: [{ kind: "localities", names: ["Clermont-Ferrand"] }],
    channels: { phone: null, whatsapp: null },
    hours: null,
    rating: null,
  },
];
