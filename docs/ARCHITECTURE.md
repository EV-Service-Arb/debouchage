# Architecture

Débouchage Rapide sells six drain jobs, each at one fixed price, to someone
standing over a blocked drain in or around Clermont-Ferrand. The repo is that
offer as a landing page: book in a minute, at the listed price, with or
without JavaScript. It is a Next.js App Router site in Feature-Sliced layers
on `@evinvest/sites-tools`, which owns the behaviour — routing, the place
model and publication gate, the lead funnel and store, the panel's contract,
JSON-LD, sitemap and robots, the lead form itself. This repo owns what the
brand looks and sounds like, and which of its facts are true.

```
assets/ (brand.toml · card.toml · mark · fonts · icons)
   │ inlined at build
   ▼
shared/config/site.ts ── the one `site` ──▶ proxy · routes · JSON-LD · mail · webhook
   │  lead.ts (6 jobs, all `fixed`) · pricing.ts (the baked list) · places.ts
   ▼
entities/content (FR designed, EN its translation) ──▶ widgets (Copy + PlaceView) ──▶ views ──▶ app/
                                                        └ booking-card: the kit's LeadCapture
POST /quote ── prices the posted job with priceOf ── store ──▶ lead.created ──▶ panel
POST /quote/booking ── a priced lead's slot preference ──▶ booking.requested ──▶ panel
```

## Invariants

**The visitor is in an emergency.** Every trade-off resolves for the person on
a phone with a bad connection: pages are server-rendered and cached (ISR,
`revalidate = 600`, nothing reads the request — the link mode rides in the
`[location]` param), and the booking card is a plain `<form method="post">`
answered with a 303 before any script loads. `"use client"` is only on leaves
that cannot be anything else: the card's wrapper (`BookingCapture`, for its
done state), the sticky bar's reveal, the menu's closer, the error and
not-found boundaries.

**One fact, one place.** A job's price is one integer in
`shared/config/pricing.ts` (or the panel's list, which overrides it whole):
the price table, the card's tiles, the stats' « dès … » and the server's
stored price all read it through `priceOf`. The jobs are one list
(`SUBJECTS`): the table's rows and the card's tiles cannot drift. The number
is the place's, from the panel's place source: every surface renders it from
`copy.f`, and none renders one when there is none.

**Structured data states only what is true.** The JSON-LD is built from
`site` and the place: no rating, review, phone, opening hours or commune the
owner has not given. The place names Clermont-Ferrand only, which its name
says.

**Sample content never reaches `site`.** The Figma frame's prices, rating,
stats, reviews, technicians, identifiers, night rate and guarantees are on the
page as the frame has them — in the copy and `pricing.ts` — and each is a
launch-blocking `OWNER_TODO`. The frame's sample phone is never rendered.
Nothing of it reaches `site`, `card.toml`, JSON-LD, the OG card or a
notification (`tests/site.test.ts`).

**Nothing is indexable yet.** No `site` in `card.toml`: `noindex`
everywhere, robots disallow, an empty sitemap. A domain set while a blocking
`OWNER_TODO` is open fails the build (`assertLaunchable`).

**Widgets take a `Copy` and a `PlaceView`** (or values derived from them) and
contain no literal copy and no hex value: colours are `brand.toml`'s roles,
geometry the frame's, in Tailwind classes and `app/globals.css`.

## The booking card

The kit's `LeadCapture`, `layout="steps"`: when (`intro`, posted as the extra
`when`), what (the six jobs as tiles, `fixed`), then the contact — first name
(the kit's `name`, extra `first_name`), phone, address (the kit's locality),
how to confirm (the brand's extra `confirm`). The server prices the posted job
itself and stores its own number; a posted amount is never read, and a price
that changed under the page is confirmed first (`/quote/confirm` without a
script). The brand's rule refuses only what the card never offers (`when`,
`confirm` off their lists), after the kit's phone rule. After a lead the card
stays: `BookingDone` confirms the name, the call, the price and the arrival;
for « autre jour » the kit's `manual` booking offers a day and a part of the
day, posted to `/quote/booking` as `booking.requested`. A refusal lands back
on `#reserver`.

## Leads reach the panel

Each lead goes to the Service-Arb panel as one `lead.created`, built, signed
and queued by sites-tools from `@evinvest/sites-contract`, which this repo
never restates. The brand says only the job in the operator's words
(`PANEL_NEED`, the French price list's names). `LEAD_WEBHOOK_URL`,
`LEAD_WEBHOOK_KEY_ID` and `LEAD_WEBHOOK_SECRET` come from the container's
Secret, all three or none; without the URL the webhook is off.

## Codemap

| where | owns |
|---|---|
| `assets/` | the palette (`brand.toml`, generated into `app/brand.css`), contact facts (`card.toml`), the mark, the fonts, the icons |
| `app/` | routes, each a few lines over a sites-tools factory |
| `src/shared/config` | `site`, the jobs and their flows, the baked price list, the place, the nav, the server env |
| `src/entities/content` | every string, `FR` and `EN` over one `Text` |
| `src/widgets` | one band each, named after the Figma frames |
| `src/views` | the home page, the sub-pages (one view), the status screens, the place loader |
| `tests/` | vitest (the landing contract, the copy, the panel's view of a lead, the live place); `tests/e2e` Playwright at 1440 and 390 |

## Testing

vitest holds what is exact and cheap: the landing contract, the copy's shape
and typography, a booking through the real routes to the panel's events, the
number following the panel on every surface, sample content kept out of the
structured data. Playwright holds what only a browser can: the card's screens,
the post without JavaScript proven by the row in SQLite, a clean console, one
screenshot per band at both breakpoints. The one hard gate is the weight of
the place page's first-load JavaScript (`tests/bundle_budget.txt`).
