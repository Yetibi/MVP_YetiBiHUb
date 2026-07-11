"use client";

import Link from "next/link";
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

const LOGO_LINES = ["▬▬", "▬▬▬", "▬▬"] as const;

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
  "¿Alguien verificó si sus procesos?",
] as const;
const FLIP = "transform 0.56s cubic-bezier(0.4, 0, 0.2, 1)";

function HeadlineSequence({ rm }: { rm: boolean }) {
  // fase permanente: siempre arranca en 3 (4 líneas visibles desde el inicio)
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(3);
  // flip state for phase transitions
  const [flip, setFlip] = useState<"idle" | "out" | "in">("idle");
  // rotating word box (line 4)
  const [wordIdx, setWordIdx] = useState(0);
  const [wordFlip, setWordFlip] = useState<"idle" | "out" | "in">("idle");
  // rotating line 2
  const [line2Idx, setLine2Idx] = useState(0);
  const [line2Flip, setLine2Flip] = useState<"idle" | "out" | "in">("idle");
  // measure widest word (box), capped to viewport width
  const measureBoxRef = useRef<HTMLSpanElement>(null);
  const [boxWidth, setBoxWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    function recalculate() {
      if (!measureBoxRef.current) return;
      const frameWidth = Math.min(
        measureBoxRef.current.offsetWidth + 44,
        window.innerWidth - 96,
      );
      setBoxWidth(frameWidth);
    }
    recalculate();
    window.addEventListener("resize", recalculate);
    return () => window.removeEventListener("resize", recalculate);
  }, []);

  // sequence phases 0→1→2→3
  useEffect(() => {
    if (rm || phase === 3) return;
    const showDuration = phase === 0 ? 1800 : 1400;
    const showTimer = setTimeout(() => {
      setFlip("out");
      const outTimer = setTimeout(() => {
        setPhase((p) => (p < 3 ? ((p + 1) as 0 | 1 | 2 | 3) : 3));
        setFlip("in");
        const inTimer = setTimeout(() => setFlip("idle"), 560);
        return () => clearTimeout(inTimer);
      }, 560);
      return () => clearTimeout(outTimer);
    }, showDuration);
    return () => clearTimeout(showTimer);
  }, [phase, rm]);

  // word rotation in phase 4 — box words
  useEffect(() => {
    if (phase !== 3) return;
    const interval = setInterval(() => {
      setWordFlip("out");
      setTimeout(() => {
        setWordIdx((i) => (i + 1) % ROTATING_WORDS.length);
        setWordFlip("in");
        setTimeout(() => setWordFlip("idle"), 560);
      }, 560);
    }, 4000);
    return () => clearInterval(interval);
  }, [phase]);

  // line2 rotation in phase 4 — offset by 2000ms so it doesn't sync with box
  useEffect(() => {
    if (phase !== 3) return;
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
  }, [phase]);

  const flipStyle = (state: "idle" | "out" | "in"): React.CSSProperties => ({
    display: "block",
    transition: state !== "idle" ? FLIP : undefined,
    transform:
      state === "out" ? "translateY(-110%) rotateX(90deg)" :
      state === "in"  ? "translateY(0%) rotateX(0deg)" :
      "none",
    opacity: state === "out" ? 0 : 1,
    transformOrigin: "top center",
  });

  const trackFlipStyle = (state: "idle" | "out" | "in"): React.CSSProperties => ({
    transition: state !== "idle" ? FLIP : undefined,
    transform:
      state === "out" ? "translateY(-100%) rotateX(90deg)" :
      state === "in"  ? "translateY(0%) rotateX(0deg)" :
      "none",
    opacity: state === "out" ? 0 : 1,
    transformOrigin: "top center",
    display: "inline-block",
    whiteSpace: "nowrap",
  });

  const baseStyle: React.CSSProperties = {
    position: "relative",
    zIndex: 1,
    fontFamily: "var(--font-playfair)",
    fontWeight: 900,
    fontStyle: "italic",
    fontSize: "clamp(28px, 7vw, 62px)",
    lineHeight: 1.12,
    margin: "20px 0 0",
    perspective: 800,
    paddingLeft: "0.12em",
  };

  return (
    <>
      {/* Hidden measurers — misma fuente/tamaño que baseStyle */}
      <span aria-hidden style={{ position: "absolute", visibility: "hidden", pointerEvents: "none",
        fontFamily: "var(--font-playfair)", fontWeight: 900, fontStyle: "italic",
        fontSize: "clamp(28px, 7vw, 62px)", whiteSpace: "nowrap", lineHeight: 1.12 }}>
        <span ref={measureBoxRef}>fuga cerrada.</span>
      </span>

      {/* Phase 1 */}
      {phase === 0 && (
        <h1 id="hero-heading" style={{ ...baseStyle, color: "#E07B30" }}>
          <span style={flipStyle(flip)}>Todos quieren IA.</span>
        </h1>
      )}

      {/* Phase 2 */}
      {phase === 1 && (
        <h1 id="hero-heading" style={{ ...baseStyle, color: "#FFFFFF" }}>
          <span style={flipStyle(flip)}>Pocos saben si sus procesos</span>
        </h1>
      )}

      {/* Phase 3 */}
      {phase === 2 && (
        <h1 id="hero-heading" style={{ ...baseStyle, color: "#FFFFFF" }}>
          <span style={flipStyle(flip)}>están listos para usarla.</span>
        </h1>
      )}

      {/* Phase 4 — permanent: 4 lines */}
      {phase === 3 && (
        <h1 id="hero-heading" style={{ ...baseStyle, display: "flex", flexDirection: "column", gap: "0.1em" }}>
          {/* Line 1 — static, naranja */}
          <span style={{
            display: "block",
            color: "#E07B30",
            animation: rm ? undefined : "heroSlideUp 0.55s ease-out 0s both",
          }}>
            Todos quieren IA.
          </span>

          {/* Line 2 — rotating. Sin width fijo ni clipPath para que Playfair italic no se corte */}
          <span style={{
            display: "block",
            color: "#FFFFFF",
            animation: rm ? undefined : "heroSlideUp 0.55s ease-out 0.06s both",
            perspective: 800,
          }}>
            <span style={rm ? { display: "inline-block", whiteSpace: "nowrap" } : trackFlipStyle(line2Flip)}>
              {ROTATING_LINE2[line2Idx]}
            </span>
          </span>

          {/* Line 3 — static, blanca */}
          <span style={{
            display: "block",
            color: "#FFFFFF",
            animation: rm ? undefined : "heroSlideUp 0.55s ease-out 0.12s both",
          }}>
            están listos para usarla.
          </span>

          {/* Line 4 — "Necesitan" + rotating box */}
          <span style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.18em",
            animation: rm ? undefined : "heroSlideUp 0.55s ease-out 0.18s both",
          }}>
            <span style={{ color: "#FFFFFF" }}>Necesitan</span>
            {/* Rotating word box */}
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              minWidth: boxWidth ?? "auto",
              padding: "0.1em 22px",
              background: "linear-gradient(135deg, #4A3570 0%, #7B3F8C 35%, #C45A2A 70%, #E07B30 100%)",
              borderRadius: 12,
              boxShadow: "0 0 40px rgba(224,123,48,0.25)",
              overflow: "hidden",
              perspective: 800,
            }}>
              <span style={{
                color: "#FFFFFF", fontStyle: "italic", fontWeight: 900,
                ...trackFlipStyle(rm ? "idle" : wordFlip),
              }}>
                {ROTATING_WORDS[wordIdx]}
              </span>
            </span>
          </span>
        </h1>
      )}
    </>
  );
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav({ noAnim }: { noAnim: boolean }) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const style = noAnim ? {} : a("heroFadeIn", "0.4s", "0s");

  // Focus trap: keep Tab inside drawer while open; Escape closes
  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    if (!drawer) return;
    const focusable = drawer.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
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
          display: "flex",
          alignItems: "center",
          padding: "16px 20px",
          backgroundColor: "#2E2640",
          position: "relative",
          zIndex: 10,
          ...style,
        }}
      >
        {/* Logo block */}
        <Link
          href="/"
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              border: "1.5px solid rgba(224,123,48,0.6)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              flexShrink: 0,
            }}
          >
            {LOGO_LINES.map((_, i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  height: 1.5,
                  borderRadius: 2,
                  background: "#E07B30",
                  width: i === 1 ? 16 : 10,
                }}
              />
            ))}
          </span>

          <span style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <span
              style={{
                color: "#FFFFFF",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.18em",
                lineHeight: 1,
              }}
            >
              YETI·BI
            </span>
            <span
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: 8,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                lineHeight: 1,
              }}
            >
              DATA &amp; ANALYTICS
            </span>
          </span>
        </Link>

        {/* Desktop: center links */}
        <div
          className="hidden lg:flex"
          style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 36 }}
        >
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

        {/* Desktop: CTA */}
        <a
          href="/diagnostico"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-md"
          style={{
            backgroundColor: "#E07B30",
            color: "#1c1426",
            fontSize: 13,
            fontWeight: 600,
            padding: "10px 20px",
            borderRadius: 6,
            textDecoration: "none",
            whiteSpace: "nowrap",
            flexShrink: 0,
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
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            flexDirection: "column",
            gap: 5,
            minWidth: 44,
            minHeight: 44,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Línea 1 — rota a / cuando abierto */}
          <span style={{
            display: "block",
            width: 22,
            height: 1.5,
            background: "#E07B30",
            borderRadius: 2,
            transformOrigin: "center",
            transition: "transform 0.22s ease, opacity 0.22s ease",
            transform: open ? "translateY(6.5px) rotate(45deg)" : "none",
          }} />
          {/* Línea 2 — desaparece cuando abierto */}
          <span style={{
            display: "block",
            width: 22,
            height: 1.5,
            background: "#E07B30",
            borderRadius: 2,
            transformOrigin: "center",
            transition: "opacity 0.22s ease",
            opacity: open ? 0 : 1,
          }} />
          {/* Línea 3 — rota a \ cuando abierto */}
          <span style={{
            display: "block",
            width: 22,
            height: 1.5,
            background: "#E07B30",
            borderRadius: 2,
            transformOrigin: "center",
            transition: "transform 0.22s ease, opacity 0.22s ease",
            transform: open ? "translateY(-6.5px) rotate(-45deg)" : "none",
          }} />
        </button>
      </nav>

      {/* Mobile drawer — compacto, solo visible en <md */}
      {open && (
        <div
          ref={drawerRef}
          className="lg:hidden flex-col"
          style={{
            display: "flex",
            position: "fixed",
            top: 68,
            left: 0,
            right: 0,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            backgroundColor: "rgba(26, 20, 40, 0.88)",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            padding: "16px 20px 24px",
            zIndex: 99,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: 16,
                textDecoration: "none",
                padding: "13px 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                alignItems: "center",
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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 16,
              backgroundColor: "#E07B30",
              color: "#1c1426",
              fontSize: 15,
              fontWeight: 700,
              padding: "14px 20px",
              borderRadius: 8,
              textDecoration: "none",
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
          minHeight: "calc(100svh - 68px)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "clamp(28px,5vw,48px) clamp(20px,5vw,80px) clamp(32px,5vw,48px) clamp(20px,5vw,80px)",
        }}
      >
        {/* Grid background */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Semicírculo 1 — top-right principal */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 420,
            height: 420,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(224,123,48,0.22) 0%, rgba(224,123,48,0.08) 40%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Semicírculo 2 — bottom-left sutil */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: -140,
            left: -100,
            width: 340,
            height: 340,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(224,123,48,0.12) 0%, rgba(120,60,140,0.08) 50%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Semicírculo 3 — derecha-centro textura mínima */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: "30%",
            right: "8%",
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Kicker */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            ...an("heroSlideUp", "0.5s", "0.2s"),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              aria-hidden
              style={{ width: 32, height: 1, background: "#E07B30", flexShrink: 0 }}
            />
            <span
              style={{
                fontSize: 10,
                color: "#E07B30",
                letterSpacing: "2px",
                textTransform: "uppercase",
                fontFamily: "var(--font-sans)",
              }}
            >
              DIAGNÓSTICO DE MADUREZ OPERACIONAL
            </span>
          </div>
          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.3)",
              fontFamily: "var(--font-sans)",
              fontStyle: "normal",
              fontWeight: 400,
              marginTop: 6,
              marginLeft: 44,
              maxWidth: 520,
              lineHeight: 1.5,
            }}
          >
            Evalúa si tu operación tiene las condiciones habilitadoras para desplegar IA o automatización con éxito.
          </p>
        </div>

        {/* Headline — secuencia animada */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <HeadlineSequence rm={!!rm} />
        </div>

        {/* Bottom row */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginTop: 32,
          }}
        >
          {/* Horizon line */}
          <div
            aria-hidden
            style={{
              height: 1,
              background: "rgba(255,255,255,0.10)",
              transformOrigin: "left",
              ...an("heroDrawLine", "0.9s", "0.9s"),
            }}
          />

          {/* Value chain — scrollable on very narrow screens */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "4px 0",
              ...an("heroFadeIn", "0.5s", "1.1s"),
            }}
          >
            {CHAIN.map(({ label, accent }, i) => (
              <span key={label} style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: "clamp(11px, 2.5vw, 14px)",
                    fontFamily: "var(--font-sans)",
                    color: accent ? "#E07B30" : "#FFFFFF",
                    fontWeight: accent ? 600 : 400,
                  }}
                >
                  {label}
                </span>
                {i < CHAIN.length - 1 && (
                  <span
                    aria-hidden
                    style={{ color: "#E07B30", margin: "0 8px", fontSize: 12 }}
                  >
                    →
                  </span>
                )}
              </span>
            ))}
          </div>

          {/* Support copy */}
          <p
            style={{
              fontSize: "clamp(15px, 1.6vw, 20px)",
              fontFamily: "var(--font-sans)",
              color: "#FFFFFF",
              lineHeight: 1.6,
              margin: 0,
              maxWidth: 560,
              ...an("heroFadeIn", "0.5s", "1.2s"),
            }}
          >
            Medimos el gap entre tu operación hoy y lo que necesita ser para automatizar o desplegar IA con éxito.
          </p>
        </div>
      </section>
    </>
  );
}
