"use client";

import { useSyncExternalStore } from "react";
import type { StaticImageData } from "next/image";

const VIDEO = new URL("../../../../assets/photos/hero.mp4", import.meta.url).href;
const EXPERIMENT = "hero_media";

const never = () => () => {};

/** The proxy's `ab_hero_media` cookie names the arm; the server and the first client render are the still, so the cached page is one page. */
const wantsVideo = () => {
  const arm = document.cookie.split("; ").find(c => c.startsWith(`ab_${EXPERIMENT}=`))?.split("=")[1];
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
  return arm === "video" && !saveData && !matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/** The hero's picture, and its video arm: `video` lays the clip over the still, once, unless the visitor asks for less motion or data. */
export function HeroMedia({ still, alt }: { still: StaticImageData; alt: string }) {
  const video = useSyncExternalStore(never, wantsVideo, () => false);
  return (
    <div aria-hidden={video ? "true" : undefined} data-experiment={EXPERIMENT} data-variant={video ? "video" : "photo"} className="absolute inset-0 -z-20">
      {/* The image optimiser is off (withLanding): the file is pre-sized. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={still.src} width={still.width} height={still.height} alt={alt} fetchPriority="high" decoding="async" className="size-full object-cover object-[70%_center]" />
      {video && <video src={VIDEO} poster={still.src} autoPlay muted playsInline preload="auto" className="absolute inset-0 size-full object-cover object-[70%_center]" />}
    </div>
  );
}
