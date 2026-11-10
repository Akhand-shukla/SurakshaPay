import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  ShieldAlert,
  Zap,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Cpu,
  RefreshCw,
  Sparkles,
  ChevronDown,
  Volume2,
  VolumeX,
  Building2,
  Check,
  CreditCard,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function CinematicIntro({ onComplete, onDirectLaunch }) {
  const containerRef = useRef(null);
  const pinTargetRef = useRef(null);
  const canvasRef = useRef(null);
  const progressRef = useRef(0);
  const lenisRef = useRef(null);
  const audioCtxRef = useRef(null);
  const lastPhaseRef = useRef(0);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [, setCardImageLoaded] = useState(false);
  const cardImgRef = useRef(null);

  // Preload authentic 3D card image
  useEffect(() => {
    const img = new Image();
    img.src = "/hero-card-original@2x.png";
    img.onload = () => {
      cardImgRef.current = img;
      setCardImageLoaded(true);
    };
    img.onerror = () => {
      const fallback = new Image();
      fallback.src = "/hero-card-3d.png";
      fallback.onload = () => {
        cardImgRef.current = fallback;
        setCardImageLoaded(true);
      };
    };
  }, []);

  // Web Audio Procedural Telemetry Synthesizer
  const playSoundCue = useCallback((phase) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      if (phase === 1) {
        // Warning / failure telemetry beep
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.35);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (phase === 2) {
        // Neural intercept high-tech sweep
        osc.type = "sine";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.45);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (phase === 3) {
        // Settlement harmonic chime
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      }
    } catch {
      // AudioContext unavailable or blocked
    }
  }, [soundEnabled]);

  // Keyboard shortcut listener (Escape skips, ArrowDown advances)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (onComplete) onComplete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onComplete]);

  // Initialize Lenis + GSAP ScrollTrigger
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "+=3200",
        pin: pinTargetRef.current,
        pinSpacing: true,
        scrub: 0.6,
        onUpdate: (self) => {
          const p = Math.max(0, Math.min(1, self.progress));
          progressRef.current = p;
          setScrollProgress(p);

          // Phase audio cues
          let currentPhase = 0;
          if (p >= 0.08 && p < 0.32) currentPhase = 1;
          else if (p >= 0.35 && p < 0.65) currentPhase = 2;
          else if (p >= 0.68) currentPhase = 3;

          if (currentPhase !== lastPhaseRef.current && currentPhase > 0) {
            playSoundCue(currentPhase);
            lastPhaseRef.current = currentPhase;
          }
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [playSoundCue]);

  // Canvas 60/120fps Rendering Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Particle field network
    const particleCount = Math.min(Math.floor(window.innerWidth / 15), 75);
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      size: Math.random() * 2 + 1,
      phase: Math.random() * Math.PI * 2,
    }));

    let clock = 0;

    const render = () => {
      clock += 0.02;
      const p = progressRef.current; // 0.0 to 1.0

      ctx.clearRect(0, 0, width, height);

      // ── 1. Dynamic Atmosphere Gradient ────────────────────────────────────
      const isMobile = width < 768;
      const targetCenterX = isMobile ? width * 0.5 : width * 0.64;
      const targetCenterY = isMobile ? height * 0.42 : height * 0.5;

      let bgGrad = ctx.createRadialGradient(
        targetCenterX,
        targetCenterY,
        80,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.85
      );

      if (p < 0.35) {
        // Phase 1: Burnt Amber / Red Alert Failure Ambience
        const alertIntensity = 1 - p / 0.35;
        bgGrad.addColorStop(0, `rgba(244, 91, 22, ${0.14 * alertIntensity})`);
        bgGrad.addColorStop(0.4, `rgba(217, 74, 15, ${0.07 * alertIntensity})`);
        bgGrad.addColorStop(1, "#030c08");
      } else if (p < 0.65) {
        // Phase 2: Electric Emerald Intercept
        const interceptP = (p - 0.35) / 0.3;
        bgGrad.addColorStop(0, `rgba(14, 120, 91, ${0.24 * interceptP})`);
        bgGrad.addColorStop(0.5, `rgba(6, 78, 59, ${0.15 * interceptP})`);
        bgGrad.addColorStop(1, "#02120b");
      } else {
        // Phase 3: Golden-Emerald Settlement Vault
        bgGrad.addColorStop(0, "rgba(52, 211, 153, 0.22)");
        bgGrad.addColorStop(0.35, "rgba(6, 78, 59, 0.30)");
        bgGrad.addColorStop(0.7, "rgba(244, 91, 22, 0.09)");
        bgGrad.addColorStop(1, "#020f08");
      }

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // ── 2. Perspective Network Plane & Grid ───────────────────────────────
      ctx.save();
      ctx.strokeStyle =
        p < 0.35
          ? "rgba(244, 91, 22, 0.07)"
          : p < 0.65
          ? "rgba(16, 185, 129, 0.09)"
          : "rgba(52, 211, 153, 0.12)";
      ctx.lineWidth = 1;

      const horizonY = height * 0.74;
      for (let i = 0; i < 11; i++) {
        const y = horizonY + Math.pow(i / 10, 1.8) * (height - horizonY);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const vanishingX = targetCenterX;
      const vanishingY = targetCenterY - 40;
      for (let x = -width * 0.2; x <= width * 1.2; x += width / 14) {
        ctx.beginPath();
        ctx.moveTo(vanishingX, vanishingY);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      ctx.restore();

      // ── 3. Particle Flow & Neural Synapses ────────────────────────────────
      particles.forEach((pt, i) => {
        pt.x += pt.vx;
        pt.y += pt.vy;
        if (pt.x < 0) pt.x = width;
        if (pt.x > width) pt.x = 0;
        if (pt.y < 0) pt.y = height;
        if (pt.y > height) pt.y = 0;

        const pulse = Math.sin(clock + pt.phase) * 0.5 + 0.5;

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size * (0.8 + pulse * 0.5), 0, Math.PI * 2);

        if (p < 0.32) {
          ctx.fillStyle = `rgba(244, 91, 22, ${0.25 + pulse * 0.35})`;
        } else if (p < 0.65) {
          ctx.fillStyle = `rgba(16, 185, 129, ${0.35 + pulse * 0.45})`;
        } else {
          ctx.fillStyle =
            i % 3 === 0
              ? `rgba(251, 191, 36, ${0.45 + pulse * 0.4})`
              : `rgba(52, 211, 153, ${0.5 + pulse * 0.4})`;
        }
        ctx.fill();

        for (let j = i + 1; j < Math.min(i + 4, particles.length); j++) {
          const p2 = particles[j];
          const dist = Math.hypot(pt.x - p2.x, pt.y - p2.y);
          if (dist < 110) {
            ctx.beginPath();
            ctx.strokeStyle =
              p < 0.35
                ? `rgba(244, 91, 22, ${(1 - dist / 110) * 0.16})`
                : `rgba(16, 185, 129, ${(1 - dist / 110) * 0.24})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      // ── 4. Central 3D Card & Neural Ring System ──────────────────────────
      let cardScale = 1.0;
      let cardRotY = 0;
      let cardRotX = 0;
      let cardRotZ = 0;

      if (p < 0.32) {
        const localP = p / 0.32;
        cardScale = 0.85 + localP * 0.15;
        cardRotY = 0.28 - localP * 0.12;
        cardRotX = 0.18 - Math.sin(clock * 1.5) * 0.03;
        cardRotZ = -0.06;
      } else if (p < 0.65) {
        const localP = (p - 0.32) / 0.33;
        cardScale = 1.0 + Math.sin(localP * Math.PI) * 0.08;
        cardRotY = (1 - localP) * 0.16 + Math.sin(clock * 2) * 0.03;
        cardRotX = 0.08 - localP * 0.06;
        cardRotZ = (1 - localP) * -0.06;
      } else {
        const localP = (p - 0.65) / 0.35;
        cardScale = 1.0 + Math.min(localP * 0.08, 0.12);
        cardRotY = Math.sin(clock * 1.2) * 0.04;
        cardRotX = -0.02 + Math.cos(clock * 1.1) * 0.02;
        cardRotZ = 0;
      }

      // Draw Rotating Holographic Rings around the Card
      ctx.save();
      ctx.translate(targetCenterX, targetCenterY);

      const ringCount = 3;
      for (let r = 0; r < ringCount; r++) {
        const ringRadius = (isMobile ? 140 : 210) + r * 38;
        const ringAngle = clock * (r % 2 === 0 ? 0.7 : -0.5) + (r * Math.PI) / 3;

        ctx.save();
        ctx.rotate(ringAngle);
        ctx.scale(1, 0.42);

        ctx.beginPath();
        ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);

        if (p < 0.32) {
          ctx.strokeStyle = `rgba(244, 91, 22, ${0.18 - r * 0.04})`;
          ctx.setLineDash([12, 18, 4, 18]);
        } else if (p < 0.65) {
          ctx.strokeStyle = `rgba(52, 211, 153, ${0.32 - r * 0.06})`;
          ctx.setLineDash([20, 10, 4, 14]);
        } else {
          ctx.strokeStyle = `rgba(16, 185, 129, ${0.38 - r * 0.07})`;
          ctx.setLineDash([40, 12, 8, 12]);
        }

        ctx.lineWidth = 1.5;
        ctx.stroke();

        const packetAngle = clock * 2.5 + (r * Math.PI) / 2;
        const px = Math.cos(packetAngle) * ringRadius;
        const py = Math.sin(packetAngle) * ringRadius;

        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle =
          p < 0.32
            ? "#F45B16"
            : p < 0.65
            ? "#34D399"
            : r === 0
            ? "#F59E0B"
            : "#10B981";
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 12;
        ctx.fill();

        ctx.restore();
      }
      ctx.restore();

      // Draw 3D Card Artwork
      const cardImg = cardImgRef.current;
      const baseCardWidth = isMobile ? 310 : Math.min(540, width * 0.42);
      const baseCardHeight = baseCardWidth * 0.62;

      ctx.save();
      ctx.translate(targetCenterX, targetCenterY);
      ctx.scale(cardScale, cardScale);
      ctx.rotate(cardRotZ);

      // Card Ambient Liquid Glow Drop Shadow
      const glowGrad = ctx.createRadialGradient(
        0,
        0,
        50,
        0,
        0,
        baseCardWidth * 0.72
      );
      if (p < 0.32) {
        glowGrad.addColorStop(0, "rgba(244, 91, 22, 0.35)");
        glowGrad.addColorStop(1, "rgba(244, 91, 22, 0)");
      } else if (p < 0.65) {
        glowGrad.addColorStop(0, "rgba(16, 185, 129, 0.48)");
        glowGrad.addColorStop(1, "rgba(6, 78, 59, 0)");
      } else {
        glowGrad.addColorStop(0, "rgba(52, 211, 153, 0.48)");
        glowGrad.addColorStop(0.6, "rgba(244, 91, 22, 0.16)");
        glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      }
      ctx.fillStyle = glowGrad;
      ctx.fillRect(
        -baseCardWidth * 0.8,
        -baseCardHeight * 0.8,
        baseCardWidth * 1.6,
        baseCardHeight * 1.6
      );

      if (cardImg && cardImg.complete) {
        ctx.drawImage(
          cardImg,
          -baseCardWidth / 2,
          -baseCardHeight / 2,
          baseCardWidth,
          baseCardHeight
        );
      } else {
        ctx.beginPath();
        const r = 20;
        const x = -baseCardWidth / 2;
        const y = -baseCardHeight / 2;
        const w = baseCardWidth;
        const h = baseCardHeight;
        ctx.roundRect(x, y, w, h, r);
        const cardGrad = ctx.createLinearGradient(x, y, x + w, y + h);
        cardGrad.addColorStop(0, "#064E3B");
        cardGrad.addColorStop(0.5, "#0E785B");
        cardGrad.addColorStop(1, "#F45B16");
        ctx.fillStyle = cardGrad;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Dynamic Laser Scan Line Sweeping Across the Card (Phase 2 & 3)
      if (p > 0.28 && p < 0.95) {
        const scanProgress = (clock * 1.2) % 1;
        const scanY =
          -baseCardHeight / 2 + scanProgress * baseCardHeight;

        ctx.save();
        ctx.beginPath();
        ctx.rect(
          -baseCardWidth / 2 + 10,
          -baseCardHeight / 2 + 10,
          baseCardWidth - 20,
          baseCardHeight - 20
        );
        ctx.clip();

        const laserGrad = ctx.createLinearGradient(
          0,
          scanY - 12,
          0,
          scanY + 12
        );
        laserGrad.addColorStop(0, "rgba(52, 211, 153, 0)");
        laserGrad.addColorStop(0.5, "rgba(52, 211, 153, 0.7)");
        laserGrad.addColorStop(1, "rgba(52, 211, 153, 0)");

        ctx.fillStyle = laserGrad;
        ctx.fillRect(
          -baseCardWidth / 2,
          scanY - 12,
          baseCardWidth,
          24
        );

        ctx.beginPath();
        ctx.moveTo(-baseCardWidth / 2, scanY);
        ctx.lineTo(baseCardWidth / 2, scanY);
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 1.5;
        ctx.shadowColor = "#34D399";
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.restore();
      }

      // Specular Rim Light Sweep
      const sweepX =
        -baseCardWidth +
        ((clock * 0.6) % 1.6) * baseCardWidth * 1.5;
      ctx.save();
      ctx.beginPath();
      ctx.rect(
        -baseCardWidth / 2,
        -baseCardHeight / 2,
        baseCardWidth,
        baseCardHeight
      );
      ctx.clip();
      const sweepGrad = ctx.createLinearGradient(
        sweepX,
        -baseCardHeight / 2,
        sweepX + 90,
        baseCardHeight / 2
      );
      sweepGrad.addColorStop(0, "rgba(255,255,255,0)");
      sweepGrad.addColorStop(0.5, "rgba(255,255,255,0.22)");
      sweepGrad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = sweepGrad;
      ctx.fillRect(
        sweepX,
        -baseCardHeight / 2,
        90,
        baseCardHeight
      );
      ctx.restore();

      ctx.restore(); // restore 3D card coordinate system

      // ── 5. Floating Telemetry Holographic Chips ──────────────────────────
      if (p < 0.35) {
        const chipX = targetCenterX + (isMobile ? -90 : 60);
        const chipY = targetCenterY - (isMobile ? 115 : 135);

        ctx.save();
        ctx.translate(chipX, chipY);
        ctx.fillStyle = "rgba(244, 91, 22, 0.18)";
        ctx.strokeStyle = "rgba(244, 91, 22, 0.65)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(-10, -14, 215, 52, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#FF7A38";
        ctx.font = "bold 10px 'JetBrains Mono', monospace";
        ctx.fillText("! GATEWAY_DROPOUT_504", 4, 4);
        ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
        ctx.font = "11px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText("HDFC Switch Timeout (4,200ms)", 4, 24);
        ctx.restore();
      } else if (p >= 0.35 && p < 0.65) {
        const chipX = targetCenterX + (isMobile ? -90 : 70);
        const chipY = targetCenterY - (isMobile ? 125 : 145);

        ctx.save();
        ctx.translate(chipX, chipY);
        ctx.fillStyle = "rgba(6, 78, 59, 0.45)";
        ctx.strokeStyle = "rgba(52, 211, 153, 0.65)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(-10, -14, 225, 52, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#34D399";
        ctx.font = "bold 10px 'JetBrains Mono', monospace";
        ctx.fillText("✦ SENTINEL TRIAGE · 420ms", 4, 4);
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.font = "11px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText("Synthesizing Dynamic UPI Route", 4, 24);
        ctx.restore();
      } else if (p >= 0.65) {
        const chipX = targetCenterX + (isMobile ? -90 : 60);
        const chipY = targetCenterY - (isMobile ? 130 : 150);

        ctx.save();
        ctx.translate(chipX, chipY);
        ctx.fillStyle = "rgba(6, 78, 59, 0.65)";
        ctx.strokeStyle = "rgba(52, 211, 153, 0.85)";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.roundRect(-10, -14, 235, 54, 10);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#34D399";
        ctx.font = "bold 10px 'JetBrains Mono', monospace";
        ctx.fillText("✓ SETTLED · ₹2,499 RESTORED", 4, 4);
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.font = "11px 'Plus Jakarta Sans', sans-serif";
        ctx.fillText("1-Tap WhatsApp Verified · SHA-256", 4, 25);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Storytelling Window Progress Math (Rule I: 8-27%, 35-55%, 68-92%)
  const getWindowOpacity = useCallback((p, start, end, fadeBuffer = 0.05) => {
    if (p < start - fadeBuffer || p > end + fadeBuffer) return 0;
    if (p < start) return (p - (start - fadeBuffer)) / fadeBuffer;
    if (p > end) return ((end + fadeBuffer) - p) / fadeBuffer;
    return 1;
  }, []);

  const op1 = getWindowOpacity(scrollProgress, 0.08, 0.27, 0.04);
  const op2 = getWindowOpacity(scrollProgress, 0.35, 0.55, 0.04);
  const op3 = getWindowOpacity(scrollProgress, 0.68, 0.92, 0.04);
  const opTerminal = scrollProgress >= 0.93 ? (scrollProgress - 0.93) / 0.07 : 0;

  const handleSkip = () => {
    if (onComplete) onComplete();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#030c08] text-white overflow-hidden select-none"
    >
      {/* Pinned Stage Viewport */}
      <div
        ref={pinTargetRef}
        className="relative h-screen w-full overflow-hidden flex flex-col justify-between"
      >
        {/* Fullscreen Retina HTML5 Canvas Background */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-0 h-full w-full pointer-events-none"
        />

        {/* ── TOP HUD NAVIGATION ────────────────────────────────────────── */}
        <header className="relative z-20 flex items-center justify-between px-6 py-4 md:px-12 md:py-6 border-b border-white/[0.08] bg-[#020b06]/40 backdrop-blur-xl">
          {/* Brand Mark & Title */}
          <div className="flex items-center gap-3">
            <img
              src="/suraksha-logo.png"
              alt="SurakshaPay Logo"
              className="h-8 w-auto object-contain drop-shadow-[0_2px_12px_rgba(52,211,153,0.35)]"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-extrabold tracking-tight text-white">
                  Suraksha<span className="text-burnt">Pay</span>
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-extrabold tracking-wider text-emerald-400 border border-emerald-500/30">
                  AI RESCUE PIPELINE
                </span>
              </div>
              <p className="text-[9px] font-mono tracking-widest uppercase text-white/50">
                Razorpay Ecosystem · GSAP Interactive
              </p>
            </div>
          </div>

          {/* Central Progress Gauge */}
          <div className="hidden md:flex items-center gap-3 rounded-full border border-white/[0.12] bg-white/[0.03] px-4 py-1.5 backdrop-blur-2xl">
            <span className="text-[10px] font-mono font-bold tracking-wider text-white/70">
              SEQUENCE PROGRESS:
            </span>
            <div className="h-1.5 w-32 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-burnt via-emerald-400 to-emerald-300 transition-all duration-100"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
            <span className="font-mono text-xs font-extrabold text-emerald-400">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>

          {/* Top Right Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) playSoundCue(lastPhaseRef.current || 2);
              }}
              title={soundEnabled ? "Mute telemetry audio" : "Enable ambient telemetry audio"}
              className={`flex size-9 items-center justify-center rounded-full border transition-all ${
                soundEnabled
                  ? "border-emerald-400/50 bg-emerald-500/20 text-emerald-300"
                  : "border-white/[0.12] bg-white/[0.04] hover:bg-white/[0.1] text-white/70 hover:text-white"
              }`}
            >
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>

            <button
              onClick={handleSkip}
              className="group flex items-center gap-2 rounded-full border border-white/[0.16] bg-white/[0.06] hover:bg-white/[0.14] px-4 py-2 text-xs font-extrabold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Skip to Workspace</span>
              <ArrowRight
                size={13}
                className="transition-transform group-hover:translate-x-0.5 text-burnt"
              />
            </button>
          </div>
        </header>

        {/* ── STORYTELLING OVERLAYS (Rule I Windows) ────────────────────── */}
        <div className="relative z-10 flex-1 px-6 md:px-12 lg:px-20 pointer-events-none flex items-center">
          {/* ── Window 1: 8% – 27% (The Failure Surge) ────────────────── */}
          <div
            className="absolute left-6 md:left-14 lg:left-20 max-w-xl transition-all duration-300"
            style={{
              opacity: op1,
              transform: `translateY(${(1 - op1) * 24}px)`,
              pointerEvents: op1 > 0.4 ? "auto" : "none",
            }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-burnt/40 bg-burnt/15 px-3 py-1 shadow-sm backdrop-blur-md">
              <span className="size-2 rounded-full bg-burnt animate-ping" />
              <span className="text-[10px] font-mono font-extrabold tracking-widest uppercase text-burnt">
                PHASE 01 · 504 GATEWAY TIMEOUT
              </span>
            </div>

            <h2 className="mt-4 text-[38px] sm:text-[46px] lg:text-[54px] font-extrabold leading-[1.02] tracking-[-0.03em] text-white">
              ₹4,800 Crores
              <br />
              <span className="text-burnt">Lost Every Quarter.</span>
            </h2>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/75 max-w-lg">
              Across Indian e-commerce, 18% to 24% of checkout intents vanish
              into bank switch timeouts, UPI ceiling limits, and expired 3DS OTP
              sessions. To legacy payment processors, this revenue is gone forever.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <div className="rounded-xl border border-white/[0.12] bg-[#02130c]/80 px-3.5 py-2 backdrop-blur-md">
                <p className="text-[9.5px] font-mono uppercase tracking-wider text-white/50">Checkout Drop</p>
                <p className="text-sm font-extrabold text-burnt">23.4% Failed</p>
              </div>
              <div className="rounded-xl border border-white/[0.12] bg-[#02130c]/80 px-3.5 py-2 backdrop-blur-md">
                <p className="text-[9.5px] font-mono uppercase tracking-wider text-white/50">Primary Cause</p>
                <p className="text-sm font-extrabold text-white">Bank Switch 504</p>
              </div>
              <div className="rounded-xl border border-white/[0.12] bg-[#02130c]/80 px-3.5 py-2 backdrop-blur-md">
                <p className="text-[9.5px] font-mono uppercase tracking-wider text-white/50">Merchant Cost</p>
                <p className="text-sm font-extrabold text-white/90">₹1.8L / Day</p>
              </div>
            </div>
          </div>

          {/* ── Window 2: 35% – 55% (The AI Sentinel Intercept) ──────── */}
          <div
            className="absolute left-6 md:left-14 lg:left-20 max-w-xl transition-all duration-300"
            style={{
              opacity: op2,
              transform: `translateY(${(1 - op2) * 24}px)`,
              pointerEvents: op2 > 0.4 ? "auto" : "none",
            }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 shadow-sm backdrop-blur-md">
              <Sparkles size={12} className="text-emerald-400" />
              <span className="text-[10px] font-mono font-extrabold tracking-widest uppercase text-emerald-300">
                PHASE 02 · 420MS AUTONOMOUS INTERCEPT
              </span>
            </div>

            <h2 className="mt-4 text-[38px] sm:text-[46px] lg:text-[54px] font-extrabold leading-[1.02] tracking-[-0.03em] text-white">
              The AI Sentinel
              <br />
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-200 bg-clip-text text-transparent">
                Intervenes in 420ms.
              </span>
            </h2>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/75 max-w-lg">
              SurakshaPay decodes deep gateway error codes instantly. Our machine
              learning engine triages genuine card dropouts from transient switch
              delays, spinning up localized 1-tap fallback links with zero buyer
              friction.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <div className="rounded-xl border border-emerald-500/30 bg-[#021810]/85 px-3.5 py-2 backdrop-blur-md">
                <p className="text-[9.5px] font-mono uppercase tracking-wider text-emerald-400/70">Triage Speed</p>
                <p className="text-sm font-extrabold text-emerald-300">420ms</p>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-[#021810]/85 px-3.5 py-2 backdrop-blur-md">
                <p className="text-[9.5px] font-mono uppercase tracking-wider text-emerald-400/70">Resolution Path</p>
                <p className="text-sm font-extrabold text-white">Dynamic UPI Intent</p>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-[#021810]/85 px-3.5 py-2 backdrop-blur-md">
                <p className="text-[9.5px] font-mono uppercase tracking-wider text-emerald-400/70">Failure Archetypes</p>
                <p className="text-sm font-extrabold text-white/90">4 Specialized Models</p>
              </div>
            </div>
          </div>

          {/* ── Window 3: 68% – 92% (The Settled Recovery) ────────────── */}
          <div
            className="absolute left-6 md:left-14 lg:left-20 max-w-xl transition-all duration-300"
            style={{
              opacity: op3,
              transform: `translateY(${(1 - op3) * 24}px)`,
              pointerEvents: op3 > 0.4 ? "auto" : "none",
            }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3 py-1 shadow-sm backdrop-blur-md">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span className="text-[10px] font-mono font-extrabold tracking-widest uppercase text-emerald-300">
                PHASE 03 · 73.4% REVENUE RESTORED
              </span>
            </div>

            <h2 className="mt-4 text-[38px] sm:text-[46px] lg:text-[54px] font-extrabold leading-[1.02] tracking-[-0.03em] text-white">
              73.4% Recapture Rate.
              <br />
              <span className="text-emerald-300">Cryptographically Sealed.</span>
            </h2>

            <p className="mt-4 text-sm sm:text-base leading-relaxed text-white/75 max-w-lg">
              Buyers receive personalized WhatsApp 1-tap UPI rescue notifications
              during TRAI-compliant hours. Every rupee recovered is audited on
              an immutable SHA-256 ledger verified directly against your Razorpay MID.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <div className="rounded-xl border border-emerald-400/40 bg-[#021a11]/90 px-3.5 py-2 backdrop-blur-md">
                <p className="text-[9.5px] font-mono uppercase tracking-wider text-emerald-400/70">Conversion Lift</p>
                <p className="text-sm font-extrabold text-emerald-300">+376.9% Lift</p>
              </div>
              <div className="rounded-xl border border-emerald-400/40 bg-[#021a11]/90 px-3.5 py-2 backdrop-blur-md">
                <p className="text-[9.5px] font-mono uppercase tracking-wider text-emerald-400/70">WhatsApp CTR</p>
                <p className="text-sm font-extrabold text-white">68.2% 1-Tap</p>
              </div>
              <div className="rounded-xl border border-emerald-400/40 bg-[#021a11]/90 px-3.5 py-2 backdrop-blur-md">
                <p className="text-[9.5px] font-mono uppercase tracking-wider text-emerald-400/70">Audit Trail</p>
                <p className="text-sm font-extrabold text-white/90">SHA-256 Ledger</p>
              </div>
            </div>
          </div>

          {/* ── Window 4 / Terminal Dock: 93% – 100% ──────────────────── */}
          <div
            className="absolute left-6 md:left-14 lg:left-20 max-w-xl transition-all duration-300"
            style={{
              opacity: opTerminal,
              transform: `translateY(${(1 - opTerminal) * 24}px)`,
              pointerEvents: opTerminal > 0.4 ? "auto" : "none",
            }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/50 bg-emerald-500/25 px-3 py-1 shadow-sm backdrop-blur-md">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono font-extrabold tracking-widest uppercase text-emerald-300">
                SYSTEM ARMED · READY FOR PRODUCTION
              </span>
            </div>

            <h2 className="mt-4 text-[38px] sm:text-[46px] lg:text-[52px] font-extrabold leading-[1.04] tracking-[-0.03em] text-white">
              Step Into the
              <br />
              <span className="text-burnt">Recovery Cockpit.</span>
            </h2>

            <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/80 max-w-lg">
              Explore live transaction telemetry, simulate real-time failure
              scenarios, or inspect our verifiable SHA-256 recovery ledger.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  if (onDirectLaunch) onDirectLaunch("demo");
                  else handleSkip();
                }}
                className="inline-flex items-center gap-2 rounded-full bg-burnt px-6 py-3 text-xs font-extrabold text-white shadow-[0_12px_24px_-8px_rgba(244,91,22,0.7)] transition-all hover:bg-burnt-deep hover:scale-105 active:scale-95"
              >
                <Zap size={15} className="fill-white" />
                <span>Launch Interactive Demo Lab</span>
              </button>

              <button
                onClick={() => {
                  if (onDirectLaunch) onDirectLaunch("merchant");
                  else handleSkip();
                }}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-6 py-3 text-xs font-extrabold text-white backdrop-blur-md transition-all hover:scale-105 active:scale-95"
              >
                <Building2 size={15} className="text-emerald-400" />
                <span>Enter Merchant Cockpit</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── BOTTOM STATUS BAR & SCROLL PROMPT ─────────────────────────── */}
        <footer className="relative z-20 flex items-center justify-between px-6 py-4 md:px-12 border-t border-white/[0.08] bg-[#020b06]/40 backdrop-blur-xl">
          {/* Active Status indicator */}
          <div className="flex items-center gap-2.5">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[11px] font-mono font-bold tracking-wider text-white/70">
              LEDGER VERIFIED · sha256:7f9b8c2d1e4a
            </span>
          </div>

          {/* Center Scroll Prompt */}
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-widest text-white/50">
            <span>Scroll down to scrub timeline</span>
            <ChevronDown size={14} className="animate-bounce" />
          </div>

          {/* Right Action */}
          <button
            onClick={handleSkip}
            className="text-xs font-extrabold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5"
          >
            <span>Proceed to App</span>
            <ArrowRight size={13} />
          </button>
        </footer>
      </div>
    </div>
  );
}
