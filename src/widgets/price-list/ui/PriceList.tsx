import { formatCents } from "@/shared/lib/sites-tools";
import { Section } from "@/shared/lib/sites-tools/react";
import type { Copy } from "@/entities/content";
import { SUBJECTS } from "@/shared/config/lead";
import type { JobPrices } from "@/shared/lib/job-prices";
import { BandHead, button, Icon, JOB_ICON } from "@/shared/ui";

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
 * The frame's Prices band (8:318 / Mobile 11:700): the whole list as a
 * table, one row a job — its icon, name and what is done, the price with
 * what it includes, « Réserver » naming the job for the card (`data-need`) —
 * then the three terms. On a phone the rows drop their button and the
 * included line, said once under the table, and one button follows the terms.
 */
export function PriceList({ copy, id, prices, bookHref, head }: PriceListProps) {
  const { t, locale } = copy;
  const p = t.prices;
  return (
    <Section surface="background" id={id} data-band="price-list" className="py-14 md:py-24">
      {head && <BandHead eyebrow={p.eyebrow} title={p.title} lede={p.lede} />}
      <table className={`w-full border-separate border-spacing-0 overflow-hidden rounded-[20px] border border-border ${head ? "mt-6 md:mt-10" : ""}`}>
        <caption className="sr-only">{p.caption}</caption>
        <tbody>
          {SUBJECTS.map(s => {
            const cents = prices[s];
            return (
              <tr key={s} className="even:bg-card">
                <td className="w-14 py-3.5 pl-3.5 align-middle md:w-[88px] md:py-5 md:pl-6">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary/20 md:size-11">
                    <Icon name={JOB_ICON[s]} className="size-5 md:size-[22px]" />
                  </span>
                </td>
                <th scope="row" className="py-3.5 pl-3 text-left align-middle font-normal md:py-5 md:pl-5">
                  <span className="block text-base leading-[1.25] font-bold text-ink md:text-lg">{t.jobs[s].name}</span>
                  <span className="mt-0.5 block text-xs leading-[1.4] text-ink-mid md:text-sm md:leading-[1.45]">
                    <span className="hidden md:inline">{t.jobs[s].detail}</span>
                    <span className="md:hidden">{t.jobs[s].detailShort}</span>
                  </span>
                </th>
                <td className="py-3.5 pr-3.5 pl-3 text-right align-middle whitespace-nowrap md:py-5 md:pr-0 md:pl-5">
                  {cents !== null && (
                    <>
                      <span className="block font-serif text-[26px] leading-none font-extrabold tracking-[-0.01em] text-ink md:text-3xl">{formatCents(cents, locale)}</span>
                      <span className="hidden text-xs leading-[1.4] text-ink-soft md:block">{p.included}</span>
                    </>
                  )}
                </td>
                <td className="hidden w-[122px] py-5 pr-6 pl-5 text-right align-middle md:table-cell">
                  <a href={bookHref} data-need={s} data-intent="form_open" className={`${button("outline")} inline-flex items-center`}>
                    {p.book}
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-6 text-center text-xs leading-[1.4] text-ink-soft md:hidden">{p.note}</p>
      <ul className="mt-6 grid gap-6 md:mt-10 md:grid-cols-3 md:gap-5">
        {(
          [
            ["clock", p.terms[0]],
            ["shield-check", p.terms[1]],
            ["user-check", p.terms[2]],
          ] as const
        ).map(([icon, term]) => (
          <li key={term.title} className="flex gap-3 rounded-2xl bg-card p-4 md:gap-3.5 md:p-5 md:pb-10">
            <Icon name={icon} className="size-5 text-primary-ink md:size-[22px]" />
            <div className="flex flex-col gap-1">
              <p className="text-sm leading-[1.25] font-bold text-ink md:text-base">{term.title}</p>
              <p className="text-sm leading-[1.45] text-ink-mid">{term.body}</p>
            </div>
          </li>
        ))}
      </ul>
      <a href={bookHref} data-intent="form_open" className={`${button("primary", "lg")} mt-6 flex items-center justify-center md:hidden`}>
        {p.cta}
        <Icon name="arrow-right" className="size-5" />
      </a>
    </Section>
  );
}
