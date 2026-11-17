import type { Place, PricingModel } from "@/shared/lib/sites-tools";
import type { ReactNode } from "react";
import { leadCaptureText, type Copy } from "@/entities/content";
import { CONFIRM, EXTRAS, FLOWS, LEAD, SUBJECTS, WHEN, type Confirm, type When } from "@/shared/config/lead";
import { Icon, JOB_ICON, type IconName } from "@/shared/ui";
import { BookingCapture } from "./BookingCapture";
import type { DoneText } from "./BookingDone";
import { LOOK, TILE } from "./look";

const WHEN_ICON: Readonly<Record<When, IconName>> = { asap: "zap", today: "clock", later: "calendar" };
/** « Aujourd’hui » and « autre jour » ask the slot before the contact; « au plus vite » is set on the call. */
const WHEN_SLOT: Readonly<Record<When, "today" | "later" | undefined>> = { asap: undefined, today: "today", later: "later" };
const CONFIRM_ICON: Readonly<Record<Confirm, IconName>> = { call: "phone", whatsapp: "whatsapp", sms: "message" };

const icon = (name: IconName): ReactNode => <Icon name={name} className="size-[22px] text-ink" />;

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

const Head = ({ title, lede, as: As = "p" }: { title: string; lede: string; as?: "h2" | "p" }) => (
  <div className="flex flex-col gap-1">
    <As className="font-serif text-[26px] leading-[1.15] font-bold tracking-[-0.005em] text-ink">{title}</As>
    <p className="text-sm leading-[1.45] text-ink-mid">{lede}</p>
  </div>
);

/**
 * The frame's BookingCard (5:282) on the kit's `LeadCapture`, its screens
 * the frame's: what is blocked — the price list's six jobs, each at the
 * price the server charges — and when (the kit's `intro`, posted as the
 * extra `when`) on the first, with « Continuer »; the slot for « aujourd’hui »
 * and « autre jour », sent on as `booking.requested`; then the first name,
 * the phone, the address and how to confirm (the extra `confirm`), the
 * price on the submit. Without a script every screen is in the form at once
 * and it posts as one.
 */
export function BookingCard({ copy, id, place, contact, renderedAt, pricing }: BookingCardProps) {
  const { t, locale } = copy;
  const c = t.card;
  const done: DoneText = {
    title: c.done.title,
    titleAnonymous: c.done.titleAnonymous,
    call: c.done.call,
    rows: c.done.rows,
    jobs: Object.fromEntries(SUBJECTS.map(s => [s, t.jobs[s].name])),
    arrival: c.done.arrival,
    arrivalSlot: c.done.arrivalSlot,
    today: c.done.today,
    parts: c.done.parts,
    priceValue: c.done.priceValue,
    payment: c.done.payment,
    photo: c.done.photo,
    photoMessages: Object.fromEntries(SUBJECTS.map(s => [s, c.done.photoMessage(t.jobs[s].name)])),
    note: c.done.note,
    callbackTitle: c.done.callbackTitle,
    callbackBody: c.done.callbackBody,
  };
  return (
    <BookingCapture
      id={id}
      className="light relative rounded-3xl bg-background text-ink shadow-[0_24px_30px_rgba(0,0,0,0.28)] p-4 sm:p-5 lg:p-7"
      place={place}
      contact={contact}
      locale={locale}
      renderedAt={renderedAt}
      wire={LEAD.wire}
      needs={SUBJECTS.map(s => ({ value: s, label: t.jobs[s].tile, icon: icon(JOB_ICON[s]) }))}
      needDisplay="cards"
      flows={FLOWS}
      pricing={pricing}
      layout="steps"
      intro={{
        label: c.whenLabel,
        field: EXTRAS.when.name,
        options: WHEN.map(w => ({ value: w, label: c.when[w].label, hint: c.when[w].hint, icon: icon(WHEN_ICON[w]), slot: WHEN_SLOT[w] })),
      }}
      screens={[
        {
          ask: ["need", "intro"],
          head: (
            <>
              <Head as="h2" title={c.title} lede={c.lede} />
              <ul className="order-last flex flex-wrap justify-center gap-x-3.5 gap-y-1">
                {c.reassurance.map(line => (
                  <Check key={line}>{line}</Check>
                ))}
              </ul>
            </>
          ),
        },
        { ask: ["slot"], head: <Head title={c.slotTitle} lede={c.slotLede} /> },
        { ask: ["name", "phone", "locality"], head: <Head title={c.contactTitle} lede={c.contactLede} /> },
      ]}
      name={{ field: EXTRAS.name.name }}
      locality={{ ask: "address" }}
      price="compact"
      prefer="form"
      labels="hidden"
      text={leadCaptureText(t, locale)}
      // Every slot is asked on the screens, and the call confirms it: nothing after the booking.
      booking={null}
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
