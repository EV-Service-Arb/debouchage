// The panel's internal endpoints for debouchage as the suite needs them, on
// `E2E_MOCK_PORT`, under the `/api/internal` that `SITES_PANEL_INTERNAL_URL`
// names in a deploy: the live place adds nothing over the baked one (no
// number, so no call or WhatsApp anywhere), and the price list is down, so
// every price on the page and in the leads file is the baked one.
import { createServer } from "node:http";

const port = Number(process.env["E2E_MOCK_PORT"]);
const base = "/api/internal/brands/debouchage";
const json = (res, status, body) => {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
};

createServer((req, res) => {
  const url = new URL(req.url ?? "/", "http://mock");
  if (url.pathname === "/health") return json(res, 200, { ok: true });
  if (url.pathname === `${base}/pricing`) return json(res, 503, { error: "down" });
  if (url.pathname === `${base}/locations/clermont-ferrand`) return json(res, 200, {});
  return json(res, 404, { error: "no such route" });
}).listen(port, "127.0.0.1");
