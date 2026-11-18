import { contactOf, faqPageNode, placeGraph, type PlaceView, type PricingModel } from "@/shared/lib/sites-tools";
import { JsonLd } from "@/shared/lib/sites-tools/react";
import type { Copy } from "@/entities/content";
import type { Locale } from "@/shared/config/i18n";
import { ANCHORS, placeNav } from "@/shared/config/nav";
import { site } from "@/shared/config/site";
import { jobPrices, lowestPrice } from "@/shared/lib/job-prices";
import { BookingCard } from "@/widgets/booking-card";
import { Closing } from "@/widgets/closing";
import { FaqBand } from "@/widgets/faq";
import { Hero } from "@/widgets/hero";
import { HowItWorks } from "@/widgets/how-it-works";
import { PriceList } from "@/widgets/price-list";
import { Reviews } from "@/widgets/reviews";
import { ServiceArea } from "@/widgets/service-area";
import { SiteFooter } from "@/widgets/site-footer";
import { SiteHeader } from "@/widgets/site-header";
import { Stats } from "@/widgets/stats";
import { StickyBar } from "@/widgets/sticky-bar";

/** The anchors the page links to, and the e2e sections are shot by. */
export const SECTION_IDS = { ...ANCHORS, closing: "demande" } as const;

export interface PlaceHomeProps {
  view: PlaceView<Locale>;
  copy: Copy;
  renderedAt: number;
  /** The price list the card prices from and the page states: the panel's, else the baked one. */
  pricing: PricingModel | null;
}

/**
 * The home page: the Figma frame (Desktop 1440 7:174, Mobile 390 11:524) in
 * its order. The structured data is built from `site` and the place only —
 * never from the frame's sample rating, reviews or phone.
 */
export function PlaceHome({ view, copy, renderedAt, pricing }: PlaceHomeProps) {
  const { t, f } = copy;
  const now = new Date(renderedAt);
  const nav = placeNav(view, { nav: t.nav, pages: t.footer.pages }, site.pages.home);
  const graph = placeGraph(site, view, "home", { placeName: f.place, title: t.pages.home.title(f), description: t.pages.home.description(f) }, now);
  const prices = jobPrices(pricing);
  return (
    <>
      <JsonLd data={graph} />
      <JsonLd data={faqPageNode(t.faqs)} />
      <SiteHeader copy={copy} home={view.href("")} bookHref={nav.bookHref} links={nav.header} />
      <main>
        <Hero
          copy={copy}
          card={<BookingCard copy={copy} id={SECTION_IDS.book} place={view.place} contact={contactOf(site, view.place)} renderedAt={renderedAt} pricing={pricing} />}
        />
        <Stats copy={copy} from={lowestPrice(prices)} />
        <PriceList copy={copy} id={SECTION_IDS.prices} prices={prices} bookHref={nav.bookHref} head />
        <HowItWorks copy={copy} id={SECTION_IDS.steps} />
        <Reviews copy={copy} id={SECTION_IDS.reviews} />
        <ServiceArea copy={copy} id={SECTION_IDS.area} />
        <FaqBand copy={copy} id={SECTION_IDS.faq} />
        <Closing copy={copy} id={SECTION_IDS.closing} bookHref={nav.bookHref} />
      </main>
      <SiteFooter copy={copy} year={now.getFullYear()} links={nav.footer} other={nav.other} />
      {/* Room under the footer for the sticky bar, on the footer's colour. */}
      <div aria-hidden="true" className="dark h-[70px] bg-popover md:hidden" />
      <StickyBar copy={copy} bookHref={nav.bookHref} />
    </>
  );
}
