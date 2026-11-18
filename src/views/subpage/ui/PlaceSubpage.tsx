import { placeGraph, type PlaceView, type PricingModel } from "@/shared/lib/sites-tools";
import { JsonLd } from "@/shared/lib/sites-tools/react";
import type { ReactNode } from "react";
import type { Copy } from "@/entities/content";
import type { Locale } from "@/shared/config/i18n";
import { placeNav } from "@/shared/config/nav";
import { site, type Subpage } from "@/shared/config/site";
import { jobPrices } from "@/shared/lib/job-prices";
import { Closing } from "@/widgets/closing";
import { CompanyFacts } from "@/widgets/company-facts";
import { Crew } from "@/widgets/crew";
import { HowItWorks } from "@/widgets/how-it-works";
import { Included } from "@/widgets/included";
import { PageHead } from "@/widgets/page-head";
import { PriceList } from "@/widgets/price-list";
import { Promises } from "@/widgets/promises";
import { ProofAside } from "@/widgets/proof-aside";
import { ServiceArea } from "@/widgets/service-area";
import { SiteFooter } from "@/widgets/site-footer";
import { SiteHeader } from "@/widgets/site-header";
import { StickyBar } from "@/widgets/sticky-bar";

/** The anchors of the sub-pages' bands, named like the home page's. */
export const SUBPAGE_IDS = {
  prices: "tarifs",
  included: "compris",
  promises: "engagements",
  steps: "etapes",
  team: "equipe",
  company: "entreprise",
  area: "zone",
  closing: "demande",
} as const;

/** Each page's bands between its head and the yellow band, as its frame orders them. */
function bands(copy: Copy, page: Subpage, pricing: PricingModel | null, bookHref: string): ReactNode {
  switch (page) {
    case "prices":
      return (
        <>
          <PriceList copy={copy} id={SUBPAGE_IDS.prices} prices={jobPrices(pricing)} bookHref={bookHref} head={false} />
          <Included copy={copy} id={SUBPAGE_IDS.included} />
        </>
      );
    case "guarantee":
      return (
        <>
          <Promises copy={copy} id={SUBPAGE_IDS.promises} />
          <HowItWorks copy={copy} id={SUBPAGE_IDS.steps} />
        </>
      );
    case "about":
      return (
        <>
          <Crew copy={copy} id={SUBPAGE_IDS.team} />
          <CompanyFacts copy={copy} id={SUBPAGE_IDS.company} />
          <ServiceArea copy={copy} id={SUBPAGE_IDS.area} />
        </>
      );
  }
}

export interface PlaceSubpageProps {
  view: PlaceView<Locale>;
  copy: Copy;
  page: Subpage;
  renderedAt: number;
  /** The price list the prices page states: the panel's, else the baked one. Other pages show no price. */
  pricing?: PricingModel | null;
}

/**
 * A sub-page (Figma Tarifs 14:774, Garantie 14:1081, Qui sommes-nous
 * 14:1247): the home page's chrome, the page's head with the proof card, its
 * bands, the yellow band, the footer and the sticky bar. Every action lands
 * on the home page's booking card: the form is there, once. Their phone
 * layout is the home page's components, as the frames draw none.
 */
export function PlaceSubpage({ view, copy, page, renderedAt, pricing = null }: PlaceSubpageProps) {
  const { t, f } = copy;
  const now = new Date(renderedAt);
  const nav = placeNav(view, { nav: t.nav, pages: t.footer.pages }, site.pages[page]);
  const meta = t.pages[page];
  const graph = placeGraph(site, view, page, { placeName: f.place, title: meta.title(f), description: meta.description(f) }, now);
  return (
    <>
      <JsonLd data={graph} />
      <SiteHeader copy={copy} home={view.href("")} bookHref={nav.bookHref} links={nav.header} />
      <main>
        <PageHead head={t.heads[page]} aside={<ProofAside copy={copy} bookHref={nav.bookHref} />} />
        {bands(copy, page, pricing, nav.bookHref)}
        <Closing copy={copy} id={SUBPAGE_IDS.closing} bookHref={nav.bookHref} />
      </main>
      <SiteFooter copy={copy} year={now.getFullYear()} links={nav.footer} other={nav.other} />
      <div aria-hidden="true" className="dark h-[70px] bg-popover" />
      <StickyBar copy={copy} bookHref={nav.bookHref} />
    </>
  );
}
