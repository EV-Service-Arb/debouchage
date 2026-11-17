import { Faq, Section } from "@/shared/lib/sites-tools/react";
import type { Copy } from "@/entities/content";
import { phoneLink, whatsappLink } from "@/shared/lib/phone";
import { button, Icon, TYPE } from "@/shared/ui";

/**
 * The kit's `<details>` list in the frame's FAQ items (10:529): white cards
 * 10 apart, a 16 px question, a chevron that turns over when the item opens
 * (the kit's « + » is hidden and the chevron masked in its place).
 */
const ITEMS = {
  list: "flex flex-col gap-2.5 overflow-visible rounded-none border-0 bg-transparent",
  item: "overflow-hidden rounded-2xl border border-border bg-background last:border-b",
  summary: "items-center justify-between gap-4 px-4 py-4 hover:bg-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring md:px-6 md:py-5",
  question: "font-sans text-base leading-[1.25] font-semibold text-ink",
  icon: "dr-icon dr-icon-chevron-down size-5 shrink-0 text-[0px] leading-none text-ink motion-safe:transition-transform group-open:rotate-180",
  answer: "px-4 pb-4 text-sm leading-[1.45] text-ink-mid md:px-6 md:pb-5 md:text-base md:leading-[1.5]",
} as const;

/**
 * The frame's FAQ band (10:524 / Mobile 13:828) on the light card. The
 * « Une autre question ? » row offers the place's WhatsApp and number, so it
 * goes with them.
 */
export function FaqBand({ copy, id }: { copy: Copy; id: string }) {
  const { t, f } = copy;
  const phone = phoneLink(f.phone);
  const whatsapp = whatsappLink(f.whatsapp, t.whatsappMessage(f));
  return (
    <Section surface="card" id={id} data-band="faq" className="py-14 md:py-24">
      <div className="flex flex-col gap-3 md:items-center md:text-center">
        <p className={`${TYPE.eyebrow} text-primary-ink`}>{t.faqEyebrow}</p>
        <h2 className={`${TYPE.h2} text-ink`}>{t.faqTitle}</h2>
      </div>
      <div className="mx-auto max-w-[760px]">
        <Faq items={t.faqs} id={`${id}-list`} className="mt-5 md:mt-10" classNames={ITEMS} />
        {(whatsapp || phone) && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <p className="text-sm leading-[1.45] text-ink-mid">{t.faqMore}</p>
            {whatsapp && (
              <a href={whatsapp} className={`${button("whatsapp")} inline-flex items-center`}>
                <Icon name="whatsapp" className="size-[18px]" />
                {t.faqWrite}
              </a>
            )}
            {phone && (
              <a href={phone.href} aria-label={t.callLabel(f)} className={`${button("outline")} inline-flex items-center bg-background`}>
                <Icon name="phone" className="size-[18px]" />
                {phone.display}
              </a>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}
