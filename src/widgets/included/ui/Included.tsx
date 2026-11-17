import { Section } from "@/shared/lib/sites-tools/react";
import type { Copy } from "@/entities/content";
import { Icon } from "@/shared/ui";

/** The prices page's three lists (Figma Included 14:985): always in the price, never on top of it, quoted apart. */
export function Included({ copy, id }: { copy: Copy; id: string }) {
  return (
    <Section surface="card" id={id} data-band="included" className="py-14 md:py-20">
      <ul className="grid gap-5 md:grid-cols-3">
        {copy.t.included.map(list => (
          <li key={list.title} className="flex flex-col gap-3.5 rounded-[20px] border border-border bg-background p-7">
            <h2 className="font-serif text-xl leading-[1.2] font-bold text-ink">{list.title}</h2>
            <ul className="flex flex-col gap-3.5">
              {list.items.map(item => (
                <li key={item} className="flex items-center gap-2.5 text-base leading-[1.5] text-ink-mid">
                  <Icon name="check" className="size-4 text-positive" />
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  );
}
