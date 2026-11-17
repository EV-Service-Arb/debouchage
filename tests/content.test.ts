import { describe, expect, it } from "vitest";
import { TEXT, type Facts } from "@/entities/content";
import { i18n, type Locale } from "@/shared/config/i18n";
import { PANEL_NEED, SUBJECTS } from "@/shared/config/lead";
import { OWNER_TODO, site } from "@/shared/config/site";

// Completeness is the compiler's: `FR` and `EN` satisfy one `Text`. What the
// type cannot see is an empty string, a fact written by hand where a source
// owns it, or French typography.

const facts = (): Facts => ({ place: site.brand.name, phone: site.brand.phone, whatsapp: site.brand.phone });

/** Every leaf string with its path; functions are called on the facts. */
function leaves(value: unknown, f: Facts, path = ""): [string, string][] {
  if (typeof value === "string") return [[path, value]];
  if (typeof value === "function") return leaves(value(f, 1), f, `${path}()`);
  if (Array.isArray(value)) return value.flatMap((v, i) => leaves(v, f, `${path}[${i}]`));
  if (typeof value === "object" && value !== null) return Object.entries(value).flatMap(([k, v]) => leaves(v, f, path ? `${path}.${k}` : k));
  return [];
}

const copyOf = (locale: Locale) => leaves(TEXT[locale], facts());

describe("the copy", () => {
  it.each(i18n.locales)("has no empty string (%s)", locale => {
    expect(copyOf(locale).filter(([path, s]) => s.trim() === "" && path !== "quoteForm.privacy")).toEqual([]);
  });

  it("has the same shape in both languages", () => {
    expect(copyOf("en").map(([p]) => p)).toEqual(copyOf("fr").map(([p]) => p));
  });

  it("names each job to the panel as the French price list does", () => {
    for (const s of SUBJECTS) expect(PANEL_NEED[s], s).toBe(TEXT.fr.jobs[s].name);
  });

  // The number is the place's own (`copy.f.phone`), never the frame's sample « 04 73 00 00 00 ».
  it.each(i18n.locales)("writes no phone number by hand (%s)", locale => {
    expect(copyOf(locale).filter(([, s]) => /(\+33|\b0[1-9])[\d\s.]{8,}/.test(s))).toEqual([]);
  });

  // A job's price is the price list's: only the reviewers' words and the sample terms quote one.
  it.each(i18n.locales)("states a job's price only where the frame's sample quotes it (%s)", locale => {
    const priced = copyOf(locale).filter(([path, s]) => /\d\s?€|€\s?\d/.test(s) && !/^(reviews\.items|prices\.terms|faqs|promises|card\.done\.priceValue)/.test(path));
    expect(priced).toEqual([]);
  });

  it.each(i18n.locales)("names no street, map or premises to visit (%s)", locale => {
    expect(copyOf(locale).filter(([, s]) => /\b(rue|avenue|boulevard|street|google maps|itinéraire|directions)\b/i.test(s))).toEqual([]);
  });

  it("sets French typography: no straight quote, a no-break space before ? ! : ; and inside « »", () => {
    const said = copyOf("fr").filter(([, s]) => /['"]|[^  ][?!:;](\s|$)|«[^ ]|[^ ]»/.test(s));
    expect(said).toEqual([]);
  });

  it("lists the design's sample content for the owner, and holds the launch on it", () => {
    const sample = OWNER_TODO.filter(t => t.field.startsWith("design sample content"));
    expect(sample.length).toBeGreaterThanOrEqual(8);
    expect(sample.every(t => t.blocksLaunch)).toBe(true);
  });
});
