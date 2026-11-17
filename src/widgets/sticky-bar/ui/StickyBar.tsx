import type { Copy } from "@/entities/content";
import { phoneLink, whatsappLink } from "@/shared/lib/phone";
import { button, Icon } from "@/shared/ui";
import { Reveal } from "./Reveal";

/** 48 px on a phone, where the three share the width; the frame's md buttons from `md`. */
const SIZE = "h-12 flex-1 justify-center px-2 md:h-11 md:flex-none md:px-[18px]";

/**
 * The frame's StickyBar (10:623 / Mobile 13:889): fixed to the bottom at every
 * width, on the dark background. From `md` the words on the left and
 * WhatsApp, Call and « Réserver » on the right; on a phone the three share the
 * width. WhatsApp and Call only when the place has a number, WhatsApp first.
 * The page keeps the bar's height under the footer so it never hides it.
 */
export function StickyBar({ copy, bookHref }: { copy: Copy; bookHref: string }) {
  const { t, f } = copy;
  const phone = phoneLink(f.phone);
  const whatsapp = whatsappLink(f.whatsapp, t.whatsappMessage(f));
  return (
    <Reveal className="dark fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-border bg-background px-4 py-[11px] md:px-[var(--page-px)] md:py-3 motion-safe:transition-transform motion-safe:duration-300">
      <div className="hidden flex-col gap-0.5 whitespace-nowrap md:flex">
        <p className="text-base leading-[1.25] font-bold text-ink">{t.sticky.title}</p>
        <p className="text-sm leading-[1.45] text-ink-mid">{t.sticky.lede}</p>
      </div>
      <div className="flex min-w-0 flex-1 gap-2 md:flex-none md:gap-2.5">
        {whatsapp && (
          <a href={whatsapp} className={`${button("whatsapp")} ${SIZE} inline-flex items-center`}>
            <Icon name="whatsapp" className="size-[18px]" />
            {t.whatsappShort}
          </a>
        )}
        {phone && (
          <a href={phone.href} aria-label={t.callLabel(f)} className={`${button("ghost")} ${SIZE} inline-flex items-center`}>
            <Icon name="phone" className="size-[18px]" />
            {t.sticky.call}
          </a>
        )}
        <a href={bookHref} data-intent="form_open" className={`${button("primary")} ${SIZE} inline-flex items-center`}>
          {t.sticky.book}
        </a>
      </div>
    </Reveal>
  );
}
