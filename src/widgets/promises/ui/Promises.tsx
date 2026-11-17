import { Section } from "@/shared/lib/sites-tools/react";
import type { Copy } from "@/entities/content";
import { Icon, TYPE } from "@/shared/ui";

/**
 * The guarantee page's three written terms (Figma Promises 14:1156), each
 * with what it does not cover. The terms are the frame's sample (OWNER_TODO "guarantee").
 */
export function Promises({ copy, id }: { copy: Copy; id: string }) {
  const p = copy.t.promises;
  return (
    <Section surface="background" id={id} data-band="promises" className="py-14 md:py-24">
      <ul className="grid gap-5 md:grid-cols-3">
        {(
          [
            ["shield-check", p[0]],
            ["clock", p[1]],
            ["droplet", p[2]],
          ] as const
        ).map(([icon, promise]) => (
          <li key={promise.title} className="flex flex-col gap-3.5 rounded-[20px] border border-border bg-background p-7">
            <span className="flex size-[52px] items-center justify-center rounded-[14px] bg-primary text-on-primary">
              <Icon name={icon} className="size-[26px]" />
            </span>
            <h2 className={`${TYPE.h3} text-ink`}>{promise.title}</h2>
            <p className="text-base leading-[1.5] text-ink-mid">{promise.body}</p>
            <p className="rounded-xl bg-card p-3.5 text-sm leading-[1.45] text-ink-soft">{promise.excludes}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
