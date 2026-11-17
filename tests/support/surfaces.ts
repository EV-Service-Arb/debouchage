/**
 * The places a page shows the place's WhatsApp and number, cut out of its
 * markup: the header's row, the phone's menu, under the booking card, the
 * FAQ's last row, the yellow band, the footer, the sticky bar, and on a
 * sub-page the proof card. A surface the page does not render is absent.
 */
const BOUNDS = {
  header: ["<header", 'id="nav-menu-panel"'],
  menu: ['id="nav-menu-panel"', "</nav>"],
  hero: ['data-band="hero-contact"', "</div>"],
  proof: ['data-band="proof"', "</aside>"],
  faq: ['data-band="faq"', "</section>"],
  closing: ['data-band="cta"', "</section>"],
  footer: ['<footer id="footer"', "</footer>"],
  sticky: ['data-band="sticky"', null],
} as const satisfies Record<string, readonly [string, string | null]>;

export type Surface = keyof typeof BOUNDS;
export const SURFACES = Object.keys(BOUNDS) as Surface[];

export function surfaces(html: string): Partial<Record<Surface, string>> {
  const found: Partial<Record<Surface, string>> = {};
  for (const name of SURFACES) {
    const [start, end] = BOUNDS[name];
    const from = html.indexOf(start);
    if (from < 0) continue;
    const to = end === null ? -1 : html.indexOf(end, from);
    found[name] = html.slice(from, to < 0 ? undefined : to);
  }
  return found;
}
