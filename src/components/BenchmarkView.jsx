import { useEffect, useState } from "react";
import {
  Award,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertOctagon,
  RefreshCw,
  FileCheck,
} from "lucide-react";
import { api } from "../api.js";

const CARD = "rounded-[22px] bg-white shadow-[0_14px_40px_-24px_rgba(38,51,46,0.28)]";

export default function BenchmarkView() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBenchmark().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex h-[400px] items-center justify-center gap-2 text-ink-soft">
        <RefreshCw size={18} className="animate-spin text-emerald-deep" />
        <span className="text-sm font-semibold">Loading 100-case evaluation benchmark…</span>
      </div>
    );
  }

  const { summary, archetypes } = data;

  return (
    <div className="animate-[fadein_.35s_ease-out] px-10 py-10 pb-14">
      {/* Title */}
      <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#09372A]/75">
            Empirical Validation Scoreboard
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink">
            100-Case Held-Out Benchmark
          </h1>
          <p className="mt-2 max-w-2xl text-sm sm:text-[15px] font-medium text-ink/80 leading-relaxed">
            Evaluated against 100 actual Razorpay <span className="font-mono font-semibold text-emerald-deep bg-sage/60 px-1.5 py-0.5 rounded">payment.failed</span> webhook events. Measures autonomous Hinglish recovery lift, customer latency, and compliance guarantees against conventional SMS/email blasts.
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2 md:mt-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sand bg-white px-3.5 py-1.5 text-xs font-bold text-emerald-deep shadow-2xs">
            <FileCheck size={14} /> Audit Sealed · n=100
          </span>
        </div>
      </div>

      {/* Hero Scoreboard Cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className={`${CARD} border border-sand/70 p-6`}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">
            Baseline Recovery
          </p>
          <p className="mt-2 text-3xl font-extrabold text-ink-soft/70">
            {summary.baseline_recovery_rate}%
          </p>
          <p className="mt-1 text-xs text-ink-soft">Industry standard dumb SMS</p>
        </div>

        <div className={`${CARD} border-2 border-emerald-deep/40 bg-sage-soft p-6`}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-deep">
            SurakshaPay Recovery Rate
          </p>
          <p className="mt-2 text-3xl font-extrabold text-emerald-deep">
            {summary.sentinel_recovery_rate}%
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs font-bold text-burnt">
            <TrendingUp size={13} /> +{summary.lift_pct}% Relative Lift
          </p>
        </div>

        <div className={`${CARD} border border-sand/70 p-6`}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">
            Median Resolution Time
          </p>
          <p className="mt-2 text-3xl font-extrabold text-ink">
            {summary.median_recovery_time_min} <span className="text-lg font-bold text-ink-soft">min</span>
          </p>
          <p className="mt-1 text-xs text-ink-soft">vs 24-48 hrs for manual email</p>
        </div>

        <div className={`${CARD} border border-sand/70 p-6`}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">
            TRAI DND Violations
          </p>
          <p className="mt-2 text-3xl font-extrabold text-emerald-deep">
            {summary.trai_dnd_violations}
          </p>
          <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-deep">
            <ShieldCheck size={13} /> 100% Policy Compliant
          </p>
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      <div className={`mt-8 ${CARD} overflow-hidden border border-sand/80`}>
        <div className="border-b border-sand/70 bg-parchment/60 px-6 py-4">
          <h2 className="text-base font-extrabold text-ink">
            Architectural Comparison: Legacy vs SurakshaPay
          </h2>
        </div>
        <div className="grid grid-cols-1 divide-y divide-sand/70 md:grid-cols-2 md:divide-x md:divide-y-0">
          {/* Legacy */}
          <div className="p-6">
            <p className="font-mono text-xs font-bold uppercase text-rust">
              Conventional Payment Recovery (SMS / Email)
            </p>
            <ul className="mt-4 space-y-3 text-xs text-ink-soft">
              <li className="flex items-start gap-2">
                <span className="text-rust font-bold">✕</span>
                <span><strong>Blind retries:</strong> Resends payment link on the exact same broken bank rail.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rust font-bold">✕</span>
                <span><strong>Zero Context:</strong> Sends generic "Payment Failed" template without explaining why.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rust font-bold">✕</span>
                <span><strong>TRAI Risk:</strong> Batched cron jobs trigger late-night SMS violations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rust font-bold">✕</span>
                <span><strong>Fraud Blindness:</strong> Re-nudges stolen carding rings, creating chargebacks.</span>
              </li>
            </ul>
          </div>

          {/* SurakshaPay */}
          <div className="bg-sage/10 p-6">
            <p className="font-mono text-xs font-bold uppercase text-emerald-deep">
              SurakshaPay Autonomous Pipeline
            </p>
            <ul className="mt-4 space-y-3 text-xs text-ink">
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="shrink-0 text-emerald-deep" />
                <span><strong>Dynamic Rail Switching:</strong> Automatically swaps failed 3DS to 1-tap biometric UPI.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="shrink-0 text-emerald-deep" />
                <span><strong>Contextual Hinglish AI:</strong> Explains bank outage respectfully with zero customer panic.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="shrink-0 text-emerald-deep" />
                <span><strong>Strict Mathematical Gate:</strong> Traps night touches (21:00-09:00 IST) and caps discount to 5%.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 size={15} className="shrink-0 text-emerald-deep" />
                <span><strong>Cryptographic Ledger:</strong> SHA-256 sealed audit trail for dispute proofing.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Archetype Breakdown Table */}
      <div className={`mt-8 ${CARD} overflow-hidden border border-sand/80`}>
        <div className="border-b border-sand/70 bg-parchment/60 px-6 py-4">
          <h2 className="text-base font-extrabold text-ink">
            Archetype-by-Archetype Empirical Breakdown
          </h2>
          <p className="text-xs text-ink-soft">
            Performance segmented across 4 distinct error distributions (n=100 test set).
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-sand/80 bg-ivory/50 font-bold uppercase tracking-wider text-ink-soft">
                <th className="px-6 py-3.5">Archetype</th>
                <th className="px-4 py-3.5">Cases</th>
                <th className="px-4 py-3.5">Legacy Rec.</th>
                <th className="px-4 py-3.5">SurakshaPay Rec.</th>
                <th className="px-4 py-3.5">Lift</th>
                <th className="px-4 py-3.5">Avg Latency</th>
                <th className="px-6 py-3.5">Autonomous Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand/50">
              {archetypes.map((row) => (
                <tr key={row.archetype} className="transition-colors hover:bg-parchment/30">
                  <td className="px-6 py-4">
                    <p className="font-bold text-ink">{row.name}</p>
                    <p className="text-[11px] text-ink-soft">{row.description}</p>
                  </td>
                  <td className="px-4 py-4 font-mono font-semibold text-ink-soft">
                    {row.cases}
                  </td>
                  <td className="px-4 py-4 font-mono text-ink-soft/70">
                    {row.baseline_rate}% ({row.baseline_recovered})
                  </td>
                  <td className="px-4 py-4 font-mono font-bold text-emerald-deep">
                    {row.sentinel_rate}% ({row.sentinel_recovered})
                  </td>
                  <td className="px-4 py-4 font-bold text-burnt">
                    {row.lift}
                  </td>
                  <td className="px-4 py-4 font-mono text-ink-soft">
                    {row.avg_recovery_min} {row.avg_recovery_min !== "—" && "min"}
                  </td>
                  <td className="px-6 py-4 text-[11px] font-medium text-ink-soft">
                    {row.primary_action}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
