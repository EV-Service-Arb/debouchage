import { expect, test } from "@playwright/test";
import { defineSectionSuite } from "../../src/shared/lib/sites-tools/testing-e2e";

// One visual baseline per band of the Figma frame at both breakpoints, named
// like its bands; adding a section is one line. Bands the site links to are
// reached by their `#`; the others load at the top and the runner shoots the
// element. The sticky bar rides the viewport: hidden in every crop
// (screenshot-section.css) rather than shot.
defineSectionSuite({ test, expect }, [
  { name: "header", url: "/fr", selector: "header >> nth=0" },
  { name: "hero", url: "/fr", selector: "[data-band=hero]" },
  { name: "stats", url: "/fr", selector: "[data-band=stats]" },
  { name: "prices", url: "/fr#tarifs", selector: "#tarifs" },
  { name: "steps", url: "/fr#etapes", selector: "#etapes" },
  { name: "reviews", url: "/fr#avis", selector: "#avis" },
  { name: "area", url: "/fr#zone", selector: "#zone" },
  { name: "faq", url: "/fr#faq", selector: "#faq" },
  { name: "closing", url: "/fr#demande", selector: "#demande" },
  { name: "footer", url: "/fr#footer", selector: "footer#footer" },
  // The sub-pages (Figma Tarifs 14:774, Garantie 14:1081, Qui sommes-nous 14:1247).
  { name: "prices-head", url: "/fr/prices", selector: "[data-band=page-head]" },
  { name: "price-table", url: "/fr/prices#tarifs", selector: "#tarifs" },
  { name: "included", url: "/fr/prices#compris", selector: "#compris" },
  { name: "guarantee-head", url: "/fr/guarantee", selector: "[data-band=page-head]" },
  { name: "promises", url: "/fr/guarantee#engagements", selector: "#engagements" },
  { name: "about-head", url: "/fr/about", selector: "[data-band=page-head]" },
  { name: "crew", url: "/fr/about#equipe", selector: "#equipe" },
  { name: "company", url: "/fr/about#entreprise", selector: "#entreprise" },
  { name: "thanks", url: "/fr/thanks", selector: "body" },
  { name: "not-found", url: "/fr/nope", selector: "body" },
]);
