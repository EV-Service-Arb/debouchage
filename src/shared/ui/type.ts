/**
 * The Figma text styles the page repeats (file 6LWuvlJoqYK4S8sdAZOIJ0), phone
 * first then from `md` up: Bricolage Grotesque for the display styles,
 * Instrument Sans for the rest; tracking is the style's, in em. No colour
 * here — a band gives it, so one style reads on every surface.
 */
export const TYPE = {
  /** Display/H1: 32 → 56, line 1.04, −2 %. */
  h1: "font-serif font-extrabold text-[32px] leading-[1.06] tracking-[-0.02em] md:text-[56px] md:leading-[1.04]",
  /** Display/4xl: 34 → 44, line 1.08, −1.5 %. */
  h2: "font-serif font-extrabold text-[34px] leading-[1.08] tracking-[-0.015em] md:text-[44px]",
  /** Display/2xl: 26, line 1.15, −0.5 %. */
  h3: "font-serif font-bold text-[26px] leading-[1.15] tracking-[-0.005em]",
  /** Display/xl: 20, line 1.2. */
  h4: "font-serif font-bold text-xl leading-[1.2]",
  /** Label/xs Eyebrow: 12 bold caps, 10 % apart. */
  eyebrow: "text-xs leading-[1.25] font-bold uppercase tracking-[0.1em]",
} as const;
