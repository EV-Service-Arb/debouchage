import { expect, test, type Page } from "@playwright/test";
import { POSTHOG_HOST } from "./env";

// Every page loads, hydrates and settles without a word in the console: a
// hydration mismatch, a failed chunk or a warning from a widget is a defect
// a visitor never reports.

/** What the console said, errors and warnings, plus anything thrown. */
function listen(page: Page): string[] {
  const said: string[] = [];
  page.on("console", m => {
    if (m.type() === "error" || m.type() === "warning") said.push(`${m.type()}: ${m.text()}`);
  });
  page.on("pageerror", e => said.push(`pageerror: ${e.message}`));
  return said;
}

test.beforeEach(async ({ page }) => {
  // The analytics host resolves nowhere (env.ts): answered here, so a beacon's
  // failed fetch is not mistaken for the page's own error.
  await page.route(`${POSTHOG_HOST}/**`, route => route.fulfill({ status: 204 }));
});

for (const path of ["/fr", "/en", "/fr/prices", "/fr/guarantee", "/fr/about", "/fr/thanks"]) {
  test(`${path} loads with a clean console`, async ({ page }) => {
    const said = listen(page);
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    expect(said).toEqual([]);
  });
}
