import type { Copy } from "@/entities/content";
import { phoneLink, whatsappLink } from "@/shared/lib/phone";
import { button, Icon, Stars } from "@/shared/ui";

/**
 * The proof card beside a sub-page's head (Figma ProofAside 14:799): the
 * rating, three lines of proof, the yellow way to the card, and the place's
 * WhatsApp and number when it has them. From `lg` only — on a phone the
 * sticky bar carries the same actions.
 */
export function ProofAside({ copy, bookHref }: { copy: Copy; bookHref: string }) {
  const { t, f } = copy;
  const phone = phoneLink(f.phone);
  const whatsapp = whatsappLink(f.whatsapp, t.whatsappMessage(f));
  return (
    <aside data-band="proof" className="hidden w-[400px] shrink-0 flex-col gap-4 rounded-[20px] border border-border bg-card p-7 lg:flex">
      <p className="flex items-center gap-2.5">
        <Icon name="google-g" className="size-5" />
        <Stars />
        <span className="text-sm leading-[1.25] font-semibold text-ink">{t.proof.rating}</span>
      </p>
      <ul className="flex flex-col gap-4">
        {t.proof.lines.map(line => (
          <li key={line} className="flex items-center gap-2 text-sm leading-[1.45] text-ink">
            <Icon name="check" className="size-4 text-positive" />
            {line}
          </li>
        ))}
      </ul>
      <a href={bookHref} data-intent="form_open" className={`${button("primary", "lg")} flex items-center justify-center`}>
        {t.proof.cta}
        <Icon name="arrow-right" className="size-5" />
      </a>
      {(whatsapp || phone) && (
        <div className="flex gap-2">
          {whatsapp && (
            <a href={whatsapp} className={`${button("whatsapp")} inline-flex flex-1 items-center justify-center`}>
              <Icon name="whatsapp" className="size-[18px]" />
              {t.whatsappLabel}
            </a>
          )}
          {phone && (
            <a href={phone.href} aria-label={t.callLabel(f)} className={`${button("ghost")} inline-flex flex-1 items-center justify-center`}>
              <Icon name="phone" className="size-[18px]" />
              {phone.display}
            </a>
          )}
        </div>
      )}
    </aside>
  );
}
