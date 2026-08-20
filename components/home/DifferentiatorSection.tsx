"use client";

// ─── S3 · La Tesis: la Secuencia Invertida ────────────────────────────────────
// Dos cadenas enfrentadas: el orden del mercado (invertido) vs el orden
// correcto. Desktop: cadenas verticales con descripción; móvil: chips
// horizontales compactos para que la inversión se lea de un vistazo.

type Eslabon = {
  chip: string;   // etiqueta completa (desktop)
  corto: string;  // etiqueta corta (chips móviles)
  desc: string;
  hot?: boolean;  // cierre en naranja (Impacto financiero)
};

const SEC_MERCADO: Eslabon[] = [
  { chip: "Tecnología",  corto: "Tecnología", desc: "se instala primero" },
  { chip: "Dato",        corto: "Dato",       desc: "nace sin trazabilidad, del mismo desorden" },
  { chip: "Proceso",     corto: "Proceso",    desc: "nadie lo diseñó" },
  { chip: "¿Resultado?", corto: "¿?",         desc: "se espera, no se diseña" },
];

const SEC_YETI: Eslabon[] = [
  { chip: "Proceso sano",         corto: "Proceso",  desc: "diseñado para producir dato confiable" },
  { chip: "Dato confiable",       corto: "Dato",     desc: "con fuente única de verdad" },
  { chip: "Decisión inteligente", corto: "Decisión", desc: "automática o asistida — ya tiene sentido" },
  { chip: "Impacto financiero",   corto: "Impacto",  desc: "consecuencia, no esperanza", hot: true },
];

function chipStyle(tipo: "mercado" | "yeti", hot?: boolean): React.CSSProperties {
  if (hot) {
    return { background: "#F2921D", border: "1px solid #F2921D", color: "#0B1420", fontWeight: 700 };
  }
  return tipo === "mercado"
    ? { background: "rgba(242,146,29,0.06)", border: "1px solid rgba(242,146,29,0.3)", color: "#8B95A5" }
    : { background: "rgba(79,209,224,0.06)", border: "1px solid rgba(79,209,224,0.35)", color: "#F2F6F9" };
}

function CadenaCard({
  tipo, label, nombre, items, cierre,
}: {
  tipo: "mercado" | "yeti";
  label: string;
  nombre: string;
  items: Eslabon[];
  cierre: string;
}) {
  const acento = tipo === "mercado" ? "#F2921D" : "#4FD1E0";
  return (
    <div style={{
      background: "#141F2E",
      border: `1px solid ${tipo === "mercado" ? "rgba(242,146,29,0.25)" : "rgba(79,209,224,0.4)"}`,
      borderRadius: 14,
      padding: "clamp(16px, 4.5vw, 24px) clamp(13px, 3.8vw, 22px)",
      boxShadow: tipo === "yeti" ? "0 12px 40px rgba(0,0,0,0.4)" : undefined,
    }}>
      <p style={{
        fontFamily: "var(--font-geist-mono)", fontSize: 10, fontWeight: 700,
        color: acento, letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 8px",
      }}>
        {label}
      </p>
      <h3 style={{
        fontFamily: "var(--font-space-grotesk)", fontWeight: 700, fontSize: "clamp(18px,1.8vw,22px)",
        color: "#F2F6F9", margin: 0, lineHeight: 1.2,
      }}>
        {nombre}
      </h3>

      {/* Desktop: cadena vertical box ↓ box, descripción a la derecha */}
      <div className="hidden md:flex" style={{ flexDirection: "column", marginTop: 20 }}>
        {items.map((it, i) => (
          <div key={it.chip}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{
                ...chipStyle(tipo, it.hot),
                fontFamily: "var(--font-space-grotesk)", fontSize: 13, fontWeight: it.hot ? 700 : 600,
                padding: "7px 14px", borderRadius: 8, whiteSpace: "nowrap", flexShrink: 0,
              }}>
                {it.chip}
              </span>
              <span style={{
                fontFamily: "var(--font-geist-sans)", fontSize: 13, color: "#8B95A5", lineHeight: 1.5,
              }}>
                {it.desc}
              </span>
            </div>
            {i < items.length - 1 && (
              <div aria-hidden style={{
                fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "#5D6B7A",
                padding: "3px 0 3px 22px", lineHeight: 1,
              }}>
                ↓
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Móvil: chips horizontales compactos — la inversión se ve en dos filas */}
      <div className="flex md:hidden chip-row" style={{
        alignItems: "center", justifyContent: "space-between", marginTop: 16, width: "100%",
      }}>
        {items.map((it, i) => (
          <span key={it.corto} style={{ display: "flex", alignItems: "center", gap: 4, minWidth: 0 }}>
            <span style={{
              ...chipStyle(tipo, it.hot),
              fontFamily: "var(--font-space-grotesk)", fontSize: 10.5, fontWeight: it.hot ? 700 : 600,
              padding: "3px 7px", borderRadius: 7, whiteSpace: "nowrap",
            }}>
              {it.corto}
            </span>
            {i < items.length - 1 && (
              <span aria-hidden style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "#5D6B7A", paddingLeft: 2 }}>→</span>
            )}
          </span>
        ))}
      </div>

      <p style={{
        fontFamily: "var(--font-geist-mono)", fontSize: 11, color: acento,
        lineHeight: 1.65, margin: "18px 0 0",
      }}>
        {cierre}
      </p>
    </div>
  );
}

export default function DifferentiatorSection() {
  return (
    <section id="la-tesis" className="relative w-full" style={{ background: "#0B1420" }}>
      <div
        className="relative mx-auto px-6 md:px-12 lg:px-16 py-16"
        style={{ maxWidth: "1280px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Kicker */}
        <span className="block" style={{
          fontFamily: "var(--font-geist-mono)", fontSize: 11, color: "#5D6B7A",
          letterSpacing: "3px", textTransform: "uppercase", marginBottom: 16,
        }}>
          S3 · LA TESIS
        </span>

        <h2 style={{
          fontFamily: "var(--font-space-grotesk)", fontWeight: 700,
          fontSize: "clamp(26px,3vw,42px)", color: "#F2F6F9",
          lineHeight: 1.15, margin: "0 0 18px",
        }}>
          El problema no es la tecnología.<br />
          <span style={{ fontWeight: 300, color: "#4FD1E0" }}>Es el orden.</span>
        </h2>

        <p style={{
          fontFamily: "var(--font-geist-sans)", fontSize: 15.5, color: "#8B95A5",
          lineHeight: 1.65, maxWidth: 680, margin: 0,
        }}>
          La mayoría de los proyectos de tecnología en pymes fracasan por la misma razón:{" "}
          <span style={{ color: "#F2F6F9", fontWeight: 500 }}>se ejecutan en el orden invertido</span>.
          Se compra la herramienta primero, esperando que ella ordene la operación.
        </p>

        {/* Las dos secuencias enfrentadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8" style={{ marginTop: 40 }}>
          <CadenaCard
            tipo="mercado"
            label="◢ EL ORDEN DEL MERCADO"
            nombre="La secuencia invertida"
            items={SEC_MERCADO}
            cierre="Se monta inteligencia sobre un proceso que nadie diseñó. La herramienta no ordena la operación — hereda su desorden."
          />
          <CadenaCard
            tipo="yeti"
            label="◤ EL ORDEN CORRECTO"
            nombre="La secuencia Yeti BI"
            items={SEC_YETI}
            cierre="Primero el proceso, para que el dato nazca bien. Sobre ese dato, la decisión tiene sentido. El impacto llega solo."
          />
        </div>

        {/* Ley de Amplificación */}
        <div style={{
          marginTop: 32,
          background: "#141F2E",
          border: "1px solid #1C2836",
          borderLeft: "3px solid #F2921D",
          borderRadius: "0 14px 14px 0",
          padding: "26px 26px",
        }}>
          <p style={{
            fontFamily: "var(--font-geist-mono)", fontSize: 10, fontWeight: 700,
            color: "#F2921D", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 10px",
          }}>
            POR QUÉ EL ORDEN NO ES OPCIONAL
          </p>
          <h3 style={{
            fontFamily: "var(--font-space-grotesk)", fontWeight: 600,
            fontSize: "clamp(17px,1.9vw,23px)", color: "#F2F6F9",
            lineHeight: 1.3, margin: "0 0 12px",
          }}>
            La Ley de Amplificación: la tecnología no corrige lo que encuentra.{" "}
            <span style={{ color: "#F2921D" }}>Lo amplifica.</span>
          </h3>
          <p style={{
            fontFamily: "var(--font-geist-sans)", fontSize: 14.5, color: "#8B95A5",
            lineHeight: 1.7, margin: 0, maxWidth: 860,
          }}>
            Si el proceso es sólido, amplifica orden. Si arrastra variación sin control,
            amplifica esa variación — y el resultado es una{" "}
            <span style={{ color: "#F2F6F9", fontWeight: 500 }}>fuga de valor más rápida, más convincente y más cara de detectar</span>,
            porque ahora viene firmada por un sistema que parece objetivo.
          </p>
        </div>
      </div>
    </section>
  );
}
