import { fillText, formatCents, whatsappHref } from "@/shared/lib/sites-tools";
import type { LeadSent } from "@/shared/lib/sites-tools/react";
import type { Subject, When } from "@/shared/config/lead";
import { Icon } from "@/shared/ui/Icon";

/** The card's words once a lead is taken: plain strings, they cross into the client island. */
export interface DoneText {
  title: string;
  titleAnonymous: string;
  call: readonly [string, string];
  rows: { job: string; arrival: string; price: string; payment: string };
  jobs: Readonly<Record<string, string>>;
  arrival: Readonly<Record<When, string>>;
  priceValue: string;
  payment: string;
  photo: string;
  photoMessages: Readonly<Record<string, string>>;
  note: string;
  callbackTitle: string;
  callbackBody: string;
}

/**
 * The card's last state (Figma BookingCard Step=Done 5:255): the first name,
 * the call that confirms, the booking as a table — the job, when, the price
 * the server took the lead at, how to pay — and a photo of the problem on the
 * place's WhatsApp when it has one. `LeadCapture` puts it in the card's place
 * with the focus and `role="status"`; the kit's price line and slot follow it
 * (`order-*`: the photo and the note stay last). A row the lead did not
 * answer is not drawn.
 */
export function BookingDone(props: { text: DoneText; sent: LeadSent; subject: Subject | null; when: When | null; whatsapp: string | null; locale: string }) {
  const { text, sent, subject, when } = props;
  if (sent.channel === "callback") {
    return (
      <div className="flex flex-col gap-2">
        <p className="font-serif text-[26px] leading-[1.15] font-bold text-ink">{text.callbackTitle}</p>
        <p className="text-sm leading-[1.45] text-ink-mid">{text.callbackBody}</p>
      </div>
    );
  }
  const rows = [
    subject && { label: text.rows.job, value: text.jobs[subject] },
    when && { label: text.rows.arrival, value: text.arrival[when] },
    sent.cents !== undefined && { label: text.rows.price, value: fillText(text.priceValue, { price: formatCents(sent.cents, props.locale) }) },
    { label: text.rows.payment, value: text.payment },
  ].filter(row => typeof row === "object" && row !== null);
  const photo = subject && props.whatsapp !== null ? whatsappHref(props.whatsapp, text.photoMessages[subject]) : null;
  return (
    <>
      <p className="font-serif text-[26px] leading-[1.15] font-bold tracking-[-0.005em] text-ink">{sent.name ? fillText(text.title, { name: sent.name }) : text.titleAnonymous}</p>
      <p className="flex items-center gap-3 rounded-xl bg-positive/10 px-4 py-3.5 text-sm leading-[1.45] text-ink">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-positive text-on-positive">
          <Icon name="check" className="size-4" />
        </span>
        <span>
          {text.call[0]}
          <span className="font-semibold whitespace-nowrap">{sent.phone}</span>
          {text.call[1]}
        </span>
      </p>
      <dl className="flex flex-col rounded-xl border border-border px-3.5 py-1">
        {rows.map(row => (
          <div key={row.label} className="flex gap-4 py-3 text-sm leading-[1.45]">
            <dt className="w-[112px] shrink-0 text-ink-soft">{row.label}</dt>
            <dd className="font-semibold text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>
      {photo && (
        <a
          href={photo}
          className="order-last flex h-14 items-center justify-center gap-2.5 rounded-[14px] bg-[var(--whatsapp)] px-7 text-base leading-[1.25] font-bold text-on-primary hover:brightness-95"
        >
          <Icon name="whatsapp" className="size-5" />
          {text.photo}
        </a>
      )}
      <p className="order-last text-center text-xs leading-[1.4] text-ink-soft">{text.note}</p>
    </>
  );
}
