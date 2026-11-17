import "server-only";
import { createPlaceSource, createPricingSource, createServerEnv, leadNotifier, leadWebhook, type LeadNotifier, type LeadWebhook } from "@/shared/lib/sites-tools/server";
import { isSubject, PANEL_NEED } from "./lead";
import { site } from "./site";

/** Parsed once, lazily: `next build` imports this and must need no secrets. */
export const serverEnv = createServerEnv(site);

/** The live place data, when `SITES_PANEL_INTERNAL_URL` is set; baked otherwise. */
export const places = createPlaceSource(site);

/** The panel's price list over `site.pricing`: unset, down, `{}` or invalid all price from the baked one. */
export const pricing = createPricingSource(site);

const needLabel = (subject: string) => (isSubject(subject) ? PANEL_NEED[subject] : undefined);

let built: LeadNotifier | undefined;

/** Built at boot (`instrumentation.ts`), so SMTP with no sender fails startup. */
export function notifier(): LeadNotifier {
  built ??= leadNotifier(site, serverEnv(), { needLabel });
  return built;
}

let hook: LeadWebhook | null | undefined;

/** Each lead as `lead.created` to the panel, through the outbox in the leads file; `null` without `LEAD_WEBHOOK_URL`. */
export function webhook(): LeadWebhook | null {
  if (hook === undefined) hook = leadWebhook(site, serverEnv(), { needLabel: subject => needLabel(subject) ?? subject });
  return hook;
}
