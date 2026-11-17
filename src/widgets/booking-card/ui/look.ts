import type { LeadCapturePart } from "@/shared/lib/sites-tools/react";

/** `LeadCapture`'s parts as a class map. */
export type Look = Readonly<Partial<Record<LeadCapturePart, string>>>;

/**
 * The frame's Tile (4:121 / 4:128): white, a 1.5 px `input` edge, 12 round,
 * 12 of padding, the icon over the name at 14/600 ink; chosen, yellow at
 * 20 % with a 2 px ink edge — the second half-pixel an inset shadow, so
 * nothing moves. The price or the hint under the name is `LINE`.
 */
export const TILE =
  "h-full flex-col items-start justify-start gap-1.5 rounded-xl border-[1.5px] border-input bg-background p-2.5 text-left sm:p-3 text-sm leading-[1.7] font-semibold text-ink peer-checked:border-ink peer-checked:bg-primary/20 peer-checked:shadow-[inset_0_0_0_0.5px_var(--ink)]";

/** A tile's second line, the price or the hint: 12 ink-mid, right under the name. */
const LINE = "text-xs leading-[1.4] font-normal text-ink-mid";

/** The frame's Field (4:109 – 4:115): 52 px, a 1.5 px `input` edge, 12 round, 16 px text; a 2 px ring on focus. */
export const FIELD =
  "h-[52px] rounded-xl border-[1.5px] border-input bg-background px-4 text-base leading-[1.5] text-ink shadow-none placeholder:text-ink-soft md:text-base focus-visible:border-2 focus-visible:border-ring focus-visible:px-[15.5px] focus-visible:ring-0";

/** The frame's lg Primary button: 56 px, 14 round, 16/700. */
export const SUBMIT = "h-14 w-full rounded-[14px] px-7 text-base leading-[1.25] font-bold shadow-none hover:bg-primary/85";

/**
 * The frame's BookingCard (5:282) drawn on `LeadCapture`'s parts. The form is
 * `contents`, so the card's own rows — head, answers, screens — are one
 * column with one gap; the kit's bar and « Retour » are not drawn (the bar's
 * words stay for assistive technology), the answers are the frame's recap
 * row, the price and « Modifier » at its end; the price line is for
 * assistive technology only.
 */
export const LOOK: Look = {
  root: "gap-5",
  form: "contents",
  // The questions' legends: the fields' labels are for assistive technology only (`labels="hidden"`).
  label: "mb-2.5 text-sm leading-[1.25] font-semibold text-ink",
  progress: "sr-only",
  stepBack: "hidden",
  answers:
    "flex-nowrap items-center gap-0 rounded-xl bg-card px-3.5 py-2.5 [&>li]:min-w-0 [&>li:not(:last-child)]:after:px-1 [&>li:not(:last-child)]:after:text-sm [&>li:not(:last-child)]:after:font-semibold [&>li:not(:last-child)]:after:text-ink [&>li:not(:last-child)]:after:content-['·'] [&>li]:flex [&>li]:items-center [&>li:last-child]:flex-1",
  answer: "min-h-0 min-w-0 shrink grow justify-between gap-2.5 border-0 bg-transparent p-0 text-sm leading-[1.25] font-semibold whitespace-nowrap shadow-none hover:bg-transparent",
  answerValue: "truncate font-semibold",
  answerChange: "shrink-0 font-medium text-primary-ink",
  step: "gap-2.5",
  intro: "gap-0",
  introOptions: "grid-cols-3 gap-2",
  introOption: TILE,
  optionHint: LINE,
  optionPrice: `ms-0 -mt-1.5 ${LINE}`,
  needs: "grid-cols-2 gap-2 sm:grid-cols-2",
  need: TILE,
  icon: "justify-start",
  control: FIELD,
  field: "gap-0",
  error: "order-6",
  price: "sr-only",
  trust: "order-7 gap-3",
  submit: SUBMIT,
  stepNext: SUBMIT,
  opening: "hidden",
  others: "hidden",
  done: "gap-5",
  priced: "order-1 gap-3",
  pricedPrice: "sr-only",
  preferDays: "grid-cols-4",
  preferParts: "sm:grid-cols-3",
  preferOption: `${TILE} justify-center`,
};
