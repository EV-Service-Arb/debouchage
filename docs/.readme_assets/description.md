The landing site of Débouchage Rapide Clermont-Ferrand, a drain-unblocking
business that goes to the customer and sells six jobs at a fixed price.

A Next.js app on [`@evinvest/sites-tools`](https://github.com/EV-Service-Arb/sites_tools/tree/main/ts/sites-tools),
the machinery the Service-Arb landings share (routing, the place model and its
publication gate, the lead form and its store, SEO), built to the Figma file
`6LWuvlJoqYK4S8sdAZOIJ0`: the availability bar, header, hero with the booking
card, stats, the price list, how it works, reviews, the guarantee, the service
area, FAQ, the closing band, footer and the sticky bar — and three sub-pages,
`/prices`, `/guarantee` and `/about`. French by default, English beside it.

There is no domain and no public number yet, so every page is `noindex`,
`robots.txt` disallows everything, the sitemap is empty and the booking card
is the only channel until the panel gives the place a number. The facts still
missing are listed once, in `OWNER_TODO` (`src/shared/config/site.ts`);
giving the site a domain while a launch-blocking one is open fails the build.
Among them is the design's sample content — prices, rating, reviews,
technicians, identifiers — which the owner replaces before a launch.
