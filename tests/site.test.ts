import { createPlaceView, formatCents, placeGraph } from "@/shared/lib/sites-tools";
import { testLead } from "@/shared/lib/sites-tools/testing";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { copyFor, TEXT } from "@/entities/content";
import type { Locale } from "@/shared/config/i18n";
import { LEAD, SUBJECTS } from "@/shared/config/lead";
import { PRICING } from "@/shared/config/pricing";
import { site } from "@/shared/config/site";
import { PlaceHome, SECTION_IDS } from "@/views/home";
import { surfaces } from "./support/surfaces";

const place = site.places[0];
if (!place) throw new Error("the site has no place");

const home = (locale: Locale, pricing: typeof PRICING | null = PRICING) => {
  const view = createPlaceView(site, place, locale, "host");
  const copy = copyFor(locale, { place: place.name[locale], phone: null, whatsapp: null });
  return renderToStaticMarkup(createElement(PlaceHome, { view, copy, renderedAt: Date.UTC(2026, 10, 17), pricing }));
};

/** Every JSON-LD block of the page, parsed. */
const jsonLd = (html: string): unknown[] =>
  [...html.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(m => JSON.parse(m[1] ?? "null") as unknown);

/** The booking card's markup: from its root to the hero's end. */
const card = (html: string) => html.slice(html.indexOf(`id="${SECTION_IDS.book}"`), html.indexOf("</section>", html.indexOf(`id="${SECTION_IDS.book}"`)));

describe("Débouchage Rapide before launch", () => {
  it("has no domain, no phone and no mailbox", () => {
    expect(site.brand).toMatchObject({ domain: null, phone: null, email: null });
  });

  it("is one service-area place at the apex, with no address, coordinate or map", () => {
    expect(site.topology).toEqual({ kind: "single", place: "clermont-ferrand" });
    expect(place.presence).toEqual({ kind: "service-area" });
    const graph = JSON.stringify(placeGraph(site, createPlaceView(site, place, "fr", "host"), "home", { placeName: "x", title: "t", description: "d" }, new Date()));
    expect(graph).not.toMatch(/PostalAddress|streetAddress|postalCode|GeoCoordinates|hasMap|latitude/);
  });

  it("sells every job of the price list at one fixed price", () => {
    expect(Object.keys(PRICING.needs)).toEqual([...SUBJECTS]);
    for (const s of SUBJECTS) expect(LEAD.flows?.[s], s).toBe("fixed");
  });
});

describe("the home page", () => {
  it.each(["fr", "en"] as const)("renders the frame's bands, in its order (%s)", locale => {
    const html = home(locale);
    const bands = ["availability", "hero", "stats", "price-list", "how-it-works", "reviews", "guarantee", "service-area", "faq", "cta", "sticky"];
    const at = bands.map(b => html.indexOf(`data-band="${b}"`));
    expect(at.every(i => i >= 0), JSON.stringify(Object.fromEntries(bands.map((b, i) => [b, at[i]])))).toBe(true);
    expect(at).toEqual([...at].sort((a, b) => a - b));
    expect(html.indexOf("<header")).toBeGreaterThan(html.indexOf('data-band="availability"'));
    expect(html.indexOf("<header")).toBeLessThan(html.indexOf('data-band="hero"'));
  });

  it.each(["fr", "en"] as const)("posts the booking card to /quote, the job, when, the first name, the address, the phone and how to confirm (%s)", locale => {
    const html = card(home(locale));
    expect(html).toMatch(/<form id="reserver-form"[^>]*action="\/quote"[^>]*method="post"/);
    for (const name of ["subject", "when", "first_name", "locality", "mobile", "confirm"]) expect(html, name).toContain(`name="${name}"`);
    // Without a script the confirmation has an answer: the call.
    expect(html).toMatch(/<input type="radio"[^>]*name="confirm" checked="" value="call"/);
  });

  it("offers every job of the price list as a tile, at the price list's price, in its order", () => {
    const html = card(home("fr"));
    const tiles = [...html.matchAll(/<input type="radio"[^>]*name="subject" value="([a-z]+)"/g)].map(m => m[1]);
    expect(tiles).toEqual([...SUBJECTS]);
    for (const s of SUBJECTS) {
      const need = PRICING.needs[s];
      if (need?.kind !== "fixed") throw new Error(`${s} is not fixed`);
      const from = html.indexOf(`name="subject" value="${s}"`);
      const tile = html.slice(from, html.indexOf("</label>", from));
      expect(tile, s).toContain(`>${TEXT.fr.jobs[s].tile}</span>`);
      expect(tile, s).toContain(`>${formatCents(need.cents, "fr")}</span>`);
    }
  });

  it("states no job's price without a price list: not on the card, the table or the stats", () => {
    const html = home("fr", null);
    const band = (name: string) => html.slice(html.indexOf(`data-band="${name}"`), html.indexOf("</section>", html.indexOf(`data-band="${name}"`)));
    for (const part of [card(html), band("price-list").split("<ul")[0] ?? "", band("stats")]) expect(part).not.toMatch(/\d\s?€|dès/);
  });

  it.each(["fr", "en"] as const)("shows no number while the place has none, and offers no call or WhatsApp (%s)", locale => {
    const html = home(locale);
    expect(html).not.toMatch(/href="tel:|wa\.me|href="sms:/i);
    const shown = surfaces(html);
    expect(shown.sticky).toContain(TEXT[locale].sticky.book);
    expect(shown.sticky).not.toContain(`>${TEXT[locale].sticky.call}<`);
  });

  it.each(["fr", "en"] as const)("keeps the frame's sample out of the structured data (%s)", locale => {
    const ld = JSON.stringify(jsonLd(home(locale)));
    expect(ld).not.toBe("[]");
    expect(ld).not.toMatch(/aggregateRating|"review"|telephone|Karim|Julien|SIRET|04 73/);
  });

  it("names the place's own commune and no other in the structured data", () => {
    const ld = JSON.stringify(jsonLd(home("fr")));
    expect(ld).toContain("Clermont-Ferrand");
    for (const town of TEXT.fr.area.towns.filter(t => t !== "Clermont-Ferrand")) expect(ld, town).not.toContain(town);
  });

  it("links to the other language from the footer", () => {
    expect(home("fr")).toMatch(/<a href="\/en\?lang=en"[^>]*>English<\/a>/);
    expect(home("en")).toMatch(/<a href="\/fr\?lang=fr"[^>]*>Français<\/a>/);
  });

  it("sends every action to the card", () => {
    const html = home("fr");
    expect(html.match(/href="\/fr#reserver"/g)?.length).toBeGreaterThanOrEqual(6);
    for (const s of SUBJECTS) expect(html, s).toContain(`data-need="${s}"`);
  });
});

describe("the lead", () => {
  const lead = (extras: Record<string, string>) => ({ ...testLead(), subject: "wc", extras });

  it("takes when and confirm from their lists, or none", () => {
    expect(LEAD.validate?.(lead({ when: "asap", confirm: "whatsapp", first_name: "Sophie" }))).toBeNull();
    expect(LEAD.validate?.(lead({}))).toBeNull();
  });

  it("refuses a when or a confirm off the list, and a number we cannot call, naming the field — the phone first", () => {
    expect(LEAD.validate?.(lead({ when: "yesterday" }))).toMatchObject({ field: "when" });
    expect(LEAD.validate?.(lead({ confirm: "pigeon" }))).toMatchObject({ field: "confirm" });
    expect(LEAD.validate?.({ ...lead({ when: "yesterday" }), mobile: "06 12 34 56 7" })).toMatchObject({ field: "phone" });
  });
});
