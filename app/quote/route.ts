import { quoteRoute } from "@/shared/lib/sites-tools/next";
import { TEXT } from "@/entities/content";
import { notifier, pricing, serverEnv, webhook } from "@/shared/config/env";
import { ANCHORS } from "@/shared/config/nav";
import { site } from "@/shared/config/site";

/** The no-JS path: a plain form POST answered with a 303. */
export const dynamic = "force-dynamic";

export const POST = quoteRoute(site, {
  env: serverEnv,
  notifier,
  webhook,
  // The server prices the posted job itself: a posted amount is never read.
  pricing,
  // A refusal lands back on the card; `LeadCapture` posts its id (`card`) too.
  anchor: ANCHORS.book,
  unavailable: locale => {
    const t = TEXT[locale];
    const f = { place: site.brand.name, phone: site.brand.phone, whatsapp: site.brand.phone };
    return { title: t.serverError.title, heading: t.serverError.headline.join(""), body: t.serverError.body(f), callLabel: t.callLabel(f) };
  },
});
