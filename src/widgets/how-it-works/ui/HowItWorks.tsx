import { Section } from "@/shared/lib/sites-tools/react";
import type { Copy } from "@/entities/content";
import { BandHead, Icon } from "@/shared/ui";

/**
 * The frame's How it works (9:358 / Mobile 13:673) on the light card: three
 * numbered cards, each with its icon and the check line under it; on a phone
 * the number sits beside the words and the icon goes.
 */
export function HowItWorks({ copy, id }: { copy: Copy; id: string }) {
  const s = copy.t.steps;
  return (
    <Section surface="card" id={id} data-band="how-it-works" className="py-14 md:py-24">
      <BandHead eyebrow={s.eyebrow} title={s.title} />
      <ol className="mt-6 grid gap-6 md:mt-10 md:grid-cols-3 md:gap-5">
        {(
          [
            ["calendar", s.items[0]],
            ["user-check", s.items[1]],
            ["droplet", s.items[2]],
          ] as const
        ).map(([icon, step], i) => (
          <li key={step.title} className="flex gap-3.5 rounded-[20px] border border-border bg-background p-[19px] md:flex-col md:gap-4 md:p-7">
            <div className="flex items-center justify-between">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary text-base leading-[1.25] font-bold text-on-primary md:size-10 md:text-lg">{i + 1}</span>
              <Icon name={icon} className="hidden size-6 text-ink md:block" />
            </div>
            <div className="flex flex-col gap-1.5 md:gap-4">
              <h3 className="font-serif text-lg leading-[1.25] font-bold text-ink md:text-xl md:leading-[1.2]">{step.title}</h3>
              <p className="text-sm leading-[1.45] text-ink-mid md:text-base md:leading-[1.5]">{step.body}</p>
              <p className="flex items-center gap-1.5 text-xs leading-[1.25] font-semibold text-ink md:text-sm">
                <Icon name="check" className="size-3.5 text-positive" />
                {step.check}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
