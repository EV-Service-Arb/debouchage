import { Icon } from "./Icon";

/** Five stars, 16 px, 2 apart (Figma Stars 4:24), the ones not given faded. Decorative: the rating is written beside it. */
export function Stars({ given = 5, className = "" }: { given?: number; className?: string }) {
  return (
    <span aria-hidden="true" className={`flex gap-0.5 text-accent-warn ${className}`}>
      {[0, 1, 2, 3, 4].map(i => (
        <Icon key={i} name="star" className={`size-4 ${i < given ? "" : "opacity-25"}`} />
      ))}
    </span>
  );
}
