"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "motion/react";

// ─── constants ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "El problema",   href: "#el-problema" },
  { label: "Las 3 capas",   href: "#como-funciona" },
  { label: "El enfoque",    href: "#el-enfoque" },
  { label: "Contacto",      href: "#contacto" },
] as const;

const PAIN_ICONS: React.FC<{ color: string }>[] = [
  ({ color }) => (
    <svg aria-hidden width="22" height="22" viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="4.5" r="2.5"/>
      <path d="M2.5 14c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5"/>
      <circle cx="12.5" cy="7" r="1.2"/>
      <path d="M12.5 5.4v-.5M12.5 9.3v-.5M14.1 6.2l-.4.2M11.3 7.8l-.4.2M14.1 7.8l-.4-.2M11.3 6.2l-.4-.2"/>
    </svg>
  ),
  ({ color }) => (
    <svg aria-hidden width="22" height="22" viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="3" cy="8" r="1.8" strokeDasharray="1.5 1.5"/>
      <circle cx="8" cy="3" r="1.8" strokeDasharray="1.5 1.5"/>
      <circle cx="13" cy="8" r="1.8" strokeDasharray="1.5 1.5"/>
      <circle cx="8" cy="13" r="1.8" strokeDasharray="1.5 1.5"/>
    </svg>
  ),
  ({ color }) => (
    <svg aria-hidden width="22" height="22" viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8.5" r="6"/>
      <path d="M8 5.5v3l2 1.5"/>
      <line x1="6" y1="1" x2="6" y2="2.5"/>
      <line x1="10" y1="1" x2="10" y2="2.5"/>
    </svg>
  ),
  ({ color }) => (
    <svg aria-hidden width="22" height="22" viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="9" width="2.5" height="5" rx="0.5"/>
      <rect x="6.5" y="6" width="2.5" height="8" rx="0.5"/>
      <rect x="11" y="3" width="2.5" height="11" rx="0.5"/>
      <path d="M3.5 5.5l2.5-2.5 2.5 2-1.5-4.5"/>
    </svg>
  ),
];

// Énfasis naranja dentro de las descripciones (fuga activa)
const Hl = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: "#F2921D", fontWeight: 500 }}>{children}</span>
);

const PAINS = [
  {
    num: "01",
    capa: "CAPA · PERSONAS",
    title: "El proceso vive en la cabeza de alguien",
    desc: (
      <>Si esa persona se va de vacaciones, el proceso se detiene. El conocimiento no está en el sistema — está en <Hl>quien lo opera</Hl>, y nadie más sabe hacerlo.</>
    ),
    fuga: "Fuga: dependencia de un héroe insustituible",
  },
  {
    num: "02",
    capa: "CAPA · FLUJO",
    title: "Un Excel y un WhatsApp sostienen la operación",
    desc: (
      <>El proceso “oficial” está en un software, pero el que de verdad funciona vive en <Hl>un archivo personal y un grupo de chat</Hl>. Dos versiones de la verdad que nunca coinciden.</>
    ),
    fuga: "Fuga: información fuera del sistema, sin trazabilidad",
  },
  {
    num: "03",
    capa: "CAPA · PROPÓSITO",
    title: "Se hace así “porque siempre se ha hecho así”",
    desc: (
      <>Hay pasos que nadie recuerda por qué existen, pero se siguen ejecutando. Un proceso <Hl>fósil</Hl> que consume tiempo y ya no sirve a nadie — pero ahí sigue.</>
    ),
    fuga: "Fuga: pasos sin propósito que igual cuestan",
  },
  {
    num: "04",
    capa: "CAPA · IMPACTO",
    title: "Automatizaste y “liberaste horas”… ¿y luego?",
    desc: (
      <>Metiste tecnología, ahorraste tiempo, pero <Hl>esas horas no se tradujeron en más ingreso ni menos costo</Hl>. El resultado se siente eficiente, pero no llega a la utilidad.</>
    ),
    fuga: "Fuga: horas liberadas con impacto financiero cero",
  },
] as const;

// ─── navbar CTA extra styles (sobre .btn-primary) ─────────────────────────────

const NAVBAR_BTN_EXTRA: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.08em",
  padding: "10px 16px",
  borderRadius: 2,
  display: "inline-flex",
  alignItems: "center",
  minHeight: 44,
};

// ─── BracketFrame ─────────────────────────────────────────────────────────────
// Marco de énfasis con 4 corner brackets cian. Decorativo: las esquinas van
// aria-hidden; el texto interior sí es parte del contenido visual (que a su
// vez vive dentro de un contenedor aria-hidden — el H1 real es sr-only).

function BracketFrame({ children }: { children: React.ReactNode }) {
  const corner: React.CSSProperties = {
    position: "absolute",
    width: 16,
    height: 16,
    borderColor: "#4FD1E0",
    borderStyle: "solid",
    pointerEvents: "none",
  };
  return (
    <span style={{
      position: "relative",
      display: "inline-block",
      // padding lateral para que los brackets no toquen el texto (16px móvil → 26px desktop)
      padding: "0 clamp(16px, 2.2vw, 26px)",
      boxSizing: "border-box",
      color: "#4FD1E0",
      whiteSpace: "nowrap",
    }}>
      {/* Solo diagonal: esquina superior-derecha + inferior-izquierda */}
      <span aria-hidden style={{ ...corner, top: 0, right: 0, borderWidth: "2.5px 2.5px 0 0" }} />
      <span aria-hidden style={{ ...corner, bottom: 0, left: 0, borderWidth: "0 0 2.5px 2.5px" }} />
      {children}
    </span>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <nav
      aria-label="Navegación principal"
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        height: 64,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 clamp(16px,4vw,40px)",
        borderBottom: "1px solid rgba(79,209,224,0.08)",
        background: "#0B1420",
        zIndex: 100,
      }}
    >
      <Link
        href="/"
        style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}
      >
        <Image src="/yeti-logo.png" alt="Yeti BI" width={32} height={32} style={{ objectFit: "contain" }} priority />
        <span style={{
          fontFamily: "var(--font-space-grotesk)",
          fontWeight: 700,
          fontSize: 13,
          color: "#F2F6F9",
          letterSpacing: "3px",
        }}>
          {/* Logo bicolor — excepción de identidad deliberada:
              YETI nieve · cian BI ámbar */}
          <span translate="no">YETI<span style={{ color: "#4FD1E0" }}>·</span><span style={{ color: "#F2921D" }}>BI</span></span>
        </span>
      </Link>

      <div className="hidden md:flex" style={{ gap: 32, alignItems: "center" }}>
        {NAV_LINKS.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            className="nav-link"
            style={{
              fontFamily: "var(--font-geist-sans)",
              fontSize: 14,
              fontWeight: 400,
              color: "rgba(255,255,255,0.80)",
              textDecoration: "none",
              transition: "color 0.15s",
              borderRadius: 2,
              padding: "4px 2px",
            }}
          >
            {label}
          </a>
        ))}
      </div>

      <a
        href="/diagnostico"
        target="_blank"
        rel="noopener noreferrer"
        className="btn-primary home-navbar-cta"
        style={NAVBAR_BTN_EXTRA}
      >
        EVALUAR MI PROCESO
        <span className="sr-only"> (abre en nueva pestaña)</span>
      </a>

      {/* El CTA del navbar es el único elemento coral grande permitido:
         acento de conversión. El resto de .btn-primary ya es teal. */}
      <style>{`
        /* hereda el naranja de .btn-primary; sin overrides de color */
      `}</style>
    </nav>
  );
}

// ─── LeftPanel ────────────────────────────────────────────────────────────────

function LeftPanel({
  opacityMV,
  reduced,
}: {
  opacityMV: MotionValue<number>;
  reduced: boolean;
}) {
  // Línea 1 = protagonista (impacto); línea 2 = apoyo con el marco cian
  const H1_LINE1 = "clamp(42px, 7vw, 104px)";
  const H1_FS = "clamp(26px, 4vw, 58px)";
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let running = true;
    let t = 0;
    const COLS = 24;
    const ROWS = 16;

    // Gradient cached outside the draw loop — recreated only on resize
    let cachedFade: CanvasGradient | null = null;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      cachedFade = null; // invalidate on resize
    };
    resize();

    // Debounced resize
    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 100);
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Plano vertical: la malla cubre todo el alto del héroe; la onda desplaza
    // cada punto levemente (la cadencia de la animación no cambia)
    const project = (gx: number, gy: number, w: number) => {
      const px = canvas.width  * (0.05 + gx * 0.90) + w * canvas.width  * 0.025;
      const py = canvas.height * (0.02 + gy * 0.96) + w * canvas.height * 0.045;
      return { px, py };
    };

    const wave = (gx: number, gy: number, time: number) =>
      Math.sin(Math.sqrt((gx - 0.5) ** 2 + (gy - 0.3) ** 2) * 8 - time * 1.8) * 0.18
      + Math.sin(gx * 5 + time * 1.2) * 0.08
      + Math.sin(gy * 4 - time * 0.9) * 0.06;

    const draw = () => {
      if (!running) return;
      // Pause when tab is hidden
      if (document.visibilityState === "hidden") {
        animId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.012;

      const pts: { px: number; py: number; gy: number }[][] = [];
      for (let row = 0; row <= ROWS; row++) {
        pts[row] = [];
        for (let col = 0; col <= COLS; col++) {
          const gx = col / COLS;
          const gy = row / ROWS;
          const { px, py } = project(gx, gy, wave(gx, gy, t));
          pts[row][col] = { px, py, gy };
        }
      }

      for (let row = 0; row <= ROWS; row++) {
        ctx.beginPath();
        pts[row].forEach(({ px, py }, col) =>
          col === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
        );
        const gy = row / ROWS;
        ctx.strokeStyle = `rgba(79,209,224,${0.03 + gy * 0.03})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      for (let col = 0; col <= COLS; col++) {
        ctx.beginPath();
        pts.forEach((row, ri) =>
          ri === 0
            ? ctx.moveTo(row[col].px, row[col].py)
            : ctx.lineTo(row[col].px, row[col].py)
        );
        ctx.strokeStyle = "rgba(79,209,224,0.03)";
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      for (let row = 0; row <= ROWS; row += 2) {
        for (let col = 0; col <= COLS; col += 2) {
          const { px, py, gy } = pts[row][col];
          ctx.beginPath();
          ctx.arc(px, py, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(79,209,224,${0.1 + gy * 0.09})`;
          ctx.fill();
        }
      }

      // Fundido en los bordes superior e inferior para integrar la malla
      if (!cachedFade) {
        cachedFade = ctx.createLinearGradient(0, 0, 0, canvas.height);
        cachedFade.addColorStop(0, "rgba(11,20,32,1)");
        cachedFade.addColorStop(0.14, "rgba(11,20,32,0)");
        cachedFade.addColorStop(0.86, "rgba(11,20,32,0)");
        cachedFade.addColorStop(1, "rgba(11,20,32,1)");
      }
      ctx.fillStyle = cachedFade;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animId = requestAnimationFrame(draw);
    };

    // Start via RAF so animId is always defined before cleanup
    animId = requestAnimationFrame(draw);

    // Pause when tab hidden
    const onVisibility = () => {
      if (document.visibilityState === "visible" && running) {
        animId = requestAnimationFrame(draw);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [reduced]);

  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "radial-gradient(ellipse 60% 42% at 50% 0%, rgba(79,209,224,0.04), transparent 70%), #0B1420",
        overflow: "hidden",
        padding: "0 clamp(24px,5vw,48px)",
        boxSizing: "border-box",
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        role="presentation"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div style={{
        position: "relative",
        zIndex: 1,
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        minHeight: 0,
        paddingTop: 64,
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          height: "100%",
          gap: 0,
          lineHeight: 1.05,
          width: "100%",
          textAlign: "center",
        }}>
          {/* Grupo mensaje: kicker + H1 + lead */}
          <div>
          {/* Kicker */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginBottom: 30 }}>
            <div aria-hidden style={{ width: 28, height: 1, background: "#F2921D", flexShrink: 0 }} />
            <span style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 13,
              color: "#F2921D",
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontWeight: 500,
            }}>
              EVALUACIÓN DE PROCESO · ANTES DE AUTOMATIZAR
            </span>
          </div>

          {/* h1 de la página — el accesible es la frase limpia; el visual va
              aria-hidden para que los brackets no rompan la lectura */}
          <h1 className="sr-only">
            No implementes IA. Sin rediseñar antes el proceso
          </h1>
          <div aria-hidden="true" style={{
            fontFamily: "var(--font-space-grotesk)",
            fontWeight: 1000,
            fontSize: H1_FS,
            lineHeight: 1.04,
            letterSpacing: "-0.025em",
            color: "#F2F6F9",
          }}>
            {/* Línea 1: LA protagonista del héroe */}
            <div style={{ display: "flex", justifyContent: "center", fontSize: H1_LINE1, lineHeight: 1.02 }}>
            No implementes IA
            </div>
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.18em 0.28em",
              marginTop: "0.18em",
            }}>
              <span style={{ color: "#F2921D" }}>Sin rediseñar antes</span>
              <BracketFrame>el proceso</BracketFrame>
            </div>
          </div>

          {/* Lead */}
          <p style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: 19,
            color: "#8B95A5",
            lineHeight: 1.65,
            maxWidth: 640,
            margin: "34px auto 0",
            fontWeight: 400,
          }}>
            Tu proceso no tiene que estar roto — puede solo{" "}
            <span style={{ color: "#4FD1E0", fontWeight: 500 }}>no estar listo</span>.
            Evaluamos sus tres capas (<span style={{ color: "#F2F6F9", fontWeight: 500 }}>propósito, personas y flujo</span>)
            antes de que la tecnología amplifique lo que haya.
          </p>
          </div>

          {/* CTA principal */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: 20 }}>
            <a
              href="/diagnostico"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-eval-cta"
            >
              Evaluar mi proceso <span aria-hidden>→</span>
              <span className="sr-only"> (abre en nueva pestaña)</span>
            </a>
            <span style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 11,
              color: "#5D6B7A",
              letterSpacing: "2px",
            }}>
              UN PROCESO · SIN COSTO
            </span>
          </div>

          {/* Mini-flujo */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "8px 0",
          }}>
            {[
              { label: "Proceso que debe existir", accent: false },
              { label: "Personas correctas", accent: false },
              { label: "Flujo optimizado", accent: false },
              { label: "Impacto financiero", accent: true },
            ].map((item, i, arr) => (
              <span key={item.label} style={{ display: "flex", alignItems: "center" }}>
                <span style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: "clamp(12px,1.05vw,15px)",
                  fontWeight: item.accent ? 600 : 400,
                  color: item.accent ? "#F2921D" : "#8B95A5",
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                }}>
                  {item.label}
                </span>
                {i < arr.length - 1 && (
                  <span aria-hidden style={{
                    margin: "0 10px",
                    color: "#5D6B7A",
                    fontSize: 13,
                    fontFamily: "var(--font-geist-mono)",
                  }}>
                    →
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RightPanel ───────────────────────────────────────────────────────────────

function RightPanel({
  textScaleMV,
  activePain,
}: {
  textScaleMV: MotionValue<number>;
  activePain: number;
}) {
  const allVisible = activePain >= PAINS.length - 1;

  // Modo teaser: mientras el panel está angosto (antes de expandirse con el
  // scroll) se ocultan descripciones y fugas para que la columna no se corte
  // verticalmente. Solo presentación — la animación de anchura no se toca.
  // (Se usa ResizeObserver porque lightningcss elimina las @container queries
  // con los targets actuales del build.)
  const panelRef = useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = useState(true);
  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setNarrow(e.contentRect.width < 560));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={panelRef}
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "stretch",
        padding: "72px 36px 28px 36px",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
      className="pain-panel"
    >
      <motion.div style={{
        scale: textScaleMV,
        transformOrigin: "center center",
        ...(narrow ? { height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-evenly" } : null),
      }}>
        <div style={{ textAlign: "center", margin: narrow ? "0 0 8px" : "0 0 22px" }}>
          <p style={{
            fontFamily: "var(--font-geist-mono)",
            fontSize: 11,
            color: "#F2921D",
            letterSpacing: "3px",
            textTransform: "uppercase",
            fontWeight: 500,
            margin: "0 0 8px",
          }}>
            EL PROBLEMA
          </p>
          <h2 className="pain-h2" style={{
            fontFamily: "var(--font-space-grotesk)",
            fontWeight: 700,
            fontSize: narrow ? 23 : "clamp(20px,2.2vw,30px)",
            color: "#F2F6F9",
            margin: "0 0 10px",
            lineHeight: 1.15,
          }}>
            La IA no corrige un proceso roto.<br />
            <span style={{ color: "#F2921D" }}>Lo acelera.</span>
          </h2>
          <p className="pain-teaser-hide" style={{
                  ...(narrow ? { display: "none" } : null),
            fontFamily: "var(--font-geist-sans)",
            fontSize: 13,
            color: "#8B95A5",
            lineHeight: 1.55,
            maxWidth: 460,
            margin: "0 auto",
          }}>
            Antes de automatizar, pregúntate si reconoces alguno de estos.
            No son fallas técnicas — son <span style={{ color: "#F2F6F9", fontWeight: 500 }}>fugas de valor</span> que
            tu operación ya normalizó.
          </p>
        </div>

        {/* Semántica de lista para los pain items */}
        <ul style={{
          listStyle: "none", padding: 0, margin: 0,
          ...(narrow ? { flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-evenly" } : null),
        }}>
          {PAINS.map((pain, i) => {
            const isActive = allVisible || i === activePain;
            const Icon = PAIN_ICONS[i];
            // Andon: los dolores son fuga activa — el marcador se enciende en ámbar
            const iconColor = isActive ? "#F2921D" : "rgba(242,146,29,0.3)";
            return (
              <li key={pain.num} className="pain-card" style={{
                background: "#141F2E",
                borderRadius: 12,
                padding: narrow ? "22px 18px" : "12px 16px",
                marginBottom: narrow ? 0 : 8,
                transition: "opacity 0.4s ease",
                opacity: isActive ? 1 : 0.2,
              }}>
                <p style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 10,
                  fontWeight: 500,
                  letterSpacing: "2.5px",
                  color: isActive ? "#4FD1E0" : "rgba(79,209,224,0.35)",
                  margin: narrow ? "0 0 8px" : "0 0 5px",
                  paddingLeft: 38,
                  transition: "color 0.4s ease",
                }}>
                  {pain.capa}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 6 }}>
                  <span style={{ flexShrink: 0, transition: "opacity 0.4s ease" }}>
                    <Icon color={iconColor} />
                  </span>
                  <p style={{
                    fontFamily: "var(--font-space-grotesk)",
                    fontWeight: 600,
                    fontSize: narrow ? 21 : "clamp(15px,1.5vw,21px)",
                    color: isActive ? "#F2F6F9" : "rgba(242,246,249,0.5)",
                    margin: 0,
                    lineHeight: 1.2,
                    transition: "color 0.4s ease",
                  }}>
                    {pain.title}
                  </p>
                </div>
                <p className="pain-teaser-hide" style={{
                  ...(narrow ? { display: "none" } : null),
                  fontFamily: "var(--font-geist-sans)",
                  fontWeight: 400,
                  fontSize: "clamp(11px,1vw,13px)",
                  color: isActive ? "#8B95A5" : "rgba(139,149,165,0.35)",
                  margin: 0,
                  lineHeight: 1.5,
                  paddingLeft: 38,
                  transition: "color 0.4s ease",
                }}>
                  {pain.desc}
                </p>
                <p className="pain-teaser-hide" style={{
                  ...(narrow ? { display: "none" } : null),
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: "clamp(9px,0.8vw,11px)",
                  color: isActive ? "#5D6B7A" : "rgba(93,107,122,0.35)",
                  margin: "6px 0 0",
                  paddingLeft: 38,
                  transition: "color 0.4s ease",
                }}>
                  <span aria-hidden style={{ color: isActive ? "#F2921D" : "rgba(242,146,29,0.35)", marginRight: 8 }}>●</span>
                  {pain.fuga}
                </p>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </div>
  );
}

// ─── MobilePainList — spotlight: activo=full, resto=dim, todos=full al final ──

function MobilePainList() {
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  // activeIndex: el último item que entró al viewport (-1 = ninguno aún)
  const [activeIndex, setActiveIndex] = useState(-1);
  // allSeen: true cuando el último item ha sido visto al menos una vez
  const [allSeen, setAllSeen] = useState(false);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setActiveIndex(i);
            if (i === PAINS.length - 1) setAllSeen(true);
          }
        },
        { threshold: 0.4 }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((io) => io.disconnect());
  }, []);

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {PAINS.map((pain, i) => {
        const isActive = allSeen || i === activeIndex;
        const hasBeenSeen = allSeen || i <= activeIndex;
        const Icon = PAIN_ICONS[i];

        return (
          <li
            key={pain.num}
            ref={(el) => { itemRefs.current[i] = el; }}
            className="pain-card"
            style={{
              display: "flex", gap: 14,
              background: "#141F2E",
              borderRadius: 12,
              padding: "14px 16px",
              marginBottom: 10,
              opacity: isActive ? 1 : hasBeenSeen ? 0.25 : 0.12,
              transform: hasBeenSeen ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.45s ease, transform 0.45s ease",
            }}
          >
            <span style={{ flexShrink: 0, paddingTop: 1 }}>
              <Icon color={isActive ? "#F2921D" : "rgba(242,146,29,0.25)"} />
            </span>
            <div>
              <p style={{
                fontFamily: "var(--font-geist-mono)", fontSize: 9, fontWeight: 500,
                letterSpacing: "2px",
                color: isActive ? "#4FD1E0" : "rgba(79,209,224,0.3)",
                margin: "0 0 4px", transition: "color 0.45s ease",
              }}>
                {pain.capa}
              </p>
              <p style={{
                fontFamily: "var(--font-space-grotesk)", fontWeight: 600, fontSize: 15,
                color: isActive ? "#F2F6F9" : "rgba(242,246,249,0.25)",
                margin: 0, transition: "color 0.45s ease",
              }}>
                {pain.title}
              </p>
              <p style={{
                fontFamily: "var(--font-geist-sans)", fontSize: 13,
                color: isActive ? "#8B95A5" : "rgba(139,149,165,0.10)",
                margin: "4px 0 0", lineHeight: 1.55,
                transition: "color 0.45s ease",
              }}>
                {pain.desc}
              </p>
              <p style={{
                fontFamily: "var(--font-geist-mono)", fontSize: 10,
                color: isActive ? "#5D6B7A" : "rgba(93,107,122,0.25)",
                margin: "6px 0 0", transition: "color 0.45s ease",
              }}>
                <span aria-hidden style={{ color: isActive ? "#F2921D" : "rgba(242,146,29,0.25)", marginRight: 6 }}>●</span>
                {pain.fuga}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

// ─── Hero (main export) ───────────────────────────────────────────────────────

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePain, setActivePain] = useState(0);
  const [reduced, setReduced] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqMobile  = window.matchMedia("(max-width: 1023px)");
    setReduced(mqReduced.matches);
    setIsMobile(mqMobile.matches);
    const onReduced = () => setReduced(mqReduced.matches);
    const onMobile  = () => setIsMobile(mqMobile.matches);
    mqReduced.addEventListener("change", onReduced);
    mqMobile.addEventListener("change", onMobile);
    return () => {
      mqReduced.removeEventListener("change", onReduced);
      mqMobile.removeEventListener("change", onMobile);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target:  containerRef,
    offset:  ["start start", "end end"],
  });

  const leftWidth    = useTransform(scrollYProgress, [0, 1], ["75%", "0%"]);
  const rightWidth   = useTransform(scrollYProgress, [0, 1], ["25%", "100%"]);
  const leftOpacity  = useTransform(scrollYProgress, [0.4, 0.7], [1, 0]);
  const leftPointerEvents = useTransform(
    scrollYProgress,
    [0.4, 0.55],
    ["auto", "none"] as ["auto" | "none", "auto" | "none"]
  );
  const rightTextScale = useTransform(scrollYProgress, [0.5, 1.0], [0.9, 1]);

  const activePainRaw = useTransform(scrollYProgress, [0.4, 1.0], [0, PAINS.length - 0.01]);
  useMotionValueEvent(activePainRaw, "change", (v) => {
    setActivePain(Math.floor(v));
  });

  if (reduced || isMobile) {
    return (
      <div id="el-problema" style={{ background: "#0B1420" }}>
        <Navbar />

        {/* ── Hero mobile: flujo normal, compacto ── */}
        <div style={{
          padding: "80px 24px 32px",
          minHeight: "100svh",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          gap: 0,
          overflowX: "hidden",
          background: "radial-gradient(ellipse 90% 36% at 50% 0%, rgba(79,209,224,0.04), transparent 70%), transparent",
        }}>
          {/* Grupo mensaje: kicker + H1 + lead */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, textAlign: "center", alignItems: "center" }}>
          {/* Kicker */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <div aria-hidden style={{ width: 20, height: 1, background: "#F2921D", flexShrink: 0 }} />
            <span style={{
              fontFamily: "var(--font-geist-mono)", fontSize: 9,
              color: "#F2921D", letterSpacing: "2px", textTransform: "uppercase" as const,
            }}>
              EVALUACIÓN DE PROCESO · ANTES DE AUTOMATIZAR
            </span>
          </div>

          {/* H1 — el accesible es la frase limpia; el visual va aria-hidden */}
          <h1 className="sr-only">
            No implementes IA sin rediseñar antes el proceso
          </h1>
          <div aria-hidden="true" style={{
            fontFamily: "var(--font-space-grotesk)",
            fontWeight: 700,
            fontSize: "clamp(26px, 8.5vw, 34px)",
            lineHeight: 1.04,
            letterSpacing: "-0.025em",
            color: "#F2F6F9",
          }}>
            <div style={{ fontSize: "clamp(34px, 11.5vw, 52px)", lineHeight: 1.05 }}>No implementes IA.</div>
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "0.2em 0.28em",
              marginTop: "0.2em",
            }}>
              <span style={{ color: "#F2921D" }}>Sin antes rediseñar</span>
              <BracketFrame>el proceso</BracketFrame>
            </div>
          </div>

          {/* Lead */}
          <p style={{
            fontFamily: "var(--font-geist-sans)", fontSize: 15,
            color: "#8B95A5", lineHeight: 1.6, margin: 0,
          }}>
            Tu proceso no tiene que estar roto — puede solo{" "}
            <span style={{ color: "#4FD1E0", fontWeight: 500 }}>no estar listo</span>.
            Evaluamos sus tres capas (<span style={{ color: "#F2F6F9", fontWeight: 500 }}>propósito, personas y flujo</span>)
            antes de que la tecnología amplifique lo que haya.
          </p>
          </div>

          {/* CTA principal — el ancla del héroe móvil: centrado y grande */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <a
              href="/diagnostico"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-eval-cta"
              style={{ fontSize: 18, padding: "18px 40px", width: "100%", maxWidth: 380, justifyContent: "center" }}
            >
              Evaluar mi proceso <span aria-hidden>→</span>
              <span className="sr-only"> (abre en nueva pestaña)</span>
            </a>
            <span style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 10,
              color: "#5D6B7A",
              letterSpacing: "2px",
            }}>
              UN PROCESO · SIN COSTO
            </span>
          </div>

          {/* Mini-flujo — vertical en mobile */}
          <div style={{ display: "flex", flexDirection: "column", gap: 5, alignItems: "center" }}>
            {[
              { label: "Proceso que debe existir", accent: false },
              { label: "Personas correctas", accent: false },
              { label: "Flujo optimizado", accent: false },
              { label: "Impacto financiero", accent: true },
            ].map((item, i, arr) => (
              <span key={item.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {i > 0 && (
                  <span aria-hidden style={{ color: "#5D6B7A", fontSize: 10, fontFamily: "var(--font-geist-mono)" }}>→</span>
                )}
                <span style={{
                  fontFamily: "var(--font-geist-mono)", fontSize: 11,
                  fontWeight: item.accent ? 600 : 400,
                  color: item.accent ? "#F2921D" : "#8B95A5",
                }}>
                  {item.label}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Pain items — animados con scroll via IntersectionObserver */}
        <div style={{ padding: "0 24px 56px", borderTop: "1px solid rgba(79,209,224,0.10)" }}>
          <div style={{ margin: "32px 0 20px" }}>
            <p style={{
              fontFamily: "var(--font-geist-mono)", fontSize: 10,
              color: "#F2921D", letterSpacing: "2.5px", textTransform: "uppercase" as const,
              fontWeight: 500, margin: "0 0 10px",
            }}>
              EL PROBLEMA
            </p>
            <h2 style={{
              fontFamily: "var(--font-space-grotesk)", fontWeight: 700,
              fontSize: 24, color: "#F2F6F9",
              margin: "0 0 10px", lineHeight: 1.15,
            }}>
              La IA no corrige un proceso roto.<br />
              <span style={{ color: "#F2921D" }}>Lo acelera.</span>
            </h2>
            <p style={{
              fontFamily: "var(--font-geist-sans)", fontSize: 14,
              color: "#8B95A5", lineHeight: 1.6, margin: 0,
            }}>
              Antes de automatizar, pregúntate si reconoces alguno de estos.
              No son fallas técnicas — son <span style={{ color: "#F2F6F9", fontWeight: 500 }}>fugas de valor</span> que
              tu operación ya normalizó.
            </p>
          </div>
          <MobilePainList />
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div
        ref={containerRef}
        id="el-problema"
        style={{ height: "200vh", position: "relative" }}
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
            background: "#0B1420",
            display: "flex",
            width: "100%",
          }}
        >
          <motion.div
            style={{
              width: leftWidth,
              opacity: leftOpacity,
              height: "100%",
              position: "relative",
              pointerEvents: leftPointerEvents,
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <LeftPanel opacityMV={leftOpacity} reduced={false} />
          </motion.div>

          <motion.div
            className="hidden md:block"
            style={{
              width: rightWidth,
              height: "100%",
              background:
                "linear-gradient(135deg, rgba(79,209,224,0.10) 0%, rgba(79,209,224,0.06) 100%), #0B1420",
              borderLeft: "1px solid rgba(79,209,224,0.10)",
              position: "relative",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <RightPanel
              textScaleMV={rightTextScale}
              activePain={activePain}
            />
          </motion.div>
        </div>
      </div>
    </>
  );
}
