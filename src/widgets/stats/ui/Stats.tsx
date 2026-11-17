import { fillText, formatCents } from "@/shared/lib/sites-tools";
import { Section } from "@/shared/lib/sites-tools/react";
import type { Copy } from "@/entities/content";

/**
 * The frame's Stats strip (8:305 / Mobile 11:685) on the dark card: four
 * figures, a row from `md`, two by two on a phone. The lowest fixed price is
 * the price list's (`lowestPrice`); without one, that figure is not drawn.
 * The others are the frame's sample (OWNER_TODO "stats and rating").
 */
export function Stats({ copy, from }: { copy: Copy; from: number | null }) {
  const { t, locale } = copy;
  const stats = t.stats.flatMap(s => (!s.value.includes("{from}") ? [s] : from === null ? [] : [{ ...s, value: fillText(s.value, { from: formatCents(from, locale) }) }]));
  return (
    <Section polarity="dark" surface="card" data-band="stats" className="py-6 md:py-7">
      <dl className="grid grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-4 md:gap-6">
        {stats.map(s => (
          <div key={s.label} className="flex flex-col-reverse items-center gap-0.5 text-center md:gap-1">
            <dt className="text-xs leading-[1.4] text-ink-mid md:text-sm md:leading-[1.45]">
              <span className="hidden md:inline">{s.label}</span>
              <span className="md:hidden">{s.labelShort}</span>
            </dt>
            <dd className="font-serif text-[26px] leading-[1.15] font-extrabold tracking-[-0.01em] text-primary md:text-3xl md:leading-none">{s.value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
