import { TYPE } from "./type";

/**
 * A light band's head as the frame repeats it: the eyebrow over the headline,
 * and — when there is one — the lede beside them, bottom-aligned from `md`
 * and under them on a phone.
 */
export function BandHead({ eyebrow, title, lede, center = false }: { eyebrow: string; title: string; lede?: string | undefined; center?: boolean }) {
  return (
    <div className={`flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-16 ${center ? "items-center text-center md:justify-center" : ""}`}>
      <div className="flex min-w-0 flex-col gap-3">
        <p className={`${TYPE.eyebrow} text-primary-ink`}>{eyebrow}</p>
        <h2 className={`${TYPE.h2} text-ink`}>{title}</h2>
      </div>
      {lede && <p className="text-base leading-[1.5] text-ink-mid md:w-[440px] md:shrink-0">{lede}</p>}
    </div>
  );
}
