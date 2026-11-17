import localFont from "next/font/local";

/**
 * The two faces the design sets, served from the site itself: no request to a
 * font CDN, no layout shift once they load. Each is one variable file cut to
 * the Latin range a French/English page renders (`assets/fonts/README.md`).
 * Paths must be literals — Next reads these calls statically. `app/globals.css`
 * points the brand's font roles at the variables.
 */

/** Instrument Sans, every weight the text uses (400–700) in one file. */
export const text = localFont({
  src: [{ path: "../../../assets/fonts/InstrumentSans-Variable.woff2", weight: "400 700", style: "normal" }],
  display: "swap",
  variable: "--font-instrument-sans",
});

/** Bricolage Grotesque for headings, Bold and ExtraBold in one file. */
export const display = localFont({
  src: [{ path: "../../../assets/fonts/BricolageGrotesque-Bold.woff2", weight: "700 800", style: "normal" }],
  display: "swap",
  variable: "--font-bricolage",
});
