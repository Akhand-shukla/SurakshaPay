import { useEffect, useState } from "react";
import {
  Home,
  ArrowLeftRight,
  TrendingUp,
  Settings,
  ArrowRight,
  Check,
  RefreshCw,
  Ban,
  Bell,
  ShoppingCart,
  Coins,
  Zap,
  ShieldCheck,
  X,
  Download,
  Award,
  MessageSquare,
  ChevronDown,
  LogOut,
  Building2,
  Sparkles,
} from "lucide-react";
import { ARCHETYPES, STATUS, ledgerHash, inr, seed, trace, metrics } from "./data.js";
import { api } from "./api.js";
import WhatsAppChatDrawer from "./components/WhatsAppChatDrawer.jsx";
import DemoCheckoutModal from "./components/DemoCheckoutModal.jsx";
import BenchmarkView from "./components/BenchmarkView.jsx";
import ROICalculatorView from "./components/ROICalculatorView.jsx";
import AuthPage from "./components/AuthPage.jsx";
import CinematicIntro from "./components/CinematicIntro.jsx";

/* ── primitives ─────────────────────────────────────────────────────────── */

const COLS = "grid-cols-[88px_180px_92px_minmax(110px,1fr)_124px_74px]";

const Kicker = ({ children }) => (
  <p className="text-[11px] font-extrabold tracking-[0.22em] uppercase text-[#09372A]/75">
    {children}
  </p>
);

const CARD =
  "rounded-[22px] bg-white shadow-[0_14px_40px_-24px_rgba(38,51,46,0.28)]";

function StatusPill({ s }) {
  const st = STATUS[s];
  const map = {
    ok: <Pill cls="bg-sage text-emerald-deep"><Check size={12} strokeWidth={3} />{st.label}</Pill>,
    muted: <Pill cls="border border-sand bg-white text-ink-soft">{st.label}</Pill>,
    retry: <Pill cls="bg-clay text-rust"><RefreshCw size={12} />{st.label}</Pill>,
    bad: <Pill cls="bg-clay text-rust"><Ban size={12} />{st.label}</Pill>,
  };
  return map[st.kind];
}

function Pill({ cls, children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${cls}`}>
      {children}
    </span>
  );
}

const ArchTag = ({ a }) => (
  <span className="text-[11px] font-medium tracking-wide text-ink-soft">
    {ARCHETYPES[a].short}
  </span>
);

const Hasher = ({ id }) => (
  <span className="font-mono text-[11px] text-sand-deep" title={`sha256 · ${ledgerHash(id)}`}>
    {ledgerHash(id).slice(0, 10)}
  </span>
);

const Toggle = ({ on, onChange }) => (
  <button
    onClick={onChange}
    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
      on ? "bg-emerald-deep" : "bg-sand-deep"
    }`}
    aria-pressed={on}
  >
    <span
      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
        on ? "left-[22px]" : "left-0.5"
      }`}
    />
  </button>
);

/* ── brand ──────────────────────────────────────────────────────────────── */

const Mark = () => {
  const [imgErr, setImgErr] = useState(false);

  if (!imgErr) {
    return (
      <img
        src="/suraksha-logo.png"
        alt="SurakshaPay Logo"
        onError={() => setImgErr(true)}
        className="h-8 w-auto object-contain shrink-0 select-none drop-shadow-[0_2px_8px_rgba(6,78,59,0.18)] transition-transform duration-300 hover:scale-105"
        draggable="false"
      />
    );
  }

  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-300 hover:scale-105"
      aria-hidden
    >
      <defs>
        <linearGradient id="topEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0E785B" />
          <stop offset="100%" stopColor="#064E3B" />
        </linearGradient>
        <linearGradient id="botOrange" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF7A38" />
          <stop offset="100%" stopColor="#E54E0F" />
        </linearGradient>
      </defs>
      <path
        d="M5 17 C5 15.5 5.8 14 7.2 12.8 L13.2 7 C14.5 5.8 16.2 5 18 5 L21.5 5 C23.5 5 25.2 6 26.3 7.8 L29 12 C30 13.5 30 15 30 17"
        stroke="url(#topEmerald)"
        strokeWidth="4.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30 17 C30 18.5 29.2 20 27.8 21.2 L21.8 27 C20.5 28.2 18.8 29 17 29 L13.5 29 C11.5 29 9.8 28 8.7 26.2 L6 22 C5 20.5 5 19 5 17"
        stroke="url(#botOrange)"
        strokeWidth="4.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/* ── decorative blobs (reference-image fidelity) ────────────────────────── */

const BlobBottom = () => (
  <svg
    className="pointer-events-none fixed bottom-0 left-0 hidden md:block"
    width="440" height="290" viewBox="0 0 440 290" fill="none" aria-hidden
  >
    <path d="M-30 225 C70 130 165 225 260 180 C345 141 395 185 460 150 L460 300 L-30 300 Z" fill="#DCEFE3" />
    <path d="M-30 246 C80 178 190 262 315 212 C380 186 425 208 464 192 L464 300 L-30 300 Z" fill="#0B6B52" />
    <path d="M-30 214 C90 152 200 242 320 198 C375 178 428 194 464 178" stroke="#F45B16" strokeWidth="7" strokeLinecap="round" fill="none" />
  </svg>
);

const BlobRight = () => (
  <svg
    className="pointer-events-none fixed right-0 top-[46%] hidden xl:block"
    width="150" height="160" viewBox="0 0 150 160" fill="none" aria-hidden
  >
    <g fill="#F45B16" opacity="0.5">
      {[0, 1, 2, 3].map((r) =>
        [0, 1, 2, 3].map((c) => (
          <circle key={`${r}${c}`} cx={110 + c * 11} cy={14 + r * 11} r="1.7" />
        ))
      )}
    </g>
    <path d="M150 84 C136 46 76 44 62 82 C50 118 88 146 122 136 C142 130 156 108 150 84 Z" fill="#DCEFE3" />
    <circle cx="96" cy="70" r="11" fill="#F45B16" />
    <circle cx="126" cy="146" r="6" fill="#0B6B52" />
  </svg>
);

/* ── hero illustration ──────────────────────────────────────────────────── */

const HeroArt = () => {
  const [useFallback, setUseFallback] = useState(false);

  return (
    <div className="relative hidden select-none md:flex items-center justify-end w-full">
      {!useFallback ? (
        <div className="relative w-full max-w-[560px] lg:max-w-[640px] xl:max-w-[720px] 2xl:max-w-[760px] transition-transform duration-500 ease-out hover:scale-[1.02]">
          <img
            src="/hero-card-3d.png"
            alt="SurakshaPay AI Payment Recovery"
            onError={() => setUseFallback(true)}
            className="w-full h-auto object-contain drop-shadow-[0_24px_48px_rgba(6,78,59,0.12)] pointer-events-none select-none"
            draggable="false"
          />
        </div>
      ) : (
        <svg viewBox="0 0 540 340" className="w-full max-w-[560px] lg:max-w-[640px] xl:max-w-[720px]" fill="none" aria-hidden>
          <defs>
            <radialGradient id="orbO" cx="35%" cy="28%" r="80%">
              <stop offset="0%" stopColor="#FF9C64" />
              <stop offset="100%" stopColor="#E14A0B" />
            </radialGradient>
            <linearGradient id="glass" x1="0" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stopColor="#128A69" />
              <stop offset="55%" stopColor="#0A5C46" />
              <stop offset="100%" stopColor="#04382B" />
            </linearGradient>
            <linearGradient id="chipG" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#F4DA96" />
              <stop offset="100%" stopColor="#D9A542" />
            </linearGradient>
            <filter id="cardShadow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="9" />
            </filter>
          </defs>

          {/* organic emerald blob */}
          <path
            d="M260 22 C350 -4 445 42 462 116 C478 192 416 268 316 282 C220 298 122 254 112 168 C105 104 185 42 260 22 Z"
            fill="#0B6B52"
          />
          <path
            d="M148 268 C94 256 64 214 78 176 C90 146 128 130 168 138 C153 176 165 224 208 254 C189 268 169 272 148 268 Z"
            fill="#DCEFE3"
          />

          {/* orbit ring — back arc */}
          <g transform="rotate(-16 270 170)">
            <path d="M42 170 A230 72 0 0 1 498 170" stroke="#F45B16" strokeWidth="4.2" strokeLinecap="round" fill="none" />
          </g>

          {/* credit card — hero card (enlarged & prominent) */}
          <g transform="rotate(-8 270 160)">
            {/* drop shadow */}
            <ellipse cx="275" cy="250" rx="135" ry="22" fill="#02281F" opacity="0.45" filter="url(#cardShadow)" />

            {/* card body: 285x178 */}
            <rect x="132" y="70" width="285" height="178" rx="24" fill="url(#glass)" />
            <rect x="133.5" y="71.5" width="282" height="175" rx="22.5" stroke="#FFF9F1" strokeOpacity="0.4" strokeWidth="2" fill="none" />
            {/* glass sheen */}
            <path d="M156 70 L248 70 L174 248 L132 248 L132 94 Z" fill="#FFF9F1" opacity="0.08" />

            {/* EMV chip */}
            <rect x="162" y="105" width="44" height="34" rx="7" fill="url(#chipG)" />
            <path d="M162 115h44M162 129h44M177 105v34M195 105v34" stroke="#B98A2E" strokeWidth="1.3" />

            {/* contactless waves */}
            <path d="M368 95c7.5 6 7.5 17 0 23M378 87c11.5 9.5 11.5 26.5 0 36" stroke="#FFF9F1" strokeOpacity="0.9" strokeWidth="3" strokeLinecap="round" fill="none" />

            {/* number dots */}
            <g fill="#FFF9F1" opacity="0.92">
              {[162, 204, 246, 288].map((gx, gi) =>
                [0, 1, 2, 3].map((d) => (
                  <circle key={`${gi}-${d}`} cx={gx + d * 10} cy="182" r="3.4" opacity={gi === 3 ? 0.55 : 1} />
                ))
              )}
            </g>

            {/* holder line */}
            <rect x="162" y="210" width="108" height="11" rx="5.5" fill="#FFF9F1" opacity="0.4" />
            <rect x="162" y="226" width="72" height="9" rx="4.5" fill="#FFF9F1" opacity="0.22" />
          </g>

          {/* orbit ring — front arc */}
          <g transform="rotate(-16 270 170)">
            <path d="M42 170 A230 72 0 0 0 498 170" stroke="#F45B16" strokeWidth="4.2" strokeLinecap="round" fill="none" />
          </g>

          {/* check badge — prominent white badge with green check */}
          <circle cx="414" cy="226" r="28" fill="#FFF9F1" />
          <circle cx="414" cy="226" r="28" stroke="#DCEFE3" strokeWidth="2.5" fill="none" />
          <path d="M402 226.5l7.5 8 16.5-16" stroke="#064E3B" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          {/* 3D spheres */}
          <circle cx="56" cy="235" r="13" fill="url(#orbO)" />
          <circle cx="56" cy="235" r="21" stroke="#F45B16" strokeOpacity="0.35" strokeWidth="2.5" fill="none" />
          <circle cx="102" cy="56" r="15" fill="url(#orbO)" />
          <circle cx="488" cy="268" r="10" fill="#DCEFE3" />
          <circle cx="510" cy="98" r="7" fill="#F45B16" opacity="0.9" />
        </svg>
      )}
    </div>
  );
};

/* ── metric card (reference style) ──────────────────────────────────────── */

function MetricCard({ icon: Icon, chipBg, chipFg, title, value, caption }) {
  return (
    <div className={`${CARD} px-5 py-5`}>
      <div className="flex items-start gap-4">
        <span className={`grid size-12 shrink-0 place-items-center rounded-full ${chipBg} ${chipFg}`}>
          <Icon size={19} />
        </span>
        <div className="min-w-0">
          <p className="text-[15px] font-bold text-ink">{title}</p>
          <p className="mt-1 text-[26px] font-extrabold leading-none tabular-nums text-ink">
            {value}
          </p>
        </div>
      </div>
      <p className="mt-3 pl-16 text-xs text-ink-soft">{caption}</p>
    </div>
  );
}

/* ── trace panel ────────────────────────────────────────────────────────── */

function Trace({ c, indent, onOpenChat }) {
  const stages = Array.isArray(c.trace) && c.trace.length ? c.trace : trace(c);
  return (
    <div className={`mb-4 ${indent ? "ml-14" : ""} rounded-2xl border border-sand/60 bg-parchment p-4`}>
      {stages.map((s, i) => (
        <div key={i} className="flex gap-4 py-0.5">
          <span className="w-11 pt-px text-right font-mono text-[11px] text-sand-deep">{s.t}</span>
          <span className="w-16 shrink-0 text-[11px] font-bold uppercase tracking-wider text-emerald-deep">
            {s.stage}
          </span>
          <span className="font-mono text-xs text-ink-soft">{s.d}</span>
        </div>
      ))}
      {c.s !== "aborted" && onOpenChat && (
        <div className="mt-3 flex items-center justify-between border-t border-sand/60 pt-2.5">
          <span className="text-[11px] font-medium text-ink-soft">
            Autonomous 2-way Hinglish recovery available for this order
          </span>
          <button
            onClick={() => onOpenChat(c)}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-deep px-3 py-1 text-xs font-bold text-white shadow-2xs hover:bg-emerald-soft active:scale-95 transition-all"
          >
            <MessageSquare size={12} />
            <span>Open WhatsApp Chat</span>
            <ArrowRight size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ── feed row (reference style: icon · id · amount · pill · ago) ─────────── */

function FeedRow({ c, onOpenChat }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-sand/50 last:border-0">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setOpen(!open)}
          className="grid flex-1 grid-cols-[64px_minmax(90px,1fr)_110px_136px_96px] items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-parchment/60"
        >
          <span className={`grid size-11 place-items-center rounded-full ${c.s === "aborted" ? "bg-sand text-ink-soft" : "bg-clay text-burnt"}`}>
            <ShoppingCart size={17} />
          </span>
          <span className="text-[15px] font-bold text-ink">{c.id}</span>
          <span className="text-[15px] font-extrabold tabular-nums text-ink">{inr(c.amt)}</span>
          <StatusPill s={c.s} />
          <span className="whitespace-nowrap text-right text-xs font-medium text-ink-soft">{c.ago}</span>
        </button>
        {c.s !== "aborted" && onOpenChat && (
          <button
            onClick={() => onOpenChat(c)}
            className="mr-5 inline-flex items-center gap-1 rounded-full border border-sand bg-white px-2.5 py-1 text-[11px] font-bold text-ink-soft hover:border-emerald-deep hover:text-emerald-deep shadow-2xs transition-all active:scale-95"
            title="Open 2-way WhatsApp Simulation"
          >
            <MessageSquare size={12} className="text-emerald-deep" />
            <span>Chat</span>
          </button>
        )}
      </div>
      {open && <Trace c={c} indent onOpenChat={onOpenChat} />}
    </div>
  );
}

/* ── ledger row (recoveries page: full columns) ─────────────────────────── */

function LedgerRow({ c, onOpenChat }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-sand/50 last:border-0">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setOpen(!open)}
          className={`grid flex-1 ${COLS} items-center gap-3 px-3 py-3.5 text-left transition-colors hover:bg-parchment/60`}
        >
          <span className="whitespace-nowrap font-mono text-[11px] text-ink-soft">{c.at}</span>
          <span className="block min-w-0">
            <span className="block text-sm font-bold text-ink">{c.id}</span>
            <span className="mt-0.5 block truncate text-xs text-ink-soft">{c.bank} · {c.phone}</span>
          </span>
          <span className="whitespace-nowrap text-sm font-extrabold tabular-nums text-ink">{inr(c.amt)}</span>
          <span className="block truncate"><ArchTag a={c.a} /></span>
          <span className="whitespace-nowrap"><StatusPill s={c.s} /></span>
          <Hasher id={c.id} />
        </button>
        {c.s !== "aborted" && onOpenChat && (
          <button
            onClick={() => onOpenChat(c)}
            className="mr-3 inline-flex items-center gap-1 rounded-full border border-sand bg-white px-2.5 py-1 text-[11px] font-bold text-ink-soft hover:border-emerald-deep hover:text-emerald-deep shadow-2xs transition-all active:scale-95"
          >
            <MessageSquare size={11} className="text-emerald-deep" />
            <span>Chat</span>
          </button>
        )}
      </div>
      {open && <Trace c={c} onOpenChat={onOpenChat} />}
    </div>
  );
}

/* ── simulate modal ────────────────────────────────────────────────────── */

const SIMS = [
  { a: "gateway", d: "HDFC switch timeout → 504", out: "recovered" },
  { a: "otp", d: "3DS session expired", out: "sent" },
  { a: "limit", d: "UPI daily ceiling ₹1,00,000", out: "wait" },
  { a: "fraud", d: "Stolen card pattern", out: "aborted" },
];

function Simulate({ onClose, onFire }) {
  const [done, setDone] = useState(null);

  const fire = (s) => {
    if (done) return;
    setDone(s);
    setTimeout(() => onFire(s), 950);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 p-6" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-[24px] bg-white p-8 shadow-[0_30px_80px_-20px_rgba(38,51,46,0.45)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <Kicker>Checkout simulator</Kicker>
            <h3 className="mt-1.5 text-2xl font-extrabold tracking-tight text-ink">
              Simulate a payment failure
            </h3>
          </div>
          <button onClick={onClose} className="mt-1 text-ink-soft hover:text-ink" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 space-y-2">
          {SIMS.map((s) => (
            <button
              key={s.a}
              disabled={!!done}
              onClick={() => fire(s)}
              className={`group flex w-full items-center gap-4 rounded-xl px-4 py-3.5 text-left transition-colors disabled:opacity-50 ${
                done?.a === s.a
                  ? "bg-sage"
                  : "bg-ivory hover:bg-sage-soft"
              }`}
            >
              <span className="font-mono text-xs font-medium text-emerald-deep">
                {ARCHETYPES[s.a].code}
              </span>
              <span className="flex-1 text-sm font-medium text-ink">{s.d}</span>
              {done?.a === s.a
                ? <Check size={15} className="text-emerald-deep" strokeWidth={3} />
                : <ArrowRight size={14} className="text-sand-deep transition-colors group-hover:text-burnt" />}
            </button>
          ))}
        </div>

        <p className="mt-5 min-h-5 text-center text-xs text-ink-soft">
          {done
            ? done.out === "aborted"
              ? "Triage → fraud_block · outreach stopped, ledger sealed"
              : "Triage passed · WhatsApp outreach dispatched"
            : "Fires a real payment.failed webhook into the pipeline."}
        </p>
      </div>
    </div>
  );
}

/* ── pages ──────────────────────────────────────────────────────────────── */

function Dashboard({ cases, stats, portalMode, onOpenSim, onOpenCheckout, onOpenChat, onFireScenario, onNavigateTab, go }) {
  const recent = cases.slice(0, 5);
  return (
    <div className="animate-[fadein_.35s_ease-out] pb-14">
      {/* Interactive Pitch Sandbox Cockpit (Visible in Demo Lab mode) */}
      {portalMode === "demo" && (
        <section className="mx-10 mt-6 rounded-2xl border border-burnt/30 bg-gradient-to-r from-burnt/10 via-sand/20 to-burnt/5 p-4 shadow-sm animate-[fadein_.25s_ease-out]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="grid size-8 place-items-center rounded-xl bg-burnt text-white shadow-xs">
                <Zap size={16} className="fill-white" />
              </div>
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-burnt">
                  Interactive Failure &amp; WhatsApp Recovery Sandbox
                </p>
                <p className="text-[11.5px] text-ink-soft font-medium">
                  Click any failure trigger below to execute real-time AI triage &amp; live 2-way WhatsApp outreach:
                </p>
              </div>
            </div>

            <button
              onClick={onOpenCheckout}
              className="inline-flex items-center gap-2 rounded-full bg-burnt px-4 py-2 text-xs font-extrabold text-white shadow-[0_8px_16px_-4px_rgba(244,91,22,0.5)] hover:bg-burnt-deep active:scale-95 transition-all"
            >
              <ShoppingCart size={13} />
              <span>Open Demo Checkout (₹2,499)</span>
            </button>
          </div>

          {/* Scenario Trigger Quick-Launch Buttons */}
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-burnt/15 text-xs font-bold">
            <button
              onClick={() => onFireScenario("gateway")}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-sand bg-white/80 hover:bg-white p-2.5 shadow-2xs hover:border-emerald-deep hover:text-emerald-deep active:scale-95 transition-all text-ink"
              title="Simulate HDFC bank switch 504 timeout"
            >
              <span>🔄 HDFC 504 Timeout</span>
            </button>
            <button
              onClick={() => onFireScenario("otp")}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-sand bg-white/80 hover:bg-white p-2.5 shadow-2xs hover:border-emerald-deep hover:text-emerald-deep active:scale-95 transition-all text-ink"
              title="Simulate 3DS OTP session expired"
            >
              <span>⏱️ 3DS OTP Expired</span>
            </button>
            <button
              onClick={() => onFireScenario("limit")}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-sand bg-white/80 hover:bg-white p-2.5 shadow-2xs hover:border-emerald-deep hover:text-emerald-deep active:scale-95 transition-all text-ink"
              title="Simulate UPI daily ceiling limit reached"
            >
              <span>💳 UPI Ceiling Limit</span>
            </button>
            <button
              onClick={() => onFireScenario("fraud")}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-sand bg-white/80 hover:bg-white p-2.5 shadow-2xs hover:border-rust hover:text-rust active:scale-95 transition-all text-ink"
              title="Simulate carding ring fraud pattern"
            >
              <span>🚨 Fraud (Hard Abort)</span>
            </button>
          </div>
        </section>
      )}

      {/* hero */}
      <section className={`${portalMode === "demo" ? "mt-4" : "mt-6"} grid grid-cols-1 items-center gap-6 px-10 pt-1 lg:grid-cols-[1fr_auto] xl:grid-cols-[1fr_1.15fr] 2xl:grid-cols-[1fr_1.25fr]`}>
        <div className="max-w-xl">
          <Kicker>
            {portalMode === "merchant" ? "Aarav Textiles · Production Overview" : "AI-Powered Payment Recovery Engine"}
          </Kicker>
          <h1 className="mt-3.5 text-[54px] sm:text-[62px] lg:text-[70px] xl:text-[76px] font-extrabold leading-[0.98] tracking-[-0.035em] text-[#09372A]">
            Recover<br />
            lost revenue,<br />
            <span className="text-burnt">automatically.</span>
          </h1>
          <p className="mt-5 max-w-lg text-[15px] sm:text-[16px] leading-relaxed text-ink-soft">
            Turn failed payments into successful orders with AI, smart retries
            and personalized outreach.
          </p>

          <div className="mt-7 flex items-center gap-3">
            {portalMode === "merchant" ? (
              <>
                <button
                  onClick={go}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-deep px-7 py-3.5 text-[15px] font-bold text-white shadow-[0_16px_32px_-10px_rgba(6,78,59,0.55)] transition-all hover:bg-[#064E3B] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Inspect Recoveries</span> <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => onNavigateTab("roi")}
                  className="inline-flex items-center gap-2 rounded-full border border-sand bg-white px-6 py-3.5 text-[15px] font-bold text-ink shadow-2xs hover:border-sand-deep hover:bg-sage-soft active:scale-[0.98] transition-all"
                >
                  <Coins size={16} className="text-burnt" />
                  <span>Forecast ROI Lift</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onOpenCheckout}
                  className="inline-flex items-center gap-2 rounded-full bg-burnt px-7 py-3.5 text-[15px] font-bold text-white shadow-[0_16px_32px_-10px_rgba(244,91,22,0.55)] transition-all hover:bg-burnt-deep hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ShoppingCart size={16} />
                  <span>Launch Demo Checkout</span>
                </button>
                <button
                  onClick={onOpenSim}
                  className="inline-flex items-center gap-2 rounded-full border border-sand bg-white px-6 py-3.5 text-[15px] font-bold text-ink shadow-2xs hover:border-sand-deep hover:bg-sage-soft active:scale-[0.98] transition-all"
                >
                  <Zap size={16} className="text-burnt" />
                  <span>Simulate Webhook</span>
                </button>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-end pr-0 xl:pr-2">
          <HeroArt />
        </div>
      </section>

      {/* scroll down indicator */}
      <div className="flex justify-center pt-3 pb-1">
        <button
          onClick={() => {
            document.getElementById("metrics-section")?.scrollIntoView({ behavior: "smooth" });
          }}
          className="group flex flex-col items-center gap-1.5 text-xs font-semibold tracking-wider text-ink-soft/70 transition-all hover:text-emerald-deep active:scale-95"
          aria-label="Scroll down to metrics"
        >
          <span className="text-[10px] tracking-[0.22em] font-bold uppercase opacity-75 group-hover:opacity-100 group-hover:text-emerald-deep transition-all">
            Scroll to explore
          </span>
          <div className="relative flex h-7 w-4.5 items-start justify-center rounded-full border border-sand-deep/80 p-0.5 bg-white/50 backdrop-blur-xs shadow-2xs group-hover:border-emerald-deep/60 group-hover:bg-white transition-all">
            <span className="size-1 rounded-full bg-burnt animate-scroll-wheel" />
          </div>
          <ChevronDown size={13} className="text-sand-deep transition-transform group-hover:translate-y-0.5 group-hover:text-burnt animate-bounce-slow" />
        </button>
      </div>

      {/* metric cards */}
      <section id="metrics-section" className="mt-4 grid grid-cols-2 gap-5 px-10 xl:grid-cols-4 scroll-mt-6">
        <MetricCard
          icon={ShoppingCart} chipBg="bg-clay" chipFg="text-burnt"
          title="Failed Payments" value={stats.failed.toLocaleString("en-IN")}
          caption={<span>Last 7 days · <span className="font-bold text-emerald-deep">{stats.avgMin} min avg</span></span>}
        />
        <MetricCard
          icon={Check} chipBg="bg-sage" chipFg="text-emerald-deep"
          title="Recovered Orders" value={stats.recovered.toLocaleString("en-IN")}
          caption={<span>Recovery Rate <span className="font-bold text-emerald-deep">{stats.captureRate}%</span></span>}
        />
        <MetricCard
          icon={Coins} chipBg="bg-[#F6ECD4]" chipFg="text-[#C98A1B]"
          title="Revenue Recovered" value={inr(stats.revenue)}
          caption={<span className="font-bold text-emerald-deep">+{stats.lift}% vs. baseline</span>}
        />
        <MetricCard
          icon={Zap} chipBg="bg-clay" chipFg="text-burnt"
          title="Avg. Recovery Time" value={`${stats.avgMin} min`}
          caption="From failure to success"
        />
      </section>

      {/* recent recoveries */}
      <section className="mt-10 px-10">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight text-ink">Recent Recoveries</h2>
          <button
            onClick={go}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-burnt hover:text-burnt-deep"
          >
            View All <ArrowRight size={15} />
          </button>
        </div>

        <div className={`mt-4 ${CARD} py-1.5`}>
          {recent.map((c) => <FeedRow key={c.id} c={c} onOpenChat={onOpenChat} />)}
        </div>

        <div className="mt-5 flex items-center gap-2.5 pl-1 text-xs text-ink-soft">
          <ShieldCheck size={15} className="text-emerald-deep" />
          <span>All {cases.length} events hashed &amp; sealed ·</span>
          <span className="font-mono font-medium text-emerald-deep" title={ledgerHash("chain-head")}>
            {ledgerHash("chain-head").slice(0, 12)}
          </span>
          <span>· TRAI quiet-hours 21:00–09:00 enforced</span>
        </div>
      </section>
    </div>
  );
}

function Recoveries({ cases, onOpenChat }) {
  const [f, setF] = useState("all");
  const list = f === "all" ? cases : cases.filter((c) => c.a === f);

  const handleExportCSV = () => {
    window.open(api.exportCSVUrl(), "_blank");
  };

  return (
    <div className="animate-[fadein_.35s_ease-out] px-10 py-10 pb-14">
      <div className="flex items-center justify-between">
        <div>
          <Kicker>Ledger</Kicker>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink">Recoveries</h1>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 rounded-full border border-sand bg-white px-4 py-2 text-xs font-bold text-ink-soft hover:border-emerald-deep hover:text-emerald-deep shadow-2xs transition-all active:scale-95"
        >
          <Download size={14} /> Export CSV Ledger
        </button>
      </div>

      <div className="mt-6 inline-flex flex-wrap items-center gap-1.5 rounded-full p-1.5 bg-white/40 backdrop-blur-2xl border border-white/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_rgba(6,78,59,0.03)]">
        {[["all", "All"], ...Object.entries(ARCHETYPES).map(([k, v]) => [k, v.short])].map(([k, label]) => (
          <button
            key={k}
            onClick={() => setF(k)}
            className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
              f === k
                ? "bg-gradient-to-r from-emerald-deep to-[#0b6b52] text-white border-t border-t-white/35 border-x border-x-white/20 border-b border-b-black/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_6px_16px_rgba(6,78,59,0.35)] scale-[1.02]"
                : "text-ink-soft hover:text-emerald-deep hover:bg-white/70 border border-transparent"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={`mt-5 ${CARD} overflow-x-auto`}>
        <div className="min-w-[720px] py-2">
          <div className={`grid ${COLS} gap-3 border-b-2 border-sand px-3 pb-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-soft`}>
            <span>Time IST</span><span>Order</span><span>Amount</span><span>Archetype</span><span>Status</span><span>Ledger</span>
          </div>
          {list.map((c) => <LedgerRow key={c.id} c={c} onOpenChat={onOpenChat} />)}
        </div>
      </div>
    </div>
  );
}

function Analytics({ cases, stats }) {
  // live recovery-rate per archetype from real pipeline events
  const rows = Object.keys(ARCHETYPES).map((k) => {
    const of = cases.filter((c) => c.a === k);
    const dispatched = of.filter((c) => c.s === "recovered" || c.s === "sent").length;
    const rec = of.filter((c) => c.s === "recovered").length;
    return [k, dispatched ? Math.round((rec / dispatched) * 100) : 0, dispatched];
  });
  return (
    <div className="animate-[fadein_.35s_ease-out] px-10 py-10 pb-14">
      <Kicker>Performance</Kicker>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink">Analytics</h1>
      <p className="mt-2 max-w-2xl text-sm sm:text-[15px] font-medium text-ink/80 leading-relaxed">
        Real-time cohort conversion metrics, recovery velocity, and automated channel performance across all payment failure archetypes.
      </p>

      <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-3">
        <MetricCard
          icon={Check} chipBg="bg-sage" chipFg="text-emerald-deep"
          title="Capture Rate" value={`${stats.captureRate}%`}
          caption="of recovered attempts"
        />
        <MetricCard
          icon={TrendingUp} chipBg="bg-clay" chipFg="text-burnt"
          title="vs. Email Dunning" value={`+${stats.lift}%`}
          caption="revenue lift, same cohort"
        />
        <MetricCard
          icon={Ban} chipBg="bg-sage" chipFg="text-emerald-deep"
          title="Fraud Links Sent" value="0"
          caption="policy hard-abort at triage"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className={`${CARD} p-6`}>
          <h3 className="text-lg font-extrabold text-ink">Recovery by archetype</h3>
          <div className="mt-5 space-y-5">
            {rows.map(([k, v, dispatched]) => (
              <div key={k}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-bold text-ink">{ARCHETYPES[k].short}</span>
                  <span className="tabular-nums text-ink-soft">
                    {dispatched === 0 ? "no events yet" : `${v}% · ${dispatched} dispatched`}
                  </span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-sand">
                  <div
                    className={`h-full rounded-full ${v === 0 ? "bg-sand-deep" : "bg-emerald-deep"}`}
                    style={{ width: `${Math.max(v, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={`${CARD} p-6`}>
          <h3 className="text-lg font-extrabold text-ink">Channel performance</h3>
          <div className="mt-5 space-y-5">
            {[
              ["WhatsApp · UPI intent", 82, "bg-emerald-deep"],
              ["Smart link (SMS)", 41, "bg-emerald-soft"],
              ["Email dunning · baseline", 18, "bg-sand-deep"],
            ].map(([label, v, cls]) => (
              <div key={label}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-bold text-ink">{label}</span>
                  <span className="tabular-nums text-ink-soft">{v}%</span>
                </div>
                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-sand">
                  <div className={`h-full rounded-full ${cls}`} style={{ width: `${v}%` }} />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-xs text-ink-soft">
            Same 100-case cohort · recovery within 30 minutes of failure.
          </p>
        </div>
      </div>
    </div>
  );
}

function SettingsPage({ policy }) {
  const [p, setP] = useState(policy ?? { quiethrs: true, from: "21:00", to: "09:00", pct: 5, cap: 200, touches: 3, window: 72, wa: true, sms: false, email: false, saved: false });
  const [saving, setSaving] = useState(false);

  const set = (k, v) => setP((x) => ({ ...x, [k]: v, saved: false }));
  const save = async () => {
    setSaving(true);
    try {
      const savedPolicy = await api.putPolicy(p);
      setP((x) => ({ ...x, ...savedPolicy, saved: true }));
    } catch {
      // offline demo: keep local state, honest label
      setP((x) => ({ ...x, saved: false }));
    }
    setSaving(false);
    setTimeout(() => setP((x) => ({ ...x, saved: false })), 1800);
  };

  return (
    <div className="max-w-2xl animate-[fadein_.35s_ease-out] px-10 py-10 pb-14">
      <div className="flex items-center justify-between">
        <div>
          <Kicker>Policy engine</Kicker>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-ink">Settings</h1>
        </div>
        <Pill cls="bg-sage text-emerald-deep"><ShieldCheck size={13} /> TRAI compliant</Pill>
      </div>

      <section className={`${CARD} mt-8 p-6`}>
        <div className="flex items-start justify-between gap-8">
          <div>
            <h3 className="text-[15px] font-extrabold text-ink">TRAI quiet hours</h3>
            <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-soft">
              No outreach between these hours. Queued messages dispatch at 09:01 IST.
            </p>
            {p.quiethrs && (
              <div className="mt-4 flex items-center gap-3">
                <input value={p.from} onChange={(e) => set("from", e.target.value)} className="w-20 rounded-lg border border-sand bg-ivory px-3 py-2 font-mono text-sm text-ink focus:border-emerald-deep focus:outline-none" />
                <span className="text-ink-soft">→</span>
                <input value={p.to} onChange={(e) => set("to", e.target.value)} className="w-20 rounded-lg border border-sand bg-ivory px-3 py-2 font-mono text-sm text-ink focus:border-emerald-deep focus:outline-none" />
              </div>
            )}
          </div>
          <Toggle on={p.quiethrs} onChange={() => set("quiethrs", !p.quiethrs)} />
        </div>
      </section>

      <section className={`${CARD} mt-5 p-6`}>
        <h3 className="flex items-center gap-2 text-[15px] font-extrabold text-ink"><Zap size={15} className="text-burnt" /> Recovery incentive</h3>
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-soft">
          The AI may offer less but never more. Hard clamp applied downstream of the agent.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-8">
          <label className="flex min-w-[280px] flex-1 items-center gap-4">
            <span className="text-xs font-bold text-ink-soft">Max discount</span>
            <input type="range" min="1" max="10" value={p.pct} onChange={(e) => set("pct", +e.target.value)} className="flex-1 accent-emerald-deep" />
            <span className="w-10 text-sm font-extrabold tabular-nums text-ink">{p.pct}%</span>
          </label>
          <label className="flex items-center gap-3">
            <span className="text-xs font-bold text-ink-soft">Rupee cap</span>
            <input
              type="number" value={p.cap} min="0"
              onChange={(e) => set("cap", +e.target.value)}
              className="w-24 rounded-lg border border-sand bg-ivory px-3 py-2 text-sm font-extrabold tabular-nums text-ink focus:border-emerald-deep focus:outline-none"
            />
          </label>
        </div>
      </section>

      <section className={`${CARD} mt-5 p-6`}>
        <h3 className="text-[15px] font-extrabold text-ink">Contact frequency</h3>
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-soft">
          Hard ceiling on touches per case, however the customer replies.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center rounded-full border border-sand bg-ivory px-1.5">
            <button onClick={() => set("touches", Math.max(1, p.touches - 1))} className="px-3 py-2 text-ink-soft hover:text-ink">−</button>
            <span className="min-w-[92px] text-center text-sm font-extrabold tabular-nums text-ink">{p.touches} touches</span>
            <button onClick={() => set("touches", Math.min(5, p.touches + 1))} className="px-3 py-2 text-ink-soft hover:text-ink">+</button>
          </div>
          <span className="text-sm text-ink-soft">per</span>
          <div className="flex items-center gap-2">
            <input type="number" value={p.window} min="1" onChange={(e) => set("window", +e.target.value)} className="w-16 rounded-lg border border-sand bg-ivory px-3 py-2 text-sm font-extrabold tabular-nums text-ink focus:border-emerald-deep focus:outline-none" />
            <span className="text-sm text-ink-soft">hours</span>
          </div>
        </div>
      </section>

      <section className={`${CARD} mt-5 p-6`}>
        <div className="flex items-center gap-2 text-[15px] font-extrabold text-ink">Channels</div>
        <div className="mt-2 divide-y divide-sand/60">
          {[
            ["wa", "WhatsApp Business", "Primary rails · UPI intent + smart links"],
            ["sms", "SMS fallback", "Plain-text smart link, TRAI DLT template"],
            ["email", "Email escalation", "Reconciliation copies to finance team"],
          ].map(([k, label, d]) => (
            <div key={k} className="flex items-center justify-between py-3.5">
              <div>
                <p className="text-sm font-bold text-ink">{label}</p>
                <p className="text-xs text-ink-soft">{d}</p>
              </div>
              <Toggle on={p[k]} onChange={() => set(k, !p[k])} />
            </div>
          ))}
        </div>
      </section>

      <div className="mt-7 flex items-center gap-3">
        <button
          onClick={save}
          className="rounded-full bg-burnt px-6 py-3 text-sm font-bold text-white shadow-[0_12px_26px_-10px_rgba(244,91,22,0.55)] transition-all hover:bg-burnt-deep active:scale-[0.98]"
        >
          Save policy
        </button>
        <span className={`inline-flex items-center gap-1 text-sm font-bold text-emerald-deep transition-opacity ${p.saved ? "opacity-100" : "opacity-0"}`}>
          <ShieldCheck size={14} /> {saving ? "Saving…" : "Sealed to ledger"}
        </span>
      </div>
    </div>
  );
}

/* ── shell ─────────────────────────────────────────────────────────────── */

const NAV = [
  { k: "live", label: "Dashboard", icon: Home },
  { k: "recoveries", label: "Recoveries", icon: ArrowLeftRight },
  { k: "benchmark", label: "Benchmark", icon: Award },
  { k: "roi", label: "ROI Forecaster", icon: Coins },
  { k: "analytics", label: "Analytics", icon: TrendingUp },
  { k: "settings", label: "Settings", icon: Settings },
];

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("suraksha_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [portalMode, setPortalMode] = useState(() => {
    return localStorage.getItem("suraksha_portal_mode") || "demo";
  });
  const [page, setPage] = useState("live");
  const [cases, setCases] = useState(seed);
  const [stats, setStats] = useState(metrics);
  const [policy, setPolicy] = useState(null);
  const [sim, setSim] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [seq, setSeq] = useState(0);
  const [showCinematicIntro, setShowCinematicIntro] = useState(true);

  const switchPortalMode = (mode) => {
    setPortalMode(mode);
    localStorage.setItem("suraksha_portal_mode", mode);
  };

  // hydrate from the FastAPI backend on boot; fall back to seed offline
  useEffect(() => {
    api.hydrate().then(({ online, cases: liveCases, stats: liveStats, policy: livePolicy }) => {
      if (!online || !liveCases?.length) return;
      setCases(liveCases);
      if (liveStats) setStats(liveStats);
      if (livePolicy) setPolicy(livePolicy);
    });
  }, []);

  const fire = async (s) => {
    setSim(false);
    const res = await api.simulate(s.a, s.a !== "fraud");
    if (!res.online) {
      // offline fallback — deterministic seed behaviour so demo never breaks
      const n = 78433 + seq;
      setSeq(seq + 1);
      const fakeEv = {
        id: `ORD-${n}`,
        amt: [1499, 2499, 749, 3999][seq % 4],
        phone: "+91 ••••• " + (1000 + ((seq * 719) % 8999)),
        bank: ["HDFC", "SBI", "ICICI", "Axis"][s.a === "gateway" ? 0 : s.a === "otp" ? 1 : 2],
        a: s.a,
        s: s.out,
        at: "just now",
        ago: "just now",
      };
      setCases((c) => [fakeEv, ...c]);
      if (s.a !== "fraud") {
        setActiveChat(fakeEv);
      }
      return;
    }
    setCases((c) => [res.event, ...c]);
    if (res.metrics) setStats(res.metrics);
    if (s.a !== "fraud") {
      setActiveChat(res.event);
    }
  };

  const handleRecovered = (orderId, amount) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === orderId
          ? { ...c, s: "recovered", ago: "just now" }
          : c
      )
    );
    setStats((prev) => ({
      ...prev,
      recovered: prev.recovered + 1,
      revenue: prev.revenue + amount,
      captureRate: Math.round(((prev.recovered + 1) / Math.max(prev.failed, 1)) * 100 * 10) / 10,
    }));
  };

  const fireScenario = (archetype) => {
    const simMap = {
      gateway: { a: "gateway", d: "HDFC switch timeout → 504", out: "recovered" },
      otp: { a: "otp", d: "3DS session expired", out: "sent" },
      limit: { a: "limit", d: "UPI daily ceiling ₹1,00,000", out: "wait" },
      fraud: { a: "fraud", d: "Stolen card pattern", out: "aborted" },
    };
    fire(simMap[archetype] || simMap.gateway);
  };

  if (showCinematicIntro) {
    return (
      <CinematicIntro
        onComplete={() => setShowCinematicIntro(false)}
        onDirectLaunch={(targetMode) => {
          if (!user) {
            const demoUser = {
              name: "Aarav Textiles",
              email: "aarav@textiles.in",
              gmv: "₹50L monthly GMV",
              role: targetMode === "merchant" ? "Store Owner & Operator" : "Pitch Demo Sandbox",
              store_id: "MID-78432",
            };
            localStorage.setItem("suraksha_user", JSON.stringify(demoUser));
            setUser(demoUser);
          }
          switchPortalMode(targetMode);
          setShowCinematicIntro(false);
        }}
      />
    );
  }

  if (!user) {
    return (
      <AuthPage
        onLoginSuccess={(authenticatedUser, targetMode) => {
          setUser(authenticatedUser);
          if (targetMode) switchPortalMode(targetMode);
        }}
        onOpenIntro={() => setShowCinematicIntro(true)}
      />
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("suraksha_token");
    localStorage.removeItem("suraksha_user");
    setUser(null);
  };

  return (
    <div className="relative flex min-h-screen overflow-x-clip bg-ivory text-ink">
      {/* decorative blobs (behind all content) */}
      <BlobBottom />
      <BlobRight />

      {/* rail */}
      <aside className="sticky top-0 z-10 flex h-screen w-[236px] shrink-0 flex-col border-r border-sand/70 bg-ivory/60 backdrop-blur-2xl backdrop-saturate-[180%]">
        <div className="flex items-center gap-3 px-6 pt-6">
          <Mark />
          <div>
            <p className="text-[17px] font-extrabold tracking-tight leading-none">
              <span className="text-emerald-deep">Suraksha</span>
              <span className="text-burnt">Pay</span>
            </p>
            <p className="mt-1 text-[9px] font-bold tracking-[0.2em] uppercase text-ink-soft/65">
              AI Payment Recovery
            </p>
          </div>
        </div>

        <nav className="mt-8 space-y-1.5 px-3">
          {NAV.map(({ k, label, icon: Icon }) => (
            <button
              key={k}
              onClick={() => setPage(k)}
              className={`group relative flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-300 ${
                page === k
                  ? "bg-gradient-to-r from-emerald-deep via-[#0b6b52] to-emerald-deep text-ivory border-t border-t-white/30 border-x border-x-white/15 border-b border-b-black/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_10px_24px_-6px_rgba(6,78,59,0.55)] backdrop-blur-xl scale-[1.01]"
                  : "text-ink-soft hover:text-emerald-deep hover:bg-white/55 hover:backdrop-blur-md hover:border-white/70 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_4px_12px_rgba(6,78,59,0.03)] border border-transparent"
              }`}
            >
              <Icon size={17} className={page === k ? "text-ivory" : "text-ink-soft transition-colors group-hover:text-emerald-deep"} />
              <span>{label}</span>
              {page === k && (
                <span className="absolute right-3.5 size-1.5 rounded-full bg-burnt shadow-[0_0_8px_#F45B16]" />
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto px-6 pb-6">
          <div className="rounded-2xl border border-sand/70 bg-white/70 p-4">
            <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-emerald-deep">
              <ShieldCheck size={13} /> Ledger verified
            </p>
            <p className="mt-1.5 font-mono text-[10px] text-ink-soft">sha256 · sealed {cases.length} events</p>
          </div>
          <div className="mt-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-ivory">
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-ink">{user?.name || "Aarav Textiles"}</p>
                <p className="truncate text-[10px] font-medium text-ink-soft">{user?.gmv || "₹50L monthly GMV"}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out / Switch account"
              className="p-1.5 text-ink-soft hover:text-rust rounded-lg hover:bg-sand/60 transition-colors shrink-0"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* content */}
      <main className="relative z-10 min-w-0 flex-1">
        {/* Top Header with Dual Portal Mode Switcher */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-sand/70 bg-ivory/85 px-8 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {portalMode === "merchant" ? (
              <div className="flex items-center gap-2">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-emerald-600" />
                </span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-deep">
                  Production Store: Aarav Textiles
                </span>
                <span className="hidden sm:inline-flex items-center rounded-full bg-emerald-deep/10 px-2 py-0.5 text-[10px] font-bold text-emerald-deep">
                  ₹50L monthly GMV
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="relative flex size-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-burnt opacity-75" />
                  <span className="relative inline-flex size-2.5 rounded-full bg-burnt" />
                </span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-burnt">
                  Pitch &amp; Demo Sandbox
                </span>
                <span className="hidden sm:inline-flex items-center rounded-full bg-burnt/10 px-2 py-0.5 text-[10px] font-bold text-burnt">
                  Live Testbed Active
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Mode Switcher Pill */}
            <div className="flex items-center rounded-full border border-sand bg-white/90 p-1 shadow-2xs">
              <button
                onClick={() => switchPortalMode("merchant")}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
                  portalMode === "merchant"
                    ? "bg-emerald-deep text-white shadow-xs"
                    : "text-ink-soft hover:text-ink hover:bg-sand/30"
                }`}
                title="Switch to live production merchant console"
              >
                <Building2 size={13} />
                <span>Merchant Console</span>
              </button>

              <button
                onClick={() => switchPortalMode("demo")}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold transition-all ${
                  portalMode === "demo"
                    ? "bg-burnt text-white shadow-xs"
                    : "text-ink-soft hover:text-ink hover:bg-sand/30"
                }`}
                title="Switch to interactive pitch & simulation sandbox"
              >
                <Zap size={13} className={portalMode === "demo" ? "fill-white" : ""} />
                <span>Demo Lab</span>
              </button>
            </div>

            {portalMode === "demo" && (
              <button
                onClick={() => setCheckoutOpen(true)}
                className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-emerald-deep px-3.5 py-1 text-xs font-bold text-white shadow-xs hover:bg-[#064E3B] active:scale-95 transition-all"
                title="Open interactive customer checkout modal"
              >
                <ShoppingCart size={13} />
                <span>Test Checkout</span>
              </button>
            )}

            <button
              onClick={() => setShowCinematicIntro(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-sand bg-white/90 hover:bg-white px-3 py-1 text-xs font-bold text-ink-soft hover:text-emerald-deep shadow-2xs hover:border-emerald-deep/40 transition-all active:scale-95"
              title="Replay GSAP Cinematic Scroll Intro"
            >
              <Sparkles size={13} className="text-burnt" />
              <span className="hidden sm:inline">Cinematic Intro</span>
            </button>
          </div>
        </header>

        {page === "live" && (
          <Dashboard
            cases={cases}
            stats={stats}
            portalMode={portalMode}
            onOpenSim={() => setSim(true)}
            onOpenCheckout={() => setCheckoutOpen(true)}
            onOpenChat={(c) => {
              const target = c || cases.find((item) => item.s !== "recovered" && item.s !== "aborted") || cases[1] || cases[0];
              setActiveChat(target);
            }}
            onFireScenario={fireScenario}
            onNavigateTab={(k) => setPage(k)}
            go={() => setPage("recoveries")}
          />
        )}
        {page === "recoveries" && (
          <Recoveries
            cases={cases}
            onOpenChat={(c) => setActiveChat(c)}
          />
        )}
        {page === "benchmark" && <BenchmarkView />}
        {page === "roi" && <ROICalculatorView />}
        {page === "analytics" && <Analytics cases={cases} stats={stats} />}
        {page === "settings" && <SettingsPage policy={policy} />}
      </main>

      {sim && <Simulate onClose={() => setSim(false)} onFire={fire} />}

      {checkoutOpen && (
        <DemoCheckoutModal
          onClose={() => setCheckoutOpen(false)}
          onTriggerFailure={(archetype, amount) => {
            // 1. Close checkout modal instantly
            setCheckoutOpen(false);

            // 2. Build the failed order
            const n = 78433 + seq;
            setSeq((s) => s + 1);
            const orderId = `ORD-${n}`;
            const bankName = archetype === "gateway" ? "HDFC" : archetype === "otp" ? "SBI" : "ICICI";

            const defaultMsg =
              archetype === "otp"
                ? `Hi! Order ${orderId} (Noise Smartwatch - ${inr(amount)}) me OTP time par nahi mila tha, isliye payment fail hua. Ab OTP ki zaroorat nahi — neeche 1-tap UPI se bina delay turant complete karein.`
                : archetype === "limit"
                ? `Hi! Order ${orderId} (Noise Smartwatch - ${inr(amount)}) me aaj ki UPI limit reach ho gayi thi. Is smart link se aap Netbanking ya Card se bina limit issue ke complete kar sakte hain.`
                : `Hi! Order ${orderId} (Noise Smartwatch - ${inr(amount)}) ka payment HDFC bank server timeout ki wajah se fail hua tha. Aapke paise bilkul safe hain. Neeche 1-tap UPI se turant confirm karein — link 15 min valid hai.`;

            const failedEvent = {
              id: orderId,
              amt: amount,
              phone: "+91 ••••• 8421",
              bank: bankName,
              a: archetype,
              s: "sent",
              at: "just now",
              ago: "just now",
              hash: "7f" + orderId.toLowerCase() + "c2a9",
              outreach: {
                message: defaultMsg,
                discount: 0,
                link: `rzp.io/i/${orderId.slice(-4).toLowerCase()}k2`,
                scheduled_for: "",
              },
              trace: [
                { t: "00:00", stage: "Webhook", d: `payment.failed · ${bankName} · ${archetype === "gateway" ? "ETX-504" : archetype === "otp" ? "3DS-TMO" : "UPI-LIM"}` },
                { t: "00:02", stage: "Triage", d: `archetype ${archetype} · confidence 0.98` },
                { t: "00:04", stage: "Gate", d: "policy pass · TRAI window open · cap ok" },
                { t: "00:07", stage: "Outreach", d: `WhatsApp · 1-tap UPI · rzp.io/i/${orderId.slice(-4).toLowerCase()}k2` },
                { t: "—", stage: "State", d: "link opened · awaiting intent" },
              ],
            };

            // 3. Immediately update cases and open WhatsApp drawer!
            setCases((prev) => [failedEvent, ...prev]);
            setActiveChat(failedEvent);

            // 4. Update metrics
            setStats((prev) => ({
              ...prev,
              failed: prev.failed + 1,
            }));

            // 5. Notify backend in background
            api.simulate(archetype, false).then((res) => {
              if (res.online && res.metrics) setStats(res.metrics);
            }).catch(() => {});
          }}
          onSuccess={async (amount) => {
            setCheckoutOpen(false);
            const n = 78433 + seq;
            setSeq((s) => s + 1);
            const recoveredEvent = {
              id: `ORD-${n}`,
              amt: amount,
              phone: "+91 ••••• 8421",
              bank: "HDFC",
              a: "gateway",
              s: "recovered",
              at: "just now",
              ago: "just now",
            };
            setCases((c) => [recoveredEvent, ...c]);
            setStats((prev) => ({
              ...prev,
              failed: prev.failed + 1,
              recovered: prev.recovered + 1,
              revenue: prev.revenue + amount,
              captureRate: Math.round(((prev.recovered + 1) / (prev.failed + 1)) * 100 * 10) / 10,
            }));
          }}
        />
      )}

      {activeChat && (
        <WhatsAppChatDrawer
          item={activeChat}
          onClose={() => setActiveChat(null)}
          onRecovered={handleRecovered}
        />
      )}
    </div>
  );
}
