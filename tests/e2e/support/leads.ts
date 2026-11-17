import { DatabaseSync } from "node:sqlite";
import { normalizePhone } from "../../../src/shared/lib/sites-tools/index";
import { LEADS_DB } from "../env";

/** The lead the server stored for `mobile`: what reached the commit point, whatever the page said. */
export function leadRow(mobile: string): unknown {
  const db = new DatabaseSync(LEADS_DB, { readOnly: true });
  try {
    return db.prepare("SELECT job, zip, location_id, spam_verdict, channel, flow, quoted_cents, extras FROM leads WHERE mobile = ?").get(normalizePhone(mobile));
  } finally {
    db.close();
  }
}
