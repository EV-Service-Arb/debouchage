import { formatCents } from "@/shared/lib/sites-tools";
import { Section } from "@/shared/lib/sites-tools/react";
import type { Copy } from "@/entities/content";
import { SUBJECTS } from "@/shared/config/lead";
import type { JobPrices } from "@/shared/lib/job-prices";
import { BandHead, button, Icon, JOB_PHOTO, Photo } from "@/shared/ui";

export interface PriceListProps {
  copy: Copy;
  id: string;
  /** The price list's figure for each job; a job it does not price shows none and is still bookable. */
  prices: JobPrices;
  bookHref: string;
  /** The home page's band has its head; the prices page's head is the page's. */
  head: boolean;
}

/**
 * The whole list, one card a job: the photograph of the job, its name and what
 * is done, the price, « Réserver » naming the job for the card (`data-need`).
 * The three terms follow as plain lines. On a phone the card is a row, the
 * photograph a thumbnail.
 */
export function PriceList({ copy, id, prices, bookHref, head }: PriceListProps) {
  const { t, locale } = copy;
  const p = t.prices;
  return (
    <Section surface="background" id={id} data-band="price-list" className="py-14 md:py-20">
      {head && <BandHead eyebrow={p.eyebrow} title={p.title} lede={p.lede} />}
      {!head && <h2 className="sr-only">{p.caption}</h2>}
      <ul className={`grid gap-3 sm:grid-cols-2 md:gap-5 lg:grid-cols-3 ${head ? "mt-8 md:mt-10" : ""}`}>
        {SUBJECTS.map(s => {
          const cents = prices[s];
          return (
            <li key={s} className="flex overflow-hidden rounded-2xl border border-border bg-card sm:flex-col">
              <Photo src={JOB_PHOTO[s]} alt={t.media.jobs[s]} className="w-28 shrink-0 object-cover sm:aspect-[3/2] sm:w-full" />
              <div className="flex min-w-0 flex-1 flex-col gap-2 p-4 md:gap-3 md:p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-serif text-base leading-[1.2] font-bold text-ink md:text-lg">{t.jobs[s].name}</h3>
                  {cents !== null && <p className="font-serif text-2xl leading-none font-extrabold tracking-[-0.01em] whitespace-nowrap text-ink md:text-3xl">{formatCents(cents, locale)}</p>}
                </div>
                <p className="text-xs leading-[1.4] text-ink-mid md:text-sm md:leading-[1.45]">
                  <span className="hidden md:inline">{t.jobs[s].detail}</span>
                  <span className="md:hidden">{t.jobs[s].detailShort}</span>
                </p>
                <a href={bookHref} data-need={s} data-intent="form_open" className={`${button("outline")} mt-auto inline-flex items-center justify-center self-start`}>
                  {p.book}
                </a>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 text-xs leading-[1.4] text-ink-soft md:hidden">{p.note}</p>
      <ul className="mt-8 grid gap-4 md:mt-10 md:grid-cols-3 md:gap-8">
        {(
          [
            ["clock", p.terms[0]],
            ["shield-check", p.terms[1]],
            ["user-check", p.terms[2]],
          ] as const
        ).map(([icon, term]) => (
          <li key={term.title} className="flex gap-3">
            <Icon name={icon} className="mt-0.5 size-5 shrink-0 text-primary-ink" />
            <p className="text-sm leading-[1.45] text-ink-mid">
              <span className="font-bold text-ink">{term.title}</span> {term.body}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
