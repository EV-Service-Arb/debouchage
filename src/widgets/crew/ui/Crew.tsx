import { Section } from "@/shared/lib/sites-tools/react";
import type { Copy } from "@/entities/content";
import { TYPE } from "@/shared/ui";

/**
 * The about page's technicians (Figma 14:1247): a card each, the photo's
 * place held by the frame's « Photo » box. Names, years and the box are the
 * frame's sample (OWNER_TODO "technicians").
 */
export function Crew({ copy, id }: { copy: Copy; id: string }) {
  const team = copy.t.team;
  return (
    <Section surface="background" id={id} data-band="crew" className="py-14 md:py-24">
      <ul className="grid gap-5 md:grid-cols-2">
        {team.members.map(member => (
          <li key={member.name} className="flex gap-5 rounded-[20px] border border-border bg-background p-5 md:p-6">
            <span aria-hidden="true" className="flex size-24 shrink-0 items-center justify-center rounded-xl bg-muted text-xs leading-[1.4] text-ink-soft md:size-[120px]">
              {team.photo}
            </span>
            <div className="flex min-w-0 flex-col gap-1.5">
              <h2 className={`${TYPE.h3} text-ink`}>{member.name}</h2>
              <p className="text-sm leading-[1.25] font-semibold text-primary-ink">{member.role}</p>
              <p className="text-base leading-[1.5] text-ink-mid">{member.bio}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
