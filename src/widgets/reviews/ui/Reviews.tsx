import { Section } from "@/shared/lib/sites-tools/react";
import { REVIEWS, type Copy } from "@/entities/content";
import { BandHead, Icon, Stars } from "@/shared/ui";

/**
 * The frame's Reviews (9:402 / Mobile 13:707): Google's aggregate and three
 * named reviews, a four-star one among them on purpose. From `lg` the
 * aggregate is a column beside three cards; on a phone it is one row over
 * the cards, stacked. All of
 * it is the frame's sample (OWNER_TODO "reviews"), and nothing of it reaches
 * the structured data. The frame's « Voir sur Google » waits for the place's
 * Google page: there is none to link to yet.
 */
export function Reviews({ copy, id }: { copy: Copy; id: string }) {
  const r = copy.t.reviews;
  return (
    <Section surface="background" id={id} data-band="reviews" className="py-14 md:py-24">
      <BandHead eyebrow={r.eyebrow} title={r.title} />
      <div className="mt-5 grid gap-5 md:mt-10 lg:grid-cols-[260px_1fr]">
        <div className="flex items-center gap-3.5 rounded-2xl bg-card px-4 py-4 lg:flex-col lg:items-start lg:gap-0 lg:rounded-[20px] lg:p-7">
          <Icon name="google-g" className="size-7" />
          <p className="font-serif text-[32px] leading-[1.15] font-extrabold tracking-[-0.015em] text-ink lg:mt-3.5 lg:text-[44px] lg:leading-[1.08]">{r.average}</p>
          <div className="flex flex-col gap-0.5 lg:mt-3.5 lg:gap-3.5">
            <Stars />
            <p className="text-sm leading-[1.25] font-semibold text-ink">{r.total}</p>
          </div>
          <p className="mt-3.5 hidden text-sm leading-[1.45] text-ink-mid lg:block">{r.note}</p>
        </div>
        <ul className="grid min-w-0 gap-5 md:grid-cols-3">
          {REVIEWS.map(({ key, stars }) => {
            const review = r.items[key];
            return (
              <li key={key} className="flex flex-col gap-3.5 rounded-[20px] border border-border bg-background p-[19px] md:p-6">
                <div className="flex items-center gap-2.5 md:gap-3">
                  <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm leading-[1.25] font-bold text-ink md:size-10 md:text-base">
                    {review.name.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-[1.25] font-semibold text-ink">{review.name}</p>
                    <p className="truncate text-xs leading-[1.4] text-ink-soft">{review.meta}</p>
                  </div>
                  <Icon name="google-g" className="size-4 md:size-[18px]" />
                </div>
                <p className="sr-only">{`${stars}/5`}</p>
                <Stars given={stars} />
                <blockquote className="text-sm leading-[1.45] text-ink">{review.quote}</blockquote>
                <p className="flex items-center gap-1.5 self-start rounded-full bg-card px-2.5 py-1.5 text-xs leading-[1.25] font-semibold text-ink">
                  <Icon name="check" className="size-3 text-positive" />
                  {review.job}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </Section>
  );
}
