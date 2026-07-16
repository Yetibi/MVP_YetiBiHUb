"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useReducedMotion } from "motion/react";

// ─── animation helper ─────────────────────────────────────────────────────────

function a(
  name: string,
  duration: string,
  delay: string,
  easing = "ease-out",
): React.CSSProperties {
  return { animation: `${name} ${duration} ${easing} ${delay} both` };
}

// ─── data ─────────────────────────────────────────────────────────────────────

const CHAIN: { label: string; accent: boolean }[] = [
  { label: "Proceso sano",               accent: false },
  { label: "Dato confiable",             accent: false },
  { label: "La ruta correcta",           accent: false },
  { label: "Impacto financiero medible", accent: true  },
];


const NAV_LINKS = [
  { label: "El problema",   href: "#el-problema" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "El enfoque",    href: "#el-enfoque" },
  { label: "Contacto",      href: "#contacto" },
];

// ─── Headline sequence ────────────────────────────────────────────────────────

const ROTATING_WORDS = ["claridad.", "diagnóstico.", "fuga cerrada.", "madurez.", "decisión."] as const;
const ROTATING_LINE2 = [
  "Nadie pregunta si sus procesos",
  "Pocos saben si sus procesos",
  "¿Alguien verificó si sus procesos",
] as const;
const FLIP = "transform 0.56s cubic-bezier(0.4, 0, 0.2, 1)";

// FIX #7: fase arranca directo en 3, código de fases 0-2 eliminado (era dead code)
function HeadlineSequence({ rm }: { rm: boolean }) {
  const [wordIdx, setWordIdx]   = useState(0);
  const [wordFlip, setWordFlip] = useState<"idle" | "out" | "in">("idle");
  const [line2Idx, setLine2Idx] = useState(0);
  const [line2Flip, setLine2Flip] = useState<"idle" | "out" | "in">("idle");

  // measure widest word for the box — SSR-safe initial 280
  const sizerRef = useRef<HTMLSpanElement>(null);
  const [frameWidth, setFrameWidth] = useState<number>(280);
  const necesitanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    function calculate() {
      if (!sizerRef.current) return;
      const textW      = sizerRef.current.offsetWidth;
      const necesitanW = necesitanRef.current ? necesitanRef.current.offsetWidth : 0;
      const gapPx      = 16;
      const sectionPad = Math.max(20, Math.min(window.innerWidth * 0.05, 60)) * 2;
      const maxW       = window.innerWidth - sectionPad - necesitanW - gapPx;
      // Cap at maxW so the box never overflows the viewport on mobile
      setFrameWidth(Math.min(textW + 44, maxW));
    }
    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, []);

  // word rotation — box
  useEffect(() => {
    if (rm) return;
    const interval = setInterval(() => {
      setWordFlip("out");
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % ROTATING_WORDS.length);
        setWordFlip("in");
        setTimeout(() => setWordFlip("idle"), 560);
      }, 560);
    }, 4000);
    return () => clearInterval(interval);
  }, [rm]);

  // line2 rotation — offset 2000ms to avoid syncing
  useEffect(() => {
    if (rm) return;
    const initial = setTimeout(() => {
      const interval = setInterval(() => {
        setLine2Flip("out");
        setTimeout(() => {
          setLine2Idx((i) => (i + 1) % ROTATING_LINE2.length);
          setLine2Flip("in");
          setTimeout(() => setLine2Flip("idle"), 560);
        }, 560);
      }, 4000);
      return () => clearInterval(interval);
    }, 2000);
    return () => clearTimeout(initial);
  }, [rm]);

  // FIX #8: trackFlipStyle no incluye display — se aplica como primer spread
  // para que display:flex del span no sea sobreescrito
  const trackFlipStyle = (state: "idle" | "out" | "in"): React.CSSProperties => {
    const base: React.CSSProperties = {
      opacity: state === "out" ? 0 : 1,
      transformOrigin: "top center",
    };
    if (state !== "idle") {
      base.transition = FLIP;
      base.transform  =
        state === "out" ? "translateY(-100%) rotateX(90deg)" : "translateY(0%) rotateX(0deg)";
    }
    return base;
  };

  const l2FadeStyle = (state: "idle" | "out" | "in"): React.CSSProperties => ({
    transition: state !== "idle" ? "opacity 0.3s ease, transform 0.3s ease" : undefined,
    opacity:    state === "out" ? 0 : 1,
    transform:  state === "out" ? "translateY(-8px)" : "translateY(0)",
  });

  // C4: mobile-first — 22px mínimo para proporcionalidad en 390px
  const FS    = "clamp(22px, 5.5vw, 58px)";
  const FSBox = "clamp(20px, 5vw, 54px)";

  // FIX #6: lineHeight 1.15 en lugar de 1.05 para evitar colisión de descendentes
  const staticLineStyle: React.CSSProperties = {
    display:    "block",
    fontFamily: "var(--font-sans)",
    fontWeight: 900,
    fontStyle:  "normal",
    fontSize:   FS,
    lineHeight: 1.15,
  };

  const l2ItemStyle: React.CSSProperties = {
    fontFamily: "var(--font-dm-serif)",
    fontWeight: 400,
    fontStyle:  "italic",
    fontSize:   FS,
    color:      "#fff",
    whiteSpace: "normal",
    lineHeight: 1.15,
    display:    "block",
  };

  return (
    <>
      {/* Hidden measurers */}
      <span aria-hidden style={{
        position: "absolute", visibility: "hidden", pointerEvents: "none",
        fontFamily: "var(--font-dm-serif)", fontWeight: 400, fontStyle: "italic",
        fontSize: FSBox, whiteSpace: "nowrap", lineHeight: 1.15,
      }}>
        <span ref={sizerRef}>fuga cerrada.</span>
      </span>
      <span aria-hidden style={{
        position: "absolute", visibility: "hidden", pointerEvents: "none",
        fontFamily: "var(--font-sans)", fontWeight: 900, fontStyle: "normal",
        fontSize: FS, whiteSpace: "nowrap",
      }}>
        <span ref={necesitanRef}>Necesitan</span>
      </span>

      {/* FIX #7: solo phase 3, siempre visible desde el inicio */}
      <h1
        id="hero-heading"
        style={{ margin: "20px 0 0", display: "flex", flexDirection: "column" }}
      >
        {/* L1 — Geist 900 naranja */}
        <span style={{
          ...staticLineStyle,
          color: "#E07B30",
          marginBottom: 8,
          animation: rm ? undefined : "heroSlideUp 0.55s ease-out 0s both",
        }}>
          Todos quieren IA.
        </span>

        {/* L2 — Playfair italic blanca, fade+slide */}
        <span style={{
          display: "block",
          overflow: "visible",
          marginBottom: 8,
          animation: rm ? undefined : "heroSlideUp 0.55s ease-out 0.06s both",
        }}>
          {rm ? (
            <span style={l2ItemStyle}>{ROTATING_LINE2[0]}</span>
          ) : (
            <span style={{ ...l2ItemStyle, ...l2FadeStyle(line2Flip) }}>
              {ROTATING_LINE2[line2Idx]}
            </span>
          )}
        </span>

        {/* L3 — Geist 900 blanca */}
        <span style={{
          ...staticLineStyle,
          color: "#fff",
          marginBottom: 12,
          animation: rm ? undefined : "heroSlideUp 0.55s ease-out 0.12s both",
        }}>
          están listos para usarla.
        </span>

        {/* L4 — "Necesitan" + recuadro rotativo */}
        <span style={{
          display:    "flex",
          alignItems: "center",
          flexWrap:   "wrap",
          gap:        "16px",
          marginTop:  4,
          animation:  rm ? undefined : "heroSlideUp 0.55s ease-out 0.18s both",
        }}>
          <span style={{ ...staticLineStyle, color: "#fff", flexShrink: 0, display: "inline" }}>
            Necesitan
          </span>

          {/* C2: padding ajustado al texto; C1: DM Serif Display */}
          <span style={{
            display:        "inline-flex",
            alignItems:     "center",
            justifyContent: "center",
            position:       "relative",
            minWidth:       frameWidth,
            maxWidth:       "100%",
            padding:        "4px 20px",
            background:     "linear-gradient(135deg, #4A3570 0%, #7B3F8C 35%, #C45A2A 70%, #E07B30 100%)",
            borderRadius:   8,
            boxShadow:      "0 0 40px rgba(224,123,48,0.25)",
            overflow:       "hidden",
          }}>
            <span style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "center",
              width:          "100%",
              textAlign:      "center",
              fontFamily:     "var(--font-dm-serif)",
              fontStyle:      "italic",
              fontWeight:     400,
              fontSize:       FSBox,
              color:          "#FFFFFF",
              perspective:    "800px",
              ...trackFlipStyle(rm ? "idle" : wordFlip),
            }}>
              {rm ? ROTATING_WORDS[0] : ROTATING_WORDS[wordIdx]}
            </span>
          </span>
        </span>
      </h1>
    </>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav({ noAnim }: { noAnim: boolean }) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const style = noAnim ? {} : a("heroFadeIn", "0.4s", "0s");

  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    if (!drawer) return;
    const focusable = drawer.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    first?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpen(false); return; }
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <nav
        aria-label="Navegación principal"
        style={{
          display:         "flex",
          alignItems:      "center",
          padding:         "16px 20px",
          backgroundColor: "#2E2640",
          position:        "relative",
          zIndex:          10,
          ...style,
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}
        >
          <Image
            src="/yeti-logo.png"
            alt="Yeti BI"
            width={44}
            height={44}
            style={{ flexShrink: 0, objectFit: "contain" }}
            priority
          />

          <span style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <span style={{ color: "#FFFFFF", fontSize: 14, fontWeight: 700, letterSpacing: "0.18em", lineHeight: 1 }}>
              YETI·<span style={{ color: "#E07B30" }}>BI</span>
            </span>
            {/* FIX #4: logo subtítulo de 8px → 10px */}
            <span style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              lineHeight: 1,
            }}>
              PROCESS &amp; <span style={{ color: "#E07B30" }}>ANALYTICS</span>
            </span>
          </span>
        </Link>

        {/* Desktop: center links */}
        <div className="hidden lg:flex" style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 36 }}>
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
              style={{ color: "rgba(255,255,255,0.55)", fontSize: 14, textDecoration: "none" }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop: CTA — FIX #11: transition opacity en hover */}
        <a
          href="/diagnostico"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:inline-flex hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-md"
          style={{
            backgroundColor: "#E07B30",
            color:           "#1c1426",
            fontSize:        13,
            fontWeight:      600,
            padding:         "10px 20px",
            borderRadius:    6,
            textDecoration:  "none",
            whiteSpace:      "nowrap",
            flexShrink:      0,
          }}
        >
          Diagnostica tu proceso — gratis
        </a>

        {/* Mobile: spacer + hamburger */}
        <div className="flex lg:hidden" style={{ flex: 1 }} />
        <button
          className="flex lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "8px", flexDirection: "column", gap: 5,
            minWidth: 44, minHeight: 44, alignItems: "center", justifyContent: "center",
          }}
        >
          <span style={{
            display: "block", width: 22, height: 1.5, background: "#E07B30", borderRadius: 2,
            transformOrigin: "center", transition: "transform 0.22s ease, opacity 0.22s ease",
            transform: open ? "translateY(6.5px) rotate(45deg)" : "none",
          }} />
          <span style={{
            display: "block", width: 22, height: 1.5, background: "#E07B30", borderRadius: 2,
            transition: "opacity 0.22s ease", opacity: open ? 0 : 1,
          }} />
          <span style={{
            display: "block", width: 22, height: 1.5, background: "#E07B30", borderRadius: 2,
            transformOrigin: "center", transition: "transform 0.22s ease, opacity 0.22s ease",
            transform: open ? "translateY(-6.5px) rotate(-45deg)" : "none",
          }} />
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          ref={drawerRef}
          className="lg:hidden flex-col"
          style={{
            display: "flex", position: "fixed",
            top: 68, left: 0, right: 0,
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
            backgroundColor: "rgba(26, 20, 40, 0.88)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            padding: "16px 20px 24px", zIndex: 99,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              style={{
                color: "rgba(255,255,255,0.75)", fontSize: 16,
                textDecoration: "none", padding: "13px 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center",
              }}
            >
              {label}
            </Link>
          ))}
          <a
            href="/diagnostico"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              marginTop: 16, backgroundColor: "#E07B30", color: "#1c1426",
              fontSize: 15, fontWeight: 700, padding: "14px 20px",
              borderRadius: 8, textDecoration: "none",
            }}
          >
            Diagnostica tu proceso — gratis
          </a>
        </div>
      )}
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export function Hero() {
  const rm = useReducedMotion();
  const an = rm ? () => ({} as React.CSSProperties) : a;

  return (
    <>
      <Nav noAnim={!!rm} />

      <section
        id="diagnostico"
        aria-labelledby="hero-heading"
        style={{
          backgroundColor: "#2E2640",
          minHeight:       "calc(100svh - 68px)",
          position:        "relative",
          display:         "flex",
          flexDirection:   "column",
          justifyContent:  "space-between",
          paddingTop:      "clamp(40px,6vh,72px)",
          paddingBottom:   60,
          paddingLeft:     "clamp(20px,5vw,60px)",
          paddingRight:    "clamp(20px,5vw,60px)",
        }}
      >
        {/* Metaballs decorativos */}
        <svg aria-hidden style={{ position: "absolute", width: 0, height: 0 }}>
          <defs>
            <filter id="goo-yeti" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="28" result="blur"/>
              <feColorMatrix in="blur" mode="matrix"
                values="1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 18 -6" result="goo"/>
              <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
            </filter>
          </defs>
        </svg>

        {/* Desktop: esquina top-right */}
        <div aria-hidden className="hidden sm:block" style={{
          position: "absolute", top: 0, right: 0,
          width: "45%", height: "100%",
          filter: "url(#goo-yeti)",
          pointerEvents: "none", zIndex: 0, overflow: "hidden",
          opacity: rm ? 0.3 : 0.55,
        }}>
          {/* Blob 1 naranja — ancla superior derecha */}
          <div style={{
            position: "absolute", top: -40, right: -30, width: 300, height: 200,
            borderRadius: "62% 38% 71% 29% / 45% 55% 45% 55%",
            background: "radial-gradient(ellipse at 35% 40%, rgba(224,123,48,0.85) 0%, rgba(180,80,20,0.45) 55%, transparent 78%)",
            animation: rm ? "none" : "moveB1 8s ease-in-out infinite",
          }} />
          {/* Blob 2 púrpura — toca blob 1 por la izquierda */}
          <div style={{
            position: "absolute", top: 30, right: 110, width: 240, height: 170,
            borderRadius: "38% 62% 45% 55% / 60% 40% 60% 40%",
            background: "radial-gradient(ellipse at 55% 35%, rgba(120,60,160,0.75) 0%, rgba(80,30,120,0.4) 55%, transparent 78%)",
            animation: rm ? "none" : "moveB2 10s ease-in-out infinite",
          }} />
          {/* Blob 3 dorado — toca blob 2 por abajo */}
          <div style={{
            position: "absolute", top: 150, right: 80, width: 210, height: 155,
            borderRadius: "55% 45% 30% 70% / 50% 65% 35% 50%",
            background: "radial-gradient(ellipse at 45% 55%, rgba(240,160,60,0.72) 0%, rgba(200,120,30,0.4) 55%, transparent 78%)",
            animation: rm ? "none" : "moveB3 12s ease-in-out infinite",
          }} />
          {/* Blob 4 magenta — toca blob 2 por arriba-izq */}
          <div style={{
            position: "absolute", top: -10, right: 240, width: 175, height: 125,
            borderRadius: "70% 30% 55% 45% / 40% 60% 40% 60%",
            background: "radial-gradient(ellipse at 60% 40%, rgba(180,60,100,0.65) 0%, rgba(140,30,80,0.35) 55%, transparent 78%)",
            animation: rm ? "none" : "moveB4 9s ease-in-out infinite",
          }} />
          {/* Blob 5 índigo — toca blob 3 por abajo-izq */}
          <div style={{
            position: "absolute", top: 230, right: 200, width: 220, height: 160,
            borderRadius: "45% 55% 65% 35% / 55% 45% 55% 45%",
            background: "radial-gradient(ellipse at 40% 50%, rgba(60,40,140,0.65) 0%, rgba(40,20,100,0.35) 55%, transparent 78%)",
            animation: rm ? "none" : "moveB5 11s ease-in-out infinite",
          }} />
        </div>

        {/* Mobile: fondo completo muy tenue */}
        <div aria-hidden className="block sm:hidden" style={{
          position: "absolute", inset: 0,
          opacity: 0.18,
          filter: "url(#goo-yeti)",
          pointerEvents: "none", zIndex: 0, overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -40, right: -30, width: 260, height: 180,
            borderRadius: "62% 38% 71% 29% / 45% 55% 45% 55%",
            background: "radial-gradient(ellipse at 35% 40%, rgba(224,123,48,0.85) 0%, rgba(180,80,20,0.5) 55%, transparent 78%)",
          }} />
          <div style={{
            position: "absolute", top: 20, right: 10, width: 220, height: 150,
            borderRadius: "38% 62% 45% 55% / 60% 40% 60% 40%",
            background: "radial-gradient(ellipse at 55% 35%, rgba(120,60,160,0.75) 0%, rgba(80,30,120,0.4) 55%, transparent 78%)",
          }} />
          <div style={{
            position: "absolute", top: 200, right: -10, width: 190, height: 135,
            borderRadius: "55% 45% 30% 70% / 50% 65% 35% 50%",
            background: "radial-gradient(ellipse at 45% 55%, rgba(240,160,60,0.72) 0%, rgba(200,120,30,0.4) 55%, transparent 78%)",
          }} />
        </div>

        {/* Kicker */}
        <div style={{ position: "relative", zIndex: 1, marginBottom: 32, ...an("heroSlideUp", "0.5s", "0.2s") }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div aria-hidden style={{ width: 32, height: 2, background: "#E07B30", flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#E07B30", letterSpacing: "2.5px", textTransform: "uppercase", fontFamily: "var(--font-geist-mono)", fontWeight: 400 }}>
              DIAGNÓSTICO DE MADUREZ OPERACIONAL
            </span>
          </div>
          <p style={{
            fontSize: "clamp(14px, 1.4vw, 17px)", color: "rgba(255,255,255,0.7)",
            fontFamily: "var(--font-sans)", fontStyle: "normal", fontWeight: 400,
            marginTop: 10, marginLeft: 44, maxWidth: 560, lineHeight: 1.6,
          }}>
            Evalúa si tu operación tiene las condiciones habilitadoras para desplegar IA o automatización con éxito.
          </p>
        </div>

        {/* Headline */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <HeadlineSequence rm={!!rm} />
        </div>

        {/* Bottom row */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 16, marginTop: 28 }}>
          {/* Horizon line */}
          <div aria-hidden style={{
            height: 1, background: "rgba(255,255,255,0.10)",
            transformOrigin: "left", ...an("heroDrawLine", "0.9s", "0.9s"),
          }} />

          {/* FIX #17: chain con nowrap + overflow auto para no partir en tablet */}
          <div style={{
            display:    "flex",
            alignItems: "center",
            flexWrap:   "nowrap",
            overflowX:  "auto",
            gap:        "0",
            WebkitOverflowScrolling: "touch" as React.CSSProperties["WebkitOverflowScrolling"],
            ...an("heroFadeIn", "0.5s", "1.1s"),
          }}>
            {CHAIN.map(({ label, accent }, i) => (
              <span key={label} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                <span style={{
                  fontSize:   "clamp(11px, 2.5vw, 14px)",
                  fontFamily: "var(--font-sans)",
                  color:      accent ? "#E07B30" : "#FFFFFF",
                  fontWeight: accent ? 600 : 400,
                  whiteSpace: "nowrap",
                }}>
                  {label}
                </span>
                {i < CHAIN.length - 1 && (
                  <span aria-hidden style={{ color: "#E07B30", margin: "0 8px", fontSize: 12 }}>→</span>
                )}
              </span>
            ))}
          </div>

          {/* Support copy */}
          <p style={{
            fontSize:   "clamp(15px, 1.6vw, 20px)",
            fontFamily: "var(--font-sans)",
            color:      "#FFFFFF",
            lineHeight: 1.6,
            margin:     0,
            maxWidth:   560,
            ...an("heroFadeIn", "0.5s", "1.2s"),
          }}>
            Medimos el gap entre tu operación hoy y lo que necesita ser para automatizar o desplegar IA con éxito.
          </p>
        </div>
      </section>
    </>
  );
}
