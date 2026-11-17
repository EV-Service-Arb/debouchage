import { Section } from "@/shared/lib/sites-tools/react";
import type { ReactNode } from "react";
import type { Copy } from "@/entities/content";
import { phoneLink, whatsappLink } from "@/shared/lib/phone";
import { Icon, Stars, TYPE } from "@/shared/ui";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/** Under the card: the frame's lg buttons on a phone, its md ghost buttons from `lg`. */
const NOW = `inline-flex h-14 flex-1 items-center justify-center gap-2.5 rounded-[14px] px-7 text-base leading-[1.25] font-bold lg:h-11 lg:flex-none lg:gap-2 lg:rounded-[10px] lg:border lg:border-white/25 lg:bg-white/10 lg:px-[18px] lg:text-sm lg:font-semibold lg:text-white lg:hover:bg-white/20 ${FOCUS}`;

/**
 * The frame's Hero (7:212 / Mobile 11:541) on the dark background: the pitch
 * on the left, the booking card on the right with the place's WhatsApp and
 * number under it, WhatsApp first and each only when the place has one. On a
 * phone the card comes right after the rating, and the proof chips and « who
 * comes » after it: one grid, ordered per breakpoint.
 */
export function Hero({ copy, card }: { copy: Copy; card: ReactNode }) {
  const { t, f } = copy;
  const h = t.hero;
  const phone = phoneLink(f.phone);
  const whatsapp = whatsappLink(f.whatsapp, t.whatsappMessage(f));
  return (
    <Section polarity="dark" surface="background" data-band="hero" className="py-0 pt-5 pb-10 lg:pt-14 lg:pb-[88px]">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_480px] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-7">
        <div className="flex flex-col gap-5 lg:gap-7 lg:pt-6">
          <p className={`${TYPE.eyebrow} flex items-center gap-1.5 text-primary lg:gap-2`}>
            <Icon name="map-pin" className="size-3 lg:size-3.5" />
            <span className="hidden lg:inline">{h.eyebrow}</span>
            <span className="lg:hidden">{h.eyebrowShort}</span>
          </p>
          <h1 className={`${TYPE.h1} text-ink`}>
            {h.title[0]} {h.title[1]} <span className="text-primary lg:block">{h.accent}</span>
          </h1>
          <p className="text-base leading-[1.5] text-ink-mid lg:text-lg lg:leading-[1.55]">
            <span className="hidden lg:inline">{h.lede}</span>
            <span className="lg:hidden">{h.ledeShort}</span>
          </p>
          <p className="flex items-center gap-2 lg:gap-2.5">
            <Icon name="google-g" className="size-[18px] lg:size-5" />
            <Stars />
            <span className="text-sm leading-[1.25] font-bold text-ink lg:text-base">{h.rating.value}</span>
            <span className="text-sm leading-[1.45] text-ink-mid">{h.rating.count}</span>
          </p>
        </div>
        <div className="flex flex-col gap-5 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:gap-3.5">
          {card}
          {(whatsapp || phone) && (
            <div data-band="hero-contact" className="flex items-center justify-center gap-2 lg:gap-2.5">
              <p className="hidden text-sm leading-[1.45] text-ink-mid lg:block">{h.orNow}</p>
              {whatsapp && (
                <a href={whatsapp} className={`${NOW} bg-[var(--whatsapp)] text-on-primary`}>
                  <Icon name="whatsapp" className="size-5 lg:size-[18px]" />
                  {t.whatsappLabel}
                </a>
              )}
              {phone && (
                <a href={phone.href} aria-label={t.callLabel(f)} className={`${NOW} border border-white/25 bg-white/10 text-white`}>
                  <Icon name="phone" className="size-5 lg:size-[18px]" />
                  <span className="lg:hidden">{t.sticky.call}</span>
                  <span className="hidden lg:inline">{phone.display}</span>
                </a>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-5 lg:gap-7">
          <ul className="flex flex-wrap gap-1.5 lg:gap-2">
            {h.chips.map(chip => (
              <li key={chip} className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.08] py-1.5 pr-3 pl-2.5 text-xs leading-[1.25] font-semibold text-ink">
                <Icon name="check" className="size-3.5 text-positive" />
                {chip}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-[15px] py-[13px] lg:gap-3.5 lg:px-[18px] lg:py-3.5">
            <div aria-hidden="true" className="flex shrink-0">
              {h.who.initials.map(initial => (
                <span
                  key={initial}
                  className="-mr-2.5 flex size-10 items-center justify-center rounded-full border-2 border-card bg-primary text-base leading-[1.25] font-bold text-on-primary last:mr-0 lg:size-11"
                >
                  {initial}
                </span>
              ))}
            </div>
            <div className="flex min-w-0 flex-col gap-0.5 text-sm">
              <p className="leading-[1.25] font-semibold text-ink">
                <span className="hidden lg:inline">{h.who.title}</span>
                <span className="lg:hidden">{h.who.titleShort}</span>
              </p>
              <p className="text-xs leading-[1.4] text-ink-mid lg:text-sm lg:leading-[1.45]">
                <span className="hidden lg:inline">{h.who.lede}</span>
                <span className="lg:hidden">{h.who.ledeShort}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
