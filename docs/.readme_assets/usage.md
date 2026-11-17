Start the site, inside the dev shell (`nix develop`), which sets its `PORT`:

```sh
nix run .#dev            # http://localhost:$PORT/fr
```

#### Local stack

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
nix run .#test           # every check (tsc, lint, vitest, Playwright, the hermetic build + budget, the image's smoke, npm audit); `-- --help` lists them
nix run .#accept-test    # the same, writing the screenshot baselines (Linux)
nix run .#size           # first-load JS against tests/bundle_budget.txt — the one hard gate
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

#### Visual baselines

Screenshot baselines are Linux's: a mac rasterises glyphs differently, so
there the pixel comparison is skipped. After changing a section, run
`nix run .#accept-test` on Linux (or the **Visual baselines** workflow and
download its `visual-snapshots` artifact into `tests/e2e/__screenshots__`),
look at the images, and commit them alone.

`nix run .#help` prints the list of commands.
