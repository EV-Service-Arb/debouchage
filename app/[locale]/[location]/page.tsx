import type { Metadata } from "next";
import { PlaceHome } from "@/views/home";
import { loadPlace, placePageMetadata } from "@/views/place/server";
import { pricing } from "@/shared/config/env";

type Props = { params: Promise<{ locale: string; location: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { view, copy } = await loadPlace(params);
  return placePageMetadata(view, copy, "home");
}

export default async function PlaceHomePage({ params }: Props) {
  // The price list the card prices from, live or baked: under ISR, read with the page.
  const [{ view, copy, renderedAt }, model] = await Promise.all([loadPlace(params), pricing.model()]);
  return <PlaceHome view={view} copy={copy} renderedAt={renderedAt} pricing={model} />;
}
