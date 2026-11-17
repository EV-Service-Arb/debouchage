import { validateLead, type LeadCandidate, type LeadFlow, type LeadSchema } from "@/shared/lib/sites-tools";

/**
 * The jobs of the price list, in its order: the price table's rows and the
 * booking card's tiles are both this list, so neither can offer a job the
 * other does not.
 */
export const SUBJECTS = ["sink", "shower", "wc", "drain", "jetting", "camera"] as const;
export type Subject = (typeof SUBJECTS)[number];

export const isSubject = (value: string): value is Subject => (SUBJECTS as readonly string[]).includes(value);

/**
 * Each job in the panel's words: its French name on the price list, which the
 * operator reads in a lead's `need`. Held equal to the copy's
 * `jobs.<subject>.name` in French by tests/content.test.ts: config cannot read the copy.
 */
export const PANEL_NEED: Readonly<Record<Subject, string>> = {
  sink: "Évier, lavabo, bidet",
  shower: "Douche, baignoire",
  wc: "WC",
  drain: "Canalisation, colonne, égout privatif",
  jetting: "Hydrocurage haute pression",
  camera: "Inspection caméra",
};

/** Every job is one price, the price list's (`pricing.ts`); the server prices the posted job itself. */
export const FLOWS: Readonly<Record<Subject, LeadFlow>> = {
  sink: "fixed",
  shower: "fixed",
  wc: "fixed",
  drain: "fixed",
  jetting: "fixed",
  camera: "fixed",
};

/** When the visitor wants the technician: the card's first question (the kit's `intro`). */
export const WHEN = ["asap", "today", "later"] as const;
export type When = (typeof WHEN)[number];

/** How the visitor wants the booking confirmed. */
export const CONFIRM = ["call", "whatsapp", "sms"] as const;
export type Confirm = (typeof CONFIRM)[number];

/** The extra fields the card posts beyond the core three, each capped at `max` characters. */
export const EXTRAS = {
  when: { name: "when", max: 5 },
  confirm: { name: "confirm", max: 8 },
  name: { name: "first_name", max: 60 },
} as const;

const offList = (lead: LeadCandidate, field: string, list: readonly string[]) => {
  const value = lead.extras[field];
  return value !== undefined && value !== "" && !list.includes(value) ? { field, why: `${field} off the list` } : null;
};

/**
 * What the card posts — the job, the address, the phone, then when, the first
 * name and how to confirm — and what is refused: a number we cannot call
 * (`validateLead`, the rule the form itself blocks on), and a `when` or a
 * `confirm` the card never offers. One refusal at a time, the phone first.
 */
export const LEAD: LeadSchema<Subject> = {
  subjects: SUBJECTS,
  wire: { subject: "subject", locality: "locality", mobile: "mobile" },
  extras: [EXTRAS.when, EXTRAS.confirm, EXTRAS.name],
  flows: FLOWS,
  mobileFormat: "e164",
  validate: lead => validateLead(lead) ?? offList(lead, EXTRAS.when.name, WHEN) ?? offList(lead, EXTRAS.confirm.name, CONFIRM),
};
