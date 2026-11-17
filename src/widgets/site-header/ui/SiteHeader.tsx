import type { Copy } from "@/entities/content";
import type { NavLink } from "@/shared/config/nav";
import { phoneLink, whatsappLink } from "@/shared/lib/phone";
import { button, Icon, Logo } from "@/shared/ui";
import { MobileMenu } from "./MobileMenu";

export interface SiteHeaderProps {
  copy: Copy;
  home: string;
  /** Where the booking card is. */
  bookHref: string;
  links: readonly NavLink[];
}

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

/**
 * The frame's NavBar (7:180) on the dark background: the logo, the home
 * page's bands from `lg`, then WhatsApp, the number and « Réserver » — the
 * two contacts only when the place has a number, WhatsApp first. Below `lg`
 * the logo and the burger, whose menu carries the same.
 */
export function SiteHeader({ copy, home, bookHref, links }: SiteHeaderProps) {
  const { t } = copy;
  const phone = phoneLink(copy.f.phone);
  const whatsapp = whatsappLink(copy.f.whatsapp, t.whatsappMessage(copy.f));
  return (
    <header className="dark relative z-40 bg-background text-ink">
      <div className="flex h-[72px] items-center justify-between gap-6 px-[var(--page-px)] lg:h-20">
        <a href={home} aria-label={t.nav.home} className={`relative z-10 rounded-lg ${FOCUS}`}>
          <Logo tone="dark" />
        </a>
        <nav aria-label={t.nav.menu} className="hidden items-center gap-8 lg:flex">
          {links.map(link => (
            <a key={link.href} href={link.href} className={`text-sm leading-[1.25] font-medium whitespace-nowrap text-ink-mid hover:text-ink ${FOCUS}`}>
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          {whatsapp && (
            <a href={whatsapp} className={`${button("whatsapp")} inline-flex items-center ${FOCUS}`}>
              <Icon name="whatsapp" className="size-[18px]" />
              {t.whatsappLabel}
            </a>
          )}
          {phone && (
            <a href={phone.href} aria-label={t.callLabel(copy.f)} className={`flex items-center gap-2 text-base leading-[1.25] font-bold whitespace-nowrap text-ink ${FOCUS}`}>
              <Icon name="phone" className="size-4" />
              {phone.display}
            </a>
          )}
          <a href={bookHref} data-intent="form_open" className={`${button("primary")} inline-flex items-center ${FOCUS}`}>
            {t.nav.book}
          </a>
        </div>
        <MobileMenu label={t.nav.menu} links={links} whatsapp={whatsapp} whatsappLabel={t.whatsappLabel} phone={phone} book={{ href: bookHref, label: t.nav.book }} />
      </div>
    </header>
  );
}
