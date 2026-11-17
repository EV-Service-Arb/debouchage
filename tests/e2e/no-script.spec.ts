import { MIN_FILL_MS } from "../../src/shared/lib/sites-tools/index";
import { expect, test } from "@playwright/test";
import { leadRow } from "./support/leads";
import { freshMobile } from "./support/mobile";

/** Today in the runner's calendar, as the day tiles post it. */
const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

// The funnel's floor: the card must book before any JavaScript has loaded.
// A regression here is invisible to every other test and costs every lead.
test.describe("without JavaScript", () => {
  // Reduced motion drops the page's smooth scroll, which without a script
  // Playwright never sees settle before it clicks.
  test.use({ javaScriptEnabled: false, reducedMotion: "reduce" });

  // The rate limit counts 5 leads per address: each posting test has its own.
  let address = 0;
  test.beforeEach(async ({ page }, testInfo) => {
    address += 1;
    await page.setExtraHTTPHeaders({ "x-forwarded-for": `10.8.${testInfo.workerIndex}.${address}` });
  });

  test("every screen is in the card at once, and it posts as one: a 303 and the lead stored at the list's price", async ({ page }, testInfo) => {
    const mobile = freshMobile("06");
    const locality = `Chamalières ${testInfo.project.name}`;
    await page.goto("/fr#reserver");
    const form = page.locator("form#reserver-form");
    for (const step of ["need", "slot", "phone"]) await expect(form.locator(`[data-lead-step=${step}]`)).toBeVisible();
    await form.locator("label").filter({ hasText: "Douche, baignoire" }).click();
    await form.locator("label").filter({ hasText: "Aujourd’hui" }).click();
    // The slot posts with the lead too: today, the afternoon.
    await form.locator("[data-lead-step=slot] label").filter({ hasText: "Auj." }).click();
    await form.locator("[data-lead-step=slot] label").filter({ hasText: "Après-midi" }).click();
    await form.getByRole("textbox", { name: "Prénom" }).fill("Thierry");
    await form.getByRole("textbox", { name: "Téléphone" }).fill(mobile);
    await form.getByRole("textbox", { name: "Adresse ou commune" }).fill(locality);
    // The time trap flags anything faster than a person; this is a person.
    await page.waitForTimeout(MIN_FILL_MS + 500);
    const posted = page.waitForResponse(r => r.request().method() === "POST" && new URL(r.url()).pathname === "/quote");
    await form.getByRole("button", { name: "Réserver" }).click();
    expect((await posted).status()).toBe(303);
    await page.waitForURL("**/fr/thanks");
    // A suspected bot gets the same 303, so the redirect proves nothing: the row does.
    expect(leadRow(mobile)).toEqual({
      job: "shower",
      zip: locality,
      location_id: "clermont-ferrand",
      spam_verdict: null,
      channel: "form",
      flow: "fixed",
      quoted_cents: 9900,
      extras: JSON.stringify({ when: "today", confirm: "call", first_name: "Thierry" }),
      preferred_date: today(),
      preferred_part: "afternoon",
    });
  });

  test("a number the server refuses comes back to the card, keeping the job", async ({ page }) => {
    await page.goto("/fr#reserver");
    const form = page.locator("form#reserver-form");
    await form.locator("label").filter({ hasText: "WC" }).click();
    await form.getByRole("textbox", { name: "Téléphone" }).fill("0000000000");
    await form.getByRole("textbox", { name: "Adresse ou commune" }).fill("Royat");
    await form.getByRole("button", { name: "Réserver" }).click();
    await expect(page).toHaveURL(/\/fr\?lead_error=phone&need=wc&lead_card=reserver#reserver$/);
  });

  // The server under test's panel gives the place no number: no page may offer a call or WhatsApp.
  for (const path of ["/fr", "/en", "/fr/prices", "/fr/guarantee", "/fr/about"]) {
    test(`${path} offers no phone and no WhatsApp`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("[data-band=sticky]")).toBeAttached();
      await expect(page.locator('a[href^="tel:"], a[href^="sms:"], a[href*="wa.me"]')).toHaveCount(0);
    });
  }
});
