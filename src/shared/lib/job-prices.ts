import { flowOf, priceOf, type PricingModel } from "@/shared/lib/sites-tools";
import { FLOWS, SUBJECTS, type Subject } from "@/shared/config/lead";

/** Each job's price in cents; `null` for a job the list does not price as `fixed` (the panel's list may leave one out). */
export type JobPrices = Readonly<Record<Subject, number | null>>;

/**
 * The prices the page states, from the list it was rendered with — the one
 * the card and the server price from — so a figure on the page is never one
 * the card would not charge. No model: no figure anywhere.
 */
export function jobPrices(model: PricingModel | null): JobPrices {
  const entries = SUBJECTS.map(s => [s, model && flowOf(FLOWS, model, s) === "fixed" ? (priceOf(model, s, {})?.cents ?? null) : null] as const);
  return Object.fromEntries(entries) as Record<Subject, number | null>;
}

/** The lowest of them: the stats' « dès … ». */
export function lowestPrice(prices: JobPrices): number | null {
  const cents = Object.values(prices).filter((c): c is number => c !== null);
  return cents.length === 0 ? null : Math.min(...cents);
}
