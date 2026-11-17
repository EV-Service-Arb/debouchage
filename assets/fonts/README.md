The faces the site serves (`src/shared/ui/fonts.ts`), each under the SIL Open
Font License 1.1, cut to the Latin range a French/English page renders.
`tests/fonts.test.ts` holds the copy to that range, so a character the cut
leaves out fails the tests rather than rendering in a fallback face.

- `BricolageGrotesque-Bold.woff2` — headings. Bricolage Grotesque, © The
  Bricolage Grotesque Project Authors ([BricolageGrotesque-OFL.txt](BricolageGrotesque-OFL.txt)).
  From google/fonts `ofl/bricolagegrotesque/BricolageGrotesque[opsz,wdth,wght].ttf`,
  instanced at `wdth=100 opsz=14` — the optical size the Figma frame sets on
  every heading — with weight kept over 700–800 (Bold, ExtraBold).
- `BricolageGrotesque-ExtraBold.ttf` — what the OG card (`app/og/route.tsx`)
  draws with; Satori reads static TrueType, not WOFF2 nor a variable font.
  The same master, `wdth=100 wght=800 opsz=14`, static.
- `InstrumentSans-Variable.woff2` — text. Instrument Sans, © The Instrument
  Sans Project Authors ([InstrumentSans-OFL.txt](InstrumentSans-OFL.txt)),
  Vifnet's cut: google/fonts `ofl/instrumentsans/InstrumentSans[wdth,wght].ttf`
  at `wdth=100`, weight kept over 400–700.

To rebuild (fonttools with brotli):

```sh
LATIN="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2190-2193,U+2197,U+2212,U+2215,U+2248,U+2605,U+260E,U+2630,U+2713,U+FEFF,U+FFFD"
fonttools varLib.instancer 'BricolageGrotesque[opsz,wdth,wght].ttf' wdth=100 wght=700:800 opsz=14 -o BricolageGrotesque-Bold.ttf
pyftsubset BricolageGrotesque-Bold.ttf --unicodes="$LATIN" --layout-features='*' --flavor=woff2 --output-file=BricolageGrotesque-Bold.woff2
fonttools varLib.instancer 'BricolageGrotesque[opsz,wdth,wght].ttf' wdth=100 wght=800 opsz=14 --static -o og.ttf
pyftsubset og.ttf --unicodes="$LATIN" --layout-features='*' --output-file=BricolageGrotesque-ExtraBold.ttf
```
