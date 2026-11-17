import type { NavLink } from "@/shared/config/nav";
import type { PhoneLink } from "@/shared/lib/phone";
import { button, DetailsDismiss, Icon } from "@/shared/ui";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

/**
 * The phone's burger and menu (Figma Mobile 390's NavBar). A `<details>`, so
 * it opens before any script. The panel is an overlay under the bar —
 * `absolute` in the header, its containing block — so opening it moves
 * nothing; the scrim sits under the logo and the burger (`z-10`), so the bar stays lit; `app/globals.css` locks the page's scroll while it is open, and the
 * scrim closes it. Hidden from `lg`, where the row shows the nav.
 */
export function MobileMenu(props: { label: string; links: readonly NavLink[]; whatsapp: string | null; whatsappLabel: string; phone: PhoneLink | null; book: NavLink }) {
  const { label, links, whatsapp, phone, book } = props;
  return (
    <details data-nav-menu className="group/menu lg:hidden">
      <summary
        aria-label={label}
        data-band="menu-toggle"
        className={`relative z-10 flex size-11 cursor-pointer list-none items-center justify-center rounded-xl bg-white/10 text-ink [&::-webkit-details-marker]:hidden ${FOCUS}`}
      >
        <Icon name="menu" className="size-[22px] group-open/menu:hidden" />
        <Icon name="x" className="size-[22px] not-group-open/menu:hidden" />
      </summary>
      <div data-dismiss aria-hidden="true" className="fixed inset-0 z-0 hidden bg-black/50 group-open/menu:block" />
      <nav
        id="nav-menu-panel"
        aria-label={label}
        className="absolute inset-x-0 top-full z-10 hidden max-h-[calc(100dvh-72px)] flex-col gap-1 overflow-y-auto overscroll-contain border-t border-border bg-popover px-4 pb-5 group-open/menu:flex"
      >
        {links.map(link => (
          <a key={link.href} href={link.href} className={`block border-b border-border py-3 text-base leading-[1.25] font-medium text-ink-mid hover:text-ink ${FOCUS}`}>
            {link.label}
          </a>
        ))}
        <div className="mt-3 flex gap-2">
          {whatsapp && (
            <a href={whatsapp} className={`${button("whatsapp")} inline-flex flex-1 items-center justify-center ${FOCUS}`}>
              <Icon name="whatsapp" className="size-[18px]" />
              {props.whatsappLabel}
            </a>
          )}
          {phone && (
            <a href={phone.href} className={`${button("ghost")} inline-flex flex-1 items-center justify-center ${FOCUS}`}>
              <Icon name="phone" className="size-[18px]" />
              {phone.display}
            </a>
          )}
        </div>
        <a href={book.href} data-intent="form_open" className={`${button("primary", "lg")} mt-2 inline-flex items-center justify-center ${FOCUS}`}>
          {book.label}
        </a>
      </nav>
      <DetailsDismiss closeFrom="(min-width: 64rem)" />
    </details>
  );
}
