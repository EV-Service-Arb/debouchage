import { expect, test } from "@playwright/test";

// The sub-pages are pages of the home page's site: the header's bands lead
// back to it, the footer's pages to each other, and every action to the card.
test("the footer reaches every page, and each page's action lands on the card", async ({ page }) => {
  await page.goto("/fr");
  for (const [name, path, heading] of [
    ["Tarifs", "/fr/prices", "Le prix, avant qu’on se déplace."],
    ["Garantie", "/fr/guarantee", "Pas débouché, pas facturé."],
    ["Qui sommes-nous", "/fr/about", "Deux techniciens. Un seul métier."],
  ] as const) {
    await page.locator("footer#footer").getByRole("link", { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`${path}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(heading);
  }
  await page.locator("[data-band=cta]").getByRole("link", { name: "Réserver mon intervention" }).click();
  await expect(page).toHaveURL(/\/fr#reserver$/);
  await expect(page.locator("#reserver [data-lead-step=intro]")).toBeVisible();
});

test("the footer switches to the same page in English", async ({ page }) => {
  await page.goto("/fr/guarantee");
  await page.locator("footer#footer").getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/guarantee$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Not cleared, not charged.");
});
