import type { CopySlice, CoreText, Said as CoreSaid } from "@/shared/lib/sites-tools";
import type { Locale } from "@/shared/config/i18n";
import type { Confirm, Subject, When } from "@/shared/config/lead";
import type { FooterPage, NavId } from "@/shared/config/nav";
import type { PageKey, Subpage } from "@/shared/config/site";

/**
 * The facts a sentence may quote. Prose that names the phone or the place
 * takes them as an argument, so the number in the sentence and the number on
 * the card are one field.
 */
export interface Facts {
  place: string;
  /** `null` until the place has a number. */
  phone: string | null;
  /** The place's WhatsApp, `contactOf`'s: `null` until it has a number. */
  whatsapp: string | null;
}

export type Said = CoreSaid<Facts>;

/** The reviews of the frame, in its order, and the stars each gives: a four-star one is shown on purpose. */
export const REVIEWS = [
  { key: "sophie", stars: 5 },
  { key: "thierry", stars: 5 },
  { key: "nadia", stars: 4 },
] as const;
export type ReviewKey = (typeof REVIEWS)[number]["key"];

export interface Review {
  name: string;
  /** "Chamalières · il y a 2 semaines". */
  meta: string;
  quote: string;
  /** The job and its price, as the chip under the quote says it. */
  job: string;
}

/** A band's head: the eyebrow, the headline and, beside it from `md`, the lede. */
export interface BandHeadCopy {
  eyebrow: string;
  title: string;
  lede?: string;
}

/** A sub-page's head: the eyebrow, the `<h1>` and the lede. */
export interface PageHeadCopy {
  eyebrow: string;
  title: string;
  lede: string;
}

/** A job of the price list: its name on the table, on the card's tile, and what is done. */
export interface Job {
  name: string;
  tile: string;
  detail: string;
  /** The table's line on a phone, where the full one runs to three lines. */
  detailShort: string;
}

/** A written term of the guarantee page, and what it does not cover. */
export interface WrittenTerm {
  title: string;
  body: string;
  excludes: string;
}

/** A step of « Comment ça se passe ». */
export interface Step {
  title: string;
  body: string;
  check: string;
}

/** A term with its icon's meaning given by its title. */
export interface Term {
  title: string;
  body: string;
}

/**
 * Every string that differs between languages. It extends `CoreText`, the
 * words the machinery prints; the rest is the Figma frame's bands, one key
 * per band. `FR` is the designed language and `EN` its translation, both
 * `satisfies Text`, so a key in one and not the other is a compile error.
 */
export interface Text extends CoreText<PageKey, Facts> {
  nav: Record<NavId, string> & { menu: string; home: string; book: string };
  /** The strip over the header: the availability and the hours. */
  availability: { now: string; nowShort: string; hours: string };
  hero: {
    eyebrow: string;
    eyebrowShort: string;
    /** Two lines in white, the accent line in yellow. */
    title: readonly [string, string];
    accent: string;
    lede: string;
    ledeShort: string;
    rating: { value: string; count: string };
    chips: readonly string[];
    who: { initials: readonly string[]; title: string; titleShort: string; lede: string; ledeShort: string };
    orNow: string;
  };
  /** The booking card (Figma BookingCard 5:282): the brand's words over the kit's `LeadCapture`. */
  card: {
    title: string;
    lede: string;
    contactTitle: string;
    contactLede: string;
    /** The slot's screen, after « aujourd’hui » or « autre jour ». */
    slotTitle: string;
    slotLede: string;
    slotDay: string;
    slotPart: string;
    /** The day tiles' names for today and tomorrow, over their date. */
    slotToday: string;
    slotTomorrow: string;
    needLabel: string;
    whenLabel: string;
    when: Record<When, { label: string; hint: string }>;
    confirmLabel: string;
    confirm: Record<Confirm, string>;
    labels: { name: string; phone: string; address: string };
    placeholders: { name: string; phone: string; address: string };
    /** `{price}` the job's fixed price. */
    priceLine: string;
    /** The submit once the job is chosen, `{price}` its price. */
    submitPrice: string;
    pricePending: string;
    reassurance: readonly string[];
    trust: readonly string[];
    done: {
      /** `{name}` the first name, when one was given. */
      title: string;
      titleAnonymous: string;
      /** Around the number as typed, which is set bold. */
      call: readonly [string, string];
      rows: { job: string; arrival: string; price: string; payment: string };
      arrival: Record<When, string>;
      /** The slot kept with the booking: `{day}` today's word or the date, `{part}` the part of the day. */
      arrivalSlot: string;
      today: string;
      parts: Record<"morning" | "afternoon" | "evening", string>;
      /** `{price}` the price the server took the lead at. */
      priceValue: string;
      payment: string;
      photo: string;
      photoMessage: (job: string) => string;
      note: string;
      callbackTitle: string;
      callbackBody: string;
    };
  };
  stats: readonly { value: string; label: string; labelShort: string }[];
  jobs: Record<Subject, Job>;
  prices: BandHeadCopy & {
    caption: string;
    /** Under every price: what it includes. */
    included: string;
    book: string;
    /** On a phone the rows drop their "Réserver": one line and one action under the table. */
    note: string;
    cta: string;
    terms: readonly [Term, Term, Term];
  };
  steps: BandHeadCopy & { items: readonly [Step, Step, Step] };
  reviews: BandHeadCopy & { average: string; total: string; note: string; items: Record<ReviewKey, Review> };
  guarantee: { title: string; body: string; cta: string };
  area: BandHeadCopy & { towns: readonly string[]; more: string };
  faqEyebrow: string;
  faqTitle: string;
  faqs: readonly { q: string; a: string }[];
  faqMore: string;
  faqWrite: string;
  closing: { title: string; lede: string; ledeShort: string; cta: string };
  footer: { pages: Record<FooterPage, string>; copyright: (year: number) => string; legal: string; mentions: string; privacy: string; hours: string };
  sticky: { title: string; lede: string; call: string; book: string };
  heads: Record<Subpage, PageHeadCopy>;
  /** The card beside a sub-page's head. */
  proof: { rating: string; lines: readonly string[]; cta: string };
  /** Prices page: what is always in the price, never on top of it, and quoted apart. */
  included: readonly { title: string; items: readonly string[] }[];
  /** Guarantee page: the three written terms, and what each does not cover. */
  promises: readonly [WrittenTerm, WrittenTerm, WrittenTerm];
  /** About page: the technicians (the frame's sample) and the company's facts. */
  team: { photo: string; members: readonly { name: string; role: string; bio: string }[] };
  company: readonly { label: string; value: string }[];
  /** The apex of a network of places: its `<head>` and the directory's link. */
  brandPage: { title: string; description: string; open: string };
}

export type Copy = CopySlice<Locale, Text, Facts>;
