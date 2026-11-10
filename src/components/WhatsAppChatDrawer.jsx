import { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  ShieldCheck,
  CheckCheck,
  ArrowRight,
  Zap,
  Sparkles,
  RefreshCw,
  Clock,
  Tag,
  RotateCcw,
} from "lucide-react";
import { api } from "../api.js";
import { inr, ARCHETYPES } from "../data.js";

export default function WhatsAppChatDrawer({ item, onClose, onRecovered }) {
  if (!item) return null;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [paid, setPaid] = useState(false);
  const bottomRef = useRef(null);

  const initialAmount = item.amt || 2499;
  const currentAmount = Math.max(0, initialAmount - discount);

  // Re-sync when item changes
  useEffect(() => {
    setPaid(item.s === "recovered");
    setDiscount(item.outreach?.discount || 0);

    const defaultOutreach =
      item.outreach?.message ||
      (item.a === "otp"
        ? `Hi! Order ${item.id} (Noise Smartwatch - ${inr(initialAmount)}) me OTP time par nahi mila tha, isliye payment fail hua. Ab OTP ki zaroorat nahi — neeche 1-tap UPI se bina delay turant complete karein.`
        : item.a === "limit"
        ? `Hi! Order ${item.id} (Noise Smartwatch - ${inr(initialAmount)}) me aaj ki UPI limit reach ho gayi thi. Is smart link se aap Netbanking ya Card se bina limit issue ke complete kar sakte hain.`
        : `Hi! Order ${item.id} (Noise Smartwatch - ${inr(initialAmount)}) ka payment HDFC bank server timeout ki wajah se fail hua tha. Aapke paise bilkul safe hain. Neeche 1-tap UPI se turant confirm karein — link 15 min valid hai.`);

    setMessages([
      {
        id: "m-1",
        sender: "agent",
        text: defaultOutreach,
        time: item.at || "Just now",
        action: "upi_cta",
      },
    ]);
  }, [item, initialAmount]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (customText) => {
    const textToSend = (customText || input).trim();
    if (!textToSend || loading) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      sender: "customer",
      text: textToSend,
      time: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.chat(textToSend, item, messages);
      if (res.discount) {
        setDiscount(res.discount);
      }
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: "agent",
          text: res.reply,
          time: "Just now",
          action: res.action === "hold_cart" ? "hold" : "upi_cta",
          engine: res.engine,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: "agent",
          text: "Ji bilkul, aapka order safe hai! Humne 1-tap instant payment link reserve kiya hua hai.",
          time: "Just now",
          action: "upi_cta",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePayUPI = async () => {
    setLoading(true);
    try {
      await api.capture(item.id, currentAmount, "whatsapp_upi_intent");
      setPaid(true);
      setMessages((prev) => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          sender: "system",
          text: `Payment of ${inr(currentAmount)} successfully captured via 1-Tap UPI (GPay/PhonePe). Order ${item.id} confirmed and sealed to cryptographic ledger!`,
          time: "Just now",
        },
      ]);
      if (onRecovered) {
        onRecovered(item.id, currentAmount);
      }
    } catch {
      setPaid(true);
    } finally {
      setLoading(false);
    }
  };

  const QUICK_CHIPS = [
    "Salary 1st ko aayegi",
    "EMI option hai kya?",
    "₹100 extra off milega kya?",
    "Paise kat gaye the bank se",
  ];

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-ink/40 backdrop-blur-xs transition-opacity duration-300">
      <div
        className="relative flex h-full w-full max-w-[460px] flex-col bg-ivory shadow-2xl transition-transform duration-300 animate-in slide-in-from-right"
        style={{ animationDuration: "250ms" }}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-sand/80 bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-deep text-white font-bold text-sm shadow-sm">
                SP
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-extrabold text-ink">SurakshaPay Concierge</p>
                <span className="inline-flex items-center rounded-full bg-sage px-1.5 py-0.5 text-[9px] font-bold text-emerald-deep">
                  <ShieldCheck size={10} className="mr-0.5" /> Verified
                </span>
              </div>
              <p className="font-mono text-[11px] text-ink-soft">
                {item.phone || "+91 ••••• 8421"} · {item.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-ink-soft transition-colors hover:bg-parchment hover:text-ink"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Guardrail compliance bar */}
        <div className="flex items-center justify-between border-b border-sand/60 bg-parchment/60 px-5 py-2 text-[11px] font-medium text-ink-soft">
          <span className="flex items-center gap-1 text-emerald-deep">
            <ShieldCheck size={12} /> TRAI Safe (09:00-21:00 OK)
          </span>
          <span>Touch 1 of 3</span>
          <span className="font-mono text-sand-deep">
            {ARCHETYPES[item.a]?.short || "Gateway"}
          </span>
        </div>

        {/* Conversation Feed */}
        <div className="flex-1 space-y-4 overflow-y-auto p-5 text-sm">
          <div className="my-2 text-center">
            <span className="rounded-full border border-sand bg-white/80 px-3 py-1 font-mono text-[10px] text-ink-soft shadow-2xs">
              Today · WhatsApp End-to-End Encrypted
            </span>
          </div>

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === "customer"
                  ? "items-end"
                  : m.sender === "system"
                  ? "items-center"
                  : "items-start"
              }`}
            >
              {m.sender === "system" ? (
                <div className="my-2 flex max-w-[90%] items-center gap-2 rounded-2xl border border-emerald-500/30 bg-sage-soft p-3 text-xs font-semibold text-emerald-deep shadow-2xs">
                  <Zap size={14} className="shrink-0 text-emerald-deep fill-emerald-deep" />
                  <span>{m.text}</span>
                </div>
              ) : (
                <div
                  className={`relative max-w-[85%] rounded-[18px] p-3.5 shadow-2xs ${
                    m.sender === "customer"
                      ? "rounded-tr-xs bg-emerald-deep text-ivory"
                      : "rounded-tl-xs border border-sand/80 bg-white text-ink"
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>

                  {/* Smart 1-Tap UPI CTA Card inside agent bubble */}
                  {m.action === "upi_cta" && !paid && (
                    <div className="mt-3 overflow-hidden rounded-xl border border-sand bg-parchment/50 p-3">
                      <div className="flex items-center justify-between text-xs font-bold text-ink">
                        <span>One-Tap UPI Recovery</span>
                        <span className="text-emerald-deep font-mono">
                          {inr(currentAmount)}
                        </span>
                      </div>
                      {discount > 0 && (
                        <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-burnt">
                          <Tag size={11} /> ₹{discount} SurakshaPay waiver applied
                        </p>
                      )}
                      <p className="mt-1 text-[10px] text-ink-soft">
                        Direct bank-switch bypass · Valid for 15 minutes
                      </p>
                      <button
                        onClick={handlePayUPI}
                        disabled={loading}
                        className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl bg-burnt py-2 text-xs font-bold text-white shadow-sm transition-all hover:bg-burnt-deep active:scale-[0.98]"
                      >
                        <Zap size={13} className="fill-white" />
                        <span>Pay {inr(currentAmount)} via UPI (GPay/PhonePe)</span>
                      </button>
                    </div>
                  )}

                  {/* Hold cart confirmation */}
                  {m.action === "hold" && (
                    <div className="mt-2.5 flex items-center gap-1.5 rounded-lg border border-sand bg-sage/40 px-2.5 py-1.5 text-[11px] font-bold text-emerald-deep">
                      <Clock size={12} /> Cart held for 48 hrs · Reminder set for 10:30 IST
                    </div>
                  )}

                  <div
                    className={`mt-1.5 flex items-center justify-end gap-1 text-[9px] ${
                      m.sender === "customer" ? "text-ivory/70" : "text-ink-soft/70"
                    }`}
                  >
                    <span>{m.time}</span>
                    {m.sender === "agent" && (
                      <CheckCheck size={12} className="text-emerald-500" />
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-ink-soft">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-white border border-sand text-emerald-deep">
                <RefreshCw size={12} className="animate-spin" />
              </span>
              <span>SurakshaPay AI agent typing…</span>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="border-t border-sand/60 bg-white/70 px-4 py-2">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-ink-soft/80">
              Customer Quick Reply (Hinglish):
            </p>
            {paid && (
              <button
                onClick={() => setPaid(false)}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-burnt hover:underline"
              >
                <RotateCcw size={10} /> Re-open for Testing
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => handleSend(chip)}
                disabled={loading}
                className="rounded-full border border-sand bg-white px-2.5 py-1 text-[11px] font-semibold text-ink-soft shadow-2xs transition-all hover:border-emerald-deep hover:bg-sage/20 hover:text-emerald-deep active:scale-95"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="border-t border-sand bg-white p-3.5">
          {paid ? (
            <div className="flex items-center justify-between rounded-xl bg-sage px-4 py-2.5 text-xs font-bold text-emerald-deep">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={16} /> Order {item.id} recovered & sealed
              </span>
              <button
                onClick={() => setPaid(false)}
                className="rounded-lg bg-white px-2 py-1 text-[10px] font-bold text-ink hover:bg-parchment"
              >
                Test Again
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type customer reply in Hinglish…"
                className="flex-1 rounded-full border border-sand bg-ivory px-4 py-2 text-xs font-medium text-ink placeholder:text-ink-soft/50 focus:border-emerald-deep focus:outline-hidden"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-burnt text-white shadow-xs transition-all hover:bg-burnt-deep disabled:opacity-50"
              >
                <Send size={14} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
