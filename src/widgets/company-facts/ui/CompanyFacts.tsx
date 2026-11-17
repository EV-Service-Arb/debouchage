import { Section } from "@/shared/lib/sites-tools/react";
import type { Copy } from "@/entities/content";
import { TYPE } from "@/shared/ui";

/** The about page's company facts (Figma 14:1247): SIRET, insurance, equipment, payment — the frame's sample identifiers (OWNER_TODO "company identifiers"). */
export function CompanyFacts({ copy, id }: { copy: Copy; id: string }) {
  return (
    <Section surface="card" id={id} data-band="company" className="py-12 md:py-16">
      <dl className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {copy.t.company.map(fact => (
          <div key={fact.label} className="flex flex-col-reverse gap-2 rounded-2xl border border-border bg-background p-5">
            <dd className="text-base leading-[1.25] font-bold text-ink">{fact.value}</dd>
            <dt className={`${TYPE.eyebrow} text-[11px] text-ink-soft`}>{fact.label}</dt>
          </div>
        ))}
      </dl>
    </Section>
  );
}
