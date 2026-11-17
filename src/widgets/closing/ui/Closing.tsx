import { Section } from "@/shared/lib/sites-tools/react";
import type { Copy } from "@/entities/content";
import { phoneLink, whatsappLink } from "@/shared/lib/phone";
import { button, Icon, TYPE } from "@/shared/ui";

const OUTLINE = "border-[1.5px] border-on-primary bg-transparent text-on-primary hover:bg-on-primary/5";

/**
 * The frame's Closing CTA (10:579 / Mobile 13:863) on yellow: the headline,
 * the lede, the dark button back to the card, and from `md` WhatsApp and the
 * number as outline buttons — WhatsApp first, each only when the place has one.
 */
export function Closing({ copy, id, bookHref }: { copy: Copy; id: string; bookHref: string }) {
  const { t, f } = copy;
  const phone = phoneLink(f.phone);
  const whatsapp = whatsappLink(f.whatsapp, t.whatsappMessage(f));
  return (
    <Section id={id} surface="primary" data-band="cta" className="py-12 md:py-20">
      <div className="flex flex-col gap-4 md:items-center md:gap-5 md:text-center">
        <h2 className={`${TYPE.h2} text-on-primary`}>{t.closing.title}</h2>
        <p className="text-base leading-[1.5] text-on-primary md:text-lg md:leading-[1.55]">
          <span className="hidden md:inline">{t.closing.lede}</span>
          <span className="md:hidden">{t.closing.ledeShort}</span>
        </p>
        <div className="flex flex-col gap-3 md:flex-row">
          <a href={bookHref} data-intent="form_open" className={`${button("dark", "lg")} inline-flex items-center justify-center`}>
            {t.closing.cta}
          </a>
          {whatsapp && (
            <a href={whatsapp} className={`${button("outline", "lg")} ${OUTLINE} hidden items-center md:inline-flex`}>
              <Icon name="whatsapp" className="size-5" />
              {t.whatsappLabel}
            </a>
          )}
          {phone && (
            <a href={phone.href} aria-label={t.callLabel(f)} className={`${button("outline", "lg")} ${OUTLINE} hidden items-center md:inline-flex`}>
              <Icon name="phone" className="size-5" />
              {phone.display}
            </a>
          )}
        </div>
      </div>
    </Section>
  );
}
