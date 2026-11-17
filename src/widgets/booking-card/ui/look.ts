import type { LeadCapturePart } from "@/shared/lib/sites-tools/react";

/** `LeadCapture`'s parts as a class map. */
export type Look = Readonly<Partial<Record<LeadCapturePart, string>>>;

/**
 * The frame's Tile (4:121 / 4:128): white, a 1.5 px `input` edge, 12 round,
 * 12 of padding, the icon over the words; chosen, yellow at 20 % with a 2 px
 * ink edge — the second half-pixel an inset shadow, so nothing moves. Its
 * label is two lines (`whitespace-pre-line`): the name at 14/600 ink on the
 * first, the price or the hint at 12 ink-mid under it.
 */
export const TILE =
  "h-full flex-col items-start justify-start gap-1.5 rounded-xl border-[1.5px] border-input bg-background p-3 text-left text-xs leading-[1.4] whitespace-pre-line text-ink-mid peer-checked:border-ink peer-checked:bg-primary/20 peer-checked:shadow-[inset_0_0_0_0.5px_var(--ink)] [&>span:last-child]:first-line:text-sm [&>span:last-child]:first-line:leading-[1.7] [&>span:last-child]:first-line:font-semibold [&>span:last-child]:first-line:text-ink [&_.dr-icon]:size-[22px] [&_.dr-icon]:text-ink";

/** The frame's Field (4:109 – 4:115): 52 px, a 1.5 px `input` edge, 12 round, 16 px text; a 2 px ring on focus. */
export const FIELD =
  "h-[52px] rounded-xl border-[1.5px] border-input bg-background px-4 text-base leading-[1.5] text-ink shadow-none placeholder:text-ink-soft md:text-base focus-visible:border-2 focus-visible:border-ring focus-visible:px-[15.5px] focus-visible:ring-0";

/** The frame's lg Primary button: 56 px, 14 round, 16/700. */
export const SUBMIT = "h-14 w-full rounded-[14px] px-7 text-base leading-[1.25] font-bold shadow-none hover:bg-primary/85";

/**
 * The card's order on the last screen, which the kit draws as price,
 * address, phone, name, extras, submit: the frame's is first name, phone,
 * address, how to confirm, then the price and the submit.
 */
const CONTACT_ORDER =
  "[&>*:has([data-lead-field=name])]:order-1 [&>*:has([data-lead-field=phone])]:order-2 [&>*:has([data-lead-field=locality])]:order-3 [&>fieldset]:order-4";

/**
 * The frame's BookingCard (5:282) drawn on `LeadCapture`'s parts. The form is
 * `contents`, so the card's own rows — head, answers, screens — are one
 * column with one gap; the kit's bar and « Retour » are not drawn (the bar's
 * words stay for assistive technology), the answers are the frame's recap
 * row, one « Modifier » at its end.
 */
export const LOOK: Look = {
  root: "gap-5",
  form: "contents",
  // The questions' legends: the fields' labels are for assistive technology only (`labels="hidden"`).
  label: "mb-2.5 text-sm leading-[1.25] font-semibold text-ink",
  progress: "[&>[data-slot=progress]]:hidden",
  stepBack: "hidden",
  answers:
    "flex-nowrap items-center gap-0 rounded-xl bg-card px-3.5 py-2.5 [&>li]:min-w-0 [&>li:not(:last-child)]:after:px-1 [&>li:not(:last-child)]:after:text-sm [&>li:not(:last-child)]:after:font-semibold [&>li:not(:last-child)]:after:text-ink [&>li:not(:last-child)]:after:content-['·'] [&>li]:flex [&>li]:items-center [&>li:last-child]:flex-1 [&>li:not(:last-child)_button>span:last-child]:hidden",
  answer:
    "min-h-0 w-full justify-between gap-2.5 border-0 bg-transparent p-0 text-sm leading-[1.25] font-semibold whitespace-nowrap shadow-none hover:bg-transparent [&>span:last-child]:font-medium [&>span:last-child]:text-primary-ink [&>span:nth-child(2)]:truncate [&>span:nth-child(2)]:font-semibold",
  step: `gap-2.5 ${CONTACT_ORDER}`,
  intro: "gap-0 [&>div]:grid-cols-3 [&>div]:gap-2",
  introOption: TILE,
  needs: "grid-cols-2 gap-2 sm:grid-cols-2",
  need: TILE,
  icon: "justify-start",
  control: FIELD,
  field: "gap-0",
  error: "order-6",
  price: "order-5 py-1",
  priceLine: "text-sm leading-[1.45] text-ink-mid",
  priceTotal: "font-semibold text-ink",
  trust: "order-7 gap-3",
  submit: SUBMIT,
  opening: "hidden",
  others: "hidden",
  done: "gap-5",
  priced: "order-1 gap-3",
  pricedPrice: "sr-only",
  bookingNote: "text-sm leading-[1.45] text-ink-mid",
  prefer: "gap-3 [&>p]:text-sm [&>p]:font-semibold [&>p]:text-ink",
  preferOption: "rounded-xl border-[1.5px] border-input text-sm peer-checked:border-ink peer-checked:bg-primary/20",
  preferSubmit: "h-11 rounded-[10px] border-[1.5px] border-input text-sm font-semibold",
};
