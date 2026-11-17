"use client";

import { bookingOf, flowTextOf } from "@/shared/lib/sites-tools";
import { LeadBooking, LeadCapture, type LeadCaptureProps } from "@/shared/lib/sites-tools/react";
import { useState, type FormEvent } from "react";
import { EXTRAS, isSubject, WHEN, type Subject, type When } from "@/shared/config/lead";
import { BookingDone, type DoneText } from "./BookingDone";

const isWhen = (value: unknown): value is When => (WHEN as readonly unknown[]).includes(value);

/**
 * `LeadCapture` with the frame's Done state. A client module because `done`
 * and `booking` are functions of what was sent, which cannot cross from the
 * server's card. `LeadSent` carries neither the job nor `when`, so they are
 * read off the form as it is submitted. The slot preference — the kit's
 * `manual` booking, `booking.requested` — is offered after a lead for
 * « autre jour » only: « au plus vite » and « aujourd'hui » are set on the call.
 */
export function BookingCapture({ doneText, ...props }: Omit<LeadCaptureProps, "done" | "booking"> & { doneText: DoneText }) {
  const [posted, setPosted] = useState<{ subject: Subject | null; when: When | null }>({ subject: null, when: null });
  const read = (event: FormEvent<HTMLDivElement>) => {
    if (!(event.target instanceof HTMLFormElement)) return;
    const data = new FormData(event.target);
    const subject = data.get(props.wire.subject);
    const when = data.get(EXTRAS.when.name);
    setPosted({ subject: typeof subject === "string" && isSubject(subject) ? subject : null, when: isWhen(when) ? when : null });
  };
  return (
    <div className="contents" onSubmitCapture={read}>
      <LeadCapture
        {...props}
        done={sent => <BookingDone text={doneText} sent={sent} subject={posted.subject} when={posted.when} whatsapp={props.contact.whatsapp} locale={props.locale} />}
        booking={sent =>
          posted.when === "later" ? (
            <LeadBooking booking={bookingOf(props.place, null)} sent={sent} locale={props.locale} text={flowTextOf(props.text, props.locale)} formId={props.formId} classNames={props.classNames} />
          ) : (
            <></>
          )
        }
      />
    </div>
  );
}
