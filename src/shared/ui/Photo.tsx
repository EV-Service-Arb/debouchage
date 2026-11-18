import type { StaticImageData } from "next/image";

/** The image optimiser is off (`withLanding`): the files are pre-sized webp, so a plain `<img>` with its intrinsic size is all that is needed. */
export function Photo({ src, alt, className, priority = false }: { src: StaticImageData; alt: string; className?: string; priority?: boolean }) {
  // eslint-disable-next-line @next/next/no-img-element -- the optimiser is off
  return <img src={src.src} width={src.width} height={src.height} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async" className={className} />;
}
