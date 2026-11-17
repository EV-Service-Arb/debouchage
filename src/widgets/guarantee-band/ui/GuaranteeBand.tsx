import { Section } from "@/shared/lib/sites-tools/react";
import type { Copy } from "@/entities/content";
import { button, Icon, TYPE } from "@/shared/ui";

/**
 * The frame's Guarantee band (9:517 / Mobile 13:794) on the dark background:
 * the shield on yellow, the promise, and from `md` the way to the card. The
 * terms are the frame's sample (OWNER_TODO "guarantee").
 */
export function GuaranteeBand({ copy, bookHref }: { copy: Copy; bookHref: string }) {
  const g = copy.t.guarantee;
  return (
    <Section polarity="dark" surface="background" data-band="guarantee" className="py-12 md:py-[72px]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-10">
        <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary md:size-[88px]">
          <Icon name="shield-check" className="size-7 md:size-10" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-4 md:gap-2.5">
          <h2 className={`${TYPE.h2} text-ink`}>{g.title}</h2>
          <p className="text-base leading-[1.5] text-ink-mid md:text-lg md:leading-[1.55]">{g.body}</p>
        </div>
        <a href={bookHref} data-intent="form_open" className={`${button("primary", "lg")} hidden shrink-0 items-center md:inline-flex`}>
          {g.cta}
          <Icon name="arrow-right" className="size-5" />
        </a>
      </div>
    </Section>
  );
}
