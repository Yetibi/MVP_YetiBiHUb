"use client";

import Image from "next/image";
import { NeuralNetworkBackground } from "@/components/home/NeuralNetworkBackground";
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
  { label: "La tesis",      href: "#la-tesis" },
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

  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#0B1420",
        overflow: "hidden",
        padding: "0 clamp(24px,5vw,48px)",
        boxSizing: "border-box",
      }}
    >
      <NeuralNetworkBackground reduced={reduced} />
      {/* Velo radial: oscurece detrás del titular para que el texto no
          compita con los nodos brillantes */}
      <div aria-hidden style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        background: "radial-gradient(ellipse 54% 48% at 50% 42%, rgba(11,20,32,0.8), rgba(11,20,32,0.3) 60%, transparent 82%)",
      }} />

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
            maxWidth: 600,
            margin: "34px auto 0",
            fontWeight: 400,
          }}>
            La IA no arregla lo que encuentra:{" "}
            <span style={{ color: "#F2921D", fontWeight: 500 }}>lo amplifica</span>.
            Sobre un proceso sin rediseñar,{" "}
            <span style={{ color: "#F2F6F9", fontWeight: 500 }}>multiplica el costo de lo que está mal</span>{" "}
            — más rápido y a mayor escala.
          </p>
          </div>

          {/* Mini-flujo — el cierre del héroe: convence e invita a bajar */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "8px 0",
          }}>
            {[
              { label: "¿Debe existir?", accent: false },
              { label: "¿Quién lo hace?", accent: false },
              { label: "¿Cómo fluye?", accent: false },
              { label: "Impacto financiero", accent: true },
            ].map((item, i, arr) => (
              <span key={item.label} style={{ display: "flex", alignItems: "center" }}>
                <span style={item.accent ? {
                  fontFamily: "var(--font-space-grotesk)",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#F2921D",
                  whiteSpace: "nowrap",
                } : {
                  fontFamily: "var(--font-geist-mono)",
                  fontSize: 14,
                  fontWeight: 400,
                  color: "#8B95A5",
                  letterSpacing: "0.04em",
                  whiteSpace: "nowrap",
                }}>
                  {item.label}
                </span>
                {i < arr.length - 1 && (
                  <span aria-hidden style={{
                    margin: "0 10px",
                    color: "#5D6B7A",
                    // la flecha previa al clímax acompaña el salto de tamaño
                    fontSize: i === arr.length - 2 ? 17 : 14,
                    fontFamily: "var(--font-geist-mono)",
                  }}>
                    →
                  </span>
                )}
              </span>
            ))}
            <span aria-hidden style={{
              flexBasis: "100%",
              textAlign: "center",
              marginTop: 18,
              color: "#5D6B7A",
              fontSize: 14,
              fontFamily: "var(--font-geist-mono)",
            }}>
              ↓
            </span>

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
          position: "relative",
        }}>
          <NeuralNetworkBackground reduced={reduced} />
          <div aria-hidden style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
            background: "radial-gradient(ellipse 85% 46% at 50% 40%, rgba(11,20,32,0.8), rgba(11,20,32,0.3) 60%, transparent 85%)",
          }} />
          {/* Grupo mensaje: kicker + H1 + lead */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, textAlign: "center", alignItems: "center", position: "relative", zIndex: 1 }}>
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
            color: "#8B95A5", lineHeight: 1.6, margin: 0, maxWidth: 600,
          }}>
            La IA no arregla lo que encuentra:{" "}
            <span style={{ color: "#F2921D", fontWeight: 500 }}>lo amplifica</span>.
            Sobre un proceso sin rediseñar,{" "}
            <span style={{ color: "#F2F6F9", fontWeight: 500 }}>multiplica el costo de lo que está mal</span>{" "}
            — más rápido y a mayor escala.
          </p>
          </div>

          {/* Mini-flujo — el cierre del héroe móvil: en fila, clímax grande */}
          <div style={{
            display: "flex", flexWrap: "wrap", justifyContent: "center", alignItems: "center",
            gap: "6px 7px", position: "relative", zIndex: 1,
          }}>
            {[
              { label: "¿Debe existir?", accent: false },
              { label: "¿Quién lo hace?", accent: false },
              { label: "¿Cómo fluye?", accent: false },
              { label: "Impacto financiero", accent: true },
            ].map((item, i, arr) => (
              <span key={item.label} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={item.accent ? {
                  fontFamily: "var(--font-space-grotesk)", fontSize: 19, fontWeight: 700,
                  color: "#F2921D", whiteSpace: "nowrap",
                } : {
                  fontFamily: "var(--font-geist-mono)", fontSize: 12,
                  fontWeight: 400, color: "#8B95A5", whiteSpace: "nowrap",
                }}>
                  {item.label}
                </span>
                {i < arr.length - 1 && (
                  <span aria-hidden style={{
                    color: "#5D6B7A",
                    fontSize: i === arr.length - 2 ? 14 : 11,
                    fontFamily: "var(--font-geist-mono)",
                  }}>→</span>
                )}
              </span>
            ))}
            <span aria-hidden style={{
              marginTop: 14,
              color: "#5D6B7A",
              fontSize: 13,
              fontFamily: "var(--font-geist-mono)",
            }}>
              ↓
            </span>

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
        style={{ height: "200vh", position: "relative" }}
      >
        {/* Ancla de navegación: aterriza con el panel del problema expandido */}
        <div id="el-problema" aria-hidden style={{ position: "absolute", top: "50%", width: 1, height: 1 }} />
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
