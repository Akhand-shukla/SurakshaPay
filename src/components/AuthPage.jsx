import { useState } from "react";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Building2,
  Check,
  Sparkles,
} from "lucide-react";
import { api } from "../api.js";

export default function AuthPage({ onLoginSuccess, onOpenIntro }) {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [email, setEmail] = useState("aarav@textiles.in");
  const [password, setPassword] = useState("••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [name, setName] = useState("Aarav Textiles");
  const [gmv, setGmv] = useState("₹50L monthly GMV");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "signin") {
        const res = await api.login(email, password, remember);
        if (res.token) {
          localStorage.setItem("suraksha_token", res.token);
          localStorage.setItem("suraksha_user", JSON.stringify(res.user));
          onLoginSuccess(res.user);
        }
      } else {
        const res = await api.register(name, email, password, gmv);
        if (res.token) {
          localStorage.setItem("suraksha_token", res.token);
          localStorage.setItem("suraksha_user", JSON.stringify(res.user));
          onLoginSuccess(res.user);
        }
      }
    } catch (err) {
      setError("Authentication failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const res = await api.googleAuth(
        "merchant.aarav@gmail.com",
        "Aarav Textiles"
      );
      if (res.token) {
        localStorage.setItem("suraksha_token", res.token);
        localStorage.setItem("suraksha_user", JSON.stringify(res.user));
        onLoginSuccess(res.user);
      }
    } catch {
      onLoginSuccess({
        name: "Aarav Textiles",
        email: "merchant.aarav@gmail.com",
        gmv: "₹50L monthly GMV",
        role: "Google Verified Merchant",
        store_id: "MID-78432",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (merchantName, merchantEmail, merchantGmv, targetMode = "demo") => {
    setEmail(merchantEmail);
    setName(merchantName);
    setLoading(true);
    localStorage.setItem("suraksha_portal_mode", targetMode);
    try {
      const res = await api.login(merchantEmail, "demo123", true);
      localStorage.setItem("suraksha_token", res.token);
      localStorage.setItem("suraksha_user", JSON.stringify(res.user));
      onLoginSuccess(res.user, targetMode);
    } catch {
      const fallbackUser = {
        name: merchantName,
        email: merchantEmail,
        gmv: merchantGmv,
        role: targetMode === "merchant" ? "Store Owner & Operator" : "Pitch Demo Sandbox",
        store_id: "MID-78432",
      };
      localStorage.setItem("suraksha_user", JSON.stringify(fallbackUser));
      onLoginSuccess(fallbackUser, targetMode);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-ivory text-ink overflow-x-hidden">
      {/* Top right decorative fluid wave (matches reference mockup) */}
      <svg
        className="pointer-events-none absolute right-0 top-0 hidden lg:block opacity-90 z-0"
        width="340"
        height="260"
        viewBox="0 0 340 260"
        fill="none"
        aria-hidden
      >
        <path
          d="M0 0 C140 50 260 10 340 110 L340 0 Z"
          fill="#DCEFE3"
          opacity="0.85"
        />
        <path
          d="M80 0 C180 60 280 20 340 80 L340 0 Z"
          fill="#064E3B"
        />
        <path
          d="M140 0 C220 65 300 30 340 50"
          stroke="#F45B16"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </svg>

      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[460px_1fr] xl:grid-cols-[510px_1fr]">
        {/* ── LEFT COLUMN: Dark Obsidian Emerald Auth Portal ─────────── */}
        <div className="relative flex flex-col justify-between bg-[#04281E] px-8 py-8 md:px-12 md:py-10 text-white shadow-2xl z-10">
          {/* Organic Curved Boundary into Right Side (Eliminates straight line, matches reference mockup) */}
          <svg
            className="pointer-events-none absolute -right-[56px] xl:-right-[84px] top-0 h-full w-[58px] xl:w-[86px] z-30 hidden lg:block overflow-visible"
            viewBox="0 0 100 1000"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            {/* Ambient drop shadow behind the curve to cast physical depth onto ivory */}
            <path
              d="M 0,0 C 35,130 85,250 92,390 C 98,520 62,660 50,780 C 40,880 65,960 0,1000"
              stroke="rgba(6,78,59,0.22)"
              strokeWidth="10"
              className="blur-[6px]"
              fill="none"
            />
            {/* Main solid curved facet */}
            <path
              d="M 0,0 C 35,130 85,250 92,390 C 98,520 62,660 50,780 C 40,880 65,960 0,1000 L 0,1000 Z"
              fill="#04281E"
            />
            {/* Subtle specular rim light along curve */}
            <path
              d="M 0,0 C 35,130 85,250 92,390 C 98,520 62,660 50,780 C 40,880 65,960 0,1000"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
          {/* Background liquid glow effects */}
          <div className="pointer-events-none absolute -left-20 -top-20 size-80 rounded-full bg-[#0B6B52]/30 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 size-72 rounded-full bg-[#F45B16]/15 blur-3xl" />

          {/* Top Brand Header */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/suraksha-logo.png"
                alt="SurakshaPay Logo"
                className="size-8 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
              />
              <div>
                <p className="text-[17px] font-extrabold tracking-tight leading-none text-white">
                  Suraksha<span className="text-burnt">Pay</span>
                </p>
                <p className="mt-1 text-[8.5px] font-bold tracking-[0.24em] uppercase text-white/50">
                  Secure Access Portal
                </p>
              </div>
            </div>

            {onOpenIntro && (
              <button
                type="button"
                onClick={onOpenIntro}
                className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-3 py-1.5 text-[11px] font-bold text-emerald-300 transition-all hover:scale-105 active:scale-95"
                title="Watch GSAP Cinematic Scroll Intro"
              >
                <Sparkles size={12} className="text-burnt" />
                <span>Cinematic Intro</span>
              </button>
            )}
          </div>

          {/* Center Form Container */}
          <div className="relative z-10 my-auto py-8">
            <h2 className="text-[32px] font-extrabold tracking-tight text-white leading-tight">
              {mode === "signin" ? "Welcome back." : "Create Merchant Account"}
            </h2>
            <p className="mt-2 text-xs text-white/65 leading-relaxed">
              {mode === "signin"
                ? "Sign in to manage your payment recovery operations."
                : "Join top D2C merchants recovering lost revenue automatically."}
            </p>

            {/* Glassmorphic Form Card */}
            <form
              onSubmit={handleSubmit}
              className="mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-6 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.12),0_20px_40px_rgba(0,0,0,0.5)]"
            >
              {error && (
                <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                  {error}
                </div>
              )}

              {mode === "signup" && (
                <div className="mb-4">
                  <label className="flex items-center gap-1.5 text-xs font-bold text-white/80">
                    <Building2 size={13} className="text-burnt" /> Business Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. My Brand Store"
                    className="mt-1.5 w-full rounded-xl border border-white/[0.12] bg-white/[0.05] px-3.5 py-2.5 text-xs text-white placeholder-white/30 transition-colors focus:border-burnt focus:bg-white/[0.08] focus:outline-none"
                  />
                </div>
              )}

              {/* Email Input */}
              <div className="mb-4">
                <label className="flex items-center gap-1.5 text-xs font-bold text-white/80">
                  <Mail size={13} className="text-burnt" /> Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="mt-1.5 w-full rounded-xl border border-white/[0.12] bg-white/[0.05] px-3.5 py-2.5 text-xs text-white placeholder-white/30 transition-colors focus:border-burnt focus:bg-white/[0.08] focus:outline-none"
                />
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <label className="flex items-center gap-1.5 text-xs font-bold text-white/80">
                  <Lock size={13} className="text-burnt" /> Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-white/[0.12] bg-white/[0.05] px-3.5 py-2.5 pr-10 text-xs text-white placeholder-white/30 transition-colors focus:border-burnt focus:bg-white/[0.08] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-white/50 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {mode === "signin" && (
                <div className="mb-5 flex items-center justify-between text-[11px]">
                  <label className="flex items-center gap-2 text-white/70 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="rounded border-white/20 bg-white/10 accent-burnt"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => alert("Password reset link sent to demo email!")}
                    className="font-bold text-burnt hover:text-burnt-deep transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-burnt py-3 text-[13px] font-bold text-white shadow-[0_12px_24px_-8px_rgba(244,91,22,0.65)] transition-all hover:bg-burnt-deep hover:scale-[1.01] active:scale-[0.98]"
              >
                <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
                <ArrowRight size={15} />
              </button>

              {/* Google Button (Clean seamless styling without cluttered divider) */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="mt-3 flex w-full items-center justify-center gap-2.5 rounded-full border border-white/20 bg-white py-2.5 text-xs font-bold text-ink shadow-sm transition-all hover:bg-white/95 active:scale-[0.98]"
              >
                {/* Official Google Multi-color Icon */}
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Dual Portal Quick Launch Options */}
              <div className="mt-4 pt-3.5 border-t border-white/[0.08] space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-white/50">
                  <span>Instant 1-Click Launch:</span>
                  <span className="text-burnt">Pitch Ready</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin("Aarav Textiles", "aarav@textiles.in", "₹50L monthly GMV", "merchant")}
                    className="group flex flex-col items-center justify-center gap-1 rounded-xl border border-white/[0.12] bg-white/[0.05] hover:bg-white/[0.12] hover:border-emerald-400/40 p-2 text-center transition-all hover:scale-[1.02]"
                    title="Open live production merchant dashboard"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <Building2 size={13} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span>Merchant</span>
                    </div>
                    <span className="text-[9.5px] text-white/50">Live Store Track</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDemoLogin("Aarav Textiles", "aarav@textiles.in", "₹50L monthly GMV", "demo")}
                    className="group flex flex-col items-center justify-center gap-1 rounded-xl border border-burnt/30 bg-burnt/15 hover:bg-burnt/25 hover:border-burnt p-2 text-center transition-all hover:scale-[1.02]"
                    title="Launch interactive failure simulation & WhatsApp recovery lab"
                  >
                    <div className="flex items-center gap-1.5 font-bold text-white">
                      <Zap size={13} className="text-burnt group-hover:scale-110 transition-transform fill-burnt" />
                      <span>Demo Lab</span>
                    </div>
                    <span className="text-[9.5px] text-burnt/90 font-medium">Checkout &amp; WhatsApp</span>
                  </button>
                </div>
              </div>
            </form>

            {/* Toggle Signin / Signup */}
            <p className="mt-5 text-center text-xs text-white/60">
              {mode === "signin" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="font-bold text-burnt hover:underline transition-colors"
                  >
                    Create Account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("signin")}
                    className="font-bold text-burnt hover:underline transition-colors"
                  >
                    Sign In
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Bottom Trust Badge */}
          <div className="relative z-10 flex items-center gap-2 text-[11px] text-white/45 border-t border-white/[0.08] pt-4">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>256-bit SSL encrypted · RBI &amp; TRAI compliant access</span>
          </div>

          {/* Bottom Left Organic Wave */}
          <svg
            className="pointer-events-none absolute -bottom-1 -left-1 hidden md:block opacity-45"
            width="220"
            height="140"
            viewBox="0 0 220 140"
            fill="none"
            aria-hidden
          >
            <path
              d="M-20 80 C40 30 110 90 180 50 C210 30 220 50 240 30 L240 160 L-20 160 Z"
              fill="#064E3B"
            />
            <path
              d="M-20 100 C50 60 130 110 200 80 L200 160 L-20 160 Z"
              fill="#F45B16"
            />
          </svg>
        </div>

        {/* ── RIGHT COLUMN: Warm Ivory Hero Presentation ────────────── */}
        <div className="relative flex flex-col justify-between px-8 py-10 md:px-12 lg:pl-20 xl:pl-24 lg:pr-14 lg:py-12 z-10">
          {/* Top Live Ticker Bar (Syncs with SurakshaPay theme, fills space with purpose) */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-sand/80 bg-white/80 px-3 py-1 shadow-2xs backdrop-blur-md">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-deep">
                  SurakshaPay Intercept Active
                </span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-sand/70 bg-white/70 px-3 py-1 text-[11px] font-bold text-ink shadow-2xs">
                <span className="text-burnt font-extrabold">+376.9%</span>
                <span className="text-ink-soft">Relative Lift</span>
              </div>
            </div>

            {onOpenIntro && (
              <button
                type="button"
                onClick={onOpenIntro}
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-emerald-deep/20 bg-emerald-deep/8 hover:bg-emerald-deep/15 px-3 py-1 text-[11px] font-bold text-emerald-deep shadow-2xs transition-all hover:scale-105 active:scale-95"
              >
                <Sparkles size={12} className="text-burnt" />
                <span>Watch GSAP Intro</span>
              </button>
            )}
          </div>

          {/* Hero Typography & Mission Brief */}
          <div className="max-w-xl">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#09372A]/75">
              AI-Powered Payment Recovery
            </p>
            <h1 className="mt-3 text-[46px] sm:text-[54px] lg:text-[62px] font-extrabold leading-[1.0] tracking-[-0.035em] text-[#09372A]">
              Recover lost
              <br />
              revenue,{" "}
              <span className="text-burnt">automatically.</span>
            </h1>
            <p className="mt-4 max-w-lg text-[15px] sm:text-[16px] leading-relaxed text-ink-soft">
              Turn failed payments into successful orders with AI, smart retries
              and personalized customer outreach.
            </p>

            {/* Quick Micro-Trust Badges */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#064E3B]/8 px-2.5 py-1 text-[11px] font-bold text-emerald-deep">
                <Check size={12} strokeWidth={3} /> Instant 1-tap UPI
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#064E3B]/8 px-2.5 py-1 text-[11px] font-bold text-emerald-deep">
                <Check size={12} strokeWidth={3} /> TRAI Quiet Hours
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-[#064E3B]/8 px-2.5 py-1 text-[11px] font-bold text-emerald-deep">
                <Check size={12} strokeWidth={3} /> Cryptographic SHA-256
              </span>
            </div>
          </div>

          {/* Center 3D Credit Card Artwork (Exact authentic visual asset directly from uploaded mockup) */}
          <div className="relative my-3 flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[480px] lg:max-w-[540px] xl:max-w-[590px] transition-transform duration-500 hover:scale-[1.015]">
              <img
                src="/hero-card-original.png"
                srcSet="/hero-card-original.png 1x, /hero-card-original@2x.png 2x"
                alt="SurakshaPay AI Payment Recovery"
                className="relative z-10 w-full h-auto object-contain pointer-events-none select-none drop-shadow-[0_20px_40px_rgba(6,78,59,0.12)]"
                draggable="false"
              />
            </div>
          </div>

          {/* Bottom 3 Feature Cards (Rich, elevated glass cards that harmonize with the theme) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-6 border-t border-sand/70">
            <div className="flex items-center gap-3 rounded-2xl border border-sand/80 bg-white/80 p-3.5 shadow-[0_4px_16px_-4px_rgba(38,51,46,0.06)] backdrop-blur-md hover:border-emerald-deep/40 transition-all group">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-sage text-emerald-deep shadow-2xs group-hover:scale-105 transition-transform">
                <Zap size={18} className="fill-emerald-deep" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-extrabold text-ink">Intelligent Recovery</p>
                <p className="truncate text-[11px] font-medium text-ink-soft">1-tap biometric UPI</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-sand/80 bg-white/80 p-3.5 shadow-[0_4px_16px_-4px_rgba(38,51,46,0.06)] backdrop-blur-md hover:border-burnt/40 transition-all group">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-clay text-burnt shadow-2xs group-hover:scale-105 transition-transform">
                <ShieldCheck size={18} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-extrabold text-ink">Secure Transactions</p>
                <p className="truncate text-[11px] font-medium text-ink-soft">TRAI quiet-hours guard</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-sand/80 bg-white/80 p-3.5 shadow-[0_4px_16px_-4px_rgba(38,51,46,0.06)] backdrop-blur-md hover:border-emerald-deep/40 transition-all group">
              <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-sage text-emerald-deep shadow-2xs group-hover:scale-105 transition-transform">
                <BarChart3 size={18} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-extrabold text-ink">Real-time Monitoring</p>
                <p className="truncate text-[11px] font-medium text-ink-soft">SHA-256 sealed audit</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
