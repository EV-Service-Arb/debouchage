/**
 * The frame's Button (Figma 4:98) as classes over the kit's `Button`: md is
 * 44 px at 18 × 14/600, lg 56 px at 28 × 16/700. The styles are the frame's
 * five; the kit's own `variant` is left `primary` and overridden here, so a
 * button reads the same in either polarity.
 */
const MD = "h-11 gap-2 rounded-[10px] px-[18px] text-sm leading-[1.25] font-semibold [&_.dr-icon]:size-[18px]";
const LG = "h-14 gap-2.5 rounded-[14px] px-7 text-base leading-[1.25] font-bold [&_.dr-icon]:size-5";

const STYLE = {
  primary: "bg-primary text-on-primary hover:bg-primary/85",
  dark: "bg-brand text-white hover:bg-brand/85",
  outline: "border-[1.5px] border-input bg-transparent text-ink shadow-none hover:bg-hover",
  whatsapp: "bg-[var(--whatsapp)] text-on-primary hover:brightness-95",
  ghost: "border border-white/25 bg-white/10 text-white hover:bg-white/20",
} as const;

export type ButtonStyle = keyof typeof STYLE;

export const button = (style: ButtonStyle, size: "md" | "lg" = "md"): string => `${size === "md" ? MD : LG} ${STYLE[style]}`;
