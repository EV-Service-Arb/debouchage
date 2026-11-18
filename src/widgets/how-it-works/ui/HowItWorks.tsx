import { Section } from "@/shared/lib/sites-tools/react";
import type { Copy } from "@/entities/content";
import { BandHead, Icon, PHOTO, Photo } from "@/shared/ui";

/**
 * Three steps beside the two people who come: the crew's photograph, then the
 * numbered steps in one column, each with the check line it earns.
 */
export function HowItWorks({ copy, id }: { copy: Copy; id: string }) {
  const s = copy.t.steps;
  return (
    <Section surface="muted" id={id} data-band="how-it-works" className="py-14 md:py-20">
      <div className="grid gap-8 lg:grid-cols-[5fr_6fr] lg:items-center lg:gap-16">
        <Photo src={PHOTO.crew} alt={copy.t.media.crew} className="aspect-[4/3] w-full rounded-2xl object-cover lg:aspect-[5/6]" />
        <div className="flex flex-col gap-8">
          <BandHead eyebrow={s.eyebrow} title={s.title} />
          <ol className="flex flex-col gap-6">
            {s.items.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary text-base leading-[1.25] font-bold text-on-secondary">{i + 1}</span>
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-serif text-lg leading-[1.25] font-bold text-ink md:text-xl">{step.title}</h3>
                  <p className="text-sm leading-[1.45] text-ink-mid md:text-base md:leading-[1.5]">{step.body}</p>
                  <p className="flex items-center gap-1.5 text-xs leading-[1.25] font-semibold text-ink md:text-sm">
                    <Icon name="check" className="size-3.5 text-positive" />
                    {step.check}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
