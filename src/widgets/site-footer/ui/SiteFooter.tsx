import { withLang } from "@/shared/lib/sites-tools/react";
import type { Copy } from "@/entities/content";
import type { NavLink } from "@/shared/config/nav";
import { phoneLink } from "@/shared/lib/phone";
import { Logo } from "@/shared/ui";

export interface SiteFooterProps {
  copy: Copy;
  year: number;
  /** The site's pages, before the legal names. */
  links: readonly NavLink[];
  /** The other language: this page in it, and its name in itself. */
  other: { locale: string; href: string; label: string };
}

const LINK = "hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring";

/**
 * The frame's Footer (10:602 / Mobile 13:872) on the deepest dark: the logo
 * and the row of links, a rule, the company's line and the hours with the
 * place's number. The legal names are text: they have no page yet
 * (OWNER_TODO "legal pages"). The language switch is the row's last item,
 * through the kit's `?lang=` link (`withLang`).
 */
export function SiteFooter({ copy, year, links, other }: SiteFooterProps) {
  const { t } = copy;
  const phone = phoneLink(copy.f.phone);
  return (
    <footer id="footer" className="dark bg-popover px-[var(--page-px)] pt-8 pb-8 text-ink md:pt-12 md:pb-24">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <Logo tone="dark" />
        <div className="flex flex-wrap gap-x-4 gap-y-2.5 text-sm leading-[1.25] font-medium text-ink-mid md:gap-x-7">
          {links.map(link => (
            <a key={link.href} href={link.href} className={LINK}>
              {link.label}
            </a>
          ))}
          <span>{t.footer.mentions}</span>
          <span>{t.footer.privacy}</span>
          <a href={withLang(other.href, other.locale)} hrefLang={other.locale} lang={other.locale} className={LINK}>
            {other.label}
          </a>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5 md:mt-7 md:flex-row md:items-start md:justify-between md:pt-7">
        <div className="text-xs leading-[1.4] text-ink-soft">
          <p>{t.footer.copyright(year)}</p>
          <p>{t.footer.legal}</p>
        </div>
        <p className="text-sm leading-[1.25] font-semibold whitespace-nowrap text-ink">
          {t.footer.hours}
          {phone && (
            <>
              {" · "}
              <a href={phone.href} className={LINK}>
                {phone.display}
              </a>
            </>
          )}
        </p>
      </div>
    </footer>
  );
}
