import { LEAD_CAPTURE_TEXT, type LeadCaptureText } from "@/shared/lib/sites-tools";
import type { Locale } from "@/shared/config/i18n";
import type { Text } from "../model/types";

/**
 * The booking card's words in a language: the kit's, with the frame's labels,
 * placeholders and price line over them. One builder for every form the
 * visitor meets — the card, and the price confirmation (`/quote/confirm`) a
 * plain post lands on when the price changed under it — so they read alike.
 */
export function leadCaptureText(t: Text, locale: Locale): LeadCaptureText {
  const c = t.card;
  return {
    ...LEAD_CAPTURE_TEXT[locale],
    title: c.title,
    lede: c.lede,
    needLabel: c.needLabel,
    localityLabel: c.labels.address,
    phoneLabel: c.labels.phone,
    nameLabel: c.labels.name,
    localityPlaceholder: c.placeholders.address,
    phonePlaceholder: c.placeholders.phone,
    namePlaceholder: c.placeholders.name,
    priceLine: c.priceLine,
    pricePending: c.pricePending,
    submit: t.quoteForm.submit,
    privacy: t.quoteForm.privacy,
    honeypotLabel: t.quoteForm.honeypotLabel,
  };
}
