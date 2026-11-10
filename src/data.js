// ── Sentinel-Recover · seed ledger ──────────────────────────────────────────
// Every field here exists because a decision depends on it. Nothing else.
// Phone numbers are stored masked at the source. Device/browser/IP: not collected.

export const ARCHETYPES = {
  gateway: { label: "Gateway timeout", code: "ETX-504", short: "Gateway 504" },
  otp: { label: "OTP expired", code: "3DS-TMO", short: "OTP expired" },
  limit: { label: "Daily limit hit", code: "UPI-LIM", short: "UPI limit" },
  fraud: { label: "High risk", code: "FRD-BLK", short: "Fraud abort" },
};

export const STATUS = {
  recovered: { label: "Recovered", kind: "ok" },
  sent: { label: "Link sent", kind: "muted" },
  wait: { label: "Retried", kind: "retry" },
  aborted: { label: "Aborted", kind: "bad" },
};

const hash = (s) => {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
};

export const ledgerHash = (id) => "7f" + hash(id) + "c2a9";

export const inr = (n) =>
  "₹" + new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

export const seed = [
  { id: "ORD-78432", amt: 2499, phone: "+91 ••••• 8421", bank: "HDFC", a: "gateway", s: "recovered", at: "19:41:07 IST", ago: "2 min ago" },
  { id: "ORD-78431", amt: 1199, phone: "+91 ••••• 3377", bank: "SBI", a: "otp", s: "sent", at: "19:28:44 IST", ago: "6 min ago" },
  { id: "ORD-78430", amt: 3999, phone: "+91 ••••• 9102", bank: "ICICI", a: "limit", s: "wait", at: "19:15:02 IST", ago: "12 min ago" },
  { id: "ORD-78429", amt: 5498, phone: "+91 ••••• 6714", bank: "Axis", a: "gateway", s: "recovered", at: "18:52:19 IST", ago: "26 min ago" },
  { id: "ORD-78428", amt: 899, phone: "+91 ••••• 1205", bank: "HDFC", a: "fraud", s: "aborted", at: "18:47:55 IST", ago: "34 min ago" },
  { id: "ORD-78427", amt: 1749, phone: "+91 ••••• 5563", bank: "Kotak", a: "otp", s: "recovered", at: "18:31:10 IST", ago: "58 min ago" },
  { id: "ORD-78426", amt: 20500, phone: "+91 ••••• 0448", bank: "SBI", a: "limit", s: "recovered", at: "17:58:36 IST", ago: "1 h 12 m ago" },
  { id: "ORD-78425", amt: 749, phone: "+91 ••••• 2219", bank: "ICICI", a: "gateway", s: "sent", at: "17:44:21 IST", ago: "1 h 30 m ago" },
];

// 5-stage trace per case (deterministic from spec)
export const trace = (c) => [
  { t: "00:00", stage: "Webhook", d: `payment.failed · ${c.bank} · ${ARCHETYPES[c.a].code}` },
  { t: "00:02", stage: "Triage", d: `archetype ${ARCHETYPES[c.a].a ?? ARCHETYPES[c.a].label.toLowerCase()} · confidence ${c.a === "gateway" ? "0.97" : c.a === "otp" ? "0.94" : c.a === "limit" ? "0.92" : "0.99"}` },
  { t: "00:04", stage: "Gate", d: c.a === "fraud" ? "policy:fraud_block → outreach aborted" : "policy pass · TRAI window open · cap ok" },
  {
    t: "00:07",
    stage: "Outreach",
    d: c.a === "fraud" ? "— none dispatched —" : `WhatsApp · UPI intent link rzp.io/i/${c.id.slice(-4).toLowerCase()}k2`,
  },
  {
    t: c.s === "recovered" ? "08:24" : "—",
    stage: "State",
    d: c.s === "recovered" ? "payment.captured · ledger sealed" : c.s === "sent" ? "link opened · awaiting intent" : c.s === "wait" ? "customer: salary kal · nudge scheduled 10:30 IST" : "no outreach · chargeback ring flagged",
  },
];

export const metrics = { failed: 1248, recovered: 878, revenue: 296340, avgMin: 8.4, lift: 299 };
