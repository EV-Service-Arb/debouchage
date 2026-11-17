import { MIN_FILL_MS } from "../../src/shared/lib/sites-tools/index";
import { expect, test, type Page } from "@playwright/test";
import { leadRow } from "./support/leads";
import { freshMobile } from "./support/mobile";

// The booking card (Figma BookingCard 5:282) on the kit's LeadCapture, one
// question a screen: when, what — the price list's six jobs, each at its
// fixed price — then who and where. The server prices the job itself; the
// slot for « autre jour » is the kit's manual preference, `booking.requested`.

const card = (page: Page) => page.locator("#reserver");
const screen = (page: Page) => card(page).locator("[data-lead-step]:not([data-lead-off])");
// The radio lies over its tile, as a finger meets it: a tap on the tile is a tap on the radio.
const tile = (page: Page, text: string) => screen(page).locator("label").filter({ hasText: text }).locator("input[type=radio]");
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

test("when, what, who: one tap a question, the price on the last screen, booked at the server's price", async ({ page }) => {
  const mobile = freshMobile("06");
  await open(page);
  await expect(screen(page)).toHaveAttribute("data-lead-step", "intro");
  await expect(card(page).getByRole("heading", { name: "Réservez votre débouchage" })).toBeVisible();
  await tile(page, "Au plus vite").click();
  await expect(screen(page)).toHaveAttribute("data-lead-step", "need");
  // The price list's six jobs, each with its price.
  await expect(screen(page).locator("input[name=subject]")).toHaveCount(6);
  await expect(screen(page).locator("label").filter({ hasText: "WC" })).toContainText(/109\s€/);
  await tile(page, "WC").click();
  await expect(screen(page)).toHaveAttribute("data-lead-step", "phone");
  await expect(card(page).getByText("Où et qui prévenir ?")).toBeVisible();
  await expect(card(page).getByRole("heading", { name: "Réservez votre débouchage" })).toBeHidden();
  // The answers as the recap, a tap back each.
  await expect(card(page).locator("[data-lead-chrome] li")).toHaveCount(2);
  await expect(card(page).locator("[data-price-cents]")).toHaveAttribute("data-price-cents", "10900");
  await expect(card(page).locator("[data-price-cents]")).toHaveText(/Prix fixe\s:\s109\s€ TTC/);
  await contact(page, mobile);
  await tile(page, "WhatsApp").click();
  await page.waitForTimeout(MIN_FILL_MS);
  const answered = quote(page);
  await card(page).getByRole("button", { name: "Réserver" }).click();
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
  // « Au plus vite » is set on the call: no slot to prefer.
  await expect(done.getByRole("button", { name: "Envoyer ma préférence" })).toHaveCount(0);
  expect(leadRow(mobile)).toEqual({
    job: "wc",
    zip: "12 rue Blatin, Clermont-Ferrand",
    location_id: "clermont-ferrand",
    spam_verdict: null,
    channel: "form",
    flow: "fixed",
    quoted_cents: 10900,
    extras: JSON.stringify({ when: "asap", confirm: "whatsapp", first_name: "Sophie" }),
  });
});

test("« autre jour » books, then offers the kit's slot preference, sent as booking.requested", async ({ page }) => {
  await open(page);
  await tile(page, "Autre jour").click();
  await tile(page, "Inspection caméra").click();
  await contact(page, freshMobile("07"));
  await page.waitForTimeout(MIN_FILL_MS);
  const answered = quote(page);
  await card(page).getByRole("button", { name: "Réserver" }).click();
  expect(await (await answered).json()).toMatchObject({ ok: true, cents: 9000 });
  const done = page.getByRole("status");
  await expect(done).toContainText("Le jour confirmé à l’appel");
  const send = done.getByRole("button", { name: "Envoyer ma préférence" });
  await expect(send).toBeDisabled();
  await done.getByRole("radio", { name: "Après-midi", exact: true }).check();
  const requested = page.waitForResponse(r => new URL(r.url()).pathname === "/quote/booking");
  await send.click();
  const res = await requested;
  expect(JSON.parse(res.request().postData() ?? "{}")).toMatchObject({ provider: "manual", preferred_part: "afternoon", lead_ref: expect.stringMatching(/^lead-/) });
  expect(res.status()).toBe(200);
  await expect(done).toContainText("Préférence notée");
});

test("a price row's « Réserver » names its job: the card does not ask it again", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "on a phone the rows drop their button for one under the table");
  await open(page, "/fr#tarifs");
  await page.locator("#tarifs a[data-need=jetting]").click();
  await tile(page, "Aujourd’hui").click();
  await expect(screen(page)).toHaveAttribute("data-lead-step", "phone");
  await expect(card(page).locator("[data-lead-chrome] li").last()).toContainText("Hydrocurage");
  await expect(card(page).locator("[data-price-cents]")).toHaveAttribute("data-price-cents", "24900");
});

test("a number the form cannot call is blocked before it is sent, in the page's words", async ({ page }) => {
  await open(page);
  await tile(page, "Au plus vite").click();
  await tile(page, "Évier, lavabo").click();
  let sent = 0;
  page.on("request", r => void (r.method() === "POST" && new URL(r.url()).pathname === "/quote" && sent++));
  const phone = screen(page).getByRole("textbox", { name: "Téléphone" });
  await phone.fill("+3361234567");
  await card(page).getByRole("button", { name: "Réserver" }).click();
  await expect(phone).toHaveAttribute("aria-invalid", "true");
  expect(sent).toBe(0);
});
