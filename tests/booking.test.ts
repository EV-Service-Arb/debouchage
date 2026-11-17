import { isLeadRef } from "@/shared/lib/sites-tools";
import { afterEach, describe, expect, it } from "vitest";
import { panelHarness, type PanelHarness } from "./support/panel-harness";

// The card's lead through the real quote and booking routes, the panel a
// fetch that keeps every body: what the operator receives is the contract.

const SUBMISSION = "3f2b7c1e-8a4d-4e6f-9b0a-1c2d3e4f5a6b";
const BOOKING = { subject: "wc", when: "later", first_name: "Sophie", locality: "12 rue Blatin, Clermont-Ferrand", mobile: "06 12 34 56 78", confirm: "whatsapp" };

let harness: PanelHarness | undefined;
afterEach(() => {
  harness?.close();
  harness = undefined;
});

type Event = { type: string; subject: { leadId: string }; properties: Record<string, unknown>; pii?: Record<string, unknown> };
const eventOf = (body: unknown) => (body as { events: [Event] }).events[0];

async function check(fields: Record<string, string>) {
  harness = panelHarness();
  const answer = await harness.post({ submission_id: SUBMISSION, ...fields });
  return { answer, sent: (await harness.deliver()).map(eventOf) };
}

describe("a booking's price", () => {
  it("is the price list's for the posted job: a posted amount is never read", async () => {
    const { answer, sent } = await check({ ...BOOKING, quoted_cents: "1", cents: "1", price: "1" });
    expect(answer).toMatchObject({ status: 200, body: { ok: true, cents: 10900 } });
    expect(sent).toHaveLength(1);
    expect(sent[0]).toMatchObject({ type: "lead.created", properties: { flow: "fixed", quoted_cents: 10900 } });
  });

  it("is refused, with the fresh one, when the page showed another", async () => {
    const { answer, sent } = await check({ ...BOOKING, shown_cents: "8900" });
    expect(answer).toEqual({ status: 422, body: { ok: false, field: "price_changed", reason: "price_changed", cents: 10900 } });
    expect(sent).toEqual([]);
  });
});

describe("a booking's answers", () => {
  it("reach the panel as the operator's words: the job's name, when, the first name and how to confirm", async () => {
    const { sent } = await check(BOOKING);
    expect(sent[0]?.pii).toMatchObject({ need: "WC", locality: BOOKING.locality, when: "later", first_name: "Sophie", confirm: "whatsapp" });
  });
});

describe("a booking's slot preference", () => {
  it("goes to the panel after its lead, joined by the lead's reference", async () => {
    harness = panelHarness();
    const { body } = await harness.post({ ...BOOKING, submission_id: SUBMISSION });
    if (!isLeadRef(body.lead)) throw new Error("no lead reference");
    const answer = await harness.book({ submission: SUBMISSION, lead_ref: body.lead, provider: "manual", preferred_date: "2026-11-19", preferred_part: "afternoon" });
    expect(answer).toEqual({ status: 200, body: { ok: true, queued: true } });
    const [created, requested, ...rest] = (await harness.deliver()).map(eventOf);
    expect(rest).toEqual([]);
    expect(created).toMatchObject({ type: "lead.created", subject: { leadId: body.lead } });
    expect(requested).toMatchObject({
      type: "booking.requested",
      subject: { leadId: body.lead },
      properties: { lead_ref: body.lead, provider: "manual", preferred_date: "2026-11-19", preferred_part: "afternoon" },
    });
  });
});
