import type { Subject } from "@/shared/config/lead";
import type { IconName } from "./Icon";

/** Each job's icon (Figma Icons 3:3): the price list's row and the card's tile. */
export const JOB_ICON: Readonly<Record<Subject, IconName>> = {
  sink: "sink",
  shower: "shower",
  wc: "toilet",
  drain: "pipe",
  jetting: "droplet",
  camera: "camera",
};
