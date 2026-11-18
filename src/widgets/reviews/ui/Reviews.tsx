import { Section } from "@/shared/lib/sites-tools/react";
import { REVIEWS, type Copy } from "@/entities/content";
import { BandHead, Icon, PHOTO, Photo, Stars } from "@/shared/ui";

/**
 * Google's aggregate beside the head, then three named reviews, each with the
 * photograph its author sent; a four-star one is among them on purpose. All
 * of it is sample (OWNER_TODO "reviews", "photographs"), and nothing of it
 * reaches the structured data. « Voir sur Google » waits for the place's
 * Google page: there is none to link to yet.
 */
export function Reviews({ copy, id }: { copy: Copy; id: string }) {
  const r = copy.t.reviews;
  return (
    <Section surface="background" id={id} data-band="reviews" className="py-14 md:py-20">
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-16">
        <BandHead eyebrow={r.eyebrow} title={r.title} />
        <div className="flex shrink-0 items-center gap-3">
          <Icon name="google-g" className="size-7" />
          <p className="font-serif text-4xl leading-none font-extrabold tracking-[-0.015em] text-ink">{r.average}</p>
          <div className="flex flex-col gap-1">
            <Stars />
            <p className="text-sm leading-[1.25] font-semibold text-ink">{r.total}</p>
          </div>
        </div>
      </div>
      <ul className="mt-8 grid min-w-0 gap-4 md:mt-10 md:grid-cols-3 md:gap-5">
        {REVIEWS.map(({ key, stars }) => {
          const review = r.items[key];
          return (
            <li key={key} className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
              <Photo src={PHOTO.reviews[key]} alt={copy.t.media.reviews[key]} className="aspect-[4/3] w-full object-cover" />
              <div className="flex flex-1 flex-col gap-3 p-5">
                <p className="sr-only">{`${stars}/5`}</p>
                <Stars given={stars} />
                <blockquote className="text-sm leading-[1.5] text-ink">{review.quote}</blockquote>
                <div className="mt-auto flex items-center gap-2.5 pt-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-[1.25] font-semibold text-ink">{review.name}</p>
                    <p className="truncate text-xs leading-[1.4] text-ink-soft">{review.meta}</p>
                  </div>
                  <Icon name="google-g" className="size-[18px]" />
                </div>
                <p className="flex items-center gap-1.5 self-start rounded-full bg-muted px-2.5 py-1.5 text-xs leading-[1.25] font-semibold text-ink">
                  <Icon name="check" className="size-3 text-positive" />
                  {review.job}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
