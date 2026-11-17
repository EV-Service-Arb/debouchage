import { tmpdir } from "node:os";
import { join } from "node:path";

/**
 * What the server under test is started with, shared by the config (which
 * starts it) and the specs (which read what it wrote). E2E_PORT is the flake's.
 */
if (!process.env["E2E_PORT"]) throw new Error("E2E_PORT: the dev shell sets it, and `nix run .#test`");
export const PORT = Number(process.env["E2E_PORT"]);

/** The panel stand-in (`mock-panel.mjs`), and the base the server under test reads it at. */
export const MOCK_PORT = Number(process.env["E2E_MOCK_PORT"] ?? PORT + 1);
export const SITES_PANEL_INTERNAL_URL = `http://127.0.0.1:${MOCK_PORT}/api/internal`;

/** Emptied when the server starts: an earlier run's rows must not satisfy this one. */
export const LEADS_DB = join(tmpdir(), `debouchage-e2e-${PORT}`, "leads.db");

/** Where the server under test sends analytics: a host that resolves nowhere, so no beacon reaches PostHog. */
export const POSTHOG_HOST = "https://posthog.e2e.invalid";
