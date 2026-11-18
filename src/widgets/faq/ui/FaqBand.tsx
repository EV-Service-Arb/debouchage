import { Faq, Section } from "@/shared/lib/sites-tools/react";
import type { Copy } from "@/entities/content";
import { phoneLink, whatsappLink } from "@/shared/lib/phone";
import { Icon } from "@/shared/ui";

/**
 * The kit's `<details>` list, closed: nobody reads a page of answers, so they
 * sit in two short columns of questions that open in place, and a line to
 * the number for what is not there.
 */
const ITEMS = {
  list: "flex flex-col gap-2 overflow-visible rounded-none border-0 bg-transparent",
  item: "overflow-hidden rounded-xl border border-border bg-background last:border-b",
  summary: "min-h-0 items-center justify-between gap-4 px-4 py-3! hover:bg-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring",
  question: "font-sans text-sm leading-[1.25] font-semibold text-ink md:text-base",
  icon: "dr-icon dr-icon-chevron-down size-5 shrink-0 text-[0px] leading-none text-ink motion-safe:transition-transform group-open:rotate-180",
  answer: "px-4 pb-4 text-sm leading-[1.5] text-ink-mid",
} as const;

export function FaqBand({ copy, id }: { copy: Copy; id: string }) {
  const { t, f } = copy;
  const phone = phoneLink(f.phone);
  const whatsapp = whatsappLink(f.whatsapp, t.whatsappMessage(f));
  const half = Math.ceil(t.faqs.length / 2);
  return (
    <Section surface="card" id={id} data-band="faq" className="py-10 md:py-14">
      <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
        <h2 className="font-serif text-2xl leading-[1.15] font-bold text-ink md:text-3xl">{t.faqTitle}</h2>
        {(whatsapp || phone) && (
          <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm leading-[1.45] text-ink-mid">
            {t.faqMore}
            {whatsapp && (
              <a href={whatsapp} className="inline-flex items-center gap-1.5 font-semibold text-ink underline-offset-4 hover:underline">
                <Icon name="whatsapp" className="size-4" />
                {t.whatsappLabel}
              </a>
            )}
            {phone && (
              <a href={phone.href} aria-label={t.callLabel(f)} className="inline-flex items-center gap-1.5 font-semibold text-ink underline-offset-4 hover:underline">
                <Icon name="phone" className="size-4" />
                {phone.display}
              </a>
            )}
          </p>
        )}
      </div>
      <div className="mt-6 grid gap-2 md:mt-8 md:grid-cols-2 md:items-start md:gap-x-5">
        <Faq items={t.faqs.slice(0, half)} id={`${id}-a`} classNames={ITEMS} />
        <Faq items={t.faqs.slice(half)} id={`${id}-b`} classNames={ITEMS} />
      </div>
    </Section>
  );
}
