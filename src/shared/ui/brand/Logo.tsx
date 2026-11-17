/**
 * Figma Logo/Light and Logo/Dark (4:5, 4:13): the mark — yellow square, the
 * dark droplet, the yellow bolt, the same in either tone, its scope (`light` / `dark`) the words' — beside the name in
 * the display face and the town in tracked caps. `assets/mark.svg` is the
 * same drawing as a file. The words are the brand's name, not copy: they are
 * the logo in every language.
 */
export function Logo({ tone, className = "" }: { tone: "light" | "dark"; className?: string }) {
  return (
    <span className={`${tone} flex items-center gap-2.5 ${className}`}>
      <svg aria-hidden="true" viewBox="0 0 40 40" className="size-10 shrink-0">
        <path fill="var(--primary)" d="M29 0H11C4.925 0 0 4.925 0 11v18c0 6.075 4.925 11 11 11h18c6.075 0 11-4.925 11-11V11C40 4.925 35.075 0 29 0Z" />
        <path
          fill="var(--brand)"
          d="M20 6.5l7.4 7.7a10.5 10.5 0 0 1 2.81 5.327 10.33 10.33 0 0 1-.614 5.991 10.4 10.4 0 0 1-3.832 4.646A10.4 10.4 0 0 1 20 31.908a10.4 10.4 0 0 1-5.764-1.744 10.4 10.4 0 0 1-3.832-4.646 10.33 10.33 0 0 1-.614-5.991A10.5 10.5 0 0 1 12.6 14.2Z"
        />
        <path fill="var(--primary)" d="M21.6 14.5 15.5 22.7h4.2L18.2 29l6.1-8.2h-4.2l1.5-6.3Z" />
      </svg>
      <span className="flex flex-col gap-px whitespace-nowrap">
        <span className="font-serif text-xl leading-[1.2] font-bold text-ink">Débouchage Rapide</span>
        <span className="text-xs leading-[1.25] font-bold tracking-[0.1em] text-ink-soft uppercase">Clermont-Ferrand</span>
      </span>
    </span>
  );
}
