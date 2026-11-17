import { Section } from "@/shared/lib/sites-tools/react";
import type { PageHeadCopy } from "@/entities/content";
import { TYPE } from "@/shared/ui";
import type { ReactNode } from "react";

/**
 * The sub-pages' head (Figma PageHead 14:794) on the dark background: the
 * eyebrow, the page's `<h1>` and the lede, with `aside` beside them from
 * `lg` — the proof card. On a phone the head stands alone, the hero's sizes.
 */
export function PageHead({ head, aside }: { head: PageHeadCopy; aside: ReactNode }) {
  return (
    <Section polarity="dark" surface="background" data-band="page-head" className="py-10 lg:pt-16 lg:pb-20">
      <div className="flex items-center gap-16">
        <div className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-5">
          <p className={`${TYPE.eyebrow} text-primary`}>{head.eyebrow}</p>
          <h1 className={`${TYPE.h1} text-ink`}>{head.title}</h1>
          <p className="max-w-[672px] text-base leading-[1.5] text-ink-mid lg:text-lg lg:leading-[1.55]">{head.lede}</p>
        </div>
        {aside}
      </div>
    </Section>
  );
}
