"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
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
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "El enfoque",    href: "#el-enfoque" },
  { label: "Contacto",      href: "#contacto" },
] as const;

const WORDS = [
  "claridad",
  "diagnóstico",
  "fuga cerrada",
  "madurez",
  "decisión",
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
  ({ color }) => (
    <svg aria-hidden width="22" height="22" viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 10a3 3 0 0 1 0-4.24l1.06-1.06A3 3 0 0 1 11.3 8.94"/>
      <path d="M10 6a3 3 0 0 1 0 4.24l-1.06 1.06A3 3 0 0 1 4.7 7.06"/>
      <line x1="8.5" y1="7.5" x2="7.5" y2="8.5" strokeDasharray="1.2 1.2"/>
    </svg>
  ),
  ({ color }) => (
    <svg aria-hidden width="22" height="22" viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2.5C3.5 2.5 2 4 2 6c0 1.2.6 2.2 1.5 2.8C3.2 10.5 4.5 12 6 12h4c1.5 0 2.8-1.5 2.5-3.2C13.4 8.2 14 7.2 14 6c0-2-1.5-3.5-4-3.5"/>
      <line x1="8" y1="5" x2="8" y2="8"/>
      <circle cx="8" cy="10" r="0.6" fill={color} stroke="none"/>
    </svg>
  ),
];

const PAINS = [
  { num: "01", title: "Procesos manuales",      desc: "Tareas repetitivas que dependen de personas específicas." },
  { num: "02", title: "Datos dispersos",         desc: "Información partida entre Excel, correos y sistemas desconectados." },
  { num: "03", title: "Aprobaciones lentas",     desc: "Decisiones sin trazabilidad que bloquean la operación." },
  { num: "04", title: "Reportes tardíos",        desc: "Visibilidad cuando el problema ya ocurrió." },
  { num: "05", title: "Automatización aislada",  desc: "Flujos que no se conectan entre áreas." },
  { num: "06", title: "IA sin gobierno",         desc: "IA sin procesos base ni métricas de impacto." },
] as const;

// ─── shine style ──────────────────────────────────────────────────────────────

const SHINE: React.CSSProperties = {
  background:
    "linear-gradient(110deg,#E07B30 0%,#E07B30 30%,#FFA558 45%,#FFD4A8 50%,#FFA558 55%,#E07B30 70%,#E07B30 100%)",
  backgroundSize: "200% 100%",
  animation: "background-shine 2s linear infinite",
  color: "#0E0B14",
  fontFamily: "var(--font-geist-sans)",
  fontWeight: 700,
  fontSize: 11,
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  whiteSpace: "nowrap" as const,
  textDecoration: "none",
  borderRadius: 2,
  display: "inline-flex",
  alignItems: "center",
  padding: "10px 16px",
  minHeight: 44,
};

// ─── DrumRoll ─────────────────────────────────────────────────────────────────

function DrumRoll({ onIndexChange, reduced }: {
  onIndexChange: (i: number) => void;
  reduced: boolean;
}) {
  const sizerRef  = useRef<HTMLSpanElement>(null);
  const sizerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const trackRef  = useRef<HTMLDivElement>(null);

  const [slotH, setSlotH] = useState(0);
  const [slotW, setSlotW] = useState(0);
  const [current, setCurrent] = useState<number>(WORDS.length);

  const OFFSET   = WORDS.length;
  const extended = [...WORDS, ...WORDS, ...WORDS];
  const FS       = "clamp(32px,4.5vw,60px)";

  useEffect(() => {
    if (!sizerRef.current) return;
    setSlotH(sizerRef.current.offsetHeight);
  }, []);

  useEffect(() => {
    const el = sizerRefs.current[current % WORDS.length];
    if (!el) return;
    setSlotW(el.offsetWidth + 12);
  }, [current]);

  useEffect(() => {
    onIndexChange(current % WORDS.length);
  }, [current, onIndexChange]);

  useEffect(() => {
    if (slotH === 0 || reduced) return;
    let curr = OFFSET;
    const id = setInterval(() => {
      curr++;
      if (curr >= OFFSET + WORDS.length) {
        if (trackRef.current) {
          trackRef.current.style.transition = "none";
          curr = OFFSET;
          setCurrent(curr);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              if (trackRef.current) trackRef.current.style.transition = "";
              curr++;
              setCurrent(curr);
            });
          });
          return;
        }
      }
      setCurrent(curr);
    }, 2500);
    return () => clearInterval(id);
  }, [slotH, reduced]);

  const sizerBase: React.CSSProperties = {
    visibility: "hidden",
    position: "absolute",
    fontFamily: "var(--font-geist-sans)",
    fontWeight: 900,
    fontSize: FS,
    whiteSpace: "nowrap",
    letterSpacing: "-1px",
    pointerEvents: "none",
  };

  if (reduced) {
    return (
      <span style={{
        fontFamily: "var(--font-geist-sans)",
        fontWeight: 900,
        fontSize: FS,
        letterSpacing: "-1px",
        color: "#E07B30",
      }}>
        claridad
      </span>
    );
  }

  const activeWord = WORDS[current % WORDS.length];

  return (
    <>
      {/* Texto accesible para lectores de pantalla — se actualiza con cada cambio */}
      <span
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {activeWord}
      </span>

      <span ref={sizerRef} aria-hidden style={sizerBase}>A</span>
      {WORDS.map((w, i) => (
        <span key={w} ref={(el) => { sizerRefs.current[i] = el; }} aria-hidden style={sizerBase}>{w}</span>
      ))}

      <div
        aria-hidden
        style={{
          display: "inline-flex",
          alignItems: "flex-start",
          verticalAlign: "middle",
          position: "relative",
          flexShrink: 0,
          width: slotW || "auto",
          height: slotH || "1.1em",
          overflow: "visible",
          transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
        }}>
        {slotH > 0 && (["tl","tr","bl","br"] as const).map((pos) => (
          <span
            key={pos}
            aria-hidden
            style={{
              position: "absolute",
              width: 6, height: 6,
              borderColor: "#E07B30",
              borderStyle: "solid",
              opacity: 0.8,
              zIndex: 10,
              ...(pos === "tl" && { top: -3,        left:  -6, borderWidth: "1.5px 0 0 1.5px" }),
              ...(pos === "tr" && { top: -3,        right: -6, borderWidth: "1.5px 1.5px 0 0" }),
              ...(pos === "bl" && { top: slotH - 3, left:  -6, borderWidth: "0 0 1.5px 1.5px" }),
              ...(pos === "br" && { top: slotH - 3, right: -6, borderWidth: "0 1.5px 1.5px 0" }),
            }}
          />
        ))}

        <div style={{
          position: "relative",
          width: "100%",
          height: slotH || "1.1em",
          overflow: "visible",
          clipPath: "none",
        }}>
          <div
            ref={trackRef}
            style={{
              display: "flex",
              flexDirection: "column",
              transform: `translateY(${-current * slotH}px)`,
              transition: "transform 0.55s cubic-bezier(0.4,0,0.2,1)",
              willChange: "transform",
              overflow: "visible",
            }}
          >
            {extended.map((word, i) => {
              const d        = i - current;
              const isActive = d === 0;
              const isBelow  = d === 1;
              return (
                <div
                  key={`${word}-${i}`}
                  aria-hidden
                  style={{
                    height:     slotH || undefined,
                    lineHeight: slotH ? `${slotH}px` : undefined,
                    display:    "flex",
                    alignItems: "center",
                    whiteSpace: "nowrap",
                    fontFamily: "var(--font-geist-sans)",
                    fontWeight: 900,
                    fontSize:   FS,
                    letterSpacing: "-1px",
                    fontStyle:  isBelow ? "italic" : "normal",
                    color:      isActive ? "#E07B30" : isBelow ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.04)",
                    opacity:    isActive ? 1 : isBelow ? 0.55 : 0,
                    transition: "color 0.3s ease, opacity 0.3s ease",
                  }}
                >
                  {word}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
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
        borderBottom: "1px solid rgba(224,123,48,0.08)",
        background: "#0E0B14",
        zIndex: 100,
      }}
    >
      <Link
        href="/"
        style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }}
      >
        <Image src="/yeti-logo.png" alt="Yeti BI" width={32} height={32} style={{ objectFit: "contain" }} priority />
        <span style={{
          fontFamily: "var(--font-geist-sans)",
          fontWeight: 700,
          fontSize: 13,
          color: "#fff",
          letterSpacing: "3px",
        }}>
          YETI·<span style={{ color: "#E07B30" }}>BI</span>
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
        style={SHINE}
      >
        DIAGNOSTICA TU PROCESO
        <span className="sr-only"> (abre en nueva pestaña)</span>
      </a>
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
  const FS = "clamp(32px,4.5vw,60px)";
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

    const project = (x: number, y: number, z: number) => {
      const fov   = canvas.height * 0.9;
      const camZ  = 0.8;
      const scale = fov / (camZ + z);
      const px    = canvas.width  * 0.5 + x * scale;
      const py    = canvas.height * 0.82 + y * scale;
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
          const { px, py } = project(
            (gx - 0.5) * 4.5,
            wave(gx, gy, t) - 0.05,
            gy * 2.2
          );
          pts[row][col] = { px, py, gy };
        }
      }

      for (let row = 0; row <= ROWS; row++) {
        ctx.beginPath();
        pts[row].forEach(({ px, py }, col) =>
          col === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
        );
        const gy = row / ROWS;
        ctx.strokeStyle = `rgba(224,123,48,${0.02 + gy * 0.04})`;
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
        ctx.strokeStyle = "rgba(224,123,48,0.025)";
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }

      for (let row = 0; row <= ROWS; row += 2) {
        for (let col = 0; col <= COLS; col += 2) {
          const { px, py, gy } = pts[row][col];
          ctx.beginPath();
          ctx.arc(px, py, 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(224,123,48,${0.1 + gy * 0.09})`;
          ctx.fill();
        }
      }

      // Use cached gradient — recreate only when size changes
      if (!cachedFade) {
        cachedFade = ctx.createLinearGradient(0, canvas.height * 0.75, 0, canvas.height * 0.85);
        cachedFade.addColorStop(0, "#0E0B14");
        cachedFade.addColorStop(1, "transparent");
      }
      ctx.fillStyle = "#0E0B14";
      ctx.fillRect(0, 0, canvas.width, canvas.height * 0.75);
      ctx.fillStyle = cachedFade;
      ctx.fillRect(0, canvas.height * 0.75, canvas.width, canvas.height * 0.10);

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
        background: "#0E0B14",
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
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: 0,
          lineHeight: 1.05,
          width: "100%",
          textAlign: "center",
        }}>
          {/* Kicker */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginBottom: 16 }}>
            <div aria-hidden style={{ width: 24, height: 1, background: "#E07B30", flexShrink: 0 }} />
            <span style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 12,
              color: "#A89DC0",
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontWeight: 500,
            }}>
              DIAGNÓSTICO DE MADUREZ OPERACIONAL
            </span>
            <div aria-hidden style={{ width: 24, height: 1, background: "#E07B30", flexShrink: 0 }} />
          </div>

          <p style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: 17,
            color: "rgba(255,255,255,0.85)",
            lineHeight: 1.6,
            maxWidth: 560,
            margin: "0 auto 28px",
            fontWeight: 400,
          }}>
            Analizamos cómo operas hoy y medimos qué tan listo está tu proceso para automatizar o desplegar IA.
          </p>

          {/* h1 de la página */}
          <h1 style={{
            margin: 0,
            padding: 0,
            display: "contents",
            fontFamily: "var(--font-geist-sans)",
            fontWeight: 900,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1.05 }}>
              <span style={{
                fontFamily: "var(--font-geist-sans)",
                fontWeight: 900,
                fontSize: FS,
                color: "#E07B30",
                letterSpacing: "-1px",
                lineHeight: 1.05,
              }}>
                Todos quieren IA.
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1.05 }}>
              <span style={{
                fontFamily: "var(--font-geist-sans)",
                fontWeight: 900,
                fontSize: FS,
                letterSpacing: "-1px",
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.05,
              }}>
                Pero
              </span>
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              lineHeight: 1.05,
              marginTop: 2,
              flexWrap: "wrap",
            }}>
              <span style={{
                fontFamily: "var(--font-geist-sans)",
                fontWeight: 900,
                fontSize: FS,
                letterSpacing: "-1px",
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.05,
              }}>
                Necesitan
              </span>

              <DrumRoll onIndexChange={() => {}} reduced={reduced} />

              <span style={{
                fontFamily: "var(--font-geist-sans)",
                fontWeight: 900,
                fontSize: FS,
                letterSpacing: "-1px",
                color: "rgba(255,255,255,0.9)",
                lineHeight: 1.05,
              }}>
                primero.
              </span>
            </div>
          </h1>

          {/* Cadena de valor */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "8px 0",
            marginTop: 80,
          }}>
            {[
              { label: "Proceso sano", accent: false },
              { label: "Dato confiable", accent: false },
              { label: "La ruta correcta", accent: false },
              { label: "Impacto financiero medible", accent: true },
            ].map((item, i, arr) => (
              <span key={item.label} style={{ display: "flex", alignItems: "center" }}>
                <span style={{
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: "clamp(11px,1vw,14px)",
                  fontWeight: item.accent ? 600 : 400,
                  color: item.accent ? "#E07B30" : "rgba(255,255,255,0.9)",
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                }}>
                  {item.label}
                </span>
                {i < arr.length - 1 && (
                  <span aria-hidden style={{
                    margin: "0 10px",
                    color: "rgba(255,255,255,0.2)",
                    fontSize: 13,
                    fontFamily: "var(--font-geist-mono)",
                  }}>
                    →
                  </span>
                )}
              </span>
            ))}
          </div>

          {/* Tagline */}
          <p style={{
            fontFamily: "var(--font-geist-sans)",
            fontSize: "clamp(13px,1.1vw,16px)",
            color: "rgba(255,255,255,0.7)",
            lineHeight: 1.65,
            maxWidth: 440,
            margin: "20px auto 0",
            textAlign: "center",
            fontWeight: 400,
          }}>
            Antes de apostarle a la IA, mide si tu operación está lista para que dé resultados.
          </p>
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

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "stretch",
        padding: "64px 40px 40px 40px",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <motion.div style={{ scale: textScaleMV, transformOrigin: "center center" }}>
        <h2 style={{
          fontFamily: "var(--font-playfair)",
          fontWeight: 700,
          fontStyle: "italic",
          fontSize: "clamp(28px,3.5vw,48px)",
          color: "#ffffff",
          margin: "0 0 48px 0",
          lineHeight: 1.3,
          textAlign: "center",
        }}>
          ¿Te identificas con esto?
        </h2>

        {/* Semántica de lista para los pain items */}
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {PAINS.map((pain, i) => {
            const isActive = allVisible || i === activePain;
            const Icon = PAIN_ICONS[i];
            const iconColor = isActive ? "#C3B9D6" : "rgba(168,157,192,0.3)";
            return (
              <li key={pain.num} style={{
                paddingTop: 14,
                paddingBottom: 14,
                transition: "opacity 0.4s ease",
                opacity: isActive ? 1 : 0.2,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 4 }}>
                  <span style={{ flexShrink: 0, transition: "opacity 0.4s ease" }}>
                    <Icon color={iconColor} />
                  </span>
                  <p style={{
                    fontFamily: "var(--font-playfair)",
                    fontWeight: 700,
                    fontStyle: "italic",
                    fontSize: "clamp(18px,2.2vw,32px)",
                    color: isActive ? "#ffffff" : "rgba(255,255,255,0.5)",
                    margin: 0,
                    lineHeight: 1.2,
                    transition: "color 0.4s ease",
                  }}>
                    {pain.title}
                  </p>
                </div>
                <p style={{
                  fontFamily: "var(--font-geist-sans)",
                  fontWeight: 400,
                  fontSize: "clamp(11px,1.1vw,15px)",
                  color: isActive ? "#E07B30" : "rgba(224,123,48,0.35)",
                  margin: 0,
                  lineHeight: 1.5,
                  paddingLeft: 38,
                  transition: "color 0.4s ease",
                }}>
                  {pain.desc}
                </p>
              </li>
            );
          })}
        </ul>
      </motion.div>
    </div>
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
    const mqMobile  = window.matchMedia("(max-width: 767px)");
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

  const activePainRaw = useTransform(scrollYProgress, [0.4, 1.0], [0, 5.99]);
  useMotionValueEvent(activePainRaw, "change", (v) => {
    setActivePain(Math.floor(v));
  });

  // Memoized no-op to avoid unnecessary DrumRoll useEffect re-runs
  const noop = useCallback(() => {}, []);

  if (reduced || isMobile) {
    return (
      <div id="el-problema" style={{ background: "#0E0B14" }}>
        <Navbar />
        <div style={{ position: "relative", height: "100vh", display: "flex", flexDirection: "column", paddingTop: 64 }}>
          <div style={{
            position: "absolute", top: "50%", transform: "translateY(-50%)",
            padding: "0 clamp(24px,5vw,48px)", width: "100%",
          }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div aria-hidden style={{ width: 28, height: 1, background: "#E07B30" }} />
                <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 12, color: "#E07B30", letterSpacing: "2px", textTransform: "uppercase" }}>
                  DIAGNÓSTICO DE MADUREZ OPERACIONAL
                </span>
              </div>
              {/* contraste mejorado: 0.30 → 0.70 */}
              <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 17, color: "rgba(255,255,255,0.70)", marginTop: 6, marginLeft: 40, lineHeight: 1.6 }}>
                Analizamos cómo operas hoy y medimos qué tan listo está tu proceso para automatizar o desplegar IA.
              </p>
            </div>
            <h1 style={{ margin: 0, padding: 0 }}>
              <span style={{ fontFamily: "var(--font-geist-sans)", fontWeight: 900, fontSize: "clamp(32px,4.5vw,60px)", color: "#E07B30", letterSpacing: "-1px", lineHeight: 1.05, display: "block", marginBottom: 4 }}>
                Todos quieren IA.
              </span>
              <span style={{ fontFamily: "var(--font-geist-sans)", fontWeight: 900, fontSize: "clamp(32px,4.5vw,60px)", color: "rgba(255,255,255,0.9)", letterSpacing: "-1px", lineHeight: 1.05, display: "block", marginBottom: 4 }}>
                Pero
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <span style={{ fontFamily: "var(--font-geist-sans)", fontWeight: 900, fontSize: "clamp(32px,4.5vw,60px)", letterSpacing: "-1px", color: "rgba(255,255,255,0.9)", lineHeight: 1.05 }}>Necesitan</span>
                <DrumRoll onIndexChange={noop} reduced={true} />
                <span style={{ fontFamily: "var(--font-geist-sans)", fontWeight: 900, fontSize: "clamp(32px,4.5vw,60px)", letterSpacing: "-1px", color: "rgba(255,255,255,0.9)", lineHeight: 1.05 }}>primero.</span>
              </span>
            </h1>
          </div>
        </div>
        {/* Pain items en mobile/reduced — siempre visibles */}
        <div style={{ padding: "48px clamp(24px,5vw,48px)", borderTop: "1px solid rgba(224,123,48,0.1)" }}>
          <h2 style={{ fontFamily: "var(--font-geist-sans)", fontWeight: 700, fontSize: "clamp(20px,2.5vw,32px)", color: "rgba(255,255,255,0.9)", margin: "0 0 32px" }}>¿Te identificas con esto?</h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {PAINS.map((pain) => (
              <li key={pain.num} style={{ display: "flex", gap: 16, paddingTop: 14, paddingBottom: 14 }}>
                <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "#E07B30", flexShrink: 0, paddingTop: 2 }}>{pain.num}</span>
                <div>
                  <p style={{ fontFamily: "var(--font-geist-sans)", fontWeight: 700, fontSize: 14, color: "rgba(255,255,255,0.9)", margin: 0 }}>{pain.title}</p>
                  <p style={{ fontFamily: "var(--font-geist-sans)", fontSize: 12, color: "rgba(255,255,255,0.65)", margin: "4px 0 0", lineHeight: 1.55 }}>{pain.desc}</p>
                </div>
              </li>
            ))}
          </ul>
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
            background: "#0E0B14",
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
              background: "#0E0B14",
              borderLeft: "1px solid rgba(224,123,48,0.12)",
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
