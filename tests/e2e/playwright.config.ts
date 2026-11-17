import { dirname } from "node:path";
import { defineConfig, devices } from "@playwright/test";
import { BREAKPOINTS } from "../../src/shared/lib/sites-tools/testing-e2e";
import { LEADS_DB, MOCK_PORT, PORT, POSTHOG_HOST, SITES_PANEL_INTERNAL_URL } from "./env";

// Run through the flake (`nix run .#test`), which supplies `@playwright/test`
// and the nixpkgs-pinned browsers — the pin is what makes a screenshot render
// alike on every machine of one OS. Baselines are Linux's; elsewhere the pixel
// comparison is skipped rather than failed against another OS's rasteriser.
const linux = process.platform === "linux";

export default defineConfig({
  testDir: ".",
  snapshotPathTemplate: "{testDir}/__screenshots__/{arg}{ext}",
  ignoreSnapshots: !linux,
  fullyParallel: true,
  forbidOnly: !!process.env["CI"],
  retries: 0,
  outputDir: "../../test-results",
  reporter: process.env["CI"] ? [["github"], ["list"]] : [["list"]],
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled", stylePath: "./screenshot-section.css" } },
  use: { baseURL: `http://localhost:${PORT}`, deviceScaleFactor: 1, colorScheme: "light", locale: "fr-FR" },
  // The two breakpoints the design draws: 1440 and 390.
  projects: BREAKPOINTS.map(b => ({ name: b.name, use: { ...devices["Desktop Chrome"], viewport: b.viewport } })),
  // The artefact that ships, not `next dev`: `npm run build` first.
  webServer: [
    {
      command: "node mock-panel.mjs",
      url: `http://127.0.0.1:${MOCK_PORT}/health`,
      reuseExistingServer: false,
      env: { E2E_MOCK_PORT: String(MOCK_PORT) },
    },
    {
      // Next keeps the ISR pages it rendered in the standalone tree, and a build
      // in place does not clear them: a run would be served the last build's pages.
      command: `rm -rf "${dirname(LEADS_DB)}" .next/standalone/.next/server/route-cache && mkdir -p "${dirname(LEADS_DB)}" && node .next/standalone/server.js`,
      cwd: "../..",
      url: `http://localhost:${PORT}/health`,
      reuseExistingServer: false,
      timeout: 60_000,
      // The standalone server runs as production, which refuses to boot without
      // knowing whose address the rate limit counts; on loopback the one hop is the runner.
      env: {
        PORT: String(PORT),
        HOSTNAME: "127.0.0.1",
        LEADS_DB_PATH: LEADS_DB,
        TRUSTED_PROXY: "xff:1",
        POSTHOG_KEY: "phc_e2e",
        POSTHOG_HOST,
        SITES_PANEL_INTERNAL_URL,
      },
    },
  ],
});
