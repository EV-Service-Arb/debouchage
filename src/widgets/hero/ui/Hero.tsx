import { Section } from "@/shared/lib/sites-tools/react";
import type { ReactNode } from "react";
import type { Copy } from "@/entities/content";
import { phoneLink, whatsappLink } from "@/shared/lib/phone";
import { button, Icon, PHOTO, Stars, TYPE } from "@/shared/ui";
import { HeroMedia } from "./HeroMedia";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/**
 * The first screen: the offer over a photograph, the booking card at its
 * right, the two other ways in (call, WhatsApp) under the proof. The photograph
 * fades into the page colour at the bottom and the left, so the dark of the
 * hero is the page's own and not a block laid on it. On a phone the card comes
 * right after the rating: one grid, ordered per breakpoint.
 */
export function Hero({ copy, card }: { copy: Copy; card: ReactNode }) {
  const { t, f } = copy;
  const h = t.hero;
  const phone = phoneLink(f.phone);
  const whatsapp = whatsappLink(f.whatsapp, t.whatsappMessage(f));
  return (
    <Section polarity="dark" surface="background" data-band="hero" className="relative isolate overflow-hidden py-0 pt-8 pb-12 lg:pt-14 lg:pb-20">
      <HeroMedia still={PHOTO.hero} alt={t.media.hero} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-b from-background/85 via-background/70 to-background lg:bg-gradient-to-r lg:from-background lg:via-background/80 lg:to-background/25" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 hidden h-32 bg-gradient-to-t from-background to-transparent lg:block" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_480px] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:gap-y-8">
        <div className="flex flex-col gap-5 lg:gap-6 lg:pt-4">
          <p className="inline-flex items-center gap-2 self-start rounded-full border border-white/15 bg-black/25 py-1.5 pr-3.5 pl-3 text-xs leading-[1.25] font-semibold text-ink backdrop-blur-sm">
            <span aria-hidden="true" className="size-2 rounded-full bg-positive" />
            {t.availability}
          </p>
          <h1 className={`${TYPE.h1} text-ink`}>
            <span className="lg:block">{h.title[0]}</span> <span className="lg:block">{h.title[1]}</span> <span className="block text-primary-ink">{h.accent}</span>
          </h1>
          <p className="max-w-[34rem] text-base leading-[1.5] text-ink-mid lg:text-lg lg:leading-[1.55]">
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
        <div className="flex flex-col gap-5 lg:col-start-2 lg:row-span-2 lg:row-start-1">{card}</div>
        <div className="flex flex-col gap-5 lg:gap-6">
          <ul className="flex flex-wrap gap-2">
            {h.chips.map(chip => (
              <li key={chip} className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/25 py-1.5 pr-3 pl-2.5 text-xs leading-[1.25] font-semibold text-ink backdrop-blur-sm">
                <Icon name="check" className="size-3.5 text-positive" />
                {chip}
              </li>
            ))}
          </ul>
          {(whatsapp || phone) && (
            <div data-band="hero-contact" className="flex flex-wrap items-center gap-3">
              <p className="text-sm leading-[1.45] text-ink-mid">{h.orNow}</p>
              {whatsapp && (
                <a href={whatsapp} className={`${button("ghost")} inline-flex items-center ${FOCUS}`}>
                  <Icon name="whatsapp" className="size-[18px]" />
                  {t.whatsappLabel}
                </a>
              )}
              {phone && (
                <a href={phone.href} aria-label={t.callLabel(f)} className={`${button("ghost")} inline-flex items-center ${FOCUS}`}>
                  <Icon name="phone" className="size-[18px]" />
                  {phone.display}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
