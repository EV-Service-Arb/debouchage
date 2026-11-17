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
