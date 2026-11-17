import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { site } from "@/shared/config/site";
import { PlaceHome } from "@/views/home";
import { loadPlace } from "@/views/place/server";
import { PlaceSubpage } from "@/views/subpage";
import { type Surface, surfaces } from "./support/surfaces";

// sites_panel's place source (SITES_PANEL_INTERNAL_URL in a deploy): what it
// says about debouchage/clermont-ferrand is merged over the baked place, and
// every number on the page follows it.
const INTERNAL = "http://panel.test/api/internal";
const LIVE = "+33612345678";
const DIAL = `href="tel:${LIVE}"`;
const CHAT = 'href="https://wa.me/33612345678';

beforeAll(() => {
  // Read once, lazily, by the first page load (`serverEnv`).
  process.env["SITES_PANEL_INTERNAL_URL"] = INTERNAL;
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function answer(body: unknown) {
  const fetch = vi.fn(async () => new Response(JSON.stringify(body), { status: 200, headers: { "content-type": "application/json" } }));
  vi.stubGlobal("fetch", fetch);
  return fetch;
}

const params = Promise.resolve({ locale: "fr", location: "clermont-ferrand" });

async function homeHtml() {
  const { view, copy, renderedAt } = await loadPlace(params);
  return renderToStaticMarkup(createElement(PlaceHome, { view, copy, renderedAt, pricing: site.pricing ?? null }));
}

/** Where each surface offers WhatsApp before the call; the footer and the yellow band's phone row have no WhatsApp on a phone. */
const BOTH: readonly Surface[] = ["header", "menu", "hero", "faq", "closing", "sticky"];

describe("a number from the panel", () => {
  it("is asked for at the source, for debouchage/clermont-ferrand", async () => {
    const fetch = answer({ phone: LIVE, whatsapp: LIVE });
    const { view, copy } = await loadPlace(params);
    expect(fetch).toHaveBeenCalledWith(`${INTERNAL}/brands/debouchage/locations/clermont-ferrand?locale=fr`, expect.anything());
    expect(copy.f).toMatchObject({ phone: LIVE, whatsapp: LIVE });
    expect(view.place.channels).toEqual({ phone: LIVE, whatsapp: LIVE });
  });

  it("is on every surface, WhatsApp always before the call, and is the only number dialled", async () => {
    answer({ phone: LIVE, whatsapp: LIVE });
    const html = await homeHtml();
    const shown = surfaces(html);
    for (const name of [...BOTH, "footer"] as const) expect(shown[name], name).toContain(DIAL);
    for (const name of BOTH) {
      const s = shown[name] ?? "";
      expect(s, name).toContain(CHAT);
      expect(s.indexOf(CHAT), name).toBeLessThan(s.indexOf(DIAL));
    }
    expect(html).not.toMatch(/href="tel:(?!\+33612345678")/);
  });

  it("is on the sub-pages' proof card too", async () => {
    answer({ phone: LIVE, whatsapp: LIVE });
    const { view, copy, renderedAt } = await loadPlace(params);
    const shown = surfaces(renderToStaticMarkup(createElement(PlaceSubpage, { view, copy, page: "guarantee", renderedAt })));
    expect(shown.proof).toContain(DIAL);
    expect((shown.proof ?? "").indexOf(CHAT)).toBeLessThan((shown.proof ?? "").indexOf(DIAL));
  });
});

describe("no number from the panel", () => {
  it("shows no number, and offers no call or WhatsApp anywhere", async () => {
    answer({});
    expect(await homeHtml()).not.toMatch(/href="tel:|wa\.me|href="sms:/);
  });

  it("shows none when the source is down either", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("", { status: 503 })));
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    expect(await homeHtml()).not.toMatch(/href="tel:|wa\.me/);
  });
});
