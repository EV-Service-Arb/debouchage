import { formatCents, type Place, type PricingModel } from "@/shared/lib/sites-tools";
import type { ReactNode } from "react";
import { leadCaptureText, type Copy } from "@/entities/content";
import { CONFIRM, EXTRAS, FLOWS, LEAD, SUBJECTS, WHEN, type Confirm, type Subject, type When } from "@/shared/config/lead";
import { jobPrices } from "@/shared/lib/job-prices";
import { Icon, JOB_ICON, type IconName } from "@/shared/ui";
import { BookingCapture } from "./BookingCapture";
import type { DoneText } from "./BookingDone";
import { LOOK, TILE } from "./look";

const WHEN_ICON: Readonly<Record<When, IconName>> = { asap: "zap", today: "clock", later: "calendar" };
const CONFIRM_ICON: Readonly<Record<Confirm, IconName>> = { call: "phone", whatsapp: "whatsapp", sms: "message" };

const icon = (name: IconName): ReactNode => <Icon name={name} className="size-[22px]" />;

const Check = ({ children }: { children: string }) => (
  <li className="flex items-center gap-1 text-xs leading-[1.4] whitespace-nowrap text-ink-soft">
    <Icon name="check" className="size-3 text-positive" />
    {children}
  </li>
);

export interface BookingCardProps {
  copy: Copy;
  /** The anchor every action on the site points at (`#reserver`). */
  id: string;
  place: Place<string>;
  /** `contactOf(site, place)`: a `null` number is a channel the card does not offer. */
  contact: { phone: string | null; whatsapp: string | null };
  renderedAt: number;
  /** The price list the tiles state and the server prices from; `null`: no figure, every job a request. */
  pricing: PricingModel | null;
}

/**
 * The frame's BookingCard (5:282) on the kit's `LeadCapture`, one question a
 * screen (`steps`): when (the kit's `intro`, posted as the extra `when`),
 * what — the price list's six jobs as tiles, each a fixed price the server
 * prices again — then the contact: first name, phone, address and how to
 * confirm (the extra `confirm`), the price and « Réserver ». Without a script
 * every screen is in the form at once and it posts as one. The tile's second
 * line is its price (`jobPrices`): the kit draws a need as one label.
 */
export function BookingCard({ copy, id, place, contact, renderedAt, pricing }: BookingCardProps) {
  const { t, locale } = copy;
  const c = t.card;
  const prices = jobPrices(pricing);
  const tileLabel = (s: Subject) => {
    const cents = prices[s];
    return cents === null ? t.jobs[s].tile : `${t.jobs[s].tile}\n${formatCents(cents, locale)}`;
  };
  const done: DoneText = {
    title: c.done.title,
    titleAnonymous: c.done.titleAnonymous,
    call: c.done.call,
    rows: c.done.rows,
    jobs: Object.fromEntries(SUBJECTS.map(s => [s, t.jobs[s].name])),
    arrival: c.done.arrival,
    priceValue: c.done.priceValue,
    payment: c.done.payment,
    photo: c.done.photo,
    photoMessages: Object.fromEntries(SUBJECTS.map(s => [s, c.done.photoMessage(t.jobs[s].name)])),
    note: c.done.note,
    callbackTitle: c.done.callbackTitle,
    callbackBody: c.done.callbackBody,
  };
  // Shown on the first two screens only, the contact's on the last: whole class names, for Tailwind to see.
  const onContact = "group-has-[[data-lead-step=phone]:not([data-lead-off])]/card";
  return (
    <BookingCapture
      id={id}
      className="light group/card relative rounded-3xl bg-background p-5 text-ink shadow-[0_24px_30px_rgba(0,0,0,0.28)] lg:p-7"
      place={place}
      contact={contact}
      locale={locale}
      renderedAt={renderedAt}
      wire={LEAD.wire}
      needs={SUBJECTS.map(s => ({ value: s, label: tileLabel(s), icon: icon(JOB_ICON[s]) }))}
      needDisplay="cards"
      flows={FLOWS}
      pricing={pricing}
      layout="steps"
      localityStep="with-phone"
      intro={{
        label: c.whenLabel,
        field: EXTRAS.when.name,
        options: WHEN.map(w => ({ value: w, label: `${c.when[w].label}\n${c.when[w].hint}`, icon: icon(WHEN_ICON[w]) })),
      }}
      name={{ field: EXTRAS.name.name }}
      price="compact"
      prefer="form"
      labels="hidden"
      text={leadCaptureText(t, locale)}
      head={
        <>
          <div className={`flex flex-col gap-1 ${onContact}:hidden`}>
            <h2 className="font-serif text-[26px] leading-[1.15] font-bold tracking-[-0.005em] text-ink">{c.title}</h2>
            <p className="text-sm leading-[1.45] text-ink-mid">{c.lede}</p>
          </div>
          <div className={`hidden flex-col gap-1 ${onContact}:flex`}>
            <p className="font-serif text-[26px] leading-[1.15] font-bold tracking-[-0.005em] text-ink">{c.contactTitle}</p>
            <p className="text-sm leading-[1.45] text-ink-mid">{c.contactLede}</p>
          </div>
          <ul className={`order-last flex flex-wrap justify-center gap-x-3.5 gap-y-1 ${onContact}:hidden`}>
            {c.reassurance.map(line => (
              <Check key={line}>{line}</Check>
            ))}
          </ul>
        </>
      }
      extras={
        <fieldset className="flex flex-col gap-0">
          <legend className="mb-2.5 text-sm leading-[1.25] font-semibold text-ink">{c.confirmLabel}</legend>
          <div className="grid grid-cols-3 gap-2">
            {CONFIRM.map((option, i) => (
              <label key={option} className="relative block cursor-pointer">
                <input type="radio" name={EXTRAS.confirm.name} value={option} defaultChecked={i === 0} className="peer absolute inset-0 m-0 size-full cursor-pointer opacity-0" />
                <span className={`flex min-h-11 peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50 ${TILE}`}>
                  <span aria-hidden="true" className="flex">
                    {icon(CONFIRM_ICON[option])}
                  </span>
                  <span className="text-sm leading-[1.25] font-semibold text-ink">{c.confirm[option]}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      }
      trust={
        <ul className="flex flex-wrap justify-center gap-x-3.5 gap-y-1">
          {c.trust.map(line => (
            <Check key={line}>{line}</Check>
          ))}
        </ul>
      }
      classNames={LOOK}
      doneText={done}
    />
  );
}
