"use client";

import { LeadCapture, type LeadCaptureProps } from "@/shared/lib/sites-tools/react";
import { BookingDone, type DoneText } from "./BookingDone";

/** `LeadCapture` with the frame's Done state: a client module, because `done` is a function of what was sent. */
export function BookingCapture({ doneText, ...props }: Omit<LeadCaptureProps, "done"> & { doneText: DoneText }) {
  return <LeadCapture {...props} done={sent => <BookingDone text={doneText} sent={sent} whatsapp={props.contact.whatsapp} locale={props.locale} />} />;
}
