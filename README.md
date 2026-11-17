# debouchage
![Lines Of Code](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/valeratrades/b48e6f02c61942200e7d1e3eeabf9bcb/raw/debouchage-loc.json)
<br>
[<img alt="ci errors" src="https://img.shields.io/github/actions/workflow/status/@@REPO_SLUG@@/errors.yml?branch=main&style=for-the-badge&style=flat-square&label=errors&labelColor=420d09" height="20">](https://github.com/@@REPO_SLUG@@/actions?query=branch%3Amain) <!--NB: Won't find it if repo is private-->
[<img alt="ci warnings" src="https://img.shields.io/github/actions/workflow/status/@@REPO_SLUG@@/warnings.yml?branch=main&style=for-the-badge&style=flat-square&label=warnings&labelColor=d16002" height="20">](https://github.com/@@REPO_SLUG@@/actions?query=branch%3Amain) <!--NB: Won't find it if repo is private-->

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
<!-- markdownlint-disable -->
<details>
<summary>
<h2>Installation</h2>
</summary>

The repo builds with Nix. Determinate Nix with `lazy-trees = true` is required.

```sh
nix develop
```

This gives you Node 22 and Playwright with its pinned browsers, and writes the
generated files — `.github/workflows/`, `.gitignore`, `.treefmt.toml` and this
README — from `flake.nix`. Edit the flake and `docs/.readme_assets/`, not them.

Plain npm works for the app itself:

```sh
npm ci && npm run typecheck && npm run lint && npx vitest run && npm run build && npm run size && npm start
```


</details>
<!-- markdownlint-restore -->

## Usage
Start the site, inside the dev shell (`nix develop`), which sets its `PORT`:

```sh
nix run .#dev            # http://localhost:$PORT/fr
```

##### Local stack

The Service-Arb panel's `nix run .#local-stack` starts this site with
`nix run .#dev` (or `npm run dev`) and the environment below. `next dev` reads
it as it is; without any of it the site runs as it does alone.

| Variable | What it does | Unset |
| --- | --- | --- |
| `PORT` | the dev server's port, the dev shell's | `nix run .#dev` refuses to start |
| `SITES_PANEL_INTERNAL_URL` | sites_panel's internal API (devops sets it from the contract); the place source, `GET <url>/brands/debouchage/locations/clermont-ferrand?locale=fr`: its number and WhatsApp show on every surface — header, menu, under the booking card, FAQ, yellow band, footer, sticky bar — WhatsApp first. The same API serves the price list, `GET <url>/brands/debouchage/pricing`, which overrides the baked one whole | the baked place: no number anywhere, no call or WhatsApp; the baked price list |
| `LEAD_WEBHOOK_URL`, `LEAD_WEBHOOK_KEY_ID`, `LEAD_WEBHOOK_SECRET` | each booking to the panel as a signed `lead.created`, and a slot preference as `booking.requested`; all three or none, and `http:` only to localhost or a `*.svc` host | off |
| `LEADS_DB_PATH` | the SQLite leads file (and the webhook's outbox) | `~/.local/share/debouchage/leads.db` |
| `POSTHOG_KEY` (`POSTHOG_HOST`) | analytics | off |

Run the checks:

```sh
nix run .#test           # tsc, lint (eslint + steiger), vitest, build, size, Playwright
nix run .#accept-test    # the same, writing the screenshot baselines (Linux)
nix run .#size           # first-load JS against tests/bundle_budget.txt — the one hard gate
nix flake check          # the hermetic Nix build and the budget against it
```

Build the server and the container image:

```sh
nix build                # the standalone server
nix build .#container    # OCI image, on Linux
nix run .#container-smoke  # boot it and hold it to its contract (Linux + docker)
```

The image listens on the flake's `sitePort` and keeps leads in `/data`. Its
settings come from `deploy/config.nix`. Pushing a `v*` tag builds the image
and publishes it to `ghcr.io/ev-service-arb/debouchage`: `nix run .#publish`
makes the tag.

The palette is `assets/brand.toml`; `npm run palette` regenerates
`app/brand.css` from it, and a test fails when the two disagree.

##### Visual baselines

Screenshot baselines are Linux's: a mac rasterises glyphs differently, so
there the pixel comparison is skipped. After changing a section, run
`nix run .#accept-test` on Linux (or the **Visual baselines** workflow and
download its `visual-snapshots` artifact into `tests/e2e/__screenshots__`),
look at the images, and commit them alone.

`nix run .#help` prints the list of commands.

## Layout

```text
app/             Next routes, each a few lines over a sites-tools factory: pages under
                 [locale]/[location], /quote (and its /booking, /confirm), /og, /health, /.well-known/sa-site,
                 robots, sitemap, the global 404
src/             the site in Feature-Sliced layers (shared → entities → widgets → views);
                 widgets/ are named after the Figma frames (hero, booking-card, price-list, …)
assets/          brand.toml (the palette), card.toml (contact facts), the mark, fonts/, icons/
tests/           vitest; tests/e2e/ Playwright; bundle_budget.txt
deploy/          production config, authored in Nix
nix/             the generated CI workflows' source
docs/            ARCHITECTURE.md, and the README's parts
```


<br>

<sup>Links for devs:</sup>
- <sup><a href="https://github.com/EV-Main/.github/blob/main/code/STYLE.md">style</a></sup>
- <sup><a href="https://github.com/EV-Main/.github/tree/main/code/conventions">conventions</a></sup>
- <sup><a href="https://github.com/EV-Main/.github/blob/main/code/conventions/git">contributing</a></sup>

#### License

<sup>
	Licensed under <a href="LICENSE">Blue Oak 1.0.0</a>
</sup>

<br>

<sub>
	Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in this crate by you, as defined in the Apache-2.0 license, shall
be licensed as above, without any additional terms or conditions.
</sub>

