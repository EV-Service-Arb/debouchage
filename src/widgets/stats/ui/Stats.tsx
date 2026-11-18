import { fillText, formatCents } from "@/shared/lib/sites-tools";
import { Section } from "@/shared/lib/sites-tools/react";
import type { Copy } from "@/entities/content";

/**
 * Three facts under the hero, on the page's own dark so the hero ends in a
 * line, not a block. The lowest fixed price is the price list's
 * (`lowestPrice`); without one, that figure is not drawn. The others are the
 * sample (OWNER_TODO "stats and rating").
 */
export function Stats({ copy, from }: { copy: Copy; from: number | null }) {
  const { t, locale } = copy;
  const stats = t.stats.flatMap(s => (!s.value.includes("{from}") ? [s] : from === null ? [] : [{ ...s, value: fillText(s.value, { from: formatCents(from, locale) }) }]));
  return (
    <Section polarity="dark" surface="background" data-band="stats" className="border-t border-border py-5 md:py-6">
      <dl className="grid grid-cols-3 gap-x-3 md:flex md:gap-x-16">
        {stats.map(s => (
          <div key={s.label} className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-2.5">
            <dd className="font-serif text-xl leading-none font-extrabold tracking-[-0.01em] text-ink md:text-2xl">{s.value}</dd>
            <dt className="text-xs leading-[1.4] text-ink-soft md:text-sm md:leading-[1.45]">
              <span className="hidden md:inline">{s.label}</span>
              <span className="md:hidden">{s.labelShort}</span>
            </dt>
          </div>
        ))}
      </dl>
    </Section>
  );
}
