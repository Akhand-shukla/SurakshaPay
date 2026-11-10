import { useState } from "react";
import {
  X,
  CreditCard,
  Smartphone,
  Building,
  ShieldCheck,
  AlertTriangle,
  Check,
  ArrowRight,
  ShoppingBag,
  Zap,
  RefreshCw,
  MessageSquare,
  Lock,
} from "lucide-react";
import { inr } from "../data.js";

export default function DemoCheckoutModal({ onClose, onTriggerFailure, onSuccess }) {
  const [step, setStep] = useState("form"); // "form" | "processing" | "success"
  const [method, setMethod] = useState("upi"); // "upi" | "card" | "netbanking"
  const [archetype, setArchetype] = useState("gateway"); // "gateway" | "otp" | "limit"
  const [upiVpa, setUpiVpa] = useState("rohit.kumar@okhdfcbank");

  const PRODUCT = {
    title: "Noise ColorFit Pulse 3 Smartwatch",
    variant: "Jet Black · 1.96\" AMOLED Display",
    price: 2499,
  };

  const ARCHETYPE_OPTIONS = [
    {
      id: "gateway",
      label: "Gateway Timeout (504)",
      desc: "Bank switch drops connection",
      bank: "HDFC Bank",
    },
    {
      id: "otp",
      label: "OTP Expired / 3DS",
      desc: "SMS delay or auth timeout",
      bank: "SBI",
    },
    {
      id: "limit",
      label: "UPI Daily Limit Hit",
      desc: "₹1,00,000 quota exceeded",
      bank: "ICICI Bank",
    },
  ];

  const handleFailClick = () => {
    // Immediately trigger failure and open WhatsApp drawer
    onTriggerFailure(archetype, PRODUCT.price);
  };

  const handleSuccessClick = async () => {
    setStep("processing");
    setTimeout(async () => {
      setStep("success");
      await onSuccess(PRODUCT.price);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-[480px] overflow-hidden rounded-[26px] border border-sand bg-white shadow-[0_24px_60px_-20px_rgba(38,51,46,0.35)] animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-sand/80 bg-parchment/80 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-deep text-white shadow-2xs">
              <ShoppingBag size={16} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                  Razorpay Standard Checkout
                </p>
                <span className="rounded-full bg-sage px-1.5 py-0.2 text-[9px] font-bold text-emerald-deep">
                  Live Simulator
                </span>
              </div>
              <p className="text-sm font-extrabold text-ink">Noise Official Flagship Store</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-ink-soft transition-colors hover:bg-sand/60 hover:text-ink"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* STEP 1: PAYMENT SELECTION FORM */}
        {step === "form" && (
          <div className="p-6">
            {/* Cart Item Preview */}
            <div className="flex items-center justify-between rounded-2xl border border-sand/70 bg-ivory/70 p-3.5">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-white border border-sand text-lg shadow-2xs">
                  ⌚
                </div>
                <div>
                  <p className="text-xs font-bold text-ink">{PRODUCT.title}</p>
                  <p className="text-[11px] text-ink-soft">{PRODUCT.variant}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm font-extrabold text-emerald-deep">
                  {inr(PRODUCT.price)}
                </p>
                <p className="text-[10px] text-ink-soft font-medium">Free express delivery</p>
              </div>
            </div>

            {/* Payment Method Selector Tabs */}
            <div className="mt-5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                Payment Rail (India)
              </p>
              <div className="mt-2 grid grid-cols-3 gap-2 p-1 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
                {[
                  { id: "upi", label: "1-Tap UPI", icon: Smartphone },
                  { id: "card", label: "Cards", icon: CreditCard },
                  { id: "netbanking", label: "Netbanking", icon: Building },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setMethod(id)}
                    className={`flex flex-col items-center justify-center gap-1.5 rounded-xl p-2.5 text-xs font-bold transition-all duration-200 ${
                      method === id
                        ? "bg-gradient-to-br from-emerald-deep to-[#0b6b52] text-white border-t border-t-white/35 border-x border-x-white/20 border-b border-b-black/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_20px_rgba(6,78,59,0.3)] scale-[1.02]"
                        : "border border-transparent text-ink-soft hover:bg-white/80 hover:text-emerald-deep"
                    }`}
                  >
                    <Icon size={16} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Sub-form based on method */}
              <div className="mt-3 rounded-xl border border-sand/70 bg-parchment/40 p-3">
                {method === "upi" && (
                  <div>
                    <label className="text-[11px] font-bold text-ink">Enter UPI ID / VPA</label>
                    <input
                      type="text"
                      value={upiVpa}
                      onChange={(e) => setUpiVpa(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-sand bg-white px-3 py-1.5 text-xs font-mono text-ink focus:border-emerald-deep focus:outline-hidden"
                    />
                    <div className="mt-2 flex gap-1.5">
                      {["@okhdfcbank", "@paytm", "@ybl"].map((suffix) => (
                        <button
                          key={suffix}
                          type="button"
                          onClick={() => setUpiVpa(`rohit.kumar${suffix}`)}
                          className="rounded-md border border-sand bg-white px-2 py-0.5 text-[10px] font-mono text-ink-soft hover:bg-ivory"
                        >
                          {suffix}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {method === "card" && (
                  <div className="space-y-2 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-ink-soft uppercase">Card Number</label>
                      <input
                        type="text"
                        defaultValue="4532 8921 4410 8421"
                        readOnly
                        className="mt-0.5 w-full rounded-lg border border-sand bg-white px-3 py-1 text-xs font-mono text-ink"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-ink-soft uppercase">Expiry</label>
                        <input
                          type="text"
                          defaultValue="09/28"
                          readOnly
                          className="mt-0.5 w-full rounded-lg border border-sand bg-white px-3 py-1 text-xs font-mono text-ink"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-ink-soft uppercase">CVV</label>
                        <input
                          type="password"
                          defaultValue="•••"
                          readOnly
                          className="mt-0.5 w-full rounded-lg border border-sand bg-white px-3 py-1 text-xs font-mono text-ink"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {method === "netbanking" && (
                  <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold text-ink">
                    {["HDFC Bank", "SBI", "ICICI Bank", "Axis Bank"].map((b) => (
                      <div key={b} className="rounded-lg border border-sand bg-white p-2 hover:border-emerald-deep cursor-pointer">
                        {b}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Failure Scenario Selector */}
            <div className="mt-5 rounded-2xl border border-clay bg-clay/30 p-4">
              <div className="flex items-center justify-between">
                <p className="flex items-center gap-1.5 text-xs font-extrabold text-rust">
                  <AlertTriangle size={13} /> Select Simulated Failure Type:
                </p>
                <span className="text-[10px] font-mono text-ink-soft">Stage 1 Triage</span>
              </div>

              <div className="mt-2.5 grid grid-cols-3 gap-2">
                {ARCHETYPE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setArchetype(opt.id)}
                    className={`flex flex-col rounded-xl border p-2 text-left transition-all ${
                      archetype === opt.id
                        ? "border-rust bg-white text-rust shadow-2xs ring-1 ring-rust"
                        : "border-sand bg-white text-ink-soft hover:border-sand-deep"
                    }`}
                  >
                    <span className="text-[11px] font-bold">{opt.label}</span>
                    <span className="mt-0.5 text-[9px] text-ink-soft leading-tight">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleFailClick}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-burnt py-3 text-sm font-bold text-white shadow-[0_12px_24px_-10px_rgba(244,91,22,0.5)] transition-all hover:bg-burnt-deep active:scale-[0.98]"
              >
                <Zap size={15} className="fill-white" />
                <span>Trigger Payment Failure & Test Recovery</span>
              </button>

              <button
                type="button"
                onClick={handleSuccessClick}
                className="flex w-full items-center justify-center gap-1.5 rounded-full border border-sand bg-white py-2.5 text-xs font-bold text-ink-soft transition-all hover:bg-parchment hover:text-ink active:scale-[0.98]"
              >
                <Check size={14} className="text-emerald-deep" />
                <span>Simulate Successful Normal Payment</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PROCESSING FAIL -> DIRECT WHATSAPP */}
        {step === "processing_fail" && (
          <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
            <div className="relative">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-clay text-rust shadow-2xs">
                <Zap size={28} className="fill-rust text-rust animate-bounce" />
              </div>
            </div>
            <h3 className="mt-5 text-base font-extrabold text-rust">
              Payment Failed: {ARCHETYPE_OPTIONS.find((a) => a.id === archetype)?.label}
            </h3>
            <p className="mt-1.5 max-w-xs text-xs text-ink-soft">
              SurakshaPay autonomous intercept triggered! Opening WhatsApp Concierge and delivering 1-tap recovery message...
            </p>
            <div className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-clay">
              <div className="h-full w-full animate-pulse bg-rust" />
            </div>
          </div>
        )}

        {/* STEP 2B: PROCESSING SUCCESS */}
        {step === "processing" && (
          <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
            <div className="relative">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-sage text-emerald-deep">
                <RefreshCw size={26} className="animate-spin text-emerald-deep" />
              </div>
            </div>
            <h3 className="mt-5 text-base font-extrabold text-ink">
              Authorizing with Bank Gateway...
            </h3>
            <p className="mt-1.5 max-w-xs text-xs text-ink-soft">
              Connecting to 3D-Secure 2.0 authentication server via Razorpay switch.
            </p>
            <div className="mt-6 h-1.5 w-48 overflow-hidden rounded-full bg-sand">
              <div className="h-full w-full animate-pulse bg-emerald-deep" />
            </div>
          </div>
        )}

        {/* STEP 3A: PAYMENT FAILED SCREEN + SENTINEL INTERCEPT */}
        {step === "failed" && (
          <div className="p-6">
            {/* Red Razorpay error notice */}
            <div className="rounded-2xl border border-rust/40 bg-clay/50 p-4 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-rust text-white shadow-xs">
                <X size={24} strokeWidth={2.5} />
              </div>
              <h3 className="mt-3 text-base font-extrabold text-rust">
                Payment Failed ({ARCHETYPE_OPTIONS.find((a) => a.id === archetype)?.label})
              </h3>
              <p className="mt-1 text-xs text-ink-soft">
                Bank response code: <span className="font-mono font-bold text-ink">{archetype === "gateway" ? "ETX-504" : archetype === "otp" ? "3DS-TMO" : "UPI-LIM"}</span>.
                No funds were deducted.
              </p>
            </div>

            {/* Sentinel Autonomous Intercept Card */}
            <div className="mt-4 rounded-2xl border-2 border-emerald-deep/40 bg-sage-soft p-4">
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-deep text-white shadow-2xs">
                  <Zap size={16} className="fill-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-extrabold text-emerald-deep">
                      SurakshaPay Intercept Triggered!
                    </p>
                    <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-bold text-emerald-deep border border-emerald-deep/20">
                      TRAI Safe
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-ink-soft">
                    Stage 1 deterministic triage classified this failure.
                    Personalized <strong>WhatsApp Concierge outreach</strong> has been dispatched to customer (+91 99200 ••••) with an instant 1-tap UPI bypass link.
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenWhatsApp) {
                    onOpenWhatsApp(lastEvent);
                  }
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-emerald-deep py-3 text-sm font-bold text-white shadow-[0_12px_24px_-10px_rgba(6,78,59,0.5)] transition-all hover:bg-emerald-soft active:scale-[0.98]"
              >
                <MessageSquare size={16} />
                <span>Open WhatsApp Concierge & Recover Now →</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex w-full items-center justify-center py-2 text-xs font-bold text-ink-soft hover:text-ink"
              >
                Close & Return to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* STEP 3B: SUCCESS SCREEN */}
        {step === "success" && (
          <div className="p-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-sage text-emerald-deep shadow-xs">
              <Check size={28} strokeWidth={3} />
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-ink">Payment Successful!</h3>
            <p className="mt-1 text-xs text-ink-soft">
              Amount: <span className="font-mono font-bold text-ink">{inr(PRODUCT.price)}</span> · Reference: <span className="font-mono">pay_RZP984210</span>
            </p>
            <p className="mt-3 text-xs text-emerald-deep font-semibold">
              Order confirmed and sealed into the cryptographic ledger.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-full bg-emerald-deep py-3 text-sm font-bold text-white transition-all hover:bg-emerald-soft"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
