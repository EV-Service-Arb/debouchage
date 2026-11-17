export type IconName =
  | "arrow-right"
  | "calendar"
  | "camera"
  | "card"
  | "check"
  | "chevron-down"
  | "clock"
  | "droplet"
  | "google-g"
  | "map-pin"
  | "menu"
  | "message"
  | "phone"
  | "pipe"
  | "shield-check"
  | "shower"
  | "sink"
  | "star"
  | "toilet"
  | "user-check"
  | "whatsapp"
  | "x"
  | "zap";

/**
 * One of the frame's icons (Figma Icons 3:3) at the size of its use, in the
 * text colour around it (`app/globals.css` masks the file over
 * `currentColor`). Decorative: whatever it stands for is written beside it.
 */
export function Icon({ name, className }: { name: IconName; className: string }) {
  return <span aria-hidden="true" className={`dr-icon dr-icon-${name} block shrink-0 ${className}`} />;
}
