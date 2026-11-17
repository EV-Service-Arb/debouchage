import { MIN_FILL_MS } from "../../src/shared/lib/sites-tools/index";
import { expect, test, type Page } from "@playwright/test";
import { leadRow } from "./support/leads";
import { freshMobile } from "./support/mobile";

// The booking card (Figma BookingCard 5:282) on the kit's LeadCapture, its
// screens the frame's: what and when on the first, the slot for « aujourd’hui »
// and « autre jour », then who and where. The server prices the job itself and
// sends the slot on as `booking.requested` (tests/booking.test.ts).

const card = (page: Page) => page.locator("#reserver");
const screen = (page: Page) => card(page).locator("[data-lead-step]:not([data-lead-off])");
// The radio lies over its tile, as a finger meets it: a tap on the tile is a tap on the radio.
const tile = (page: Page, text: string) => screen(page).locator("label").filter({ hasText: text }).locator("input[type=radio]");
const next = (page: Page) => screen(page).getByRole("button", { name: "Continuer" }).click();
const quote = (page: Page) => page.waitForResponse(r => r.request().method() === "POST" && new URL(r.url()).pathname === "/quote");

/** Hydrated: the kit marks the job's tiles as required in the page's words, which only its script does. */
async function open(page: Page, path = "/fr#reserver") {
  await page.goto(path);
  const radio = card(page).locator("input[name=subject]").first();
  await expect.poll(() => radio.evaluate(el => (el instanceof HTMLInputElement ? el.validationMessage : ""))).toBe("Choisissez votre besoin.");
}

async function contact(page: Page, mobile: string) {
  await screen(page).getByRole("textbox", { name: "Prénom" }).fill("Sophie");
  await screen(page).getByRole("textbox", { name: "Téléphone" }).fill(mobile);
  await screen(page).getByRole("textbox", { name: "Adresse ou commune" }).fill("12 rue Blatin, Clermont-Ferrand");
}

// The rate limit counts 5 leads per address: each posting test has its own.
let address = 0;
test.beforeEach(async ({ page }, testInfo) => {
  address += 1;
  await page.setExtraHTTPHeaders({ "x-forwarded-for": `10.9.${testInfo.workerIndex}.${address}` });
});

test("what and when on one screen, then who: the price on the tiles and the submit, booked at the server's price", async ({ page }) => {
  const mobile = freshMobile("06");
  await open(page);
  await expect(screen(page)).toHaveAttribute("data-lead-step", "need");
  await expect(card(page).getByRole("heading", { name: "Réservez votre débouchage" })).toBeVisible();
  // The price list's six jobs, each with its price.
  await expect(screen(page).locator("input[name=subject]")).toHaveCount(6);
  await expect(screen(page).locator("label").filter({ hasText: "WC" })).toContainText(/109\s€/);
  await tile(page, "WC").click();
  await tile(page, "Au plus vite").click();
  // Both answered: still the screen, for one to be changed, until « Continuer ».
  await expect(screen(page)).toHaveAttribute("data-lead-step", "need");
  await next(page);
  await expect(screen(page)).toHaveAttribute("data-lead-step", "phone");
  await expect(card(page).getByText("Où et qui prévenir ?")).toBeVisible();
  await expect(card(page).getByRole("heading", { name: "Réservez votre débouchage" })).toHaveCount(0);
  // The first screen's answers as the recap, a tap back.
  await expect(card(page).locator("[data-lead-chrome] li")).toHaveCount(1);
  await expect(card(page).locator("[data-lead-chrome] li")).toContainText("WC · Au plus vite");
  await expect(card(page).locator("[data-price-cents]")).toHaveAttribute("data-price-cents", "10900");
  await contact(page, mobile);
  await tile(page, "WhatsApp").click();
  await page.waitForTimeout(MIN_FILL_MS);
  const answered = quote(page);
  await card(page).getByRole("button", { name: /Réserver · prix fixe 109\s€/ }).click();
  const res = await answered;
  expect(Object.fromEntries(new URLSearchParams(res.request().postData() ?? ""))).toMatchObject({
    when: "asap",
    subject: "wc",
    first_name: "Sophie",
    confirm: "whatsapp",
    shown_cents: "10900",
  });
  expect(await res.json()).toMatchObject({ ok: true, cents: 10900 });
  const done = page.getByRole("status");
  await expect(done).toBeFocused();
  await expect(done).toContainText("C’est réservé, Sophie.");
  await expect(done).toContainText(/109\s€ TTC, déplacement inclus/);
  await expect(done).toContainText("Au plus vite, env. 45 min");
  // « Au plus vite » is set on the call: no slot, nothing more to ask.
  await expect(done.getByRole("radio")).toHaveCount(0);
  expect(leadRow(mobile)).toEqual({
    job: "wc",
    zip: "12 rue Blatin, Clermont-Ferrand",
    location_id: "clermont-ferrand",
    spam_verdict: null,
    channel: "form",
    flow: "fixed",
    quoted_cents: 10900,
    extras: JSON.stringify({ when: "asap", confirm: "whatsapp", first_name: "Sophie" }),
    preferred_date: null,
    preferred_part: null,
  });
});

test("« autre jour » asks the day and its part before the contact, kept with the booking", async ({ page }) => {
  const mobile = freshMobile("07");
  await open(page);
  await tile(page, "Inspection caméra").click();
  await tile(page, "Autre jour").click();
  await next(page);
  await expect(screen(page)).toHaveAttribute("data-lead-step", "slot");
  await expect(card(page).getByText("Choisissez votre créneau")).toBeVisible();
  // Another day: from tomorrow.
  await expect(screen(page).locator("label").filter({ hasText: "Auj." })).toHaveCount(0);
  await next(page);
  await expect(screen(page)).toHaveAttribute("data-lead-step", "slot");
  await tile(page, "Demain").click();
  await tile(page, "Après-midi").click();
  await next(page);
  await expect(screen(page)).toHaveAttribute("data-lead-step", "phone");
  await contact(page, mobile);
  await page.waitForTimeout(MIN_FILL_MS);
  const answered = quote(page);
  await card(page).getByRole("button", { name: /Réserver · prix fixe 90\s€/ }).click();
  const body = (await (await answered).json()) as { slot?: { date?: string } };
  expect(body).toMatchObject({ ok: true, cents: 9000, slot: { part: "afternoon" } });
  const done = page.getByRole("status");
  await expect(done).toContainText(/, l’après-midi/);
  expect(leadRow(mobile)).toMatchObject({ job: "camera", preferred_date: body.slot?.date, preferred_part: "afternoon" });
});

test("a price row's « Réserver » names its job: the card asks only when", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "on a phone the rows drop their button for one under the table");
  await open(page, "/fr#tarifs");
  await page.locator("#tarifs a[data-need=jetting]").click();
  await expect(screen(page).locator("input[name=subject][value=jetting]")).toBeChecked();
  await tile(page, "Au plus vite").click();
  await next(page);
  await expect(screen(page)).toHaveAttribute("data-lead-step", "phone");
  await expect(card(page).locator("[data-lead-chrome] li").last()).toContainText("Hydrocurage");
  await expect(card(page).locator("[data-price-cents]")).toHaveAttribute("data-price-cents", "24900");
});

test("a number the form cannot call is blocked before it is sent, in the page's words", async ({ page }) => {
  await open(page);
  await tile(page, "Évier, lavabo").click();
  await tile(page, "Au plus vite").click();
  await next(page);
  let sent = 0;
  page.on("request", r => void (r.method() === "POST" && new URL(r.url()).pathname === "/quote" && sent++));
  const phone = screen(page).getByRole("textbox", { name: "Téléphone" });
  await phone.fill("+3361234567");
  await card(page).getByRole("button", { name: /Réserver/ }).click();
  await expect(phone).toHaveAttribute("aria-invalid", "true");
  expect(sent).toBe(0);
});
