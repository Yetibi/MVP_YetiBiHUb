"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "motion/react";
import { ProjectFrame } from "@/components/powerbi/ProjectFrame";

// Cifras de dinero/resultado en naranja: son el hito del caso.
const CIFRA_RE = /(entre \$[\d.,]+M y \$[\d.,]+M COP(?: mensuales| anuales)?|\$[\d.,]+M COP(?: mensuales| anuales)?|menos de \d+ semanas?|\d+ productos|\d+% más)/g;
function resaltarCifras(texto: string) {
  return texto.split(CIFRA_RE).map((parte, i) =>
    i % 2 === 1
      ? <span key={i} style={{ color: "#F2921D", fontWeight: 600 }}>{parte}</span>
      : parte
  );
}

// ─── contenido ───────────────────────────────────────────────────────────────

const PROJECTS = [
  {
    image: "/gallery/dashboard-01-consultoria.png",
    sector: "Servicios profesionales · Consultoría",
    title: "Sistema de decisión distribuido",
    problem:
      "La fundadora era el motor y el cuello de botella al mismo tiempo. El negocio no podía crecer más rápido que ella.",
    solution:
      "Un sistema en Power BI sobre Google Sheets que externaliza el criterio de decisión: el equipo lee el estado del negocio sin depender de la directora. KPIs con lógica de decisión en DAX, seguridad por rol, y una capa de IA que detecta desviaciones y prioriza.",
    impact:
      "5 fugas de valor identificadas entre $6.3M y $18M COP mensuales. Inversión recuperada en menos de 2 semanas. No es un dashboard — es el criterio de decisión, distribuido al equipo.",
  },
  {
    image: "/gallery/dashboard-02-taller.png",
    sector: "Automotriz · Taller de servicio",
    title: "Control de ingresos en tiempo real",
    problem:
      "Los ingresos del taller se registraban tarde, mal, o se registraban dos veces. Cuando el dato llegaba, ya no servía para decidir — y nadie confiaba en los números del cierre.",
    solution:
      "Un formulario en Power Apps que blinda la captura en origen: el operario registra la venta con estructura y validación, sin espacio para el error. Ese dato limpio alimenta un tablero que muestra ventas, comisiones, formas de pago y cierre financiero al día.",
    impact:
      "El dato deja de ser un problema porque nace bien. No limpiamos errores al final — evitamos que ocurran en la entrada. Resultado: cierre financiero confiable el mismo día, no tres días después.",
  },
  {
    image: "/gallery/dashboard-03-spa.png",
    sector: "Bienestar · Salón de belleza (multi-sede)",
    title: "De la intuición a la decisión de expansión",
    problem:
      "Dos sedes, cero visibilidad consolidada. Las decisiones de capacidad, rentabilidad y expansión se tomaban por intuición — sin saber cuál sede rendía más ni por qué.",
    solution:
      "Un sistema que captura el dato en origen con Power Apps (citas, inventarios, bonos) y lo convierte en inteligencia operativa: comparación entre sedes, rentabilidad por servicio y por profesional, ticket promedio y tasa de servicios por visita.",
    impact:
      "El análisis reveló que una sede rendía 6% más por profesional — no por productividad, sino por capacidad instalada. La lectura sistémica produjo una decisión concreta: una silla adicional que se paga sola en el primer mes y proyecta $105M COP anuales. No entregamos un reporte de lo que pasó — entregamos el argumento para lo que sigue.",
  },
  {
    image: "/gallery/dashboard-04-inventarios.png",
    sector: "Aplicable a cualquier industria con inventario físico",
    title: "Ingeniería de inventarios con reabastecimiento inteligente",
    problem:
      "No sabían qué tenían, cuánto consumían ni cuándo pedir. Los agotados aparecían por sorpresa, el inventario ocioso comía capital, y cada pedido se hacía por intuición o por urgencia.",
    solution:
      "No es un tablero de inventarios — es un proceso de ingeniería aplicado: captura en origen con Power Apps, ratios de uso por producto y por sede, costo de inventario ocioso, y proyección de reabastecimiento con metodología EOQ. Power BI es la capa visible, pero el trabajo que garantiza que esa data sea confiable y estimable ocurrió antes.",
    impact:
      "138 productos que debían pedirse hoy, visibles antes de que faltaran. Pedidos calculados por consumo real, no por corazonada. Presupuestos de inventario basados en datos, no en Excel de la semana pasada.",
  },
  {
    image: "/gallery/dashboard-05-educacion.png",
    sector: "Educación · Escuela de negocios y tecnología",
    title: "Inteligencia de ventas omnicanal",
    problem:
      "Invertían en Google Ads, Meta y LinkedIn sin saber qué canal generaba el lead que realmente se matriculaba. Cada plataforma contaba su propia historia. Nadie tenía la historia completa.",
    solution:
      "Integración con APIs de tres plataformas de pauta digital hacia un CRM empresarial, orquestada con Power Automate, almacenada en SharePoint y actualizada diariamente en Power BI. Un solo reporte con CPL y CPA reales por canal, campaña y programa.",
    impact:
      "Por primera vez, el equipo de medios comparó costo por lead y costo por matrícula entre canales en un solo lugar. Dejaron de consolidar plataformas manualmente y empezaron a redistribuir presupuesto con criterio, no con intuición.",
  },
] as const;

// ─── estilos compartidos ─────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: 9,
  textTransform: "uppercase",
  letterSpacing: "1.5px",
  color: "#5D6B7A",
  margin: "0 0 6px",
};

// ─── variants de entrada de sección ──────────────────────────────────────────

const headerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4 } },
};

const descVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.1 } },
};

const thumbsContainerVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.5 } },
};

const thumbVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// ─── transición al cambiar de proyecto ───────────────────────────────────────

const swapVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

// ─── Thumbnail (subcomponente — cada uno con su propio hover state) ─────────

interface ThumbnailProps {
  project: (typeof PROJECTS)[number];
  index: number;
  isActive: boolean;
  onSelect: (index: number) => void;
  rm: boolean | null;
}

function Thumbnail({ project, index, isActive, onSelect, rm }: ThumbnailProps) {
  return (
    <motion.button
      type="button"
      variants={rm ? undefined : thumbVariants}
      onClick={() => onSelect(index)}
      aria-label={`Ver proyecto: ${project.title}`}
      aria-pressed={isActive}
      className="gallery-thumb"
      style={{
        position: "relative",
        aspectRatio: "16 / 9",
        border: `1px solid ${isActive ? "#4FD1E0" : "rgba(255,255,255,0.08)"}`,
        opacity: isActive ? 1 : 0.5,
        backgroundColor: "#141F2E",
        cursor: isActive ? "default" : "pointer",
        padding: 0,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <Image
        src={project.image}
        alt=""
        aria-hidden="true"
        fill
        sizes="(max-width: 768px) 140px, 200px"
        quality={85}
        loading="lazy"
        style={{ objectFit: "cover" }}
      />
    </motion.button>
  );
}

// ─── GallerySection ───────────────────────────────────────────────────────────

export default function GallerySection() {
  const rm = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const active = PROJECTS[activeIndex];

  return (
    <section
      id="galeria"
      className="relative w-full gallery-section"
      style={{
        background: "#1F2C3C",
      }}
    >
    <div
      className="mx-auto gallery-inner"
      style={{
        maxWidth: 1200,
        padding: "80px 48px",
      }}
    >
      {/* Header de sección */}
      <motion.div
        className="gallery-header"
        initial={rm ? undefined : "hidden"}
        whileInView={rm ? undefined : "show"}
        viewport={{ once: true, margin: "-80px" }}
        variants={rm ? undefined : headerVariants}
        style={{
          display: "grid",
          gridTemplateColumns: "0.9fr 1.1fr",
          gap: 48,
          marginBottom: 64,
        }}
      >
        <div>
          <p
            className="flex items-center"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "3px",
              color: "#4FD1E0",
              marginBottom: 16,
            }}
          >
            <span
              aria-hidden
              style={{
                display: "inline-block",
                width: 24,
                height: 1,
                backgroundColor: "#4FD1E0",
                marginRight: 12,
              }}
            />
            ALGUNOS PROYECTOS EJECUTADOS
          </p>
          <h2
            style={{
              fontFamily: "var(--font-sans)",
              fontWeight: 800,
              fontSize: "clamp(28px, 3.5vw, 42px)",
              lineHeight: 1.15,
              color: "#FFFFFF",
              margin: 0,
            }}
          >
            Resultados en diferentes industrias
          </h2>
        </div>

        <div style={{ alignSelf: "end" }}>
          <p style={{ fontSize: 16, color: "#5D6B7A", lineHeight: 1.7, margin: 0 }}>
            Cinco proyectos en cinco sectores. Un mismo principio: el
            dashboard es la superficie visible de un sistema de decisión
            construido desde el proceso.
          </p>
        </div>
      </motion.div>

      {/* Foco — texto + frame 3D del dashboard, protagonista */}
      <div
        className="gallery-focus"
        style={{
          display: "grid",
          gridTemplateColumns: "0.9fr 1.3fr",
          gap: 48,
          alignItems: "center",
          marginBottom: 32,
        }}
      >
        {/* Texto descriptivo */}
        <motion.div
          initial={rm ? undefined : "hidden"}
          whileInView={rm ? undefined : "show"}
          viewport={{ once: true, margin: "-80px" }}
          variants={rm ? undefined : descVariants}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={`meta-${activeIndex}`}
              initial={rm ? undefined : "initial"}
              animate={rm ? undefined : "animate"}
              exit={rm ? undefined : "exit"}
              variants={rm ? undefined : swapVariants}
            >
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                  color: "#4FD1E0",
                  margin: 0,
                }}
              >
                {active.sector}
              </p>
              <h3
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  fontSize: 20,
                  color: "#FFFFFF",
                  marginTop: 8,
                  marginBottom: 0,
                }}
              >
                {active.title}
              </h3>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={`body-${activeIndex}`}
              initial={rm ? undefined : "initial"}
              animate={rm ? undefined : "animate"}
              exit={rm ? undefined : "exit"}
              variants={rm ? undefined : swapVariants}
              style={{ marginTop: 20 }}
            >
              <div>
                <p style={labelStyle}>EL PROBLEMA</p>
                <p style={{ fontSize: 14, color: "#8B95A5", lineHeight: 1.6, margin: 0 }}>
                  {active.problem}
                </p>
              </div>
              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  paddingTop: 16,
                  marginTop: 16,
                }}
              >
                <p style={labelStyle}>LO QUE CONSTRUIMOS</p>
                <p style={{ fontSize: 14, color: "#8B95A5", lineHeight: 1.6, margin: 0 }}>
                  {active.solution}
                </p>
              </div>
              <div
                style={{
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  paddingTop: 16,
                  marginTop: 16,
                }}
              >
                <p style={{ ...labelStyle, color: "#F2921D" }}>EL IMPACTO</p>
                <p style={{ fontSize: 14, color: "#F2F6F9", lineHeight: 1.6, margin: 0 }}>
                  {resaltarCifras(active.impact)}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Frame 3D del dashboard */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`frame-${activeIndex}`}
            initial={rm ? undefined : "initial"}
            animate={rm ? undefined : "animate"}
            exit={rm ? undefined : "exit"}
            variants={rm ? undefined : swapVariants}
            className="gallery-focus-frame"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <ProjectFrame
              src={active.image}
              alt={`Dashboard de ${active.title} — ${active.sector}`}
              priority={activeIndex === 0}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Miniaturas */}
      <motion.div
        initial={rm ? undefined : "hidden"}
        whileInView={rm ? undefined : "show"}
        viewport={{ once: true, margin: "-80px" }}
        variants={rm ? undefined : thumbsContainerVariants}
        className="gallery-thumbs"
        style={{
          display: "flex",
          gap: 12,
        }}
      >
        {PROJECTS.map((project, i) => (
          <Thumbnail
            key={project.image}
            project={project}
            index={i}
            isActive={i === activeIndex}
            onSelect={setActiveIndex}
            rm={rm}
          />
        ))}
      </motion.div>

      <style>{`
        .gallery-thumb {
          outline: none;
          transition: opacity 0.2s ease, border-color 0.2s ease;
        }
        .gallery-thumb:hover {
          opacity: 0.8;
        }
        .gallery-thumb[aria-pressed="true"]:hover {
          opacity: 1;
        }
        .gallery-thumb:focus-visible {
          outline: 2px solid #4FD1E0;
          outline-offset: 2px;
        }
        .gallery-thumbs > .gallery-thumb {
          width: calc((100% - 48px) / 5);
        }
        @media (max-width: 960px) {
          .gallery-inner {
            padding: 56px 24px !important;
          }
          .gallery-header {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .gallery-focus {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .gallery-focus-frame {
            order: -1;
          }
        }
        @media (max-width: 768px) {
          .gallery-thumbs {
            overflow-x: auto !important;
            scroll-snap-type: x mandatory !important;
            gap: 8px !important;
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
          .gallery-thumbs::-webkit-scrollbar {
            display: none !important;
          }
          .gallery-thumbs > .gallery-thumb {
            width: auto !important;
            min-width: 140px !important;
            scroll-snap-align: start !important;
          }
        }
      `}</style>
    </div>
    </section>
  );
}
