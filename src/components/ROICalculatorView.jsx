import { useState } from "react";
import {
  Coins,
  TrendingUp,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  RotateCcw,
} from "lucide-react";
import { inr } from "../data.js";

const CARD = "rounded-[22px] bg-white shadow-[0_14px_40px_-24px_rgba(38,51,46,0.28)]";

export default function ROICalculatorView() {
  const [gmvLakhs, setGmvLakhs] = useState(50); // ₹50 Lakhs monthly
  const [failureRate, setFailureRate] = useState(18); // 18%
  const [aov, setAov] = useState(2400); // ₹2,400

  const PRESETS = [
    {
      label: "D2C Fashion",
      gmv: 30,
      fail: 22,
      aov: 1800,
      desc: "High volume, impulsive mobile traffic",
    },
    {
      label: "Electronics & Gadgets",
      gmv: 80,
      fail: 15,
      aov: 4200,
      desc: "High ticket AOV, gateway dropouts",
    },
    {
      label: "SaaS & Subscriptions",
      gmv: 200,
      fail: 12,
      aov: 6500,
      desc: "Recurring bank mandate failures",
    },
  ];

  // Mathematical projections
  const monthlyGmvRupees = gmvLakhs * 100000;
  const failedGmvRupees = monthlyGmvRupees * (failureRate / 100);
  const baselineRecovered = failedGmvRupees * 0.176;
  const sentinelRecovered = failedGmvRupees * 0.704;
  const incrementalMonthly = sentinelRecovered - baselineRecovered;
  const annualIncremental = incrementalMonthly * 12;
  const estimatedCostAnnual = Math.max(120000, monthlyGmvRupees * 0.003 * 12);
  const roiMultiple = (annualIncremental / estimatedCostAnnual).toFixed(1);

  return (
    <div className="animate-[fadein_.35s_ease-out] px-10 py-10 pb-14">
      {/* Header */}
      <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#09372A]/75">
            Financial Impact Model
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink">
            ROI & Revenue Forecaster
          </h1>
          <p className="mt-2 max-w-2xl text-sm sm:text-[15px] font-medium text-ink/80 leading-relaxed">
            Quantify how autonomous Hinglish recovery and instant 1-tap rail switching convert lost payment failures into reclaimed net profit for merchants.
          </p>
        </div>
        <div className="mt-4 flex items-center gap-2 md:mt-0">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-sand bg-white px-3.5 py-1.5 text-xs font-bold text-emerald-deep shadow-2xs">
            <Coins size={14} /> Live Projections
          </span>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-ink-soft mr-1">
          Quick Presets:
        </span>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setGmvLakhs(p.gmv);
              setFailureRate(p.fail);
              setAov(p.aov);
            }}
            className="rounded-full border border-sand bg-white px-3.5 py-1.5 text-xs font-bold text-ink transition-all hover:border-emerald-deep hover:bg-sage/20 hover:text-emerald-deep active:scale-95 shadow-2xs"
          >
            {p.label} (₹{p.gmv}L)
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Sliders Panel */}
        <div className={`lg:col-span-6 ${CARD} border border-sand/80 p-6`}>
          <h2 className="text-base font-extrabold text-ink">Business Parameters</h2>
          <p className="mt-1 text-xs text-ink-soft">
            Adjust the sliders according to your Razorpay settlement metrics.
          </p>

          <div className="mt-6 space-y-6">
            {/* GMV Slider */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-ink">Monthly Processing GMV</label>
                <span className="font-mono text-sm font-extrabold text-emerald-deep">
                  ₹{gmvLakhs} Lakhs
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={gmvLakhs}
                onChange={(e) => setGmvLakhs(Number(e.target.value))}
                className="mt-2.5 w-full accent-emerald-deep cursor-pointer"
              />
              <div className="mt-1 flex justify-between font-mono text-[10px] text-sand-deep">
                <span>₹10 Lakhs</span>
                <span>₹2.5 Crores</span>
                <span>₹5 Crores</span>
              </div>
            </div>

            {/* Failure Rate Slider */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-ink">Payment Failure Rate</label>
                <span className="font-mono text-sm font-extrabold text-rust">
                  {failureRate}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="35"
                step="1"
                value={failureRate}
                onChange={(e) => setFailureRate(Number(e.target.value))}
                className="mt-2.5 w-full accent-rust cursor-pointer"
              />
              <div className="mt-1 flex justify-between font-mono text-[10px] text-sand-deep">
                <span>5% (Optimized)</span>
                <span>18% (Avg India)</span>
                <span>35% (Peak Sale)</span>
              </div>
            </div>

            {/* AOV Slider */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-ink">Average Order Value (AOV)</label>
                <span className="font-mono text-sm font-extrabold text-ink">
                  {inr(aov)}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="100"
                value={aov}
                onChange={(e) => setAov(Number(e.target.value))}
                className="mt-2.5 w-full accent-burnt cursor-pointer"
              />
              <div className="mt-1 flex justify-between font-mono text-[10px] text-sand-deep">
                <span>₹500</span>
                <span>₹5,000</span>
                <span>₹10,000</span>
              </div>
            </div>
          </div>

          {/* Under-the-hood parameters banner */}
          <div className="mt-8 rounded-2xl border border-sand bg-parchment/60 p-4 text-xs">
            <p className="font-bold text-ink">Engine Calibration Assumptions:</p>
            <div className="mt-2 grid grid-cols-2 gap-2 text-ink-soft">
              <div>• Baseline SMS Recovery: <strong>17.6%</strong></div>
              <div>• SurakshaPay Recovery: <strong>70.4%</strong></div>
              <div>• TRAI Compliance: <strong>100%</strong></div>
              <div>• Max Recovery Latency: <strong>8.4 min</strong></div>
            </div>
          </div>
        </div>

        {/* Forecast Output Banner */}
        <div className="flex flex-col gap-5 lg:col-span-6">
          {/* Main Hero Card */}
          <div className={`${CARD} border-2 border-emerald-deep/40 bg-sage-soft p-7`}>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-deep">
              Net Annual Reclaimed Cash
            </p>
            <p className="mt-2 text-4xl font-extrabold tracking-tight text-emerald-deep">
              +{inr(annualIncremental)}
            </p>
            <p className="mt-1 text-xs font-medium text-emerald-deep/80">
              Directly deposited to merchant account across 12 billing cycles
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-emerald-deep/20 pt-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">
                  Monthly Lift
                </p>
                <p className="mt-1 font-mono text-xl font-bold text-ink">
                  +{inr(incrementalMonthly)}/mo
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft">
                  Projected ROI
                </p>
                <p className="mt-1 font-mono text-xl font-bold text-burnt">
                  {roiMultiple}x Return
                </p>
              </div>
            </div>
          </div>

          {/* Detailed breakdown metrics */}
          <div className={`${CARD} border border-sand/80 p-6`}>
            <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">
              Monthly Cashflow Waterfall
            </p>

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-ink-soft">Monthly Failed Transactions:</span>
                <span className="font-mono font-bold text-rust">
                  {Math.round(failedGmvRupees / aov)} orders ({inr(failedGmvRupees)})
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-sand/50 pt-2">
                <span className="text-ink-soft">Legacy Recovery (17.6%):</span>
                <span className="font-mono text-ink-soft">{inr(baselineRecovered)}</span>
              </div>

              <div className="flex items-center justify-between border-t border-sand/50 pt-2 font-bold text-emerald-deep">
                <span>SurakshaPay Reclaimed (70.4%):</span>
                <span className="font-mono text-sm">{inr(sentinelRecovered)}</span>
              </div>

              <div className="flex items-center justify-between border-t border-sand/80 pt-2.5 font-bold text-burnt">
                <span>Net Extra Lift for Merchant:</span>
                <span className="font-mono text-sm">+{inr(incrementalMonthly)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
