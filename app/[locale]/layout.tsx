import "../globals.css";
import { loadLocale, metadataBase } from "@/shared/lib/sites-tools/next";
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { site } from "@/shared/config/site";
import { display, text } from "@/shared/ui/fonts";

/**
 * The root layout lives under `[locale]` so `<html lang>` is the page's own
 * language on the first byte. The brand scope and the polarity sit on
 * `<html>`, so overlays portalled to `body` stay inside both.
 */
export const metadata: Metadata = {
  metadataBase: metadataBase(site),
  applicationName: site.brand.name,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, colorScheme: "light dark" };

/** Blocking, so the first paint is already the visitor's scheme; without JavaScript the page stays light. */
const SCHEME = `document.documentElement.className=document.documentElement.className.replace("light",matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")`;

export default async function RootLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const locale = await loadLocale(site, params);
  return (
    <html lang={locale} data-brand={site.brand.id} suppressHydrationWarning className={`light ${text.variable} ${display.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SCHEME }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
