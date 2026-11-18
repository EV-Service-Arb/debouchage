import type { StaticImageData } from "next/image";
import type { Subject } from "@/shared/config/lead";
import camera from "../../../assets/photos/camera.webp";
import canal from "../../../assets/photos/canal.webp";
import crew from "../../../assets/photos/crew.webp";
import douche from "../../../assets/photos/douche.webp";
import evier from "../../../assets/photos/evier.webp";
import hero from "../../../assets/photos/hero.webp";
import hydro from "../../../assets/photos/hydro.webp";
import rev1 from "../../../assets/photos/rev1.webp";
import rev2 from "../../../assets/photos/rev2.webp";
import rev3 from "../../../assets/photos/rev3.webp";
import wc from "../../../assets/photos/wc.webp";
import zone from "../../../assets/photos/zone.webp";

/** Generated stand-ins for the owner's own job photographs (OWNER_TODO "photos"): same files, same names, swapped before launch. */
export const PHOTO = { hero, crew, zone, reviews: { sophie: rev3, thierry: rev1, nadia: rev2 } } as const;

export const JOB_PHOTO: Record<Subject, StaticImageData> = { sink: evier, shower: douche, wc, drain: canal, jetting: hydro, camera };
