import type { PricingModel } from "@/shared/lib/sites-tools";

/**
 * The baked price list, until the panel serves one (`/brands/debouchage/pricing`)
 * and whenever it is down: one fixed price per job, TTC, travel included.
 * OWNER_TODO "design sample content": these are the Figma frame's amounts.
 */
export const PRICING: PricingModel = {
  format: 1,
  currency: "EUR",
  validFrom: "2026-11-17",
  roundToCents: 100,
  minimumCents: 0,
  inputs: [],
  needs: {
    sink: { kind: "fixed", cents: 8900 },
    shower: { kind: "fixed", cents: 9900 },
    wc: { kind: "fixed", cents: 10900 },
    drain: { kind: "fixed", cents: 14900 },
    jetting: { kind: "fixed", cents: 24900 },
    camera: { kind: "fixed", cents: 9000 },
  },
};
