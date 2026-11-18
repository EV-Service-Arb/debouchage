import { fillText } from "@/shared/lib/sites-tools";
import { Section } from "@/shared/lib/sites-tools/react";
import type { Copy } from "@/entities/content";
import { Icon, PHOTO, Photo, TYPE } from "@/shared/ui";

/** The communes a phone shows before « + n communes ». */
const ON_PHONE = 10;

/**
 * The head and the communes as chips beside a photograph of the city. No map:
 * visitors arrive from Google Maps. The communes are sample
 * (OWNER_TODO `serviceArea`); the place names only Clermont-Ferrand.
 */
export function ServiceArea({ copy, id }: { copy: Copy; id: string }) {
  const a = copy.t.area;
  const hidden = a.towns.length - ON_PHONE;
  return (
    <Section surface="muted" id={id} data-band="service-area" className="py-14 md:py-20">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="flex flex-col gap-5">
          <p className={`${TYPE.eyebrow} text-primary-ink`}>{a.eyebrow}</p>
          <h2 className={`${TYPE.h2} text-ink`}>{a.title}</h2>
          <p className="hidden text-base leading-[1.5] text-ink-mid lg:block">{a.lede}</p>
          <ul className="flex flex-wrap content-start gap-2">
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
        <Photo src={PHOTO.zone} alt={copy.t.media.zone} className="aspect-[4/3] w-full rounded-2xl object-cover lg:order-last lg:aspect-[5/4]" />
      </div>
    </Section>
  );
}
