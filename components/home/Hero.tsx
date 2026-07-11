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
  { label: "El problema",   href: "#diagnostico" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "El enfoque",    href: "#flujo-de-valor" },
  { label: "Contacto",      href: "#contacto" },
];

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
          className="hidden md:flex"
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
          className="hidden md:inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-md"
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
        <div className="flex md:hidden" style={{ flex: 1 }} />
        <button
          className="flex md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "8px",
            display: "flex",
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

      {/* Mobile drawer — position fixed para no empujar contenido en landscape */}
      {open && (
        <div
          ref={drawerRef}
          className="flex md:hidden flex-col"
          style={{
            position: "fixed",
            top: 68,
            left: 0,
            right: 0,
            bottom: 0,
            overflowY: "auto",
            backgroundColor: "#1A1428",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            padding: "20px",
            gap: 0,
            zIndex: 99,
          }}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: 16,
                textDecoration: "none",
                padding: "14px 0",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                display: "block",
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
              display: "block",
              marginTop: 20,
              backgroundColor: "#E07B30",
              color: "#1c1426",
              fontSize: 15,
              fontWeight: 700,
              padding: "14px 20px",
              borderRadius: 8,
              textDecoration: "none",
              textAlign: "center",
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
          padding: "clamp(28px,5vw,48px) clamp(20px,5vw,40px) clamp(32px,5vw,48px)",
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

        {/* Orange glow top-left */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: -120,
            left: -80,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(224,123,48,0.08)",
            filter: "blur(60px)",
            pointerEvents: "none",
            zIndex: 0,
            ...an("heroScaleIn", "1.4s", "0.1s"),
          }}
        />

        {/* Purple glow bottom-right */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: -100,
            right: -60,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "rgba(100,60,160,0.18)",
            filter: "blur(80px)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Watermark — hidden on mobile to avoid overflow */}
        <div
          aria-hidden
          className="hidden sm:block"
          style={{
            position: "absolute",
            right: -40,
            top: "50%",
            transform: "translateY(-50%)",
            fontFamily: "var(--font-playfair)",
            fontStyle: "italic",
            fontWeight: 900,
            fontSize: "clamp(100px, 18vw, 260px)",
            color: "rgba(255,255,255,0.04)",
            lineHeight: 1,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 0,
            whiteSpace: "nowrap",
          }}
        >
          claridad.
        </div>

        {/* Kicker */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            gap: 12,
            ...an("heroSlideUp", "0.5s", "0.2s"),
          }}
        >
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
            Diagnóstico de AI Readiness · Yeti BI
          </span>
        </div>

        {/* Headline */}
        <h1
          id="hero-heading"
          style={{
            position: "relative",
            zIndex: 1,
            fontFamily: "var(--font-playfair)",
            fontWeight: 900,
            fontStyle: "italic",
            fontSize: "clamp(40px, 8.5vw, 112px)",
            lineHeight: 1.05,
            color: "#FFFFFF",
            maxWidth: "100%",
            margin: "20px 0 0",
            textWrap: "balance" as React.CSSProperties["textWrap"],
          }}
        >
          <span style={{ display: "block", ...an("heroSlideUp", "0.55s", "0.35s") }}>
            La mayoría de
          </span>
          <span style={{ display: "block", ...an("heroSlideUp", "0.55s", "0.5s") }}>
            tus problemas
          </span>
          <span style={{ display: "block", color: "#E07B30", ...an("heroSlideUp", "0.55s", "0.65s") }}>
            no necesitan IA.
          </span>
          <span style={{ display: "block", color: "#FFFFFF", ...an("heroSlideUp", "0.55s", "0.8s") }}>
            Necesitan claridad.
          </span>
        </h1>

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
            El diagnóstico Yeti BI te dice cuál es tu ruta{" "}
            <a
              href="/diagnostico"
              target="_blank"
              rel="noopener noreferrer"
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
              style={{
                color: "#E07B30",
                textDecoration: "underline",
                textUnderlineOffset: 3,
                fontWeight: 600,
              }}
            >
              antes de que inviertas un peso en tecnología →
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
