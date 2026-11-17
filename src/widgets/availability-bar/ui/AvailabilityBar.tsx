import type { Copy } from "@/entities/content";

/**
 * The strip over the header (Figma AvailabilityBar 7:175): the green dot and
 * the availability, the hours and the area on the right from `md`; one short
 * line, centred, on a phone. The words are the frame's sample
 * (OWNER_TODO "stats and rating"): the page is cached and knows nobody's diary.
 */
export function AvailabilityBar({ copy }: { copy: Copy }) {
  const a = copy.t.availability;
  return (
    <div data-band="availability" className="dark flex items-center justify-center gap-6 bg-popover px-[var(--page-px)] py-2.5 text-sm leading-[1.25] md:justify-between">
      <p className="flex items-center gap-2 font-medium text-ink">
        <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-positive" />
        <span className="hidden md:inline">{a.now}</span>
        <span className="md:hidden">{a.nowShort}</span>
      </p>
      <p className="hidden leading-[1.45] text-ink-mid md:block">{a.hours}</p>
    </div>
  );
}
