import { fillText } from "@/shared/lib/sites-tools";
import { Section } from "@/shared/lib/sites-tools/react";
import type { Copy } from "@/entities/content";
import { Icon, TYPE } from "@/shared/ui";

/** The communes a phone shows before « + n communes »: the frame's first three rows. */
const ON_PHONE = 10;

/**
 * The frame's Service area (10:438 / Mobile 13:801): the head on the left,
 * the communes as chips on the right from `lg`. No map: visitors arrive from
 * Google Maps. The communes are the copy's, the frame's sample
 * (OWNER_TODO `serviceArea`); the place names only Clermont-Ferrand.
 */
export function ServiceArea({ copy, id }: { copy: Copy; id: string }) {
  const a = copy.t.area;
  const hidden = a.towns.length - ON_PHONE;
  return (
    <Section surface="background" id={id} data-band="service-area" className="py-14 md:py-24">
      <div className="flex flex-col gap-5 lg:flex-row lg:gap-16">
        <div className="flex flex-col gap-3 lg:w-[440px] lg:shrink-0">
          <p className={`${TYPE.eyebrow} text-primary-ink`}>{a.eyebrow}</p>
          <h2 className={`${TYPE.h2} text-ink`}>{a.title}</h2>
          <p className="hidden text-base leading-[1.5] text-ink-mid lg:block">{a.lede}</p>
        </div>
        <ul className="flex flex-wrap content-start gap-2 lg:gap-2.5">
          {a.towns.map((town, i) => (
            <li
              key={town}
              className={`items-center gap-1.5 rounded-full border border-border bg-card px-[15px] py-2 text-sm leading-[1.25] font-medium text-ink lg:flex lg:h-10 lg:px-4 ${i < ON_PHONE ? "flex" : "sr-only lg:not-sr-only"}`}
            >
              <Icon name="map-pin" className="hidden size-3.5 text-primary-ink lg:block" />
              {town}
            </li>
          ))}
          {hidden > 0 && (
            <li aria-hidden="true" className="flex items-center rounded-full border border-border bg-card px-[15px] py-2 text-sm leading-[1.25] font-medium text-ink lg:hidden">
              {fillText(a.more, { n: String(hidden) })}
            </li>
          )}
        </ul>
      </div>
    </Section>
  );
}
